-- Add RLS policy to allow public read access to artworks in public profiles
-- This policy allows anyone to view artworks that are featured in a user's public profile

-- Drop existing policy if it exists (for idempotency)
DROP POLICY IF EXISTS "Public can view featured artworks" ON artworks;

-- Create policy for public read access to featured artworks
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

-- Add comment
COMMENT ON POLICY "Public can view featured artworks" ON artworks IS 
  'Allows public read access to artworks that are featured in enabled public profiles';
