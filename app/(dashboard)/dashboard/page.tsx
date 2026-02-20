import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Layers, User, ExternalLink, CheckCircle2, Circle } from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const [{ data: profile }, { count: skillCount }, { count: projectCount }, { count: expCount }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('skills').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
      supabase.from('experiences').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
    ])

  const completionItems = [
    { label: 'Profile info', done: !!(profile?.full_name && profile?.headline), href: '/profile' },
    { label: 'Added skills', done: (skillCount ?? 0) > 0, href: '/builder' },
    { label: 'Added a project', done: (projectCount ?? 0) > 0, href: '/builder' },
    { label: 'Added experience', done: (expCount ?? 0) > 0, href: '/builder' },
    { label: 'Added bio', done: !!profile?.bio, href: '/profile' },
  ]

  const completionPct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  )

  const initials = getInitials(profile?.full_name ?? profile?.username ?? 'U')

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-black text-text tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-text-muted mt-1">
          {completionPct < 100
            ? "Let's finish building your portfolio."
            : "Your portfolio is looking great!"}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Skills', value: skillCount ?? 0, color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.2)' },
          { label: 'Projects', value: projectCount ?? 0, color: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.2)' },
          { label: 'Experience', value: expCount ?? 0, color: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)' },
          { label: 'Complete', value: `${completionPct}%`, color: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card p-5"
            style={{ background: s.color, borderColor: s.border }}
          >
            <div
              className="text-3xl font-black text-text mb-1"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {s.value}
            </div>
            <div className="text-sm text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion checklist */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-bold text-text"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Portfolio Completion
            </h2>
            <span className="tag">{completionPct}%</span>
          </div>

          {/* Progress bar */}
          <div className="skill-bar mb-6">
            <div className="skill-bar-fill" style={{ width: `${completionPct}%` }} />
          </div>

          <div className="space-y-3">
            {completionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  item.done
                    ? 'border-green-500/20 bg-green-500/5 opacity-60'
                    : 'border-border bg-glass hover:bg-glass-hover hover:border-border-strong'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-text-subtle flex-shrink-0" />
                )}
                <span
                  className={`text-sm font-medium ${item.done ? 'text-text-muted line-through' : 'text-text'}`}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <ArrowRight size={14} className="ml-auto text-text-subtle" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="glass-card p-5 text-center">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover border border-border mx-auto mb-3"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center text-xl font-bold text-text border border-purple/20 mx-auto mb-3">
                {initials}
              </div>
            )}
            <div
              className="font-bold text-text"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {profile?.full_name ?? 'Your Name'}
            </div>
            <div className="text-sm text-text-muted mb-1">
              {profile?.headline ?? 'Your headline...'}
            </div>
            <div className="text-xs text-text-subtle mb-4">
              portify.app/u/{profile?.username}
            </div>
            <a
              href={`/u/${profile?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm w-full justify-center"
            >
              <ExternalLink size={14} />
              View Portfolio
            </a>
          </div>

          {/* Quick actions */}
          <div className="glass-card p-5 space-y-2">
            <h3
              className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Quick Actions
            </h3>
            <Link href="/profile" className="btn-ghost w-full text-sm justify-start gap-3">
              <User size={16} className="text-purple-bright" />
              Edit Profile
            </Link>
            <Link href="/builder" className="btn-ghost w-full text-sm justify-start gap-3">
              <Layers size={16} className="text-cyan" />
              Add Skills &amp; Projects
            </Link>
            <a
              href={`/u/${profile?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full text-sm justify-start gap-3"
            >
              <ExternalLink size={16} className="text-pink" />
              Share Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
