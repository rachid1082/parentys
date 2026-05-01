-- Enable RLS on categories table (if not already enabled)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow admins to manage categories" ON categories;
DROP POLICY IF EXISTS "Allow experts to manage categories" ON categories;

-- Policy: Anyone can read categories (public access for front-end)
CREATE POLICY "Allow public read access to categories"
ON categories
FOR SELECT
USING (true);

-- Policy: Admins can insert, update, delete categories
-- Admins are identified by role = 'admin' in profiles table
CREATE POLICY "Allow admins to manage categories"
ON categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Experts can insert, update, delete categories
-- Experts are identified by having a record in the experts table
CREATE POLICY "Allow experts to manage categories"
ON categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM experts
    WHERE experts.profile_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM experts
    WHERE experts.profile_id = auth.uid()
  )
);
