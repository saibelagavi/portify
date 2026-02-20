'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

const ROLES = ['Developer', 'Designer', 'Creator', 'Engineer', 'Builder', 'Artist']

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % ROLES.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Aurora blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple/30 bg-purple/10 text-purple-bright text-sm font-medium mb-8">
          <Zap size={14} className="fill-purple-bright text-purple-bright" />
          Free forever · No credit card needed
        </div>

        {/* Headline */}
        <h1
          className="animate-in delay-100 text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Your Portfolio.{' '}
          <br />
          <span style={{ color: '#a78bfa' }}>Your </span>
          <span
            className="gradient-text inline-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            {ROLES[roleIndex]}
          </span>
          <span style={{ color: '#22d3ee' }}>.</span>
        </h1>

        {/* Sub */}
        <p
          className="animate-in delay-200 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          Stop sending boring resumes. Build a{' '}
          <span className="text-text">living portfolio</span> that shows who you really are —
          your skills, projects, and story, all in one stunning link.
        </p>

        {/* CTAs */}
        <div className="animate-in delay-300 flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/signup" className="btn-primary text-base px-7 py-3.5">
            Start Building Free
            <ArrowRight size={18} />
          </Link>
          <a href="#showcase" className="btn-secondary text-base px-7 py-3.5">
            See Portfolios
          </a>
        </div>

        {/* Stats */}
        <div className="animate-in delay-400 flex flex-wrap items-center justify-center gap-8 mb-20">
          {[
            { value: '12k+', label: 'Portfolios built' },
            { value: '5 min', label: 'Average setup' },
            { value: '100%', label: 'Free forever' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl font-bold gradient-text-purple"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-text-subtle">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Portfolio preview card */}
        <div className="animate-in delay-500 relative max-w-3xl mx-auto">
          {/* Glow behind card */}
          <div className="absolute -inset-8 bg-purple/10 rounded-3xl blur-3xl" />

          <div
            className="relative glass-card glow-border overflow-hidden"
            style={{ padding: '24px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
          >
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-pink/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 mx-4 h-7 rounded-md bg-glass flex items-center px-3">
                <span className="text-text-subtle text-xs">portify.app/u/alexchen</span>
              </div>
            </div>

            {/* Mini portfolio preview */}
            <div className="flex gap-5">
              {/* Profile column */}
              <div className="flex flex-col items-center gap-3 min-w-[100px]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple/40 to-cyan/30 border border-purple/30 flex items-center justify-center">
                  <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>AC</span>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-text" style={{ fontFamily: 'var(--font-syne)' }}>Alex Chen</div>
                  <div className="text-xs text-text-subtle">Full Stack Dev</div>
                </div>
                <div className="flex gap-1">
                  {['#React', '#Next.js', '#Python'].map((t) => (
                    <span key={t} className="tag text-[10px]">{t.replace('#', '')}</span>
                  ))}
                </div>
              </div>

              {/* Content column */}
              <div className="flex-1 space-y-3">
                {/* Project cards */}
                {[
                  { name: 'AI Chat App', tech: 'Next.js · OpenAI', color: 'from-purple/20 to-transparent' },
                  { name: 'E-Commerce Platform', tech: 'React · Stripe · Supabase', color: 'from-cyan/20 to-transparent' },
                  { name: 'Portfolio Builder', tech: 'Next.js · Tailwind', color: 'from-pink/20 to-transparent' },
                ].map((p) => (
                  <div key={p.name} className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${p.color} border border-border`}>
                    <div className="w-8 h-8 rounded-lg bg-glass border border-border flex items-center justify-center text-xs">💻</div>
                    <div>
                      <div className="text-xs font-semibold text-text">{p.name}</div>
                      <div className="text-[10px] text-text-subtle">{p.tech}</div>
                    </div>
                    <div className="ml-auto text-purple-bright text-xs">→</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-in delay-600 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-text-subtle text-xs">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5">
          <div
            className="w-1 h-2 bg-purple-bright rounded-full"
            style={{ animation: 'scrollDot 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
