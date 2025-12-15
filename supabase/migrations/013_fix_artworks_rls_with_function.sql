-- Fix RLS policies for artworks table using a SECURITY DEFINER function
-- Updated to support JSONB array for public_profile_artworks

-- Create or replace a function to check if an artwork is in a user's public profile
CREATE OR REPLACE FUNCTION is_artwork_publicly_visible(artwork_user_id uuid, artwork_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_enabled boolean;
  artwork_ids_json jsonb;
  artwork_id_text text;
BEGIN
  -- Get user's public profile settings from user_metadata
  SELECT 
    (raw_user_meta_data->>'public_profile_enabled')::boolean = true,
    raw_user_meta_data->'public_profile_artworks'
  INTO profile_enabled, artwork_ids_json
  FROM auth.users
  WHERE id = artwork_user_id;

  -- If profile not enabled or no artworks array, return false early
  IF profile_enabled IS DISTINCT FROM TRUE THEN
    RETURN FALSE;
  END IF;

  IF artwork_ids_json IS NULL OR jsonb_typeof(artwork_ids_json) <> 'array' THEN
    RETURN FALSE;
  END IF;

  -- Iterate JSON array of UUID strings and check if any matches
  FOR artwork_id_text IN
    SELECT jsonb_array_elements_text(artwork_ids_json)
  LOOP
    BEGIN
      IF artwork_id_text::uuid = artwork_id THEN
        RETURN TRUE;
      END IF;
    EXCEPTION
      WHEN others THEN
        -- Ignore invalid UUIDs in the array
        CONTINUE;
    END;
  END LOOP;

  RETURN FALSE;
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

-- Comments for clarity
COMMENT ON FUNCTION is_artwork_publicly_visible(uuid, uuid) IS 
  'Checks if an artwork is publicly visible by checking if the user has public profile enabled and the artwork is in their public_profile_artworks JSON array';

COMMENT ON POLICY "Users can view own artworks" ON artworks IS 
  'Allows authenticated users to view ALL their own artworks in the dashboard, regardless of which ones are selected for public profile';

COMMENT ON POLICY "Public can view featured artworks" ON artworks IS 
  'Allows public read access to ONLY artworks that are in the public_profile_artworks JSON array, and only if the profile is enabled';

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

