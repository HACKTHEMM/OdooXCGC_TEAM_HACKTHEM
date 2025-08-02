"use client"

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';

export default function HomePage() {
    const [stats] = useState({
        totalIssues: 1248,
        resolvedIssues: 892,
        activeUsers: 3420,
        responseTime: 24
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Header />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Make Your City Better
                        <span className="block text-blue-600">One Issue at a Time</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        CivicTracker empowers citizens to report municipal issues, track their resolution,
                        and collaborate with local authorities to build better communities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/issues"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Browse Issues
                        </Link>
                        <Link
                            href="/report"
                            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Report an Issue
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                {stats.totalIssues.toLocaleString()}
                            </div>
                            <div className="text-gray-600">Issues Reported</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                                {stats.resolvedIssues.toLocaleString()}
                            </div>
                            <div className="text-gray-600">Issues Resolved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                                {stats.activeUsers.toLocaleString()}
                            </div>
                            <div className="text-gray-600">Active Citizens</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                                {stats.responseTime}h
                            </div>
                            <div className="text-gray-600">Avg. Response Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How CivicTracker Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple, transparent, and effective civic engagement for everyone
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Report Issues</h3>
                            <p className="text-gray-600">
                                Easily report municipal issues like potholes, broken streetlights, or water problems
                                with photos and location details.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Progress</h3>
                            <p className="text-gray-600">
                                Monitor the status of your reported issues in real-time and receive updates
                                as authorities work to resolve them.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Impact</h3>
                            <p className="text-gray-600">
                                Join a community of engaged citizens working together to improve local
                                infrastructure and quality of life.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Issue Categories */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Can You Report?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Help improve your community by reporting various municipal issues
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: 'Roads', icon: '🛣️', description: 'Potholes, cracks, barriers' },
                            { name: 'Lighting', icon: '💡', description: 'Street lights, signals' },
                            { name: 'Water Supply', icon: '💧', description: 'Leaks, shortages, quality' },
                            { name: 'Cleanliness', icon: '🧹', description: 'Garbage, sanitation' },
                            { name: 'Public Safety', icon: '🚨', description: 'Security, hazards' },
                            { name: 'Obstructions', icon: '🚧', description: 'Blocked paths, illegal parking' }
                        ].map((category, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                                <div className="text-3xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of citizens who are actively working to improve their communities.
                        Your voice matters, and every report counts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Get Started Today
                        </Link>
                        <Link
                            href="/issues"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Explore Issues
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">CivicTracker</h3>
                            <p className="text-gray-400">
                                Empowering citizens to build better communities through transparent
                                issue reporting and tracking.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/issues" className="hover:text-white">Browse Issues</Link></li>
                                <li><Link href="/report" className="hover:text-white">Report Issue</Link></li>
                                <li><Link href="/map" className="hover:text-white">Issue Map</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Account</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/login" className="hover:text-white">Login</Link></li>
                                <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 CivicTracker. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
