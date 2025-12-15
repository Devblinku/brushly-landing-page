import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, User, CheckCircle2 } from 'lucide-react';
import {
  fetchArtworkComments,
  createArtworkComment,
  deleteArtworkComment,
  type ArtworkComment
} from '../../services/commentService';
import { useAuth } from '../auth/AuthContext';
import { format } from 'date-fns';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ArtworkCommentsProps {
  artworkId: string;
  artworkOwnerId: string;
}

interface CommentWithReplies extends ArtworkComment {
  replies?: CommentWithReplies[];
  isArtistReply?: boolean;
}

export const ArtworkComments: React.FC<ArtworkCommentsProps> = ({ artworkId, artworkOwnerId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');

  useEffect(() => {
    loadComments();
  }, [artworkId, artworkOwnerId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await fetchArtworkComments(artworkId);
      
      // Organize comments hierarchically
      const topLevelComments: CommentWithReplies[] = [];
      const repliesMap = new Map<string, CommentWithReplies[]>();
      
      // First pass: identify top-level comments and group replies
      fetchedComments.forEach((comment) => {
        const commentWithReplies: CommentWithReplies = {
          ...comment,
          isArtistReply: comment.parent_id !== null && comment.user_id === artworkOwnerId,
        };
        
        if (!comment.parent_id) {
          // Top-level comment
          topLevelComments.push(commentWithReplies);
        } else {
          // Reply - group by parent_id
          if (!repliesMap.has(comment.parent_id)) {
            repliesMap.set(comment.parent_id, []);
          }
          repliesMap.get(comment.parent_id)!.push(commentWithReplies);
        }
      });
      
      // Second pass: attach replies to their parent comments
      const organizeReplies = (comment: CommentWithReplies): CommentWithReplies => {
        const replies = repliesMap.get(comment.id) || [];
        return {
          ...comment,
          replies: replies.map(organizeReplies).sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ),
        };
      };
      
      const organizedComments = topLevelComments
        .map(organizeReplies)
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      
      setComments(organizedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;
    if (!user && !commenterName.trim()) return;

    setSubmitting(true);
    try {
      await createArtworkComment({
        artwork_id: artworkId,
        commenter_name: user
          ? (user.user_metadata?.artist_display_name || user.email?.split('@')[0] || 'Anonymous')
          : commenterName.trim(),
        commenter_email: user?.email || 'anonymous@brushly.art',
        comment_text: commentText.trim()
      });

      setCommentText('');
      if (!user) {
        setCommenterName('');
      }
      
      // Reload comments to get updated structure
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteArtworkComment(commentId);
      // Reload comments to get updated structure (handles nested replies)
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const CommentItem: React.FC<{
    comment: CommentWithReplies;
    artworkOwnerId: string;
    currentUser: SupabaseUser | null;
    onDelete: (commentId: string) => void;
    isReply?: boolean;
  }> = ({ comment, artworkOwnerId, currentUser, onDelete, isReply = false }) => {
    const isArtistReply = comment.isArtistReply || (comment.user_id === artworkOwnerId && comment.parent_id !== null);
    
    return (
      <div className={isReply ? "ml-4 md:ml-6 border-l-2 border-slate-700/50 pl-3 md:pl-4" : ""}>
        <div className="flex items-start gap-2 md:gap-3">
          <div className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full flex-shrink-0 ${
            isArtistReply 
              ? 'bg-gradient-to-br from-cyan-500/30 to-teal-500/30 border-2 border-cyan-400/50' 
              : 'bg-cyan-500/20'
          }`}>
            {isArtistReply ? (
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-cyan-300" />
            ) : (
              <User className="h-4 w-4 md:h-5 md:w-5 text-cyan-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold truncate ${
                    isArtistReply ? 'text-cyan-300' : 'text-white'
                  }`}>
                    {comment.commenter_name}
                  </p>
                  {isArtistReply && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Artist
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {format(new Date(comment.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              {currentUser && (comment.user_id === currentUser.id || currentUser.id === artworkOwnerId) && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-1.5 md:p-1 text-slate-400 hover:text-red-400 active:text-red-500 transition-colors flex-shrink-0 touch-manipulation"
                  title="Delete comment"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className={`text-sm whitespace-pre-wrap leading-relaxed break-words ${
              isArtistReply ? 'text-cyan-100' : 'text-slate-300'
            }`}>
              {comment.comment_text}
            </p>
          </div>
        </div>
        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 md:mt-4 space-y-2 md:space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                artworkOwnerId={artworkOwnerId}
                currentUser={currentUser}
                onDelete={onDelete}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 production-scrollbar">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-xs md:text-sm text-slate-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                artworkOwnerId={artworkOwnerId}
                currentUser={user}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comment Form - Fixed at bottom */}
      <div className="border-t border-slate-700 p-3 md:p-4 bg-slate-900/50 md:bg-slate-900/50">
        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
          {!user && (
            <input
              id="commenter-name"
              type="text"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors touch-manipulation"
              placeholder="Your name"
            />
          )}

          <div className="flex items-center gap-2">
            <input
              id="comment-text"
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              className="flex-1 rounded-full border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors touch-manipulation"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={
                submitting ||
                !commentText.trim() ||
                (!user && !commenterName.trim())
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 touch-manipulation"
              aria-label="Send comment"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};






