import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  city: string
  created_by: string
  created_at: string
  creator?: User
}

export interface RSVP {
  id: string
  user_id: string
  event_id: string
  status: 'Yes' | 'No' | 'Maybe'
  created_at: string
  user?: User
}