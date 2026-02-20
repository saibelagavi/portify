'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, User, Mail, Lock, AtSign } from 'lucide-react'
import { signUp } from '@/app/actions/auth'
import { toast } from 'sonner'

const initialState = { error: null, success: false }

export default function SignUpPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(signUp, initialState)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    if (state?.success) {
      toast.success('Account created! Welcome to Portify 🎉')
      router.push('/dashboard')
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md">
      <div
        className="glass-card glow-border p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(4,3,13,0.8) 100%)',
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple/20 bg-purple/5 text-purple-bright text-xs font-medium mb-4">
            ✦ Join the community
          </div>
          <h1
            className="text-3xl font-black tracking-tight text-text mb-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Create your account
          </h1>
          <p className="text-text-muted text-sm">Your portfolio is minutes away.</p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                name="fullName"
                required
                placeholder="Alex Chen"
                className="glass-input pl-10"
                minLength={2}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                name="username"
                required
                placeholder="alexchen"
                className="glass-input pl-10"
                pattern="[a-zA-Z0-9_-]+"
                minLength={3}
                maxLength={30}
                title="Only letters, numbers, underscores and hyphens"
              />
            </div>
            <p className="text-text-subtle text-xs mt-1">
              portify.app/u/<span className="text-purple-bright">yourname</span>
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="email"
                name="email"
                required
                placeholder="alex@example.com"
                className="glass-input pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="Min. 8 characters"
                className="glass-input pl-10 pr-10"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Inline error */}
          {state?.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Free Account
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-text-subtle text-xs text-center">
            By signing up you agree to our{' '}
            <span className="text-text-muted">Terms</span> and{' '}
            <span className="text-text-muted">Privacy Policy</span>
          </p>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-subtle text-xs">Already have an account?</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Link href="/signin" className="btn-secondary w-full justify-center">
          Sign In Instead
        </Link>
      </div>
    </div>
  )
}
