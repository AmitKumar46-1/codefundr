'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const categories = [
    { id: 'all', name: 'All Projects', count: 24 },
    { id: 'tech', name: 'Technology', count: 8 },
    { id: 'art', name: 'Art & Design', count: 6 },
    { id: 'music', name: 'Music', count: 4 },
    { id: 'gaming', name: 'Gaming', count: 3 },
    { id: 'education', name: 'Education', count: 3 }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "AI Code Assistant Revolution",
      creator: "TechMaster_99",
      description: "Building the next-generation AI pair programming tool that understands context and writes production-ready code.",
      category: "tech",
      goal: 50000,
      raised: 38500,
      supporters: 127,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      tags: ["AI", "Development", "Productivity"],
      trending: true,
      featured: true
    },
    {
      id: 2,
      title: "Cyberpunk Art Collection",
      creator: "NeonArtist",
      description: "Creating a stunning collection of cyberpunk digital artworks exploring themes of technology and humanity.",
      category: "art",
      goal: 25000,
      raised: 31200,
      supporters: 89,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
      tags: ["Digital Art", "Cyberpunk", "NFT"],
      trending: false,
      featured: true
    },
    {
      id: 3,
      title: "Indie Game: Neon Dreams",
      creator: "PixelDev_Studio",
      description: "A retro-futuristic platformer game with stunning visuals and an epic soundtrack. Join our development journey!",
      category: "gaming",
      goal: 75000,
      raised: 23400,
      supporters: 156,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
      tags: ["Game Development", "Indie", "Retro"],
      trending: true,
      featured: false
    },
    {
      id: 4,
      title: "Electronic Music Album",
      creator: "SynthWave_Producer",
      description: "Creating an atmospheric electronic album inspired by 80s synthwave and modern electronic music.",
      category: "music",
      goal: 15000,
      raised: 12800,
      supporters: 67,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      tags: ["Music", "Electronic", "Synthwave"],
      trending: false,
      featured: false
    },
    {
      id: 5,
      title: "Coding Bootcamp for Kids",
      creator: "CodeEducator",
      description: "Teaching programming fundamentals to children through interactive games and projects. Building the future generation of developers.",
      category: "education",
      goal: 30000,
      raised: 18900,
      supporters: 94,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      tags: ["Education", "Programming", "Kids"],
      trending: false,
      featured: false
    },
    {
      id: 6,
      title: "Open Source Design System",
      creator: "UIDesign_Pro",
      description: "Building a comprehensive, open-source design system for modern web applications with React components.",
      category: "tech",
      goal: 20000,
      raised: 24500,
      supporters: 78,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      tags: ["Open Source", "Design", "React"],
      trending: true,
      featured: false
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? featuredProjects 
    : featuredProjects.filter(project => project.category === selectedCategory);

  const platformStats = {
    totalRaised: 2847650,
    projectsSupported: 1240,
    creatorsHelped: 856,
    successRate: 78
  };

  const ProjectCard = ({ project }) => {
    const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);
    
    return (
      <div className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group">
        {/* Project Image */}
        <div className="relative overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                FEATURED
              </span>
            )}
            {project.trending && (
              <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full">
                🔥 TRENDING
              </span>
            )}
          </div>
          
          {/* Progress */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-black/70 text-cyan-300 text-xs font-semibold rounded-full">
              {Math.round(progressPercentage)}% funded
            </span>
          </div>
        </div>
        
        {/* Project Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {project.title}
            </h3>
            <span className="text-cyan-400 text-sm font-medium">
              @{project.creator}
            </span>
          </div>
          
          <p className="text-cyan-300/80 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-cyan-900/30 text-cyan-300 text-xs rounded-full border border-cyan-700/30"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-white font-semibold">₹{project.raised.toLocaleString()}</p>
              <p className="text-cyan-400/70 text-xs">of ₹{project.goal.toLocaleString()} goal</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{project.supporters}</p>
              <p className="text-cyan-400/70 text-xs">supporters</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white font-semibold rounded-lg hover:brightness-110 transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              Support Now
            </button>
            <button className="px-4 py-2 border border-cyan-500 text-cyan-300 rounded-lg hover:bg-cyan-500 hover:text-black transition-all">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
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
            Projects
          </h1>
          <p 
            className="text-xl md:text-2xl text-cyan-300 max-w-4xl mx-auto leading-relaxed"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Discover amazing creators and innovative projects that need your support
          </p>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up">
            <div className="text-center bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                ₹{(platformStats.totalRaised / 100000).toFixed(1)}L+
              </div>
              <p className="text-cyan-300/80 text-sm">Total Raised</p>
            </div>
            <div className="text-center bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                {platformStats.projectsSupported}+
              </div>
              <p className="text-cyan-300/80 text-sm">Projects Supported</p>
            </div>
            <div className="text-center bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-2">
                {platformStats.creatorsHelped}+
              </div>
              <p className="text-cyan-300/80 text-sm">Creators Helped</p>
            </div>
            <div className="text-center bg-[#1a1a2e] border border-cyan-700/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                {platformStats.successRate}%
              </div>
              <p className="text-cyan-300/80 text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)]'
                    : 'border border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            // Loading Skeleton
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-700" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="h-12 bg-gray-700 rounded" />
                    <div className="h-2 bg-gray-700 rounded" />
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-700 rounded w-20" />
                      <div className="h-8 bg-gray-700 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Projects Grid
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
              <p className="text-cyan-300/80">Try selecting a different category or check back later for new projects!</p>
            </div>
          )}
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4" data-aos="fade-up">
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Stories</span>
          </h2>
          <p className="text-xl text-cyan-300 text-center mb-16" data-aos="fade-up" data-aos-delay="200">
            Projects that exceeded their goals and changed lives
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "VR Education Platform",
                creator: "EduTech_Innovator",
                raised: "₹1.2L",
                goal: "₹80K",
                impact: "Used by 500+ students",
                story: "Started as a small idea, now revolutionizing how kids learn science through virtual reality."
              },
              {
                title: "Sustainable Fashion Brand",
                creator: "EcoDesigner",
                raised: "₹95K",
                goal: "₹60K",
                impact: "50+ products launched",
                story: "Turned passion for sustainable fashion into a thriving business with community support."
              },
              {
                title: "Mental Health App",
                creator: "WellnessDev",
                raised: "₹2.1L",
                goal: "₹1.5L",
                impact: "10K+ users helped",
                story: "Built a safe space for mental health support, funded entirely by the community."
              }
            ].map((story, index) => (
              <div 
                key={index}
                className="bg-[#1a1a2e] border border-cyan-700/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-teal-600 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{story.title}</h3>
                  <p className="text-cyan-400 text-sm">by @{story.creator}</p>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
                    {story.raised}
                  </div>
                  <div className="text-sm text-cyan-300/70">raised of {story.goal} goal</div>
                  <div className="text-sm text-yellow-400 mt-1">✨ {story.impact}</div>
                </div>
                
                <p className="text-cyan-300/80 text-sm text-center italic">
                  &quot;{story.story}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Your Project CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-aos="fade-up">
            Have an Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Project Idea</span>?
          </h2>
          <p className="text-xl text-cyan-300 mb-8" data-aos="fade-up" data-aos-delay="200">
            Join thousands of creators who&apos;ve turned their dreams into reality with community support
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
            <Link 
              href="/login" 
              className="px-8 py-4 rounded-full font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-110 transition-all hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 rounded-full font-bold border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all hover:scale-105"
            >
              Learn How It Works
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-[#1a1a2e]/50 border border-cyan-700/20 rounded-xl p-6">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Create Profile</h3>
              <p className="text-cyan-300/70 text-sm">Set up your creator profile with your story and goals</p>
            </div>
            <div className="bg-[#1a1a2e]/50 border border-cyan-700/20 rounded-xl p-6">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Share Your Work</h3>
              <p className="text-cyan-300/70 text-sm">Upload your project details and start building community</p>
            </div>
            <div className="bg-[#1a1a2e]/50 border border-cyan-700/20 rounded-xl p-6">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Receive Support</h3>
              <p className="text-cyan-300/70 text-sm">Get funded by people who believe in your vision</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}