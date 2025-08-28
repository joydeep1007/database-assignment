'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useUser } from './UserProvider'

export default function Navigation() {
  const { user, loading } = useUser()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    if (isSigningOut) return
    
    // Simple confirmation
    if (!confirm('Are you sure you want to sign out?')) {
      return
    }
    
    setIsSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Event Platform
            </Link>
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Event Platform
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/events"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors hover:scale-105 transform duration-200"
            >
              Events
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Welcome, </span>
                  <span className="text-sm font-medium text-gray-900 max-w-32 truncate">
                    {user.email}
                  </span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="group flex items-center text-gray-600 hover:text-red-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <>
                      <svg 
                        className="w-4 h-4 mr-1.5 animate-spin" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            ) : (
              <Link 
                href="/auth"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 font-medium shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
