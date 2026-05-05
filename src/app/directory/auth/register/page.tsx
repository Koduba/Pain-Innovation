'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DirectoryAuth } from '@/lib/auth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    institution: '',
    jobRole: '',
    nationality: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await DirectoryAuth.signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        professional_email: formData.email,
        institution: formData.institution,
        job_role: formData.jobRole,
        nationality: formData.nationality,
        status: 'PENDING',
        is_public: true,
        show_email_to_connections: false
      })
      router.push('/directory/auth/success')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section - Matching Delphi Cover Style */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-[860px] mx-auto px-6 py-8 text-center">
          <div className="mb-3">
            <span className="inline-block bg-white/13 border border-white/22 rounded-[20px] px-3.5 py-1 text-[11px] tracking-[0.5px] uppercase">
              Join the Network
            </span>
          </div>
          <h1 className="text-[26px] font-semibold tracking-[-0.3px] mb-1">
            Create Your Account
          </h1>
          <p className="text-[15px] text-white/70">
            Connect with pain medicine leaders worldwide
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
                <label htmlFor="fullName" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                  placeholder="Dr. John Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                  placeholder="doctor@hospital.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                    Confirm *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="institution" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                  Institution
                </label>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                  placeholder="Johns Hopkins University"
                  value={formData.institution}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="jobRole" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                    Job Role
                  </label>
                  <input
                    id="jobRole"
                    name="jobRole"
                    type="text"
                    className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                    placeholder="Professor"
                    value={formData.jobRole}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-[11px] font-semibold text-text mb-1.5 uppercase tracking-[0.5px]">
                    Country
                  </label>
                  <input
                    id="nationality"
                    name="nationality"
                    type="text"
                    className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[14px] text-text placeholder-text-hint focus:outline-none focus:border-blue-400"
                    placeholder="United States"
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-800 text-white text-[14px] font-medium rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <span className="text-[13px] text-text-muted">
                Already have an account?{' '}
                <Link href="/directory/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
