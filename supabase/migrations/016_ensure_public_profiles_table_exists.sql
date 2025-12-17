-- Ensure public_profiles table exists before trigger runs
-- This is a safety check in case migrations run out of order

-- Create public_profiles table if it doesn't exist (from migration 010)
CREATE TABLE IF NOT EXISTS public_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist
DO $$
BEGIN
  -- Public can view enabled profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'public_profiles' 
    AND policyname = 'Public can view enabled profiles'
  ) THEN
    CREATE POLICY "Public can view enabled profiles"
      ON public_profiles
      FOR SELECT
      TO public
      USING (enabled = true);
  END IF;

  -- Users can manage their own profile entry
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'public_profiles' 
    AND policyname = 'Users can manage own profile'
  ) THEN
    CREATE POLICY "Users can manage own profile"
      ON public_profiles
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Ensure index exists
CREATE INDEX IF NOT EXISTS idx_public_profiles_slug_enabled ON public_profiles(slug, enabled) WHERE enabled = true;








