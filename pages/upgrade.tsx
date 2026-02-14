"use client"

import { SignedIn, SignedOut, SignInButton, UserButton, PricingTable } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Upgrade() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <main className="min-h-screen">
      <div className="container">
        {/* Navigation */}
        <nav className="nav-bar">
          <div className="nav-content">
            <Link href="/" className="logo-container">
              <div className="logo-icon">⚡</div>
              <h1 className="logo-text">Vision<span className="logo-accent">AI</span></h1>
            </Link>
            
            <div className="nav-actions">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-ghost">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <Link href="/analyze">
                  <button className="btn-ghost">
                    Back to Analyzer
                  </button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-amber-400/50 hover:ring-amber-400 transition-all"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </nav>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="section-header">
            <h1 className="page-title">
              Choose Your <span className="title-gradient">Plan</span>
            </h1>
            <p className="page-subtitle">
              Unlock the full power of AI-driven image analysis
            </p>
          </div>

          {/* Manual Pricing Cards */}
          <div className="pricing-grid">
            {/* Free Tier */}
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-tier">Free</h3>
                <div className="pricing-price">
                  <span className="price-amount">$0</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">
                  Perfect for trying out our AI vision capabilities
                </p>
              </div>

              <ul className="pricing-features">
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>1 image analysis</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Basic AI analysis</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Detailed descriptions</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Up to 5MB images</span>
                </li>
                <li className="feature-item feature-disabled">
                  <span className="feature-check">×</span>
                  <span>Priority support</span>
                </li>
                <li className="feature-item feature-disabled">
                  <span className="feature-check">×</span>
                  <span>API access</span>
                </li>
              </ul>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="pricing-button pricing-button-free">
                    Get Started Free
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze">
                  <button className="pricing-button pricing-button-free">
                    Start Analyzing
                  </button>
                </Link>
              </SignedIn>
            </div>

            {/* Premium Tier */}
            <div className="pricing-card pricing-premium">
              <div className="pricing-badge">MOST POPULAR</div>
              
              <div className="pricing-header">
                <h3 className="pricing-tier">Premium</h3>
                <div className="pricing-price">
                  <span className="price-amount">$10</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">
                  For professionals who need unlimited analysis power
                </p>
              </div>

              <ul className="pricing-features">
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span><strong>Unlimited</strong> image analyses</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Advanced AI descriptions</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Detailed analysis reports</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Up to 5MB images</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>API access (coming soon)</span>
                </li>
              </ul>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="pricing-button pricing-button-premium">
                    Upgrade to Premium
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                {/* This is where Clerk's subscription flow would trigger */}
                <div className="clerk-pricing-container">
                  <PricingTable />
                </div>
              </SignedIn>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pricing-footer">
            <div className="footer-card">
              <div className="footer-icon">💳</div>
              <div className="footer-content">
                <h4 className="footer-title">Secure Payment</h4>
                <p className="footer-text">All transactions are secured with industry-standard encryption</p>
              </div>
            </div>
            
            <div className="footer-card">
              <div className="footer-icon">🔄</div>
              <div className="footer-content">
                <h4 className="footer-title">Cancel Anytime</h4>
                <p className="footer-text">No long-term contracts. Cancel your subscription whenever you want</p>
              </div>
            </div>
            
            <div className="footer-card">
              <div className="footer-icon">⚡</div>
              <div className="footer-content">
                <h4 className="footer-title">Instant Access</h4>
                <p className="footer-text">Start analyzing images immediately after upgrading</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .nav-bar { padding: var(--space-lg) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: var(--space-2xl); }
        .nav-content { display: flex; justify-content: space-between; align-items: center; }
        .logo-container { display: flex; align-items: center; gap: var(--space-sm); cursor: pointer; }
        .logo-icon { font-size: 2rem; animation: glow 3s ease-in-out infinite; }
        .logo-text { font-family: var(--font-display); font-size: 1.75rem; font-weight: 800; color: var(--color-pearl); }
        .logo-accent { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-actions { display: flex; align-items: center; gap: var(--space-md); }
        .btn-ghost { padding: 0.75rem 1.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: var(--radius-md); color: var(--color-pearl); font-weight: 600; transition: all var(--transition-base); }
        .btn-ghost:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.25); }
        
        .pricing-section { padding: var(--space-2xl) 0; }
        .section-header { text-align: center; margin-bottom: var(--space-2xl); }
        .page-title { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; margin-bottom: var(--space-md); }
        .title-gradient { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .page-subtitle { font-size: 1.25rem; color: var(--color-frost); max-width: 600px; margin: 0 auto; }
        
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); max-width: 900px; margin: 0 auto var(--space-2xl); }
        
        .pricing-card { padding: var(--space-xl); background: rgba(26, 26, 36, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xl); position: relative; transition: all var(--transition-base); }
        .pricing-card:hover { transform: translateY(-5px); border-color: rgba(255, 255, 255, 0.15); }
        
        .pricing-premium { background: rgba(245, 200, 66, 0.05); border-color: rgba(245, 200, 66, 0.3); transform: scale(1.02); }
        .pricing-premium:hover { border-color: rgba(245, 200, 66, 0.5); transform: scale(1.02) translateY(-5px); }
        
        .pricing-badge { position: absolute; top: -12px; right: 24px; padding: 0.4rem 1rem; background: var(--gradient-primary); color: var(--color-void); border-radius: 50px; font-size: 0.8rem; font-weight: 700; font-family: var(--font-mono); }
        
        .pricing-header { margin-bottom: var(--space-lg); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: var(--space-lg); }
        .pricing-tier { font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); }
        .pricing-price { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: var(--space-sm); }
        .price-amount { font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .price-period { font-size: 1.1rem; color: var(--color-ash); font-weight: 500; }
        .pricing-description { color: var(--color-frost); font-size: 0.95rem; }
        
        .pricing-features { list-style: none; margin-bottom: var(--space-lg); }
        .feature-item { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) 0; color: var(--color-pearl); }
        .feature-disabled { opacity: 0.4; }
        .feature-check { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(245, 200, 66, 0.1); border-radius: 50%; font-weight: 700; flex-shrink: 0; }
        
        .pricing-button { width: 100%; padding: 1rem; border-radius: var(--radius-md); font-weight: 700; font-size: 1rem; transition: all var(--transition-base); }
        .pricing-button-free { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: var(--color-pearl); }
        .pricing-button-free:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.25); }
        .pricing-button-premium { background: var(--gradient-primary); color: var(--color-void); box-shadow: 0 8px 30px rgba(245, 200, 66, 0.4); }
        .pricing-button-premium:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(245, 200, 66, 0.5); }
        
        .clerk-pricing-container { margin-top: var(--space-md); }
        
        .pricing-footer { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-lg); max-width: 1000px; margin: 0 auto; }
        .footer-card { display: flex; gap: var(--space-md); padding: var(--space-lg); background: rgba(26, 26, 36, 0.4); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-lg); }
        .footer-icon { font-size: 2.5rem; flex-shrink: 0; }
        .footer-content { flex: 1; }
        .footer-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .footer-text { color: var(--color-ash); font-size: 0.9rem; }
        
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-premium { transform: scale(1); }
          .pricing-premium:hover { transform: translateY(-5px); }
          .pricing-footer { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}