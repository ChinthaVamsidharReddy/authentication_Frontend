'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { authService } from '@/services/authService'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

type FormData = z.infer<typeof schema>

const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
})

  const onSubmit = async ({ email }: FormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="animate-fade-up opacity-0-init text-center" style={{ animationFillMode: 'forwards' }}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
             style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)' }}>
          <CheckCircle size={28} style={{ color: 'var(--color-accent)' }} />
        </div>
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Check your email
        </h2>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          We sent a password reset link to
        </p>
        <p className="text-sm font-medium mb-8" style={{ color: 'var(--color-accent)' }}>
          {getValues('email')}
        </p>
        <Link href="/auth/login" className="sb-btn-ghost inline-flex items-center gap-2 px-6">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-up opacity-0-init" style={{ animationFillMode: 'forwards' }}>
      <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
           style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)' }}>
        <Mail size={22} style={{ color: 'var(--color-accent)' }} />
      </div>
      <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        Forgot password?
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="sb-label">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com"
                 className={`sb-input ${errors.email ? 'error' : ''}`} autoFocus />
          {errors.email && (
            <p className="sb-error-text"><AlertCircle size={12}/>{errors.email.message}</p>
          )}
        </div>
        <button type="submit" className="sb-btn-primary" disabled={isLoading}>
          {isLoading
            ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin"/>Sending…</span>
            : 'Send reset link'}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft size={14}/> Back to sign in
        </Link>
      </div>
    </div>
  )
}