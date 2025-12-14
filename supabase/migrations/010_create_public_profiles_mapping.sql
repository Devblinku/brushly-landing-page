-- Create public_profiles mapping table for optimized slug lookups
-- This table only stores slug -> user_id mapping for fast queries
-- All actual profile data remains in user_metadata
CREATE TABLE IF NOT EXISTS public_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

-- Public can view enabled profiles (for slug lookups)
CREATE POLICY "Public can view enabled profiles"
  ON public_profiles
  FOR SELECT
  TO public
  USING (enabled = true);

-- Users can manage their own profile entry
CREATE POLICY "Users can manage own profile"
  ON public_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for fast slug lookups (most important!)
CREATE INDEX IF NOT EXISTS idx_public_profiles_slug_enabled ON public_profiles(slug, enabled) WHERE enabled = true;

-- Create trigger for updated_at
CREATE TRIGGER update_public_profiles_updated_at
  BEFORE UPDATE ON public_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public_profiles IS 'Optimized mapping table for fast slug -> user_id lookups. Actual profile data stored in user_metadata.';
COMMENT ON COLUMN public_profiles.slug IS 'Unique slug for public profile URL (e.g., "jane-doe")';
COMMENT ON COLUMN public_profiles.enabled IS 'Whether the public profile is enabled and visible';
COMMENT ON COLUMN public_profiles.user_id IS 'Reference to auth.users.id for fetching user_metadata';
