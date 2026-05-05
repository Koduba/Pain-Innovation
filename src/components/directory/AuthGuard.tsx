'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DirectoryAuth, AuthUser } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireProfile?: boolean
}

export default function AuthGuard({ children, requireProfile = true }: AuthGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await DirectoryAuth.getCurrentUser()
        
        if (!currentUser) {
          router.push('/directory/auth/login')
          return
        }

        if (requireProfile && !currentUser.profile) {
          router.push('/directory/profile/create')
          return
        }

        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/directory/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state listener
    DirectoryAuth.onAuthStateChange((authUser) => {
      if (!authUser) {
        router.push('/directory/auth/login')
      } else {
        setUser(authUser)
      }
    }).then(({ subscription }) => {
      return () => subscription.unsubscribe()
    })
  }, [router, requireProfile])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireProfile && !user.profile) {
    return null
  }

  return <>{children}</>
}
