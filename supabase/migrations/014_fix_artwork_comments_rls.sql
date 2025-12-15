-- Fix RLS policies for artwork_comments table
-- The original policy tries to access auth.users directly which causes permission errors
-- We'll use the is_artwork_publicly_visible function instead

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view comments on public artworks" ON artwork_comments;
DROP POLICY IF EXISTS "Anyone can create comments on public artworks" ON artwork_comments;

-- Re-create public view policy using the function
CREATE POLICY "Public can view comments on public artworks"
  ON artwork_comments
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM artworks
      WHERE artworks.id = artwork_comments.artwork_id
      AND is_artwork_publicly_visible(artworks.user_id, artworks.id)
    )
  );

-- Re-create public insert policy using the function
CREATE POLICY "Anyone can create comments on public artworks"
  ON artwork_comments
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artworks
      WHERE artworks.id = artwork_comments.artwork_id
      AND is_artwork_publicly_visible(artworks.user_id, artworks.id)
    )
  );

-- Users can update their own comments (keep existing)
DROP POLICY IF EXISTS "Users can update own comments" ON artwork_comments;

CREATE POLICY "Users can update own comments"
  ON artwork_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments (keep existing)
DROP POLICY IF EXISTS "Users can delete own comments" ON artwork_comments;

CREATE POLICY "Users can delete own comments"
  ON artwork_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);







