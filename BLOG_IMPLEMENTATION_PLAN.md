# Blog Feature Implementation Plan

## Overview
This document outlines the complete implementation plan for adding a blog feature to the Brushly landing page website. The blog will be SEO-optimized and include full content management capabilities.

## Features Breakdown

### 1. Database Schema (Supabase)

#### Tables Required:
1. **blog_categories**
   - id (uuid, primary key)
   - name (text, unique)
   - slug (text, unique) - SEO-friendly URL slug
   - description (text, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

2. **blog_tags**
   - id (uuid, primary key)
   - name (text, unique)
   - slug (text, unique) - SEO-friendly URL slug
   - created_at (timestamp)

3. **blog_posts**
   - id (uuid, primary key)
   - title (text)
   - slug (text, unique) - SEO-friendly URL slug (used for /post-title)
   - excerpt (text) - Short description for SEO meta description
   - content (jsonb) - Rich text content from TipTap editor
   - featured_image_url (text, nullable)
   - featured_image_alt (text, nullable) - For SEO
   - status (text) - 'draft', 'published', 'archived'
   - author_id (uuid, nullable) - Link to user if auth is added later
   - category_id (uuid, foreign key to blog_categories)
   - published_at (timestamp, nullable) - For scheduling
   - meta_title (text, nullable) - Custom SEO title
   - meta_description (text, nullable) - Custom SEO description
   - meta_keywords (text[], nullable) - SEO keywords array
   - og_image_url (text, nullable) - Open Graph image for social sharing
   - reading_time (integer) - Estimated reading time in minutes
   - views_count (integer, default 0) - Track popularity
   - created_at (timestamp)
   - updated_at (timestamp)

4. **blog_post_tags** (junction table for many-to-many)
   - id (uuid, primary key)
   - post_id (uuid, foreign key to blog_posts)
   - tag_id (uuid, foreign key to blog_tags)
   - created_at (timestamp)

#### Indexes for Performance & SEO:
- Index on blog_posts.slug (for fast lookups)
- Index on blog_posts.status (for filtering published posts)
- Index on blog_posts.published_at (for sorting)
- Index on blog_categories.slug
- Index on blog_tags.slug
- Unique constraint on blog_post_tags(post_id, tag_id)

#### Row Level Security (RLS):
- Blog posts: Public read for published posts, authenticated write
- Categories & Tags: Public read, authenticated write
- Post tags: Public read, authenticated write

### 2. Additional Packages Required

#### Rich Text Editor Extensions:
```json
{
  "@tiptap/extension-link": "^2.1.13",
  "@tiptap/extension-placeholder": "^2.1.13",
  "@tiptap/extension-text-align": "^2.1.13",
  "@tiptap/extension-underline": "^2.1.13",
  "@tiptap/extension-blockquote": "^2.1.13",
  "@tiptap/extension-code-block": "^2.1.13",
  "@tiptap/extension-youtube": "^2.1.13", // For video embeds
  "imagekit": "^4.1.2" // Alternative: Use Supabase Storage + sharp for optimization
}
```

#### For Image Optimization:
Since we're using Supabase Storage, we can:
- Use Supabase Storage for image uploads
- Create a Netlify Edge Function or Supabase Edge Function to optimize images
- Or use client-side compression before upload (browser-image-compression is already installed)

#### For SEO:
- `react-helmet-async` (already installed) ✅
- `react-schemaorg` (optional, for structured data)

### 3. Component Structure

#### Dashboard Components (`src/components/dashboard/`):
```
dashboard/
├── DashboardLayout.tsx        # Main dashboard layout with sidebar
├── BlogList.tsx               # List all blog posts with filters
├── BlogEditor.tsx             # Rich text editor for creating/editing posts
├── CategoryManager.tsx        # CRUD for categories
├── TagManager.tsx             # CRUD for tags
└── ImageUploader.tsx          # Component for image upload with optimization
```

#### Frontend Blog Components (`src/components/blog/`):
```
blog/
├── BlogListPage.tsx           # Blog listing page (/blog)
├── BlogPostPage.tsx           # Individual post page (/:slug)
├── BlogCard.tsx               # Card component for blog preview
├── BlogSidebar.tsx            # Sidebar with categories, tags, recent posts
├── BlogSearch.tsx             # Search functionality
├── ShareButtons.tsx           # Social sharing (react-share already installed)
└── RelatedPosts.tsx           # Related posts suggestions
```

#### Services (`src/services/`):
```
services/
├── supabaseClient.ts          # Supabase client initialization
├── blogService.ts             # Blog CRUD operations
├── categoryService.ts         # Category operations
├── tagService.ts              # Tag operations
└── imageService.ts            # Image upload & optimization
```

### 4. Routing Structure

#### SEO-Friendly URL Strategy:
- Blog listing: `/blog` (optional, can redirect to home with blog filter)
- Individual posts: `/:slug` (e.g., `/how-to-create-art`, `/brushly-features`)
- This requires catch-all route that checks if slug exists in database
- If not found, show 404

#### Route Implementation:
```tsx
// In App.tsx
<Route path="/blog" element={<BlogListPage />} />
<Route path="/:slug" element={<BlogPostPage />} /> // Catch-all, check database
```

### 5. SEO Optimizations

#### On-Page SEO:
1. **Meta Tags** (via react-helmet-async):
   - Title (custom or auto-generated)
   - Meta description
   - Open Graph tags (og:title, og:description, og:image)
   - Twitter Card tags
   - Canonical URL
   - Keywords meta tag

2. **Structured Data** (JSON-LD):
   - Article schema
   - BreadcrumbList schema
   - Organization schema

3. **Technical SEO**:
   - Proper heading hierarchy (H1, H2, H3)
   - Alt text for all images
   - Semantic HTML5 elements
   - Fast loading (optimized images)
   - Mobile responsive

4. **URL Structure**:
   - Clean, readable slugs
   - No query parameters in URLs
   - Short, descriptive URLs

5. **Content SEO**:
   - Reading time estimation
   - Table of contents (auto-generated)
   - Internal linking suggestions
   - Related posts

#### Sitemap & RSS:
- Generate sitemap.xml dynamically
- Generate RSS feed for blog posts
- Both accessible at `/sitemap.xml` and `/rss.xml`

### 6. Image Handling Strategy

#### Upload Flow:
1. User selects image in editor
2. Client-side compression to WebP (70% quality) using browser-image-compression
3. Upload to Supabase Storage bucket: `blog-images`
4. Store public URL in database
5. Optionally: Create thumbnails for featured images

#### Storage Structure:
```
blog-images/
├── {year}/
│   ├── {month}/
│   │   ├── {post-slug}/
│   │   │   ├── featured.webp
│   │   │   ├── image-1.webp
│   │   │   └── ...
```

#### Optimization:
- Convert to WebP format (70% quality)
- Max width: 1200px for featured images
- Max width: 800px for inline images
- Lazy loading on frontend

### 7. Rich Text Editor Features (TipTap)

#### Supported Features:
- Headings (H1-H6)
- Bold, Italic, Underline
- Bullet lists, Numbered lists
- Blockquotes
- Code blocks
- Links
- Images (upload & embed)
- YouTube embeds (via URL)
- Horizontal rules
- Text alignment
- Undo/Redo

#### Editor UI:
- Toolbar with all formatting options
- Image upload button
- Video embed button (YouTube URL)
- Preview mode
- Word count
- Reading time estimation

### 8. Dashboard Features

#### Blog Management:
- ✅ List all posts (with status filter)
- ✅ Create new post
- ✅ Edit existing post
- ✅ Delete post (with confirmation)
- ✅ Duplicate post
- ✅ Change status (draft/published/archived)
- ✅ Preview post before publishing
- ✅ Schedule publishing (published_at)

#### Category Management:
- ✅ Create/edit/delete categories
- ✅ Assign categories to posts
- ✅ View posts by category

#### Tag Management:
- ✅ Create/edit/delete tags
- ✅ Auto-suggest existing tags
- ✅ Assign multiple tags to posts
- ✅ View posts by tag

#### Analytics (Future):
- View count per post
- Popular posts
- Search queries

### 9. Frontend Blog Features

#### Blog Listing Page:
- Grid/List view toggle
- Filter by category
- Filter by tag
- Search functionality
- Pagination or infinite scroll
- Sort by: Latest, Popular, Trending
- Featured posts section

#### Individual Post Page:
- Full content with rich formatting
- Featured image
- Category & tags
- Author info (if available)
- Publish date
- Reading time
- Share buttons
- Related posts
- Table of contents (auto-generated from headings)
- Comments section (future)

### 10. Authentication & Authorization

#### For Dashboard Access:
- Supabase Auth integration
- Role-based access (admin/editor)
- Protected dashboard routes
- Login page for dashboard

#### Public Access:
- All published blog posts are publicly readable
- No authentication required for viewing

### 11. Migration Files

#### Supabase Migrations:
1. `001_create_blog_categories.sql`
2. `002_create_blog_tags.sql`
3. `003_create_blog_posts.sql`
4. `004_create_blog_post_tags.sql`
5. `005_create_indexes.sql`
6. `006_setup_rls_policies.sql`
7. `007_create_storage_bucket.sql`

### 12. Implementation Order

#### Phase 1: Database Setup
1. ✅ Create Supabase migrations
2. ✅ Set up Supabase client
3. ✅ Create storage bucket for images
4. ✅ Set up RLS policies

#### Phase 2: Core Services
1. ✅ Create blog service (CRUD)
2. ✅ Create category service
3. ✅ Create tag service
4. ✅ Create image service

#### Phase 3: Dashboard
1. ✅ Create dashboard layout
2. ✅ Create blog list component
3. ✅ Create blog editor component
4. ✅ Create category/tag managers

#### Phase 4: Frontend
1. ✅ Create blog listing page
2. ✅ Create individual post page
3. ✅ Add routing
4. ✅ Add SEO meta tags

#### Phase 5: SEO Enhancements
1. ✅ Add structured data
2. ✅ Generate sitemap
3. ✅ Generate RSS feed
4. ✅ Add Open Graph tags

#### Phase 6: Polish
1. ✅ Add loading states
2. ✅ Add error handling
3. ✅ Add animations
4. ✅ Mobile optimization

## Environment Variables

Add to `.env` or Netlify environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (server-side only)
```

## Testing Checklist

- [ ] Create blog post with all features
- [ ] Upload and optimize images
- [ ] Test category/tag creation
- [ ] Test draft/publish workflow
- [ ] Test URL slug generation
- [ ] Test SEO meta tags
- [ ] Test responsive design
- [ ] Test image optimization
- [ ] Test search functionality
- [ ] Test filtering by category/tag

## Future Enhancements

- Comments system
- Blog analytics dashboard
- A/B testing for headlines
- Newsletter integration for new posts
- Multi-author support
- Content scheduling
- SEO score analysis
- Internal linking suggestions
- Reading progress indicator
- Print-friendly CSS

