"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import { apiClient, isApiSuccess } from '@/lib/api-client';
import { AnalyticsSummary } from '@/types/database';

export default function HomePage() {
    const [stats, setStats] = useState<AnalyticsSummary>({
        totalIssues: 0,
        resolvedIssues: 0,
        pendingIssues: 0,
        totalUsers: 0,
        activeUsers: 0,
        popularCategories: [],
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getAnalyticsSummary();

                if (isApiSuccess(response)) {
                    setStats(response.data);
                } else {
                    setError(response.error || 'Failed to load analytics');
                }
            } catch (err) {
                setError('Failed to load analytics data');
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };

        if (mounted) {
            fetchAnalytics();
        }
    }, [mounted]);

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
        <div className="min-h-screen bg-gradient-to-br from-twilight-bg via-pearl-white/50 to-lavender-mist/30">
            <Header />

            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-electric-coral/20 to-sky-blue/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-sky-blue/20 to-lavender-mist/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 mobile-padding tablet-padding">
                <div className="text-center">
                    <div className="animate-slide-up">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 mobile-hero tablet-hero">
                            <span className="gradient-text-charcoal">
                                Make Your City
                            </span>
                            <br />
                            <span className="gradient-text-electric animate-glow">
                                Smarter Together
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed mobile-hero-sub">
                            Experience the future of civic engagement with our AI-powered platform that connects citizens, tracks issues in real-time, and transforms communities through collaborative innovation.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up mobile-stack" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/issues"
                            className="group btn-secondary px-10 py-5 rounded-2xl text-lg font-semibold hover:scale-105 hover:-translate-y-1 mobile-button"
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
                            className="group btn-modern px-10 py-5 rounded-2xl text-lg font-semibold hover:scale-105 hover:-translate-y-1 mobile-button"
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
                    <div className="card-modern p-8 md:p-12">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                                <p className="text-text-secondary">Loading analytics...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="glass-surface border border-accent-primary text-accent-primary px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="text-center group hover-float">
                                    <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                        {stats.totalIssues.toLocaleString()}
                                    </div>
                                    <div className="text-text-secondary font-medium">Issues Tracked</div>
                                </div>
                                <div className="text-center group hover-float" style={{ animationDelay: '0.1s' }}>
                                    <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                        {stats.resolvedIssues.toLocaleString()}
                                    </div>
                                    <div className="text-text-secondary font-medium">Issues Resolved</div>
                                </div>
                                <div className="text-center group hover-float" style={{ animationDelay: '0.2s' }}>
                                    <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                        {stats.activeUsers.toLocaleString()}
                                    </div>
                                    <div className="text-text-secondary font-medium">Active Users</div>
                                </div>
                                <div className="text-center group hover-float" style={{ animationDelay: '0.3s' }}>
                                    <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                        {stats.pendingIssues.toLocaleString()}
                                    </div>
                                    <div className="text-text-secondary font-medium">Pending Issues</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-padding tablet-padding">
                    <div className="text-center mb-20 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6 mobile-hero">
                            AI-Powered Civic Innovation
                        </h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mobile-hero-sub">
                            Experience next-generation civic engagement through intelligent automation, real-time analytics, and seamless community collaboration.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mobile-grid-1 tablet-grid-2 desktop-grid-3">
                        {/* Feature 1 */}
                        <div className="group card-modern p-8 hover:border-accent-primary transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-electric-coral to-sky-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">Smart Issue Detection</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Advanced AI algorithms automatically categorize and prioritize issues, ensuring faster response times and optimal resource allocation for your community.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group card-modern p-8 hover:border-accent-secondary transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
                            <div className="w-16 h-16 bg-gradient-to-r from-sky-blue to-lavender-mist rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">Real-Time Analytics</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Comprehensive dashboards provide instant insights into issue patterns, response times, and community engagement metrics for data-driven decision making.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group card-modern p-8 hover:border-accent-tertiary transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
                            <div className="w-16 h-16 bg-gradient-to-r from-lavender-mist to-electric-coral rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">Community Collaboration</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Foster meaningful connections between citizens and authorities through transparent communication channels and collaborative problem-solving workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-padding tablet-padding">
                    <div className="text-center mb-20 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6 mobile-hero">
                            Smart City Categories
                        </h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mobile-hero-sub">
                            Explore our comprehensive range of AI-powered solutions designed to transform urban infrastructure and enhance citizen quality of life.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mobile-grid-1 tablet-grid-2 desktop-grid-3">
                        {categories.map((category, index) => (
                            <div key={category.name} className="group card-modern p-8 hover:border-accent-primary transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h3 className="text-2xl font-bold text-text-primary mb-3">{category.name}</h3>
                                <p className="text-text-secondary leading-relaxed mb-6">{category.description}</p>
                                <div className={`w-full h-2 bg-gradient-to-r ${category.gradient} rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-padding tablet-padding">
                    <div className="card-modern p-12 text-center mobile-padding tablet-padding">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6 mobile-hero">
                            Ready to Transform Your City?
                        </h2>
                        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto mobile-hero-sub">
                            Join thousands of citizens already making a difference in their communities through intelligent civic engagement.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mobile-stack">
                            <Link
                                href="/signup"
                                className="btn-modern px-10 py-4 text-lg font-semibold hover:scale-105 mobile-button"
                            >
                                Get Started Today
                            </Link>
                            <Link
                                href="/issues"
                                className="btn-secondary px-10 py-4 rounded-2xl text-lg font-semibold hover:scale-105 mobile-button"
                            >
                                Explore Issues
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
