-- Storage Policies Setup for blog-images bucket
-- 
-- IMPORTANT: These policies cannot be run as part of regular migrations
-- due to permission restrictions on the storage.objects table.
--
-- You have two options to set these up:
--
-- OPTION 1: Via Supabase Dashboard (Recommended)
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Storage > blog-images bucket
-- 3. Click on the "Policies" tab
-- 4. Create each policy manually using the UI
--
-- OPTION 2: Via SQL Editor with Service Role
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Run these commands one by one
-- 3. Note: You may need service role permissions

-- Policy 1: Public Read Access (Anyone can view images)
CREATE POLICY "Blog images are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'blog-images');

-- Policy 2: Authenticated Upload (Only authenticated users can upload)
CREATE POLICY "Authenticated users can upload blog images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'blog-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy 3: Authenticated Update (Only authenticated users can update)
CREATE POLICY "Authenticated users can update blog images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'blog-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy 4: Authenticated Delete (Only authenticated users can delete)
CREATE POLICY "Authenticated users can delete blog images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'blog-images' 
        AND auth.role() = 'authenticated'
    );

