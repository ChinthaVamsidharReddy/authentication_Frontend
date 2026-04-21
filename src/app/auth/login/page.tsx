// LoginPage.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { 
  Eye, EyeOff, AlertCircle, Loader2, Mail, 
  ArrowRight, CheckCircle2, Shield
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GOOGLE_OAUTH_URL } from '@/lib/config'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setUnverifiedEmail(null)
    try {
      await login(data)
      toast.success('Welcome back!', { style: { background: '#1e293b', color: '#fff' } })
      router.push('/dashboard')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string }
      const backendMsg = axiosErr?.response?.data?.error || axiosErr?.message || 'Login failed'

      if (backendMsg.includes('EMAIL_NOT_VERIFIED')) {
        setUnverifiedEmail(data.email)
      } else {
        toast.error(backendMsg, { style: { background: '#1e293b', color: '#fff' } })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-sm text-slate-400">Sign in to continue your journey</p>
      </div>

      {/* Email Not Verified Banner */}
      {unverifiedEmail && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 animate-in slide-in-from-top-2">
          <Mail size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400 mb-1">Email not verified</p>
            <p className="text-xs text-slate-400 mb-2">Please verify your email before logging in.</p>
            <Link
              href={`/auth/verify-pending?email=${encodeURIComponent(unverifiedEmail)}`}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 underline"
            >
              Resend verification email →
            </Link>
          </div>
        </div>
      )}

      {/* Google OAuth */}
      <button
        onClick={() => window.location.href = GOOGLE_OAUTH_URL}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white font-medium hover:bg-slate-800 hover:border-white/20 transition-all group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
        <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">or continue with email</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className={`
                w-full bg-slate-950/50 border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500
                focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50
                transition-all
                ${errors.email ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'}
              `}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle size={12} />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <Link 
              href="/auth/forgot-password"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              className={`
                w-full bg-slate-950/50 border rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder-slate-500
                focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50
                transition-all
                ${errors.password ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'}
              `}
              autoComplete="current-password"
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle size={12} />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link 
          href="/auth/register"
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          Create one
        </Link>
      </p>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-4 border-t border-white/5">
        <Shield size={12} />
        <span>Secured by industry-standard encryption</span>
      </div>
    </div>
  )
}