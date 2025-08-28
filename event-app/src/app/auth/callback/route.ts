import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('Callback called with:', { 
    url: requestUrl.toString(),
    error, 
    errorDescription,
    allParams: Object.fromEntries(requestUrl.searchParams.entries())
  })
  
  // If there's an error, redirect to verify page with error
  if (error) {
    const verifyUrl = new URL('/auth/verify', requestUrl.origin)
    verifyUrl.searchParams.set('error', error)
    verifyUrl.searchParams.set('error_description', errorDescription || 'Verification failed')
    return NextResponse.redirect(verifyUrl.toString())
  }
  
  // For email verification, assume success and redirect to verify page
  const verifyUrl = new URL('/auth/verify', requestUrl.origin)
  verifyUrl.searchParams.set('success', 'true')
  return NextResponse.redirect(verifyUrl.toString())
}
