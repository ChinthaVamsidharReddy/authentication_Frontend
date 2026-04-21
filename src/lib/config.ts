// Central config — NEXT_PUBLIC_ vars are inlined by Next.js at build time

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Spring Security OAuth2 authorization endpoint.
// IMPORTANT: Because server.servlet.context-path=/api,
// ALL Spring URLs (including security filters) are under /api.
// So the correct OAuth2 URL is: http://localhost:8080/api/oauth2/authorization/google
export const GOOGLE_OAUTH_URL = `${API_URL}/oauth2/authorization/google`