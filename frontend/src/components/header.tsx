"use client"

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

              <Link
                href="/login"
                className="btn-modern px-6 py-2 text-sm"
              >
                Login
              </Link>
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
              <Link
                href="/login"
                className="text-charcoal-text hover:text-electric-coral block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
