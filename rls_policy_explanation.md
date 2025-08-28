# Row Level Security (RLS) Policies Explanation

## Overview
Row Level Security (RLS) in Supabase ensures that users can only access data they're authorized to see. These policies work at the database level and are enforced automatically for all queries.

## Authentication Context
- `auth.uid()` - Returns the UUID of the currently authenticated user
- `auth.role()` - Returns the role of the current user ('authenticated', 'anon', etc.)

## Policy Breakdown

### Users Table Policies

#### 1. "Users can view all users"
- **Purpose**: Allows users to see other users' basic info (needed for event creators, RSVP lists)
- **Access**: SELECT for everyone
- **Reasoning**: Public user profiles are common in event platforms

#### 2. "Users can update own profile"
- **Purpose**: Users can only modify their own profile information
- **Access**: UPDATE only for the profile owner
- **Security**: Prevents users from modifying other users' data

#### 3. "Users can insert own record"
- **Purpose**: Allows user registration
- **Access**: INSERT only when the user ID matches the authenticated user
- **Security**: Prevents creating accounts for other users

#### 4. "Users can delete own account"
- **Purpose**: Self-service account deletion
- **Access**: DELETE only for account owner
- **Security**: Users cannot delete other accounts

### Events Table Policies

#### 1. "Anyone can view events"
- **Purpose**: Public event discovery
- **Access**: SELECT for everyone (including anonymous users)
- **Reasoning**: Events are typically public information

#### 2. "Authenticated users can create events"
- **Purpose**: Only registered users can create events
- **Access**: INSERT for authenticated users only
- **Security**: Prevents anonymous event creation and ensures creator accountability

#### 3. "Event creators can update own events"
- **Purpose**: Event management by creators
- **Access**: UPDATE only for event creators
- **Security**: Prevents unauthorized event modifications

#### 4. "Event creators can delete own events"
- **Purpose**: Event management by creators
- **Access**: DELETE only for event creators
- **Security**: Prevents unauthorized event deletion

### RSVPs Table Policies

#### 1. "Users can view relevant RSVPs"
- **Purpose**: Users see their own RSVPs + event creators see RSVPs for their events
- **Access**: SELECT for RSVP owner or event creator
- **Privacy**: Protects RSVP privacy while allowing event management

#### 2. "Users can create own RSVPs"
- **Purpose**: Users can RSVP to events
- **Access**: INSERT only for authenticated users creating their own RSVP
- **Security**: Prevents fake RSVPs

#### 3. "Users can update own RSVPs"
- **Purpose**: Users can change their RSVP status
- **Access**: UPDATE only for RSVP owner
- **Security**: Prevents tampering with others' RSVPs

#### 4. "Users can delete own RSVPs"
- **Purpose**: Users can cancel their RSVP
- **Access**: DELETE only for RSVP owner
- **Security**: Prevents unauthorized RSVP cancellation

## Enhanced Security Policies

### 1. "Cannot RSVP to past events"
- **Purpose**: Business logic enforcement
- **Prevents**: RSVPs to events that have already occurred
- **Implementation**: Checks event date against current time

### 2. "Event creators cannot RSVP to own events" (Optional)
- **Purpose**: Business rule enforcement
- **Prevents**: Self-RSVPs which might skew attendance numbers
- **Note**: Commented out - enable if needed for your business logic

## Security Benefits

1. **Data Isolation**: Users only see data they should access
2. **Automatic Enforcement**: Policies work for all database access methods
3. **Performance**: Database-level filtering is efficient
4. **Consistency**: Same rules apply whether using Supabase client, REST API, or direct SQL

## Implementation Order

1. Create tables and insert sample data first
2. Enable RLS on all tables
3. Create policies in the order provided
4. Test with different user contexts

## Testing RLS Policies

```sql
-- Test as different users by setting the JWT context
SELECT set_config('request.jwt.claims', '{"sub":"user-uuid-here"}', true);

-- Then run your queries to verify policy enforcement
SELECT * FROM events;
SELECT * FROM rsvps;
```

## Common Gotchas

1. **Anonymous Access**: Some policies allow anonymous users - adjust based on your needs
2. **Policy Order**: More restrictive policies should come after general ones
3. **Performance**: Complex policies can impact query performance
4. **Testing**: Always test policies with different user roles and scenarios