'use client'

import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">

      {/* Left Side (Visual + Info) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden border-r border-white/10">

        {/* Gradient Glow */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-md">

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Secure <span className="text-violet-400">Authentication</span>
          </h1>

          <p className="text-gray-400 mb-8 text-lg">
            Simple and secure authentication system with JWT, OAuth,
            email verification, and session handling.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
              JWT Authentication
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="w-2 h-2 bg-fuchsia-400 rounded-full"></span>
              Google & GitHub Login
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Email Verification
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
              Password Reset
            </div>
          </div>

        </div>
      </div>

      {/* Right Side (Form Card) */}
      <div className="flex-1 flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-white">
              <span className="text-violet-400">Auth</span> System
            </Link>
          </div>

          {/* Form Card */}
          <div className="relative">

            {/* Glow Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-2xl blur-lg opacity-60" />

            <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
              {children}
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}