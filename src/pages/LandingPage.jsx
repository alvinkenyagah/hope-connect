import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Shield, MessageCircle, Users, TrendingUp, MapPin, Phone, Mail, CheckCircle, ChevronRight, Clock, Award } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';


export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleGetStarted = () => {
    navigate('/signup'); // The route for the sign-up page
  };

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Anonymous Support",
      description: "Connect with professional counselors safely and privately through our secure chat system."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Counselors",
      description: "Access certified professionals specialized in addiction recovery and mental health support."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Progress",
      description: "Monitor your recovery journey with personalized progress tracking and milestone celebrations."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "24/7 Emergency Help",
      description: "One-click panic button for immediate support when you need it most."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Book appointments that fit your schedule with easy online session management."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Self-Help Resources",
      description: "Access a library of articles, campaigns, and educational content for continuous learning."
    }
  ];





  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                🌟 Your Journey to Recovery Starts Here
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Connect With
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Professional </span>
                Counselors
              </h1>
              <p className="text-xl text-gray-600">
                Safe, anonymous, and compassionate support for those facing addiction and personal challenges. You're not alone in this journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition flex items-center justify-center space-x-2" onClick={handleGetStarted}>
                  <span>Start Your Journey</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Emergency Help</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Anonymous Chat</p>
                      <p className="text-sm text-gray-600">Connect safely & privately</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                    <div className="bg-purple-600 p-3 rounded-full">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Expert Counselors</p>
                      <p className="text-sm text-gray-600">Licensed professionals ready to help</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                    <div className="bg-green-600 p-3 rounded-full">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Track Progress</p>
                      <p className="text-sm text-gray-600">See your growth every day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Recover</h2>
            <p className="text-xl text-gray-600">Comprehensive tools and support for your healing journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Steps to Start Healing</h2>
            <p className="text-xl text-gray-600">Begin your recovery journey in just a few clicks</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Register Anonymously", desc: "Create your account and complete a confidential self-assessment" },
              { step: "2", title: "Connect with Counselor", desc: "Book an appointment or start a chat with a professional counselor" },
              { step: "3", title: "Track Your Progress", desc: "Follow your recovery journey and celebrate every milestone" }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Take the First Step?</h2>
          <p className="text-xl text-blue-100 mb-8">Your recovery journey begins with a single decision. We're here to support you every step of the way.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition">
              Start Free Assessment
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
              Talk to a Counselor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Hope Connect</span>
              </div>
              <p className="text-gray-400">Empowering recovery, one connection at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Services</a></li>
                <li><a href="#" className="hover:text-white transition">Resources</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>24/7 Hotline: 1-800-HELP</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>support@hopeconnect.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Hope Connect. All rights reserved. Your privacy and recovery are our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}