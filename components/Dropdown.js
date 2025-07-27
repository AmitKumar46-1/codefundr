'use client';
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

export default function UserDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const firstLetter = user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-600 text-white font-bold hover:brightness-110"
      >
        {firstLetter}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-[#121212dd] backdrop-blur-md rounded-xl shadow-lg border border-cyan-700 z-50 p-3 space-y-3">
          {/* User Email and + Icon */}
          <div className="flex items-center justify-between border-b border-cyan-700 pb-2">
            <div className="text-sm font-semibold text-white break-all">{user.email}</div>
            <button className="text-cyan-300 hover:text-white">
              <Plus size={20} />
            </button>
          </div>

          {/* Dropdown Links */}
          <ul className="text-cyan-300 space-y-2 text-sm font-medium">
            <li>
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-white">Settings</Link>
            </li>
            <li>
              <button className="hover:text-white w-full text-left">Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
