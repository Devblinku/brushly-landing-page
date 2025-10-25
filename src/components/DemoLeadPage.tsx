import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle, X } from 'lucide-react';
import { ModernHeader } from './ui/modern-header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Footer } from './ui/Footer';

interface DemoRegistrationData {
  name: string;
  email: string;
  mobile?: string;
}

const DemoLeadPage: React.FC = () => {
  const [formData, setFormData] = useState<DemoRegistrationData>({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit demo registration
      const response = await fetch('/.netlify/functions/demo-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Success handling
      setIsSubmitted(true);
      setShowSuccessPopup(true);
      setFormData({
        name: '',
        email: '',
        mobile: ''
      });

      // Reset form state after popup closes
      setTimeout(() => {
        setIsSubmitted(false);
      }, 1000);

    } catch (error) {
      console.error('Error submitting demo registration:', error);
      alert('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Live demonstration of Brushly's AI-powered features",
    "See how to create professional content in minutes",
    "Learn pricing strategies that work for artists",
    "Get exclusive early access to new features",
    "Q&A session with our development team"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        <ModernHeader />
        
        <div className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-12 animate-fade-in">
              {/* Event Badge */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                <Calendar className="w-6 h-6 text-teal-400" />
                <span className="text-teal-300 font-bold text-lg">Live Demo Session</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Ready to upgrade your skills and your toolset?</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Join our live, can't-miss demonstration of Brushly, the tool built to make your creative workflow faster, smoother, and more powerful than ever before.
              </p>
            </div>

            {/* Event Details Card */}
            <div className="w-full max-w-2xl mx-auto bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 mb-12 shadow-2xl animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Live Session Details:</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">When: November 30, 2025</p>
                    <p className="text-gray-300">6:30 PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Duration: 60 minutes</p>
                    <p className="text-gray-300">Live Q&A included</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="w-full max-w-2xl mx-auto animate-fade-in">
              {!isSubmitted ? (
                <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Don't wait, register now and prepare to be inspired.
                    </h3>
                    <p className="text-gray-300">
                      Witness the Live Demo. Secure Your Spot Today!
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-200 text-lg">Name *</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400 text-lg py-4"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200 text-lg">Email *</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400 text-lg py-4"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-slate-200 text-lg">Mobile (Optional)</Label>
                      <Input 
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                        className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400 text-lg py-4"
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-600 hover:to-cyan-500 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 text-lg font-bold py-6 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Registering...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-3" />
                          Secure My Spot for the Demo
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Registration Confirmed!</h3>
                  <p className="text-gray-300 mb-6">
                    Thank you for registering! We'll send you the meeting details and reminders as the date approaches.
                  </p>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-sm text-teal-300">
                      📧 Check your email for confirmation and calendar invite
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="w-full max-w-3xl mx-auto animate-fade-in">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">What You'll Learn:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30"
                  >
                    <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 mb-20 text-center animate-fade-in">
              <p className="text-lg text-gray-300 mb-6">
                Limited spots available. Don't miss this exclusive opportunity to see Brushly in action.
              </p>
            </div>
          </div>
        </section>
        
        <Footer currentPage="demo" />
        </div>
      </div>

      {/* Demo Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-slate-600/50 hover:bg-slate-500/50 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-300" />
            </button>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-400/10 to-blue-500/10" />
            
            {/* Content */}
            <div className="relative p-6 sm:p-8">
              {/* Success icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              {/* Success message */}
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
                  Thank you for submitting the form!
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Check your inbox for demo link and session details.
                </p>
              </div>

              {/* Demo details */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-600/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  <h4 className="text-slate-200 font-semibold text-sm">Demo Session Details</h4>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                    <span>Date: November 30, 2025</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                    <span>Time: 6:30 PM EST</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                    <span>Duration: 60 minutes</span>
                  </div>
                </div>
              </div>


              {/* Instagram Follow Button */}
              <div className="mt-6">
                <button
                  onClick={() => window.open('https://www.instagram.com/brushly.art/', '_blank')}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Follow us on Instagram</span>
                </button>
              </div>

              {/* Close button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="text-slate-400 hover:text-slate-300 text-sm underline transition-colors"
                >
                  Close this popup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoLeadPage;
