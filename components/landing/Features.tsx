import { Layers, Link2, Palette, Zap, Share2, Eye } from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    color: 'from-purple/20 to-purple/5',
    borderColor: 'rgba(139,92,246,0.2)',
    iconBg: 'rgba(139,92,246,0.15)',
    iconColor: '#a78bfa',
    title: 'Everything in One Place',
    description:
      'Skills, projects, work experience, education — all beautifully organized in your personal portfolio.',
  },
  {
    icon: Link2,
    color: 'from-cyan/20 to-cyan/5',
    borderColor: 'rgba(34,211,238,0.2)',
    iconBg: 'rgba(34,211,238,0.15)',
    iconColor: '#67e8f9',
    title: 'Your Unique Link',
    description:
      'Get a clean, shareable URL like portify.app/u/yourname — perfect for your LinkedIn bio or email signature.',
  },
  {
    icon: Palette,
    color: 'from-pink/20 to-pink/5',
    borderColor: 'rgba(244,114,182,0.2)',
    iconBg: 'rgba(244,114,182,0.15)',
    iconColor: '#f9a8d4',
    title: 'Stunning by Default',
    description:
      'No design skills needed. Your portfolio looks incredible out of the box — dark, modern, and undeniably Gen Z.',
  },
  {
    icon: Zap,
    color: 'from-yellow-500/20 to-yellow-500/5',
    borderColor: 'rgba(234,179,8,0.2)',
    iconBg: 'rgba(234,179,8,0.12)',
    iconColor: '#fde047',
    title: 'Set Up in Minutes',
    description:
      'Create your account, fill in your details, and go live. No complex setup, no templates to wrestle with.',
  },
  {
    icon: Share2,
    color: 'from-green-500/20 to-green-500/5',
    borderColor: 'rgba(34,197,94,0.2)',
    iconBg: 'rgba(34,197,94,0.12)',
    iconColor: '#86efac',
    title: 'Share Anywhere',
    description:
      'Send your link to recruiters, paste it on GitHub, drop it in your email signature. It just works.',
  },
  {
    icon: Eye,
    color: 'from-orange-500/20 to-orange-500/5',
    borderColor: 'rgba(249,115,22,0.2)',
    iconBg: 'rgba(249,115,22,0.12)',
    iconColor: '#fdba74',
    title: 'Always Up to Date',
    description:
      'Update your skills and projects any time. Changes reflect instantly on your public portfolio — no republishing needed.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/20 bg-cyan/5 text-cyan text-sm font-medium mb-6">
            ✦ Features
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Everything you need to{' '}
            <span className="gradient-text">shine</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Built for builders who want to stand out — not blend in.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="glass-card p-6 group cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${f.color})`,
                  borderColor: f.borderColor,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.iconBg }}
                >
                  <Icon size={20} style={{ color: f.iconColor }} />
                </div>
                <h3
                  className="text-lg font-bold text-text mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {f.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
