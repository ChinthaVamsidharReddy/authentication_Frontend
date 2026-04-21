'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedPage({ children, allowedRoles }: Props) {
  const { isLoading, isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
           style={{ background: 'var(--color-bg)' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
             style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasRole = user.roles.some(r => allowedRoles.includes(r))
    if (!hasRole) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4"
             style={{ background: 'var(--color-bg)' }}>
          <p className="text-lg font-semibold" style={{ color: 'var(--color-error)' }}>Access Denied</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            You don&apos;t have permission to view this page.
          </p>
        </div>
      )
    }
  }

  return <>{children}</>
}