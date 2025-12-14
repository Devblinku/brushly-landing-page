import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import { fetchArtworkComments, createArtworkComment, deleteArtworkComment, type ArtworkComment } from '../../services/commentService';
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
    if (!user && (!commenterName.trim() || !commenterEmail.trim())) return;

    setSubmitting(true);
    try {
      const newComment = await createArtworkComment({
        artwork_id: artworkId,
        commenter_name: user 
          ? (user.user_metadata?.artist_display_name || user.email?.split('@')[0] || 'Anonymous')
          : commenterName.trim(),
        commenter_email: user?.email || commenterEmail.trim(),
        comment_text: commentText.trim()
      });

      setComments([newComment, ...comments]);
      setCommentText('');
      if (!user) {
        setCommenterName('');
        setCommenterEmail('');
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
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="commenter-name" className="block text-sm font-medium text-foreground mb-2">
                Name *
              </label>
              <input
                id="commenter-name"
                type="text"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="commenter-email" className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                id="commenter-email"
                type="email"
                value={commenterEmail}
                onChange={(e) => setCommenterEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="comment-text" className="block text-sm font-medium text-foreground mb-2">
            Comment *
          </label>
          <textarea
            id="comment-text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Share your thoughts..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !commentText.trim() || (!user && (!commenterName.trim() || !commenterEmail.trim()))}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-background border border-border rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {comment.commenter_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
                {user && comment.user_id === user.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-foreground whitespace-pre-wrap">
                {comment.comment_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
