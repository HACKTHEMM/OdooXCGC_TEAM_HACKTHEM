"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuthData, getAuthData } from '../lib/auth-utils';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ user_name?: string; email?: string } | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const { user, isAuthenticated } = getAuthData();
      setUser(user);
      setIsAuthenticated(isAuthenticated);
    };

    checkAuth();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for custom auth state changes (e.g., when user logs in/out in same tab)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/');
    }
  };

  return (
    <header className="glass-surface border-b border-glass-border backdrop-blur-[20px] sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-xl font-bold gradient-text-electric animate-glow">
                CivicTracker
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              <Link
                href="/home"
                className="text-charcoal-text hover:text-electric-coral px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-light hover:scale-105"
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-charcoal-text hover:text-electric-coral px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-light hover:scale-105"
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-charcoal-text hover:text-electric-coral px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-light hover:scale-105"
              >
                Report
              </Link>
              <Link
                href="/map"
                className="text-charcoal-text hover:text-electric-coral px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-light hover:scale-105"
              >
                Map
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="btn-secondary px-4 py-2 text-sm"
              >
                Admin
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-charcoal-text text-sm">
                    Welcome, {user?.user_name || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-modern px-6 py-2 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-modern px-6 py-2 text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-charcoal-text hover:text-electric-coral focus:outline-none focus:text-electric-coral transition-colors duration-300 touch-target"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mobile-padding">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-surface rounded-lg mt-2 border border-glass-border shadow-glass">
              <Link
                href="/home"
                className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                Report
              </Link>
              <Link
                href="/map"
                className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                Map
              </Link>
              <Link
                href="/admin"
                className="text-electric-coral hover:text-sky-blue block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>

              {isAuthenticated ? (
                <div className="border-t border-glass-border pt-2">
                  <div className="px-3 py-2 text-charcoal-text text-sm">
                    Welcome, {user?.user_name || user?.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
