'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { useRouter } from 'next/navigation'

export default function ManagePropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch('/api/owner/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/owner/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProperties(properties.filter(p => p._id !== propertyId))
      }
    } catch (error) {
      console.error('Failed to delete property:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader transparent />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-2">🏢 My Properties</h2>
            <p className="text-white/80 dark:text-white/60">Manage your property listings</p>
          </div>
          <Link href="/properties/create">
            <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold">
              ➕ Add New Property
            </Button>
          </Link>
        </div>

        {/* Properties List */}
        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-12 border border-white/20 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Properties Yet</h3>
            <p className="text-white/70 mb-6">Start by adding your first property listing</p>
            <Link href="/properties/create">
              <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                ➕ Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property Image */}
                  <div className="w-full md:w-48 h-32 rounded-xl flex items-center justify-center text-6xl flex-shrink-0 overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        {getPropertyIcon(property.type)}
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{property.title}</h3>
                        <p className="text-white/70">
                          📍 {property.city}, {property.state}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        property.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {property.status === 'active' ? '✓ Active' : '⏳ Pending'}
                      </span>
                    </div>
                    
                    <p className="text-3xl font-bold text-red-400 mb-3">
                      ₹{property.price?.toLocaleString()}/month
                    </p>
                    
                    <div className="flex gap-4 text-white/80 text-sm mb-4">
                      <span>🛏️ {property.bedrooms} Beds</span>
                      <span>🚿 {property.bathrooms} Baths</span>
                      <span>📐 {property.area} sq ft</span>
                    </div>

                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.slice(0, 4).map((amenity: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-white"
                          >
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 4 && (
                          <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-white">
                            +{property.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/properties/${property._id}/edit`}>
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          ✏️ Edit
                        </Button>
                      </Link>
                      <Link href={`/properties/${property._id}`}>
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          👁️ View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(property._id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right border-l border-white/20 pl-6">
                    <div className="mb-4">
                      <p className="text-white/70 text-sm">Bookings</p>
                      <p className="text-4xl font-bold text-white">{property.bookings || 0}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Views</p>
                      <p className="text-2xl font-semibold text-white">{property.views || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
