import { Search, Moon, Sun, LogIn, User, LogOut } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { AuthModal } from '@/app/components/modals/AuthModal';

function NavTooltip({ label }: { label: string }) {
  return (
    <span className="font-hf-mono pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded bg-[var(--deep-purple)] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      {label}
    </span>
  );
}

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    setIsLoggedIn(!!username);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    router.visit('/');
  };

  return (
    <nav className="dark:bg-background/80 fixed top-0 right-0 left-0 z-50 border-b border-[var(--deep-purple)]/20 bg-purple-100/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-[var(--deep-purple)] to-[var(--primary)] shadow-[var(--deep-purple)]/50 shadow-lg sm:h-10 sm:w-10">
              <span className="font-hf-mono text-sm font-bold text-white sm:text-base">HF</span>
            </div>
            <h1 className="font-hf-mono neon-link-group text-lg font-bold tracking-tight sm:text-xl">
              HACKERFLIX
            </h1>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="font-hf-mono neon-link text-sm font-medium">
              HOME
            </Link>
            <Link
              href="/movies"
              className="font-hf-mono neon-link text-muted-foreground text-sm font-medium"
            >
              MOVIES
            </Link>
            <Link
              href="/tvshows"
              className="font-hf-mono neon-link text-muted-foreground text-sm font-medium"
            >
              TV_SHOWS
            </Link>
            <Link
              href="/search"
              className="font-hf-mono neon-link text-muted-foreground text-sm font-medium"
            >
              SEARCH
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/search" className="neon-btn group" aria-label="Search">
              <Search className="h-5 w-5" />
              <NavTooltip label="SEARCH" />
            </Link>
            <button onClick={toggleTheme} className="neon-btn group" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <NavTooltip label={theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'} />
            </button>
            {isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="neon-btn group"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                  <NavTooltip label="USER_MENU" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-[var(--deep-purple)]/30 bg-white shadow-[0_0_30px_rgba(109,40,217,0.4)] dark:bg-[#0a0a0f]">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="font-hf-mono flex items-center gap-2 px-4 py-3 text-sm text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[var(--deep-purple)]/20"
                    >
                      <User className="h-4 w-4" />
                      PROFILE
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="font-hf-mono flex w-full items-center gap-2 border-t border-[var(--deep-purple)]/20 px-4 py-3 text-sm text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[var(--deep-purple)]/20"
                    >
                      <LogOut className="h-4 w-4" />
                      LOG_OUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="neon-btn group"
                aria-label="Sign in"
              >
                <LogIn className="h-5 w-5" />
                <NavTooltip label="SIGN_IN" />
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
