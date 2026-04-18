'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app-header'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    fetchProperty()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/${params.id}`)
      const data = await res.json()
      if (res.ok) {
        setProperty(data.property)
      }
    } catch (error) {
      console.error('Failed to fetch property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tenant/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: params.id,
          startDate: bookingDates.startDate,
          endDate: bookingDates.endDate
        })
      })

      if (res.ok) {
        alert('Booking request sent successfully!')
        router.push('/properties')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getPropertyEmoji = (type: string) => {
    const emojiMap: any = {
      'apartment': '🏢',
      'house': '🏠',
      'studio': '🚪',
      'villa': '🏰',
      'commercial': '🏬'
    }
    return emojiMap[type?.toLowerCase()] || '🏠'
  }

  const gradients = [
    'from-purple-500 to-indigo-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600'
  ]
  const gradient = gradients[Math.floor(Math.random() * gradients.length)]

  const hasImages = property?.images && property.images.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader 
        links={[
          { href: '/properties', label: 'Browse', icon: '🔍' },
          { href: '/favorites', label: 'Favorites', icon: '❤️' },
          { href: '/messages', label: 'Messages', icon: '💬' },
          { href: '/profile', label: 'Profile', icon: '👤' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="h-96 rounded-2xl overflow-hidden shadow-xl relative">
                {hasImages ? (
                  <img 
                    src={property.images[selectedImageIndex]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-9xl`}>
                    {getPropertyEmoji(property.type)}
                  </div>
                )}
                
                {/* Image Counter */}
                {hasImages && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasImages && property.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {property.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-red-500 scale-105' 
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-400 mb-2">{property.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    📍 {property.location?.address || property.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-500 dark:text-red-400">
                    ₹{property.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">/month</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl mb-1">🛏️</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{property.bedrooms || 2} Beds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🚿</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{property.bathrooms || 2} Baths</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{property.area || 1200} sqft</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 text-indigo-900 dark:text-indigo-400">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {property.description || 'Beautiful property in a prime location with modern amenities and excellent connectivity.'}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-indigo-900 dark:text-indigo-400">Amenities</h3>
                  <div className="flex gap-2 flex-wrap">
                    {property.amenities.map((amenity: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full font-medium">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-indigo-900 dark:text-indigo-400">👤 Property Owner</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {property.owner?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">{property.owner?.name || 'Property Owner'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">📧 {property.owner?.email || 'owner@example.com'}</div>
                  {property.owner?.phone && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">📞 {property.owner.phone}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-xl mb-4 text-indigo-900 dark:text-indigo-400">📅 Book this Property</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:border-indigo-500"
                    value={bookingDates.startDate}
                    onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:border-indigo-500"
                    value={bookingDates.endDate}
                    onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleBooking}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg mb-4"
                disabled={!bookingDates.startDate || !bookingDates.endDate}
              >
                🎯 Request Booking
              </Button>

              <Button 
                variant="outline"
                className="w-full border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-6"
              >
                💬 Message Owner
              </Button>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="text-sm text-green-800 dark:text-green-300">
                  ✓ Verified Property<br/>
                  ✓ No Brokerage<br/>
                  ✓ Instant Booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
