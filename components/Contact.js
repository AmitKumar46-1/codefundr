'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 
            className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 mb-8 drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]"
            data-aos="fade-up"
          >
            Get in Touch
          </h1>
          <p 
            className="text-xl md:text-2xl text-cyan-300 max-w-4xl mx-auto leading-relaxed"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Have questions? We&apos;re here to help you succeed on your creative journey
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div data-aos="fade-right">
            <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <h2 className="text-3xl font-bold text-white mb-2">Send us a Message</h2>
              <p className="text-cyan-300/80 mb-8">We&apos;ll get back to you within 24 hours</p>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent successfully! We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-cyan-700/50 rounded-lg text-white placeholder-cyan-400/60 focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-cyan-700/50 rounded-lg text-white placeholder-cyan-400/60 focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-cyan-300 text-sm font-semibold mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-cyan-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-cyan-300 text-sm font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-cyan-700/50 rounded-lg text-white placeholder-cyan-400/60 focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & FAQ */}
          <div data-aos="fade-left">
            {/* Contact Info */}
            <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 mb-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <h3 className="text-2xl font-bold text-white mb-6">Other Ways to Reach Us</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email Support</h4>
                    <p className="text-cyan-300">support@codefundr.com</p>
                    <p className="text-cyan-300/70 text-sm">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m2-4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m0-6v6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Live Chat</h4>
                    <p className="text-cyan-300">Available 24/7</p>
                    <p className="text-cyan-300/70 text-sm">Instant support for quick questions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Documentation</h4>
                    <p className="text-cyan-300">Comprehensive guides</p>
                    <p className="text-cyan-300/70 text-sm">Self-service help center</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="border-b border-cyan-700/30 pb-4">
                  <h4 className="text-white font-semibold mb-2">How quickly will you respond?</h4>
                  <p className="text-cyan-300/80 text-sm">We typically respond to all inquiries within 24 hours during business days.</p>
                </div>
                
                <div className="border-b border-cyan-700/30 pb-4">
                  <h4 className="text-white font-semibold mb-2">Do you offer technical support?</h4>
                  <p className="text-cyan-300/80 text-sm">Yes! Our team provides comprehensive technical support for all platform features.</p>
                </div>
                
                <div className="border-b border-cyan-700/30 pb-4">
                  <h4 className="text-white font-semibold mb-2">Can I schedule a demo?</h4>
                  <p className="text-cyan-300/80 text-sm">Absolutely! Contact us to schedule a personalized demo of CodeFundr&apos;s features.</p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">What about partnerships?</h4>
                  <p className="text-cyan-300/80 text-sm">We&apos;re always open to collaboration opportunities with educational institutions and tech companies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center" data-aos="fade-up">
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-700/30 rounded-2xl p-12 shadow-[0_0_40px_rgba(0,255,255,0.1)]">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-cyan-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators already building amazing projects with CodeFundr
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="px-8 py-4 rounded-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-110 transition-all hover:scale-105"
              >
                Start Creating
              </Link>
              <Link 
                href="/features"
                className="px-8 py-4 rounded-lg font-bold border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition-all hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}