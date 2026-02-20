const SAMPLE_PROFILES = [
  {
    initials: 'SK',
    name: 'Sneha Kumar',
    role: 'UX Designer',
    skills: ['Figma', 'Prototyping', 'Research'],
    gradient: 'from-pink/30 to-purple/20',
    accentColor: 'rgba(244,114,182,0.6)',
  },
  {
    initials: 'MR',
    name: 'Marcus Rivera',
    role: 'Full Stack Dev',
    skills: ['Next.js', 'Python', 'AWS'],
    gradient: 'from-purple/30 to-cyan/20',
    accentColor: 'rgba(139,92,246,0.6)',
  },
  {
    initials: 'AK',
    name: 'Aiko Nakamura',
    role: 'AI Engineer',
    skills: ['PyTorch', 'LLMs', 'Hugging Face'],
    gradient: 'from-cyan/30 to-green-500/20',
    accentColor: 'rgba(34,211,238,0.6)',
  },
  {
    initials: 'JM',
    name: 'Jordan Mills',
    role: 'Mobile Dev',
    skills: ['Flutter', 'Swift', 'Kotlin'],
    gradient: 'from-yellow-500/20 to-orange-500/20',
    accentColor: 'rgba(234,179,8,0.6)',
  },
  {
    initials: 'PR',
    name: 'Priya Reddy',
    role: 'DevOps Engineer',
    skills: ['Kubernetes', 'Terraform', 'CI/CD'],
    gradient: 'from-green-500/20 to-cyan/20',
    accentColor: 'rgba(34,197,94,0.6)',
  },
  {
    initials: 'LC',
    name: 'Luca Conti',
    role: 'Frontend Dev',
    skills: ['React', 'Three.js', 'GSAP'],
    gradient: 'from-orange-500/20 to-pink/20',
    accentColor: 'rgba(249,115,22,0.6)',
  },
]

// Duplicate for seamless loop
const ALL_PROFILES = [...SAMPLE_PROFILES, ...SAMPLE_PROFILES]

export function Showcase() {
  return (
    <section id="showcase" className="py-28 relative overflow-hidden">
      <div className="px-6 mb-14">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink/20 bg-pink/5 text-pink text-sm font-medium mb-6">
            ✦ Community
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Built by the{' '}
            <span className="gradient-text">next generation</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Thousands of creators, developers, and designers already showcasing their work.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {ALL_PROFILES.map((p, i) => (
            <div
              key={`${p.initials}-${i}`}
              className="glass-card flex-shrink-0 w-56 p-5"
              style={{ background: `linear-gradient(135deg, ${p.gradient})` }}
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mb-3 border"
                style={{
                  background: `rgba(4,3,13,0.5)`,
                  borderColor: p.accentColor,
                  fontFamily: 'var(--font-syne)',
                }}
              >
                {p.initials}
              </div>
              <div
                className="font-bold text-text text-sm mb-0.5"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {p.name}
              </div>
              <div className="text-text-subtle text-xs mb-3">{p.role}</div>
              <div className="flex flex-wrap gap-1">
                {p.skills.map((s) => (
                  <span key={s} className="tag text-[10px]">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
