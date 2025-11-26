-- Enable Row Level Security on all tables
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Blog Categories Policies
-- Public can read all categories
CREATE POLICY "Categories are viewable by everyone"
    ON blog_categories FOR SELECT
    USING (true);

-- Authenticated users can insert categories
CREATE POLICY "Authenticated users can insert categories"
    ON blog_categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
    ON blog_categories FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
    ON blog_categories FOR DELETE
    USING (auth.role() = 'authenticated');

-- Blog Tags Policies
-- Public can read all tags
CREATE POLICY "Tags are viewable by everyone"
    ON blog_tags FOR SELECT
    USING (true);

-- Authenticated users can insert tags
CREATE POLICY "Authenticated users can insert tags"
    ON blog_tags FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update tags
CREATE POLICY "Authenticated users can update tags"
    ON blog_tags FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete tags
CREATE POLICY "Authenticated users can delete tags"
    ON blog_tags FOR DELETE
    USING (auth.role() = 'authenticated');

-- Blog Posts Policies
-- Public can read published posts
CREATE POLICY "Published posts are viewable by everyone"
    ON blog_posts FOR SELECT
    USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

-- Authenticated users can read all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts"
    ON blog_posts FOR SELECT
    USING (auth.role() = 'authenticated');

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
    ON blog_posts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
    ON blog_posts FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
    ON blog_posts FOR DELETE
    USING (auth.role() = 'authenticated');

-- Blog Post Tags Policies
-- Public can read post tags for published posts
CREATE POLICY "Post tags for published posts are viewable by everyone"
    ON blog_post_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = blog_post_tags.post_id 
            AND blog_posts.status = 'published'
            AND (blog_posts.published_at IS NULL OR blog_posts.published_at <= NOW())
        )
    );

-- Authenticated users can read all post tags
CREATE POLICY "Authenticated users can view all post tags"
    ON blog_post_tags FOR SELECT
    USING (auth.role() = 'authenticated');

-- Authenticated users can insert post tags
CREATE POLICY "Authenticated users can insert post tags"
    ON blog_post_tags FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete post tags
CREATE POLICY "Authenticated users can delete post tags"
    ON blog_post_tags FOR DELETE
    USING (auth.role() = 'authenticated');

-- Function to increment view count (public access)
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts
    SET views_count = views_count + 1
    WHERE id = post_id
    AND status = 'published'
    AND (published_at IS NULL OR published_at <= NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to public
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO anon, authenticated;

COMMENT ON FUNCTION increment_post_views IS 'Increments the view count for a published blog post (public access allowed)';

