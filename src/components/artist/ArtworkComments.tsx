import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import {
  fetchArtworkComments,
  createArtworkComment,
  deleteArtworkComment,
  type ArtworkComment
} from '../../services/commentService';
import { useAuth } from '../auth/AuthContext';
import { format } from 'date-fns';

interface ArtworkCommentsProps {
  artworkId: string;
}

export const ArtworkComments: React.FC<ArtworkCommentsProps> = ({ artworkId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<ArtworkComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [commenterEmail, setCommenterEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadComments();
  }, [artworkId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await fetchArtworkComments(artworkId);
      setComments(fetchedComments);
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
      const newComment = await createArtworkComment({
        artwork_id: artworkId,
        commenter_name: user
          ? (user.user_metadata?.artist_display_name || user.email?.split('@')[0] || 'Anonymous')
          : commenterName.trim(),
        commenter_email: user?.email || commenterEmail.trim() || 'anonymous@brushly.art',
        comment_text: commentText.trim()
      });

      setComments([newComment, ...comments]);
      setCommentText('');
      if (!user) {
        setCommenterName('');
      }
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
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-6 production-scrollbar">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 flex-shrink-0">
                  <User className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {comment.commenter_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(comment.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {user && comment.user_id === user.id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {comment.comment_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form - Fixed at bottom */}
      <div className="border-t border-slate-700 p-4 bg-slate-900/50">
        <form onSubmit={handleSubmit} className="space-y-3">
          {!user && (
            <input
              id="commenter-name"
              type="text"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
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
              className="flex-1 rounded-full border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={
                submitting ||
                !commentText.trim() ||
                (!user && !commenterName.trim())
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
