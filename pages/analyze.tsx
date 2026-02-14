"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface AnalysisResult {
  success: boolean;
  description: string;
  user_id: string;
  tier: string;
  analyses_used: number;
  filename: string;
  timestamp: string;
  tags?: string[];
}

interface UsageData {
  user_id: string;
  tier: string;
  analyses_used: number;
  limit: string | number;
  remaining: string | number;
  history_count: number;
}

interface ErrorDetail {
  message?: string;
  error?: string;
}

export default function Analyze() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsage = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/usage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: UsageData = await response.json();
      setUsage(data);
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    } else if (isSignedIn) {
      fetchUsage();
    }
  }, [isSignedIn, isLoaded, router, fetchUsage]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);
    setUploadProgress(0);

    try {
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data: AnalysisResult | ErrorDetail = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorDetail;
        throw new Error(errorData.message || errorData.error || 'Analysis failed');
      }

      setResult(data as AnalysisResult);
      await fetchUsage();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(errorMessage);
    } finally {
      setAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const clearAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpgradeClick = () => {
    // Redirect to our custom upgrade page with instructions
    window.location.href = '/upgrade';
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const canAnalyze = usage && (usage.tier === 'premium' || usage.remaining !== 0);

  return (
    <main className="analyzer-page">
      <header className="analyzer-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="back-link">
              <span className="back-arrow">←</span>
              <span>Home</span>
            </Link>
            
            <div className="header-center">
              <div className="logo-icon">⚡</div>
              <h1 className="header-title">Vision Analyzer</h1>
            </div>
            
            <div className="header-actions">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-amber-400/50 hover:ring-amber-400 transition-all"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="analyzer-layout">
          <aside className="sidebar">
            {usage && (
              <div className="usage-card">
                <h3 className="usage-title">Your Plan</h3>
                <div className={`tier-badge tier-badge-${usage.tier}`}>
                  {usage.tier === 'premium' ? '⭐ Premium' : '🎯 Free'}
                </div>
                
                <div className="usage-stats">
                  <div className="stat-row">
                    <span className="stat-label">Analyses Used</span>
                    <span className="stat-value">
                      {usage.analyses_used} / {usage.limit === 'unlimited' ? '∞' : usage.limit}
                    </span>
                  </div>
                  
                  {usage.tier === 'free' && (
                    <div className="usage-bar">
                      <div 
                        className="usage-fill"
                        style={{ width: `${(usage.analyses_used / 1) * 100}%` }}
                      />
                    </div>
                  )}
                  
                  {usage.tier === 'free' && usage.remaining === 0 && (
                    <div className="upgrade-prompt">
                      <p className="upgrade-text">Out of analyses!</p>
                      <button 
                        className="upgrade-button"
                        onClick={handleUpgradeClick}
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  )}
                </div>

                {usage.history_count > 0 && (
                  <div className="history-info">
                    <span className="history-icon">📊</span>
                    <span>{usage.history_count} analyses in history</span>
                  </div>
                )}
              </div>
            )}

            <div className="features-list">
              <h4 className="features-title">Capabilities</h4>
              <ul className="features-items">
                <li className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Object Detection</span>
                </li>
                <li className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <span>Color Analysis</span>
                </li>
                <li className="feature-item">
                  <span className="feature-icon">💭</span>
                  <span>Mood Recognition</span>
                </li>
                <li className="feature-item">
                  <span className="feature-icon">📐</span>
                  <span>Composition Study</span>
                </li>
              </ul>
            </div>
          </aside>

          <div className="main-content">
            <section className="upload-section">
              <h2 className="section-title">Upload Image</h2>
              
              <div 
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${previewUrl ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                    <button 
                      className="clear-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAnalysis();
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📁</div>
                    <p className="upload-title">Drop your image here</p>
                    <p className="upload-subtitle">or click to browse</p>
                    <p className="upload-formats">JPG, PNG, WEBP • Max 5MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileSelect}
                  className="file-input"
                />
              </div>

              {selectedFile && (
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzing || !canAnalyze}
                className="analyze-button"
              >
                {analyzing ? (
                  <>
                    <span className="spinner"></span>
                    <span>Analyzing...</span>
                  </>
                ) : !canAnalyze ? (
                  <>
                    <span>🔒</span>
                    <span>Upgrade Required</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Analyze Image</span>
                  </>
                )}
              </button>
            </section>

            {error && (
              <div className="error-card">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <h4 className="error-title">Analysis Failed</h4>
                  <p className="error-message">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <section className="results-section">
                <div className="results-header">
                  <h2 className="section-title">Analysis Results</h2>
                  <div className="results-meta">
                    <span className="meta-item">
                      📅 {new Date(result.timestamp).toLocaleString()}
                    </span>
                    <span className="meta-item">
                      📁 {result.filename}
                    </span>
                  </div>
                </div>

                {result.tags && result.tags.length > 0 && (
                  <div className="tags-container">
                    {result.tags.map((tag, index) => (
                      <span key={index} className="result-tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="description-card">
                  <div className="description-icon">🔍</div>
                  <p className="description-text">{result.description}</p>
                </div>

                <button 
                  className="new-analysis-button"
                  onClick={clearAnalysis}
                >
                  Analyze Another Image
                </button>
              </section>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .analyzer-page { min-height: 100vh; padding-bottom: var(--space-2xl); }
        .analyzer-header { padding: var(--space-lg) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: var(--space-xl); }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--color-frost); font-weight: 600; transition: all var(--transition-base); padding: 0.5rem 1rem; border-radius: var(--radius-sm); }
        .back-link:hover { color: var(--color-pearl); background: rgba(255, 255, 255, 0.05); }
        .back-arrow { transition: transform var(--transition-base); }
        .back-link:hover .back-arrow { transform: translateX(-4px); }
        .header-center { display: flex; align-items: center; gap: var(--space-sm); }
        .logo-icon { font-size: 2rem; animation: glow 3s ease-in-out infinite; }
        .header-title { font-family: var(--font-display); font-size: 1.75rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .analyzer-layout { display: grid; grid-template-columns: 300px 1fr; gap: var(--space-xl); }
        .sidebar { display: flex; flex-direction: column; gap: var(--space-lg); }
        .usage-card { padding: var(--space-lg); background: rgba(26, 26, 36, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); }
        .usage-title { font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-sm); }
        .tier-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 50px; font-weight: 700; font-size: 0.9rem; margin-bottom: var(--space-md); }
        .tier-badge-free { background: rgba(78, 205, 196, 0.1); border: 1px solid rgba(78, 205, 196, 0.3); color: var(--color-cyan); }
        .tier-badge-premium { background: rgba(245, 200, 66, 0.1); border: 1px solid rgba(245, 200, 66, 0.3); color: var(--color-amber); }
        .usage-stats { display: flex; flex-direction: column; gap: var(--space-sm); }
        .stat-row { display: flex; justify-content: space-between; align-items: center; }
        .stat-label { color: var(--color-ash); font-size: 0.9rem; }
        .stat-value { font-weight: 700; font-family: var(--font-mono); color: var(--color-pearl); }
        .usage-bar { height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 50px; overflow: hidden; margin-top: var(--space-sm); }
        .usage-fill { height: 100%; background: var(--gradient-primary); transition: width var(--transition-base); }
        .upgrade-prompt { margin-top: var(--space-md); padding: var(--space-md); background: rgba(245, 200, 66, 0.1); border: 1px solid rgba(245, 200, 66, 0.3); border-radius: var(--radius-md); }
        .upgrade-text { font-weight: 600; color: var(--color-amber); margin-bottom: var(--space-sm); }
        .upgrade-button { width: 100%; padding: 0.75rem; background: var(--gradient-primary); color: var(--color-void); border-radius: var(--radius-sm); font-weight: 700; font-size: 0.9rem; transition: all var(--transition-base); }
        .upgrade-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(245, 200, 66, 0.4); }
        .history-info { display: flex; align-items: center; gap: 0.5rem; margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid rgba(255, 255, 255, 0.08); color: var(--color-ash); font-size: 0.9rem; }
        .history-icon { font-size: 1.2rem; }
        .features-list { padding: var(--space-lg); background: rgba(26, 26, 36, 0.4); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-lg); }
        .features-title { font-size: 1rem; font-weight: 700; margin-bottom: var(--space-md); color: var(--color-frost); }
        .features-items { list-style: none; display: flex; flex-direction: column; gap: var(--space-sm); }
        .feature-item { display: flex; align-items: center; gap: var(--space-sm); color: var(--color-ash); font-size: 0.9rem; }
        .feature-icon { font-size: 1.2rem; }
        .main-content { display: flex; flex-direction: column; gap: var(--space-xl); }
        .section-title { font-size: 1.75rem; font-weight: 800; margin-bottom: var(--space-md); }
        .upload-section { padding: var(--space-xl); background: rgba(26, 26, 36, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); }
        .upload-zone { border: 2px dashed rgba(255, 255, 255, 0.2); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center; transition: all var(--transition-base); cursor: pointer; min-height: 300px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.02); }
        .upload-zone:hover { border-color: rgba(245, 200, 66, 0.5); background: rgba(245, 200, 66, 0.05); }
        .upload-zone.dragging { border-color: var(--color-amber); background: rgba(245, 200, 66, 0.1); transform: scale(1.02); }
        .upload-zone.has-image { padding: 0; border: none; background: transparent; }
        .preview-container { position: relative; width: 100%; max-width: 600px; }
        .preview-image { width: 100%; height: auto; max-height: 500px; object-fit: contain; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); }
        .clear-button { position: absolute; top: 1rem; right: 1rem; width: 40px; height: 40px; background: rgba(232, 69, 69, 0.9); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; font-weight: 700; transition: all var(--transition-base); }
        .clear-button:hover { background: rgba(232, 69, 69, 1); transform: scale(1.1); }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); }
        .upload-icon { font-size: 4rem; margin-bottom: var(--space-sm); animation: float 3s ease-in-out infinite; }
        .upload-title { font-size: 1.25rem; font-weight: 700; color: var(--color-pearl); }
        .upload-subtitle { color: var(--color-frost); }
        .upload-formats { color: var(--color-ash); font-size: 0.9rem; font-family: var(--font-mono); margin-top: var(--space-sm); }
        .file-input { display: none; }
        .file-info { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-md); background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md); margin-top: var(--space-md); }
        .file-icon { font-size: 1.5rem; }
        .file-name { flex: 1; font-weight: 600; color: var(--color-pearl); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .file-size { color: var(--color-ash); font-family: var(--font-mono); font-size: 0.9rem; }
        .progress-bar { height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 50px; overflow: hidden; margin-top: var(--space-md); }
        .progress-fill { height: 100%; background: var(--gradient-primary); transition: width 0.3s ease-out; }
        .analyze-button { width: 100%; padding: 1.25rem; background: var(--gradient-primary); color: var(--color-void); border-radius: var(--radius-md); font-weight: 700; font-size: 1.1rem; margin-top: var(--space-lg); display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all var(--transition-base); box-shadow: 0 8px 30px rgba(245, 200, 66, 0.4); }
        .analyze-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(245, 200, 66, 0.5); }
        .analyze-button:disabled { background: rgba(255, 255, 255, 0.1); color: var(--color-ash); box-shadow: none; }
        .spinner { width: 20px; height: 20px; border: 3px solid rgba(0, 0, 0, 0.2); border-top-color: var(--color-void); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-card { display: flex; gap: var(--space-md); padding: var(--space-lg); background: rgba(232, 69, 69, 0.1); border: 1px solid rgba(232, 69, 69, 0.3); border-radius: var(--radius-lg); }
        .error-icon { font-size: 2rem; }
        .error-content { flex: 1; }
        .error-title { font-weight: 700; color: var(--color-crimson); margin-bottom: 0.25rem; }
        .error-message { color: var(--color-pearl); }
        .results-section { padding: var(--space-xl); background: rgba(26, 26, 36, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(245, 200, 66, 0.2); border-radius: var(--radius-lg); animation: fadeIn 0.5s ease-out; }
        .results-header { margin-bottom: var(--space-lg); }
        .results-meta { display: flex; gap: var(--space-md); margin-top: var(--space-sm); flex-wrap: wrap; }
        .meta-item { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--color-ash); font-size: 0.9rem; font-family: var(--font-mono); }
        .tags-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: var(--space-lg); }
        .result-tag { padding: 0.4rem 1rem; background: rgba(245, 200, 66, 0.1); border: 1px solid rgba(245, 200, 66, 0.3); border-radius: 50px; color: var(--color-amber); font-size: 0.85rem; font-weight: 600; font-family: var(--font-mono); }
        .description-card { display: flex; gap: var(--space-md); padding: var(--space-lg); background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md); margin-bottom: var(--space-lg); }
        .description-icon { font-size: 2rem; flex-shrink: 0; }
        .description-text { color: var(--color-pearl); line-height: 1.8; font-size: 1.05rem; }
        .new-analysis-button { width: 100%; padding: 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: var(--color-pearl); border-radius: var(--radius-md); font-weight: 600; transition: all var(--transition-base); }
        .new-analysis-button:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.25); }
        @media (max-width: 1024px) {
          .analyzer-layout { grid-template-columns: 1fr; }
          .sidebar { order: 2; }
          .main-content { order: 1; }
        }
        @media (max-width: 768px) {
          .header-content { gap: var(--space-sm); }
          .header-center { display: none; }
          .upload-zone { min-height: 250px; }
          .section-title { font-size: 1.5rem; }
        }
      `}</style>
    </main>
  );
}