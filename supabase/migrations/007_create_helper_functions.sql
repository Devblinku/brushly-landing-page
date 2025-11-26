-- Function to generate slug from text
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase
    slug := LOWER(input_text);
    
    -- Replace spaces and special characters with hyphens
    slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading and trailing hyphens
    slug := TRIM(BOTH '-' FROM slug);
    
    -- Ensure slug is not empty
    IF slug = '' THEN
        slug := 'post-' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END IF;
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION generate_slug IS 'Generates a URL-friendly slug from text input';

-- Function to calculate reading time from JSONB content
CREATE OR REPLACE FUNCTION calculate_reading_time(content JSONB)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER := 0;
    text_content TEXT;
    words_per_minute INTEGER := 200; -- Average reading speed
BEGIN
    -- Extract plain text from TipTap JSONB content
    -- This is a simplified version; you may need to adjust based on TipTap structure
    text_content := content::TEXT;
    
    -- Count words (simple word count)
    SELECT COUNT(*) INTO word_count
    FROM regexp_split_to_table(text_content, '\s+') AS word
    WHERE word ~ '[a-zA-Z0-9]';
    
    -- Calculate reading time (rounded up)
    RETURN GREATEST(1, CEIL(word_count::NUMERIC / words_per_minute));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_reading_time IS 'Calculates estimated reading time in minutes from blog post content';

-- Function to get related posts based on category and tags
CREATE OR REPLACE FUNCTION get_related_posts(current_post_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.featured_image_url,
        bp.published_at,
        bp.reading_time
    FROM blog_posts bp
    WHERE bp.id != current_post_id
        AND bp.status = 'published'
        AND (bp.published_at IS NULL OR bp.published_at <= NOW())
        AND (
            -- Same category
            bp.category_id = (SELECT category_id FROM blog_posts WHERE id = current_post_id)
            OR
            -- Shared tags
            bp.id IN (
                SELECT DISTINCT pt2.post_id
                FROM blog_post_tags pt1
                JOIN blog_post_tags pt2 ON pt1.tag_id = pt2.tag_id
                WHERE pt1.post_id = current_post_id
                AND pt2.post_id != current_post_id
            )
        )
    ORDER BY 
        -- Prioritize posts with same category
        CASE WHEN bp.category_id = (SELECT category_id FROM blog_posts WHERE id = current_post_id) THEN 0 ELSE 1 END,
        bp.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_related_posts IS 'Returns related blog posts based on category and shared tags';

-- Function to get popular posts
CREATE OR REPLACE FUNCTION get_popular_posts(limit_count INTEGER DEFAULT 10, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER,
    views_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.featured_image_url,
        bp.published_at,
        bp.reading_time,
        bp.views_count
    FROM blog_posts bp
    WHERE bp.status = 'published'
        AND (bp.published_at IS NULL OR bp.published_at <= NOW())
        AND bp.published_at >= NOW() - (days_back || ' days')::INTERVAL
    ORDER BY bp.views_count DESC, bp.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_popular_posts IS 'Returns most popular blog posts by view count within specified days';

-- Function to get recent posts
CREATE OR REPLACE FUNCTION get_recent_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.featured_image_url,
        bp.published_at,
        bp.reading_time
    FROM blog_posts bp
    WHERE bp.status = 'published'
        AND (bp.published_at IS NULL OR bp.published_at <= NOW())
    ORDER BY bp.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_recent_posts IS 'Returns most recent published blog posts';

