-- Event Platform Database Schema for Supabase
-- Created: 2025-08-27

-- Enable UUID extension (Supabase default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RSVPs table
CREATE TABLE rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Yes', 'No', 'Maybe')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id) -- Prevent duplicate RSVPs from same user to same event
);

-- Create indexes for better performance
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_status ON rsvps(status);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Platform users who can create events and RSVP';
COMMENT ON TABLE events IS 'Events created by users that others can RSVP to';
COMMENT ON TABLE rsvps IS 'User responses to events (Yes/No/Maybe)';

COMMENT ON COLUMN users.id IS 'Unique identifier for each user';
COMMENT ON COLUMN users.email IS 'User email address (must be unique)';
COMMENT ON COLUMN events.created_by IS 'Foreign key to users table - event creator';
COMMENT ON COLUMN rsvps.status IS 'RSVP response: Yes, No, or Maybe';