"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from './theme-toggle';
import { clearAuthData, getAuthData } from '../lib/auth-utils';

export default function Header() {
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
      window.location.href = '/';
    }
  };

  return (
    <header className="glass-surface border-b border-glass-border backdrop-blur-[20px] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-xl font-bold gradient-text-accent animate-glow">
                CivicTrack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              <Link
                href="/home"
                className="text-text-primary hover:text-accent-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg hover:scale-105"
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-text-primary hover:text-accent-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg hover:scale-105"
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-text-primary hover:text-accent-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg hover:scale-105"
              >
                Report
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />

              <Link
                href="/admin"
                className="text-text-primary hover:text-accent-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
              >
                Admin
              </Link>

              <Link
                href="/login"
                className="text-text-primary hover:text-accent-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="btn-modern px-6 py-2 rounded-lg text-sm font-medium hover:scale-105 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-primary hover:text-accent-primary p-2 rounded-lg transition-all duration-300 hover:bg-glass-bg"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border">
            <div className="flex flex-col space-y-2">
              <Link
                href="/home"
                className="text-text-primary hover:text-accent-primary px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-text-primary hover:text-accent-primary px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
                onClick={() => setIsMenuOpen(false)}
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-text-primary hover:text-accent-primary px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
                onClick={() => setIsMenuOpen(false)}
              >
                Report
              </Link>
              <Link
                href="/admin"
                className="text-text-primary hover:text-accent-primary px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="pt-4 border-t border-glass-border">
                <Link
                  href="/login"
                  className="block text-text-primary hover:text-accent-primary px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-glass-bg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block btn-modern mt-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
