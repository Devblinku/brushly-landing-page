-- Fix RLS policies for artworks table using a SECURITY DEFINER function
-- This solves the "permission denied for table users" error

-- Create a function to check if an artwork is in a user's public profile
-- This function has SECURITY DEFINER so it can access auth.users table
CREATE OR REPLACE FUNCTION is_artwork_publicly_visible(artwork_user_id uuid, artwork_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_enabled boolean;
  artwork_ids text[];
BEGIN
  -- Get user's public profile settings from user_metadata
  SELECT 
    (raw_user_meta_data->>'public_profile_enabled')::boolean = true,
    (raw_user_meta_data->>'public_profile_artworks')::text[]
  INTO profile_enabled, artwork_ids
  FROM auth.users
  WHERE id = artwork_user_id;

  -- Return true if profile is enabled AND artwork is in the list
  RETURN profile_enabled = true 
    AND artwork_ids IS NOT NULL 
    AND artwork_id::text = ANY(artwork_ids);
END;
$$;

-- Drop the problematic public policy
DROP POLICY IF EXISTS "Public can view featured artworks" ON artworks;

-- Re-create the public policy using the function
CREATE POLICY "Public can view featured artworks"
  ON artworks
  FOR SELECT
  TO public
  USING (is_artwork_publicly_visible(user_id, id));

-- Ensure authenticated users can view their own artworks (for dashboard)
-- This policy should already exist, but we'll recreate it to be safe
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

-- Add comments
COMMENT ON FUNCTION is_artwork_publicly_visible(uuid, uuid) IS 
  'Checks if an artwork is publicly visible by checking if the user has public profile enabled and the artwork is in their public_profile_artworks array';

COMMENT ON POLICY "Users can view own artworks" ON artworks IS 
  'Allows authenticated users to view ALL their own artworks in the dashboard (e.g., all 20 artworks), regardless of which ones are selected for public profile';

COMMENT ON POLICY "Public can view featured artworks" ON artworks IS 
  'Allows public read access to ONLY artworks that are in the public_profile_artworks array (e.g., only the 10 selected artworks), and only if the profile is enabled';

