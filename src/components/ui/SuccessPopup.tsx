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
  // Auto-close after 8 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

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

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 mt-6"
                >
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Awesome! Let's Go
                  </button>
                  <button
                    onClick={() => window.open('https://brushly.com', '_blank')}
                    className="flex-1 bg-slate-600/50 hover:bg-slate-500/50 text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-slate-500/50"
                  >
                    Visit Website
                  </button>
                </motion.div>

                {/* Auto-close indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 text-center"
                >
                  <div className="text-xs text-slate-400">
                    This popup will auto-close in 8 seconds
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
