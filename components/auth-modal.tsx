'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { LoginForm } from './auth/login-form'
import { RegisterForm } from './auth/register-form'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
  const [successMessage, setSuccessMessage] = useState('')

  if (!isOpen) return null

  const handleSuccess = (data: any) => {
    if (activeTab === 'register') {
      // After registration, switch to login with success message
      setSuccessMessage('Account created successfully! Please sign in.')
      setActiveTab('login')
    } else {
      // After login, store token and reload
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.location.reload()
    }
  }

  const handleError = (error: string) => {
    console.error('Auth error:', error)
  }

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setSuccessMessage('') // Clear success message when switching tabs
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
        </button>

        {/* Header with tabs */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 text-center">
          <div className="text-5xl mb-3">🏠</div>
          <h2 className="text-2xl font-bold text-white mb-4">Smart Rental</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-indigo-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {activeTab === 'login' ? (
            <div>
              <LoginForm onSuccess={handleSuccess} onError={handleError} />
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => handleTabChange('register')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Sign up now
                </button>
              </p>
            </div>
          ) : (
            <div>
              <RegisterForm onSuccess={handleSuccess} onError={handleError} />
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => handleTabChange('login')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
