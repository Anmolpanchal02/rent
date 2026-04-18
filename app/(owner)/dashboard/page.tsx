'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { useRouter } from 'next/navigation'

export default function OwnerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    pendingRequests: 0
  })
  const [recentProperties, setRecentProperties] = useState<any[]>([])

  useEffect(() => {
    // Check if user is logged in and is owner
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'owner') {
      router.push('/')
      return
    }
    
    setUser(parsedUser)
    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch('/api/owner/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const properties = data.properties || []
        
        // Calculate stats
        setStats({
          totalProperties: properties.length,
          activeBookings: properties.reduce((sum: number, p: any) => sum + (p.bookings || 0), 0),
          monthlyRevenue: properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0),
          pendingRequests: 0 // This would come from bookings API
        })

        // Get recent properties (last 3)
        setRecentProperties(properties.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const getPropertyIcon = (type: string) => {
    const icons: Record<string, string> = {
      apartment: '🏢',
      house: '🏠',
      villa: '🏰',
      studio: '🚪',
      commercial: '🏬'
    }
    return icons[type] || '🏢'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader transparent />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Banner */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 text-white border border-white/20 dark:border-white/10">
          <h2 className="text-3xl font-serif font-bold mb-2">Welcome back, {user.name}! 👋</h2>
          <p className="text-white/80 dark:text-white/60">Here's what's happening with your properties today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 border border-white/20 dark:border-white/10">
            <div className="text-4xl mb-2">🏢</div>
            <div className="text-white/70 dark:text-white/60 text-sm uppercase tracking-wide mb-1">Total Properties</div>
            <div className="text-4xl font-bold text-white">
              {stats.totalProperties}
            </div>
            <div className="text-xs text-white/50 dark:text-white/40 mt-2">
              {stats.totalProperties === 0 ? 'Add your first property' : 'Active listings'}
            </div>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 border border-white/20 dark:border-white/10">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-white/70 dark:text-white/60 text-sm uppercase tracking-wide mb-1">Active Bookings</div>
            <div className="text-4xl font-bold text-white">{stats.activeBookings}</div>
            <div className="text-xs text-white/50 dark:text-white/40 mt-2">Current tenants</div>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-l-4 border-green-500 border border-white/20 dark:border-white/10">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-white/70 dark:text-white/60 text-sm uppercase tracking-wide mb-1">Monthly Revenue</div>
            <div className="text-4xl font-bold text-white">₹{(stats.monthlyRevenue / 1000).toFixed(1)}K</div>
            <div className="text-xs text-white/50 dark:text-white/40 mt-2">Potential earnings</div>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-l-4 border-red-500 border border-white/20 dark:border-white/10">
            <div className="text-4xl mb-2">⏰</div>
            <div className="text-white/70 dark:text-white/60 text-sm uppercase tracking-wide mb-1">Pending Requests</div>
            <div className="text-4xl font-bold text-white">{stats.pendingRequests}</div>
            <div className="text-xs text-white/50 dark:text-white/40 mt-2">All clear</div>
          </div>
        </div>

        {/* Recent Properties */}
        {recentProperties.length > 0 && (
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/20 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">🏠 Your Recent Properties</h3>
                <p className="text-white/70 dark:text-white/60">Latest property listings</p>
              </div>
              <Link href="/properties/manage">
                <Button variant="outline" className="border-white/30 dark:border-white/20 text-white hover:bg-white/20 dark:hover:bg-white/10">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentProperties.map((property) => (
                <div key={property._id} className="bg-white/5 dark:bg-white/[0.03] border border-white/20 dark:border-white/10 rounded-xl p-4 hover:bg-white/10 dark:hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{getPropertyIcon(property.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{property.title}</h4>
                      <p className="text-white/60 dark:text-white/50 text-xs">📍 {property.location?.city}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 dark:text-red-300 font-bold">₹{property.price?.toLocaleString()}/mo</span>
                    <Link href={`/properties/${property._id}/edit`}>
                      <Button size="sm" variant="outline" className="border-white/30 dark:border-white/20 text-white hover:bg-white/20 dark:hover:bg-white/10 text-xs">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Booking Requests */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/20 dark:border-white/10">
          <h3 className="text-2xl font-bold text-white mb-2">📋 Recent Booking Requests</h3>
          <p className="text-white/70 dark:text-white/60 mb-6">Review and respond to tenant requests</p>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h4 className="text-xl font-bold text-white mb-2">No Booking Requests Yet</h4>
            <p className="text-white/70 dark:text-white/60">When tenants request to book your properties, they'll appear here</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/properties/create">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
              <div className="text-5xl mb-4">➕</div>
              <h3 className="text-xl font-bold mb-2">Add New Property</h3>
              <p className="text-white/80 text-sm mb-4">List a new rental property</p>
              <Button className="w-full bg-white text-indigo-900 hover:bg-gray-100">Create Listing</Button>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">View Analytics</h3>
            <p className="text-white/80 text-sm mb-4">Track your performance metrics</p>
            <Button className="w-full bg-white text-pink-900 hover:bg-gray-100">View Reports</Button>
          </div>

          <Link href="/properties/manage">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-2">Manage Properties</h3>
              <p className="text-white/80 text-sm mb-4">View all your listings</p>
              <Button className="w-full bg-white text-blue-900 hover:bg-gray-100">View Properties</Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
