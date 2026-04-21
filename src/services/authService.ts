import apiClient, { clearTokens, setTokens } from '@/lib/apiClient'
import { ApiResponse, AuthUser, LoginPayload, RegisterPayload, UserProfile } from '@/types'

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthUser>> {
    const { data } = await apiClient.post('/auth/register', payload)
    return data
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthUser>> {
    const { data } = await apiClient.post('/auth/login', payload)
    if (data.success && data.data) {
      setTokens(data.data.accessToken, data.data.refreshToken)
    }
    return data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      clearTokens()
    }
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    const { data } = await apiClient.get(`/auth/verify-email?token=${token}`)
    return data
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const { data } = await apiClient.post('/auth/reset-password', { token, newPassword })
    return data
  },

  async resendVerification(email: string): Promise<ApiResponse> {
    const { data } = await apiClient.post(`/auth/resend-verification?email=${email}`)
    return data
  },
}

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const { data } = await apiClient.get('/users/me')
    return data
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const { data } = await apiClient.put('/users/me', payload)
    return data
  },

  async uploadProfilePicture(file: File): Promise<ApiResponse<UserProfile>> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post('/users/me/profile-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async uploadResume(file: File): Promise<ApiResponse<UserProfile>> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post('/users/me/resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    const { data } = await apiClient.patch('/users/me/change-password', { oldPassword, newPassword })
    return data
  },
}