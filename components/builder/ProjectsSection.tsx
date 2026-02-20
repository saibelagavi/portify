'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Pencil, X, Check, FolderOpen, Github, ExternalLink, Star } from 'lucide-react'
import { addProject, updateProject, deleteProject } from '@/app/actions/portfolio'
import { toast } from 'sonner'
import type { Project } from '@/types'

interface Props {
  initialProjects: Project[]
}

interface ProjectData {
  title: string
  description: string
  tech_stack: string[]
  github_url: string
  live_url: string
  featured: boolean
}

function TechStackInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (tags: string[]) => void
}) {
  const [input, setInput] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div
      className="glass-input flex flex-wrap gap-1.5 min-h-[42px] cursor-text"
      onClick={(e) => {
        const input = (e.currentTarget as HTMLElement).querySelector('input')
        input?.focus()
      }}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple/15 border border-purple/20 text-purple-bright text-xs"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
            className="hover:text-white transition-colors"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(input)
          }
          if (e.key === 'Backspace' && !input && value.length > 0) {
            onChange(value.slice(0, -1))
          }
        }}
        placeholder={value.length === 0 ? 'React, Node.js, ... (press Enter)' : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-text placeholder:text-text-subtle"
      />
    </div>
  )
}

function ProjectForm({
  onSave,
  onCancel,
  initial,
}: {
  onSave: (data: ProjectData) => void
  onCancel: () => void
  initial?: ProjectData
}) {
  const [form, setForm] = useState<ProjectData>(
    initial ?? {
      title: '',
      description: '',
      tech_stack: [],
      github_url: '',
      live_url: '',
      featured: false,
    }
  )

  const set = (field: keyof ProjectData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="glass-card p-5" style={{ borderColor: 'rgba(34,211,238,0.2)' }}>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Project title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="My Awesome App"
              className="glass-input"
              autoFocus
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-glass transition-colors w-full">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="accent-purple"
              />
              <span className="text-sm text-text-muted flex items-center gap-1.5">
                <Star size={14} className={form.featured ? 'text-yellow-400 fill-yellow-400' : 'text-text-subtle'} />
                Mark as featured
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="What does this project do? What problem does it solve?"
            className="glass-input resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Tech Stack</label>
          <TechStackInput
            value={form.tech_stack}
            onChange={(tags) => setForm((p) => ({ ...p, tech_stack: tags }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">GitHub URL</label>
            <div className="relative">
              <Github size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="url"
                value={form.github_url}
                onChange={set('github_url')}
                placeholder="https://github.com/..."
                className="glass-input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Live URL</label>
            <div className="relative">
              <ExternalLink size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="url"
                value={form.live_url}
                onChange={set('live_url')}
                placeholder="https://myapp.vercel.app"
                className="glass-input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <button type="button" onClick={onCancel} className="btn-ghost text-sm">
          <X size={14} />
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!form.title.trim()) return toast.error('Project title is required')
            onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
          }}
          className="btn-primary text-sm py-2 px-4"
        >
          <Check size={14} />
          Save Project
        </button>
      </div>
    </div>
  )
}

export function ProjectsSection({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleAdd(data: ProjectData) {
    startTransition(async () => {
      const result = await addProject(data)
      if (result?.error) { toast.error(result.error); return }
      const fake: Project = {
        id: Date.now().toString(),
        profile_id: '',
        sort_order: projects.length,
        created_at: new Date().toISOString(),
        image_url: null,
        ...data,
      }
      setProjects((prev) => [...prev, fake])
      setAdding(false)
      toast.success(`"${data.title}" added!`)
    })
  }

  function handleUpdate(id: string, data: ProjectData) {
    startTransition(async () => {
      const result = await updateProject(id, data)
      if (result?.error) { toast.error(result.error); return }
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
      setEditingId(null)
      toast.success('Project updated!')
    })
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Remove "${title}"?`)) return
    startTransition(async () => {
      const result = await deleteProject(id)
      if (result?.error) { toast.error(result.error); return }
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success('Project removed')
    })
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 && !adding && (
        <div className="glass-card p-12 text-center">
          <FolderOpen size={40} className="text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>No projects yet</h3>
          <p className="text-text-muted text-sm mb-5">Show the world what you&apos;ve built. Add your first project.</p>
          <button onClick={() => setAdding(true)} className="btn-primary text-sm">
            <Plus size={16} />
            Add Project
          </button>
        </div>
      )}

      {adding && <ProjectForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id}>
            {editingId === project.id ? (
              <ProjectForm
                initial={{
                  title: project.title,
                  description: project.description ?? '',
                  tech_stack: project.tech_stack ?? [],
                  github_url: project.github_url ?? '',
                  live_url: project.live_url ?? '',
                  featured: project.featured,
                }}
                onSave={(data) => handleUpdate(project.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                className="glass-card p-5 h-full flex flex-col group"
                style={{
                  borderColor: project.featured ? 'rgba(234,179,8,0.3)' : undefined,
                  background: project.featured ? 'linear-gradient(135deg, rgba(234,179,8,0.06), rgba(4,3,13,0.8))' : undefined,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text" style={{ fontFamily: 'var(--font-syne)' }}>
                    {project.title}
                    {project.featured && (
                      <Star size={12} className="inline ml-1.5 text-yellow-400 fill-yellow-400" />
                    )}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingId(project.id)}
                      className="p-1.5 rounded-lg hover:bg-purple/10 text-text-subtle hover:text-purple-bright transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-subtle hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p className="text-text-muted text-sm mb-3 flex-1 line-clamp-2">{project.description}</p>
                )}

                {project.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tech_stack.slice(0, 4).map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="tag">+{project.tech_stack.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1 px-2">
                      <Github size={12} /> GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1 px-2">
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!adding && projects.length > 0 && (
        <button onClick={() => setAdding(true)} className="btn-secondary w-full justify-center text-sm py-3">
          <Plus size={16} />
          Add Another Project
        </button>
      )}
    </div>
  )
}
