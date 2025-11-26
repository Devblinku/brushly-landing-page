import { supabase } from './supabaseClient';
import type { BlogTag } from '../types/blog';
import { generateSlug } from './categoryService';

/**
 * Get all tags
 */
export async function getAllTags(): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single tag by ID
 */
export async function getTagById(id: string): Promise<BlogTag | null> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching tag:', error);
    throw new Error(`Failed to fetch tag: ${error.message}`);
  }

  return data;
}

/**
 * Get a tag by slug
 */
export async function getTagBySlug(slug: string): Promise<BlogTag | null> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching tag by slug:', error);
    throw new Error(`Failed to fetch tag: ${error.message}`);
  }

  return data;
}

/**
 * Search tags by name (for autocomplete)
 */
export async function searchTags(query: string, limit: number = 10): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching tags:', error);
    throw new Error(`Failed to search tags: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new tag (or get existing if name matches)
 */
export async function createOrGetTag(name: string): Promise<BlogTag> {
  const slug = generateSlug(name);

  // Check if tag already exists
  const existing = await getTagBySlug(slug);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from('blog_tags')
    .insert({
      name: name.trim(),
      slug,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return data;
}

/**
 * Create multiple tags at once
 */
export async function createOrGetTags(names: string[]): Promise<BlogTag[]> {
  const tags: BlogTag[] = [];
  
  for (const name of names) {
    if (name.trim()) {
      try {
        const tag = await createOrGetTag(name.trim());
        tags.push(tag);
      } catch (error) {
        console.error(`Error creating tag "${name}":`, error);
        // Continue with other tags even if one fails
      }
    }
  }

  return tags;
}

/**
 * Update a tag
 */
export async function updateTag(id: string, name: string): Promise<BlogTag> {
  const slug = generateSlug(name);

  // Check if new slug conflicts with existing tag
  const existing = await getTagBySlug(slug);
  if (existing && existing.id !== id) {
    throw new Error(`A tag with the slug "${slug}" already exists`);
  }

  const { data, error } = await supabase
    .from('blog_tags')
    .update({
      name: name.trim(),
      slug,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tag:', error);
    throw new Error(`Failed to update tag: ${error.message}`);
  }

  return data;
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_tags')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tag:', error);
    throw new Error(`Failed to delete tag: ${error.message}`);
  }
}

/**
 * Get tags for a specific post
 */
export async function getTagsForPost(postId: string): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_post_tags')
    .select('tag_id, blog_tags(*)')
    .eq('post_id', postId);

  if (error) {
    console.error('Error fetching tags for post:', error);
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return (data || []).map((item: any) => item.blog_tags);
}

