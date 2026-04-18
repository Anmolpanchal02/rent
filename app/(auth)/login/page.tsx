'use client'

import { LoginForm } from '@/components/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false)

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      const userData = JSON.parse(user)
      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/admin')
      } else if (userData.role === 'owner') {
        router.push('/dashboard')
      } else {
        router.push('/properties')
      }
      return
    }

    if (searchParams.get('registered') === 'true') {
      setShowRegisteredMessage(true)
      setTimeout(() => setShowRegisteredMessage(false), 5000)
    }
  }, [searchParams, router])

  const handleSuccess = (data: any) => {
    // Store token in localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    // Redirect based on role with page reload to ensure state updates
    const role = data.user.role
    if (role === 'admin') {
      window.location.href = '/admin'
    } else if (role === 'owner') {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/properties'
    }
  }

  const handleError = (error: string) => {
    console.error('Login failed:', error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <div className="text-5xl">🏠</div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Smart Rental
          </h1>
          <p className="text-white/90 text-lg">Welcome back! Sign in to continue</p>
        </div>
        
        {showRegisteredMessage && (
          <div className="mb-4 p-4 bg-green-500/90 backdrop-blur-sm border border-green-300/50 rounded-xl text-white text-sm shadow-lg animate-slide-down">
            ✓ Registration successful! Please sign in with your credentials.
          </div>
        )}
        
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20">
          <LoginForm onSuccess={handleSuccess} onError={handleError} />
        </div>
        
        <p className="text-center mt-6 text-white/90 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-white font-semibold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
