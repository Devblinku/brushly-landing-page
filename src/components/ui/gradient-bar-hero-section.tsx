import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import { AuroraBackground } from './aurora-background';
import { submitNewsletterSignup } from '../../services/airtableService';
import posthog from '../../lib/posthog';

type AvatarProps = {
  imageSrc: string;
  delay: number;
};

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => {
  return (
    <div 
      className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img 
        src={imageSrc} 
        alt="User avatar" 
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};

const ArtistCounter: React.FC = () => {
  const avatars = [
    "https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
  ];

  return (
    <div className="inline-flex items-center space-x-3 bg-slate-900/40 backdrop-blur-sm rounded-full py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm border border-cyan-400/20">
      <div className="flex -space-x-2 sm:-space-x-3">
        {avatars.map((avatar, index) => (
          <Avatar key={index} imageSrc={avatar} delay={index * 200} />
        ))}
      </div>
      <p className="text-white animate-fadeIn whitespace-nowrap font-space" style={{ animationDelay: '800ms' }}>
        <span className="text-cyan-400 font-bold text-lg">150+</span> Artists On Board
      </p>
    </div>
  );
};

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const hasTrackedStartRef = useRef(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Track when user starts typing (only once)
    if (newEmail.length > 0 && !hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      posthog.capture('newsletter_signup_started', {
        source: 'hero_section',
        page: window.location.pathname,
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const emailValue = email.trim();
      await submitNewsletterSignup(emailValue);
      
      // Track successful signup
      posthog.capture('newsletter_signup_completed', {
        email: emailValue,
        source: 'hero_section',
        page: window.location.pathname,
      });
      
      // Identify user with PostHog
      posthog.identify(emailValue, {
        email: emailValue,
        isNewsletterSubscriber: true,
        signupSource: 'hero_section',
        signupDate: new Date().toISOString(),
      });
      
      setSubmitStatus('success');
      setEmail(''); // Clear the form on success
      hasTrackedStartRef.current = false; // Reset for next signup
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.2)] focus:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />
        {submitStatus === 'success' && (
          <p className="text-green-400 text-sm text-center animate-fadeIn">
            ✓ Successfully subscribed to newsletter!
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-400 text-sm text-center animate-fadeIn">
            ✗ Failed to subscribe. Please try again.
          </p>
        )}
        {/* Expose the submit function to parent component */}
        <div style={{ display: 'none' }} data-submit-handler={handleSubmit} />
      </form>
    </div>
  );
};

const SubscribeNewsletterButton: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = () => {
    // Find the form and trigger submission
    const formElement = document.querySelector('form');
    if (formElement) {
      // Trigger form submission
      formElement.requestSubmit();
    }
  };

  // Listen for form submission state changes
  useEffect(() => {
    const handleFormStateChange = () => {
      const form = document.querySelector('form');
      if (form) {
        const input = form.querySelector('input[type="email"]') as HTMLInputElement;
        if (input) {
          setIsSubmitting(input.disabled);
        }
      }
    };

    // Check form state periodically
    const interval = setInterval(handleFormStateChange, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      <button
        onClick={handleSubscribe}
        disabled={isSubmitting}
        className="w-full px-2 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white text-base font-space transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-h-[48px]"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Subscribing...</span>
          </>
        ) : (
          <span>Subscribe to Newsletter</span>
        )}
      </button>
    </div>
  );
};



export const GradientBarHeroSection: React.FC = () => {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen pt-40 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 xl:pt-56 2xl:pt-64 px-6 sm:px-8 md:px-12">
        <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-8 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          <ArtistCounter />
        </div>
        
        <h1 className="w-full text-white leading-tight tracking-tight mb-6 sm:mb-8 md:mb-10 lg:mb-4 animate-fadeIn px-4">
          <span className="block font-inter font-medium text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap">
            From Studio to <span className="font-serif italic text-[clamp(2.2rem,8.5vw,5.5rem)]" style={{ fontFamily: 'Playfair Display, serif' }}>Spotlight</span>,
          </span>
          <span className="block font-instrument text-[clamp(1.2rem,4.5vw,2.8rem)] whitespace-nowrap">
            Everything You Need to Grow
          </span>
        </h1>
        
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-4 px-4">
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-200 font-space">
            Be among the first to become part of this creative revolution.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-300 font-space">
            Join thousands of artists already transforming their craft.
          </p>
        </div>
        
        <div className="w-full max-w-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-6 px-4">
          <EmailInput />
          <SubscribeNewsletterButton />
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="flex justify-center items-center space-x-4">
            <a href="https://www.instagram.com/brushly.art/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
              <Instagram size={24} className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/company/brushly-art/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
              <Linkedin size={24} className="w-6 h-6" />
            </a>
            <a href="https://www.facebook.com/people/Brushlyart/61580406683452/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
              <Facebook size={24} className="w-6 h-6" />
            </a>
          </div>
          <span className="text-gray-300 text-sm font-space">Follow for exclusive behind-the-scenes magic ✨</span>
        </div>
      </div>
    </AuroraBackground>
  );
};
