import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { ModernHeader } from '../ui/modern-header';
import { Footer } from '../ui/Footer';
import { getPostBySlug, getRelatedPosts } from '../../services/blogService';
import type { BlogPostWithRelations } from '../../types/blog';
import { ShareButtons } from './ShareButtons';
import { RelatedPosts } from './RelatedPosts';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-400 hover:text-cyan-300 underline',
        },
      }),
    ],
    content: '',
    editable: false,
  });

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post?.content && editor) {
      editor.commands.setContent(post.content);
    }
  }, [post, editor]);

  const loadPost = async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);
    try {
      const postData = await getPostBySlug(slug);
      if (!postData) {
        setError('Post not found');
      } else {
        setPost(postData);
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <ModernHeader />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-slate-400 mt-4">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <ModernHeader />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-slate-400 mb-8">{error || 'The post you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors duration-300"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : null;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://brushly.art';
  const postUrl = `${siteUrl}/${post.slug}`;
  const metaTitle = post.meta_title || post.title;
  const metaDescription = post.meta_description || post.excerpt || post.title;
  const ogImage = post.og_image_url || post.featured_image_url || `${siteUrl}/brushly-logo.png`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{metaTitle} | Brushly</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        {post.meta_keywords && post.meta_keywords.length > 0 && (
          <meta name="keywords" content={post.meta_keywords.join(', ')} />
        )}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        {publishedDate && (
          <meta property="article:published_time" content={publishedDate.toISOString()} />
        )}
        {post.category && (
          <meta property="article:section" content={post.category.name} />
        )}
        {post.tags && post.tags.length > 0 && (
          <>
            {post.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag.name} />
            ))}
          </>
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={postUrl} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Canonical URL */}
        <link rel="canonical" href={postUrl} />

        {/* Structured Data - Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: metaTitle,
            description: metaDescription,
            image: ogImage,
            datePublished: publishedDate?.toISOString(),
            dateModified: post.updated_at ? new Date(post.updated_at).toISOString() : publishedDate?.toISOString(),
            author: {
              '@type': 'Organization',
              name: 'Brushly',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Brushly',
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/brushly-logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': postUrl,
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <ModernHeader />

        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </motion.button>

            {/* Featured Image */}
            {post.featured_image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8 rounded-2xl overflow-hidden"
              >
                <img
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </motion.div>
            )}

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              {/* Category */}
              {post.category && (
                <div className="mb-4">
                  <span className="px-4 py-2 text-sm font-semibold bg-cyan-500/20 text-cyan-400 rounded-full">
                    {post.category.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6">
                {publishedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{format(publishedDate, 'MMMM d, yyyy')}</span>
                  </div>
                )}
                {post.reading_time > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{post.reading_time} min read</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm bg-slate-800/50 text-slate-300 rounded-lg"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex items-center gap-4 mb-8 pt-6 border-t border-slate-700/50">
                <Share2 className="w-5 h-5 text-slate-400" />
                <ShareButtons
                  url={postUrl}
                  title={post.title}
                  description={metaDescription}
                />
              </div>
            </motion.header>

            {/* Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose prose-invert prose-lg max-w-none mb-12"
            >
              {editor && (
                <EditorContent
                  editor={editor}
                  className="blog-content text-slate-300 leading-relaxed"
                />
              )}
            </motion.article>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4">Share this article</h3>
              <ShareButtons
                url={postUrl}
                title={post.title}
                description={metaDescription}
              />
            </motion.div>

            {/* Related Posts */}
            <RelatedPosts postId={post.id} />
          </div>
        </div>

        <Footer currentPage="home" />
      </div>

      <style>{`
        .blog-content {
          color: rgb(203 213 225);
        }
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: rgb(255 255 255);
          font-weight: 700;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        .blog-content h1 { font-size: 2.25em; }
        .blog-content h2 { font-size: 1.875em; }
        .blog-content h3 { font-size: 1.5em; }
        .blog-content p {
          margin-bottom: 1.5em;
          line-height: 1.75;
        }
        .blog-content a {
          color: rgb(34 211 238);
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: rgb(94 234 212);
        }
        .blog-content ul,
        .blog-content ol {
          margin: 1.5em 0;
          padding-left: 2em;
        }
        .blog-content li {
          margin: 0.5em 0;
        }
        .blog-content blockquote {
          border-left: 4px solid rgb(34 211 238);
          padding-left: 1.5em;
          margin: 1.5em 0;
          font-style: italic;
          color: rgb(148 163 184);
        }
        .blog-content code {
          background: rgb(30 41 59);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        .blog-content pre {
          background: rgb(30 41 59);
          padding: 1.5em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5em 0;
        }
        .blog-content pre code {
          background: none;
          padding: 0;
        }
        .blog-content img {
          margin: 2em auto;
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default BlogPostPage;

