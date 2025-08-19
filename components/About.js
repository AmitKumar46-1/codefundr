'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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
            A modern crowdfunding platform built to empower creators in the digital age
          </p>
        </div>
      </section>

      {/* What is CodeFundr */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">CodeFundr</span>?
              </h2>
              <p className="text-lg text-cyan-200 leading-relaxed mb-6">
                CodeFundr is a next-generation crowdfunding platform designed specifically for creators, developers, artists, and innovators. Built with modern technology, it provides a seamless experience for both project creators and supporters.
              </p>
              <p className="text-lg text-cyan-200 leading-relaxed mb-6">
                Unlike traditional crowdfunding sites, CodeFundr focuses on the creator economy with features like real-time funding updates, interactive project showcases, and direct creator-supporter communication.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-[#0a0a0a] border border-cyan-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">Next.js</div>
                  <div className="text-cyan-300/70 text-sm">Full-stack Framework</div>
                </div>
                <div className="bg-[#0a0a0a] border border-cyan-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">React</div>
                  <div className="text-cyan-300/70 text-sm">Modern UI</div>
                </div>
                <div className="bg-[#0a0a0a] border border-cyan-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">Tailwind</div>
                  <div className="text-cyan-300/70 text-sm">Responsive Design</div>
                </div>
                <div className="bg-[#0a0a0a] border border-cyan-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">Vercel</div>
                  <div className="text-cyan-300/70 text-sm">Cloud Deployment</div>
                </div>
              </div>
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

      {/* Developer Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
            data-aos="fade-up"
          >
            Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Passion</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]" data-aos="fade-up">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                  <span className="text-3xl font-bold text-white">AKJ</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Amit Kumar Jha</h3>
                <p className="text-cyan-400 mb-2">Full-Stack Developer & Creator</p>
                <p className="text-cyan-300/70">BCA 2nd Year Student</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-4">About the Developer</h4>
                  <p className="text-cyan-200 leading-relaxed mb-4">
                    CodeFundr is a solo project built by Amit Kumar Jha, a passionate BCA 2nd year student with expertise in modern web development. This platform represents months of dedication to creating something meaningful for the creator community.
                  </p>
                  <p className="text-cyan-200 leading-relaxed">
                    Built entirely from scratch as a portfolio project, CodeFundr showcases advanced full-stack development skills using cutting-edge technologies like Next.js, React, and modern deployment practices.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-purple-400 mb-4">Technical Achievements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-cyan-300">Full-stack Next.js application</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-cyan-300">Responsive UI with Tailwind CSS</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-cyan-300">Modern animations with AOS</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-cyan-300">Cloud deployment on Vercel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-cyan-300">Professional-grade design system</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
            data-aos="fade-up"
          >
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Features</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💻",
                title: "Modern Tech Stack",
                description: "Built with Next.js 14, React 18, and Tailwind CSS for optimal performance and user experience."
              },
              {
                icon: "🎨",
                title: "Cyberpunk Design",
                description: "Stunning visual design with neon aesthetics, smooth animations, and immersive user interface."
              },
              {
                icon: "📱",
                title: "Fully Responsive",
                description: "Perfect experience across all devices - desktop, tablet, and mobile with touch-optimized interactions."
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Optimized for speed with Next.js server-side rendering and efficient bundle optimization."
              },
              {
                icon: "🔐",
                title: "Secure Platform",
                description: "Built with security best practices, data protection, and safe payment processing integration."
              },
              {
                icon: "🚀",
                title: "Scalable Architecture",
                description: "Designed to handle growth with modular components and efficient state management systems."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-cyan-200/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Lines of Code", color: "from-cyan-400 to-blue-500" },
              { number: "15+", label: "Components Built", color: "from-blue-500 to-purple-600" },
              { number: "3", label: "Months Development", color: "from-purple-600 to-pink-500" },
              { number: "100%", label: "Made with ❤️", color: "from-pink-500 to-cyan-400" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group"
                data-aos="zoom-in"
                data-aos-delay={index * 150}
              >
                <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group-hover:scale-105">
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

      {/* Developer Story */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            data-aos="fade-up"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Development Journey</span>
          </h2>
          <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]" data-aos="fade-up" data-aos-delay="200">
            <p className="text-lg text-cyan-200 leading-relaxed mb-6">
              &quot;As a BCA student passionate about web development, I wanted to create something that could make a real difference in the creator economy. CodeFundr represents everything I&apos;ve learned about modern web development, from React hooks to responsive design.&quot;
            </p>
            <p className="text-lg text-cyan-200 leading-relaxed mb-6">
              &quot;This project showcases my skills in full-stack development, modern UI/UX design, and deployment practices. Every component was carefully crafted to provide an exceptional user experience while maintaining clean, scalable code.&quot;
            </p>
            <p className="text-cyan-400 font-semibold">— Amit Kumar Jha, Creator of CodeFundr</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
            data-aos="fade-up"
          >
            Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Modern Tech</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Next.js 14", description: "Full-stack React framework", color: "from-black to-gray-800" },
              { name: "React 18", description: "Modern UI library", color: "from-blue-400 to-blue-600" },
              { name: "Tailwind CSS", description: "Utility-first styling", color: "from-cyan-400 to-teal-500" },
              { name: "Vercel", description: "Cloud deployment", color: "from-black to-gray-900" },
              { name: "AOS", description: "Scroll animations", color: "from-purple-500 to-pink-600" },
              { name: "Responsive Design", description: "Mobile-first approach", color: "from-green-400 to-emerald-600" }
            ].map((tech, index) => (
              <div 
                key={index}
                className="bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-sm">{tech.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-cyan-200/80 text-sm">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div 
            className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-700/50 rounded-2xl p-8 backdrop-blur-sm"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
            <p className="text-cyan-300 mb-6">Join the platform and discover what modern crowdfunding can do for your projects</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-110 transition-all hover:scale-105"
              >
                Start Creating
              </Link>
              <Link 
                href="/projects" 
                className="px-8 py-3 rounded-full font-bold border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all hover:scale-105"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}