-- Create artwork_comments table for public comments on artworks
CREATE TABLE IF NOT EXISTS artwork_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Allow anonymous comments (user_id can be null)
  commenter_name text NOT NULL,
  commenter_email text,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE artwork_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for artwork_comments table
-- Public can view all comments on public artworks
CREATE POLICY "Public can view comments on public artworks"
  ON artwork_comments
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM artworks
      WHERE artworks.id = artwork_comments.artwork_id
      AND EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = artworks.user_id
        AND auth.users.raw_user_meta_data->>'public_profile_enabled' = 'true'
        AND artworks.id = ANY(
          (auth.users.raw_user_meta_data->>'public_profile_artworks')::text[]::uuid[]
        )
      )
    )
  );

-- Anyone (including anonymous) can create comments on public artworks
CREATE POLICY "Anyone can create comments on public artworks"
  ON artwork_comments
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artworks
      WHERE artworks.id = artwork_comments.artwork_id
      AND EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = artworks.user_id
        AND auth.users.raw_user_meta_data->>'public_profile_enabled' = 'true'
        AND artworks.id = ANY(
          (auth.users.raw_user_meta_data->>'public_profile_artworks')::text[]::uuid[]
        )
      )
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON artwork_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON artwork_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artwork_comments_artwork_id ON artwork_comments(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_comments_user_id ON artwork_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_artwork_comments_created_at ON artwork_comments(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_artwork_comments_updated_at
  BEFORE UPDATE ON artwork_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE artwork_comments IS 'Public comments on artworks displayed on artist profiles';
COMMENT ON COLUMN artwork_comments.user_id IS 'User ID if commenter is authenticated, null for anonymous comments';
COMMENT ON COLUMN artwork_comments.commenter_name IS 'Display name of commenter (required for all comments)';
COMMENT ON COLUMN artwork_comments.commenter_email IS 'Email of commenter (optional, for anonymous comments)';
