'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                // Sign up
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                })

                if (error) throw error

                if (data.user) {
                    // Insert user profile
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert({
                            id: data.user.id,
                            name,
                            email,
                        })

                    if (profileError) throw profileError

                    alert('Check your email for verification link!')
                }
            } else {
                // Sign in
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error

                router.push('/events')
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        setUser(null)
        router.push('/')
    }

    if (user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-md mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Welcome back!
                        </h1>

                        <div className="text-center mb-6">
                            <p className="text-gray-600">Signed in as:</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                        </div>

                        <div className="space-y-4">
                            <Link
                                href="/events"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                            >
                                Browse Events
                            </Link>

                            <button
                                onClick={handleSignOut}
                                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Sign Out
                            </button>

                            <Link
                                href="/"
                                className="w-full text-center text-blue-600 hover:text-blue-800 block"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="max-w-md mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-white">🎉</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {isSignUp
                                ? 'Join our amazing event platform'
                                : 'Sign in to continue your journey'
                            }
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {isSignUp && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder:text-gray-400"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder:text-gray-400"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder:text-gray-400"
                                placeholder="Enter your password"
                                minLength={6}
                            />
                            {isSignUp && (
                                <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <span className="mr-2">{isSignUp ? '🚀' : '🔑'}</span>
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            {isSignUp
                                ? 'Already have an account? Sign in'
                                : "Don't have an account? Sign up"
                            }
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}