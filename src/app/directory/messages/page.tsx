'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DirectoryDatabase } from '@/lib/database/directory-db'
import { DirectoryAuth, AuthUser } from '@/lib/auth'
import { Message, Profile } from '@/lib/database/directory-types'
import AuthGuard from '@/components/directory/AuthGuard'
import MessageThread from '@/components/directory/MessageThread'
import MessageList from '@/components/directory/MessageList'

export default function MessagesPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.profile) {
      loadConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.profile.id)
    }
  }, [selectedConversation])

  const loadUserData = async () => {
    try {
      const currentUser = await DirectoryAuth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const loadConversations = async () => {
    if (!user?.profile?.id) return
    
    setLoading(true)
    try {
      // Get all messages where user is either sender or recipient with profile data
      const { data: allMessages } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (id, full_name, institution, profile_picture),
          recipient:profiles!messages_recipient_id_fkey (id, full_name, institution, profile_picture)
        `)
        .or(`sender_id.eq.${user.profile.id},recipient_id.eq.${user.profile.id}`)
        .order('created_at', { ascending: false })

      if (!allMessages) {
        setConversations([])
        return
      }

      // Group messages by conversation partner
      const conversationsMap = new Map()
      
      const currentProfileId = user.profile!.id
      allMessages.forEach((message: any) => {
        const isSender = message.sender_id === currentProfileId
        const partnerId = isSender ? message.recipient_id : message.sender_id
        const partner = isSender ? message.recipient : message.sender
        
        if (!conversationsMap.has(partnerId) || 
            new Date(message.created_at) > new Date(conversationsMap.get(partnerId).lastMessage.created_at)) {
          conversationsMap.set(partnerId, {
            id: partnerId,
            full_name: partner.full_name,
            institution: partner.institution,
            profile_picture: partner.profile_picture,
            lastMessage: message
          })
        }
      })

      const uniqueConversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime())

      setConversations(uniqueConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (otherProfileId: string) => {
    if (!user?.profile?.id) return
    
    try {
      const messageData = await DirectoryDatabase.getMessages(user.profile.id, otherProfileId)
      setMessages(messageData)
      
      // Mark messages as read
      const unreadMessages = messageData.filter(msg => !msg.is_read && msg.recipient_id === user.profile.id)
      for (const message of unreadMessages) {
        await DirectoryDatabase.markMessageAsRead(message.id)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (content: string) => {
    if (!user?.profile?.id || !selectedConversation?.id) return
    
    try {
      const newMessage = await DirectoryDatabase.sendMessage(
        user.profile.id,
        selectedConversation.id,
        content
      )
      
      setMessages(prev => [newMessage, ...prev])
      
      // Update conversation list
      await loadConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  if (!user) {
    return <AuthGuard>{null}</AuthGuard>
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b">
              <h1 className="text-2xl font-bold text-gray-900 px-6 py-4">
                Messages
              </h1>
            </div>

            <div className="flex h-[calc(100vh-200px)]">
              {/* Conversations List */}
              <div className="w-80 border-r overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4 border rounded animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-sm text-gray-600">
                      Start connecting with other pain medicine leaders to begin messaging.
                    </p>
                  </div>
                ) : (
                  <MessageList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    currentUserId={user.profile.id}
                  />
                )}
              </div>

              {/* Message Thread */}
              <div className="flex-1">
                {selectedConversation ? (
                  <MessageThread
                    conversation={selectedConversation}
                    messages={messages}
                    onSendMessage={sendMessage}
                    currentUserId={user.profile.id}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                      <p className="text-sm text-gray-600">
                        Choose a conversation from the list to start messaging.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
