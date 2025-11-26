import { supabase } from './supabaseClient';
import type { BlogCategory } from '../types/blog';

/**
 * Generate a URL-friendly slug from a category name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<BlogCategory | null> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching category:', error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching category by slug:', error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}

/**
 * Create a new category
 */
export async function createCategory(
  name: string,
  description?: string | null
): Promise<BlogCategory> {
  const slug = generateSlug(name);

  // Check if slug already exists
  const existing = await getCategoryBySlug(slug);
  if (existing) {
    throw new Error(`A category with the slug "${slug}" already exists`);
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .insert({
      name: name.trim(),
      slug,
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return data;
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  updates: { name?: string; description?: string | null }
): Promise<BlogCategory> {
  const updateData: { name?: string; slug?: string; description?: string | null } = {};

  if (updates.name) {
    updateData.name = updates.name.trim();
    updateData.slug = generateSlug(updates.name);

    // Check if new slug conflicts with existing category
    const existing = await getCategoryBySlug(updateData.slug);
    if (existing && existing.id !== id) {
      throw new Error(`A category with the slug "${updateData.slug}" already exists`);
    }
  }

  if (updates.description !== undefined) {
    updateData.description = updates.description?.trim() || null;
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw new Error(`Failed to update category: ${error.message}`);
  }

  return data;
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(`Failed to delete category: ${error.message}`);
  }
}

