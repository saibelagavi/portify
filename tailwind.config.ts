import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#04030d',
          surface: '#0d0b1a',
          elevated: '#13101f',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          strong: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.06)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.15)',
          purple: 'rgba(139,92,246,0.4)',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          bright: '#a78bfa',
          deep: '#7c3aed',
          glow: 'rgba(139,92,246,0.3)',
        },
        cyan: {
          DEFAULT: '#22d3ee',
          bright: '#67e8f9',
          glow: 'rgba(34,211,238,0.2)',
        },
        pink: {
          DEFAULT: '#f472b6',
          bright: '#f9a8d4',
          glow: 'rgba(244,114,182,0.15)',
        },
        text: {
          DEFAULT: '#f8fafc',
          muted: '#94a3b8',
          subtle: '#475569',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora': 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(236,72,153,0.08) 0%, transparent 50%)',
        'glow-purple': 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
      },
      animation: {
        'aurora-float': 'aurora-float 8s ease-in-out infinite',
        'aurora-float-slow': 'aurora-float 12s ease-in-out infinite reverse',
        'aurora-float-mid': 'aurora-float 10s ease-in-out infinite 2s',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        'aurora-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 20px) scale(0.97)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
        'glow-cyan': '0 0 30px rgba(34,211,238,0.2)',
        'glow-sm': '0 0 15px rgba(139,92,246,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
