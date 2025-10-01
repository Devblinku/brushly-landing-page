import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Instagram, 
  Twitter, 
  Facebook,
  ArrowRight,
  Star,
  Users,
  Globe,
  Sparkle,
  Image,
  Layers,
  Calculator,
  Award
} from 'lucide-react';
import SmokeyCursor from './ui/SmokeyCursor';
import { ModernHeader } from './ui/modern-header';
import { GradientBarHeroSection } from './ui/gradient-bar-hero-section';
import { ContainerScroll } from './ui/container-scroll-animation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Footer } from './ui/Footer';

const LandingPage: React.FC = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canvasFeatures = [
    {
      icon: FileText,
      title: "SEO Keywords",
      description: "Generate targeted keywords to boost your art's online visibility",
      gradient: "from-emerald-500 to-teal-400",
      color: "emerald"
    },
    {
      icon: Instagram,
      title: "Instagram Bio",
      description: "Craft compelling bios that convert visitors to followers",
      gradient: "from-pink-500 to-purple-500",
      color: "pink"
    },
    {
      icon: Award,
      title: "Gallery/Art Fair Submissions",
      description: "Generate professional submission packages for galleries and art fairs",
      gradient: "from-orange-500 to-red-500",
      color: "orange"
    },
    {
      icon: Calculator,
      title: "Smart Pricing Calculator",
      description: "AI-powered pricing recommendations based on market trends and your portfolio",
      gradient: "from-indigo-500 to-purple-500",
      color: "indigo",
      image: "/Pricing calculator.jpg"
    },
    {
      icon: Users,
      title: "Collector Follow-up",
      description: "Build lasting relationships with personalized email templates",
      gradient: "from-cyan-500 to-blue-500",
      color: "cyan"
    }
  ];

  const platformFeatures = [
    {
      icon: Instagram,
      name: "Instagram",
      description: "Post directly to your Instagram Business account",
      gradient: "from-pink-500 to-purple-500",
      aiPreview: "🎨 Just finished this piece! The way light dances through the colors reminds me of morning mist. What emotions does it evoke in you? #ContemporaryArt #LightAndShadow",
      aiLabel: "Generated Caption"
    },
    {
      icon: Twitter,
      name: "Twitter/X",
      description: "Share your artwork with the Twitter community",
      gradient: "from-blue-500 to-cyan-400",
      aiPreview: "✨ New artwork alert! Exploring the intersection of chaos and order. Sometimes the most beautiful things emerge from controlled chaos. #ArtProcess #CreativeJourney",
      aiLabel: "Generated Tweet"
    },
    {
      icon: Facebook,
      name: "Facebook",
      description: "Reach collectors through Facebook pages",
      gradient: "from-blue-600 to-indigo-600",
      aiPreview: "🌟 Excited to share my latest creation! This piece represents the journey of transformation - from raw emotion to refined expression. #ArtisticJourney #Transformation",
      aiLabel: "Generated Post"
    },
    {
      icon: Globe,
      name: "Pinterest",
      description: "Create pins that drive traffic to your portfolio",
      gradient: "from-red-500 to-pink-500",
      aiPreview: "🎭 Art has the power to tell stories without words. This piece explores the narrative of human connection through abstract forms. #VisualStorytelling #AbstractArt",
      aiLabel: "Generated Pin"
    }
  ];

  const mockupTypes = [
    {
      icon: Layers,
      title: "Print Products",
      description: "Visualize your art on canvas prints, posters, and gallery walls",
      gradient: "from-emerald-500 to-teal-400",
      color: "emerald"
    },
    {
      icon: Image,
      title: "Lifestyle Mockups",
      description: "Place your artwork in real-world settings like homes, offices, and galleries",
      gradient: "from-orange-500 to-red-500",
      color: "orange"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Artist",
      content: "Brushly transformed my art business. The AI-generated content saves me hours every week, and the social media integration is seamless.",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face",
      metrics: "Content creation time reduced by 70%"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Fine Art Photographer",
      content: "The canvas features are incredible. I've never had such professional press releases and SEO content for my exhibitions.",
      rating: 5,
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face",
      metrics: "Exhibition engagement increased by 3x"
    },
    {
      name: "Elena Vasquez",
      role: "Contemporary Painter",
      content: "The collector follow-up templates helped me build lasting relationships. My repeat sales have increased by 40%.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face",
      metrics: "Repeat sales increased by 40%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      {/* Smokey Cursor Effect - KEEPING UNTOUCHED */}
      <SmokeyCursor 
        simulationResolution={256}
        dyeResolution={1024}
        densityDissipation={0.98}
        velocityDissipation={0.99}
        pressure={0.8}
        curl={30}
        splatRadius={0.25}
        splatForce={6000}
        backgroundColor={{ r: 0.1, g: 0.1, b: 0.15 }}
        transparent={true}
        intensity={0.8}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Modern Header */}
        <ModernHeader />

        {/* Gradient Bar Hero Section */}
        <GradientBarHeroSection />

        {/* Container Scroll Animation Section */}
        <section className="py-4">
          <ContainerScroll
            titleComponent={
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                  <Sparkles className="w-6 h-6 text-teal-400" />
                  <span className="text-teal-300 font-bold text-lg">AI-Powered Creative Dashboard</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                  <span className="text-slate-200">Experience the Future of</span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    Art Management
                  </span>
                </h2>
                
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  See how our AI-powered dashboard transforms your creative workflow. 
                  Manage artwork, generate content, and publish across platforms seamlessly.
                </p>
              </motion.div>
            }
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img
                src="/Home.jpg"
                alt="Brushly Creative Dashboard"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            </div>
          </ContainerScroll>
        </section>

        {/* Canvas Features Section */}
        <section id="features" className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                <Sparkles className="w-6 h-6 text-teal-400" />
                <span className="text-teal-300 font-bold text-lg">AI-Powered Canvas Features</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Ignite Your</span>
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-serif italic text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Creative Potential
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transform your artistic vision into powerful marketing content with our AI-driven canvas features. 
                Each tool is designed to amplify your reach and build meaningful connections with collectors.
              </p>
            </motion.div>

            {/* Horizontal Carousel with Portrait Cards */}
            <div className="relative overflow-y-hidden h-[42rem]">
              <div className="flex overflow-x-auto scrollbar-hide gap-9 py-9 px-3 h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'hidden' }}>
                {canvasFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="group relative flex-shrink-0"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {/* Portrait Glass Card */}
                      <div className="relative w-[30rem] h-[36rem] bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 overflow-hidden hover:z-10">
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                        
                        {/* Card Image */}
                        <div className="relative h-72 w-full overflow-hidden rounded-t-3xl">
                          {feature.image ? (
                            <img 
                              src={feature.image} 
                              alt={feature.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                              <Icon className="w-16 h-16 text-white/80" />
                            </div>
                          )}
                          {/* Image Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                        </div>

                        {/* Card Content */}
                        <div className="p-9 flex flex-col h-72">
                          {/* 3D Icon */}
                          <div className="relative mb-6">
                            <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            {/* Icon Glow */}
                            <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500`}></div>
                          </div>

                          {/* Content */}
                          <h3 className="text-2xl font-bold text-slate-200 mb-4 group-hover:text-white transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors duration-300 flex-grow">
                            {feature.description}
                          </p>

                          {/* Hover Arrow */}
                          <div className="absolute bottom-9 right-9 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRight className={`w-7 h-7 text-${feature.color}-400`} />
                          </div>
                        </div>
                      </div>

                      {/* 3D Shadow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-3xl transform translate-y-6 translate-x-6 -z-10 group-hover:translate-y-9 group-hover:translate-x-9 transition-transform duration-500"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Scroll Indicators - Outside the carousel */}
            <div className="flex justify-center mt-6 space-x-2">
              {canvasFeatures.map((_, index) => (
                <div key={index} className="w-2 h-2 bg-slate-600 rounded-full hover:bg-slate-400 transition-colors duration-300 cursor-pointer"></div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Integration Section with AI Content Preview */}
        <section id="platforms" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-2xl animate-float-delayed"></div>
            </div>

            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Connect</span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-serif italic text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif' }}> Everywhere</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Seamlessly publish and schedule your artwork across all major social platforms with content that resonates with your audience.
              </p>
            </motion.div>

            {/* Platform Cards with AI Content Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platformFeatures.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:bg-slate-800/60 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-105">
                      {/* Platform Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${platform.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-200 mb-2">{platform.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{platform.description}</p>

                      {/* AI Content Preview */}
                      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkle className="w-4 h-4 text-teal-400" />
                          <span className="text-xs text-teal-300 font-medium">{platform.aiLabel}</span>
                        </div>
                        <p className="text-sm text-slate-300 italic">"{platform.aiPreview}"</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mockup Creation Section */}
        <section id="mockups" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-float-delayed"></div>
            </div>

            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                <Image className="w-6 h-6 text-teal-400" />
                <span className="text-teal-300 font-bold text-lg">AI-Powered Mockup Generator</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Create Amazing</span>
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-serif italic text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Mockups
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transform your artwork into stunning product mockups and lifestyle scenes. 
                See how your art looks in real-world applications with our AI-powered mockup generator.
              </p>
            </motion.div>

            {/* Mockup Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Image Placeholder */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-400/10 rounded-3xl"></div>
                  
                  {/* Placeholder Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg font-medium">Your Artwork Mockup</p>
                      <p className="text-slate-500 text-sm">Preview how your art looks in real environments</p>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-700"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
                  </div>
                  
                  {/* Mockup Type Indicator */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-teal-400" />
                      <span className="text-sm text-slate-300 font-medium">Gallery Wall Mockup</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mockup Types */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {mockupTypes.map((mockup, index) => {
                  const Icon = mockup.icon;
                  return (
                    <div
                      key={index}
                      className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:bg-slate-800/60 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${mockup.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                      
                      <div className="relative flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 bg-gradient-to-r ${mockup.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-white transition-colors duration-300">
                            {mockup.title}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                            {mockup.description}
                          </p>
                        </div>

                        {/* Hover Arrow */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ArrowRight className={`w-5 h-5 text-${mockup.color}-400`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </section>

        {/* Beta User Registration Form */}
        <section className="py-32 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-400/5 rounded-3xl"></div>
              
              <div className="relative z-10 text-center mb-12">
                <h2 className="text-5xl font-bold mb-8 leading-tight">
                  <span className="text-slate-200">Join the</span>
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"> Beta Revolution</span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Be among the first artists to experience the future of AI-powered content creation. 
                  Get early access to all features and help shape the platform.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Enter your first name"
                      className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Enter your last name"
                      className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address"
                    className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="artType" className="text-slate-200">Primary Art Type</Label>
                  <Input 
                    id="artType" 
                    placeholder="Enter your primary art type"
                    className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                  />
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-600 hover:to-cyan-500 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 text-xl font-bold py-6 transform hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Join Beta Program
                  </Button>
                </div>

                <p className="text-sm text-slate-400 text-center">
                  ✨ No credit card required • Early access to all features • Priority support
                </p>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold mb-8">
                <span className="text-slate-200">Loved by</span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-serif italic text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif' }}> Artists Worldwide</span>
              </h2>
              <p className="text-xl text-slate-400">See what creators are saying about Brushly</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-300 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Metrics */}
                  <div className="bg-slate-700/30 rounded-lg p-3 mb-6">
                    <p className="text-sm text-teal-300 font-medium">{testimonial.metrics}</p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-600/50"
                    />
                    <div>
                      <p className="font-semibold text-slate-200">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer currentPage="home" />
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;