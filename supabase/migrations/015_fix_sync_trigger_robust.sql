-- Fix the sync_public_profiles_from_metadata trigger to be more robust
-- This prevents 500 errors when updating user_metadata

-- Drop and recreate the function with better error handling
DROP FUNCTION IF EXISTS sync_public_profiles_from_metadata() CASCADE;

CREATE OR REPLACE FUNCTION sync_public_profiles_from_metadata()
RETURNS TRIGGER AS $$
DECLARE
  profile_slug text;
  profile_enabled boolean;
BEGIN
  -- Extract profile settings from user_metadata
  profile_slug := NEW.raw_user_meta_data->>'public_profile_slug';
  profile_enabled := COALESCE((NEW.raw_user_meta_data->>'public_profile_enabled')::boolean, false);

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
    -- If profile is disabled or slug is empty, disable or delete from mapping table
    -- Use DELETE instead of UPDATE to handle case where row doesn't exist
    DELETE FROM public_profiles WHERE user_id = NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user update
    RAISE WARNING 'Error syncing public_profiles for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
DROP TRIGGER IF EXISTS sync_public_profiles_trigger ON auth.users;

CREATE TRIGGER sync_public_profiles_trigger
  AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_public_profiles_from_metadata();

-- Add comment
COMMENT ON FUNCTION sync_public_profiles_from_metadata() IS 
  'Automatically syncs public_profiles mapping table when user_metadata changes. Errors are logged but do not prevent user updates.';







