'use client'

import { useRef, useState, useTransition } from 'react'
import { Camera, Save, Globe, Github, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react'
import { updateProfile, updateAvatar } from '@/app/actions/portfolio'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
  userId: string
}

export function ProfileForm({ profile, userId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = getInitials(profile?.full_name ?? profile?.username ?? 'U')

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('portify')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portify').getPublicUrl(path)
      const url = `${data.publicUrl}?t=${Date.now()}`
      setAvatarUrl(url)

      const result = await updateAvatar(url)
      if (result?.error) throw new Error(result.error)
      toast.success('Avatar updated!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Profile saved!')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="glass-card p-6">
        <h2 className="text-base font-bold text-text mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
          Profile Photo
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple/40 to-cyan/30 flex items-center justify-center text-2xl font-bold text-text border-2 border-purple/20">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple border border-purple/50 flex items-center justify-center shadow-glow-sm hover:bg-purple-deep transition-colors"
            >
              {uploading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={13} className="text-white" />
              )}
            </button>
          </div>
          <div>
            <p className="text-sm text-text font-medium mb-1">Upload a photo</p>
            <p className="text-xs text-text-subtle">JPG, PNG or WebP · Max 5MB</p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </div>

      {/* Basic Info */}
      <div className="glass-card p-6">
        <h2 className="text-base font-bold text-text mb-5" style={{ fontFamily: 'var(--font-syne)' }}>
          Basic Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={profile?.full_name ?? ''}
              placeholder="Alex Chen"
              className="glass-input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              name="location"
              defaultValue={profile?.location ?? ''}
              placeholder="San Francisco, CA"
              className="glass-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              defaultValue={profile?.headline ?? ''}
              placeholder="Full Stack Developer · Open to Work"
              className="glass-input"
              maxLength={100}
            />
            <p className="text-xs text-text-subtle mt-1">Shows below your name on your portfolio.</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ''}
              placeholder="Tell the world who you are, what you build, and what drives you..."
              className="glass-input resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-text-subtle mt-1">Max 500 characters.</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Website
            </label>
            <div className="relative">
              <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="url"
                name="website"
                defaultValue={profile?.website ?? ''}
                placeholder="https://yoursite.com"
                className="glass-input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-card p-6">
        <h2 className="text-base font-bold text-text mb-5" style={{ fontFamily: 'var(--font-syne)' }}>
          Social Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'github', icon: Github, placeholder: 'https://github.com/username', label: 'GitHub' },
            { name: 'linkedin', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', label: 'LinkedIn' },
            { name: 'twitter', icon: Twitter, placeholder: 'https://x.com/username', label: 'Twitter / X' },
            { name: 'instagram', icon: Instagram, placeholder: 'https://instagram.com/username', label: 'Instagram' },
            { name: 'youtube', icon: Youtube, placeholder: 'https://youtube.com/@username', label: 'YouTube' },
            { name: 'dribbble', icon: Globe, placeholder: 'https://dribbble.com/username', label: 'Dribbble' },
          ].map(({ name, icon: Icon, placeholder, label }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
                {label}
              </label>
              <div className="relative">
                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
                <input
                  type="url"
                  name={name}
                  defaultValue={(profile as Record<string, string | null> | null)?.[name] ?? ''}
                  placeholder={placeholder}
                  className="glass-input pl-10"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Profile
            </>
          )}
        </button>
      </div>
    </form>
  )
}
