'use client';

import { useState, useEffect } from 'react';

import InfoCard from './Infocard';

// Dynamically import Particles (client-side only)


export default function Manager() {
  const [loaded, setLoaded] = useState(false);

  

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const delay = setTimeout(() => {
      setLoaded(true);
    }, 300); // Slight delay to match navbar/footer load feel

    return () => clearTimeout(delay);
  }, []);

  if (!loaded) return null;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 bg-[#040404cc] overflow-hidden text-gray-100 select-none">

      {/* Particle Background (Z-20 so blobs sit on top slightly) */}
      <div className="absolute inset-0 -z-20">
      
      </div>

      {/* Blobs Layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none will-change-transform">
        <span className="blob delay-0 bg-cyan-500 opacity-25"></span>
        <span className="blob delay-3000 bg-blue-600 opacity-20"></span>
        <span className="blob delay-6000 bg-purple-600 opacity-15"></span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
        CodeFundr
      </h1>

      {/* Subtitle */}
      <p className="mt-4 max-w-md text-center text-lg font-semibold tracking-wide text-cyan-200 leading-relaxed relative z-10">
        Support innovative programming projects, collaborate with creators, and evolve your skills in a thriving community.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap gap-8 justify-center relative z-10">
        <button className="btn-glow">Explore Projects</button>
        <button className="btn-outline-glow">Start a Campaign</button>
      </div>

      {/* Info Cards Section */}
      <section className="mt-14 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <InfoCard
          icon="💡"
          title="Innovate"
          description="Discover cutting-edge projects and ideas that push the boundaries of technology."
        />
        <InfoCard
          icon="🤝"
          title="Collaborate"
          description="Join a community of passionate coders, designers, and creators working together."
        />
        <InfoCard
          icon="🚀"
          title="Launch"
          description="Turn your ideas into reality with support, resources, and exposure."
        />
      </section>
        
    </section>
  );
}
