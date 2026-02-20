'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Layers,
  ExternalLink,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { getInitials } from '@/lib/utils'

interface Props {
  profile: { username: string; full_name: string | null; avatar_url: string | null } | null
  userId: string
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/builder', icon: Layers, label: 'Portfolio Builder' },
]

export function DashboardNav({ profile, userId }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const username = profile?.username ?? 'you'
  const initials = getInitials(profile?.full_name ?? username)

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}
          >
            portify
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-purple/15 text-purple-bright border border-purple/20'
                  : 'text-text-muted hover:bg-glass hover:text-text'
              }`}
            >
              <Icon size={18} className={active ? 'text-purple-bright' : ''} />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-bright" />
              )}
            </Link>
          )
        })}

        {/* View portfolio link */}
        <a
          href={`/u/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-glass hover:text-text transition-all duration-150 group"
        >
          <ExternalLink size={18} />
          View Portfolio
          <ExternalLink
            size={12}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </a>
      </nav>

      {/* Profile + Signout */}
      <div className="px-3 py-4 border-t border-border space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-glass">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center text-xs font-bold text-text border border-purple/20">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text truncate" style={{ fontFamily: 'var(--font-syne)' }}>
              {profile?.full_name ?? 'Builder'}
            </div>
            <div className="text-xs text-text-subtle truncate">@{username}</div>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-subtle hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border"
        style={{ background: 'rgba(13,11,26,0.95)', backdropFilter: 'blur(16px)' }}
      >
        {navContent}
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 border-b border-border"
        style={{ background: 'rgba(4,3,13,0.95)', backdropFilter: 'blur(16px)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
            portify
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-muted p-2 rounded-lg hover:bg-glass transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 flex flex-col border-r border-border pt-16"
            style={{ background: 'rgba(13,11,26,0.98)', backdropFilter: 'blur(20px)' }}
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  )
}
