import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import { ModernHeader } from '../ui/modern-header';
import { Footer } from '../ui/Footer';
import { BlogCard } from './BlogCard';
import { getPosts } from '../../services/blogService';
import { getAllCategories } from '../../services/categoryService';
import type { BlogPostWithRelations, BlogCategory } from '../../types/blog';
import { Button } from '../ui/button';
import { BlogTimeTracker } from '../BlogTimeTracker';

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 12;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedCategory, currentPage]);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await getPosts({
        status: 'published',
        category_id: selectedCategory || undefined,
        search: searchQuery || undefined,
        limit: postsPerPage,
        offset: (currentPage - 1) * postsPerPage,
        sort_by: 'published_at',
        sort_order: 'desc',
      });
      setPosts(response.posts);
      setTotalPosts(response.total);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPosts();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <BlogTimeTracker isBlogList={true} />
      <ModernHeader />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-slate-200">The</span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-serif italic text-5xl lg:text-8xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                Creative
              </span>
              {' '}
              <span className="text-white font-serif italic text-3xl lg:text-6xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                Edit
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover insights, tips, and stories about art, creativity, and digital marketing
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </form>

            {/* Categories */}
            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <div className="relative">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => handleCategoryClick(e.target.value || null)}
                  className="w-full appearance-none px-4 py-3 pr-10 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Desktop Button List */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory) && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-400">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-cyan-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="hover:text-cyan-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-400 hover:text-slate-300 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Posts Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              <p className="text-slate-400 mt-4">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No posts found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                  
                  <span className="text-slate-400 px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer currentPage="home" />
    </div>
  );
};

export default BlogListPage;

