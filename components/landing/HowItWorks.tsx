import Link from 'next/link'
import { UserPlus, Edit3, Share2, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your account',
    description:
      'Sign up in 30 seconds. Choose your unique username — this becomes your permanent portfolio URL.',
    time: '30 seconds',
    color: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.25)',
    numColor: 'rgba(139,92,246,0.8)',
  },
  {
    number: '02',
    icon: Edit3,
    title: 'Build your portfolio',
    description:
      'Add your skills, showcase your projects, fill in your experience and education. Our builder makes it effortless.',
    time: '~15 minutes',
    color: 'rgba(34,211,238,0.1)',
    borderColor: 'rgba(34,211,238,0.2)',
    numColor: 'rgba(34,211,238,0.8)',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Share your link',
    description:
      "Copy portify.app/u/yourname and drop it everywhere. Recruiters, clients, Twitter bio — let the world see what you're about.",
    time: 'Forever',
    color: 'rgba(244,114,182,0.1)',
    borderColor: 'rgba(244,114,182,0.2)',
    numColor: 'rgba(244,114,182,0.8)',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative overflow-hidden">
      {/* BG accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple/20 bg-purple/5 text-purple-bright text-sm font-medium mb-6">
            ✦ How it works
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Live in{' '}
            <span className="gradient-text">3 steps</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Seriously, it is this simple.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[calc(33.33%+24px)] right-[calc(33.33%+24px)] h-px bg-gradient-to-r from-purple/30 via-cyan/30 to-pink/30" />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative glass-card p-7 flex flex-col gap-4"
                style={{
                  background: step.color,
                  borderColor: step.borderColor,
                }}
              >
                {/* Step number */}
                <div
                  className="text-5xl font-black opacity-20 absolute top-6 right-6"
                  style={{
                    fontFamily: 'var(--font-syne)',
                    color: step.numColor,
                    opacity: 0.25,
                  }}
                >
                  {step.number}
                </div>

                {/* Icon circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: step.borderColor }}
                >
                  <Icon size={20} style={{ color: step.numColor }} />
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-text mb-2"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-auto pt-2 border-t border-border">
                  <span className="text-xs text-text-subtle">⏱ {step.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link href="/signup" className="btn-primary px-8 py-4 text-base">
            Start Building — It&apos;s Free
            <ArrowRight size={18} />
          </Link>
          <p className="text-text-subtle text-sm mt-4">
            No credit card. No catch. Just you and your portfolio.
          </p>
        </div>
      </div>
    </section>
  )
}
