# Supabase Migration Guide

## Overview
This guide explains how to apply the blog feature database migrations to your Supabase project.

## Migration Files Created

The following migration files have been created in `supabase/migrations/`:

1. **001_create_blog_categories.sql** - Creates categories table
2. **002_create_blog_tags.sql** - Creates tags table
3. **003_create_blog_posts.sql** - Creates main blog posts table
4. **004_create_blog_post_tags.sql** - Creates junction table for post-tag relationships
5. **005_setup_rls_policies.sql** - Sets up Row Level Security policies
6. **006_create_storage_bucket.sql** - Creates storage bucket for blog images
7. **007_create_helper_functions.sql** - Creates utility functions

## Applying Migrations

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   You can find your project ref in your Supabase project settings.

4. **Push migrations**:
   ```bash
   supabase db push
   ```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open each migration file in order (001 through 007)
4. Copy and paste the SQL content
5. Run each migration sequentially

### Option 3: Direct SQL Execution

1. Connect to your Supabase database using your preferred SQL client
2. Execute each migration file in sequence
3. Ensure migrations run in order (001, 002, 003, etc.)

## Verification

After running migrations, verify that the following were created:

### Tables
- ✅ `blog_categories`
- ✅ `blog_tags`
- ✅ `blog_posts`
- ✅ `blog_post_tags`

### Storage Buckets
- ✅ `blog-images` bucket (public)

### Functions
- ✅ `update_updated_at_column()` - Auto-updates timestamp
- ✅ `set_published_at_on_publish()` - Auto-sets published_at
- ✅ `generate_slug()` - Creates URL-friendly slugs
- ✅ `calculate_reading_time()` - Estimates reading time
- ✅ `get_related_posts()` - Gets related posts
- ✅ `get_popular_posts()` - Gets popular posts
- ✅ `get_recent_posts()` - Gets recent posts
- ✅ `increment_post_views()` - Increments view counter

### Policies
- ✅ RLS enabled on all tables
- ✅ Public read access for published posts
- ✅ Authenticated write access for all content

## Environment Variables

Make sure to add these environment variables to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For server-side operations (if needed):
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

You can find these values in your Supabase project settings under **API**.

## Next Steps

1. ✅ Verify migrations were successful
2. Set up Supabase client in your application (see plan)
3. Create blog services
4. Build dashboard components
5. Build frontend blog components

## Troubleshooting

### Migration Order Issues
- Ensure migrations run in numerical order (001, 002, 003...)
- Each migration depends on previous ones

### RLS Policy Errors
- Make sure you're using the correct authentication method
- Check that RLS policies match your authentication setup

### Storage Bucket Issues
- Verify storage is enabled in your Supabase project
- Check that the bucket was created successfully in the Storage section
- **Important**: Storage policies cannot be created via migrations due to permissions
- Set up storage policies manually via Dashboard (Storage > blog-images > Policies) or use the SQL in `STORAGE_POLICIES_SETUP.sql`

### Function Errors
- Ensure all required extensions are enabled (usually auto-enabled)
- Check that referenced tables exist before creating functions

## Rollback (if needed)

To rollback migrations, you can create reverse migrations or manually drop tables:

```sql
-- WARNING: This will delete all blog data
DROP TABLE IF EXISTS blog_post_tags CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_tags CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;
DROP FUNCTION IF EXISTS generate_slug(TEXT);
DROP FUNCTION IF EXISTS calculate_reading_time(JSONB);
DROP FUNCTION IF EXISTS get_related_posts(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_popular_posts(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_recent_posts(INTEGER);
DROP FUNCTION IF EXISTS increment_post_views(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS set_published_at_on_publish();
-- Note: Storage bucket needs to be deleted manually from Storage section
```

## Database Schema Summary

### blog_categories
- Stores blog post categories
- Fields: id, name, slug, description, timestamps

### blog_tags
- Stores blog post tags
- Fields: id, name, slug, created_at

### blog_posts
- Main blog posts table
- Fields: id, title, slug, excerpt, content (JSONB), featured_image, status, category_id, timestamps, SEO fields, analytics fields

### blog_post_tags
- Many-to-many relationship between posts and tags
- Fields: id, post_id, tag_id, created_at

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- RLS policies allow public read access to published posts only
- Authenticated users can manage all content
- Image storage uses Supabase Storage with public access for images
- Helper functions are available for common operations like generating slugs and calculating reading time

