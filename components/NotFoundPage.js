"use client";

import React from "react";
import { useRouter } from "next/navigation";

const NotFoundPage = ({ username = "example_user" }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" style={{ backgroundColor: '#040404cc' }}>
      {/* Simple Background Pattern - Matching Username Page */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Subtle Background Elements - Much Less Glowing */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-32 w-48 h-48 bg-gradient-to-r from-purple-400/3 to-pink-400/3 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-r from-blue-600/4 to-cyan-600/4 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Simplified 404 Text */}
        <div className="relative mb-16">
          <h1 className="text-[8rem] md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-lg">
            404
          </h1>
        </div>

        {/* Clean Container */}
        <div className="relative p-10 rounded-3xl bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-sm border border-gray-800/50 shadow-xl">
          
          {/* Simple Corner Accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/30 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-purple-400/30 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-pink-400/30 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/30 rounded-br-3xl"></div>
          
          {/* Content */}
          <div className="relative space-y-8 mb-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider">
                Page Not Found
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-purple-400/50"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                <div className="w-12 h-px bg-gradient-to-r from-purple-400/50 to-pink-400/50"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-white text-xl leading-relaxed">
                User <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono bg-black/50 px-3 py-1 rounded-md border border-cyan-500/20">"{username}"</span> not found
              </p>
              <p className="text-gray-300 text-base max-w-md mx-auto">
                The requested profile doesn't exist or has been removed from our system.
              </p>
            </div>

            {/* Simple Stats Section */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 my-8">
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/30">
                <span className="text-lg">❌</span>
                <span className="font-medium">Page Not Found</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/30">
                <span className="text-lg">🔍</span>
                <span className="font-medium">User Missing</span>
              </div>
            </div>
          </div>

          {/* Simple Button */}
          <div className="relative">
            <button 
              onClick={() => router.push('/')}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600/80 to-purple-600/80 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="text-xl group-hover:animate-bounce">🏠</span>
              <span>Back to Home</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Simple Decorative Elements */}
        <div className="mt-12 flex justify-center items-center space-x-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-500/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-pink-500/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            <div className="w-2 h-2 bg-cyan-500/60 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
          </div>
        </div>

        {/* Minimal Floating Elements */}
        <div className="absolute top-16 left-16 w-3 h-3 bg-cyan-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-24 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 left-32 w-2 h-2 bg-pink-400/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-16 w-3 h-3 bg-cyan-400/30 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
      </div>
    </div>
  );
};

export default NotFoundPage;