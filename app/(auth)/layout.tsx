import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-hidden">
      {/* Aurora background */}
      <div className="aurora-blob aurora-blob-1" style={{ opacity: 0.6 }} />
      <div className="aurora-blob aurora-blob-2" style={{ opacity: 0.5 }} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center shadow-glow-purple">
            <Sparkles size={16} className="text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}
          >
            portify
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-text-subtle text-sm">
          Made for the next generation ✦
        </p>
      </footer>
    </div>
  )
}
