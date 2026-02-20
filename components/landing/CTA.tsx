import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] bg-purple/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-[80px] bg-cyan/10" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div
          className="glass-card glow-border p-14"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(34,211,238,0.05) 100%)',
            borderColor: 'rgba(139,92,246,0.2)',
          }}
        >
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Ready to{' '}
            <span className="gradient-text">level up</span>?
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-lg mx-auto">
            Join thousands of builders who ditched the boring resume and built something worth sharing.
          </p>

          <Link href="/signup" className="btn-primary text-base px-8 py-4 inline-flex">
            Build Your Portfolio — Free
            <ArrowRight size={18} />
          </Link>

          <p className="text-text-subtle text-sm mt-5">
            Takes under 5 minutes · No credit card needed
          </p>
        </div>
      </div>
    </section>
  )
}
