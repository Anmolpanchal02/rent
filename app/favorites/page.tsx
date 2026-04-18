'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const res = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`/api/favorites?propertyId=${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        setFavorites(favorites.filter(f => f._id !== propertyId))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  const getPropertyEmoji = (type: string) => {
    const emojiMap: any = {
      'apartment': '🏢',
      'house': '🏠',
      'room': '🚪',
      'flat': '🏬',
      'villa': '🏰'
    }
    return emojiMap[type?.toLowerCase()] || '🏠'
  }

  const getPropertyGradient = (index: number) => {
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-violet-500 to-purple-600'
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader 
        links={[
          { href: '/properties', label: 'Browse', icon: '🔍' },
          { href: '/favorites', label: 'Favorites', icon: '❤️', active: true },
          { href: '/messages', label: 'Messages', icon: '💬' },
          { href: '/profile', label: 'Profile', icon: '👤' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-indigo-900 dark:text-indigo-400 mb-2">❤️ My Favorites</h2>
          <p className="text-gray-600 dark:text-gray-400">Properties you've saved for later</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No favorites yet</p>
            <Link href="/properties">
              <Button className="bg-indigo-900 hover:bg-indigo-800">Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((prop: any, i: number) => (
              <Link key={prop._id} href={`/properties/${prop._id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
                  <div className={`h-48 bg-gradient-to-br ${getPropertyGradient(i)} flex items-center justify-center text-7xl relative`}>
                    {getPropertyEmoji(prop.type)}
                    <button 
                      className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      onClick={(e) => removeFavorite(prop._id, e)}
                    >
                      <span className="text-2xl">❤️</span>
                    </button>
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 dark:text-indigo-400 capitalize">
                      {prop.type}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-2xl font-bold text-red-500 dark:text-red-400 mb-2">
                      ₹{prop.price?.toLocaleString()} <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/month</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg">{prop.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                      📍 {prop.location?.address || prop.address}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-3">
                      <span>🛏️ {prop.bedrooms || 2}</span>
                      <span>🚿 {prop.bathrooms || 2}</span>
                      <span>📐 {prop.area || 950}sqft</span>
                    </div>
                    {prop.owner && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {prop.owner.name?.substring(0, 2).toUpperCase() || 'RK'}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {prop.owner.name || 'Property Owner'}
                        </span>
                        <span className="ml-auto text-yellow-500 text-sm">⭐ 4.8</span>
                      </div>
                    )}
                    <Button className="w-full bg-indigo-900 dark:bg-indigo-700 hover:bg-indigo-800 dark:hover:bg-indigo-600 text-white">View Details</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
