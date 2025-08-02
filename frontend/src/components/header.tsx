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
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-400 dark:to-purple-400 bg-clip-text text-transparent">
                CivicTrack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              <Link
                href="/home"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Report
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />

              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-500 dark:to-purple-500 text-white hover:shadow-lg px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
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
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 p-2 rounded-lg transition-colors"
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
          <div className="md:hidden py-4 border-t border-gray-300 dark:border-gray-600">
            <div className="flex flex-col space-y-2">
              <Link
                href="/home"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/issues"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Issues
              </Link>
              <Link
                href="/report"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Report
              </Link>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <Link
                  href="/login"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-500 dark:to-purple-500 text-white hover:shadow-lg px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 mt-2"
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
