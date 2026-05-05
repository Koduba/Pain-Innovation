'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/lib/database/directory-types'

interface MessageThreadProps {
  conversation: any
  messages: Message[]
  onSendMessage: (content: string) => void
  currentUserId: string
}

export default function MessageThread({ 
  conversation, 
  messages, 
  onSendMessage, 
  currentUserId 
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      await onSendMessage(newMessage.trim())
      setNewMessage('')
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center">
          {conversation.profile_picture && conversation.profile_picture.length > 0 ? (
            <img
              src={conversation.profile_picture[0]}
              alt={conversation.full_name}
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm mr-3">
              {conversation.full_name
                .split(' ')
                .map((name: string) => name.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
          
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {conversation.full_name}
            </h2>
            {conversation.institution && (
              <p className="text-sm text-gray-600">{conversation.institution}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-100 rounded-full px-3 py-1">
                <span className="text-xs text-gray-600 font-medium">
                  {formatDate(dateMessages[0].created_at)}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {dateMessages.map((message) => {
                const isOwn = message.sender_id === currentUserId
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      isOwn ? 'order-2' : 'order-1'
                    }`}>
                      <div className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                        isOwn ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatMessageTime(message.created_at)}</span>
                        {isOwn && (
                          <span className="ml-2">
                            {message.is_read ? 'Read' : 'Sent'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t px-6 py-4">
        <form onSubmit={handleSend} className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
