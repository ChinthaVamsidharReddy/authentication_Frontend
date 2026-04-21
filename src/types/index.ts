// ── Auth Types ───────────────────────────────────────────────

export type UserRole = 'ROLE_STUDENT' | 'ROLE_RECRUITER' | 'ROLE_ADMIN'

export interface AuthUser {
  userId: number
  email: string
  fullName: string
  profilePicture?: string
  accessToken: string
  refreshToken: string
}

export interface RegisterPayload {
  fullName: string
  username: string
  email: string
  password: string
  phoneNumber?: string
  
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UserProfile {
  id: number
  fullName: string
  username: string
  email: string
  profilePicture?: string
  phoneNumber?: string
  roles: UserRole[]
  emailVerified: boolean
  
}

// ── API Response Wrapper ─────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean
  message?: string
  data?: T
  error?: string
  timestamp: string
}

// ── Validation Errors ────────────────────────────────────────

export interface ValidationErrors {
  [field: string]: string
}