'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center space-y-4">

        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-600">
          Dashboard
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700">
          Welcome! You are successfully logged in 🎉
        </p>

        {/* Info Section */}
        <div className="text-left text-sm space-y-1 text-gray-800">
          <p><strong className="text-black">Status:</strong> Authenticated</p>
          <p><strong className="text-black">Session:</strong> Active</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </div>
  )
}