'use client';

import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple, FaGithub, FaTwitter } from 'react-icons/fa';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const socialProviders = [
  { name: 'google', label: 'Google', icon: <FcGoogle size={24} />, color: 'bg-white text-black' },
  { name: 'facebook', label: 'Facebook', icon: <FaFacebookF size={20} />, color: 'bg-blue-700 text-white' },
  { name: 'apple', label: 'Apple', icon: <FaApple size={24} />, color: 'bg-gray-900 text-white' },
  { name: 'github', label: 'GitHub', icon: <FaGithub size={24} />, color: 'bg-gray-800 text-white' },
  { name: 'twitter', label: 'Twitter', icon: <FaTwitter size={20} />, color: 'bg-sky-500 text-white' },
];

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  // ✅ Redirect inside useEffect
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="pt-20 bg-[#040404cc] flex flex-col justify-center items-center px-4 min-h-screen">
      <div className="max-w-md w-full space-y-20 p-15 rounded-xl bg-[#040404cc] shadow-lg border border-cyan-700 h-[84vh]">
        <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700">
          Login to CodeFundr
        </h2>

        <div className="flex flex-col space-y-10">
          {socialProviders.map(({ name, label, icon, color }) => (
            <button
              key={name}
              className={`flex items-center justify-center space-x-3 py-2 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.6)] hover:brightness-110 transition ${color}`}
              onClick={() => signIn(name)}
            >
              {icon}
              <span className="font-semibold">{`Continue with ${label}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
