import { supabase } from './supabaseClient';
import type {
  BlogPostWithRelations,
  BlogPostCreate,
  BlogPostUpdate,
  BlogListFilters,
  BlogListResponse,
} from '../types/blog';
import { generateSlug } from './categoryService';

/**
 * Calculate reading time from TipTap JSONB content
 */
function calculateReadingTime(content: any): number {
  try {
    // Extract text content from TipTap JSON
    const extractText = (node: any): string => {
      if (typeof node === 'string') return node;
      if (typeof node !== 'object' || node === null) return '';
      
      let text = '';
      if (node.text) text += node.text + ' ';
      if (node.content && Array.isArray(node.content)) {
        text += node.content.map(extractText).join(' ');
      }
      return text;
    };

    const text = extractText(content);
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  } catch (error) {
    console.error('Error calculating reading time:', error);
    return 1; // Default to 1 minute
  }
}

/**
 * Generate a URL-friendly slug from a title
 */
function generatePostSlug(title: string): string {
  return generateSlug(title);
}

/**
 * Get a single blog post by ID (with relations)
 */
export async function getPostById(id: string, includeDrafts: boolean = false): Promise<BlogPostWithRelations | null> {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories(*),
      blog_post_tags(
        blog_tags(*)
      )
    `)
    .eq('id', id);

  // If not including drafts, only get published posts
  if (!includeDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching post:', error);
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  // Transform the data to match BlogPostWithRelations
  const post = data as any;
  return {
    ...post,
    category: post.blog_categories || null,
    tags: (post.blog_post_tags || []).map((pt: any) => pt.blog_tags).filter(Boolean),
  };
}

/**
 * Get a blog post by slug (for public viewing)
 */
export async function getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories(*),
      blog_post_tags(
        blog_tags(*)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching post by slug:', error);
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  // Transform the data
  const post = data as any;
  const postWithRelations: BlogPostWithRelations = {
    ...post,
    category: post.blog_categories || null,
    tags: (post.blog_post_tags || []).map((pt: any) => pt.blog_tags).filter(Boolean),
  };

  // Increment view count (fire and forget)
  incrementPostViews(post.id).catch(err => console.error('Failed to increment views:', err));

  return postWithRelations;
}

/**
 * Increment view count for a post
 */
export async function incrementPostViews(postId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_post_views', {
      post_id: postId,
    });

    if (error) {
      console.error('Error incrementing views:', error);
      // Don't throw - this is a non-critical operation
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Get list of blog posts with filters
 */
export async function getPosts(filters: BlogListFilters = {}): Promise<BlogListResponse> {
  const {
    status = 'published',
    category_id,
    tag_id,
    search,
    limit = 10,
    offset = 0,
    sort_by = 'published_at',
    sort_order = 'desc',
  } = filters;

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories(*),
      blog_post_tags(
        blog_tags(*)
      )
    `, { count: 'exact' });

  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }

  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  // Filter by tag if provided
  if (tag_id) {
    query = query.contains('blog_post_tags', [{ tag_id }]);
  }

  // Only show published posts that are published or scheduled
  if (status === 'published') {
    query = query.lte('published_at', new Date().toISOString());
  }

  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  // Transform the data
  const posts: BlogPostWithRelations[] = (data || []).map((post: any) => ({
    ...post,
    category: post.blog_categories || null,
    tags: (post.blog_post_tags || []).map((pt: any) => pt.blog_tags).filter(Boolean),
  }));

  return {
    posts,
    total: count || 0,
    limit,
    offset,
  };
}

/**
 * Create a new blog post
 */
export async function createPost(postData: BlogPostCreate): Promise<BlogPostWithRelations> {
  // Generate slug if not provided
  const slug = postData.slug || generatePostSlug(postData.title);

  // Check if slug already exists
  const existing = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing.data) {
    throw new Error(`A post with the slug "${slug}" already exists`);
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(postData.content);

  // Create the post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .insert({
      title: postData.title.trim(),
      slug,
      excerpt: postData.excerpt?.trim() || null,
      content: postData.content,
      featured_image_url: postData.featured_image_url || null,
      featured_image_alt: postData.featured_image_alt || null,
      status: postData.status || 'draft',
      category_id: postData.category_id || null,
      published_at: postData.published_at || null,
      meta_title: postData.meta_title?.trim() || null,
      meta_description: postData.meta_description?.trim() || null,
      meta_keywords: postData.meta_keywords || null,
      og_image_url: postData.og_image_url || null,
      reading_time: readingTime,
    })
    .select()
    .single();

  if (postError) {
    console.error('Error creating post:', postError);
    throw new Error(`Failed to create post: ${postError.message}`);
  }

  // Handle tags if provided
  if (postData.tag_ids && postData.tag_ids.length > 0) {
    await updatePostTags(post.id, postData.tag_ids);
  }

  // Fetch the complete post with relations
  const completePost = await getPostById(post.id, true);
  if (!completePost) {
    throw new Error('Failed to fetch created post');
  }

  return completePost;
}

/**
 * Update a blog post
 */
export async function updatePost(
  id: string,
  updates: BlogPostUpdate
): Promise<BlogPostWithRelations> {
  const updateData: any = {};

  if (updates.title !== undefined) {
    updateData.title = updates.title.trim();
  }

  if (updates.slug !== undefined) {
    const slug = updates.slug.trim();
    
    // Check if new slug conflicts with existing post
    const existing = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();

    if (existing.data) {
      throw new Error(`A post with the slug "${slug}" already exists`);
    }
    
    updateData.slug = slug;
  }

  if (updates.excerpt !== undefined) {
    updateData.excerpt = updates.excerpt?.trim() || null;
  }

  if (updates.content !== undefined) {
    updateData.content = updates.content;
    // Recalculate reading time if content changed
    updateData.reading_time = calculateReadingTime(updates.content);
  }

  if (updates.featured_image_url !== undefined) {
    updateData.featured_image_url = updates.featured_image_url || null;
  }

  if (updates.featured_image_alt !== undefined) {
    updateData.featured_image_alt = updates.featured_image_alt?.trim() || null;
  }

  if (updates.status !== undefined) {
    updateData.status = updates.status;
  }

  if (updates.category_id !== undefined) {
    updateData.category_id = updates.category_id || null;
  }

  if (updates.published_at !== undefined) {
    updateData.published_at = updates.published_at || null;
  }

  if (updates.meta_title !== undefined) {
    updateData.meta_title = updates.meta_title?.trim() || null;
  }

  if (updates.meta_description !== undefined) {
    updateData.meta_description = updates.meta_description?.trim() || null;
  }

  if (updates.meta_keywords !== undefined) {
    updateData.meta_keywords = updates.meta_keywords || null;
  }

  if (updates.og_image_url !== undefined) {
    updateData.og_image_url = updates.og_image_url || null;
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating post:', error);
    throw new Error(`Failed to update post: ${error.message}`);
  }

  // Handle tags if provided
  if (updates.tag_ids !== undefined) {
    await updatePostTags(id, updates.tag_ids);
  }

  // Fetch the complete post with relations
  const completePost = await getPostById(id, true);
  if (!completePost) {
    throw new Error('Failed to fetch updated post');
  }

  return completePost;
}

/**
 * Update tags for a post
 */
async function updatePostTags(postId: string, tagIds: string[]): Promise<void> {
  // Delete existing tags
  const { error: deleteError } = await supabase
    .from('blog_post_tags')
    .delete()
    .eq('post_id', postId);

  if (deleteError) {
    console.error('Error deleting post tags:', deleteError);
    throw new Error(`Failed to update post tags: ${deleteError.message}`);
  }

  // Insert new tags
  if (tagIds.length > 0) {
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId,
    }));

    const { error: insertError } = await supabase
      .from('blog_post_tags')
      .insert(postTags);

    if (insertError) {
      console.error('Error inserting post tags:', insertError);
      throw new Error(`Failed to update post tags: ${insertError.message}`);
    }
  }
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

/**
 * Get related posts
 */
export async function getRelatedPosts(
  postId: string,
  limit: number = 3
): Promise<BlogPostWithRelations[]> {
  const { data, error } = await supabase.rpc('get_related_posts', {
    current_post_id: postId,
    limit_count: limit,
  });

  if (error) {
    console.error('Error fetching related posts:', error);
    // Return empty array instead of throwing - related posts are not critical
    return [];
  }

  // Fetch full post data with relations for each related post
  const postsWithRelations = await Promise.all(
    (data || []).map(async (post: any) => {
      const fullPost = await getPostById(post.id, false);
      return fullPost;
    })
  );

  return postsWithRelations.filter(Boolean) as BlogPostWithRelations[];
}

/**
 * Get popular posts
 */
export async function getPopularPosts(
  limit: number = 10,
  daysBack: number = 30
): Promise<BlogPostWithRelations[]> {
  const { data, error } = await supabase.rpc('get_popular_posts', {
    limit_count: limit,
    days_back: daysBack,
  });

  if (error) {
    console.error('Error fetching popular posts:', error);
    throw new Error(`Failed to fetch popular posts: ${error.message}`);
  }

  // Fetch full post data with relations
  const postsWithRelations = await Promise.all(
    (data || []).map(async (post: any) => {
      const fullPost = await getPostById(post.id, false);
      return fullPost;
    })
  );

  return postsWithRelations.filter(Boolean) as BlogPostWithRelations[];
}

/**
 * Get recent posts
 */
export async function getRecentPosts(limit: number = 10): Promise<BlogPostWithRelations[]> {
  const { data, error } = await supabase.rpc('get_recent_posts', {
    limit_count: limit,
  });

  if (error) {
    console.error('Error fetching recent posts:', error);
    throw new Error(`Failed to fetch recent posts: ${error.message}`);
  }

  // Fetch full post data with relations
  const postsWithRelations = await Promise.all(
    (data || []).map(async (post: any) => {
      const fullPost = await getPostById(post.id, false);
      return fullPost;
    })
  );

  return postsWithRelations.filter(Boolean) as BlogPostWithRelations[];
}

