'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import Link from 'next/link'

function VerifyContent() {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleEmailVerification = async () => {
            try {
                // Check for success parameter (from callback)
                const success = searchParams.get('success')
                const error = searchParams.get('error')
                const errorDescription = searchParams.get('error_description')
                
                if (success === 'true') {
                    setVerificationStatus('success')
                    setMessage('Your email has been successfully verified!')
                    return
                }
                
                if (error) {
                    setVerificationStatus('error')
                    setMessage(errorDescription || 'Verification failed')
                    return
                }
                
                // If no URL parameters, check user authentication status
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                
                if (userError) {
                    console.error('Error getting user:', userError)
                    setVerificationStatus('error')
                    setMessage('Error checking verification status')
                    return
                }

                if (user) {
                    // User is authenticated, verification was successful
                    setVerificationStatus('success')
                    setMessage('Your email has been successfully verified!')
                } else {
                    setVerificationStatus('error')
                    setMessage('Unable to verify email status')
                }
            } catch (error) {
                console.error('Verification error:', error)
                setVerificationStatus('error')
                setMessage('An error occurred during verification')
            }
        }

        handleEmailVerification()
    }, [searchParams])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
            <div className="max-w-md mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                    <div className="mb-8">
                        {verificationStatus === 'loading' && (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verifying Your Email
                                </h1>
                                <p className="text-gray-600">
                                    Please wait while we verify your email address...
                                </p>
                            </>
                        )}

                        {verificationStatus === 'success' && (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Email Verified Successfully! 🎉
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    {message}
                                </p>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">
                                        Your email has been verified. You can now close this page and sign in to your account.
                                    </p>
                                    <Link 
                                        href="/auth"
                                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                                    >
                                        Go to Sign In
                                    </Link>
                                </div>
                            </>
                        )}

                        {verificationStatus === 'error' && (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verification Failed
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    {message}
                                </p>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">
                                        Please try again or contact support if the problem persists.
                                    </p>
                                    <Link 
                                        href="/auth"
                                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                                    >
                                        Back to Sign In
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
                <div className="max-w-md mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Loading...
                        </h1>
                        <p className="text-gray-600">
                            Please wait while we prepare the verification page...
                        </p>
                    </div>
                </div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    )
}
