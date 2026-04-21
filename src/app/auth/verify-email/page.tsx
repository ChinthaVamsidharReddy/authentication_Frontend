'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { authService } from '@/services/authService'
import { useRef } from 'react'
type Status = 'loading' | 'success' | 'error'

function VerifyEmailContent() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
const calledRef = useRef(false)

useEffect(() => {
  if (!token || calledRef.current) return

  calledRef.current = true

  authService.verifyEmail(token)
    .then((res) => {
      if (res.success) {
        setStatus('success')
        setMessage(res.message || 'Email verified successfully!')
        setTimeout(() => router.push('/auth/login'), 3000)
      } else {
        setStatus('error')
        setMessage(res.error || 'Verification failed.')
      }
    })
    .catch((err) => {
      const msg = err?.response?.data?.error || 'Invalid or expired verification link.'
      setStatus('error')
      setMessage(msg)
    })
}, [token])

  if (status === 'loading') {
    return (
      <div className="text-center animate-fade-up opacity-0-init"
           style={{ animationFillMode: 'forwards' }}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
             style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)' }}>
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        </div>
        <h2 className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Verifying your email…
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Please wait a moment
        </p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center animate-fade-up opacity-0-init"
           style={{ animationFillMode: 'forwards' }}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
             style={{ background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.3)' }}>
          <CheckCircle size={28} style={{ color: 'var(--color-accent)' }} />
        </div>
        <h2 className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Email verified!
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Redirecting to login in 3 seconds…
        </p>
        <Link href="/auth/login" className="sb-btn-primary inline-block px-8 w-auto">
          Sign in now →
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center animate-fade-up opacity-0-init"
         style={{ animationFillMode: 'forwards' }}>
      <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
           style={{ background: 'rgba(255,92,92,0.15)', border: '1px solid rgba(255,92,92,0.3)' }}>
        <XCircle size={28} style={{ color: 'var(--color-error)' }} />
      </div>
      <h2 className="text-2xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        Verification failed
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        {message}
      </p>
      <div className="flex flex-col gap-3">
        <Link href="/auth/login" className="sb-btn-primary inline-block px-8">
          Go to Login
        </Link>
        <Link href="/auth/verify-pending"
              className="text-sm transition-colors"
              style={{ color: 'var(--color-text-muted)' }}>
          Resend verification email
        </Link>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <Loader2 size={28} className="animate-spin mx-auto" style={{ color: 'var(--color-accent)' }} />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}