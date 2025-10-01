import React, { useState, useEffect } from 'react';
import SmokeyCursor from './ui/SmokeyCursor';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Headphones, 
  Users,
  Zap,
  Shield,
  CheckCircle
} from 'lucide-react';
import { ModernHeader } from './ui/modern-header';
import { Footer } from './ui/Footer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const ContactUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email with detailed responses",
      contact: "support@brushly.ai",
      responseTime: "Within 24 hours",
      gradient: "from-blue-500 to-cyan-400",
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 6 PM EST",
      responseTime: "Immediate response",
      gradient: "from-green-500 to-emerald-400",
      color: "green"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      responseTime: "Business hours only",
      gradient: "from-purple-500 to-pink-400",
      color: "purple"
    }
  ];

  const faqItems = [
    {
      question: "How quickly can I get started with Brushly?",
      answer: "You can start using Brushly immediately after signing up. Our onboarding process takes less than 5 minutes, and you'll have access to all AI-powered features right away."
    },
    {
      question: "Can Brushly help me generate content for admissions and applications?",
      answer: "Yes! Brushly can help you create compelling content for art school admissions, portfolio descriptions, artist statements, and application essays. Our AI understands the art world and can help you articulate your creative vision professionally."
    },
    {
      question: "How can I get started with the beta program?",
      answer: "We're currently in beta and accepting new users every day! Simply register for our beta program on our homepage, and we'll update you as soon as your account is ready. Beta users get early access to all features and help shape the platform."
    },
    {
      question: "What social media platforms do you support?",
      answer: "We currently support Instagram, Twitter/X, Facebook, and Pinterest with direct posting capabilities. We're constantly adding new platforms based on user feedback."
    },
    {
      question: "Is my artwork secure on your platform?",
      answer: "Absolutely. We use enterprise-grade encryption and security measures to protect your artwork. Your content is never shared without your explicit permission."
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
        <ModernHeader />
        
        <div className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                <MessageSquare className="w-6 h-6 text-teal-400" />
                <span className="text-teal-300 font-bold text-lg">Contact Us</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Get in </span>
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Have questions about Brushly? Need help getting started? Want to discuss a custom solution? 
                We're here to help you succeed with AI-powered creative tools.
              </p>
                </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:bg-slate-800/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${method.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-200 mb-2">{method.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{method.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-slate-300 font-medium">{method.contact}</p>
                      <p className="text-slate-400 text-sm">{method.responseTime}</p>
                    </div>
                  </div>
                );
              })}
                </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-200">Send us a Message</h2>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-200 mb-4">Message Sent!</h3>
                    <p className="text-slate-300">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                          required
                        />
                      </div>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-200">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                        className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-teal-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-200">Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-600 hover:to-cyan-500 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 text-lg font-bold py-4 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Office Information */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-200">Our Office</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-300 font-medium">Brushly Headquarters</p>
                      <p className="text-slate-400">123 Creative District</p>
                      <p className="text-slate-400">San Francisco, CA 94102</p>
                      <p className="text-slate-400">United States</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-200">Business Hours</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Monday - Friday</span>
                      <span className="text-slate-400">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Saturday</span>
                      <span className="text-slate-400">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Sunday</span>
                      <span className="text-slate-400">Closed</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-slate-200 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-300">Quick answers to common questions</p>
                </div>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-lg font-semibold text-slate-200 mb-3">{item.question}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Footer currentPage="contact" />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
