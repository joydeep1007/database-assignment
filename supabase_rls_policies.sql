-- Row Level Security (RLS) Policies for Event Platform
-- Run this after creating the schema and inserting data

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view all other users (for event creators, RSVP lists, etc.)
CREATE POLICY "Users can view all users" ON users
    FOR SELECT
    USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Users can insert their own record (for registration)
CREATE POLICY "Users can insert own record" ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Users cannot delete other users (only admins or self-deletion)
CREATE POLICY "Users can delete own account" ON users
    FOR DELETE
    USING (auth.uid() = id);

-- ============================================================================
-- EVENTS TABLE POLICIES
-- ============================================================================

-- Policy: Anyone can view all events (public events)
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Policy: Event creators can update their own events
CREATE POLICY "Event creators can update own events" ON events
    FOR UPDATE
    USING (auth.uid() = created_by);

-- Policy: Event creators can delete their own events
CREATE POLICY "Event creators can delete own events" ON events
    FOR DELETE
    USING (auth.uid() = created_by);

-- ============================================================================
-- RSVPS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view RSVPs for events they created or their own RSVPs
CREATE POLICY "Users can view relevant RSVPs" ON rsvps
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT created_by FROM events WHERE events.id = rsvps.event_id
        )
    );

-- Policy: Authenticated users can create RSVPs for themselves
CREATE POLICY "Users can create own RSVPs" ON rsvps
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Policy: Users can update their own RSVPs
CREATE POLICY "Users can update own RSVPs" ON rsvps
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own RSVPs
CREATE POLICY "Users can delete own RSVPs" ON rsvps
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- ADDITIONAL SECURITY POLICIES (Optional - for enhanced security)
-- ============================================================================

-- Policy: Prevent users from RSVPing to past events
CREATE POLICY "Cannot RSVP to past events" ON rsvps
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = rsvps.event_id 
            AND events.date > NOW()
        )
    );

-- Policy: Event creators cannot RSVP to their own events (optional business rule)
-- Uncomment if you want this restriction
/*
CREATE POLICY "Event creators cannot RSVP to own events" ON rsvps
    FOR INSERT
    WITH CHECK (
        NOT EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = rsvps.event_id 
            AND events.created_by = auth.uid()
        )
    );
*/