import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: any; // JSONB type
          featured_image_url: string | null;
          featured_image_alt: string | null;
          status: 'draft' | 'published' | 'archived';
          author_id: string | null;
          category_id: string | null;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string[] | null;
          og_image_url: string | null;
          reading_time: number;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: any;
          featured_image_url?: string | null;
          featured_image_alt?: string | null;
          status?: 'draft' | 'published' | 'archived';
          author_id?: string | null;
          category_id?: string | null;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
          og_image_url?: string | null;
          reading_time?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: any;
          featured_image_url?: string | null;
          featured_image_alt?: string | null;
          status?: 'draft' | 'published' | 'archived';
          author_id?: string | null;
          category_id?: string | null;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
          og_image_url?: string | null;
          reading_time?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_post_tags: {
        Row: {
          id: string;
          post_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
    };
  };
};

