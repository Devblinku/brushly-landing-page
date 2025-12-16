import React, { useEffect } from 'react';
import { Shield, Mail, Lock, Eye, Database, Users, Globe, Brain } from 'lucide-react';
import SmokeyCursor from './ui/SmokeyCursor';
import { ModernHeader } from './ui/modern-header';
import { Footer } from './ui/Footer';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, upload artwork, or contact us for support. This includes your name, email address, profile information, and any artwork or content you upload."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our service, including your interactions with features, the time and frequency of your activity, and technical information about your device and internet connection."
        },
        {
          subtitle: "Social Media Integration",
          text: "When you connect your social media accounts, we collect information necessary to post content on your behalf, including access tokens and profile information from connected platforms."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide you with the services we offer on our app, including content and social media management features for your artwork."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you service-related notifications, updates about new features, and respond to your inquiries and support requests."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to understand how our service is used, identify areas for improvement, and develop new features that better serve our users."
        }
      ]
    },
    {
      icon: Brain,
      title: "AI Model Training and Your Artwork",
      content: [
        {
          subtitle: "We Do Not Train AI Models with Your Artwork",
          text: "We want to be completely transparent: We do NOT use your artwork images to train our AI models. Your artwork is never used for machine learning, model training, or any form of AI development purposes."
        },
        {
          subtitle: "How Your Artwork is Used",
          text: "Your artwork images are used solely to create text content that you choose to generate in our app, such as descriptions, headings, and other text-based content. This is done only when you explicitly request content generation for your artwork."
        },
        {
          subtitle: "Secure Storage",
          text: "Your artwork and all other data is securely stored on Brushly servers. We implement industry-standard security measures to protect your data from unauthorized access, loss, or theft."
        },
        {
          subtitle: "No Third-Party Sharing",
          text: "Your artwork and personal data are not shared with any third parties. We do not sell, rent, or share your artwork images or any other personal information with third-party companies, AI training services, or any other external entities."
        }
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Third-Party Services",
          text: "We do not share your personal information or artwork with third parties. Your data is stored securely on our infrastructure, and any content you choose to publish to social media platforms is shared only at your explicit request and action. We maintain complete control over your artwork and personal data, ensuring they remain private and protected."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, regulation, or legal process, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to the same privacy protections."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          subtitle: "Data Encryption",
          text: "All data transmission is encrypted using industry-standard SSL/TLS protocols, and sensitive information is encrypted at rest using advanced encryption standards."
        },
        {
          subtitle: "Access Controls",
          text: "We maintain strict access controls and regularly audit our systems to ensure that only authorized personnel have access to your personal information."
        }
      ]
    },
    {
      icon: Globe,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us directly."
        },
        {
          subtitle: "Data Portability",
          text: "You can request a copy of your personal information in a structured, machine-readable format, and you have the right to transfer this information to another service."
        },
        {
          subtitle: "Deletion",
          text: "You can request deletion of your personal information, subject to certain legal and operational requirements. We will retain some information as required by law or for legitimate business purposes."
        }
      ]
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

              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-blue-500/30 rounded-full px-8 py-4 mb-8">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-blue-300 font-bold text-lg">Privacy Policy</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-slate-200">Your Privacy</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                  Matters to Us
                </span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                We are committed to protecting your privacy and being transparent about how we collect, 
                use, and protect your personal information. This policy explains our practices in detail.
              </p>

              <div className="mt-8 text-sm text-slate-400">
                <p>Last updated: October 1, 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="mb-16 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl">
                    {/* Section Header */}
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-200">{section.title}</h2>
                    </div>

                    {/* Section Content */}
                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-l-2 border-slate-600/50 pl-6">
                          <h3 className="text-lg font-semibold text-slate-200 mb-3">
                            {item.subtitle}
                          </h3>
                          <p className="text-slate-300 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Contact Information */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200">Contact Us</h2>
              </div>

              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us at:
                </p>
                
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <p className="text-slate-200 font-medium">Email: privacy@brushly.ai</p>
                  <p className="text-slate-300 text-sm mt-2">
                    We will respond to your inquiry within 48 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-blue-500/20 rounded-2xl p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">
                Changes to This Policy
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any material 
                changes by posting the updated policy on our website and updating the "Last updated" date above.
              </p>
            </div>
          </div>
        </section>
        
        <Footer currentPage="privacy" />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
