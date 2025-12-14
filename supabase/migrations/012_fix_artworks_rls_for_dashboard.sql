-- Fix RLS policies for artworks table
-- This ensures authenticated users can always see their own artworks in the dashboard
-- while still allowing public access to ONLY selected featured artworks

-- IMPORTANT: This migration ensures:
-- 1. Authenticated users see ALL their artworks (for dashboard) - regardless of public_profile_artworks selection
-- 2. Public users see ONLY artworks in public_profile_artworks array (for public profile pages)

-- Drop the potentially problematic public policy if it exists
DROP POLICY IF EXISTS "Public can view featured artworks" ON artworks;

-- Re-create the public policy for featured artworks (for public profile pages)
-- This policy ONLY allows viewing artworks that are in the public_profile_artworks array
CREATE POLICY "Public can view featured artworks"
  ON artworks
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = artworks.user_id
      AND auth.users.raw_user_meta_data->>'public_profile_enabled' = 'true'
      AND artworks.id = ANY(
        (auth.users.raw_user_meta_data->>'public_profile_artworks')::text[]::uuid[]
      )
    )
  );

-- Ensure authenticated users can view their own artworks (for dashboard)
-- This allows users to see ALL their artworks, not just the featured ones
DROP POLICY IF EXISTS "Users can view own artworks" ON artworks;

CREATE POLICY "Users can view own artworks"
  ON artworks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure authenticated users can create their own artworks
DROP POLICY IF EXISTS "Users can create own artworks" ON artworks;

CREATE POLICY "Users can create own artworks"
  ON artworks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure authenticated users can update their own artworks
DROP POLICY IF EXISTS "Users can update own artworks" ON artworks;

CREATE POLICY "Users can update own artworks"
  ON artworks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure authenticated users can delete their own artworks
DROP POLICY IF EXISTS "Users can delete own artworks" ON artworks;

CREATE POLICY "Users can delete own artworks"
  ON artworks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comments explaining the policies
COMMENT ON POLICY "Users can view own artworks" ON artworks IS 
  'Allows authenticated users to view ALL their own artworks in the dashboard (e.g., all 20 artworks), regardless of which ones are selected for public profile';

COMMENT ON POLICY "Public can view featured artworks" ON artworks IS 
  'Allows public read access to ONLY artworks that are in the public_profile_artworks array (e.g., only the 10 selected artworks), and only if the profile is enabled';

