'use client'

import { RegisterForm } from '@/components/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const handleSuccess = (data: any) => {
    // Redirect to login after successful registration
    router.push('/login?registered=true')
  }

  const handleError = (error: string) => {
    console.error('Registration failed:', error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <div className="text-5xl">🏠</div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Smart Rental
          </h1>
          <p className="text-white/90 text-lg">Create your account to get started</p>
        </div>
        
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20">
          <RegisterForm onSuccess={handleSuccess} onError={handleError} />
        </div>
        
        <p className="text-center mt-6 text-white/90 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
