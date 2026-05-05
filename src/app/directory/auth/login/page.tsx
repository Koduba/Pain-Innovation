'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DirectoryAuth } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await DirectoryAuth.signIn(email, password)
      router.push('/directory')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section - Matching Delphi Cover Style */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-[860px] mx-auto px-6 py-8 text-center">
          <h1 className="text-[26px] font-semibold tracking-[-0.3px] mb-1">
            Welcome Back
          </h1>
          <p className="text-[15px] text-white/70">
            Sign in to connect with pain medicine leaders
          </p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Form Card */}
          <div className="bg-surface border border-border rounded-[10px] p-6">
            {error && (
              <div className="bg-c1-bg border border-c1/20 text-c1 px-4 py-3 rounded-lg mb-4 text-[13px]">
                {error}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-[12px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                  placeholder="doctor@hospital.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[12px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 text-blue-600 accent-blue-600 border-border rounded"
                  />
                  <span className="ml-2 text-text-muted">Remember me</span>
                </label>

                <Link href="/directory/auth/reset-password" className="text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-800 text-white text-[14px] font-medium rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <span className="text-[13px] text-text-muted">
                Don't have an account?{' '}
                <Link href="/directory/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
