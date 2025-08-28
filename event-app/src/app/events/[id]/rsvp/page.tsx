'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, Event, RSVP } from '../../../../../lib/supabase'

export default function RSVPPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string

    const [event, setEvent] = useState<Event | null>(null)
    const [rsvps, setRsvps] = useState<RSVP[]>([])
    const [userRsvp, setUserRsvp] = useState<RSVP | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        checkUser()
        fetchEventAndRsvps()
    }, [eventId])

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    async function fetchEventAndRsvps() {
        try {
            // Fetch event details
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select(`
          *,
          creator:users(name, email)
        `)
                .eq('id', eventId)
                .single()

            if (eventError) throw eventError
            setEvent(eventData)

            // Fetch RSVPs for this event
            const { data: rsvpData, error: rsvpError } = await supabase
                .from('rsvps')
                .select(`
          *,
          user:users(name, email)
        `)
                .eq('event_id', eventId)

            if (rsvpError) throw rsvpError
            setRsvps(rsvpData || [])

            // Check if current user has already RSVP'd
            if (user) {
                const existingRsvp = rsvpData?.find(rsvp => rsvp.user_id === user.id)
                setUserRsvp(existingRsvp || null)
            }

        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleRsvp(status: 'Yes' | 'No' | 'Maybe') {
        if (!user) {
            alert('Please sign in to RSVP')
            return
        }

        setSubmitting(true)
        try {
            if (userRsvp) {
                // Update existing RSVP
                const { error } = await supabase
                    .from('rsvps')
                    .update({ status })
                    .eq('id', userRsvp.id)

                if (error) throw error
            } else {
                // Create new RSVP
                const { error } = await supabase
                    .from('rsvps')
                    .insert({
                        user_id: user.id,
                        event_id: eventId,
                        status
                    })

                if (error) throw error
            }

            // Refresh data
            await fetchEventAndRsvps()
            alert(`RSVP updated to: ${status}`)
        } catch (error) {
            console.error('Error updating RSVP:', error)
            alert('Error updating RSVP. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading event...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
                        <Link href="/events" className="text-blue-600 hover:text-blue-800">
                            ← Back to Events
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const rsvpCounts = {
        Yes: rsvps.filter(r => r.status === 'Yes').length,
        No: rsvps.filter(r => r.status === 'No').length,
        Maybe: rsvps.filter(r => r.status === 'Maybe').length
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Link
                        href="/events"
                        className="group inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Events
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Event Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            {event.title}
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">{event.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Event Details */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white text-sm">ℹ️</span>
                                </span>
                                Event Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-2xl">📅</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-gray-600">
                                            {new Date(event.date).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-2xl">📍</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{event.city}</div>
                                        <div className="text-gray-600">Event Location</div>
                                    </div>
                                </div>

                                <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{event.creator?.name}</div>
                                        <div className="text-gray-600">Event Organizer</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RSVP Summary */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white text-sm">📊</span>
                                </span>
                                RSVP Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">✅</span>
                                        </div>
                                        <span className="font-semibold text-green-700">Attending</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">{rsvpCounts.Yes}</span>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">❓</span>
                                        </div>
                                        <span className="font-semibold text-yellow-700">Maybe</span>
                                    </div>
                                    <span className="text-2xl font-bold text-yellow-600">{rsvpCounts.Maybe}</span>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">❌</span>
                                        </div>
                                        <span className="font-semibold text-red-700">Can't Attend</span>
                                    </div>
                                    <span className="text-2xl font-bold text-red-600">{rsvpCounts.No}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RSVP Actions */}
                    {!user ? (
                        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
                            <div className="text-6xl mb-6">🔐</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h3>
                            <p className="text-gray-600 mb-8 text-lg">Please sign in to RSVP to this amazing event</p>
                            <Link
                                href="/auth"
                                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                            >
                                <span className="mr-2">🚀</span>
                                Sign In to RSVP
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                Your RSVP Response
                            </h3>
                            {userRsvp && (
                                <p className="text-center text-gray-600 mb-6">
                                    Current status: <span className="font-semibold text-blue-600">{userRsvp.status}</span>
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => handleRsvp('Yes')}
                                    disabled={submitting}
                                    className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${userRsvp?.status === 'Yes'
                                            ? 'bg-green-600 text-white shadow-green-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="flex items-center">
                                        <span className="text-2xl mr-3">✅</span>
                                        Yes, I'll attend
                                        {userRsvp?.status === 'Yes' && (
                                            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleRsvp('Maybe')}
                                    disabled={submitting}
                                    className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${userRsvp?.status === 'Maybe'
                                            ? 'bg-yellow-600 text-white shadow-yellow-200'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="flex items-center">
                                        <span className="text-2xl mr-3">❓</span>
                                        Maybe
                                        {userRsvp?.status === 'Maybe' && (
                                            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleRsvp('No')}
                                    disabled={submitting}
                                    className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${userRsvp?.status === 'No'
                                            ? 'bg-red-600 text-white shadow-red-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="flex items-center">
                                        <span className="text-2xl mr-3">❌</span>
                                        Can't attend
                                        {userRsvp?.status === 'No' && (
                                            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Attendees List */}
                {rsvps.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm">👥</span>
                            </span>
                            Who's Coming
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Attending */}
                            {rsvps.filter(rsvp => rsvp.status === 'Yes').length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-green-700 mb-4 flex items-center">
                                        <span className="text-xl mr-2">✅</span>
                                        Attending ({rsvps.filter(rsvp => rsvp.status === 'Yes').length})
                                    </h4>
                                    <div className="space-y-3">
                                        {rsvps.filter(rsvp => rsvp.status === 'Yes').map((rsvp) => (
                                            <div key={rsvp.id} className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white font-semibold">
                                                        {rsvp.user?.name?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900">{rsvp.user?.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Maybe */}
                            {rsvps.filter(rsvp => rsvp.status === 'Maybe').length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-yellow-700 mb-4 flex items-center">
                                        <span className="text-xl mr-2">❓</span>
                                        Maybe ({rsvps.filter(rsvp => rsvp.status === 'Maybe').length})
                                    </h4>
                                    <div className="space-y-3">
                                        {rsvps.filter(rsvp => rsvp.status === 'Maybe').map((rsvp) => (
                                            <div key={rsvp.id} className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white font-semibold">
                                                        {rsvp.user?.name?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900">{rsvp.user?.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}