"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';

export default function HomePage() {
    const [stats] = useState({
        totalIssues: 1248,
        resolvedIssues: 892,
        activeUsers: 3420,
        responseTime: 24
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const categories = [
        { name: 'Smart Roads', icon: '🛣️', description: 'AI-monitored infrastructure', gradient: 'from-bright-blue to-vibrant-pink' },
        { name: 'IoT Lighting', icon: '💡', description: 'Connected street systems', gradient: 'from-neon-green to-iridescent-purple' },
        { name: 'Water Analytics', icon: '💧', description: 'Real-time quality tracking', gradient: 'from-vibrant-pink to-bright-blue' },
        { name: 'Clean Tech', icon: '🧹', description: 'Automated waste management', gradient: 'from-iridescent-purple to-neon-green' },
        { name: 'Safety AI', icon: '🚨', description: 'Predictive security systems', gradient: 'from-bright-blue to-vibrant-pink' },
        { name: 'Traffic Flow', icon: '🚧', description: 'Dynamic routing optimization', gradient: 'from-neon-green to-iridescent-purple' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
            <Header />

            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                <div className="text-center">
                    <div className="animate-slide-up">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent">
                                Make Your City
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-bright-blue via-vibrant-pink to-bright-blue dark:from-neon-green dark:via-iridescent-purple dark:to-neon-green bg-clip-text text-transparent animate-glow">
                                Smarter Together
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-gray dark:text-soft-gray mb-12 max-w-4xl mx-auto leading-relaxed">
                            Experience the future of civic engagement with our AI-powered platform that connects citizens, tracks issues in real-time, and transforms communities through collaborative innovation.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/issues"
                            className="group glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-neon dark:hover:shadow-neon transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                        >
                            <span className="flex items-center gap-3">
                                Explore Issues
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            href="/report"
                            className="group bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Report Issue
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-surface rounded-3xl p-8 md:p-12 border border-glass-light-hover dark:border-glass-dark-hover">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center group hover-float">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple bg-clip-text text-transparent mb-3">
                                    {stats.totalIssues.toLocaleString()}
                                </div>
                                <div className="text-slate-gray dark:text-soft-gray font-medium">Issues Tracked</div>
                            </div>
                            <div className="text-center group hover-float" style={{ animationDelay: '0.1s' }}>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-green to-bright-blue dark:from-iridescent-purple dark:to-neon-green bg-clip-text text-transparent mb-3">
                                    {stats.resolvedIssues.toLocaleString()}
                                </div>
                                <div className="text-slate-gray dark:text-soft-gray font-medium">Solutions Delivered</div>
                            </div>
                            <div className="text-center group hover-float" style={{ animationDelay: '0.2s' }}>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-vibrant-pink to-iridescent-purple dark:from-neon-green dark:to-bright-blue bg-clip-text text-transparent mb-3">
                                    {stats.activeUsers.toLocaleString()}
                                </div>
                                <div className="text-slate-gray dark:text-soft-gray font-medium">Active Citizens</div>
                            </div>
                            <div className="text-center group hover-float" style={{ animationDelay: '0.3s' }}>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-iridescent-purple to-bright-blue dark:from-vibrant-pink dark:to-neon-green bg-clip-text text-transparent mb-3">
                                    {stats.responseTime}h
                                </div>
                                <div className="text-slate-gray dark:text-soft-gray font-medium">Response Time</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent mb-6">
                            AI-Powered Civic Innovation
                        </h2>
                        <p className="text-xl text-slate-gray dark:text-soft-gray max-w-3xl mx-auto leading-relaxed">
                            Experience next-generation civic engagement through intelligent automation, real-time analytics, and seamless community collaboration.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group glass-surface rounded-2xl p-8 hover:border-bright-blue dark:hover:border-neon-green transition-all duration-300 hover:-translate-y-2 hover:shadow-glass-light dark:hover:shadow-glass-dark">
                            <div className="w-16 h-16 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Smart Issue Detection</h3>
                            <p className="text-slate-gray dark:text-soft-gray leading-relaxed">
                                Advanced AI algorithms automatically categorize and prioritize issues, ensuring faster response times and optimal resource allocation for your community.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group glass-surface rounded-2xl p-8 hover:border-vibrant-pink dark:hover:border-iridescent-purple transition-all duration-300 hover:-translate-y-2 hover:shadow-glass-light dark:hover:shadow-glass-dark" style={{ animationDelay: '0.1s' }}>
                            <div className="w-16 h-16 bg-gradient-to-r from-vibrant-pink to-bright-blue dark:from-iridescent-purple dark:to-neon-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Real-Time Analytics</h3>
                            <p className="text-slate-gray dark:text-soft-gray leading-relaxed">
                                Live dashboards and predictive analytics provide actionable insights, enabling data-driven decisions for more effective civic management.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group glass-surface rounded-2xl p-8 hover:border-bright-blue dark:hover:border-neon-green transition-all duration-300 hover:-translate-y-2 hover:shadow-glass-light dark:hover:shadow-glass-dark" style={{ animationDelay: '0.2s' }}>
                            <div className="w-16 h-16 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Community Connect</h3>
                            <p className="text-slate-gray dark:text-soft-gray leading-relaxed">
                                Seamless collaboration between citizens and authorities through instant notifications, progress tracking, and transparent communication channels.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent mb-6">
                            Smart City Categories
                        </h2>
                        <p className="text-xl text-slate-gray dark:text-soft-gray">
                            Report and track intelligent infrastructure across all city systems
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="group glass-surface rounded-2xl p-6 text-center hover:border-bright-blue dark:hover:border-neon-green transition-all duration-300 hover:-translate-y-1 interactive-scale"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                                <h3 className="text-lg font-bold text-charcoal dark:text-white mb-2">{category.name}</h3>
                                <p className="text-sm text-slate-gray dark:text-soft-gray mb-4">{category.description}</p>
                                <div className={`h-1 bg-gradient-to-r ${category.gradient} dark:${category.gradient} rounded-full opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass-surface rounded-3xl p-12 border border-glass-light-hover dark:border-glass-dark-hover">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-bright-blue via-vibrant-pink to-bright-blue dark:from-neon-green dark:via-iridescent-purple dark:to-neon-green bg-clip-text text-transparent mb-6">
                            Ready to Transform Your City?
                        </h2>
                        <p className="text-xl text-slate-gray dark:text-soft-gray mb-10 max-w-2xl mx-auto">
                            Join thousands of citizens already building smarter, more connected communities through intelligent civic engagement.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="group bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105"
                            >
                                Start Reporting Today
                            </Link>
                            <Link
                                href="/issues"
                                className="group glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-neon transition-all duration-300 hover:scale-105"
                            >
                                Explore Platform
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-surface rounded-2xl p-8 border border-glass-light-hover dark:border-glass-dark-hover">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <Link href="/" className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple bg-clip-text text-transparent">
                                        CivicTracker
                                    </span>
                                </Link>
                                <p className="text-slate-gray dark:text-soft-gray mb-4 max-w-md">
                                    Building smarter communities through AI-powered civic engagement and real-time collaboration between citizens and authorities.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-charcoal dark:text-white mb-4">Platform</h3>
                                <ul className="space-y-2 text-slate-gray dark:text-soft-gray">
                                    <li><Link href="/issues" className="hover:text-bright-blue dark:hover:text-neon-green transition-colors">Browse Issues</Link></li>
                                    <li><Link href="/report" className="hover:text-bright-blue dark:hover:text-neon-green transition-colors">Report Issue</Link></li>
                                    <li><Link href="/analytics" className="hover:text-bright-blue dark:hover:text-neon-green transition-colors">Analytics</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-charcoal dark:text-white mb-4">Support</h3>
                                <ul className="space-y-2 text-slate-gray dark:text-soft-gray">
                                    <li><Link href="/help" className="hover:text-bright-blue dark:hover:text-neon-green transition-colors">Help Center</Link></li>
                                    <li><Link href="/contact" className="hover:text-bright-blue dark:hover:text-neon-green transition-colors">Contact Us</Link></li>
                                    <li><Link href="/privacy" className="hover:text-bright-blue dark:hover:text-neon-green transition-colors">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-glass-light-hover dark:border-glass-dark-hover mt-8 pt-6 text-center text-slate-gray dark:text-soft-gray">
                            <p>&copy; 2024 CivicTracker. Building the future of civic engagement.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
