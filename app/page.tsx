'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app-header'

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tenant/properties')
      if (response.ok) {
        const data = await response.json()
        setFeaturedProperties(data.properties.slice(0, 4))
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setIsLoading(false)
    }
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

  const getPropertyGradient = (index: number) => {
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Header */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 dark:from-indigo-950 dark:via-purple-950 dark:to-indigo-900 overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Header on top of hero */}
        <div className="relative z-10">
          <AppHeader 
            transparent={true}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-2 rounded-full text-xs font-bold mb-6 uppercase tracking-wider">
            <span>🏆</span> India's #1 Rental Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Find Your Perfect<br />
            <span className="text-red-400">Place to Stay</span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Discover verified rooms, flats & houses from trusted owners. No brokerage. Move in today.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-2 max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <span className="text-lg">📍</span>
              <input
                type="text"
                placeholder="City, area or landmark..."
                className="bg-transparent border-none outline-none w-full text-gray-800"
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 min-w-[160px]">
              <span className="text-lg">🏠</span>
              <select className="bg-transparent border-none outline-none w-full text-gray-800">
                <option>All Types</option>
                <option>Room</option>
                <option>Flat</option>
                <option>House</option>
              </select>
            </div>
            <Link href="/properties">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-xl font-bold whitespace-nowrap">
                🔍 Search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">14,280+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Active Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">4,100+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Verified Owners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">32 Cities</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">98.4%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Happy Tenants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">₹0</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Brokerage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-indigo-900 dark:text-indigo-400">Featured Properties</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Hand-picked by our team</p>
          </div>
          <Link href="/properties" className="text-red-500 dark:text-red-400 font-semibold hover:text-red-600 dark:hover:text-red-300">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : featuredProperties.length > 0 ? (
            featuredProperties.map((prop, i) => (
            <Link key={prop._id} href={`/properties/${prop._id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
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
                  <button className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                    <span className="text-2xl">🤍</span>
                  </button>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 dark:text-indigo-400 capitalize">
                    {getPropertyEmoji(prop.type)} {prop.type}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-red-500 dark:text-red-400 mb-1">
                    ₹{prop.price?.toLocaleString()} <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/month</span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{prop.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                    📍 {prop.location?.city}, {prop.location?.state}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <span>🛏️ {prop.bedrooms}</span>
                    <span>🚿 {prop.bathrooms}</span>
                    <span>📐 {prop.area}sqft</span>
                  </div>
                  {prop.owner && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {prop.owner.name?.substring(0, 2).toUpperCase() || 'OK'}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{prop.owner.name || 'Owner'}</span>
                      <span className="ml-auto text-yellow-500 text-sm">⭐ 4.8</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <p className="text-gray-600 dark:text-gray-400">No properties available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 dark:text-indigo-400">How Smart Rental Works</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Find, connect & move in — hassle free</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Search Properties', desc: 'Browse thousands of verified listings filtered by location, budget, and amenities.' },
              { num: '2', title: 'Connect with Owner', desc: 'Message or call verified owners directly. Schedule visits instantly.' },
              { num: '3', title: 'Visit the Property', desc: 'Schedule and attend site visits. Our owners are verified and trustworthy.' },
              { num: '4', title: 'Move In!', desc: 'Sign the agreement digitally and move in. Zero brokerage, full transparency.' },
            ].map((step, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-gray-100">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16 text-center">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Ready to List Your Property?</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
          Join 4,100+ verified owners and get genuine tenants without any middlemen.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
              🔑 List Your Property Free
            </Button>
          </Link>
          <Link href="/properties">
            <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
              🔍 Browse Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-950 dark:bg-black text-white/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-serif font-bold text-white mb-3">🏠 Smart Rental</div>
              <p className="text-sm leading-relaxed">
                India's most trusted rental platform connecting tenants with verified property owners.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Tenants</div>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white cursor-pointer">Browse Properties</div>
                <div className="hover:text-white cursor-pointer">How It Works</div>
                <div className="hover:text-white cursor-pointer">Saved Properties</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Owners</div>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white cursor-pointer">List Property</div>
                <div className="hover:text-white cursor-pointer">Owner Dashboard</div>
                <div className="hover:text-white cursor-pointer">Pricing Plans</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Company</div>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Privacy Policy</div>
                <div className="hover:text-white cursor-pointer">Contact Us</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex justify-between items-center text-sm">
            <span>© 2025 Smart Rental. All rights reserved.</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
