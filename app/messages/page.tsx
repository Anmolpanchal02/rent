'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [message, setMessage] = useState('')

  const conversations = [
    { id: 1, name: 'John Doe', lastMessage: 'Is the property still available?', time: '2m ago', unread: 2, emoji: '👤' },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thank you for accepting my booking!', time: '1h ago', unread: 0, emoji: '👩' },
    { id: 3, name: 'Mike Johnson', lastMessage: 'Can I schedule a viewing?', time: '3h ago', unread: 1, emoji: '👨' },
  ]

  const messages = [
    { id: 1, sender: 'John Doe', text: 'Hi, I\'m interested in your Modern Apartment listing', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Hello! Yes, it\'s still available. Would you like to schedule a viewing?', time: '10:32 AM', isOwn: true },
    { id: 3, sender: 'John Doe', text: 'Is the property still available?', time: '10:35 AM', isOwn: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader 
        links={[
          { href: '/properties', label: 'Browse', icon: '🔍' },
          { href: '/favorites', label: 'Favorites', icon: '❤️' },
          { href: '/messages', label: 'Messages', icon: '💬', active: true },
          { href: '/profile', label: 'Profile', icon: '👤' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-indigo-900 dark:text-indigo-400 mb-2">💬 Messages</h2>
          <p className="text-gray-600 dark:text-gray-400">Chat with property owners and tenants</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          {/* Conversations List */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
              <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-400">Conversations</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-4 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors ${
                    selectedChat === conv.id ? 'bg-indigo-100 dark:bg-indigo-900/30 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{conv.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{conv.name}</h3>
                        {conv.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">⏰ {conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
              <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-400">
                {selectedChat ? `💬 ${conversations.find(c => c.id === selectedChat)?.name}` : 'Select a conversation'}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900" style={{ maxHeight: 'calc(100vh - 480px)' }}>
              {selectedChat ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-md ${
                          msg.isOwn
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-2 ${msg.isOwn ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
            {selectedChat && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:border-indigo-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setMessage('')
                      }
                    }}
                  />
                  <Button 
                    onClick={() => setMessage('')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    📤 Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
