"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import { Issue } from '../../../types/database';
import { apiClient, isApiSuccess } from '../../../lib/api-client';

export default function IssueDetailPage() {
    const params = useParams();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const issueId = parseInt(params.id as string);
                if (isNaN(issueId)) {
                    setError('Invalid issue ID');
                    setLoading(false);
                    return;
                }

                const response = await apiClient.getIssueById(issueId);

                if (isApiSuccess(response)) {
                    setIssue(response.data);
                } else {
                    setError(response.error || 'Failed to load issue');
                }
            } catch (err) {
                setError('Failed to load issue details');
                console.error('Error fetching issue:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssue();
    }, [params.id]);

    const handleUpvote = async () => {
        if (!issue) return;

        try {
            const response = await apiClient.upvoteIssue(issue.id);
            if (isApiSuccess(response)) {
                setHasUpvoted(true);
                // Refresh the issue data to get updated upvote count
                const updatedResponse = await apiClient.getIssueById(issue.id);
                if (isApiSuccess(updatedResponse)) {
                    setIssue(updatedResponse.data);
                }
            }
        } catch (err) {
            console.error('Failed to upvote issue:', err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-electric-coral/10 text-electric-coral border-electric-coral/20';
            case 'in-progress':
                return 'bg-sky-blue/10 text-sky-blue border-sky-blue/20';
            case 'resolved':
                return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'closed':
                return 'bg-gray-100/50 text-black border-gray-300/20';
            default:
                return 'bg-gray-100/50 text-black border-gray-300/20';
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-twilight-bg via-pearl-white/50 to-lavender-mist/30">
                <Header />
                <div className="flex items-center justify-center min-h-screen mobile-padding">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-coral mx-auto mb-4"></div>
                        <p className="text-gray-700">Loading issue details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-black mb-2">
                            Issue Not Found
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            {error || 'The issue you are looking for could not be found.'}
                        </p>
                        <Link
                            href="/issues"
                            className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300"
                        >
                            Back to Issues
                        </Link>
                    </div>
                </div>
            </div>
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

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href="/issues"
                        className="flex items-center gap-2 text-gray-700 dark:text-black hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Issues
                    </Link>
                </div>

                {/* Issue Header */}
                <div className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-black">
                                    {issue.title}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status?.name || 'open')}`}>
                                    {issue.status?.name || 'Open'}
                                </span>
                            </div>

                            <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
                                {issue.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-black">Category:</span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {issue.category?.name || 'Unknown'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-black">Reported by:</span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {issue.reporter?.user_name || 'Anonymous'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-black">Date:</span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {formatDate(issue.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-black">Location:</span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {issue.address || issue.location_description || 'Location not specified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleUpvote}
                                disabled={hasUpvoted}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${hasUpvoted
                                    ? 'bg-green-500 text-black cursor-not-allowed'
                                    : 'bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-black hover:shadow-neon'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                {hasUpvoted ? 'Upvoted' : 'Upvote'}
                            </button>

                            <Link
                                href="/report"
                                className="px-6 py-3 rounded-xl border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green hover:shadow-neon transition-all duration-300 text-center font-semibold"
                            >
                                Report Similar Issue
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Photos Section */}
                {issue.photos && issue.photos.length > 0 && (
                    <div className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover mb-8">
                        <h3 className="text-xl font-semibold text-charcoal-text dark:text-black mb-4">Photos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {issue.photos.map((photo) => (
                                <div key={photo.id} className="aspect-video rounded-xl overflow-hidden">
                                    <img
                                        src={photo.photo_url}
                                        alt={`Issue photo ${photo.photo_order}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status History */}
                {issue.status_history && issue.status_history.length > 0 && (
                    <div className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover mb-8">
                        <h3 className="text-xl font-semibold text-charcoal-text dark:text-black mb-4">Status History</h3>
                        <div className="space-y-4">
                            {issue.status_history.map((log) => (
                                <div key={log.id} className="flex items-start gap-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-charcoal-text dark:text-black">
                                                {log.new_status?.name || 'Status Updated'}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {formatDate(log.changed_at)}
                                            </span>
                                        </div>
                                        {log.notes && (
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                {log.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
