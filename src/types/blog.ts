// Blog-related TypeScript types

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any; // TipTap JSONB content
  featured_image_url: string | null;
  featured_image_alt: string | null;
  status: BlogPostStatus;
  author_id: string | null;
  category_id: string | null;
  category?: BlogCategory | null; // Joined from category_id
  tags?: BlogTag[]; // Joined from blog_post_tags
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image_url: string | null;
  reading_time: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: any;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  status?: BlogPostStatus;
  category_id?: string | null;
  tag_ids?: string[]; // Array of tag IDs
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  og_image_url?: string | null;
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: any;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  status?: BlogPostStatus;
  category_id?: string | null;
  tag_ids?: string[]; // Array of tag IDs
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  og_image_url?: string | null;
}

export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory | null;
  tags: BlogTag[];
}

export interface BlogListFilters {
  status?: BlogPostStatus;
  category_id?: string;
  tag_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'published_at' | 'views_count' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface BlogListResponse {
  posts: BlogPostWithRelations[];
  total: number;
  limit: number;
  offset: number;
}

