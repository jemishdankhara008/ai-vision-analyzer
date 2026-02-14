import os
import base64
from typing import Dict, Optional
from datetime import datetime
from fastapi import FastAPI, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from openai import OpenAI
from pydantic import BaseModel

app = FastAPI(
    title="AI Vision Analyzer API",
    description="Advanced AI-powered image analysis service",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clerk authentication setup
clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

# Import webhook handlers (must be after app creation)
try:
    from . import webhooks
except ImportError:
    # Webhooks module not found, skip
    pass

# In-memory storage (resets on deployment)
usage_tracker: Dict[str, int] = {}
analysis_history: Dict[str, list] = {}

# Configuration
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

class AnalysisResponse(BaseModel):
    success: bool
    description: str
    user_id: str
    tier: str
    analyses_used: int
    filename: str
    timestamp: str
    tags: list[str] = []

class UsageResponse(BaseModel):
    user_id: str
    tier: str
    analyses_used: int
    limit: str | int
    remaining: str | int
    history_count: int

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str


def get_file_extension(filename: str) -> str:
    """Extract file extension from filename"""
    return os.path.splitext(filename)[1].lower()


def is_premium_user(creds: HTTPAuthorizationCredentials) -> bool:
    """
    Check if user has premium subscription from Clerk Billing
    Works with the 'premium_subscription' plan created in Clerk Dashboard
    """
    user_data = creds.decoded
    
    # Method 1: Check for active Clerk Billing subscription
    # When user subscribes via Clerk Billing, check org_role or permissions
    org_role = user_data.get("org_role", "")
    if "premium" in org_role.lower():
        return True
    
    # Method 2: Check authorization claims for subscription
    # Clerk Billing may set this when user has active subscription
    if user_data.get("premium_subscription"):
        return True
    
    # Method 3: Check public_metadata (for manual testing)
    public_metadata = user_data.get("public_metadata", {})
    if public_metadata.get("subscription") == "premium":
        return True
    if public_metadata.get("tier") == "premium":
        return True
    
    # Method 4: Check if user has the specific plan in their claims
    # Clerk may include plan information in different fields
    user_claims = user_data.get("user_claims", {})
    if user_claims.get("plan") == "premium_subscription":
        return True
    
    # Method 5: Check organization membership with premium plan
    org_memberships = user_data.get("org_memberships", [])
    for org in org_memberships:
        if org.get("plan") == "premium_subscription":
            return True
    
    # Default to free tier
    return False


def check_and_increment_usage(user_id: str, is_premium: bool) -> bool:
    """
    Check if user can make another analysis request
    Returns True if allowed, False if limit exceeded
    """
    if is_premium:
        return True  # Unlimited for premium users
    
    current_usage = usage_tracker.get(user_id, 0)
    if current_usage >= 1:  # Free tier limit is 1
        return False
    
    usage_tracker[user_id] = current_usage + 1
    return True


def extract_tags(description: str) -> list[str]:
    """Extract key concepts from AI description for tagging"""
    common_tags = [
        'person', 'people', 'landscape', 'nature', 'urban', 'animal',
        'food', 'architecture', 'art', 'technology', 'indoor', 'outdoor',
        'portrait', 'vehicle', 'building', 'sky', 'water', 'plant'
    ]
    
    description_lower = description.lower()
    found_tags = [tag for tag in common_tags if tag in description_lower]
    return found_tags[:5]  # Limit to 5 tags


@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """
    Health check endpoint
    Returns service status and metadata
    """
    return {
        "status": "healthy",
        "service": "AI Vision Analyzer",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/usage", response_model=UsageResponse)
def check_usage(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    """
    Get user's current usage and tier information
    Includes analysis history count
    """
    user_id = creds.decoded["sub"]
    is_premium = is_premium_user(creds)
    
    tier = "premium" if is_premium else "free"
    analyses_used = usage_tracker.get(user_id, 0)
    limit = "unlimited" if is_premium else 1
    history_count = len(analysis_history.get(user_id, []))
    
    remaining = "unlimited" if is_premium else max(0, 1 - analyses_used)
    
    return {
        "user_id": user_id,
        "tier": tier,
        "analyses_used": analyses_used,
        "limit": limit,
        "remaining": remaining,
        "history_count": history_count
    }


@app.post("/api/analyze")
async def analyze_image(
    file: UploadFile,
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard)
):
    """
    Analyze an uploaded image using OpenAI Vision API
    
    Features:
    - File validation (type and size)
    - JWT authentication
    - Usage limit enforcement
    - AI-powered image analysis
    - Automatic tagging
    - Analysis history tracking
    """
    try:
        # Get user information
        user_id = creds.decoded["sub"]
        is_premium = is_premium_user(creds)
        
        # Check usage limits
        if not check_and_increment_usage(user_id, is_premium):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Usage limit exceeded",
                    "message": "You've reached your free tier limit. Upgrade to Premium for unlimited analyses.",
                    "tier": "free",
                    "limit": 1
                }
            )
        
        # Validate file extension
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided"
            )
            
        file_ext = get_file_extension(file.filename)
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "Invalid file type",
                    "message": f"Only {', '.join(ALLOWED_EXTENSIONS)} files are supported",
                    "received": file_ext
                }
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        file_size = len(content)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "error": "File too large",
                    "message": f"Maximum file size is {MAX_FILE_SIZE / (1024*1024):.1f}MB",
                    "received_size": f"{file_size / (1024*1024):.2f}MB"
                }
            )
        
        # Convert to base64
        image_data = base64.b64encode(content).decode('utf-8')
        
        # Determine MIME type for data URL
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp'
        }
        mime_type = mime_types.get(file_ext, 'image/jpeg')
        
        # Call OpenAI Vision API
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe this image in detail, including objects, colors, mood, and any notable features. Be specific and thorough."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        description = response.choices[0].message.content or "No description available"
        
        # Extract tags from description
        tags = extract_tags(description)
        
        # Store in history
        timestamp = datetime.utcnow().isoformat()
        if user_id not in analysis_history:
            analysis_history[user_id] = []
        
        analysis_history[user_id].append({
            "filename": file.filename,
            "timestamp": timestamp,
            "description": description,
            "tags": tags
        })
        
        # Keep only last 10 analyses in memory
        if len(analysis_history[user_id]) > 10:
            analysis_history[user_id] = analysis_history[user_id][-10:]
        
        return {
            "success": True,
            "description": description,
            "user_id": user_id,
            "tier": "premium" if is_premium else "free",
            "analyses_used": usage_tracker.get(user_id, 0),
            "filename": file.filename,
            "timestamp": timestamp,
            "tags": tags
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Analysis failed",
                "message": str(e)
            }
        )


@app.get("/api/history")
def get_history(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    """
    Get user's analysis history
    Returns last 10 analyses
    """
    user_id = creds.decoded["sub"]
    history = analysis_history.get(user_id, [])
    
    return {
        "success": True,
        "user_id": user_id,
        "count": len(history),
        "history": history
    }