import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { validateImageFile, getExistingImages } from '../../services/imageService';
import { Input } from '../ui/input';

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  postSlug?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadTab, setUploadTab] = useState<'upload' | 'gallery'>('upload');

  useEffect(() => {
    if (isOpen) {
      loadExistingImages();
    }
  }, [isOpen]);

  const loadExistingImages = async () => {
    setLoading(true);
    try {
      const existingImages = await getExistingImages();
      const imageUrls = existingImages.map(img => img.url);
      setImages(imageUrls);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);
    try {
      // Convert to data URL (won't upload until post is saved)
      const { fileToDataURL } = await import('../../utils/imageUtils');
      const dataUrl = await fileToDataURL(file);
      
      // Select the image (it's stored as data URL in editor)
      onSelectImage(dataUrl);
      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getThumbnailUrl = (url: string) => {
    // For Supabase Storage, we can use transform parameters
    // If the URL contains storage URL, we can add resize parameters
    // For now, return the URL as-is (thumbnails would require Supabase Image Transform)
    return url;
  };

  const filteredImages = images.filter((url) => {
    if (!searchQuery) return true;
    return url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h2 className="text-2xl font-bold text-white">Image Gallery</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => setUploadTab('upload')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                uploadTab === 'upload'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload New Image
            </button>
            <button
              onClick={() => setUploadTab('gallery')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                uploadTab === 'gallery'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Select Existing ({images.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {uploadTab === 'upload' ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">
                    Upload a new image (JPG, PNG, WebP, GIF)
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {uploading && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-cyan-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 text-center">
                  Note: Images will be optimized to WebP format (70% quality) and uploaded when you save the post.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images..."
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>

                {/* Images Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading images...</p>
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      {searchQuery ? 'No images found' : 'No images uploaded yet'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((url, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          onSelectImage(url);
                          onClose();
                        }}
                        className="group relative aspect-square overflow-hidden rounded-lg border-2 border-slate-700 hover:border-cyan-500 transition-all duration-200"
                      >
                        <img
                          src={getThumbnailUrl(url)}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageGallery;

