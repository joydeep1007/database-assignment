# Deployment Guide - Event Platform

## Prerequisites

1. ✅ Supabase project created and configured
2. ✅ Database schema and sample data loaded
3. ✅ RLS policies applied
4. ✅ Next.js app working locally

## Step 1: Prepare for Deployment

### Update package.json
Make sure your `package.json` includes the Supabase dependency:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18"
  }
}
```

### Environment Variables
Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/event-platform.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a live URL like `https://your-app.vercel.app`

### Option B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

## Step 3: Configure Supabase for Production

### Update Authentication Settings

1. Go to Supabase Dashboard → Authentication → Settings
2. Add your Vercel domain to "Site URL":
   ```
   https://your-app.vercel.app
   ```
3. Add to "Redirect URLs":
   ```
   https://your-app.vercel.app/auth/callback
   ```

### Test Authentication Flow

1. Visit your deployed app
2. Try signing up with a new account
3. Check email verification works
4. Test sign in/out functionality

## Step 4: Verify Deployment

### Test Core Features

1. **Homepage** - Should load without errors
2. **Events Page** - Should display sample events
3. **RSVP Functionality** - Should work for authenticated users
4. **Authentication** - Sign up/in should work
5. **Database Connection** - Data should load from Supabase

### Check Console for Errors

Open browser dev tools and check for:
- Network errors
- JavaScript errors
- Failed API calls

## Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Supabase auth settings with new domain

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_`
   - Redeploy after adding variables
   - Check Vercel dashboard for correct values

2. **Supabase Connection Errors**
   - Verify URL and key are correct
   - Check Supabase project is not paused
   - Ensure RLS policies allow public access where needed

3. **Authentication Issues**
   - Check Site URL in Supabase auth settings
   - Verify redirect URLs are correct
   - Test email delivery settings

4. **Build Errors**
   - Check TypeScript errors locally first
   - Ensure all dependencies are in package.json
   - Review build logs in Vercel dashboard

### Debug Commands

```bash
# Test build locally
npm run build

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

## Performance Optimization

### Next.js Optimizations

1. **Image Optimization** - Use Next.js Image component
2. **Code Splitting** - Automatic with App Router
3. **Static Generation** - Use for static pages

### Supabase Optimizations

1. **Database Indexes** - Already included in schema
2. **Connection Pooling** - Enabled by default
3. **Edge Functions** - For complex operations

## Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor page views and performance

### Supabase Monitoring
- Check database usage
- Monitor API requests
- Review error logs

## Security Checklist

- ✅ RLS policies enabled
- ✅ Environment variables secure
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Authentication configured
- ✅ No sensitive data in client code

## Next Steps

1. **Custom Styling** - Enhance UI/UX
2. **Email Templates** - Customize auth emails
3. **Event Creation** - Add event creation form
4. **Notifications** - Email/push notifications
5. **Analytics** - Track user engagement

Your Event Platform is now live! 🎉