import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { ModernHeader } from './ui/modern-header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Footer } from './ui/Footer';
import { SuccessPopup } from './ui/SuccessPopup';

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
              <div className="flex items-center justify-center space-x-2 text-teal-400">
                <ArrowRight className="w-5 h-5" />
                <span className="font-semibold">Join 150+ artists already on Brushly</span>
              </div>
            </div>
          </div>
        </section>
        
        <Footer currentPage="demo" />
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        userName={formData.name}
        userEmail={formData.email}
      />
    </div>
  );
};

export default DemoLeadPage;
