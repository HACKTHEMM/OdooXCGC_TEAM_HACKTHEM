"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import { Issue } from '../../../types/database';
import { apiClient, isApiSuccess } from '../../../lib/api-client';

interface Comment {
    id: number;
    author: string;
    date: string;
    message: string;
}

export default function IssueDetailPage() {
    const params = useParams();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [comments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submittingComment, setSubmittingComment] = useState(false);

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

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issue || !newComment.trim()) return;

        try {
            setSubmittingComment(true);
            const response = await apiClient.addComment(issue.id, newComment);

            if (isApiSuccess(response)) {
                setNewComment('');
                // Refresh the issue data to get updated comments
                const updatedResponse = await apiClient.getIssueById(issue.id);
                if (isApiSuccess(updatedResponse)) {
                    setIssue(updatedResponse.data);
                }
            } else {
                console.error('Failed to add comment:', response.error);
            }
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setSubmittingComment(false);
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
                return 'bg-muted-gray/10 text-muted-gray border-muted-gray/20';
            default:
                return 'bg-muted-gray/10 text-muted-gray border-muted-gray/20';
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
                        <p className="text-muted-gray">Loading issue details...</p>
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
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-2">
                            Issue Not Found
                        </h3>
                        <p className="text-slate-gray dark:text-soft-gray mb-6">
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
                        className="flex items-center gap-2 text-slate-gray dark:text-soft-gray hover:text-charcoal dark:hover:text-white transition-colors"
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
                                <h1 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white">
                                    {issue.title}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status?.name || 'open')}`}>
                                    {issue.status?.name || 'Open'}
                                </span>
                            </div>

                            <p className="text-lg text-slate-gray dark:text-soft-gray mb-6">
                                {issue.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-charcoal dark:text-white">Category:</span>
                                    <span className="text-slate-gray dark:text-soft-gray">
                                        {issue.category?.name || 'Unknown'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-charcoal dark:text-white">Reported by:</span>
                                    <span className="text-slate-gray dark:text-soft-gray">
                                        {issue.reporter?.user_name || 'Anonymous'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-charcoal dark:text-white">Date:</span>
                                    <span className="text-slate-gray dark:text-soft-gray">
                                        {formatDate(issue.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-charcoal dark:text-white">Location:</span>
                                    <span className="text-slate-gray dark:text-soft-gray">
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
                                        ? 'bg-green-500 text-white cursor-not-allowed'
                                        : 'bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white hover:shadow-neon'
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
                        <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-4">Photos</h3>
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
                        <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-4">Status History</h3>
                        <div className="space-y-4">
                            {issue.status_history.map((log) => (
                                <div key={log.id} className="flex items-start gap-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-charcoal dark:text-white">
                                                {log.new_status?.name || 'Status Updated'}
                                            </span>
                                            <span className="text-sm text-slate-gray dark:text-soft-gray">
                                                {formatDate(log.changed_at)}
                                            </span>
                                        </div>
                                        {log.notes && (
                                            <p className="text-slate-gray dark:text-soft-gray text-sm">
                                                {log.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover">
                    <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-4">Comments</h3>

                    {/* Add Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                        <div className="flex gap-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-3 rounded-xl border border-glass-light-hover dark:border-glass-dark-hover bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-bright-blue dark:focus:ring-neon-green text-charcoal dark:text-white resize-none"
                                rows={3}
                                disabled={submittingComment}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || submittingComment}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-slate-gray dark:text-soft-gray text-center py-8">
                                No comments yet. Be the first to comment!
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="border-b border-glass-light-hover dark:border-glass-dark-hover pb-4 last:border-b-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-charcoal dark:text-white">
                                            {comment.author}
                                        </span>
                                        <span className="text-sm text-slate-gray dark:text-soft-gray">
                                            {comment.date}
                                        </span>
                                    </div>
                                    <p className="text-slate-gray dark:text-soft-gray">
                                        {comment.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
