# Event Platform Database Design

## Overview
This database design supports a platform where users can register, create events, and RSVP to events. The schema follows relational database best practices with proper normalization and referential integrity.

## Design Choices

### 1. Primary Keys
- **UUID instead of SERIAL**: Used UUID for all primary keys to ensure global uniqueness and better security (no predictable IDs)
- **Default generation**: All UUIDs are auto-generated using `uuid_generate_v4()`

### 2. Foreign Key Relationships
- **events.created_by → users.id**: Links events to their creators
- **rsvps.user_id → users.id**: Links RSVPs to users
- **rsvps.event_id → events.id**: Links RSVPs to events

### 3. Referential Integrity
- **CASCADE DELETE**: When a user is deleted, their events and RSVPs are automatically removed
- **UNIQUE constraint**: Prevents duplicate RSVPs (same user can't RSVP twice to same event)
- **CHECK constraint**: Ensures RSVP status is only 'Yes', 'No', or 'Maybe'

### 4. Data Types & Constraints
- **VARCHAR limits**: Reasonable limits on text fields (name: 100, email: 255, title: 200)
- **UNIQUE email**: Prevents duplicate user registrations
- **NOT NULL**: Required fields are enforced at database level
- **TIMESTAMP WITH TIME ZONE**: Proper timezone handling for global platform

### 5. Performance Optimizations
- **Indexes**: Created on frequently queried columns (foreign keys, dates, cities)
- **Composite unique index**: On (user_id, event_id) for RSVP uniqueness

### 6. Documentation
- **Comments**: Added table and column comments for maintainability
- **Descriptive naming**: Clear, consistent naming convention

## Tables Structure

### Users Table
- Stores basic user information
- Email as unique identifier for login
- Timestamp tracking for user registration

### Events Table
- Complete event information with location and timing
- Links to creator via foreign key
- Supports rich descriptions with TEXT field

### RSVPs Table
- Junction table linking users to events
- Three-state response system (Yes/No/Maybe)
- Prevents duplicate responses with unique constraint

## Security Considerations
- UUIDs prevent ID enumeration attacks
- Foreign key constraints maintain data integrity
- Check constraints prevent invalid data entry
- Proper indexing for query performance

## Scalability Features
- UUID primary keys support distributed systems
- Indexed foreign keys for efficient joins
- Timestamp fields for audit trails
- Flexible TEXT fields for future feature expansion