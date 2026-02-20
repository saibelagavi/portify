import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return 'Present'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Database',
  'DevOps',
  'Design',
  'AI/ML',
  'Other',
]

export const SOCIAL_PLATFORMS = [
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { id: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/username' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@username' },
  { id: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
  { id: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
]
