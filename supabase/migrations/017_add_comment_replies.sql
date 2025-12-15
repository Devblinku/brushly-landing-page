-- Add support for comment replies (threading)
-- This allows artists to reply to visitor comments
-- Replies can be fetched publicly (inherits visibility from parent comment)
-- Replies can be created/deleted by authenticated users in dashboard

-- Add parent_id column to support threaded comments
ALTER TABLE artwork_comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES artwork_comments(id) ON DELETE CASCADE;

-- Add index for efficient querying of replies
CREATE INDEX IF NOT EXISTS idx_artwork_comments_parent_id ON artwork_comments(parent_id);

-- Add index for querying top-level comments (where parent_id is null)
CREATE INDEX IF NOT EXISTS idx_artwork_comments_top_level ON artwork_comments(artwork_id, parent_id) WHERE parent_id IS NULL;

-- The existing "Public can view comments on public artworks" policy already covers replies
-- because it checks artwork visibility, which applies to all comments (including replies) on that artwork
-- No additional SELECT policy needed for replies

-- Policy: Artists can create replies on their own artworks (for dashboard/moderator access)
-- This allows artists to reply even if the artwork is not currently public
CREATE POLICY "Artists can reply to comments on own artworks"
  ON artwork_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- This is a reply (has parent_id)
    parent_id IS NOT NULL
    -- Check that the user owns the artwork (artwork_id is in the new row)
    AND EXISTS (
      SELECT 1 FROM artworks
      WHERE artworks.id = artwork_comments.artwork_id
      AND artworks.user_id = auth.uid()
    )
  );

-- Policy: Artists can delete any comment/reply on their own artworks (for moderation)
-- This is in addition to the existing "Users can delete own comments" policy
CREATE POLICY "Artists can delete comments on own artworks"
  ON artwork_comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artworks
      WHERE artworks.id = artwork_comments.artwork_id
      AND artworks.user_id = auth.uid()
    )
  );

-- Add comments
COMMENT ON COLUMN artwork_comments.parent_id IS 'Reference to parent comment for threaded replies. NULL for top-level comments.';
COMMENT ON POLICY "Artists can reply to comments on own artworks" ON artwork_comments IS 
  'Allows artists to create replies on comments for their own artworks. Checks artwork ownership directly from the new row to avoid RLS recursion.';
COMMENT ON POLICY "Artists can delete comments on own artworks" ON artwork_comments IS 
  'Allows artists to delete any comment or reply on their own artworks for moderation purposes.';

