-- SQL trigger for auto-creating profiles when users sign up
-- Run this in Supabase SQL Editor

-- Step 1: Add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'expert';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, status, is_admin, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'expert'),
    'pending',
    false,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Drop the trigger if it exists (to avoid duplicates)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Bootstrap - Create/update profile for the root admin user
-- First check what columns exist and insert accordingly
INSERT INTO public.profiles (user_id, full_name, role, status, is_admin, created_at, updated_at)
VALUES (
  '32ce58a9-e706-4ffd-88e4-fc61dcef8539',
  'Rachid Boukizou',
  'admin',
  'approved',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  status = 'approved',
  is_admin = true,
  updated_at = NOW();
