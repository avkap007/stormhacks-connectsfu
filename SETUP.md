# ConnectSFU Setup Guide

## 🔧 Environment Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for it to finish setting up

2. **Get Supabase Credentials**
   - Go to your project dashboard
   - Navigate to Settings → API
   - Copy the Project URL and anon/public key

3. **Create Environment File**
   ```bash
   # Create .env.local file in the project root
   touch .env.local
   ```

4. **Add Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. **Set up Database Schema**
   ```bash
   # Run the SQL schema in your Supabase SQL editor
   # Copy and paste the contents of supabase-schema-clean.sql
   ```

6. **Configure Authentication**
   - Go to Authentication → Settings in Supabase
   - Enable email confirmations
   - Set up email templates (optional)
   - For development, you can disable email confirmation temporarily

## 🚀 Development Mode

For local development, you can disable email confirmation:
1. Go to Authentication → Settings
2. Turn OFF "Enable email confirmations"
3. This allows immediate login without email verification

## 📧 Email Configuration (Production)

For production, set up email sending:
1. Go to Authentication → Settings
2. Configure SMTP settings or use Supabase's built-in email service
3. Enable email confirmations

## 🔍 Testing Authentication

1. Start the dev server: `npm run dev`
2. Try signing up with an SFU email
3. Check the Supabase dashboard → Authentication → Users to see if users are created
4. Test login with the same credentials
