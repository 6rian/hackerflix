import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { AuthModal } from '@/app/components/modals/AuthModal';

export function Footer() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <footer className="footer-neon-cyan relative mt-24 overflow-hidden border-t-2 border-[#6d28d9]/60 bg-[#0a0a0f] py-12">
      {/* Strong grain/noise texture overlay */}
      <div
        className="bg-noise pointer-events-none absolute inset-0 opacity-50"
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Subtle purple gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(138, 92, 246, 0.4), rgba(138, 92, 246, 0.15) 50%, transparent 80%)',
        }}
      />

      {/* Visible grid pattern overlay - thinner lines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(138, 92, 246, 0.25) 0px, transparent 0.5px, transparent 49.5px, rgba(138, 92, 246, 0.25) 50px),
            repeating-linear-gradient(90deg, rgba(138, 92, 246, 0.25) 0px, transparent 0.5px, transparent 49.5px, rgba(138, 92, 246, 0.25) 50px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Scanline effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 170, 0.05) 2px, rgba(0, 255, 170, 0.05) 4px)`,
        }}
      />

      {/* Bright glow effect on top border */}
      <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-transparent via-[#00ffaa] to-transparent shadow-[0_0_30px_rgba(0,255,170,0.8)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <h2 className="neon-link font-hf-mono mb-4 inline-block cursor-pointer text-xl font-bold tracking-tighter text-[#6d28d9]">
              HACKERFLIX
            </h2>
            <p className="max-w-sm font-sans text-sm text-[#9ca3af]">
              The premier streaming library for everything cyber, technology, security, privacy, and
              digital culture. Stay paranoid.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-sm tracking-wider text-[#f5f5f7]">LINKS</h3>
            <ul className="space-y-2 font-sans text-sm text-[#9ca3af]">
              <li>
                <Link href="/" className="neon-link inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="neon-link inline-block">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tvshows" className="neon-link inline-block">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/search" className="neon-link inline-block">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-sm tracking-wider text-[#f5f5f7]">SYSTEM</h3>
            <ul className="space-y-2 font-sans text-sm text-[#9ca3af]">
              <li>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="neon-link inline-block border-0 bg-transparent p-0 text-left text-sm font-normal"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="neon-link inline-block border-0 bg-transparent p-0 text-left text-sm font-normal"
                >
                  Register
                </button>
              </li>
              <li>
                <Link href="/about" className="neon-link inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="neon-link inline-block">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="neon-link inline-block">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#6d28d9]/20 pt-8 text-center font-mono text-xs text-[#9ca3af]">
          &copy; {new Date().getFullYear()} HACKERFLIX
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </footer>
  );
}
