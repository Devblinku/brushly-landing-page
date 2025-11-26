import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPostWithRelations } from '../../types/blog';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPostWithRelations;
  index?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${post.slug}`);
  };

  const publishedDate = post.published_at ? new Date(post.published_at) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            
            {/* Category Badge */}
            {post.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/90 backdrop-blur-sm text-white rounded-full">
                  {post.category.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category (if no featured image) */}
          {!post.featured_image_url && post.category && (
            <div className="mb-3">
              <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-400 rounded-full">
                {post.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-slate-400 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
            {publishedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{format(publishedDate, 'MMM d, yyyy')}</span>
              </div>
            )}
            {post.reading_time > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-md"
                >
                  #{tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-slate-500">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Read More */}
          <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 font-semibold transition-colors duration-300">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

