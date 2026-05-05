'use client'

import { Profile } from '@/lib/database/directory-types'

interface MessageListProps {
  conversations: any[]
  selectedConversation: any
  onSelectConversation: (conversation: any) => void
  currentUserId: string
}

export default function MessageList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  currentUserId 
}: MessageListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?.id === conversation.id
        const lastMessage = conversation.lastMessage
        
        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {conversation.profile_picture && conversation.profile_picture.length > 0 ? (
                  <img
                    src={conversation.profile_picture[0]}
                    alt={conversation.full_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                    {conversation.full_name
                      .split(' ')
                      .map(name => name.charAt(0))
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium truncate ${
                    isSelected ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {conversation.full_name}
                  </p>
                  {lastMessage?.created_at && (
                    <span className={`text-xs ${
                      isSelected ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {formatTime(lastMessage.created_at)}
                    </span>
                  )}
                </div>
                
                {conversation.institution && (
                  <p className="text-xs text-gray-500 truncate">
                    {conversation.institution}
                  </p>
                )}

                {lastMessage?.content && (
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                    {lastMessage.content}
                  </p>
                )}
              </div>

              {/* Unread indicator */}
              {lastMessage?.is_read === false && lastMessage.recipient_id === currentUserId && (
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
