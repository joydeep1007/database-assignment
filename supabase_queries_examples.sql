-- Useful Queries for Event Platform
-- These demonstrate the database functionality

-- 1. Get all events with creator information
SELECT 
    e.title,
    e.description,
    e.date,
    e.city,
    u.name as creator_name,
    u.email as creator_email
FROM events e
JOIN users u ON e.created_by = u.id
ORDER BY e.date;

-- 2. Get RSVP summary for each event
SELECT 
    e.title,
    e.city,
    e.date,
    COUNT(CASE WHEN r.status = 'Yes' THEN 1 END) as yes_count,
    COUNT(CASE WHEN r.status = 'No' THEN 1 END) as no_count,
    COUNT(CASE WHEN r.status = 'Maybe' THEN 1 END) as maybe_count,
    COUNT(r.id) as total_rsvps
FROM events e
LEFT JOIN rsvps r ON e.id = r.event_id
GROUP BY e.id, e.title, e.city, e.date
ORDER BY e.date;

-- 3. Get all RSVPs for a specific user
SELECT 
    u.name,
    e.title,
    e.date,
    e.city,
    r.status,
    r.created_at as rsvp_date
FROM users u
JOIN rsvps r ON u.id = r.user_id
JOIN events e ON r.event_id = e.id
WHERE u.email = 'debapriya.2003@gmail.com'
ORDER BY e.date;

-- 4. Find events with the most "Yes" RSVPs
SELECT 
    e.title,
    e.city,
    e.date,
    COUNT(r.id) as yes_responses
FROM events e
JOIN rsvps r ON e.id = r.event_id
WHERE r.status = 'Yes'
GROUP BY e.id, e.title, e.city, e.date
ORDER BY yes_responses DESC;

-- 5. Get users who haven't RSVP'd to any events
SELECT 
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN rsvps r ON u.id = r.user_id
WHERE r.id IS NULL;

-- 6. Upcoming events (next 30 days)
SELECT 
    e.title,
    e.description,
    e.date,
    e.city,
    u.name as creator
FROM events e
JOIN users u ON e.created_by = u.id
WHERE e.date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY e.date;