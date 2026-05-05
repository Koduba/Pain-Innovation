'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/directory/auth/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Account Created Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your account has been created. Please check your email to verify your account.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Next steps:</strong>
          </p>
          <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Check your email for verification</li>
            <li>Click the verification link</li>
            <li>Sign in to complete your profile</li>
          </ol>
        </div>

        <div className="space-y-4">
          <Link
            href="/directory/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In Now
          </Link>
          
          <p className="text-xs text-gray-500">
            You will be redirected to the login page in 3 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
