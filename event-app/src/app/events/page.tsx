'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, Event } from '../../../lib/supabase'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:users(name, email)
        `)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading amazing events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Upcoming Events
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Discover amazing events happening near you</p>
            </div>
            <Link 
              href="/"
              className="group flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No upcoming events found</h2>
            <p className="text-gray-600 text-lg mb-8">Check back soon for exciting new events!</p>
            <Link 
              href="/"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h2>
                        <div className="hidden sm:block">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Upcoming
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">{event.description}</p>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600">
                        <div className="flex items-center bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">📅</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">📍</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{event.city}</div>
                            <div className="text-sm text-gray-500">Location</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">👤</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{event.creator?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">Organizer</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center lg:items-end gap-4">
                      <Link
                        href={`/events/${event.id}/rsvp`}
                        className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg flex items-center"
                      >
                        <span className="mr-2">🎟️</span>
                        RSVP Now
                        <svg className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      
                      <div className="text-center lg:text-right">
                        <div className="text-sm text-gray-500">Event ID</div>
                        <div className="font-mono text-xs text-gray-400">{event.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative bottom border */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}