import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Instagram, 
  ArrowRight,
  ArrowLeft,
  Heart
} from 'lucide-react';

interface FooterProps {
  currentPage?: 'home' | 'pricing' | 'privacy' | 'terms' | 'contact' | 'data-deletion';
}

export const Footer: React.FC<FooterProps> = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();

  return (
    <footer className="relative py-20 px-6 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-teal-500/10 to-cyan-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/brushly_logo-removebg-preview.png" 
                alt="Brushly Logo" 
                className="h-12 object-contain"
              />
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
              Empowering artists worldwide with AI-driven tools for creative success. 
              Transform your artistic vision into powerful marketing content.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/brushly.art/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm rounded-full flex items-center justify-center text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 transition-all duration-300 group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-slate-200 font-semibold text-lg mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                {currentPage !== 'home' ? (
                  <button 
                    onClick={() => navigate('/#features')}
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group"
                  >
                    <span>Canvas Features</span>
                    <ArrowLeft className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                  </button>
                ) : (
                  <a href="#features" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group">
                    <span>Canvas Features</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </a>
                )}
              </li>
              <li>
                {currentPage !== 'home' ? (
                  <button 
                    onClick={() => navigate('/#platforms')}
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group"
                  >
                    <span>Platforms</span>
                    <ArrowLeft className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                  </button>
                ) : (
                  <a href="#platforms" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group">
                    <span>Platforms</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </a>
                )}
              </li>
              <li>
                {currentPage !== 'home' ? (
                  <button 
                    onClick={() => navigate('/#testimonials')}
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group"
                  >
                    <span>Testimonials</span>
                    <ArrowLeft className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                  </button>
                ) : (
                  <a href="#testimonials" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group">
                    <span>Testimonials</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </a>
                )}
              </li>
              <li>
                {currentPage === 'pricing' ? (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="text-teal-400 font-medium flex items-center group"
                  >
                    <span>Pricing</span>
                    <div className="w-2 h-2 bg-teal-400 rounded-full ml-2"></div>
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group"
                  >
                    <span>Pricing</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-slate-200 font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => navigate('/contact')}
                  className={`transition-colors duration-300 flex items-center group ${
                    currentPage === 'contact' 
                      ? 'text-teal-400 font-medium' 
                      : 'text-slate-400 hover:text-teal-400'
                  }`}
                >
                  <span>Contact Us</span>
                  {currentPage === 'contact' ? (
                    <div className="w-2 h-2 bg-teal-400 rounded-full ml-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy')}
                  className={`transition-colors duration-300 flex items-center group ${
                    currentPage === 'privacy' 
                      ? 'text-teal-400 font-medium' 
                      : 'text-slate-400 hover:text-teal-400'
                  }`}
                >
                  <span>Privacy Policy</span>
                  {currentPage === 'privacy' ? (
                    <div className="w-2 h-2 bg-teal-400 rounded-full ml-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms')}
                  className={`transition-colors duration-300 flex items-center group ${
                    currentPage === 'terms' 
                      ? 'text-teal-400 font-medium' 
                      : 'text-slate-400 hover:text-teal-400'
                  }`}
                >
                  <span>Terms of Service</span>
                  {currentPage === 'terms' ? (
                    <div className="w-2 h-2 bg-teal-400 rounded-full ml-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/data-deletion')}
                  className={`transition-colors duration-300 flex items-center group ${
                    currentPage === 'data-deletion' 
                      ? 'text-teal-400 font-medium' 
                      : 'text-slate-400 hover:text-teal-400'
                  }`}
                >
                  <span>Data Deletion</span>
                  {currentPage === 'data-deletion' ? (
                    <div className="w-2 h-2 bg-teal-400 rounded-full ml-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-4 md:mb-0 items-center">
            <p className="text-slate-500 text-sm mb-2 md:mb-0 text-center md:text-left">
              © 2025 Brushly. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for artists</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
