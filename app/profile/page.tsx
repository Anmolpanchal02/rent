'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      bio: parsedUser.bio || '',
    })
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader 
        transparent
        links={[
          { href: '/properties', label: 'Browse', icon: '🔍' },
          { href: '/favorites', label: 'Favorites', icon: '❤️' },
          { href: '/messages', label: 'Messages', icon: '💬' },
          { href: '/profile', label: 'Profile', icon: '👤', active: true }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-white mb-2">👤 Profile Settings</h2>
          <p className="text-white/80 dark:text-white/60">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="font-bold text-lg mb-4 text-white">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-4 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {getInitials(formData.name)}
              </div>
              <div className="text-center mb-4">
                <p className="text-white font-semibold text-lg">{formData.name}</p>
                <p className="text-white/70 text-sm capitalize">
                  {user?.role === 'owner' ? '🏢 Owner' : user?.role === 'admin' ? '👑 Admin' : '🏠 Tenant'}
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                📷 Change Photo
              </Button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="font-bold text-lg mb-4 text-white">Personal Information</h3>
            <p className="text-white/70 text-sm mb-6">Update your account details</p>
            
            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-white/20 bg-white/5 rounded-xl outline-none focus:border-red-500 transition-colors text-white placeholder-white/50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-white/20 bg-white/5 rounded-xl outline-none text-white/70"
                  value={formData.email}
                  disabled
                />
                <p className="text-xs text-white/60">🔒 Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-white/20 bg-white/5 rounded-xl outline-none focus:border-red-500 transition-colors text-white placeholder-white/50"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Add your phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Bio</label>
                <textarea
                  className="w-full min-h-[100px] px-4 py-3 border-2 border-white/20 bg-white/5 rounded-xl outline-none focus:border-red-500 transition-colors resize-none text-white placeholder-white/50"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                />
              </div>

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-3 font-semibold">
                💾 Save Changes
              </Button>
            </form>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 mt-6 border border-white/20">
          <h3 className="font-bold text-lg mb-4 text-white">⚙️ Account Settings</h3>
          <p className="text-white/70 text-sm mb-6">Manage your account preferences</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-5 border-2 border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔑</div>
                <div>
                  <h4 className="font-semibold text-white">Change Password</h4>
                  <p className="text-sm text-white/70">Update your password regularly for security</p>
                </div>
              </div>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">Change</Button>
            </div>

            <div className="flex justify-between items-center p-5 border-2 border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl">📧</div>
                <div>
                  <h4 className="font-semibold text-white">Email Notifications</h4>
                  <p className="text-sm text-white/70">Manage your email notification preferences</p>
                </div>
              </div>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">Configure</Button>
            </div>

            <div className="flex justify-between items-center p-5 border-2 border-red-400/50 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🚪</div>
                <div>
                  <h4 className="font-semibold text-white">Logout</h4>
                  <p className="text-sm text-white/80">Sign out from your account</p>
                </div>
              </div>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleLogout}>Logout</Button>
            </div>

            <div className="flex justify-between items-center p-5 border-2 border-red-400/50 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🗑️</div>
                <div>
                  <h4 className="font-semibold text-white">Delete Account</h4>
                  <p className="text-sm text-white/80">Permanently delete your account and all data</p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
