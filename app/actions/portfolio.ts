'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Profile ──────────────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const updates = {
    full_name: formData.get('full_name') as string,
    headline: formData.get('headline') as string,
    bio: formData.get('bio') as string,
    location: formData.get('location') as string,
    website: formData.get('website') as string,
    github: formData.get('github') as string,
    linkedin: formData.get('linkedin') as string,
    twitter: formData.get('twitter') as string,
    instagram: formData.get('instagram') as string,
    youtube: formData.get('youtube') as string,
    dribbble: formData.get('dribbble') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}

export async function updateAvatar(url: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: url, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}

// ── Skills ────────────────────────────────────────────────────────────────────

export async function addSkill(data: { name: string; category: string; level: number }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('skills').insert({
    profile_id: user.id,
    name: data.name,
    category: data.category,
    level: data.level,
  })

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function updateSkill(id: string, data: { name: string; category: string; level: number }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('skills')
    .update({ name: data.name, category: data.category, level: data.level })
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function addProject(data: {
  title: string
  description: string
  tech_stack: string[]
  github_url: string
  live_url: string
  featured: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('projects').insert({ profile_id: user.id, ...data })

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function updateProject(
  id: string,
  data: {
    title: string
    description: string
    tech_stack: string[]
    github_url: string
    live_url: string
    featured: boolean
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

// ── Experience ────────────────────────────────────────────────────────────────

export async function addExperience(data: {
  company: string
  role: string
  description: string
  start_date: string
  end_date: string
  is_current: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('experiences').insert({
    profile_id: user.id,
    ...data,
    end_date: data.is_current ? null : data.end_date,
  })

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function updateExperience(
  id: string,
  data: {
    company: string
    role: string
    description: string
    start_date: string
    end_date: string
    is_current: boolean
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('experiences')
    .update({ ...data, end_date: data.is_current ? null : data.end_date })
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

// ── Education ─────────────────────────────────────────────────────────────────

export async function addEducation(data: {
  institution: string
  degree: string
  field: string
  start_year: number
  end_year: number | null
  description: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('education').insert({ profile_id: user.id, ...data })

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function updateEducation(
  id: string,
  data: {
    institution: string
    degree: string
    field: string
    start_year: number
    end_year: number | null
    description: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('education')
    .update(data)
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/builder')
  return { success: true }
}
