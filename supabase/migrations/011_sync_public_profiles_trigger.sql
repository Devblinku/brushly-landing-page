-- Create function to sync public_profiles table when user_metadata changes
-- This automatically keeps the mapping table in sync with user_metadata

CREATE OR REPLACE FUNCTION sync_public_profiles_from_metadata()
RETURNS TRIGGER AS $$
DECLARE
  profile_slug text;
  profile_enabled boolean;
BEGIN
  -- Extract profile settings from user_metadata
  profile_slug := NEW.raw_user_meta_data->>'public_profile_slug';
  profile_enabled := (NEW.raw_user_meta_data->>'public_profile_enabled')::boolean = true;

  -- Only sync if slug exists and profile is enabled
  IF profile_slug IS NOT NULL AND profile_slug != '' AND profile_enabled = true THEN
    -- Insert or update the mapping table
    INSERT INTO public_profiles (user_id, slug, enabled)
    VALUES (NEW.id, LOWER(TRIM(profile_slug)), true)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      slug = EXCLUDED.slug,
      enabled = EXCLUDED.enabled,
      updated_at = NOW();
  ELSE
    -- If profile is disabled or slug is empty, disable in mapping table
    UPDATE public_profiles 
    SET enabled = false, updated_at = NOW()
    WHERE user_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
-- Note: This requires the function to run with elevated privileges
-- You may need to run this manually or use Supabase Dashboard

-- Drop trigger if exists
DROP TRIGGER IF EXISTS sync_public_profiles_trigger ON auth.users;

-- Create trigger
CREATE TRIGGER sync_public_profiles_trigger
  AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_public_profiles_from_metadata();

-- Add comment
COMMENT ON FUNCTION sync_public_profiles_from_metadata() IS 'Automatically syncs public_profiles mapping table when user_metadata changes';
