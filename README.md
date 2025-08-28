# Event Platform - Next.js + Supabase

A minimal event platform where users can discover events and RSVP with Yes/No/Maybe responses.

## Features

- 🎉 Browse upcoming events
- ✅ RSVP to events (Yes/No/Maybe)
- 👤 User authentication
- 📊 Real-time RSVP counts

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL scripts in this order:
   - `supabase_event_platform_schema.sql` - Creates tables and constraints
   - `supabase_sample_data.sql` - Inserts sample data
   - `supabase_rls_policies.sql` - Sets up Row Level Security

### 2. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Database Schema

### Tables

- **users**: User profiles (id, name, email, created_at)
- **events**: Events (id, title, description, date, city, created_by)
- **rsvps**: User responses (id, user_id, event_id, status)

### Key Features

- UUID primary keys for security
- Foreign key relationships with CASCADE DELETE
- Unique constraints to prevent duplicate RSVPs
- Check constraints for valid RSVP statuses
- Indexes for performance

## Pages

- `/` - Homepage with platform overview
- `/events` - List all upcoming events
- `/events/[id]/rsvp` - RSVP to specific event
- `/auth` - Sign in/Sign up

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Sample Data

The database includes:
- 10 sample users with Indian names
- 5 events in Indian cities (Kolkata, Mumbai, Delhi, Bangalore, Chennai)
- 22 sample RSVPs with mixed responses

## Development Notes

- Uses Next.js App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase client for database operations
- Real-time updates for RSVP counts