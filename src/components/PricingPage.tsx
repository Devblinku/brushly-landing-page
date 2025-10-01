import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Clock,
  Shield,
  Users,
  ArrowLeft,
  MessageCircle,
  Star,
  Zap,
  TrendingUp,
  Award,
  Mail
} from 'lucide-react';
import SmokeyCursor from './ui/SmokeyCursor';
import { ModernHeader } from './ui/modern-header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Footer } from './ui/Footer';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      {/* Smokey Cursor Effect */}
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

        {/* Back Button */}
        <div className="pt-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-teal-400 transition-colors duration-300 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </div>
        </div>

        {/* Pricing Section */}
        <section className="py-16 px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl animate-float-delayed"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 rounded-full blur-2xl animate-float"></div>
            </div>

            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                <Sparkles className="w-6 h-6 text-teal-400" />
                <span className="text-teal-300 font-bold text-lg">Flexible Plans</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Simple, transparent pricing—</span>
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-serif italic text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                  tailored to your needs
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                We're finalizing our plans to give you the best value. In the meantime, reach out and we'll create a custom solution for you.
              </p>
            </motion.div>

            {/* Universal Benefits Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-200 mb-4">Why Choose Brushly?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Every plan includes these core benefits designed to help you succeed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <motion.div
                  className="text-center p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">No Hidden Fees</h3>
                  <p className="text-slate-400 text-sm">Transparent pricing with no surprises</p>
                </motion.div>

                <motion.div
                  className="text-center p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Cancel Anytime</h3>
                  <p className="text-slate-400 text-sm">No long-term commitments required</p>
                </motion.div>

                <motion.div
                  className="text-center p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Dedicated Support</h3>
                  <p className="text-slate-400 text-sm">Get help when you need it most</p>
                </motion.div>

                <motion.div
                  className="text-center p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Scales With You</h3>
                  <p className="text-slate-400 text-sm">Grows as your business expands</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Placeholder Tiers */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-200 mb-4">Choose Your Plan</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  We're crafting the perfect plans for every type of artist and creative professional
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Starter Tier */}
                <motion.div
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-200 mb-4">Starter</h3>
                      <p className="text-slate-400 mb-6 leading-relaxed">
                        Perfect for individuals and small teams getting started with AI-powered content creation.
                      </p>
                      
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-4 py-2">
                          <Clock className="w-4 h-4 text-teal-400 mr-2" />
                          <span className="text-teal-300 text-sm font-medium">Pricing Coming Soon</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-600 hover:to-cyan-500 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 font-bold py-4 transform hover:scale-105 transition-all duration-300">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Talk to Us
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Growth Tier */}
                <motion.div
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Popular Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-200 mb-4">Growth</h3>
                      <p className="text-slate-400 mb-6 leading-relaxed">
                        Ideal for scaling businesses that need advanced features and higher limits.
                      </p>
                      
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full px-4 py-2">
                          <Clock className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-amber-300 text-sm font-medium">Pricing Coming Soon</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 font-bold py-4 transform hover:scale-105 transition-all duration-300">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Talk to Us
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Pro/Enterprise Tier */}
                <motion.div
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-200 mb-4">Pro/Enterprise</h3>
                      <p className="text-slate-400 mb-6 leading-relaxed">
                        For large teams that need full customization, white-label solutions, and dedicated support.
                      </p>
                      
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-teal-400/20 border border-emerald-500/30 rounded-full px-4 py-2">
                          <Clock className="w-4 h-4 text-emerald-400 mr-2" />
                          <span className="text-emerald-300 text-sm font-medium">Custom Pricing</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:from-emerald-600 hover:to-teal-500 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 font-bold py-4 transform hover:scale-105 transition-all duration-300">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Talk to Us
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Lead Capture Form */}
            <motion.div
              className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 shadow-2xl overflow-hidden mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-400/5 rounded-3xl"></div>
              
              <div className="relative z-10 text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-200 mb-4">
                  Be the First to Know When Pricing Goes Live
                </h3>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Join our waitlist and get early access to special launch pricing, plus exclusive beta features.
                </p>
              </div>

              <form className="max-w-2xl mx-auto space-y-6">
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

                <div className="pt-4">
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-600 hover:to-cyan-500 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 text-xl font-bold py-6 transform hover:scale-105 transition-all duration-300"
                  >
                    <Mail className="w-6 h-6 mr-3" />
                    Get Early Access
                  </Button>
                </div>

                <p className="text-sm text-slate-400 text-center">
                  ✨ No spam, ever • Exclusive launch pricing • First access to new features
                </p>
              </form>
            </motion.div>

            {/* Social Proof / Trust Markers */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="mb-12">
                <p className="text-slate-400 text-lg mb-8">Trusted by creative professionals worldwide</p>
                
                <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="font-semibold">500+</span>
                    <span className="text-slate-400">Beta Artists</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                    <span className="font-semibold">10K+</span>
                    <span className="text-slate-400">AI Posts Generated</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">50+</span>
                    <span className="text-slate-400">Countries</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm italic mb-3">
                      "Game-changer for my art business. The AI content is spot-on!"
                    </p>
                    <p className="text-slate-400 text-xs">- Digital Artist, NYC</p>
                  </div>

                  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm italic mb-3">
                      "Saves me hours every week. My engagement has tripled!"
                    </p>
                    <p className="text-slate-400 text-xs">- Gallery Owner, London</p>
                  </div>

                  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm italic mb-3">
                      "The future of art marketing is here. Absolutely brilliant!"
                    </p>
                    <p className="text-slate-400 text-xs">- Fine Art Photographer, LA</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer currentPage="pricing" />
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

export default PricingPage;
