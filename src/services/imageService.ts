import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';

const BUCKET_NAME = 'blog-images';
const MAX_WIDTH = 1200; // Max width for featured images
const MAX_WIDTH_INLINE = 800; // Max width for inline images
const QUALITY = 0.7; // 70% quality as specified

/**
 * Convert image to WebP format with compression
 */
async function compressImage(file: File, maxWidth: number = MAX_WIDTH): Promise<File> {
  const options = {
    maxSizeMB: 1, // Max file size in MB
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    fileType: 'image/webp', // Convert to WebP
    initialQuality: QUALITY,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Generate a unique filename for the image
 */
function generateImageFileName(postSlug: string, type: 'featured' | 'inline'): string {
  const timestamp = Date.now();
  
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Structure: {year}/{month}/{post-slug}/{type}-{timestamp}.webp
  return `${year}/${month}/${postSlug}/${type}-${timestamp}.webp`;
}

/**
 * Upload an image to Supabase Storage
 */
async function uploadToStorage(
  file: File,
  filePath: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload a featured image for a blog post
 */
export async function uploadFeaturedImage(
  file: File,
  postSlug: string
): Promise<{ url: string; alt: string }> {
  try {
    // Compress image
    const compressedFile = await compressImage(file, MAX_WIDTH);
    
    // Generate file path
    const filePath = generateImageFileName(postSlug, 'featured');
    
    // Upload to storage
    const url = await uploadToStorage(compressedFile, filePath);
    
    // Extract alt text from filename (remove extension, replace hyphens/underscores with spaces)
    const alt = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return { url, alt };
  } catch (error) {
    console.error('Error uploading featured image:', error);
    throw error;
  }
}

/**
 * Upload an inline image for a blog post
 */
export async function uploadInlineImage(
  file: File,
  postSlug: string
): Promise<string> {
  try {
    // Compress image
    const compressedFile = await compressImage(file, MAX_WIDTH_INLINE);
    
    // Generate file path
    const filePath = generateImageFileName(postSlug, 'inline');
    
    // Upload to storage
    const url = await uploadToStorage(compressedFile, filePath);
    
    return url;
  } catch (error) {
    console.error('Error uploading inline image:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const pathIndex = pathParts.indexOf(BUCKET_NAME);
    
    if (pathIndex === -1) {
      throw new Error('Invalid image URL');
    }
    
    const filePath = pathParts.slice(pathIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload an image smaller than 5MB.',
    };
  }

  return { valid: true };
}

/**
 * Upload images from data URLs (used when saving post)
 * Returns a map of old URL -> new URL
 */
export async function uploadImagesFromDataURLs(
  imageUrls: string[],
  postSlug: string
): Promise<Record<string, string>> {
  const urlMap: Record<string, string> = {};
  
  // Import imageUtils dynamically to avoid circular dependency
  const { dataURLtoFile, isDataURL } = await import('../utils/imageUtils');
  
  const uploadPromises = imageUrls
    .filter(url => isDataURL(url))
    .map(async (dataUrl) => {
      try {
        // Generate filename from data URL
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);
        const filename = `inline-${timestamp}-${randomId}.webp`;
        
        // Convert data URL to File
        const file = dataURLtoFile(dataUrl, filename);
        
        // Compress and upload
        const compressedFile = await compressImage(file, MAX_WIDTH_INLINE);
        const filePath = generateImageFileName(postSlug, 'inline');
        const url = await uploadToStorage(compressedFile, filePath);
        
        urlMap[dataUrl] = url;
      } catch (error) {
        console.error('Error uploading image from data URL:', error);
        // Keep original data URL if upload fails
        urlMap[dataUrl] = dataUrl;
      }
    });
  
  await Promise.all(uploadPromises);
  return urlMap;
}

/**
 * Get all existing images from storage (for gallery)
 */
export async function getExistingImages(): Promise<Array<{ url: string; path: string; name: string }>> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error loading images:', error);
      return [];
    }

    const images = (data || [])
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);
        
        return {
          url: urlData.publicUrl,
          path: file.name,
          name: file.name,
        };
      });

    return images;
  } catch (error) {
    console.error('Error getting existing images:', error);
    return [];
  }
}

