'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 
            className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 mb-8 drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]"
            data-aos="fade-up"
          >
            About CodeFundr
          </h1>
          <p 
            className="text-xl md:text-2xl text-cyan-300 max-w-4xl mx-auto leading-relaxed"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Empowering creators in the digital age through innovative crowdfunding solutions
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Mission</span>
              </h2>
              <p className="text-lg text-cyan-200 leading-relaxed mb-6">
                CodeFundr was born from a simple belief: every creator deserves the opportunity to turn their passion into reality. We're building a platform where innovation meets opportunity, where supporters can directly impact the projects they believe in.
              </p>
              <p className="text-lg text-cyan-200 leading-relaxed">
                Our mission is to democratize funding for creators, developers, artists, and innovators worldwide, providing them with the tools and community they need to succeed.
              </p>
            </div>
            <div data-aos="fade-left" className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl border border-cyan-700 shadow-[0_0_50px_rgba(0,255,255,0.2)] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Powering Dreams</h3>
                  <p className="text-cyan-300">One Project at a Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
            data-aos="fade-up"
          >
            What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Stand For</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Innovation First",
                description: "We believe in pushing boundaries and embracing new technologies to create the best possible experience for creators and supporters alike."
              },
              {
                icon: "🤝",
                title: "Community Driven",
                description: "Success happens when creators and supporters work together. We foster meaningful connections between visionaries and their communities."
              },
              {
                icon: "🔒",
                title: "Trust & Security",
                description: "Your data and transactions are protected with industry-leading security measures. We prioritize transparency in everything we do."
              },
              {
                icon: "🌟",
                title: "Creator Success",
                description: "Every feature we build is designed with one goal: helping creators achieve their dreams and build sustainable creative careers."
              },
              {
                icon: "🌍",
                title: "Global Impact",
                description: "We're connecting creators and supporters from around the world, breaking down barriers to make funding accessible to everyone."
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Built with cutting-edge technology for instant payments, real-time updates, and seamless user experiences across all devices."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {value.title}
                </h3>
                <p className="text-cyan-200/80 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Creators", color: "from-cyan-400 to-blue-500" },
              { number: "₹50L+", label: "Funds Raised", color: "from-blue-500 to-purple-600" },
              { number: "25K+", label: "Supporters", color: "from-purple-600 to-pink-500" },
              { number: "98%", label: "Success Rate", color: "from-pink-500 to-cyan-400" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group"
                data-aos="zoom-in"
                data-aos-delay={index * 150}
              >
                <div className="bg-[#0a0a0a] border border-cyan-700/30 rounded-2xl p-8 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group-hover:scale-105">
                  <h3 className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                    {stat.number}
                  </h3>
                  <p className="text-cyan-300 font-semibold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Creators</span>, 
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-400">Creators</span>
          </h2>
          <p 
            className="text-xl text-cyan-300 max-w-3xl mx-auto leading-relaxed mb-12"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            We understand the challenges creators face because we've been there. Our team combines technical expertise with real-world creator experience to build something truly special.
          </p>
          
          <div 
            className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-700/50 rounded-2xl p-8 backdrop-blur-sm"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
            <p className="text-cyan-300 mb-6">Join thousands of creators who are already building their dreams on CodeFundr</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/login" 
                className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-110 transition-all hover:scale-105"
              >
                Start Creating
              </a>
              <a 
                href="/projects" 
                className="px-8 py-3 rounded-full font-bold border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all hover:scale-105"
              >
                Explore Projects
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}