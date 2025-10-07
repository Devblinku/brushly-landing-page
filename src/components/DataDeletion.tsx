import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Shield, 
  Trash2, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ModernHeader } from './ui/modern-header';
import { Footer } from './ui/Footer';

const DataDeletion: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      icon: Mail,
      title: "Send Email Request",
      description: "Email us at info@brushly.art with your registered email address and platform name",
      gradient: "from-teal-500 to-cyan-400"
    },
    {
      icon: Shield,
      title: "Identity Verification", 
      description: "We'll verify your identity using your registered email address",
      gradient: "from-emerald-500 to-teal-400"
    },
    {
      icon: Trash2,
      title: "Data Deletion",
      description: "Your data will be permanently deleted within 30 days of verification",
      gradient: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Modern Header */}
        <ModernHeader />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-full px-8 py-4 mb-8">
                <Shield className="w-6 h-6 text-red-400" />
                <span className="text-red-300 font-bold text-lg">Data Deletion Request</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Request</span>
                <br />
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-serif italic text-5xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Data Deletion
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                We respect your privacy and provide easy ways to delete your data from our platform. 
                Follow the simple steps below to request data deletion for any connected social media platform.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Simple</span>
                <br className="lg:hidden" />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-serif italic text-4xl lg:text-6xl" style={{ fontFamily: 'Playfair Display, serif' }}> Process</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Deleting your data is straightforward and secure. Here's how it works:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-105">
                      {/* Step Number */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-xl flex items-center justify-center shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-200 mb-4 group-hover:text-white transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {step.description}
                      </p>

                      {/* Hover Arrow */}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5 text-teal-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>


        {/* Email Instructions */}
        <section className="py-16 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-400/5 rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10 text-center mb-12">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 border border-teal-500/30 rounded-full px-8 py-4 mb-8">
                  <Mail className="w-6 h-6 text-teal-400" />
                  <span className="text-teal-300 font-bold text-lg">Email Instructions</span>
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                  <span className="text-slate-200">Send Your</span>
                  <br className="lg:hidden" />
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-serif italic text-4xl lg:text-6xl" style={{ fontFamily: 'Playfair Display, serif' }}> Request</span>
                </h2>
              </div>

              <div className="relative z-20 space-y-8">
                {/* Email Template */}
                <div className="bg-slate-700/30 rounded-2xl p-8 border border-slate-600/30">
                  <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
                    <Mail className="w-6 h-6 text-teal-400 mr-3" />
                    Email Template
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-300 font-medium mb-2">To:</p>
                      <p className="text-teal-400 font-mono bg-slate-800/50 rounded-lg p-3">info@brushly.art</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-300 font-medium mb-2">Subject:</p>
                      <p className="text-teal-400 font-mono bg-slate-800/50 rounded-lg p-3">Data Deletion Request - [Platform Name]</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-300 font-medium mb-2">Message:</p>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-slate-300 leading-relaxed">
                          Hello Brushly Team,<br/><br/>
                          I would like to request the deletion of my data associated with <strong className="text-teal-400">[Platform Name: Facebook/Instagram/Twitter]</strong>.<br/><br/>
                          <strong className="text-slate-200">My registered email address:</strong> [Your email address]<br/>
                          <strong className="text-slate-200">Platform to delete:</strong> [Facebook/Instagram/Twitter]<br/><br/>
                          Please confirm the deletion process and let me know if you need any additional information.<br/><br/>
                          Thank you for your assistance.<br/>
                          [Your Name]
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                      <h4 className="text-lg font-bold text-slate-200">What We'll Delete</h4>
                    </div>
                    <ul className="text-slate-300 space-y-2 text-sm">
                      <li>• Account connection data</li>
                      <li>• Posted content metadata</li>
                      <li>• Platform-specific preferences</li>
                      <li>• Authentication tokens</li>
                      <li>• Any cached platform data</li>
                    </ul>
                  </div>

                  <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="w-6 h-6 text-amber-400 mr-3" />
                      <h4 className="text-lg font-bold text-slate-200">Important Notes</h4>
                    </div>
                    <ul className="text-slate-300 space-y-2 text-sm">
                      <li>• Process takes up to 30 days</li>
                      <li>• Must use registered email</li>
                      <li>• Deletion is permanent</li>
                      <li>• You can re-connect later</li>
                      <li>• Contact us for questions</li>
                    </ul>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-center pt-8">
                  <p className="text-slate-400 mb-4">
                    Need help or have questions about data deletion?
                  </p>
                  <a 
                    href="mailto:info@brushly.art"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer currentPage="data-deletion" />
      </div>
    </div>
  );
};

export default DataDeletion;
