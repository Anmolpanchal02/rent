'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { useEffect, useState } from 'react'
import { AuthModal } from './auth-modal'

type HeaderProps = {
  title?: string
  links?: Array<{ href: string; label: string; icon?: string; active?: boolean }>
  transparent?: boolean
}

export function AppHeader({ title = '🏠 Smart Rental', links = [], transparent = false }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Check if user is logged in and get role
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    setIsLoggedIn(!!token)
    
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserRole(user.role || '')
        setUserName(user.name || '')
      } catch (e) {
        console.error('Failed to parse user data')
      }
    }
  }, [])

  // Links for non-logged in users
  const guestLinks = [
    { href: '/properties', label: 'Search', icon: '🔍' },
  ]

  // Links for tenant users
  const tenantLinks = [
    { href: '/properties', label: 'Browse', icon: '🔍' },
    { href: '/favorites', label: 'Favorites', icon: '❤️' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/profile', label: 'Profile', icon: '👤' }
  ]

  // Links for owner users
  const ownerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/properties/manage', label: 'Properties', icon: '🏢' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/profile', label: 'Profile', icon: '👤' }
  ]

  // Links for admin users
  const adminLinks = [
    { href: '/admin', label: 'Admin', icon: '👑' },
    { href: '/properties', label: 'Browse', icon: '🔍' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/profile', label: 'Profile', icon: '👤' }
  ]

  // Determine which links to show
  let displayLinks = guestLinks
  
  if (!isLoggedIn) {
    displayLinks = guestLinks
  } else if (links.length > 0) {
    // If links are provided as props, use them
    displayLinks = links
  } else {
    // Otherwise, use role-based links
    switch (userRole) {
      case 'owner':
        displayLinks = ownerLinks
        break
      case 'admin':
        displayLinks = adminLinks
        break
      case 'tenant':
      default:
        displayLinks = tenantLinks
        break
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className={`${transparent ? 'fixed' : 'sticky'} top-0 left-0 right-0 bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-lg z-50 border-b border-white/20 dark:border-white/20 border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-white cursor-pointer hover:text-red-500 dark:hover:text-red-300 transition-colors drop-shadow-lg">
                {title}
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-2 lg:gap-3 items-center">
              {displayLinks.map((link, i) => (
                <Link key={i} href={link.href}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-gray-300 dark:border-white/30 bg-white/50 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/20 backdrop-blur-sm transition-all ${link.active ? 'bg-white/80 dark:bg-white/20 shadow-lg' : ''}`}
                  >
                    {link.icon && <span className="mr-1">{link.icon}</span>}
                    {link.label}
                  </Button>
                </Link>
              ))}
              
              {!isLoggedIn && (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  🔑 Login
                </Button>
              )}
              
              <ThemeToggle />
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg"
                  >
                    {getInitials(userName)}
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
                        </div>
                        {displayLinks.map((link, i) => (
                          <Link key={i} href={link.href}>
                            <button
                              onClick={() => setShowUserMenu(false)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <span>{link.icon}</span>
                              <span>{link.label}</span>
                            </button>
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 mt-2"
                        >
                          <span>🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-gray-900 dark:text-white"
                >
                  <span className="w-6 h-0.5 bg-current rounded-full"></span>
                  <span className="w-6 h-0.5 bg-current rounded-full"></span>
                  <span className="w-6 h-0.5 bg-current rounded-full"></span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Guest) */}
        {showMobileMenu && !isLoggedIn && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden" 
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {displayLinks.map((link, i) => (
                  <Link key={i} href={link.href}>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className="w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex items-center gap-3 font-medium"
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span>{link.label}</span>
                    </button>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setShowMobileMenu(false)
                    setShowAuthModal(true)
                  }}
                  className="w-full text-left px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl flex items-center gap-3 font-medium"
                >
                  <span className="text-xl">🔑</span>
                  <span>Login</span>
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
