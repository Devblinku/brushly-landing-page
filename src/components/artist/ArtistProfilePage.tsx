import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Image as ImageIcon, Tag, User } from 'lucide-react';
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

const ArtistProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <ModernHeader />
        
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {profile.public_profile_image_url ? (
                    <img
                      src={profile.public_profile_image_url}
                      alt={displayName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500/50"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-cyan-500/50">
                      <User className="w-16 h-16 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">{displayName}</h1>
                  {profile.about && (
                    <p className="text-slate-300 text-lg mb-4 leading-relaxed">{profile.about}</p>
                  )}

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {getCategoryDisplayName(category)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Artworks Section */}
            {artworks.length > 0 ? (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-8 h-8" />
                  Artworks
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {artworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-colors"
                    >
                      {/* Artwork Image */}
                      <div className="aspect-square bg-slate-900 overflow-hidden">
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Artwork Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{artwork.title}</h3>
                        {artwork.description && (
                          <p className="text-slate-400 mb-4 line-clamp-3">{artwork.description}</p>
                        )}
                        {artwork.medium && (
                          <p className="text-sm text-cyan-400 mb-4">Medium: {artwork.medium}</p>
                        )}

                        {/* Comments Section */}
                        <ArtworkComments artworkId={artwork.id} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No artworks available yet.</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ArtistProfilePage;
