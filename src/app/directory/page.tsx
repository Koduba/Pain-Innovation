'use client'

import { useState, useEffect } from 'react'
import { DirectoryDatabase } from '@/lib/database/directory-db'
import { Profile, DirectorySearchFilters } from '@/lib/database/directory-types'
import DirectoryHeader from '@/components/directory/DirectoryHeader'
import ProfileCard from '@/components/directory/ProfileCard'
import SearchFilters from '@/components/directory/SearchFilters'
import AuthGuard from '@/components/directory/AuthGuard'
import Link from 'next/link'

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DirectorySearchFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadProfiles()
  }, [filters])

  const loadProfiles = async () => {
    setLoading(true)
    try {
      const searchFilters = {
        ...filters,
        query: searchQuery
      }
      const data = await DirectoryDatabase.searchProfiles(searchFilters, 50)
      setProfiles(data)
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters({ ...filters, query })
  }

  const handleFilterChange = (newFilters: DirectorySearchFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section - Matching Delphi Cover Style */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-[860px] mx-auto px-6 py-10">
          <div className="mb-4">
            <span className="inline-block bg-white/13 border border-white/22 rounded-[20px] px-3.5 py-1 text-xs tracking-[0.5px] uppercase">
              Global Network
            </span>
          </div>
          <h1 className="text-[26px] font-semibold tracking-[-0.3px] mb-1">
            Pain Medicine Leaders Directory
          </h1>
          <p className="text-[15px] text-white/70 mb-6">
            Connect with leading pain medicine professionals worldwide
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/10 border border-white/18 rounded-lg p-3 text-center">
              <div className="text-[24px] font-semibold text-white">{loading ? '-' : profiles.length}</div>
              <div className="text-[11px] text-white/55 mt-0.5">Professionals</div>
            </div>
            <div className="bg-white/10 border border-white/18 rounded-lg p-3 text-center">
              <div className="text-[24px] font-semibold text-white">{loading ? '-' : '15+'}</div>
              <div className="text-[11px] text-white/55 mt-0.5">Countries</div>
            </div>
            <div className="bg-white/10 border border-white/18 rounded-lg p-3 text-center">
              <div className="text-[24px] font-semibold text-white">{loading ? '-' : '8+'}</div>
              <div className="text-[11px] text-white/55 mt-0.5">Specialties</div>
            </div>
          </div>
        </div>
      </div>

      <DirectoryHeader 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <div className="max-w-[860px] mx-auto px-6 py-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-[280px] flex-shrink-0">
            <SearchFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Section Header - Matching Delphi Section Header */}
            <div className="bg-blue-800 text-white rounded-[10px_10px_0_0] px-6 py-4">
              <h2 className="text-[15px] font-semibold mb-0.5">
                Directory Results
              </h2>
              <p className="text-[13px] text-white/65">
                {loading ? 'Loading...' : `${profiles.length} professionals found`}
              </p>
            </div>

            {/* Results Content */}
            <div className="bg-surface border border-border border-t-0 rounded-[0_0_10px_10px] overflow-hidden mb-6">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                      <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : profiles.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="mx-auto h-12 w-12 text-text-hint mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-semibold text-text mb-2">No profiles found</h3>
                  <p className="text-[13px] text-text-muted">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-0' : ''}>
                  {profiles.map((profile, index) => (
                    <div key={profile.id} className={index !== profiles.length - 1 ? 'border-b border-border' : ''}>
                      <ProfileCard 
                        profile={profile}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer Navigation */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-hint">
                Showing {profiles.length} results
              </span>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-[13px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
