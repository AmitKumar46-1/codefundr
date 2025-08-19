'use client';

import { useEffect, useState } from 'react';
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
            Have questions? We're here to help you succeed on your creative journey
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div data-aos="fade-right">
            <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <h2 className="text-3xl font-bold text-white mb-2">Send us a Message</h2>
              <p className="text-cyan-300/80 mb-8">We'll get back to you within 24 hours</p>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent successfully! We'll get back to you soon.
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
                    <p className="text-cyan-400/70 text-sm">24-48 hour response time</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Live Chat</h4>
                    <p className="text-cyan-300">Available 9 AM - 6 PM IST</p>
                    <p className="text-cyan-400/70 text-sm">Mon-Fri support</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Help Center</h4>
                    <p className="text-cyan-300">Self-service resources</p>
                    <p className="text-cyan-400/70 text-sm">FAQs, guides & tutorials</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Answers</h3>
              
              <div className="space-y-4">
                {[
                  {
                    question: "How do I get started?",
                    answer: "Simply sign up, complete your profile, and start receiving support from your community!"
                  },
                  {
                    question: "What fees do you charge?",
                    answer: "We charge a small 3% platform fee + payment processing fees to keep the lights on."
                  },
                  {
                    question: "When do I receive payments?",
                    answer: "Payments are processed instantly and transferred to your account within 2-3 business days."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Absolutely! We use bank-level encryption and never store sensitive payment information."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-cyan-700/20 pb-4 last:border-b-0">
                    <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                    <p className="text-cyan-300/80 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-cyan-700/20">
                <p className="text-cyan-400/70 text-sm text-center">
                  Need more help? Check out our{' '}
                  <a href="#" className="text-cyan-300 hover:text-white transition-colors underline">
                    Help Center
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-aos="fade-up">
            Ready to Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Creator Economy</span>?
          </h2>
          <p className="text-xl text-cyan-300 mb-8" data-aos="fade-up" data-aos-delay="200">
            Start building your community and receiving support for your creative work today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
            <a 
              href="/login" 
              className="px-8 py-4 rounded-full font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-110 transition-all hover:scale-105"
            >
              Get Started Free
            </a>
            <a 
              href="/about" 
              className="px-8 py-4 rounded-full font-bold border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}