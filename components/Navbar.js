'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from './Mobilemenu';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession({});
  const email = session?.user?.email;
  const isLoggedIn = !!session;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search function - connects to MongoDB Atlas
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.users || []);
      } else {
        console.error('Search failed:', data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const hideIndicator = pathname === "/login";

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleUserSelect = (username) => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    // Navigate to user page
    window.location.href = `/${username}`;
  };

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

          {/* Search Component */}
          <li className="relative" ref={searchRef}>
            {!showSearch ? (
              <button
                onClick={handleSearchToggle}
                className="group relative px-4 py-2 rounded-full border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                <div className="flex items-center space-x-2">
                  <svg 
                    className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors text-sm">Search Users</span>
                </div>
              </button>
            ) : (
              <div className="relative">
                {/* Search Input */}
                <div className="flex items-center bg-[#0a0a0a] border-2 border-cyan-500 rounded-full px-4 py-2 shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-pulse">
                  <svg 
                    className="w-5 h-5 text-cyan-400 mr-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="bg-transparent text-white placeholder-cyan-300/60 outline-none w-64 text-sm"
                  />
                  <button
                    onClick={handleSearchToggle}
                    className="ml-3 text-cyan-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {(searchQuery || isSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-cyan-700 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.2)] max-h-80 overflow-y-auto">
                    {isSearching ? (
                      <div className="px-4 py-3 text-center">
                        <div className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-cyan-300 text-sm">Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((user, index) => (
                          <button
                            key={user.username}
                            onClick={() => handleUserSelect(user.username)}
                            className="w-full px-4 py-3 hover:bg-cyan-700/20 transition-all duration-200 border-b border-cyan-800/30 last:border-b-0 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(0,255,255,0.3)] group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-shadow overflow-hidden">
                                {user.profilePic ? (
                                  <img 
                                    src={user.profilePic} 
                                    alt={user.name || user.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  (user.name?.[0] || user.username?.[0])?.toUpperCase() || 'U'
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {user.name || user.username}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <div className="px-4 py-6 text-center">
                        <svg 
                          className="w-12 h-12 text-cyan-400/30 mx-auto mb-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33" />
                        </svg>
                        <p className="text-cyan-300/60 text-sm">No users found</p>
                        <p className="text-cyan-400/40 text-xs mt-1">Try a different search term</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </li>

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

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40">
          <div className="p-6 pt-20">
            <div className="relative">
              <div className="flex items-center bg-[#0a0a0a] border-2 border-cyan-500 rounded-full px-4 py-3 shadow-[0_0_25px_rgba(0,255,255,0.4)]">
                <svg 
                  className="w-5 h-5 text-cyan-400 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="bg-transparent text-white placeholder-cyan-300/60 outline-none flex-1"
                />
                <button
                  onClick={handleSearchToggle}
                  className="ml-3 text-cyan-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Search Results */}
              {(searchQuery || isSearching) && (
                <div className="mt-4 bg-[#0a0a0a] border border-cyan-700 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.2)] max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="px-4 py-6 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-cyan-300">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((user) => (
                        <button
                          key={user.username}
                          onClick={() => handleUserSelect(user.username)}
                          className="w-full px-4 py-4 hover:bg-cyan-700/20 transition-all duration-200 border-b border-cyan-800/30 last:border-b-0 group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(0,255,255,0.3)] group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-shadow overflow-hidden">
                              {user.profilePic ? (
                                <img 
                                  src={user.profilePic} 
                                  alt={user.name || user.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (user.name?.[0] || user.username?.[0])?.toUpperCase() || 'U'
                              )}
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                                {user.name || user.username}
                              </p>
                            </div>
                            <svg 
                              className="w-5 h-5 text-cyan-400/50 group-hover:text-cyan-300 transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="px-4 py-8 text-center">
                      <svg 
                        className="w-16 h-16 text-cyan-400/30 mx-auto mb-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33" />
                      </svg>
                      <p className="text-cyan-300/60">No users found</p>
                      <p className="text-cyan-400/40 text-sm mt-1">Try a different search term</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}