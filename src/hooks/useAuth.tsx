'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import Cookies from 'js-cookie'
import { AuthUser, LoginPayload, RegisterPayload } from '@/types'
import { authService, userService } from '@/services/authService'
import { clearTokens } from '@/lib/apiClient'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean          // true while rehydrating from cookie on first load
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<{ message: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  // Start as TRUE so pages wait for rehydration before making auth decisions
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = Cookies.get('accessToken')
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const res = await userService.getProfile()
      if (res.success && res.data) {
        setUser({
          userId: res.data.id,
          email: res.data.email,
          fullName: res.data.fullName,
          profilePicture: res.data.profilePicture,
          accessToken: token,
          refreshToken: Cookies.get('refreshToken') || '',
        })
      } else {
        clearTokens()
        setUser(null)
      }
    } catch {
      // Token invalid / expired — clear and let pages redirect
      clearTokens()
      setUser(null)
    } finally {
      // Always mark loading done so pages can make routing decisions
      setIsLoading(false)
    }
  }, [])

  // Run once on mount — rehydrates session from cookie
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (payload: LoginPayload) => {
    // Re-throw raw error so callers can inspect err.response.data
    const res = await authService.login(payload)
    if (res.success && res.data) {
      setUser(res.data)
    } else {
      throw new Error(res.error || 'Login failed')
    }
  }

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload)
    if (!res.success) throw new Error(res.error || 'Registration failed')
    return { message: res.message || 'Registration successful' }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
