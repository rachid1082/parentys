-- SQL trigger for auto-creating profiles when users sign up
-- Run this in Supabase SQL Editor

-- First, ensure the profiles table has the correct columns
-- (This assumes the table already exists with these columns)
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'expert';
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role, status, is_admin, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'expert'),
    'pending',
    false,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists (to avoid duplicates)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bootstrap: Create profile for the root admin user if not exists
INSERT INTO public.profiles (user_id, email, role, status, is_admin, created_at, updated_at)
VALUES (
  '32ce58a9-e706-4ffd-88e4-fc61dcef8539',
  'rachid.boukizou@gmail.com',
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
