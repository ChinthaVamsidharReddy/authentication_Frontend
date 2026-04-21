'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, XCircle } from 'lucide-react'
import { setTokens } from '@/lib/apiClient'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

function CallbackContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()

  useEffect(() => {
    const token        = params.get('token')
    const refreshToken = params.get('refreshToken')
    const error        = params.get('error')

    if (error) {
      toast.error(decodeURIComponent(error))
      router.replace('/auth/login')
      return
    }

    if (!token || !refreshToken) {
      toast.error('OAuth2 login failed — missing tokens')
      router.replace('/auth/login')
      return
    }

    // Store tokens in cookies (same as normal login)
    setTokens(token, refreshToken)

    // Refresh user state in context then go to dashboard
    refreshUser().then(() => {
      toast.success('Signed in with Google!')
      router.replace('/dashboard')
    }).catch(() => {
      toast.error('Failed to load profile after Google login')
      router.replace('/auth/login')
    })
  }, [params, router, refreshUser])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
         style={{ background: 'var(--color-bg)' }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
           style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)' }}>
        <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
      <p className="text-sm font-medium">Signing you in with Google…</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Please wait a moment
      </p>
    </div>
  )
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'var(--color-bg)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}