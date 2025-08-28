import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('Callback called with:', { code, error, errorDescription }) // Debug log
  
  // If there's an error, redirect to verify page with error
  if (error) {
    const verifyUrl = new URL('/auth/verify', requestUrl.origin)
    verifyUrl.searchParams.set('error', error)
    verifyUrl.searchParams.set('error_description', errorDescription || 'Verification failed')
    return NextResponse.redirect(verifyUrl.toString())
  }
  
  // If there's a code, try to exchange it for a session
  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce'
      }
    })
    
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        const verifyUrl = new URL('/auth/verify', requestUrl.origin)
        verifyUrl.searchParams.set('error', 'exchange_failed')
        verifyUrl.searchParams.set('error_description', exchangeError.message)
        return NextResponse.redirect(verifyUrl.toString())
      }
      
      // Success - redirect to verify page with success
      const verifyUrl = new URL('/auth/verify', requestUrl.origin)
      verifyUrl.searchParams.set('success', 'true')
      return NextResponse.redirect(verifyUrl.toString())
      
    } catch (err) {
      console.error('Callback error:', err)
      const verifyUrl = new URL('/auth/verify', requestUrl.origin)
      verifyUrl.searchParams.set('error', 'unexpected_error')
      verifyUrl.searchParams.set('error_description', 'An unexpected error occurred')
      return NextResponse.redirect(verifyUrl.toString())
    }
  }
  
  // No code or error - assume success (email link clicked)
  const verifyUrl = new URL('/auth/verify', requestUrl.origin)
  verifyUrl.searchParams.set('success', 'true')
  return NextResponse.redirect(verifyUrl.toString())
}
