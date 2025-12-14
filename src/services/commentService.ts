import { supabase } from './supabaseClient';

export interface ArtworkComment {
  id: string;
  artwork_id: string;
  user_id: string | null;
  commenter_name: string;
  commenter_email: string | null;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  artwork_id: string;
  commenter_name: string;
  commenter_email?: string;
  comment_text: string;
}

/**
 * Fetches comments for an artwork
 */
export const fetchArtworkComments = async (artworkId: string): Promise<ArtworkComment[]> => {
  try {
    const { data: comments, error } = await supabase
      .from('artwork_comments')
      .select('*')
      .eq('artwork_id', artworkId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Creates a new comment on an artwork
 */
export const createArtworkComment = async (commentData: CreateCommentData): Promise<ArtworkComment> => {
  try {
    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    const { data: comment, error } = await supabase
      .from('artwork_comments')
      .insert({
        artwork_id: commentData.artwork_id,
        user_id: user?.id || null,
        commenter_name: commentData.commenter_name,
        commenter_email: commentData.commenter_email || null,
        comment_text: commentData.comment_text
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      throw error;
    }

    return comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

/**
 * Updates a comment (only if user is authenticated and owns the comment)
 */
export const updateArtworkComment = async (
  commentId: string,
  commentText: string
): Promise<ArtworkComment> => {
  try {
    const { data: comment, error } = await supabase
      .from('artwork_comments')
      .update({ comment_text: commentText })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      throw error;
    }

    return comment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

/**
 * Deletes a comment (only if user is authenticated and owns the comment)
 */
export const deleteArtworkComment = async (commentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('artwork_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
