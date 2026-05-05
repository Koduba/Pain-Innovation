'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Profile } from '@/lib/database/directory-types'
import { DirectoryDatabase } from '@/lib/database/directory-db'

interface ProfileCardProps {
  profile: Profile
  viewMode: 'grid' | 'list'
  showActions?: boolean
}

export default function ProfileCard({ profile, viewMode, showActions = true }: ProfileCardProps) {
  const [connecting, setConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none')

  const initials = profile.full_name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleConnect = async () => {
    if (connectionStatus !== 'none') return
    
    setConnecting(true)
    try {
      // This would need the current user's profile ID
      // For now, we'll show a placeholder
      console.log('Connecting to:', profile.full_name)
      setConnectionStatus('pending')
    } catch (error) {
      console.error('Error sending connection request:', error)
    } finally {
      setConnecting(false)
    }
  }

  const handleMessage = () => {
    // Navigate to messages with this profile
    console.log('Message:', profile.full_name)
  }

  const handleCollaborate = () => {
    // Open collaboration request modal
    console.log('Collaborate with:', profile.full_name)
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {profile.profile_picture && profile.profile_picture.length > 0 ? (
              <img
                src={profile.profile_picture[0]}
                alt={profile.full_name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {initials}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                  <Link href={`/directory/profile/${profile.id}`}>
                    {profile.full_name}
                  </Link>
                </h3>
                
                <p className="text-sm text-gray-600 mt-1">
                  {profile.job_role && (
                    <span className="font-medium">{profile.job_role}</span>
                  )}
                  {profile.job_role && profile.institution && ' at '}
                  {profile.institution && <span>{profile.institution}</span>}
                </p>

                {profile.role_title && (
                  <p className="text-sm text-indigo-600 font-medium mt-1">
                    {profile.role_title}
                  </p>
                )}

                {/* Location */}
                {(profile.nationality || profile.address) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {profile.nationality && profile.address ? `${profile.address}, ${profile.nationality}` : 
                     profile.nationality || profile.address}
                  </p>
                )}

                {/* Areas of Interest */}
                {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 font-medium">Areas of Interest:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.areas_of_interest.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {interest}
                        </span>
                      ))}
                      {profile.areas_of_interest.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{profile.areas_of_interest.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center space-x-3 mt-3">
                  {profile.linkedin_profile && (
                    <a
                      href={profile.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600"
                      title="LinkedIn"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {profile.twitter_profile && (
                    <a
                      href={profile.twitter_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400"
                      title="Twitter/X"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {profile.publications_link && (
                    <a
                      href={profile.publications_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-600"
                      title="Publications"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={handleConnect}
                    disabled={connecting || connectionStatus !== 'none'}
                    className="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connecting ? 'Sending...' : 
                     connectionStatus === 'pending' ? 'Request Sent' :
                     connectionStatus === 'connected' ? 'Connected' : 'Connect'}
                  </button>
                  
                  <button
                    onClick={handleMessage}
                    className="px-3 py-1 text-sm font-medium rounded-md border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Message
                  </button>
                  
                  <button
                    onClick={handleCollaborate}
                    className="px-3 py-1 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Collaborate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Profile Picture */}
      <div className="flex justify-center mb-4">
        {profile.profile_picture && profile.profile_picture.length > 0 ? (
          <img
            src={profile.profile_picture[0]}
            alt={profile.full_name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-xl">
            {initials}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
          <Link href={`/directory/profile/${profile.id}`}>
            {profile.full_name}
          </Link>
        </h3>
        
        {profile.role_title && (
          <p className="text-sm text-indigo-600 font-medium mt-1">
            {profile.role_title}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-1">
          {profile.job_role}
        </p>

        {profile.institution && (
          <p className="text-sm text-gray-500">
            {profile.institution}
          </p>
        )}

        {/* Location */}
        {(profile.nationality || profile.address) && (
          <p className="text-sm text-gray-500 mt-1">
            {profile.nationality}
          </p>
        )}

        {/* Areas of Interest */}
        {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap justify-center gap-1">
              {profile.areas_of_interest.slice(0, 2).map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {interest}
                </span>
              ))}
              {profile.areas_of_interest.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{profile.areas_of_interest.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-4 space-y-2">
            <button
              onClick={handleConnect}
              disabled={connecting || connectionStatus !== 'none'}
              className="w-full px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting ? 'Sending...' : 
               connectionStatus === 'pending' ? 'Request Sent' :
               connectionStatus === 'connected' ? 'Connected' : 'Connect'}
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={handleMessage}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Message
              </button>
              
              <button
                onClick={handleCollaborate}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Collaborate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
