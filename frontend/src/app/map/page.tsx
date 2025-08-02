'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { apiClient, isApiSuccess } from '@/lib/api-client';
import { Issue } from '@/types/database';

export default function MapPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    useEffect(() => {
        const fetchMapIssues = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiClient.getMapIssues();
                
                if (isApiSuccess(response)) {
                    setIssues(response.data);
                } else {
                    setError(response.error || 'Failed to load map issues');
                }
            } catch (err) {
                setError('Failed to load map data');
                console.error('Error fetching map issues:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMapIssues();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-red-500';
            case 'in-progress':
                return 'bg-yellow-500';
            case 'resolved':
                return 'bg-green-500';
            case 'closed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'border-red-500';
            case 'high':
                return 'border-orange-500';
            case 'medium':
                return 'border-yellow-500';
            case 'low':
                return 'border-green-500';
            default:
                return 'border-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
            <Header />

            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-4">
                        Issues Map
                    </h1>
                    <p className="text-xl text-text-secondary">
                        View all reported issues on an interactive map
                    </p>
                </div>

                {/* Map Container */}
                <div className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover mb-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bright-blue mx-auto mb-4"></div>
                            <p className="text-slate-gray dark:text-soft-gray">Loading map data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Map Placeholder */}
                            <div className="lg:col-span-2">
                                <div className="bg-gradient-to-br from-bright-blue/10 to-vibrant-pink/10 dark:from-neon-green/10 dark:to-iridescent-purple/10 rounded-xl p-8 border-2 border-dashed border-bright-blue/30 dark:border-neon-green/30">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-2">
                                            Interactive Map
                                        </h3>
                                        <p className="text-slate-gray dark:text-soft-gray mb-4">
                                            Map integration coming soon. For now, view issues in the list below.
                                        </p>
                                        <div className="text-sm text-slate-gray dark:text-soft-gray">
                                            {issues.length} issues found in your area
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Issues List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">
                                    Nearby Issues
                                </h3>
                                {issues.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-gray dark:text-soft-gray">No issues found nearby</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {issues.slice(0, 10).map((issue) => (
                                            <div
                                                key={issue.id}
                                                onClick={() => setSelectedIssue(issue)}
                                                className={`glass-surface rounded-xl p-4 border cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                                    selectedIssue?.id === issue.id 
                                                        ? 'border-bright-blue dark:border-neon-green shadow-neon' 
                                                        : 'border-glass-light-hover dark:border-glass-dark-hover'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(issue.status?.name || 'open')}`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-charcoal dark:text-white truncate">
                                                            {issue.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-gray dark:text-soft-gray line-clamp-2 mt-1">
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-gray dark:text-soft-gray">
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {issue.address || 'Location'}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected Issue Details */}
                {selectedIssue && (
                    <div className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-charcoal dark:text-white">
                                Issue Details
                            </h3>
                            <button
                                onClick={() => setSelectedIssue(null)}
                                className="text-slate-gray dark:text-soft-gray hover:text-charcoal dark:hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-charcoal dark:text-white mb-2">
                                    {selectedIssue.title}
                                </h4>
                                <p className="text-slate-gray dark:text-soft-gray mb-4">
                                    {selectedIssue.description}
                                </p>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-charcoal dark:text-white">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedIssue.status?.name || 'open')}`}>
                                            {selectedIssue.status?.name || 'Open'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-charcoal dark:text-white">Category:</span>
                                        <span className="text-slate-gray dark:text-soft-gray">
                                            {selectedIssue.category?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-charcoal dark:text-white">Reported by:</span>
                                        <span className="text-slate-gray dark:text-soft-gray">
                                            {selectedIssue.reporter?.user_name || 'Anonymous'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-charcoal dark:text-white">Date:</span>
                                        <span className="text-slate-gray dark:text-soft-gray">
                                            {new Date(selectedIssue.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-charcoal dark:text-white mb-2">Location</h4>
                                <div className="bg-gradient-to-br from-bright-blue/10 to-vibrant-pink/10 dark:from-neon-green/10 dark:to-iridescent-purple/10 rounded-xl p-4 border border-glass-light-hover dark:border-glass-dark-hover">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-slate-gray dark:text-soft-gray">
                                            {selectedIssue.address || selectedIssue.location_description || 'Location not specified'}
                                        </p>
                                        <p className="text-xs text-slate-gray dark:text-soft-gray mt-1">
                                            Coordinates: {selectedIssue.latitude.toFixed(4)}, {selectedIssue.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mt-6">
                            <button className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white hover:shadow-neon transition-all duration-300">
                                View Full Details
                            </button>
                            <button className="px-4 py-2 rounded-xl border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green hover:shadow-neon transition-all duration-300">
                                Report Similar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 