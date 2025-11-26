# Storage Bucket Setup Guide

## Issue
The migration `006_create_storage_bucket.sql` creates the storage bucket, but cannot create storage policies due to permission restrictions on Supabase's internal `storage.objects` table.

## Solution

You have two options to set up the storage policies:

### Option 1: Via Supabase Dashboard (Easiest)

1. **Navigate to Storage**:
   - Go to your Supabase project dashboard
   - Click on **Storage** in the left sidebar

2. **Select the Bucket**:
   - You should see the `blog-images` bucket (created by the migration)
   - Click on the bucket name

3. **Go to Policies Tab**:
   - Click on the **Policies** tab
   - You'll see an empty policies list

4. **Create Policies** (Create 4 policies):

   **Policy 1: Public Read Access**
   - Click **New Policy**
   - Choose **For full customization** or **For SELECT operations**
   - Policy name: `Blog images are publicly accessible`
   - Allowed operation: `SELECT`
   - Target roles: `anon`, `authenticated` (check both)
   - Policy definition:
     ```sql
     bucket_id = 'blog-images'
     ```
   - Click **Review** then **Save Policy**

   **Policy 2: Authenticated Upload**
   - Click **New Policy**
   - Choose **For full customization** or **For INSERT operations**
   - Policy name: `Authenticated users can upload blog images`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition:
     ```sql
     bucket_id = 'blog-images' AND auth.role() = 'authenticated'
     ```
   - Click **Review** then **Save Policy**

   **Policy 3: Authenticated Update**
   - Click **New Policy**
   - Choose **For full customization** or **For UPDATE operations**
   - Policy name: `Authenticated users can update blog images`
   - Allowed operation: `UPDATE`
   - Target roles: `authenticated`
   - Policy definition:
     ```sql
     bucket_id = 'blog-images' AND auth.role() = 'authenticated'
     ```
   - Click **Review** then **Save Policy**

   **Policy 4: Authenticated Delete**
   - Click **New Policy**
   - Choose **For full customization** or **For DELETE operations**
   - Policy name: `Authenticated users can delete blog images`
   - Allowed operation: `DELETE`
   - Target roles: `authenticated`
   - Policy definition:
     ```sql
     bucket_id = 'blog-images' AND auth.role() = 'authenticated'
     ```
   - Click **Review** then **Save Policy**

### Option 2: Via SQL Editor

1. **Go to SQL Editor**:
   - Navigate to **SQL Editor** in your Supabase dashboard
   - Click **New Query**

2. **Run the SQL**:
   - Copy the contents of `supabase/migrations/STORAGE_POLICIES_SETUP.sql`
   - Paste into the SQL Editor
   - Click **Run**

   **Note**: If you get permission errors, you may need to:
   - Use the service role key (not recommended for production)
   - Or set up policies via the Dashboard instead

## Verification

After setting up the policies, verify they work:

1. **Check Public Read Access**:
   - Try accessing an image URL from the bucket (should work without authentication)
   
2. **Check Upload Access** (requires authentication):
   - Use your application's image upload feature
   - Should work if you're authenticated

## Quick Policy Setup Summary

The bucket needs these 4 policies:

| Operation | Policy Name | Roles | Condition |
|-----------|-------------|-------|-----------|
| SELECT | Blog images are publicly accessible | anon, authenticated | `bucket_id = 'blog-images'` |
| INSERT | Authenticated users can upload blog images | authenticated | `bucket_id = 'blog-images' AND auth.role() = 'authenticated'` |
| UPDATE | Authenticated users can update blog images | authenticated | `bucket_id = 'blog-images' AND auth.role() = 'authenticated'` |
| DELETE | Authenticated users can delete blog images | authenticated | `bucket_id = 'blog-images' AND auth.role() = 'authenticated'` |

## Troubleshooting

### Policy Creation Fails
- Make sure you're using the dashboard (not migrations)
- Verify the bucket `blog-images` exists first
- Check that you have the correct project permissions

### Images Not Loading
- Verify the public read policy is set up correctly
- Check that the bucket is set to public (it should be from the migration)
- Verify image URLs are correct

### Upload Fails
- Check that you're authenticated
- Verify the INSERT policy is set up
- Check browser console for specific error messages

