import React from 'react';
import { Instagram } from 'lucide-react';
import { AuroraBackground } from './aurora-background';

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

const TrustElements: React.FC = () => {
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
        <span className="text-white font-semibold">2.4K</span> currently on the waitlist
      </p>
    </div>
  );
};

const JoinWaitlistButton: React.FC = () => {
  const scrollToForm = () => {
    // First try to find a form element
    const formElement = document.querySelector('form');
    
    if (formElement) {
      // If we found a form, scroll to it
      formElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      // Fallback: scroll to bottom of page
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative z-10 w-full">
      <button
        onClick={scrollToForm}
        className="px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white text-lg sm:text-xl font-space transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-sm"
      >
        Join The Waitlist
      </button>
    </div>
  );
};



export const GradientBarHeroSection: React.FC = () => {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen pt-8 sm:pt-16 pb-4 sm:pb-6 px-6 sm:px-8 md:px-12">
        <div className="mb-12 sm:mb-16 mt-16 sm:mt-20">
          <TrustElements />
        </div>
        
        <h1 className="w-full text-white leading-tight tracking-tight mb-6 sm:mb-8 animate-fadeIn px-4">
          <span className="block font-inter font-medium text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap">
            From Studio to <span className="font-serif italic text-[clamp(2.2rem,8.5vw,5.5rem)]" style={{ fontFamily: 'Playfair Display, serif' }}>Spotlight</span>,
          </span>
          <span className="block font-instrument text-[clamp(1.2rem,4.5vw,2.8rem)] whitespace-nowrap">
            Everything You Need to Grow
          </span>
        </h1>
        
        <div className="mb-6 sm:mb-10 px-4">
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-200 font-space">
            Be the first to know when we launch.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-300 font-space">
            Join the waitlist and get exclusive early access.
          </p>
        </div>
        
        <div className="w-full max-w-2xl mb-6 sm:mb-8 px-4">
          <JoinWaitlistButton />
        </div>
        
        <div className="flex justify-center items-center space-x-3">
          <a href="https://www.instagram.com/brushly.art/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
            <Instagram size={24} className="w-6 h-6" />
          </a>
          <span className="text-gray-300 text-sm font-space">Follow for exclusive behind-the-scenes magic ✨</span>
        </div>
      </div>
    </AuroraBackground>
  );
};
