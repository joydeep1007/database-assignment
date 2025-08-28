-- Sample Data for Event Platform
-- Run this after creating the schema

-- Insert sample users (10 users)
INSERT INTO users (name, email) VALUES
('Debapriya Das', 'debapriya.2003@gmail.com'),
('Amlan Paul', 'amlan.paul2004@gmail.com'),
('Aryan Sarkar', 'arayan.sarkar2003@gmail.com'),
('Anubhob Dey', 'anubhob.dey2004@gmail.com'),
('Ribhu Das', 'ribhu.das2005@gmail.com'),
('Ananya Nandi', 'ananya.nan2003@gmail.com'),
('Sanjoy Saha', 'sanjoy.saha2000@gmail.com'),
('Haru Das', 'haru.das2006@gmail.com'),
('Isha Shaw', 'isha.shaw2007@gmail.com'),
('Joe Black', 'joe.black2003@gmail.com');

-- Insert sample events (5 events)
-- Note: We'll use subqueries to get user IDs since UUIDs are generated
INSERT INTO events (title, description, date, city, created_by) VALUES
(
    'Tech Meetup: AI & Machine Learning',
    'Join us for an evening of discussions about the latest trends in AI and ML. Network with fellow developers and data scientists.',
    '2025-09-15 18:00:00+00',
    'Kolkata',
    (SELECT id FROM users WHERE email = 'debapriya.2003@gmail.com')
),
(
    'Startup Pitch Night',
    'Local entrepreneurs present their innovative ideas. Great networking opportunity for investors and founders.',
    '2025-09-22 19:00:00+00',
    'Mumbai',
    (SELECT id FROM users WHERE email = 'amlan.paul2004@gmail.com')
),
(
    'Photography Workshop',
    'Learn advanced photography techniques from professional photographers. Bring your camera!',
    '2025-10-05 14:00:00+00',
    'Delhi',
    (SELECT id FROM users WHERE email = 'arayan.sarkar2003@gmail.com')
),
(
    'Coding Bootcamp: Full Stack Development',
    'Intensive weekend bootcamp covering React, Node.js, and MongoDB. Perfect for beginners and intermediate developers.',
    '2025-10-12 10:00:00+00',
    'Bangalore',
    (SELECT id FROM users WHERE email = 'anubhob.dey2004@gmail.com')
),
(
    'Book Club: Modern Literature',
    'Monthly discussion of contemporary novels. This month: "The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid.',
    '2025-10-20 15:00:00+00',
    'Chennai',
    (SELECT id FROM users WHERE email = 'ribhu.das2005@gmail.com')
);
-- Insert sample RSVPs (20+ RSVPs)
-- Mix of Yes/No/Maybe responses across different events and users
INSERT INTO rsvps (user_id, event_id, status) VALUES
-- Tech Meetup RSVPs
((SELECT id FROM users WHERE email = 'amlan.paul2004@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Tech Meetup: AI & Machine Learning'), 'Yes'),
((SELECT id FROM users WHERE email = 'arayan.sarkar2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Tech Meetup: AI & Machine Learning'), 'Yes'),
((SELECT id FROM users WHERE email = 'sanjoy.saha2000@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Tech Meetup: AI & Machine Learning'), 'Maybe'),
((SELECT id FROM users WHERE email = 'ananya.nan2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Tech Meetup: AI & Machine Learning'), 'No'),

-- Startup Pitch Night RSVPs
((SELECT id FROM users WHERE email = 'debapriya.2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Startup Pitch Night'), 'Yes'),
((SELECT id FROM users WHERE email = 'anubhob.dey2004@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Startup Pitch Night'), 'Yes'),
((SELECT id FROM users WHERE email = 'ribhu.das2005@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Startup Pitch Night'), 'Maybe'),
((SELECT id FROM users WHERE email = 'haru.das2006@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Startup Pitch Night'), 'Yes'),
((SELECT id FROM users WHERE email = 'isha.shaw2007@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Startup Pitch Night'), 'No'),

-- Photography Workshop RSVPs
((SELECT id FROM users WHERE email = 'debapriya.2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Photography Workshop'), 'Maybe'),
((SELECT id FROM users WHERE email = 'amlan.paul2004@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Photography Workshop'), 'Yes'),
((SELECT id FROM users WHERE email = 'ribhu.das2005@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Photography Workshop'), 'Yes'),
((SELECT id FROM users WHERE email = 'sanjoy.saha2000@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Photography Workshop'), 'No'),
((SELECT id FROM users WHERE email = 'joe.black2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Photography Workshop'), 'Yes'),

-- Coding Bootcamp RSVPs
((SELECT id FROM users WHERE email = 'arayan.sarkar2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Coding Bootcamp: Full Stack Development'), 'Yes'),
((SELECT id FROM users WHERE email = 'ananya.nan2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Coding Bootcamp: Full Stack Development'), 'Yes'),
((SELECT id FROM users WHERE email = 'haru.das2006@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Coding Bootcamp: Full Stack Development'), 'Maybe'),
((SELECT id FROM users WHERE email = 'isha.shaw2007@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Coding Bootcamp: Full Stack Development'), 'No'),

-- Book Club RSVPs
((SELECT id FROM users WHERE email = 'debapriya.2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Book Club: Modern Literature'), 'Yes'),
((SELECT id FROM users WHERE email = 'amlan.paul2004@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Book Club: Modern Literature'), 'Maybe'),
((SELECT id FROM users WHERE email = 'sanjoy.saha2000@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Book Club: Modern Literature'), 'Yes'),
((SELECT id FROM users WHERE email = 'joe.black2003@gmail.com'), 
 (SELECT id FROM events WHERE title = 'Book Club: Modern Literature'), 'Yes');