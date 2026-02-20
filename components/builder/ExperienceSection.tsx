'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Pencil, X, Check, Briefcase } from 'lucide-react'
import { addExperience, updateExperience, deleteExperience } from '@/app/actions/portfolio'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import type { Experience } from '@/types'

interface Props {
  initialExperiences: Experience[]
}

interface ExpData {
  company: string
  role: string
  description: string
  start_date: string
  end_date: string
  is_current: boolean
}

function ExperienceForm({
  onSave,
  onCancel,
  initial,
}: {
  onSave: (data: ExpData) => void
  onCancel: () => void
  initial?: ExpData
}) {
  const [form, setForm] = useState<ExpData>(
    initial ?? {
      company: '',
      role: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
    }
  )

  const set = (field: keyof ExpData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="glass-card p-5" style={{ borderColor: 'rgba(244,114,182,0.2)' }}>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Company *</label>
            <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Corp" className="glass-input" autoFocus />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Role / Title *</label>
            <input type="text" value={form.role} onChange={set('role')} placeholder="Software Engineer" className="glass-input" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Start Date</label>
            <input type="month" value={form.start_date} onChange={set('start_date')} className="glass-input" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">End Date</label>
            <input type="month" value={form.end_date} onChange={set('end_date')} className="glass-input" disabled={form.is_current} />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={(e) => setForm((p) => ({ ...p, is_current: e.target.checked, end_date: e.target.checked ? '' : p.end_date }))}
                className="accent-pink"
              />
              <span className="text-xs text-text-muted">Currently working here</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="What did you build? What was your impact? Key achievements..."
            className="glass-input resize-none"
            rows={3}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" onClick={onCancel} className="btn-ghost text-sm"><X size={14} /> Cancel</button>
        <button
          type="button"
          onClick={() => {
            if (!form.company.trim() || !form.role.trim()) return toast.error('Company and role are required')
            onSave({ ...form, company: form.company.trim(), role: form.role.trim() })
          }}
          className="btn-primary text-sm py-2 px-4"
        >
          <Check size={14} /> Save
        </button>
      </div>
    </div>
  )
}

export function ExperienceSection({ initialExperiences }: Props) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleAdd(data: ExpData) {
    startTransition(async () => {
      const result = await addExperience(data)
      if (result?.error) { toast.error(result.error); return }
      const fake: Experience = { id: Date.now().toString(), profile_id: '', sort_order: experiences.length, created_at: new Date().toISOString(), ...data, end_date: data.is_current ? null : data.end_date, start_date: data.start_date || null }
      setExperiences((prev) => [fake, ...prev])
      setAdding(false)
      toast.success('Experience added!')
    })
  }

  function handleUpdate(id: string, data: ExpData) {
    startTransition(async () => {
      const result = await updateExperience(id, data)
      if (result?.error) { toast.error(result.error); return }
      setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, ...data, end_date: data.is_current ? null : data.end_date } : e)))
      setEditingId(null)
      toast.success('Experience updated!')
    })
  }

  function handleDelete(id: string, role: string) {
    if (!confirm(`Remove "${role}"?`)) return
    startTransition(async () => {
      const result = await deleteExperience(id)
      if (result?.error) { toast.error(result.error); return }
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      toast.success('Experience removed')
    })
  }

  return (
    <div className="space-y-4">
      {experiences.length === 0 && !adding && (
        <div className="glass-card p-12 text-center">
          <Briefcase size={40} className="text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>No experience yet</h3>
          <p className="text-text-muted text-sm mb-5">Add your work history, internships, or freelance projects.</p>
          <button onClick={() => setAdding(true)} className="btn-primary text-sm"><Plus size={16} /> Add Experience</button>
        </div>
      )}

      {adding && <ExperienceForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id}>
            {editingId === exp.id ? (
              <ExperienceForm
                initial={{ company: exp.company, role: exp.role, description: exp.description ?? '', start_date: exp.start_date?.slice(0, 7) ?? '', end_date: exp.end_date?.slice(0, 7) ?? '', is_current: exp.is_current }}
                onSave={(data) => handleUpdate(exp.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="glass-card p-5 flex gap-4 group">
                {/* Timeline dot */}
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-pink border-2 border-bg flex-shrink-0" />
                  <div className="w-px flex-1 bg-border mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-text" style={{ fontFamily: 'var(--font-syne)' }}>{exp.role}</div>
                      <div className="text-sm text-pink font-medium">{exp.company}</div>
                      <div className="text-xs text-text-subtle mt-0.5">
                        {formatDate(exp.start_date)} — {exp.is_current ? <span className="text-green-400">Present</span> : formatDate(exp.end_date)}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingId(exp.id)} className="p-1.5 rounded-lg hover:bg-purple/10 text-text-subtle hover:text-purple-bright transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(exp.id, exp.role)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-subtle hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {exp.description && <p className="text-text-muted text-sm mt-2 leading-relaxed">{exp.description}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!adding && experiences.length > 0 && (
        <button onClick={() => setAdding(true)} className="btn-secondary w-full justify-center text-sm py-3"><Plus size={16} /> Add Another Experience</button>
      )}
    </div>
  )
}
