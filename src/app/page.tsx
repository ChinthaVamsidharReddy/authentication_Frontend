'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold">Auth System</h1>

        <div className="flex gap-3">
          <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-violet-600 px-4 py-1.5 rounded-lg hover:bg-violet-500"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-6">

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Simple & Secure{' '}
            <span className="text-violet-400">Authentication System</span>
          </h1>

          <p className="text-gray-400 text-lg">
            Built with JWT, Google & GitHub OAuth, email verification,
            and secure session management.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-500"
            >
              Create Account
            </Link>

            <Link
              href="/auth/login"
              className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10"
            >
              Login
            </Link>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">

          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-2">JWT Authentication</h3>
            <p className="text-sm text-gray-400">
              Secure login using access and refresh tokens
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-2">OAuth Login</h3>
            <p className="text-sm text-gray-400">
              Sign in with Google and GitHub
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-2">Email Verification</h3>
            <p className="text-sm text-gray-400">
              Token-based email verification system
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-2">Password Reset</h3>
            <p className="text-sm text-gray-400">
              Secure forgot/reset password flow
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-6">
        © 2026 Auth System. All rights reserved.
      </footer>

    </div>
  )
}