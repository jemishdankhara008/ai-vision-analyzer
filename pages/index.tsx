"use client"

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleUpgradeClick = () => {
    // Redirect to our custom upgrade page with instructions
    window.location.href = '/upgrade';
  };

  return (
    <main className="min-h-screen relative">
      {/* Animated Background Orbs */}
      <div 
        className="orb orb-1"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />
      <div 
        className="orb orb-2"
        style={{
          transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`
        }}
      />
      <div 
        className="orb orb-3"
        style={{
          transform: `translate(${mousePosition.x * 0.04}px, ${mousePosition.y * -0.02}px)`
        }}
      />

      <div className="container">
        {/* Navigation */}
        <nav className="nav-bar">
          <div className="nav-content">
            <div className="logo-container">
              <div className="logo-icon">⚡</div>
              <h1 className="logo-text">Vision<span className="logo-accent">AI</span></h1>
            </div>
            
            <div className="nav-actions">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-ghost">
                    Sign In
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="btn-primary">
                    Get Started
                    <span className="btn-arrow">→</span>
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <Link href="/analyze">
                  <button className="btn-primary">
                    Launch App
                    <span className="btn-arrow">→</span>
                  </button>
                </Link>
                <div className="user-button-wrapper">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 ring-2 ring-amber-400/50 hover:ring-amber-400 transition-all"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">Powered by GPT-4 Vision</span>
          </div>
          
          <h1 className="hero-title">
            See Beyond
            <br />
            <span className="title-gradient">What Meets the Eye</span>
          </h1>
          
          <p className="hero-subtitle">
            Advanced AI-powered image analysis that transforms pixels into insights.
            <br />
            Discover details, understand context, and unlock the stories within every image.
          </p>
          
          <div className="hero-cta">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cta-primary">
                  <span className="cta-text">Start Analyzing</span>
                  <span className="cta-icon">✨</span>
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Link href="/analyze">
                <button className="cta-primary">
                  <span className="cta-text">Open Analyzer</span>
                  <span className="cta-icon">✨</span>
                </button>
              </Link>
            </SignedIn>
            
            <button className="cta-secondary">
              <span>Learn More</span>
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">300+</div>
              <div className="stat-label">Tokens per Analysis</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">&lt;2s</div>
              <div className="stat-label">Average Response</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Capabilities That Matter</h2>
            <p className="section-subtitle">
              Production-grade AI vision that understands your images deeply
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card feature-card-1">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Precision Analysis</h3>
              <p className="feature-description">
                Identifies objects, colors, textures, and composition with remarkable accuracy. Every detail matters.
              </p>
              <div className="feature-tags">
                <span className="tag">Object Detection</span>
                <span className="tag">Color Theory</span>
                <span className="tag">Composition</span>
              </div>
            </div>

            <div className="feature-card feature-card-2">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">Context Understanding</h3>
              <p className="feature-description">
                Goes beyond pixels to understand mood, atmosphere, and narrative. Sees the story in every frame.
              </p>
              <div className="feature-tags">
                <span className="tag">Mood Detection</span>
                <span className="tag">Scene Context</span>
                <span className="tag">Storytelling</span>
              </div>
            </div>

            <div className="feature-card feature-card-3">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Serverless architecture ensures instant responses. No waiting, no queues, just results.
              </p>
              <div className="feature-tags">
                <span className="tag">Edge Computing</span>
                <span className="tag">Zero Latency</span>
                <span className="tag">Auto-scaling</span>
              </div>
            </div>

            <div className="feature-card feature-card-4">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Privacy First</h3>
              <p className="feature-description">
                Your images are never stored or shared. Processed securely and discarded immediately.
              </p>
              <div className="feature-tags">
                <span className="tag">End-to-End</span>
                <span className="tag">No Storage</span>
                <span className="tag">Compliant</span>
              </div>
            </div>

            <div className="feature-card feature-card-5">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Detailed Insights</h3>
              <p className="feature-description">
                Comprehensive descriptions with automatic tagging and categorization for easy reference.
              </p>
              <div className="feature-tags">
                <span className="tag">Auto-tagging</span>
                <span className="tag">Categories</span>
                <span className="tag">Metadata</span>
              </div>
            </div>

            <div className="feature-card feature-card-6">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Format Flexible</h3>
              <p className="feature-description">
                Supports JPG, PNG, WEBP up to 5MB. Optimized for quality and compatibility.
              </p>
              <div className="feature-tags">
                <span className="tag">Universal</span>
                <span className="tag">High-res</span>
                <span className="tag">Optimized</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="pricing-grid">
            {/* Free Tier */}
            <div className="pricing-card pricing-free">
              <div className="pricing-header">
                <h3 className="pricing-tier">Free</h3>
                <div className="pricing-price">
                  <span className="price-amount">$0</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">Perfect for trying out the platform</p>
              </div>
              
              <ul className="pricing-features">
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>1 image analysis</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Full AI descriptions</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>All image formats</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Up to 5MB files</span>
                </li>
                <li className="feature-item feature-disabled">
                  <span className="feature-check">✗</span>
                  <span>Analysis history</span>
                </li>
              </ul>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="pricing-button pricing-button-free">
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze">
                  <button className="pricing-button pricing-button-free">
                    Go to App
                  </button>
                </Link>
              </SignedIn>
            </div>

            {/* Premium Tier */}
            <div className="pricing-card pricing-premium">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-tier">Premium</h3>
                <div className="pricing-price">
                  <span className="price-amount">$5</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">For power users and professionals</p>
              </div>
              
              <ul className="pricing-features">
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span><strong>Unlimited</strong> analyses</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Enhanced AI descriptions</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>All image formats</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Up to 5MB files</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Analysis history</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <SignedIn>
                <button 
                  className="pricing-button pricing-button-premium"
                  onClick={handleUpgradeClick}
                >
                  Manage Subscription
                </button>
              </SignedIn>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="pricing-button pricing-button-premium">
                    Upgrade to Premium
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">⚡</div>
                <span>VisionAI</span>
              </div>
              <p className="footer-tagline">See beyond what meets the eye</p>
            </div>
            
            <div className="footer-copyright">
              <p>© 2026 VisionAI. Built with Claude by Anthropic.</p>
              <p className="footer-project">AIE1018 - Applied Activity 01</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        /* Animated Background Orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
          transition: transform 0.3s ease-out;
        }
        
        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(245, 200, 66, 0.4), transparent);
          top: -10%;
          right: -5%;
          animation: float 20s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(232, 69, 69, 0.3), transparent);
          bottom: -15%;
          left: -10%;
          animation: float 25s ease-in-out infinite 5s;
        }
        
        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(78, 205, 196, 0.35), transparent);
          top: 40%;
          left: 50%;
          animation: float 18s ease-in-out infinite 2s;
        }

        /* Navigation */
        .nav-bar {
          padding: var(--space-lg) 0;
          animation: fadeInDown 0.6s ease-out;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .logo-icon {
          font-size: 2rem;
          animation: glow 3s ease-in-out infinite;
        }
        
        .logo-text {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .logo-accent {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        
        .user-button-wrapper {
          display: flex;
          align-items: center;
        }
        
        /* Buttons */
        .btn-ghost {
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: var(--color-pearl);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          transition: all var(--transition-base);
        }
        
        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .btn-primary {
          padding: 0.75rem 1.75rem;
          background: var(--gradient-primary);
          color: var(--color-void);
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-base);
          box-shadow: 0 4px 20px rgba(245, 200, 66, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(245, 200, 66, 0.4);
        }
        
        .btn-arrow {
          transition: transform var(--transition-base);
        }
        
        .btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Hero Section */
        .hero-section {
          text-align: center;
          padding: var(--space-2xl) 0;
          max-width: 900px;
          margin: 0 auto;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(245, 200, 66, 0.1);
          border: 1px solid rgba(245, 200, 66, 0.3);
          border-radius: 50px;
          margin-bottom: var(--space-lg);
          animation: fadeIn 0.8s ease-out 0.4s both;
        }
        
        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--color-amber);
          border-radius: 50%;
          animation: glow 2s ease-in-out infinite;
        }
        
        .badge-text {
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-mono);
          color: var(--color-amber);
        }
        
        .hero-title {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: var(--space-md);
          animation: fadeIn 0.8s ease-out 0.5s both;
        }
        
        .title-gradient {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
        
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
          color: var(--color-frost);
          margin-bottom: var(--space-xl);
          animation: fadeIn 0.8s ease-out 0.6s both;
        }
        
        .hero-cta {
          display: flex;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-2xl);
          animation: fadeIn 0.8s ease-out 0.7s both;
          flex-wrap: wrap;
        }
        
        .cta-primary {
          padding: 1.25rem 2.5rem;
          background: var(--gradient-primary);
          color: var(--color-void);
          border-radius: var(--radius-lg);
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all var(--transition-base);
          box-shadow: 0 8px 30px rgba(245, 200, 66, 0.4);
        }
        
        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(245, 200, 66, 0.5);
        }
        
        .cta-icon {
          font-size: 1.3rem;
          animation: float 2s ease-in-out infinite;
        }
        
        .cta-secondary {
          padding: 1.25rem 2.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--color-pearl);
          border-radius: var(--radius-lg);
          font-weight: 600;
          font-size: 1.1rem;
          transition: all var(--transition-base);
        }
        
        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-lg);
          animation: fadeIn 0.8s ease-out 0.8s both;
        }
        
        .stat-card {
          padding: var(--space-lg);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }
        
        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .stat-number {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--color-ash);
          font-weight: 500;
        }

        /* Features Section */
        .features-section {
          padding: var(--space-2xl) 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }
        
        .section-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          margin-bottom: var(--space-sm);
        }
        
        .section-subtitle {
          font-size: 1.1rem;
          color: var(--color-frost);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-lg);
        }
        
        .feature-card {
          padding: var(--space-xl);
          background: rgba(26, 26, 36, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .feature-card-1:hover { border-color: rgba(245, 200, 66, 0.5); }
        .feature-card-2:hover { border-color: rgba(78, 205, 196, 0.5); }
        .feature-card-3:hover { border-color: rgba(232, 69, 69, 0.5); }
        .feature-card-4:hover { border-color: rgba(155, 89, 182, 0.5); }
        .feature-card-5:hover { border-color: rgba(245, 200, 66, 0.5); }
        .feature-card-6:hover { border-color: rgba(78, 205, 196, 0.5); }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
        
        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }
        
        .feature-description {
          color: var(--color-frost);
          line-height: 1.7;
          margin-bottom: var(--space-md);
        }
        
        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .tag {
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: var(--font-mono);
          color: var(--color-ash);
        }

        /* Pricing Section */
        .pricing-section {
          padding: var(--space-2xl) 0;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-xl);
          max-width: 900px;
          margin: 0 auto;
        }
        
        .pricing-card {
          padding: var(--space-xl);
          background: rgba(26, 26, 36, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          position: relative;
          transition: all var(--transition-base);
        }
        
        .pricing-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.15);
        }
        
        .pricing-premium {
          background: rgba(245, 200, 66, 0.05);
          border-color: rgba(245, 200, 66, 0.3);
          transform: scale(1.02);
        }
        
        .pricing-premium:hover {
          border-color: rgba(245, 200, 66, 0.5);
          transform: scale(1.02) translateY(-5px);
        }
        
        .pricing-badge {
          position: absolute;
          top: -12px;
          right: 24px;
          padding: 0.4rem 1rem;
          background: var(--gradient-primary);
          color: var(--color-void);
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }
        
        .pricing-header {
          margin-bottom: var(--space-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: var(--space-lg);
        }
        
        .pricing-tier {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }
        
        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: var(--space-sm);
        }
        
        .price-amount {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .price-period {
          font-size: 1.1rem;
          color: var(--color-ash);
          font-weight: 500;
        }
        
        .pricing-description {
          color: var(--color-frost);
          font-size: 0.95rem;
        }
        
        .pricing-features {
          list-style: none;
          margin-bottom: var(--space-lg);
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) 0;
          color: var(--color-pearl);
        }
        
        .feature-disabled {
          opacity: 0.4;
        }
        
        .feature-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(245, 200, 66, 0.1);
          border-radius: 50%;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .pricing-button {
          width: 100%;
          padding: 1rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 1rem;
          transition: all var(--transition-base);
        }
        
        .pricing-button-free {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--color-pearl);
        }
        
        .pricing-button-free:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }
        
        .pricing-button-premium {
          background: var(--gradient-primary);
          color: var(--color-void);
          box-shadow: 0 8px 30px rgba(245, 200, 66, 0.4);
        }
        
        .pricing-button-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(245, 200, 66, 0.5);
        }

        /* Footer */
        .footer {
          margin-top: var(--space-2xl);
          padding: var(--space-xl) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-lg);
        }
        
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
        }
        
        .footer-tagline {
          color: var(--color-ash);
          font-size: 0.9rem;
        }
        
        .footer-copyright {
          text-align: right;
          color: var(--color-ash);
          font-size: 0.85rem;
        }
        
        .footer-project {
          font-family: var(--font-mono);
          margin-top: 0.25rem;
          color: var(--color-amber);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-content {
            flex-direction: column;
            gap: var(--space-md);
          }
          
          .hero-cta {
            flex-direction: column;
          }
          
          .cta-primary, .cta-secondary {
            width: 100%;
            justify-content: center;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-copyright {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}