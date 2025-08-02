"use client"

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './theme-toggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass-surface border-b border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center shadow-neon group-hover:shadow-purple transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple bg-clip-text text-transparent">
                CivicTracker
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              <Link
                href="/home"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-light dark:hover:bg-glass-dark"
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-light dark:hover:bg-glass-dark"
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-light dark:hover:bg-glass-dark"
              >
                Report
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />

              <Link
                href="/login"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white hover:shadow-neon px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
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
              className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green p-2 rounded-lg transition-colors"
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
          <div className="md:hidden py-4 border-t border-glass-light-hover dark:border-glass-dark-hover">
            <div className="flex flex-col space-y-2">
              <Link
                href="/home"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-light dark:hover:bg-glass-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-light dark:hover:bg-glass-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-light dark:hover:bg-glass-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Report
              </Link>
              <div className="border-t border-glass-light-hover dark:border-glass-dark-hover pt-4 mt-4">
                <Link
                  href="/login"
                  className="block text-charcoal dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white hover:shadow-neon px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 mt-2"
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
