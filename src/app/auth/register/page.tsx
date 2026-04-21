'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, AlertCircle, Loader2, GraduationCap, Briefcase, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GOOGLE_OAUTH_URL } from '@/lib/config'

const baseSchema = z.object({
  fullName: z.string().min(2, 'At least 2 characters').max(100),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(60)
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include uppercase, lowercase and a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof baseSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    
  })



  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerErrors({})
    try {
      // Build clean payload — strip confirmPassword, convert graduationYear properly
      const payload = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
      }

      const res = await registerUser(payload)
      toast.success(res.message)
      router.push(`/auth/verify-pending?email=${encodeURIComponent(data.email)}`)
    } catch (err: unknown) {
      // Try to extract backend validation field errors
      const axiosErr = err as {
        response?: { data?: { error?: string; data?: Record<string, string> } }
        message?: string
      }

      const fieldErrors = axiosErr?.response?.data?.data
      const topError = axiosErr?.response?.data?.error

      if (fieldErrors && typeof fieldErrors === 'object') {
        // Backend returned per-field validation errors → show them
        setServerErrors(fieldErrors)
        toast.error('Please fix the errors below')
      } else if (topError) {
        toast.error(topError)
      } else {
        toast.error(err instanceof Error ? err.message : 'Registration failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field: string) => {
    const hasErr = !!(errors as Record<string, unknown>)[field] || !!serverErrors[field]
    return `sb-input ${hasErr ? 'error' : ''}`
  }

  const fieldError = (field: string) => {
    const formErr = (errors as Record<string, { message?: string }>)[field]?.message
    return formErr || serverErrors[field] || null
  }

  return (
    <div className="animate-fade-up opacity-0-init" style={{ animationFillMode: 'forwards' }}>
      <div className="mb-6">
        <h2
          className="text-3xl mb-1.5"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
          }}
        >
          Create account
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Join thousands already bridging skills to careers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Step 1: Credentials ── */}
          <div className="space-y-4 animate-fade-in">

            {/* Google Sign Up — shown immediately, before any form fields */}
            <button type="button"
                    onClick={() => window.location.href = GOOGLE_OAUTH_URL}
                    className="sb-btn-ghost w-full flex items-center justify-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>or create account manually</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="sb-label">Full Name</label>
                <input
                  {...register('fullName')}
                  placeholder="Jane Smith"
                  className={inputClass('fullName')}
                />
                {fieldError('fullName') && (
                  <p className="sb-error-text">
                    <AlertCircle size={12} /> {fieldError('fullName')}
                  </p>
                )}
              </div>
              <div>
                <label className="sb-label">Username</label>
                <input
                  {...register('username')}
                  placeholder="jane_smith"
                  className={inputClass('username')}
                />
                {fieldError('username') && (
                  <p className="sb-error-text">
                    <AlertCircle size={12} /> {fieldError('username')}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="sb-label">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className={inputClass('email')}
                autoComplete="email"
              />
              {fieldError('email') && (
                <p className="sb-error-text">
                  <AlertCircle size={12} /> {fieldError('email')}
                </p>
              )}
            </div>

            <div>
              <label className="sb-label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 chars, upper + lower + digit"
                  className={`${inputClass('password')} pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldError('password') && (
                <p className="sb-error-text">
                  <AlertCircle size={12} /> {fieldError('password')}
                </p>
              )}
            </div>

            <div>
              <label className="sb-label">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className={inputClass('confirmPassword')}
                autoComplete="new-password"
              />
              {fieldError('confirmPassword') && (
                <p className="sb-error-text">
                  <AlertCircle size={12} /> {fieldError('confirmPassword')}
                </p>
              )}
            </div>

            <button
  type="submit"
  className="sb-btn-primary mt-2 w-full"
  disabled={isLoading}
>
  {isLoading ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 size={16} className="animate-spin" />
      Creating...
    </span>
  ) : (
    "Create Account"
  )}
</button>
          </div>
      

      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}