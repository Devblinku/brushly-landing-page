import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRelatedPosts } from '../../services/blogService';
import type { BlogPostWithRelations } from '../../types/blog';
import { BlogCard } from './BlogCard';

interface RelatedPostsProps {
  postId: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ postId }) => {
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedPosts();
  }, [postId]);

  const loadRelatedPosts = async () => {
    try {
      const relatedPosts = await getRelatedPosts(postId, 3);
      setPosts(relatedPosts);
    } catch (error) {
      console.error('Error loading related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

