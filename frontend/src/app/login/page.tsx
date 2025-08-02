'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-xl font-bold">CivicTrack</h1>
          <Link 
            href="/" 
            className="text-green-400 border border-green-400 px-4 py-2 rounded-full hover:bg-green-400 hover:text-black transition-colors"
          >
            Home
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-green-400 text-center text-lg font-semibold mb-8">
            Just Coders
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-white text-sm mb-2">
                User Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-white text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                required
              />
            </div>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-green-400 hover:underline">
                  Register here
                </Link>
              </span>
            </div>

            {/* Login Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-400 text-black font-semibold px-8 py-2 rounded-full hover:bg-green-300 transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
