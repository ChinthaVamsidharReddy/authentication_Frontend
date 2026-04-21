'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '@/services/authService'

function VerifyPendingContent() {
  const params = useSearchParams()
  const email = params.get('email') || ''
  const [resending, setResending] = useState(false)

  const resend = async () => {
    if (!email) return
    setResending(true)
    try {
      await authService.resendVerification(email)
      toast.success('Verification email resent!')
    } catch {
      toast.error('Failed to resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="animate-fade-up opacity-0-init text-center" style={{ animationFillMode: 'forwards' }}>
      {/* Icon */}
      <div className="relative mx-auto mb-8 w-20 h-20">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
             style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)' }}>
          <Mail size={32} style={{ color: 'var(--color-accent)' }} />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full animate-pulse"
             style={{ background: 'var(--color-accent)' }} />
      </div>

      <h2 className="text-3xl mb-3"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        Verify your email
      </h2>
      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
        We sent a verification link to
      </p>
      {email && (
        <p className="text-sm font-medium mb-6" style={{ color: 'var(--color-accent)' }}>
          {email}
        </p>
      )}
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Click the link in your email to activate your account. Check your spam folder if you don&apos;t see it.
      </p>

      <div className="flex flex-col gap-3">
        {email && (
          <button onClick={resend} disabled={resending}
                  className="sb-btn-ghost inline-flex items-center justify-center gap-2 w-full">
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Resending…' : 'Resend email'}
          </button>
        )}
        <Link href="/auth/login" className="text-sm text-center py-2 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}>
          Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default function VerifyPendingPage() {
  return (
    <Suspense>
      <VerifyPendingContent />
    </Suspense>
  )
}