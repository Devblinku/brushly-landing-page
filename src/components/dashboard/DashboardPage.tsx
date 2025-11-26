import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Eye } from 'lucide-react';
import { getPosts } from '../../services/blogService';
import type { BlogPostWithRelations } from '../../types/blog';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Load all posts (including drafts) for dashboard
      const published = await getPosts({
        status: 'published',
        limit: 5,
        sort_by: 'published_at',
        sort_order: 'desc',
      });

      const drafts = await getPosts({
        status: 'draft',
        limit: 5,
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      const all = await getPosts({
        limit: 1000, // Get all for stats
      });

      setPosts([...published.posts, ...drafts.posts].slice(0, 10));
      setStats({
        total: all.total,
        published: published.total,
        drafts: drafts.total,
      });
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-slate-400 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Manage your blog content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Total Posts</p>
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Published</p>
            <Eye className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.published}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Drafts</p>
            <Edit className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.drafts}</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          to="/dashboard/posts/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Recent Posts */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Posts</h2>
          <Link
            to="/dashboard/posts"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No posts yet</p>
            <Link
              to="/dashboard/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create your first post</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        post.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {post.published_at && (
                      <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                    )}
                    {post.category && (
                      <span className="text-cyan-400">{post.category.name}</span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/dashboard/posts/${post.id}`}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Edit
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

