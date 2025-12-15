import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Image as ImageIcon, User, MessageSquare, X } from 'lucide-react';
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

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

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

      // Fetch artworks
      if (profileData.public_profile_artworks && profileData.public_profile_artworks.length > 0) {
        const artworksData = await fetchArtworksByIds(
          profileData.public_profile_artworks,
          profileData.id
        );
        setArtworks(artworksData);
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

    const artworkCategory = artwork.medium || (categories.length > 0 ? getCategoryDisplayName(categories[0]) : 'Artwork');

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
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2" style={{ fontFamily: '"Playfair Display", serif' }}>{artwork.title}</h3>
          
          {/* Category and Comments row */}
          <div className="flex items-center gap-2 text-xs text-cyan-300 mt-auto pt-2 border-t border-slate-700/50">
            <span className="truncate">{artworkCategory}</span>
            <button
              onClick={() => setSelectedArtwork(artwork)}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-400 transition-colors ml-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
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
        <meta name="description" content={profile.about || `View ${displayName}'s artwork on Brushly Art`} />
        <meta property="og:title" content={`${displayName} | Brushly Art`} />
        <meta property="og:description" content={profile.about || `View ${displayName}'s artwork`} />
        {profile.public_profile_image_url && (
          <meta property="og:image" content={profile.public_profile_image_url} />
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        {/* Aurora/Spotlight Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              className="mb-8 flex flex-col gap-6 md:flex-row md:items-center"
            >
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-cyan-500/50 blur-xl" />
                  {profile.public_profile_image_url ? (
                    <img
                      src={profile.public_profile_image_url}
                      alt={displayName}
                      className="relative h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-cyan-400/80 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="relative flex h-28 w-28 md:h-32 md:w-32 items-center justify-center rounded-full border-4 border-cyan-400/80 bg-slate-800 shadow-xl">
                      <User className="h-14 w-14 text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name and meta */}
              <div className="flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-1 text-sm text-cyan-100">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span>Discovery</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1">
                  <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-serif italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {displayName}
                  </span>
                </h1>
              </div>
            </motion.section>

            {/* Combined Card: About, Category, and Artworks */}
            <section className="rounded-2xl bg-slate-900/70 border border-slate-700/80 px-6 py-6 md:px-8 md:py-8">
              {/* About & Category section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-slate-700/50">
                <div className="md:col-span-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-white mb-3">
                    About the Artist
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-base md:text-lg">
                    {profile.about ||
                      `${displayName} is an artist on Brushly. Explore their latest artworks and creative journey below.`}
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

              {/* Artworks Section */}
              {artworks.length > 0 ? (
                <div className="space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Artworks
                  </h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {artworks.map((artwork, index) => (
                      <ArtworkCard key={artwork.id} artwork={artwork} index={index} categories={categories} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No artworks available yet.</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/2 backdrop-blur-xl p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-6xl h-[90vh] bg-slate-800/95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-700/60 hover:bg-slate-600/60 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Side - Artwork Image */}
              <div className="flex-1 bg-slate-800/50 flex items-center justify-center p-8 md:p-12">
                <img
                  src={selectedArtwork.image_url}
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Right Side - Details and Comments */}
              <div className="w-full md:w-96 lg:w-[28rem] bg-slate-800/70 flex flex-col border-t md:border-t-0 md:border-l border-slate-700/30">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/30">
                  <div className="flex items-center gap-3 mb-4">
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
                    <div>
                      <h3 className="text-white font-semibold">{displayName}</h3>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {selectedArtwork.title}
                  </h2>
                  {selectedArtwork.description && (
                    <p className="text-sm text-slate-300 mb-3">{selectedArtwork.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-cyan-300">
                    <span>{selectedArtwork.medium || 'Artwork'}</span>
                    {selectedArtwork.created_at && (
                      <>
                        <span className="text-cyan-500">•</span>
                        <span>{format(new Date(selectedArtwork.created_at), 'MMM yyyy')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Comments Section - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <ArtworkComments artworkId={selectedArtwork.id} />
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
