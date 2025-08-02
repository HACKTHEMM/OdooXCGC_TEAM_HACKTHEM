'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
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
          <Link
            href="/"
            className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-4 py-2 rounded-xl hover:shadow-neon transition-all duration-300 font-medium"
          >
            Home
          </Link>
        </div>

        {/* Registration Form */}
        <div className="glass-surface rounded-2xl p-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent mb-2">
              Join CivicTracker
            </h2>
            <p className="text-slate-gray dark:text-soft-gray">
              Create your account and start making a difference
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-charcoal dark:text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                placeholder="Choose a username"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-charcoal dark:text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-charcoal dark:text-white text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-charcoal dark:text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-charcoal dark:text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white py-3 rounded-xl font-semibold hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105"
              >
                Create Account
              </button>

              {/* Terms */}
              <p className="text-xs text-slate-gray dark:text-soft-gray text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-bright-blue dark:text-neon-green hover:text-vibrant-pink dark:hover:text-iridescent-purple transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-bright-blue dark:text-neon-green hover:text-vibrant-pink dark:hover:text-iridescent-purple transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-glass-light-hover dark:border-glass-dark-hover">
              <p className="text-slate-gray dark:text-soft-gray mb-2">Already have an account?</p>
              <Link
                href="/login"
                className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-6 py-2 rounded-xl hover:shadow-neon transition-all duration-300 font-medium inline-block"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
