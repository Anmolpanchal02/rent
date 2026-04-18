'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { AppHeader } from '@/components/app-header'

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader 
        title="🏠 Smart Rental Admin"
        links={[
          { href: '/admin', label: 'Admin Panel', icon: '🛡️', active: true },
          { href: '/messages', label: 'Messages', icon: '💬' },
          { href: '/profile', label: 'Profile', icon: '👤' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-serif font-bold mb-2">Admin Dashboard 🛡️</h2>
          <p className="text-white/80">Monitor and manage the Smart Rental platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-1">Total Users</div>
            <div className="text-4xl font-bold text-indigo-900">1,234</div>
            <div className="text-xs text-gray-600 mt-2">+45 this week</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-4xl mb-2">🏢</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-1">Total Properties</div>
            <div className="text-4xl font-bold text-indigo-900">567</div>
            <div className="text-xs text-gray-600 mt-2">+12 this week</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-1">Active Bookings</div>
            <div className="text-4xl font-bold text-indigo-900">89</div>
            <div className="text-xs text-gray-600 mt-2">78% occupancy</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-4xl mb-2">🚩</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide mb-1">Flagged Content</div>
            <div className="text-4xl font-bold text-red-600">7</div>
            <div className="text-xs text-red-600 mt-2">Needs review</div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">👥 User Management</h3>
          <p className="text-gray-600 mb-6">Monitor and manage platform users</p>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <span className="text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search users by email or name..."
                className="bg-transparent border-none outline-none w-full text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'John Doe', email: 'john@example.com', role: 'Tenant', roleColor: 'bg-blue-100 text-blue-800', emoji: '👤' },
              { name: 'Jane Smith', email: 'jane@example.com', role: 'Owner', roleColor: 'bg-green-100 text-green-800', emoji: '🏠' },
              { name: 'Mike Johnson', email: 'mike@example.com', role: 'Tenant', roleColor: 'bg-blue-100 text-blue-800', emoji: '👤' },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{user.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">📧 {user.email}</p>
                    <span className={`inline-block px-3 py-1 ${user.roleColor} text-xs rounded-full mt-2 font-medium`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">View Details</Button>
                  <Button size="sm" variant="destructive">🚫 Suspend</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">🚩 Flagged Content</h3>
          <p className="text-gray-600 mb-6">Review and moderate reported content</p>
          
          <div className="space-y-4">
            {[
              { type: 'Property', title: 'Luxury Villa', reporter: 'User123', reason: 'Misleading photos', time: '2 hours ago', emoji: '🏠' },
              { type: 'Message', title: 'Inappropriate content', reporter: 'User456', reason: 'Spam/Harassment', time: '5 hours ago', emoji: '💬' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 border-2 border-red-200 rounded-xl bg-red-50 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{item.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.type}: {item.title}</h4>
                    <p className="text-sm text-gray-600">👤 Reported by: {item.reporter}</p>
                    <p className="text-sm text-gray-600">⚠️ Reason: {item.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">⏰ {item.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-gray-300">Dismiss</Button>
                  <Button size="sm" variant="destructive">🗑️ Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
