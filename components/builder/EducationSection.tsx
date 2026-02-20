'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Pencil, X, Check, GraduationCap } from 'lucide-react'
import { addEducation, updateEducation, deleteEducation } from '@/app/actions/portfolio'
import { toast } from 'sonner'
import type { Education } from '@/types'

interface Props {
  initialEducation: Education[]
}

interface EduData {
  institution: string
  degree: string
  field: string
  start_year: number
  end_year: number | null
  description: string
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR + 5 - i)

function EducationForm({
  onSave,
  onCancel,
  initial,
}: {
  onSave: (data: EduData) => void
  onCancel: () => void
  initial?: EduData
}) {
  const [form, setForm] = useState<EduData>(
    initial ?? {
      institution: '',
      degree: '',
      field: '',
      start_year: CURRENT_YEAR - 3,
      end_year: CURRENT_YEAR,
      description: '',
    }
  )

  const [ongoing, setOngoing] = useState(!initial?.end_year)

  const set = (field: keyof EduData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="glass-card p-5" style={{ borderColor: 'rgba(234,179,8,0.2)' }}>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Institution *</label>
          <input type="text" value={form.institution} onChange={set('institution')} placeholder="MIT, Stanford, Coursera..." className="glass-input" autoFocus />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Degree</label>
            <input type="text" value={form.degree} onChange={set('degree')} placeholder="B.S., M.S., Bootcamp..." className="glass-input" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Field of Study</label>
            <input type="text" value={form.field} onChange={set('field')} placeholder="Computer Science" className="glass-input" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Start Year</label>
            <select value={form.start_year} onChange={(e) => setForm((p) => ({ ...p, start_year: Number(e.target.value) }))} className="glass-input" style={{ appearance: 'none' }}>
              {YEARS.map((y) => <option key={y} value={y} style={{ background: '#0d0b1a' }}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">End Year</label>
            <select value={form.end_year ?? ''} onChange={(e) => setForm((p) => ({ ...p, end_year: e.target.value ? Number(e.target.value) : null }))} className="glass-input" disabled={ongoing} style={{ appearance: 'none' }}>
              <option value="" style={{ background: '#0d0b1a' }}>Present</option>
              {YEARS.map((y) => <option key={y} value={y} style={{ background: '#0d0b1a' }}>{y}</option>)}
            </select>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={ongoing} onChange={(e) => { setOngoing(e.target.checked); if (e.target.checked) setForm((p) => ({ ...p, end_year: null })) }} className="accent-yellow-400" />
              <span className="text-xs text-text-muted">Currently studying</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Description</label>
          <textarea value={form.description} onChange={set('description')} placeholder="Relevant coursework, thesis, achievements..." className="glass-input resize-none" rows={2} />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" onClick={onCancel} className="btn-ghost text-sm"><X size={14} /> Cancel</button>
        <button
          type="button"
          onClick={() => {
            if (!form.institution.trim()) return toast.error('Institution is required')
            onSave({ ...form, institution: form.institution.trim(), end_year: ongoing ? null : form.end_year })
          }}
          className="btn-primary text-sm py-2 px-4"
        >
          <Check size={14} /> Save
        </button>
      </div>
    </div>
  )
}

export function EducationSection({ initialEducation }: Props) {
  const [education, setEducation] = useState<Education[]>(initialEducation)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleAdd(data: EduData) {
    startTransition(async () => {
      const result = await addEducation(data)
      if (result?.error) { toast.error(result.error); return }
      const fake: Education = { id: Date.now().toString(), profile_id: '', sort_order: education.length, created_at: new Date().toISOString(), ...data }
      setEducation((prev) => [fake, ...prev])
      setAdding(false)
      toast.success('Education added!')
    })
  }

  function handleUpdate(id: string, data: EduData) {
    startTransition(async () => {
      const result = await updateEducation(id, data)
      if (result?.error) { toast.error(result.error); return }
      setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
      setEditingId(null)
      toast.success('Education updated!')
    })
  }

  function handleDelete(id: string, institution: string) {
    if (!confirm(`Remove "${institution}"?`)) return
    startTransition(async () => {
      const result = await deleteEducation(id)
      if (result?.error) { toast.error(result.error); return }
      setEducation((prev) => prev.filter((e) => e.id !== id))
      toast.success('Education removed')
    })
  }

  return (
    <div className="space-y-4">
      {education.length === 0 && !adding && (
        <div className="glass-card p-12 text-center">
          <GraduationCap size={40} className="text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>No education yet</h3>
          <p className="text-text-muted text-sm mb-5">Add your degree, bootcamp, or any courses you&apos;ve completed.</p>
          <button onClick={() => setAdding(true)} className="btn-primary text-sm"><Plus size={16} /> Add Education</button>
        </div>
      )}

      {adding && <EducationForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id}>
            {editingId === edu.id ? (
              <EducationForm
                initial={{ institution: edu.institution, degree: edu.degree ?? '', field: edu.field ?? '', start_year: edu.start_year ?? CURRENT_YEAR - 3, end_year: edu.end_year, description: edu.description ?? '' }}
                onSave={(data) => handleUpdate(edu.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="glass-card p-5 flex gap-4 group" style={{ borderColor: 'rgba(234,179,8,0.15)' }}>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-text" style={{ fontFamily: 'var(--font-syne)' }}>{edu.institution}</div>
                      {(edu.degree || edu.field) && (
                        <div className="text-sm text-yellow-400 font-medium">
                          {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      <div className="text-xs text-text-subtle mt-0.5">
                        {edu.start_year} — {edu.end_year ?? <span className="text-green-400">Present</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingId(edu.id)} className="p-1.5 rounded-lg hover:bg-purple/10 text-text-subtle hover:text-purple-bright transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(edu.id, edu.institution)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-subtle hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {edu.description && <p className="text-text-muted text-sm mt-2">{edu.description}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!adding && education.length > 0 && (
        <button onClick={() => setAdding(true)} className="btn-secondary w-full justify-center text-sm py-3"><Plus size={16} /> Add Another</button>
      )}
    </div>
  )
}
