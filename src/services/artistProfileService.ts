import { supabase } from './supabaseClient';

export interface ArtistProfile {
  id: string;
  artist_display_name: string | null;
  about: string | null;
  public_profile_image_url: string | null;
  public_profile_categories: string[];
  public_profile_artworks: string[];
  public_profile_slug: string | null;
  public_profile_enabled: boolean;
  public_profile_facebook_url?: string | null;
  public_profile_instagram_url?: string | null;
  public_profile_linkedin_url?: string | null;
  public_profile_twitter_url?: string | null;
  public_profile_tiktok_url?: string | null;
  public_profile_email?: string | null;
  public_profile_achievements?: string[];
}

export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  medium: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessedCategory {
  name: string;
  custom?: string;
}

/**
 * Fetches artist profile by slug from Netlify function
 */
export const fetchArtistProfileBySlug = async (slug: string): Promise<ArtistProfile | null> => {
  try {
    const response = await fetch(`/.netlify/functions/get-artist-profile?slug=${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch artist profile: ${response.statusText}`);
    }

    const profileData = await response.json();
    return profileData as ArtistProfile;
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    throw error;
  }
};

/**
 * Fetches artworks by their IDs with pagination
 */
export const fetchArtworksByIds = async (
  artworkIds: string[], 
  userId: string, 
  page: number = 1, 
  pageSize: number = 10
): Promise<{ artworks: Artwork[]; total: number }> => {
  if (!artworkIds || artworkIds.length === 0) {
    return { artworks: [], total: 0 };
  }

  try {
    const offset = (page - 1) * pageSize;
    
    // First, get the total count
    const { count, error: countError } = await supabase
      .from('artworks')
      .select('*', { count: 'exact', head: true })
      .in('id', artworkIds)
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting artworks:', countError);
      throw countError;
    }

    // Then fetch the paginated results
    const { data: artworks, error } = await supabase
      .from('artworks')
      .select('id, title, description, image_url, medium, created_at, updated_at')
      .in('id', artworkIds)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }

    return { artworks: artworks || [], total: count || 0 };
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

/**
 * Processes categories to handle "Other: [text]" format
 */
export const processCategories = (categories: string[]): ProcessedCategory[] => {
  return categories.map(category => {
    if (category.startsWith('Other: ')) {
      const customText = category.replace('Other: ', '');
      return {
        name: 'Other',
        custom: customText
      };
    }
    return { name: category };
  });
};

/**
 * Gets display name for a category
 */
export const getCategoryDisplayName = (category: ProcessedCategory): string => {
  if (category.custom) {
    return `Other (${category.custom})`;
  }
  return category.name;
};
