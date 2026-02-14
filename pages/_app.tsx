import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AI Vision Analyzer - Advanced Image Analysis</title>
        <meta name="description" content="AI-powered image analysis with detailed descriptions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>

      <style jsx global>{`
        :root {
          /* Color System - Sophisticated Dark Theme */
          --color-void: #0a0a0f;
          --color-midnight: #13131a;
          --color-obsidian: #1a1a24;
          --color-slate: #2a2a38;
          --color-mist: #3a3a4a;
          
          --color-pearl: #e8e8f0;
          --color-frost: #d4d4e0;
          --color-ash: #9a9aac;
          
          /* Accent Colors - Refined Palette */
          --color-amber: #f5c842;
          --color-amber-glow: rgba(245, 200, 66, 0.2);
          --color-crimson: #e84545;
          --color-cyan: #4ecdc4;
          --color-violet: #9b59b6;
          
          /* Gradients */
          --gradient-primary: linear-gradient(135deg, #f5c842 0%, #e84545 100%);
          --gradient-secondary: linear-gradient(135deg, #4ecdc4 0%, #9b59b6 100%);
          --gradient-mesh: 
            radial-gradient(at 20% 30%, rgba(245, 200, 66, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(232, 69, 69, 0.15) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(78, 205, 196, 0.1) 0px, transparent 50%);
          
          /* Shadows */
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
          --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
          --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
          --shadow-glow: 0 0 40px var(--color-amber-glow);
          
          /* Spacing */
          --space-xs: 0.5rem;
          --space-sm: 1rem;
          --space-md: 1.5rem;
          --space-lg: 2rem;
          --space-xl: 3rem;
          --space-2xl: 4rem;
          
          /* Typography */
          --font-display: 'Playfair Display', serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          
          /* Border Radius */
          --radius-sm: 8px;
          --radius-md: 16px;
          --radius-lg: 24px;
          --radius-xl: 32px;
          
          /* Transitions */
          --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
          --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: var(--font-body);
          background: var(--color-void);
          color: var(--color-pearl);
          line-height: 1.6;
          overflow-x: hidden;
        }
        
        /* Background Animation */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--gradient-mesh);
          opacity: 1;
          z-index: 0;
          pointer-events: none;
        }
        
        /* Grain Texture Overlay */
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          z-index: 1;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-display);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        
        h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
        }
        
        h2 {
          font-size: clamp(2rem, 4vw, 3rem);
        }
        
        h3 {
          font-size: clamp(1.5rem, 3vw, 2rem);
        }
        
        /* Links */
        a {
          color: inherit;
          text-decoration: none;
          transition: all var(--transition-base);
        }
        
        /* Buttons */
        button {
          font-family: var(--font-body);
          cursor: pointer;
          border: none;
          outline: none;
          transition: all var(--transition-base);
        }
        
        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        /* Inputs */
        input, textarea {
          font-family: var(--font-body);
          outline: none;
          transition: all var(--transition-base);
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--color-midnight);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--color-slate);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-mist);
        }
        
        /* Selection */
        ::selection {
          background: var(--color-amber);
          color: var(--color-void);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        /* Utility Classes */
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--space-lg);
          position: relative;
          z-index: 2;
        }
        
        .glass {
          background: rgba(26, 26, 36, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glass-strong {
          background: rgba(26, 26, 36, 0.85);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .text-gradient {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .animate-in {
          animation: fadeIn var(--transition-slow) ease-out;
        }
        
        /* Clerk Customization */
        .cl-internal-b3fm6y {
          font-family: var(--font-body) !important;
        }
        
        .cl-userButtonPopoverCard {
          background: var(--color-obsidian) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .cl-userButtonPopoverActionButton {
          color: var(--color-pearl) !important;
        }
        
        .cl-userButtonPopoverActionButton:hover {
          background: var(--color-slate) !important;
        }
      `}</style>
    </>
  );
}