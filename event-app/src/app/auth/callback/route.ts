import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  // If there's an error, redirect to verify page with error
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/verify?error=${error}&error_description=${encodeURIComponent(errorDescription || 'Verification failed')}`
    )
  }
  
  // If no error, assume success and redirect to verify page
  return NextResponse.redirect(`${requestUrl.origin}/auth/verify?success=true`)
}
