import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Image as ImageIcon, User, MessageSquare, X, Instagram, Linkedin, Facebook, Twitter, CheckCircle2, ChevronLeft, ChevronRight, Mail, Award } from 'lucide-react';
import { ModernHeader } from '../ui/modern-header';
import { Footer } from '../ui/Footer';
import {
  fetchArtistProfileBySlug,
  fetchArtworksByIds,
  processCategories,
  getCategoryDisplayName,
  type ArtistProfile,
  type Artwork
} from '../../services/artistProfileService';
import { ArtworkComments } from './ArtworkComments';
import { format } from 'date-fns';
import { fetchArtworkComments } from '../../services/commentService';

const ArtistProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [showSeparator, setShowSeparator] = useState(true);
  const socialIconsRef = React.useRef<HTMLDivElement>(null);
  const emailRef = React.useRef<HTMLAnchorElement>(null);
  const pageSize = 10;

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  // Check if email wraps to next line and hide separator accordingly
  useEffect(() => {
    const checkWrapping = () => {
      if (socialIconsRef.current && emailRef.current) {
        const socialRect = socialIconsRef.current.getBoundingClientRect();
        const emailRect = emailRef.current.getBoundingClientRect();
        // If email is on a different line (different top position), hide separator
        const isWrapped = Math.abs(socialRect.top - emailRect.top) > 5;
        setShowSeparator(!isWrapped);
      }
    };

    // Check on mount and resize
    checkWrapping();
    window.addEventListener('resize', checkWrapping);
    
    // Also check after a short delay to account for layout settling
    const timeoutId = setTimeout(checkWrapping, 100);

    return () => {
      window.removeEventListener('resize', checkWrapping);
      clearTimeout(timeoutId);
    };
  }, [profile, artworks]);

  const loadArtworks = async (artworkIds: string[], userId: string, page: number) => {
    setLoadingArtworks(true);
    try {
      const { artworks: artworksData, total } = await fetchArtworksByIds(
        artworkIds,
        userId,
        page,
        pageSize
      );
      setArtworks(artworksData);
      setTotalArtworks(total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading artworks:', err);
    } finally {
      setLoadingArtworks(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!profile || !profile.public_profile_artworks) return;
    await loadArtworks(profile.public_profile_artworks, profile.id, newPage);
    // Scroll to top of portfolio section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadProfile = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);
    try {
      const profileData = await fetchArtistProfileBySlug(username);
      
      if (!profileData) {
        setError('Profile not found');
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setCurrentPage(1); // Reset to first page

      // Fetch first page of artworks
      if (profileData.public_profile_artworks && profileData.public_profile_artworks.length > 0) {
        await loadArtworks(profileData.public_profile_artworks, profileData.id, 1);
      } else {
        setArtworks([]);
        setTotalArtworks(0);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <ModernHeader />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-slate-400 mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <ModernHeader />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-slate-400 mb-8">{error || 'The profile you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = processCategories(profile.public_profile_categories);
  const displayName = profile.artist_display_name || 'Artist';

  // Artwork Card Component
  const ArtworkCard: React.FC<{ artwork: Artwork; index: number; categories: ReturnType<typeof processCategories> }> = ({ artwork, index, categories }) => {
    const [commentCount, setCommentCount] = useState<number>(0);

    useEffect(() => {
      // Load comment count
      const loadCommentCount = async () => {
        try {
          const comments = await fetchArtworkComments(artwork.id);
          setCommentCount(comments.length);
        } catch (error) {
          console.error('Error loading comment count:', error);
        }
      };
      loadCommentCount();
    }, [artwork.id]);

    const artworkCategory = artwork.medium || (categories.length > 0 ? getCategoryDisplayName(categories[0]) : 'Portfolio');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex flex-col bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-colors h-full"
      >
        {/* Artwork Image - Clickable */}
        <button
          onClick={() => setSelectedArtwork(artwork)}
          className="aspect-square bg-slate-900/50 flex items-center justify-center overflow-hidden cursor-pointer group"
        >
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* Artwork Info */}
        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2" style={{ fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif' }}>{artwork.title}</h3>
          
          {/* Category and Comments row */}
          <div className="flex items-center gap-2 text-xs text-cyan-300 mt-auto pt-2 border-t border-slate-700/50">
            <span className="truncate">{artworkCategory}</span>
            <button
              onClick={() => setSelectedArtwork(artwork)}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-400 transition-colors ml-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{displayName} | Brushly Art</title>
        <meta name="description" content={profile.about || `View ${displayName}'s portfolio on Brushly Art`} />
        <meta property="og:title" content={`${displayName} | Brushly Art`} />
        <meta property="og:description" content={profile.about || `View ${displayName}'s portfolio`} />
        {profile.public_profile_image_url && (
          <meta property="og:image" content={profile.public_profile_image_url} />
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        {/* Aurora/Spotlight Background Effect - Limited to hero section height */}
        <div className="absolute inset-0 h-screen overflow-hidden pointer-events-none">
          <div
            className={`
              [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
              [--aurora:repeating-linear-gradient(100deg,var(--cyan-500)_10%,var(--teal-400)_15%,var(--cyan-400)_20%,var(--teal-300)_25%,var(--cyan-600)_30%)]
              [background-image:var(--dark-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              filter blur-[10px]
              after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
              after:[background-size:200%,_100%] 
              after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
              absolute -inset-[10px] opacity-50 will-change-transform
              [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]
            `}
          ></div>
        </div>

        <div className="relative z-10">
          <ModernHeader />
          
          <div className="pt-24 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Profile header on background (no card) */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-center"
            >
              {/* Profile Image - First row on mobile */}
              <div className="flex-shrink-0">
                <div className="relative inline-block h-40 w-40 md:h-44 md:w-44">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/50 blur-xl" />
                  {profile.public_profile_image_url ? (
                    <img
                      src={profile.public_profile_image_url}
                      alt={displayName}
                      className="relative h-40 w-40 md:h-44 md:w-44 rounded-full border-4 border-cyan-400/80 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="relative flex h-40 w-40 md:h-44 md:w-44 items-center justify-center rounded-full border-4 border-cyan-400/80 bg-slate-800 shadow-xl">
                      <User className="h-20 w-20 text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name and meta - Second row on mobile */}
              <div className="flex-1 w-full md:w-auto text-center md:text-left">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-1 text-sm text-cyan-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Brushly Verified Artist</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-3">
                  <span className="text-white font-serif italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {displayName}
                  </span>
                </h1>
                {/* Social Media Icons and Email */}
                {(profile.public_profile_instagram_url || 
                  profile.public_profile_facebook_url || 
                  profile.public_profile_linkedin_url || 
                  profile.public_profile_twitter_url || 
                  profile.public_profile_tiktok_url ||
                  profile.public_profile_email) && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                    {/* Social Icons */}
                    <div ref={socialIconsRef} className="flex items-center gap-3 flex-shrink-0">
                      {profile.public_profile_instagram_url && (
                        <a
                          href={profile.public_profile_instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {profile.public_profile_facebook_url && (
                        <a
                          href={profile.public_profile_facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {profile.public_profile_linkedin_url && (
                        <a
                          href={profile.public_profile_linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {profile.public_profile_twitter_url && (
                        <a
                          href={profile.public_profile_twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {profile.public_profile_tiktok_url && (
                        <a
                          href={profile.public_profile_tiktok_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                          aria-label="TikTok"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    {/* Separator - only shows when email is on same line */}
                    {(profile.public_profile_instagram_url || 
                      profile.public_profile_facebook_url || 
                      profile.public_profile_linkedin_url || 
                      profile.public_profile_twitter_url || 
                      profile.public_profile_tiktok_url) && profile.public_profile_email && showSeparator && (
                      <div className="h-5 w-px bg-slate-600 flex-shrink-0" />
                    )}
                    {/* Email */}
                    {profile.public_profile_email && (
                      <a
                        ref={emailRef}
                        href={`mailto:${profile.public_profile_email}`}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex-shrink-0"
                        aria-label="Email"
                      >
                        <Mail className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm truncate max-w-[200px] sm:max-w-none">{profile.public_profile_email}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.section>

            {/* Combined Card: About, Category, and Portfolio */}
            <section className="rounded-2xl bg-slate-900/70 border border-slate-700/80 px-6 py-6 md:px-8 md:py-8">
              {/* About & Category section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-slate-700/50">
                <div className="md:col-span-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-white mb-3">
                    About the Artist
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-base md:text-lg">
                    {profile.about ||
                      `${displayName} is an artist on Brushly. Explore their portfolio and creative journey below.`}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-white mb-3">
                    Category
                  </h2>
                  {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-slate-900/80 px-4 py-1.5 text-sm text-cyan-300 border border-cyan-500"
                        >
                          {getCategoryDisplayName(category)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No categories added yet.</p>
                  )}
                </div>
              </div>

              {/* Achievements Section */}
              {profile.public_profile_achievements && profile.public_profile_achievements.length > 0 && (
                <div className="mb-10 pb-10 border-b border-slate-700/50">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-white mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    Achievements
                  </h2>
                  <ul className="space-y-2 list-none">
                    {profile.public_profile_achievements.map((achievement, index) => {
                      // Handle both string and object achievements (objects have {id, title} structure)
                      let achievementText: string;
                      if (typeof achievement === 'string') {
                        achievementText = achievement;
                      } else if (typeof achievement === 'object' && achievement !== null) {
                        const achievementObj = achievement as { id?: string; title?: string };
                        achievementText = achievementObj.title || achievementObj.id || String(achievement);
                      } else {
                        achievementText = String(achievement);
                      }
                      
                      return (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start gap-3 text-slate-300"
                        >
                          <span className="text-cyan-400 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{achievementText}</span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Portfolio Section */}
              {profile.public_profile_artworks && profile.public_profile_artworks.length > 0 ? (
                <div className="space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Portfolio
                  </h2>

                  {loadingArtworks && artworks.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" />
                    </div>
                  ) : artworks.length > 0 ? (
                    <>
                      <div className="relative">
                        {loadingArtworks && (
                          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" />
                          </div>
                        )}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                          {artworks.map((artwork, index) => (
                            <ArtworkCard key={artwork.id} artwork={artwork} index={index} categories={categories} />
                          ))}
                        </div>
                      </div>

                      {/* Pagination */}
                      {totalArtworks > pageSize && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loadingArtworks}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                          </button>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              Page {currentPage} of {Math.ceil(totalArtworks / pageSize)}
                            </span>
                            <span className="text-sm text-slate-500">
                              ({totalArtworks} total)
                            </span>
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= Math.ceil(totalArtworks / pageSize) || loadingArtworks}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No portfolio items available yet.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No portfolio items available yet.</p>
                </div>
              )}
            </section>
          </div>
          </div>

          <Footer />
        </div>
      </div>

      {/* Instagram-style Artwork Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl md:bg-white/2 md:backdrop-blur-xl md:flex md:items-center md:justify-center md:p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full h-full md:w-full md:max-w-6xl md:h-[90vh] bg-slate-900 md:bg-slate-800/95 md:backdrop-blur-lg md:rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row md:border md:border-slate-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Mobile optimized */}
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 left-4 md:top-4 md:right-4 md:left-auto z-20 p-2 bg-slate-800/80 md:bg-slate-700/60 hover:bg-slate-700/80 md:hover:bg-slate-600/60 rounded-full text-white transition-colors backdrop-blur-sm"
                aria-label="Close"
              >
                <ArrowLeft className="w-6 h-6 md:hidden" />
                <X className="w-6 h-6 hidden md:block" />
              </button>

              {/* Top Section - Artwork Image (Mobile) / Left Side (Desktop) */}
              <div className="flex-shrink-0 h-[40vh] md:flex-1 md:h-auto bg-slate-900 md:bg-slate-800/50 flex items-center justify-center p-4 md:p-8 lg:p-12 min-h-0">
                <img
                  src={selectedArtwork.image_url}
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Bottom Section - Details and Comments (Mobile) / Right Side (Desktop) */}
              <div className="w-full md:w-96 lg:w-[28rem] bg-slate-900 md:bg-slate-800/70 flex flex-col border-t border-slate-700/50 md:border-t-0 md:border-l md:border-slate-700/30 flex-1 md:flex-shrink-0 min-h-0 md:max-h-none">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-700/30 flex-shrink-0">
                  <div className="hidden md:flex items-center gap-3 mb-3 md:mb-4">
                    {profile.public_profile_image_url ? (
                      <img
                        src={profile.public_profile_image_url}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400/70"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-cyan-400/70">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{displayName}</h3>
                    </div>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {selectedArtwork.title}
                  </h2>
                  {selectedArtwork.description && (
                    <p className="text-sm text-slate-300 mb-3 line-clamp-3">{selectedArtwork.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-cyan-300">
                    <span>{selectedArtwork.medium || 'Portfolio'}</span>
                    {selectedArtwork.created_at && (
                      <>
                        <span className="text-cyan-500">•</span>
                        <span>{format(new Date(selectedArtwork.created_at), 'MMM yyyy')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Comments Section - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <ArtworkComments artworkId={selectedArtwork.id} artworkOwnerId={profile.id} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtistProfilePage;
