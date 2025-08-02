'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
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

        {/* Login Form */}
        <div className="glass-surface rounded-2xl p-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-gray dark:text-soft-gray">
              Sign in to continue making a difference
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-bright-blue dark:text-neon-green bg-glass-light dark:bg-glass-dark border-glass-light-hover dark:border-glass-dark-hover rounded focus:ring-bright-blue dark:focus:ring-neon-green focus:ring-2 transition-all duration-300"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-gray dark:text-soft-gray">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-bright-blue dark:text-neon-green hover:text-vibrant-pink dark:hover:text-iridescent-purple transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white py-3 rounded-xl font-semibold hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-glass-light-hover dark:border-glass-dark-hover"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 glass-surface text-slate-gray dark:text-soft-gray">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="glass-surface border border-glass-light-hover dark:border-glass-dark-hover text-charcoal dark:text-white py-2 px-4 rounded-xl hover:shadow-neon transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="glass-surface border border-glass-light-hover dark:border-glass-dark-hover text-charcoal dark:text-white py-2 px-4 rounded-xl hover:shadow-neon transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-glass-light-hover dark:border-glass-dark-hover">
              <p className="text-slate-gray dark:text-soft-gray mb-2">Don&apos;t have an account?</p>
              <Link
                href="/signup"
                className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-6 py-2 rounded-xl hover:shadow-neon transition-all duration-300 font-medium inline-block"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
