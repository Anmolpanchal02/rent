'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'all',
  })

  useEffect(() => {
    fetchProperties()
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // No token means guest user, just skip fetching favorites
        setFavorites([])
        return
      }

      const res = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!res.ok) {
        // If favorites API fails, just set empty array
        // Don't clear localStorage as user might still be logged in
        setFavorites([])
        return
      }
      
      const data = await res.json()
      setFavorites(data.favorites.map((f: any) => f._id || f))
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
      setFavorites([])
    }
  }

  const toggleFavorite = async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to add favorites')
      return
    }

    const isFavorite = favorites.includes(propertyId)

    try {
      if (isFavorite) {
        // Remove from favorites
        const res = await fetch(`/api/favorites?propertyId=${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          setFavorites(favorites.filter(id => id !== propertyId))
        }
      } else {
        // Add to favorites
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ propertyId })
        })
        if (res.ok) {
          setFavorites([...favorites, propertyId])
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const fetchProperties = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.location) queryParams.append('location', filters.location)
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice)
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice)
      if (filters.propertyType && filters.propertyType !== 'all') {
        queryParams.append('type', filters.propertyType)
      }

      const res = await fetch(`/api/tenant/properties?${queryParams}`)
      const data = await res.json()
      
      if (res.ok) {
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setLoading(true)
    fetchProperties()
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
          { href: '/properties', label: 'Browse', icon: '🔍', active: true },
          { href: '/favorites', label: 'Favorites', icon: '❤️' },
          { href: '/messages', label: 'Messages', icon: '💬' },
          { href: '/profile', label: 'Profile', icon: '👤' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-indigo-900 dark:text-indigo-400 mb-2">Browse Properties</h2>
          <p className="text-gray-600 dark:text-gray-400">Find your perfect place from {properties.length} verified listings</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 text-indigo-900 dark:text-indigo-400">🔍 Search Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
              <span className="text-lg">📍</span>
              <input
                type="text"
                placeholder="City or area..."
                className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-gray-200"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
              <span className="text-lg">💰</span>
              <input
                type="text"
                placeholder="Min price..."
                className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-gray-200"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
              <span className="text-lg">💵</span>
              <input
                type="text"
                placeholder="Max price..."
                className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-gray-200"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
              <span className="text-lg">🏠</span>
              <select 
                className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-gray-200"
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
                <option value="flat">Flat</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => {
              setFilters({ location: '', minPrice: '', maxPrice: '', propertyType: 'all' })
              setTimeout(handleApplyFilters, 100)
            }}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No properties found</p>
            <Button onClick={() => {
              setFilters({ location: '', minPrice: '', maxPrice: '', propertyType: 'all' })
              setTimeout(handleApplyFilters, 100)
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: any, i: number) => {
              const isFavorite = favorites.includes(prop._id)
              return (
                <Link key={prop._id} href={`/properties/${prop._id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
                    <div className="h-48 relative overflow-hidden">
                      {prop.images && prop.images.length > 0 ? (
                        <img 
                          src={prop.images[0]} 
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getPropertyGradient(i)} flex items-center justify-center text-7xl`}>
                          {getPropertyEmoji(prop.type)}
                        </div>
                      )}
                      <button 
                        className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                        onClick={(e) => toggleFavorite(prop._id, e)}
                      >
                        <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
                      </button>
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 dark:text-indigo-400 capitalize">
                        {getPropertyEmoji(prop.type)} {prop.type}
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
                      {prop.amenities && prop.amenities.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4">
                          {prop.amenities.slice(0, 3).map((amenity: string, j: number) => (
                            <span key={j} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full font-medium">
                              {amenity}
                            </span>
                          ))}
                          {prop.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium">
                              +{prop.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <Button className="w-full bg-indigo-900 dark:bg-indigo-700 hover:bg-indigo-800 dark:hover:bg-indigo-600 text-white">View Details</Button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
