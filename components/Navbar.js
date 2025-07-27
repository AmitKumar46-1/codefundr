'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from './Mobilemenu';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession({
   
  })
  const email = session?.user?.email;
  const isLoggedIn = !!session;
  const [showDropdown, setShowDropdown] = useState(false);


  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const hideIndicator = pathname === "/login";



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040404cc] backdrop-blur-md border-b border-cyan-700 shadow-lg">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)] cursor-default select-none">
          <Link href="/">CodeFundr</Link>

        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-semibold text-cyan-300 items-center">
          {['/', '/projects', '/about', '/contact'].map((path) => (
            <li key={path}>
              <Link
                href={path}
                className={`relative px-1 py-1 rounded-md transition-all duration-400 ease-in-out cursor-pointer ${pathname === path && !hideIndicator
                  ? 'text-white after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-cyan-400 after:via-blue-500 after:to-purple-700 after:shadow-[0_0_20px_rgba(0,255,255,0.8)]'
                  : 'text-cyan-400 hover:text-white hover:after:absolute hover:after:-bottom-1 hover:after:left-0 hover:after:right-0 hover:after:h-1 hover:after:rounded-full hover:after:bg-gradient-to-r hover:after:from-cyan-400 hover:after:via-blue-500 hover:after:to-purple-700 hover:after:shadow-[0_0_15px_rgba(0,255,255,0.6)]'
                  }`}
              >
                {path === '/' ? 'Home' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            </li>
          ))}

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <li className="relative">
              {/* Avatar-like button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center hover:brightness-110 transition-shadow shadow-md hover:shadow-cyan-400"
              >
                {email?.[0]?.toUpperCase() || 'U'}
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-5 w-64 bg-[#121212] text-cyan-300 border border-cyan-700 rounded-xl shadow-lg py-3 z-50">
                  <div className="px-4 pb-3 border-b border-cyan-700">
                    <p className="text-sm font-semibold text-white">{email}</p>

                  </div>
                  <ul className="py-2">
                    <li>
                      <Link onClick={() => setShowDropdown(false)} href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-cyan-700/20 rounded-md">Your Page</Link>
                    </li>
                    <li>
                      <Link onClick={() => setShowDropdown(false)} href="/dashboard" className="block px-4 py-2 hover:bg-cyan-700/20 rounded-md">Dashboard</Link>
                    </li>
                    <li>
                      <Link onClick={() => setShowDropdown(false)} href="/settings" className="block px-4 py-2 hover:bg-cyan-700/20 rounded-md">Settings</Link>
                    </li>
                  </ul>
                  <div className="px-4 pt-2 border-t border-cyan-700">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left text-red-400 hover:text-white text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link href="/login">
                  <button className="px-5 py-2 rounded-full font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_15px_rgba(0,255,255,0.8)] hover:brightness-110 transition-transform hover:scale-110">
                    Login
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </nav>
  );
}
