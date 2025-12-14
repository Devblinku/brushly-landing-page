# Artist Public Profile Setup Guide

## Overview
This guide explains how to set up the artist public profile feature, which allows artists to have public profiles at `brushly.art/artists/[username]` with their artworks and comments.

## Database Migrations

Run the following migrations in order:

1. **008_create_artwork_comments.sql** - Creates the comments table for artworks
2. **009_public_profile_artworks_rls.sql** - Adds RLS policies for public artwork access
3. **010_create_public_profiles_mapping.sql** - Creates optimized slug->user_id mapping table
4. **011_sync_public_profiles_trigger.sql** - Creates automatic sync trigger (optional but recommended)

### Running Migrations

```bash
# Using Supabase CLI
supabase migration up

# Or apply manually via Supabase Dashboard SQL Editor
```

## Environment Variables

### Netlify Function Environment Variables

Add these to your Netlify site environment variables (Settings > Environment variables):

```
VITE_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for the `get-artist-profile` Netlify function to access user metadata via the Admin API. Keep this key secure and never expose it in client-side code.

### Local Development

For local development with Netlify Dev, create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Public Profile Data Structure

All profile data is stored in Supabase Auth `user_metadata`:

- `artist_display_name` - Display name
- `about` - Bio/about section
- `public_profile_image_url` - Profile image URL
- `public_profile_categories` - Array of categories
- `public_profile_artworks` - Array of artwork UUIDs
- `public_profile_slug` - Unique slug for URL
- `public_profile_enabled` - Boolean to enable/disable profile

## Profile Lookup (Optimized)

Profiles use a **hybrid approach** for optimal performance:

1. **Mapping Table** (`public_profiles`): Stores only `slug -> user_id` mapping for fast indexed lookups
2. **User Metadata**: All actual profile data (name, bio, categories, artworks) stored in `user_metadata`

**Lookup Flow:**
1. Query `public_profiles` table by slug (fast indexed lookup) → get `user_id`
2. Fetch only that specific user by ID using Admin API → get `user_metadata`
3. Return profile data from `user_metadata`

This is **much faster** than fetching all users and filtering in memory, especially as your user base grows.

### Syncing the Mapping Table

**Option 1: Automatic Sync (Recommended)**
The migration `011_sync_public_profiles_trigger.sql` creates a database trigger that automatically syncs the `public_profiles` table whenever `user_metadata` changes. This means you don't need to manually update the table - it happens automatically!

**Option 2: Manual Sync**
If you prefer manual control, update the table in your Discovery component's save function:

```sql
-- When enabling/updating profile
INSERT INTO public_profiles (user_id, slug, enabled)
VALUES ('user-uuid', 'artist-slug', true)
ON CONFLICT (user_id) 
DO UPDATE SET slug = EXCLUDED.slug, enabled = EXCLUDED.enabled, updated_at = NOW();

-- When disabling profile
UPDATE public_profiles 
SET enabled = false, updated_at = NOW()
WHERE user_id = 'user-uuid';
```

**Note**: If using the trigger, it will automatically handle syncing. You may still want to manually sync existing profiles after running the migration.

## RLS Policies

The following RLS policies are created:

1. **Artworks**: Public can view artworks that are in a user's `public_profile_artworks` array and the profile is enabled
2. **Comments**: Public can view and create comments on public artworks
3. **Public Profiles**: Public can view enabled profiles

## Testing

1. **Create a test profile**:
   - Set `public_profile_enabled = true` in user_metadata
   - Set `public_profile_slug = 'test-artist'` in user_metadata
   - Add entry to `public_profiles` table
   - Add some artwork IDs to `public_profile_artworks` array

2. **Visit the profile**:
   - Navigate to `/artists/test-artist`
   - Verify profile displays correctly
   - Test commenting functionality

## Troubleshooting

### Profile Not Found
- Check that `public_profile_enabled = true` in user_metadata
- Verify `public_profile_slug` matches exactly (case-insensitive, but stored in lowercase)
- Ensure the slug is not empty or null

### Artworks Not Showing
- Verify artwork IDs in `public_profile_artworks` are valid UUIDs
- Check RLS policies allow public access
- Ensure artworks belong to the correct user

### Comments Not Working
- Check RLS policies on `artwork_comments` table
- Verify artwork is in user's `public_profile_artworks` array
- Check that profile is enabled

### Netlify Function Errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Netlify environment variables
- Check function logs in Netlify dashboard
- Ensure Supabase URL is correct

## Next Steps

1. **Sync public_profiles table**: Add logic in Discovery component to update `public_profiles` table when profile is saved (or use database trigger)
2. Add slug uniqueness validation (you already have `check-slug-uniqueness` Edge Function in the main app)
3. Implement profile image upload functionality
4. Add SEO meta tags optimization
5. Add social sharing buttons
6. Implement comment moderation (optional)
