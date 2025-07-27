'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function MobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const isActive = (path) => pathname === path;

  const menuRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 md:hidden flex items-center space-x-3">
      {/* Avatar Button */}
      {status === 'authenticated' && (
        <button
          onClick={() => {
            setUserOpen(!userOpen);
            setMenuOpen(false);
          }}
          className="w-9 h-9 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center"
        >
          {email?.[0]?.toUpperCase() || 'U'}
        </button>
      )}

      {/* Hamburger Button */}
      <button
        className="p-2 text-cyan-400 hover:text-white"
        onClick={() => {
          setMenuOpen(!menuOpen);
          setUserOpen(false);
        }}
        aria-label="Toggle menu"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
        </svg>
      </button>

      {/* Full-width Hamburger Menu */}
      {menuOpen && (
        <ul
          ref={menuRef}
          className="absolute top-full left-0 right-0 bg-[#121212dd] backdrop-blur-md border-t border-cyan-700 shadow-lg flex flex-col space-y-4 p-4 font-semibold text-cyan-300"
        >
          {['/', '/projects', '/about', '/contact'].map((path) => (
            <li key={path} onClick={() => setMenuOpen(false)}>
              <Link
                href={path}
                className={`block px-2 py-1 rounded-md ${
                  isActive(path)
                    ? 'text-white bg-cyan-700/50'
                    : 'hover:text-white hover:bg-cyan-700/30'
                }`}
              >
                {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            </li>
          ))}

          {status !== 'authenticated' ? (
            <>
              <li>
                <Link href="/signup">
                  <button className="w-[75%] mx-auto block px-5 py-2 rounded-full font-bold text-cyan-400 border border-cyan-400 hover:text-white hover:border-white transition-transform hover:scale-110">
                    Signup
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <button className="w-[75%] mx-auto block px-5 py-2 rounded-full font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white shadow-[0_0_15px_rgba(0,255,255,0.8)] hover:brightness-110 transition-transform hover:scale-110">
                    Login
                  </button>
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      )}

      {/* Full-width User Dropdown */}
      {userOpen && (
        <ul
          ref={userRef}
          className="absolute top-full -left-42 right-0 bg-[#121212dd] backdrop-blur-md border-t border-cyan-700 shadow-lg flex flex-col space-y-4 p-4 font-semibold text-cyan-300"
        >
          <li>
            <div className="text-white text-sm font-semibold pb-2 border-b border-cyan-700">
              {email}
            </div>
          </li>
          <li onClick={() => setUserOpen(false)}>
            <Link
              href="/dashboard"
              className="block px-2 py-1 hover:bg-cyan-700/30 rounded-md"
            >
              Dashboard
            </Link>
          </li>
          <li onClick={() => setUserOpen(false)}>
            <Link
              href="/settings"
              className="block px-2 py-1 hover:bg-cyan-700/30 rounded-md"
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                signOut();
                setUserOpen(false);
              }}
              className="text-left px-2 py-1 text-red-400 hover:text-white hover:bg-cyan-700/30 rounded-md"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
