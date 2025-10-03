import React, { useEffect } from 'react';
import { CheckCircle, X, Sparkles, Mail, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ 
  isOpen, 
  onClose, 
  userName = 'Artist',
  userEmail 
}) => {
  // No auto-close - user must manually close

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-slate-600/50 hover:bg-slate-500/50 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>

              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-400/10 to-blue-500/10" />
              
              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>

                {/* Success message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
                    Welcome to Brushly, {userName}! 🎨
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    You're now part of our exclusive beta program. We'll be in touch soon with your early access details!
                  </p>
                </motion.div>

                {/* Features preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-600/30"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                    <h4 className="text-slate-200 font-semibold text-sm">What's Coming Your Way</h4>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      <span>AI-generated social media captions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      <span>Instagram Reels content creation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      <span>Product mockups and marketing tools</span>
                    </div>
                  </div>
                </motion.div>

                {/* Next steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-teal-500/10 to-cyan-400/10 rounded-xl p-4 border border-teal-400/20"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <h4 className="text-slate-200 font-semibold text-sm">What Happens Next?</h4>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    Keep an eye on your inbox for updates, sneak peeks, and your exclusive beta invitation within the next few weeks!
                  </p>
                </motion.div>

                {/* Email confirmation */}
                {userEmail && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/30"
                  >
                    <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm">
                      <Mail className="w-4 h-4 text-teal-400" />
                      <span>Confirmation sent to <span className="text-teal-400 font-medium">{userEmail}</span></span>
                    </div>
                  </motion.div>
                )}

                {/* Instagram Follow Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6"
                >
                  <button
                    onClick={() => window.open('https://www.instagram.com/brushly.art/', '_blank')}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Follow us on Instagram</span>
                  </button>
                </motion.div>

                {/* Close button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-center"
                >
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-300 text-sm underline transition-colors"
                  >
                    Close this popup
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
