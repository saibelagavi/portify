import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}
          >
            portify
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-text-muted">
          <Link href="#features" className="hover:text-text transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-text transition-colors">How it works</Link>
          <Link href="/signup" className="hover:text-text transition-colors">Sign up</Link>
        </div>

        {/* Tagline */}
        <p className="text-text-subtle text-sm">
          Made for the next generation ✦
        </p>
      </div>
    </footer>
  )
}
