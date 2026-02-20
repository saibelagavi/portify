'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { signIn } from '@/app/actions/auth'
import { toast } from 'sonner'

const initialState = { error: null, success: false }

export default function SignInPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(signIn, initialState)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    if (state?.success) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md">
      <div
        className="glass-card glow-border p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(4,3,13,0.8) 100%)',
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/20 bg-cyan/5 text-cyan text-xs font-medium mb-4">
            ✦ Welcome back
          </div>
          <h1
            className="text-3xl font-black tracking-tight text-text mb-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Sign in
          </h1>
          <p className="text-text-muted text-sm">Your portfolio is waiting.</p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
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
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="Your password"
                className="glass-input pl-10 pr-10"
                autoComplete="current-password"
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
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-subtle text-xs">New to Portify?</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Link href="/signup" className="btn-secondary w-full justify-center">
          Create Free Account
        </Link>
      </div>
    </div>
  )
}
