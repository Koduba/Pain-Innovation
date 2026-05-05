'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DirectoryAuth, AuthUser } from '@/lib/auth'
import { DirectoryDatabase } from '@/lib/database/directory-db'

interface DirectoryHeaderProps {
  onSearch: (query: string) => void
  searchQuery: string
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function DirectoryHeader({ 
  onSearch, 
  searchQuery, 
  viewMode, 
  onViewModeChange 
}: DirectoryHeaderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await DirectoryAuth.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        
        if (currentUser.profile) {
          // Load notifications
          const [messages, connections] = await Promise.all([
            DirectoryDatabase.getUnreadMessageCount(currentUser.profile.id),
            DirectoryDatabase.getPendingConnections(currentUser.profile.id)
          ])
          
          setUnreadCount(messages)
          setPendingRequests(connections.length)
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await DirectoryAuth.signOut()
      router.push('/directory/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get('search') as string
    onSearch(query)
  }

  return (
    <>
      {/* Top Bar - Matching Delphi Survey Style */}
      <header className="sticky top-0 z-50 bg-blue-900 border-b border-white/[0.08]">
        <div className="max-w-[860px] mx-auto px-6">
          <div className="flex items-center gap-4 h-[52px]">
            {/* Logo */}
            <Link href="/directory" className="flex-shrink-0">
              <span className="text-[13px] font-medium text-white/[0.85] whitespace-nowrap">
                Pain Medicine Directory
              </span>
            </Link>
            
            {/* Search Bar - Center */}
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-white/55" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search professionals..."
                  className="block w-full pl-9 pr-3 py-1.5 bg-white/10 border border-white/[0.18] rounded-md text-[13px] text-white placeholder-white/35 focus:outline-none focus:border-white/45"
                />
              </form>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex items-center gap-2 text-[13px] rounded-md hover:bg-white/10 p-1.5 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xs border border-white/20">
                      {user.profile?.full_name.charAt(0) || user.email.charAt(0)}
                    </div>
                    <span className="hidden md:block text-white/85 font-medium">
                      {user.profile?.full_name?.split(' ')[0] || user.email}
                    </span>
                    <svg className="h-3 w-3 text-white/55" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showMobileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface rounded-[10px] shadow-lg py-1 z-50 border border-border">
                      <Link
                        href="/directory/profile"
                        className="block px-4 py-2 text-[13px] text-text hover:bg-bg"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/directory/settings"
                        className="block px-4 py-2 text-[13px] text-text hover:bg-bg"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-[13px] text-text hover:bg-bg"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/directory/auth/login"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-blue-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Section Navigation - Matching Delphi Style */}
      <nav className="sticky top-[52px] z-40 bg-surface border-b-2 border-border overflow-x-auto scrollbar-hide">
        <div className="max-w-[860px] mx-auto flex">
          <Link 
            href="/directory" 
            className={`flex-shrink-0 px-[18px] py-3 text-[13px] font-medium whitespace-nowrap border-b-[3px] transition-colors ${
              typeof window !== 'undefined' && window.location.pathname === '/directory' 
                ? 'text-blue-800 border-blue-600' 
                : 'text-text-muted border-transparent hover:text-blue-600'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4caf50]"></span>
              Directory
            </span>
          </Link>
          
          {user?.profile && (
            <>
              <Link 
                href="/directory/messages" 
                className="flex-shrink-0 px-[18px] py-3 text-[13px] font-medium whitespace-nowrap border-b-[3px] border-transparent text-text-muted hover:text-blue-600 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-blue-400' : 'bg-gray-100'}`}></span>
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </span>
              </Link>
              <Link 
                href="/directory/connections" 
                className="flex-shrink-0 px-[18px] py-3 text-[13px] font-medium whitespace-nowrap border-b-[3px] border-transparent text-text-muted hover:text-blue-600 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${pendingRequests > 0 ? 'bg-blue-400' : 'bg-gray-100'}`}></span>
                  Connections
                  {pendingRequests > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">
                      {pendingRequests}
                    </span>
                  )}
                </span>
              </Link>
              <Link 
                href="/directory/groups" 
                className="flex-shrink-0 px-[18px] py-3 text-[13px] font-medium whitespace-nowrap border-b-[3px] border-transparent text-text-muted hover:text-blue-600 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-100"></span>
                  Groups
                </span>
              </Link>
              <Link 
                href="/directory/collaborations" 
                className="flex-shrink-0 px-[18px] py-3 text-[13px] font-medium whitespace-nowrap border-b-[3px] border-transparent text-text-muted hover:text-blue-600 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-100"></span>
                  Collaborations
                </span>
              </Link>
            </>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 ml-auto pr-6">
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md text-[13px] transition-colors ${
                viewMode === 'list' ? 'bg-bg text-blue-600' : 'text-text-muted hover:text-blue-600'
              }`}
              title="List view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md text-[13px] transition-colors ${
                viewMode === 'grid' ? 'bg-bg text-blue-600' : 'text-text-muted hover:text-blue-600'
              }`}
              title="Grid view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
