# Blog Feature Setup Guide

## Prerequisites

1. **Supabase Project**: You need a Supabase project set up
2. **Environment Variables**: Add to your `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Installation Steps

### Step 1: Install Required Packages

Run the following command to install additional TipTap extensions and dependencies:

```bash
npm install @tiptap/extension-link@^3.11.0 @tiptap/extension-placeholder@^3.11.0 @tiptap/extension-text-align@^3.11.0 @tiptap/extension-underline@^3.11.0 @tiptap/extension-code-block@^3.11.0 @tiptap/extension-youtube@^3.11.0
```

**Note**: All TipTap extensions must match the same major version (3.x) as your existing TipTap packages (`@tiptap/react@^3.11.0` and `@tiptap/starter-kit@^3.11.0`).

### Step 2: Run Supabase Migrations

Follow the instructions in `SUPABASE_MIGRATION_GUIDE.md` to apply the database migrations.

### Step 3: Verify Setup

1. Check that all environment variables are set
2. Verify Supabase migrations ran successfully
3. Confirm storage bucket `blog-images` was created

## File Structure Created

### Services (`src/services/`)
- ✅ `supabaseClient.ts` - Supabase client initialization
- ✅ `blogService.ts` - Blog CRUD operations
- ✅ `categoryService.ts` - Category management
- ✅ `tagService.ts` - Tag management
- ✅ `imageService.ts` - Image upload and optimization

### Types (`src/types/`)
- ✅ `blog.ts` - TypeScript interfaces for blog data

### Database Migrations (`supabase/migrations/`)
- ✅ `001_create_blog_categories.sql`
- ✅ `002_create_blog_tags.sql`
- ✅ `003_create_blog_posts.sql`
- ✅ `004_create_blog_post_tags.sql`
- ✅ `005_setup_rls_policies.sql`
- ✅ `006_create_storage_bucket.sql`
- ✅ `007_create_helper_functions.sql`

## Next Steps

After completing the setup:

1. **Dashboard Components** - Create admin dashboard for managing blogs
2. **Blog Editor** - Rich text editor with TipTap
3. **Frontend Components** - Blog listing and individual post pages
4. **Routing** - Set up routes for blog posts
5. **SEO** - Add meta tags and structured data

## Testing Checklist

- [ ] Install all required packages
- [ ] Set environment variables
- [ ] Run Supabase migrations
- [ ] Verify storage bucket exists
- [ ] Test Supabase client connection
- [ ] Create a test category
- [ ] Create a test tag
- [ ] Create a test blog post
- [ ] Upload a test image

## Troubleshooting

### Environment Variables Not Found
- Make sure `.env` file is in the root directory
- Variables must start with `VITE_` for client-side access
- Restart your dev server after adding environment variables

### Supabase Connection Errors
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure RLS policies allow your operations

### Migration Errors
- Make sure migrations run in order (001-007)
- Check that all previous migrations succeeded
- Verify you have the correct database permissions

### Image Upload Issues
- Verify storage bucket `blog-images` exists
- Check RLS policies on the storage bucket
- Ensure bucket is set to public for image access

