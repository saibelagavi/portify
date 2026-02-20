'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Dribbble,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Star,
  Briefcase,
  GraduationCap,
  Code2,
  FolderOpen,
} from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'
import type { FullProfile, Skill } from '@/types'

interface Props {
  data: FullProfile
}

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

function SkillBar({ level }: { level: number }) {
  return (
    <div className="skill-bar w-16">
      <div className="skill-bar-fill" style={{ width: `${(level / 5) * 100}%` }} />
    </div>
  )
}

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const icons: Record<string, React.ReactNode> = {
    github: <Github size={17} />,
    linkedin: <Linkedin size={17} />,
    twitter: <Twitter size={17} />,
    instagram: <Instagram size={17} />,
    youtube: <Youtube size={17} />,
    dribbble: <Dribbble size={17} />,
    website: <Globe size={17} />,
  }
  const icon = icons[platform] ?? <Globe size={17} />
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-xl flex items-center justify-center glass-card text-text-muted hover:text-text hover:border-border-strong transition-all"
      title={platform}
    >
      {icon}
    </a>
  )
}

export function PublicPortfolio({ data }: Props) {
  const { profile, skills, projects, experiences, education } = data
  const [copied, setCopied] = useState(false)

  const initials = getInitials(profile.full_name ?? profile.username)

  const socials = [
    { key: 'github', url: profile.github },
    { key: 'linkedin', url: profile.linkedin },
    { key: 'twitter', url: profile.twitter },
    { key: 'instagram', url: profile.instagram },
    { key: 'youtube', url: profile.youtube },
    { key: 'dribbble', url: profile.dribbble },
    { key: 'website', url: profile.website },
  ].filter((s): s is { key: string; url: string } => !!s.url)

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden">
      {/* Aurora background */}
      <div className="aurora-blob aurora-blob-1" style={{ opacity: 0.4 }} />
      <div className="aurora-blob aurora-blob-2" style={{ opacity: 0.35 }} />

      {/* Portify branding bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 px-5 py-3 flex items-center justify-between border-b border-border"
        style={{ background: 'rgba(4,3,13,0.9)', backdropFilter: 'blur(16px)' }}
      >
        <Link href="/" className="flex items-center gap-1.5 text-text-subtle hover:text-text transition-colors">
          <Sparkles size={14} />
          <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-syne)' }}>portify</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="btn-ghost text-xs py-1.5 px-3 gap-1.5"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <Link href="/signup" className="btn-primary text-xs py-1.5 px-3">
            Build yours →
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 pb-24 pt-20">
        {/* Hero / Profile Header */}
        <section className="py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? 'avatar'}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-purple/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center text-3xl font-black text-text border-2 border-purple/20"
                  style={{ fontFamily: 'var(--font-syne)' }}>
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-green-500 border-2 border-bg" title="Available for work" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1
                className="text-4xl sm:text-5xl font-black text-text tracking-tight leading-none mb-2"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {profile.full_name ?? profile.username}
              </h1>
              {profile.headline && (
                <p className="text-lg text-text-muted font-medium mb-3">{profile.headline}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {profile.location && (
                  <span className="flex items-center gap-1.5 text-sm text-text-subtle">
                    <MapPin size={14} />
                    {profile.location}
                  </span>
                )}
                {socials.map((s) => (
                  <SocialIcon key={s.key} platform={s.key} url={s.url} />
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div
              className="mt-8 p-5 glass-card"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <p className="text-text-muted leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-14">
            <SectionHeader icon={Code2} title="Skills" count={skills.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="glass-card p-5">
                  <h3
                    className="text-xs font-bold text-text-subtle uppercase tracking-widest mb-4"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {items.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-text font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-text-subtle">{LEVEL_LABELS[skill.level]}</span>
                          <SkillBar level={skill.level} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-14">
            <SectionHeader icon={FolderOpen} title="Projects" count={projects.length} />

            {/* Featured */}
            {featuredProjects.length > 0 && (
              <div className="mb-5">
                <p className="text-xs text-text-subtle uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  Featured
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="glass-card p-6 flex flex-col"
                      style={{
                        background: 'linear-gradient(135deg, rgba(234,179,8,0.06) 0%, transparent 100%)',
                        borderColor: 'rgba(234,179,8,0.2)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3
                          className="font-bold text-text"
                          style={{ fontFamily: 'var(--font-syne)' }}
                        >
                          {project.title}
                          <Star size={12} className="inline ml-1.5 text-yellow-400 fill-yellow-400" />
                        </h3>
                      </div>
                      {project.description && (
                        <p className="text-text-muted text-sm mb-4 flex-1 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                      {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tech_stack.map((t) => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-auto">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                            className="btn-secondary text-xs py-1.5 px-3">
                            <Github size={12} /> Code
                          </a>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                            className="btn-primary text-xs py-1.5 px-3">
                            <ExternalLink size={12} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other projects */}
            {otherProjects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProjects.map((project) => (
                  <div key={project.id} className="glass-card p-5 flex flex-col">
                    <h3
                      className="font-bold text-text mb-1"
                      style={{ fontFamily: 'var(--font-syne)' }}
                    >
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-text-muted text-sm mb-3 flex-1 line-clamp-2">{project.description}</p>
                    )}
                    {project.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech_stack.slice(0, 3).map((t) => (
                          <span key={t} className="tag text-[10px]">{t}</span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="tag text-[10px]">+{project.tech_stack.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-1.5 mt-auto">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="btn-ghost text-xs py-1 px-2">
                          <Github size={12} />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                          className="btn-ghost text-xs py-1 px-2">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-14">
            <SectionHeader icon={Briefcase} title="Experience" count={experiences.length} />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-pink/40 via-pink/20 to-transparent" />

              <div className="space-y-4 pl-10">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative glass-card p-5">
                    {/* Dot */}
                    <div className="absolute -left-[26px] top-5 w-3.5 h-3.5 rounded-full bg-pink border-2 border-bg" />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div
                          className="font-bold text-text"
                          style={{ fontFamily: 'var(--font-syne)' }}
                        >
                          {exp.role}
                        </div>
                        <div className="text-sm font-medium text-pink">{exp.company}</div>
                        <div className="text-xs text-text-subtle mt-1">
                          {formatDate(exp.start_date)} — {' '}
                          {exp.is_current ? (
                            <span className="text-green-400 font-medium">Present</span>
                          ) : (
                            formatDate(exp.end_date)
                          )}
                        </div>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-text-muted text-sm mt-3 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-14">
            <SectionHeader icon={GraduationCap} title="Education" count={education.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="glass-card p-5"
                  style={{ borderColor: 'rgba(234,179,8,0.15)' }}
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={18} className="text-yellow-400" />
                    </div>
                    <div>
                      <div
                        className="font-bold text-text"
                        style={{ fontFamily: 'var(--font-syne)' }}
                      >
                        {edu.institution}
                      </div>
                      {(edu.degree || edu.field) && (
                        <div className="text-sm text-yellow-400 font-medium">
                          {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      <div className="text-xs text-text-subtle mt-0.5">
                        {edu.start_year} — {edu.end_year ?? <span className="text-green-400">Present</span>}
                      </div>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-text-muted text-sm mt-3 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {skills.length === 0 && projects.length === 0 && experiences.length === 0 && education.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted mb-4">This portfolio is still being built...</p>
            <Link href="/signup" className="btn-primary text-sm">
              Build yours →
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-5 text-center">
        <p className="text-text-subtle text-sm">
          Built with{' '}
          <Link href="/" className="text-purple-bright hover:text-purple transition-colors">
            Portify
          </Link>{' '}
          · Free portfolio builder for the next generation
        </p>
      </footer>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType
  title: string
  count: number
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center">
        <Icon size={16} className="text-purple-bright" />
      </div>
      <h2
        className="text-xl font-black text-text tracking-tight"
        style={{ fontFamily: 'var(--font-syne)' }}
      >
        {title}
      </h2>
      <span className="tag ml-auto">{count}</span>
    </div>
  )
}
