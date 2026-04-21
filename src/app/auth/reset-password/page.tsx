'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, KeyRound, XCircle } from 'lucide-react'
import { authService } from '@/services/authService'

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Must include uppercase, lowercase and a number'
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
  ]

  const passed = checks.filter((c) => c.pass).length
  const strength = passed <= 1 ? 'Weak' : passed <= 2 ? 'Fair' : passed <= 3 ? 'Good' : 'Strong'
  const strengthColor =
    passed <= 1 ? '#ff5c5c' : passed <= 2 ? '#f0a500' : passed <= 3 ? '#3b9eff' : '#00c896'

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i <= passed ? strengthColor : 'var(--color-surface-2)',
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: strengthColor, minWidth: 40 }}>
          {strength}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5 text-xs">
            {c.pass ? (
              <CheckCircle size={11} style={{ color: '#00c896', flexShrink: 0 }} />
            ) : (
              <XCircle size={11} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            )}
            <span style={{ color: c.pass ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResetPasswordContent() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const newPasswordValue = watch('newPassword', '')

  // No token in URL
  if (!token) {
    return (
      <div className="text-center animate-fade-up opacity-0-init" style={{ animationFillMode: 'forwards' }}>
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(255,92,92,0.15)', border: '1px solid rgba(255,92,92,0.3)' }}
        >
          <XCircle size={28} style={{ color: 'var(--color-error)' }} />
        </div>
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Invalid link
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          This password reset link is missing the token. Please request a new one.
        </p>
        <Link href="/auth/forgot-password" className="sb-btn-primary inline-block px-8">
          Request new link
        </Link>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div
        className="text-center animate-fade-up opacity-0-init"
        style={{ animationFillMode: 'forwards' }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.3)' }}
        >
          <CheckCircle size={28} style={{ color: 'var(--color-accent)' }} />
        </div>
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Password updated!
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link href="/auth/login" className="sb-btn-primary inline-block px-8">
          Sign in now →
        </Link>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await authService.resetPassword(token, data.newPassword)
      if (res.success) {
        setSuccess(true)
        toast.success('Password reset successfully!')
      } else {
        toast.error(res.error || 'Reset failed. Please try again.')
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      const msg = axiosErr?.response?.data?.error || 'Something went wrong. The link may have expired.'
      toast.error(msg)

      // If token expired, offer to get a new link
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
        setTimeout(() => router.push('/auth/forgot-password'), 2500)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-up opacity-0-init" style={{ animationFillMode: 'forwards' }}>
      {/* Icon + heading */}
      <div
        className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
        style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)' }}
      >
        <KeyRound size={22} style={{ color: 'var(--color-accent)' }} />
      </div>

      <h2 className="text-3xl mb-1.5" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        Set new password
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Choose a strong password you haven&apos;t used before.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* New password */}
        <div>
          <label className="sb-label">New Password</label>
          <div className="relative">
            <input
              {...register('newPassword')}
              type={showNew ? 'text' : 'password'}
              placeholder="Min 8 chars, upper + lower + digit"
              className={`sb-input pr-11 ${errors.newPassword ? 'error' : ''}`}
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="sb-error-text">
              <AlertCircle size={12} /> {errors.newPassword.message}
            </p>
          )}
          {/* Live strength meter */}
          <PasswordStrength password={newPasswordValue} />
        </div>

        {/* Confirm password */}
        <div>
          <label className="sb-label">Confirm New Password</label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className={`sb-input pr-11 ${errors.confirmPassword ? 'error' : ''}`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="sb-error-text">
              <AlertCircle size={12} /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button type="submit" className="sb-btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Resetting…
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link
          href="/auth/login"
          className="text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}