'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
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
    // Handle registration logic here
    console.log('Registration attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-xl font-bold mb-2">User Registration Page</h1>
          <h2 className="text-white text-lg">Screen 3</h2>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-white text-center text-lg font-bold mb-8">
            CivicTrack
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

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-white text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-white text-sm mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
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

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-green-400 hover:underline">
                  Login
                </Link>
              </span>
            </div>

            {/* Register Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-400 text-black font-semibold px-8 py-2 rounded-full hover:bg-green-300 transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
