'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Pencil, X, Check, Code2 } from 'lucide-react'
import { addSkill, updateSkill, deleteSkill } from '@/app/actions/portfolio'
import { toast } from 'sonner'
import { SKILL_CATEGORIES } from '@/lib/utils'
import type { Skill } from '@/types'

interface Props {
  initialSkills: Skill[]
}

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

function SkillLevel({ level, onChange }: { level: number; onChange?: (l: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange?.(l)}
          title={LEVEL_LABELS[l]}
          className={`h-1.5 rounded-full transition-all duration-200 ${onChange ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
          style={{
            width: '20px',
            background: l <= level
              ? `linear-gradient(90deg, #8b5cf6, #22d3ee)`
              : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </div>
  )
}

function SkillForm({
  onSave,
  onCancel,
  initial,
}: {
  onSave: (data: { name: string; category: string; level: number }) => void
  onCancel: () => void
  initial?: { name: string; category: string; level: number }
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'Frontend')
  const [level, setLevel] = useState(initial?.level ?? 3)

  return (
    <div className="glass-card p-5 border-purple/20" style={{ borderColor: 'rgba(139,92,246,0.25)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="sm:col-span-1">
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Skill name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. React"
            className="glass-input"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input"
            style={{ appearance: 'none' }}
          >
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ background: '#0d0b1a' }}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">
            Level — {LEVEL_LABELS[level]}
          </label>
          <div className="flex items-center h-[42px]">
            <SkillLevel level={level} onChange={setLevel} />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-ghost text-sm">
          <X size={14} />
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return toast.error('Skill name is required')
            onSave({ name: name.trim(), category, level })
          }}
          className="btn-primary text-sm py-2 px-4"
        >
          <Check size={14} />
          Save
        </button>
      </div>
    </div>
  )
}

export function SkillsSection({ initialSkills }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const grouped = SKILL_CATEGORIES.reduce<Record<string, Skill[]>>((acc, cat) => {
    const items = skills.filter((s) => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  // Also include skills with custom/null categories
  const uncategorized = skills.filter((s) => !SKILL_CATEGORIES.includes(s.category ?? ''))
  if (uncategorized.length) grouped['Other'] = uncategorized

  function handleAdd(data: { name: string; category: string; level: number }) {
    startTransition(async () => {
      const result = await addSkill(data)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      // Optimistic: re-fetch is handled by revalidation, but we'll fake it
      const fakeSkill: Skill = {
        id: Date.now().toString(),
        profile_id: '',
        name: data.name,
        category: data.category,
        level: data.level,
        sort_order: skills.length,
        created_at: new Date().toISOString(),
      }
      setSkills((prev) => [...prev, fakeSkill])
      setAdding(false)
      toast.success(`${data.name} added!`)
    })
  }

  function handleUpdate(id: string, data: { name: string; category: string; level: number }) {
    startTransition(async () => {
      const result = await updateSkill(id, data)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      )
      setEditingId(null)
      toast.success('Skill updated!')
    })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}"?`)) return
    startTransition(async () => {
      const result = await deleteSkill(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      setSkills((prev) => prev.filter((s) => s.id !== id))
      toast.success('Skill removed')
    })
  }

  return (
    <div className="space-y-5">
      {/* Empty state */}
      {skills.length === 0 && !adding && (
        <div className="glass-card p-12 text-center">
          <Code2 size={40} className="text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
            No skills yet
          </h3>
          <p className="text-text-muted text-sm mb-5">Add your first skill and show the world what you know.</p>
          <button onClick={() => setAdding(true)} className="btn-primary text-sm">
            <Plus size={16} />
            Add Skill
          </button>
        </div>
      )}

      {/* Add form */}
      {adding && (
        <SkillForm
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Skill groups */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-bold text-text-muted uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {category}
            </h3>
            <span className="text-xs text-text-subtle">{items.length} skill{items.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3">
            {items.map((skill) => (
              <div key={skill.id}>
                {editingId === skill.id ? (
                  <SkillForm
                    initial={{ name: skill.name, category: skill.category ?? 'Frontend', level: skill.level }}
                    onSave={(data) => handleUpdate(skill.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center gap-3 group px-3 py-2.5 rounded-xl hover:bg-glass transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-text">{skill.name}</span>
                        <span className="text-xs text-text-subtle">{LEVEL_LABELS[skill.level]}</span>
                      </div>
                      <SkillLevel level={skill.level} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingId(skill.id)}
                        className="p-1.5 rounded-lg hover:bg-purple/10 text-text-subtle hover:text-purple-bright transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-subtle hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add button */}
      {!adding && skills.length > 0 && (
        <button
          onClick={() => setAdding(true)}
          className="btn-secondary w-full justify-center text-sm py-3"
        >
          <Plus size={16} />
          Add Another Skill
        </button>
      )}
    </div>
  )
}
