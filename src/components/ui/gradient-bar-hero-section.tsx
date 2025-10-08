import React, { useState, useEffect } from 'react';
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

const SlotCounter: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState(45);

  useEffect(() => {
    // Start with 45 slots and reduce by 1 every 60 minutes from this moment
    setAvailableSlots(45);

    // Update every 60 minutes (3600000 milliseconds)
    const interval = setInterval(() => {
      setAvailableSlots(prev => Math.max(0, prev - 1));
    }, 60 * 60 * 1000); // 60 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

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
        <span className="text-red-400 font-bold text-lg">{availableSlots}</span> slots remaining
      </p>
    </div>
  );
};

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set a universal fixed target date (5 days from now)
    // This date is the same for all users across all devices
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    targetDate.setHours(23, 59, 59, 999); // Set to end of day

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 w-full mb-4">
      <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-cyan-400/20 p-3 sm:p-4">
        <div className="text-center mb-3">
          <h3 className="text-sm sm:text-base text-white font-semibold mb-1">
            Limited Time Offer
          </h3>
          <p className="text-xs text-gray-300">
            Early access expires in:
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className="text-center">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-400 rounded-md p-2 sm:p-3">
              <div className="text-lg sm:text-xl font-bold text-white">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 font-medium">
                Days
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-400 rounded-md p-2 sm:p-3">
              <div className="text-lg sm:text-xl font-bold text-white">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 font-medium">
                Hours
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-400 rounded-md p-2 sm:p-3">
              <div className="text-lg sm:text-xl font-bold text-white">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 font-medium">
                Minutes
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-400 rounded-md p-2 sm:p-3">
              <div className="text-lg sm:text-xl font-bold text-white">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 font-medium">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
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
        className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white text-base sm:text-lg font-space transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-sm"
      >
        Join Waitlist
      </button>
    </div>
  );
};



export const GradientBarHeroSection: React.FC = () => {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen pt-40 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 xl:pt-56 2xl:pt-64 px-6 sm:px-8 md:px-12">
        <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-8 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          <SlotCounter />
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
            Be the first to know when we launch.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-300 font-space">
            Join the waitlist and get exclusive early access.
          </p>
        </div>
        
        <div className="w-full max-w-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-6 px-4">
          <CountdownTimer />
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
