'use client';




export default function Footer() {
 

  return (
    <footer className="bg-[#040404cc] backdrop-blur-sm border-t border-cyan-700 shadow-inner py-10 px-6  select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-cyan-400 font-semibold text-lg tracking-wide cursor-default select-text drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]">
          CodeFundr &copy; {new Date().getFullYear()}
        </div>

        <div className="flex space-x-6 text-cyan-400">
          <SocialIcon
            href="https://twitter.com/"
            label="Twitter"
            icon={
              <svg
                fill="currentColor"
                stroke="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 hover:text-white transition-colors duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14.86 5.48 5.48 0 002.4-3.02 10.92 10.92 0 01-3.47 1.33 5.46 5.46 0 00-9.3 4.98A15.5 15.5 0 013 4.9a5.44 5.44 0 001.69 7.28 5.4 5.4 0 01-2.48-.68v.07a5.47 5.47 0 004.39 5.36 5.44 5.44 0 01-2.46.1 5.48 5.48 0 005.1 3.8A10.94 10.94 0 012 19.54 15.46 15.46 0 008.29 21c9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63A10 10 0 0023 3z" />
              </svg>
            }
          />
          <SocialIcon
            href="https://github.com/"
            label="GitHub"
            icon={
              <svg
                fill="currentColor"
                stroke="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 hover:text-white transition-colors duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 006.84 9.5c.5.09.66-.22.66-.48 0-.23-.01-.85-.01-1.66-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.84.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.67-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.4.21 2.44.1 2.7.64.69 1.03 1.58 1.03 2.67 0 3.84-2.35 4.69-4.58 4.93.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .26.15.58.67.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" />
              </svg>
            }
          />
          {/* Add more social icons similarly */}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="hover:text-white transition-colors duration-300"
    >
      {icon}
    </a>
  );
}
