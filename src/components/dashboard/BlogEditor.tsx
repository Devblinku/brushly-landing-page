import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Youtube,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import ResizableImage from './ResizableImage';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import CodeBlock from '@tiptap/extension-code-block';
import YouTube from '@tiptap/extension-youtube';
import {
  getPostById,
  createPost,
  updatePost,
} from '../../services/blogService';
import { getAllCategories } from '../../services/categoryService';
import { getAllTags, createOrGetTags } from '../../services/tagService';
import {
  uploadImagesFromDataURLs,
  validateImageFile,
} from '../../services/imageService';
import { generateSlug } from '../../services/categoryService';
import { useAuth } from '../auth/AuthContext';
import { fileToDataURL, extractImageUrls, replaceImageUrls, isDataURL } from '../../utils/imageUtils';
import ImageGallery from './ImageGallery';
import type {
  BlogPostCreate,
  BlogPostUpdate,
} from '../../types/blog';
import type { BlogCategory, BlogTag } from '../../types/blog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [publishedAt, setPublishedAt] = useState('');

  // Data loading
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setEditorState] = useState({});
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [loadedContent, setLoadedContent] = useState<any>(null);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
            },
            height: {
              default: null,
            },
          };
        },
        addNodeView() {
          return ReactNodeViewRenderer(ResizableImage);
        },
      }).configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 cursor-pointer',
        },
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-400 hover:text-cyan-300 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'blockquote'],
      }),
      UnderlineExtension,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-slate-900 rounded-lg p-4',
        },
      }),
      YouTube.configure({
        width: 560,
        height: 315,
        HTMLAttributes: {
          class: 'rounded-lg my-4',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] focus:outline-none p-4 text-white editor-content',
        style: 'color: white;',
      },
    },
    immediatelyRender: false,
    onUpdate: () => {
      // Force re-render to update button states
      setEditorState({});
    },
    onSelectionUpdate: () => {
      // Update button states when selection changes
      setEditorState({});
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug, isEditing]);

  // Load data
  useEffect(() => {
    loadCategories();
    loadTags();
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      const data = await getAllTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadPost = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const post = await getPostById(id, true);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || '');
        setStatus(post.status);
        setCategoryId(post.category_id || '');
        setSelectedTags(post.tags?.map((t) => t.id) || []);
        setFeaturedImageUrl(post.featured_image_url || '');
        setFeaturedImageAlt(post.featured_image_alt || '');
        setMetaTitle(post.meta_title || '');
        setMetaDescription(post.meta_description || '');
        setMetaKeywords(post.meta_keywords?.join(', ') || '');
        setPublishedAt(post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '');
        
        // Store content to load when editor is ready
        if (post.content) {
          console.log('Post content loaded from database:', post.content);
          setLoadedContent(post.content);
        } else {
          console.warn('Post content is empty or null');
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  // Load content into editor when editor is ready
  useEffect(() => {
    if (!editor || !loadedContent) return;
    
    if (editor.isDestroyed) {
      console.warn('Editor is destroyed, cannot load content');
      return;
    }
    
    // Use setTimeout to ensure editor is fully ready
    const timer = setTimeout(() => {
      try {
        // Check if editor already has content
        const currentContent = editor.getJSON();
        const isEmpty = !currentContent || 
          (typeof currentContent === 'object' && 
           (!currentContent.content || 
            !Array.isArray(currentContent.content) || 
            currentContent.content.length === 0));
        
        // Only load if editor is empty or content is different
        if (isEmpty || JSON.stringify(currentContent) !== JSON.stringify(loadedContent)) {
          console.log('Loading content into editor. Content preview:', JSON.stringify(loadedContent).substring(0, 100));
          editor.commands.setContent(loadedContent);
          console.log('Content successfully loaded into editor');
        } else {
          console.log('Editor already has content, skipping load');
        }
        // Don't clear loadedContent here - it will be cleared when component unmounts
      } catch (error) {
        console.error('Error setting editor content:', error);
        console.error('Content that failed to load:', loadedContent);
      }
    }, 300); // Increased timeout to ensure editor is fully ready
    
    return () => clearTimeout(timer);
  }, [editor, loadedContent]);

  const handleImageSelect = useCallback(async (imageUrl: string) => {
    if (!editor) return;
    
    // Insert image into editor (will be data URL if new, or existing URL if from gallery)
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setShowImageGallery(false);
  }, [editor]);


  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      // Convert to data URL for temporary storage (will upload on save)
      const dataUrl = await fileToDataURL(file);
      setFeaturedImageUrl(dataUrl);
      
      // Extract alt text from filename
      const alt = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      setFeaturedImageAlt(alt);
    } catch (error) {
      console.error('Error processing featured image:', error);
      alert('Failed to process featured image. Please try again.');
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const tag = await createOrGetTags([newTagName.trim()]);
      if (tag.length > 0 && !selectedTags.includes(tag[0].id)) {
        setSelectedTags([...selectedTags, tag[0].id]);
        setNewTagName('');
        loadTags(); // Refresh tags list
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleAddYouTube = () => {
    if (!editor) return;
    const url = prompt('Enter YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const handleSave = async () => {
    // Check authentication
    if (!user) {
      setError('You must be logged in to save posts. Please log in and try again.');
      navigate('/dashboard/login');
      return;
    }

    if (!editor) {
      setError('Editor not ready. Please wait a moment and try again.');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!slug.trim()) {
      setError('URL slug is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let content = editor.getJSON();
      
      console.log('Saving post - Editor content:', JSON.stringify(content).substring(0, 200));
      
      // Allow saving drafts with minimal content, but warn if content is completely empty
      const hasContent = content && typeof content === 'object' && content.content && Array.isArray(content.content) && content.content.length > 0;
      
      // If content is empty, create a default empty document structure
      if (!hasContent) {
        content = {
          type: 'doc',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              attrs: {},
              content: []
            }
          ]
        };
        console.log('No content found, using default empty document structure');
      }
      
      if (!hasContent && status === 'published') {
        setError('Published posts must have content. Please add some content before publishing, or save as draft first.');
        setSaving(false);
        return;
      }

      // Extract and upload data URL images before saving
      const postSlug = slug.trim();
      const imageUrls = extractImageUrls(content);
      let dataUrlImages = imageUrls.filter(url => isDataURL(url));
      
      // Also check featured image
      let finalFeaturedImageUrl = featuredImageUrl;
      if (featuredImageUrl && isDataURL(featuredImageUrl)) {
        dataUrlImages.push(featuredImageUrl);
      }
      
      if (dataUrlImages.length > 0) {
        console.log(`Uploading ${dataUrlImages.length} image(s) before saving...`);
        const urlMap = await uploadImagesFromDataURLs(dataUrlImages, postSlug);
        content = replaceImageUrls(content, urlMap);
        
        // Update featured image URL if it was a data URL
        if (featuredImageUrl && urlMap[featuredImageUrl]) {
          finalFeaturedImageUrl = urlMap[featuredImageUrl];
        }
        
        console.log('Images uploaded successfully');
      }

      const postData: BlogPostCreate | BlogPostUpdate = {
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim() || null,
        content,
        status,
        category_id: categoryId || null,
        tag_ids: selectedTags,
        featured_image_url: finalFeaturedImageUrl || null,
        featured_image_alt: featuredImageAlt.trim() || null,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        meta_keywords: metaKeywords
          ? metaKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : null,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      };

      console.log('Saving post with data:', { ...postData, content: '[content object]' });

      if (isEditing && id) {
        console.log('Updating post:', id);
        await updatePost(id, postData);
      } else {
        console.log('Creating new post');
        await createPost(postData as BlogPostCreate);
      }

      console.log('Post saved successfully, redirecting...');
      navigate('/dashboard/posts');
    } catch (error: any) {
      console.error('Error saving post:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        error,
      });
      
      // More detailed error message
      let errorMessage = 'Failed to save post. ';
      if (error?.message) {
        errorMessage += error.message;
      } else if (error?.details) {
        errorMessage += error.details;
      } else {
        errorMessage += 'Please check your browser console for details.';
      }
      
      setError(errorMessage);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-slate-400 mt-4">Loading editor...</p>
      </div>
    );
  }

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/posts')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Posts</span>
        </button>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400"
        >
          <p className="font-semibold mb-1">Error saving post:</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-red-300">
            Check the browser console (F12) for more details.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              className="text-3xl font-bold bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>

          {/* Editor Toolbar */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 p-2 border-b border-slate-700/50">
              {/* Text Formatting */}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('bold')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('italic')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('underline')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-slate-700" />

              {/* Headings */}
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-2 rounded font-semibold transition-all duration-200 ${
                  editor.isActive('heading', { level: 1 })
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-2 rounded font-semibold transition-all duration-200 ${
                  editor.isActive('heading', { level: 2 })
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-2 rounded font-semibold transition-all duration-200 ${
                  editor.isActive('heading', { level: 3 })
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Heading 3"
              >
                H3
              </button>

              <div className="w-px h-6 bg-slate-700" />

              {/* Lists */}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('bulletList')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('orderedList')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('blockquote')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('codeBlock')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-slate-700" />

              {/* Alignment */}
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive({ textAlign: 'left' })
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive({ textAlign: 'center' })
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive({ textAlign: 'right' })
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-slate-700" />

              {/* Media */}
              <button
                onClick={() => setShowImageGallery(true)}
                className="p-2 rounded hover:bg-slate-700 text-slate-300 transition-all duration-200"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddYouTube}
                className="p-2 rounded hover:bg-slate-700 text-slate-300"
                title="Add YouTube Video"
              >
                <Youtube className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={`p-2 rounded transition-all duration-200 ${
                  editor.isActive('link')
                    ? 'bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Add Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Content */}
            <div className="bg-slate-900/50 min-h-[500px] text-white">
              <EditorContent editor={editor} />
              <style>{`
                .ProseMirror {
                  color: white !important;
                  outline: none;
                }
                .ProseMirror p {
                  color: white !important;
                  margin: 0.75em 0;
                  line-height: 1.75;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                  color: rgb(148 163 184) !important;
                  content: attr(data-placeholder);
                  float: left;
                  height: 0;
                  pointer-events: none;
                }
                .ProseMirror h1 {
                  color: white !important;
                  font-size: 2em !important;
                  font-weight: 700 !important;
                  margin-top: 1em !important;
                  margin-bottom: 0.5em !important;
                  line-height: 1.2 !important;
                  display: block !important;
                }
                .ProseMirror h2 {
                  color: white !important;
                  font-size: 1.5em !important;
                  font-weight: 700 !important;
                  margin-top: 1em !important;
                  margin-bottom: 0.5em !important;
                  line-height: 1.3 !important;
                  display: block !important;
                }
                .ProseMirror h3 {
                  color: white !important;
                  font-size: 1.25em !important;
                  font-weight: 700 !important;
                  margin-top: 1em !important;
                  margin-bottom: 0.5em !important;
                  line-height: 1.4 !important;
                  display: block !important;
                }
                .ProseMirror h4,
                .ProseMirror h5,
                .ProseMirror h6 {
                  color: white !important;
                  font-weight: 700 !important;
                  margin-top: 1em !important;
                  margin-bottom: 0.5em !important;
                  display: block !important;
                }
                .ProseMirror ul[data-type="bulletList"],
                .ProseMirror ul {
                  list-style-type: disc !important;
                  list-style-position: outside !important;
                  padding-left: 2em !important;
                  margin: 0.75em 0 !important;
                  display: block !important;
                }
                .ProseMirror ul[data-type="bulletList"] > li,
                .ProseMirror ul > li,
                .ProseMirror ul li[data-type="listItem"] {
                  color: white !important;
                  list-style-type: disc !important;
                  list-style-position: outside !important;
                  display: list-item !important;
                  margin: 0.25em 0 !important;
                  padding-left: 0.5em !important;
                  margin-left: 0 !important;
                }
                .ProseMirror ul li::marker,
                .ProseMirror ul > li::marker {
                  color: white !important;
                  font-weight: bold !important;
                }
                .ProseMirror ol[data-type="orderedList"],
                .ProseMirror ol {
                  list-style-type: decimal !important;
                  list-style-position: outside !important;
                  padding-left: 2em !important;
                  margin: 0.75em 0 !important;
                  display: block !important;
                  counter-reset: list-counter !important;
                }
                .ProseMirror ol[data-type="orderedList"] > li,
                .ProseMirror ol > li,
                .ProseMirror ol li[data-type="listItem"] {
                  color: white !important;
                  list-style-type: decimal !important;
                  list-style-position: outside !important;
                  display: list-item !important;
                  margin: 0.25em 0 !important;
                  padding-left: 0.5em !important;
                  margin-left: 0 !important;
                }
                .ProseMirror ol li::marker,
                .ProseMirror ol > li::marker {
                  color: white !important;
                  font-weight: bold !important;
                }
                .ProseMirror blockquote {
                  color: rgb(203 213 225) !important;
                  border-left: 4px solid rgb(34 211 238) !important;
                  padding-left: 1.5em !important;
                  padding-right: 1em !important;
                  padding-top: 0.5em !important;
                  padding-bottom: 0.5em !important;
                  margin: 1em 0 !important;
                  margin-left: 0 !important;
                  font-style: italic !important;
                  background-color: rgba(34, 211, 238, 0.05) !important;
                  border-radius: 0 0.5rem 0.5rem 0 !important;
                  display: block !important;
                }
                .ProseMirror blockquote p {
                  color: rgb(203 213 225) !important;
                  margin: 0.5em 0 !important;
                }
                .ProseMirror blockquote:first-child {
                  margin-top: 0 !important;
                }
                .ProseMirror blockquote:last-child {
                  margin-bottom: 0 !important;
                }
                .ProseMirror code {
                  background-color: rgb(30 41 59) !important;
                  color: white !important;
                  padding: 0.2em 0.4em !important;
                  border-radius: 0.25rem !important;
                  font-size: 0.9em !important;
                }
                .ProseMirror pre {
                  background-color: rgb(30 41 59) !important;
                  color: white !important;
                  padding: 1em !important;
                  border-radius: 0.5rem !important;
                  overflow-x: auto !important;
                  margin: 1em 0 !important;
                }
                .ProseMirror pre code {
                  background-color: transparent !important;
                  padding: 0 !important;
                }
                .ProseMirror a {
                  color: rgb(34 211 238) !important;
                  text-decoration: underline !important;
                }
                .ProseMirror a:hover {
                  color: rgb(94 234 212) !important;
                }
                .ProseMirror img {
                  max-width: 100% !important;
                  height: auto !important;
                  border-radius: 0.5rem !important;
                  margin: 1em 0 !important;
                  cursor: pointer !important;
                  position: relative !important;
                  display: inline-block !important;
                }
                .ProseMirror img.ProseMirror-selectednode {
                  outline: 2px solid rgb(34 211 238) !important;
                  outline-offset: 2px !important;
                }
                /* Enable resize on selected images */
                .ProseMirror img[data-resizable="true"] {
                  resize: both !important;
                  overflow: hidden !important;
                  min-width: 50px !important;
                  min-height: 50px !important;
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Label className="text-slate-300 mb-2 block">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Slug */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Label className="text-slate-300 mb-2 block">URL Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="post-url-slug"
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Label className="text-slate-300 mb-2 block">Excerpt</Label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description..."
              rows={4}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none"
            />
          </div>

          {/* Category */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Label className="text-slate-300 mb-2 block">Category</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Label className="text-slate-300 mb-2 block">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="bg-slate-900/50 border-slate-700 text-white text-sm"
              />
              <Button onClick={handleAddTag} size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm flex items-center gap-1"
                  >
                    {tag.name}
                    <button
                      onClick={() => setSelectedTags(selectedTags.filter((id) => id !== tagId))}
                      className="hover:text-cyan-300"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Label className="text-slate-300 mb-2 block">Featured Image</Label>
            {featuredImageUrl && (
              <img
                src={featuredImageUrl}
                alt={featuredImageAlt}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageUpload}
              className="w-full text-sm text-slate-400"
            />
            {featuredImageUrl && (
              <Input
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Alt text"
                className="mt-2 bg-slate-900/50 border-slate-700 text-white text-sm"
              />
            )}
          </div>

          {/* SEO */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3">
            <Label className="text-slate-300 block font-semibold">SEO Settings</Label>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Meta Title</Label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Custom SEO title"
                className="bg-slate-900/50 border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Meta Description</Label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO description"
                rows={3}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm resize-none"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Keywords (comma-separated)</Label>
              <Input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="keyword1, keyword2"
                className="bg-slate-900/50 border-slate-700 text-white text-sm"
              />
            </div>
          </div>

          {/* Publish Date */}
          {status === 'published' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <Label className="text-slate-300 mb-2 block">Publish Date</Label>
              <Input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        onSelectImage={handleImageSelect}
        postSlug={slug}
      />
    </div>
  );
};

export default BlogEditor;

