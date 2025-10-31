# Supabase Setup Guide

This guide will help you set up Supabase for your Slidex application.

## Step 1: Create a Supabase Project

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up/Sign in** to your account
3. **Create a new project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `slidex`
   - Enter a strong database password
   - Choose your region (preferably closest to you)
   - Click "Create new project"

## Step 2: Get Your Project Keys

1. **Go to Project Settings**
   - Click on "Settings" in the left sidebar
   - Click on "API"

2. **Copy the following keys:**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Stripe Configuration (keep existing)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Application Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3001"
NODE_ENV="development"
```

## Step 4: Set Up Database Tables

1. **Go to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

2. **Create the profiles table:**

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create presentations table
CREATE TABLE public.presentations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  slide_count INTEGER NOT NULL,
  template TEXT NOT NULL,
  content JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for presentations
CREATE POLICY "Users can view own presentations" ON public.presentations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own presentations" ON public.presentations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presentations" ON public.presentations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for purchases
CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add python_api column to presentations table
ALTER TABLE public.presentations
ADD COLUMN python_api BOOLEAN DEFAULT FALSE;

-- Create function to decrement user credits
CREATE OR REPLACE FUNCTION decrement_user_credits(user_id_input uuid, decrement_amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_credits integer;
BEGIN
  UPDATE public.profiles
  SET credits = credits - decrement_amount
  WHERE id = user_id_input
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$;
```

3. **Run the query** by clicking "Run"

## Step 5: Create Storage Bucket

1. **Go to Storage**
   - Click on "Storage" in the left sidebar.

2. **Create a new bucket**
   - Click "Create a new bucket".
   - Enter bucket name: `presentations`
   - Make sure "Public" is checked.
   - Click "Create bucket".

3. **Create storage policies**
   - Go back to the "SQL Editor".
   - Run the following SQL to set up policies for the storage bucket:

```sql
-- Policies for presentations bucket
CREATE POLICY "Users can view own presentation files" ON storage.objects
  FOR SELECT USING (bucket_id = 'presentations' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'presentations' AND auth.uid() = (storage.foldername(name))[1]::uuid);
```

## Step 6: Set Up Authentication

1. **Go to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Settings"

2. **Configure Auth Settings:**
   - **Site URL**: `http://localhost:3001`
   - **Redirect URLs**: `http://localhost:3001/**`
   - Enable "Email confirmations" (optional)
   - Configure any other settings as needed

## Step 7: Test the Setup

1. **Start your development server:**
```bash
npm run dev
```

2. **Try to sign up** with a new account
3. **Check your Supabase dashboard** to see if the user was created
4. **Check the profiles table** to see if the profile was created

## Step 8: Production Setup

For production deployment:

1. **Update your environment variables** with production Supabase URL
2. **Update Site URL** in Supabase dashboard to your production domain
3. **Update Redirect URLs** to match your production domain
4. **Consider enabling email confirmations** for production

## Troubleshooting

### Common Issues:

1. **"Invalid JWT" errors**
   - Make sure your SUPABASE_SERVICE_ROLE_KEY is correct
   - Check that your environment variables are loaded

2. **"Row Level Security" errors**
   - Make sure RLS policies are set up correctly
   - Check that the user is authenticated

3. **"Table doesn't exist" errors**
   - Make sure you ran the SQL setup commands
   - Check that tables were created in the "public" schema

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)
- Check the browser console for error messages
