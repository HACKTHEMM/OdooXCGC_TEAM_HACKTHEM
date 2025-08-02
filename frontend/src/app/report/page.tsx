'use client';

import { useState } from 'react';
import Header from '../../components/header';
import ReportIssueForm from '../../components/report-issue-form';
import { CreateIssueForm } from '../../types/database';
import { apiClient, isApiSuccess, formatApiError } from '../../lib/api-client';

export default function ReportPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSubmitIssue = async (issueData: CreateIssueForm) => {
        try {
            const response = await apiClient.createIssue(issueData);
            
            if (isApiSuccess(response)) {
                // Show success message
                alert('Issue submitted successfully!');
                setIsFormVisible(false);
                
                // Optionally redirect to the new issue page
                // window.location.href = `/issues/${response.data.id}`;
            } else {
                throw new Error(response.error || 'Failed to submit issue');
            }
        } catch (error) {
            console.error('Failed to submit issue:', error);
            alert(formatApiError(error instanceof Error ? error.message : 'Failed to submit issue'));
        }
    };

    if (isFormVisible) {
        return (
            <ReportIssueForm
                onSubmit={handleSubmitIssue}
                onCancel={() => setIsFormVisible(false)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
            <Header />

            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <div className="animate-slide-up">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8">
                            <span className="gradient-text-charcoal">
                                Report a
                            </span>
                            <br />
                            <span className="gradient-text-accent animate-glow">
                                Community Issue
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed">
                            Help make your city smarter by reporting issues that matter. Our AI-powered platform ensures your voice is heard and problems get solved faster.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="group btn-modern px-12 py-6 rounded-2xl text-xl font-semibold hover:scale-105 hover:-translate-y-1"
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Start Reporting
                            </span>
                        </button>
                        <button className="group glass-surface border border-accent-primary text-accent-primary px-12 py-6 rounded-2xl text-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                            <span className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Learn How
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6">
                            Why Report With Us?
                        </h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                            Advanced AI technology ensures your reports reach the right authorities and get resolved efficiently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group card-modern p-8 hover:border-accent-primary transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">Instant AI Processing</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Our AI automatically categorizes your report, determines priority, and routes it to the appropriate department for immediate action.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group card-modern p-8 hover:border-accent-secondary transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
                            <div className="w-16 h-16 bg-gradient-to-r from-vibrant-pink to-bright-blue dark:from-iridescent-purple dark:to-neon-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">Smart Location Tracking</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Precise GPS integration with visual mapping ensures your issue is reported at the exact location, speeding up response times.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group card-modern p-8 hover:border-accent-primary transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
                            <div className="w-16 h-16 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm0 10h6l-6 6v-6zm6-10h5l-5-5v5z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">Real-Time Updates</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Track your report&apos;s progress with live updates, from initial review to final resolution, keeping you informed every step of the way.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6">
                            Report Categories
                        </h2>
                        <p className="text-xl text-text-secondary">
                            Choose from our comprehensive list of municipal issue categories
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Smart Roads', icon: '🛣️', description: 'Potholes, traffic signals, road maintenance', gradient: 'from-bright-blue to-vibrant-pink' },
                            { name: 'IoT Lighting', icon: '💡', description: 'Street lights, public area illumination', gradient: 'from-neon-green to-iridescent-purple' },
                            { name: 'Water Systems', icon: '💧', description: 'Pipe leaks, water quality, supply issues', gradient: 'from-vibrant-pink to-bright-blue' },
                            { name: 'Clean Tech', icon: '🧹', description: 'Waste management, recycling, sanitation', gradient: 'from-iridescent-purple to-neon-green' },
                            { name: 'Public Safety', icon: '🚨', description: 'Security concerns, emergency situations', gradient: 'from-bright-blue to-vibrant-pink' },
                            { name: 'Obstructions', icon: '🚧', description: 'Blocked paths, damaged infrastructure', gradient: 'from-neon-green to-iridescent-purple' }
                        ].map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setIsFormVisible(true)}
                                className="group card-modern p-6 text-center hover:border-accent-primary transition-all duration-300 hover:-translate-y-1 interactive-scale"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                                <h3 className="text-lg font-bold text-text-primary mb-2">{category.name}</h3>
                                <p className="text-sm text-text-secondary mb-4">{category.description}</p>
                                <div className={`h-1 bg-gradient-to-r ${category.gradient} rounded-full opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-modern p-8 md:p-12">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6">
                                Community Impact
                            </h2>
                            <p className="text-xl text-text-secondary">
                                See how reporting makes a real difference in our community
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center group hover-float">
                                <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                    1,248
                                </div>
                                <div className="text-text-secondary font-medium">Issues Reported</div>
                            </div>
                            <div className="text-center group hover-float" style={{ animationDelay: '0.1s' }}>
                                <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                    892
                                </div>
                                <div className="text-text-secondary font-medium">Successfully Resolved</div>
                            </div>
                            <div className="text-center group hover-float" style={{ animationDelay: '0.2s' }}>
                                <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                    24h
                                </div>
                                <div className="text-text-secondary font-medium">Average Response</div>
                            </div>
                            <div className="text-center group hover-float" style={{ animationDelay: '0.3s' }}>
                                <div className="text-4xl md:text-5xl font-bold gradient-text-accent mb-3">
                                    3,420
                                </div>
                                <div className="text-text-secondary font-medium">Active Citizens</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="card-modern p-12">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-6">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                            Your report could be the catalyst for positive change in your community. Start reporting today and be part of the solution.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setIsFormVisible(true)}
                                className="group btn-modern px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105"
                            >
                                Report Your First Issue
                            </button>
                            <button className="group glass-surface border border-accent-primary text-accent-primary px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                                View Previous Reports
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
