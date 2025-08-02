"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import { apiClient, isApiSuccess } from '@/lib/api-client';
import { Issue, IssueFilters, PaginatedResponse } from '@/types/database';

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.getCategories();
                if (isApiSuccess(response)) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    // Fetch issues with filters
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setLoading(true);
                setError(null);

                const filters: IssueFilters = {};
                if (selectedCategory !== 'all') {
                    filters.category_id = parseInt(selectedCategory);
                }
                if (selectedStatus !== 'all') {
                    filters.status_id = parseInt(selectedStatus);
                }
                if (searchQuery.trim()) {
                    filters.search_term = searchQuery.trim();
                }

                const response = await apiClient.getIssues(filters, currentPage, 10);
                
                if (isApiSuccess(response)) {
                    setIssues(response.data.data);
                    setFilteredIssues(response.data.data);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError(response.error || 'Failed to load issues');
                }
            } catch (err) {
                setError('Failed to load issues');
                console.error('Error fetching issues:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, [selectedCategory, selectedStatus, searchQuery, currentPage]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 text-white';
            case 'high':
                return 'bg-orange-500 text-white';
            case 'medium':
                return 'bg-yellow-500 text-white';
            case 'low':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const handleUpvote = async (issueId: number) => {
        try {
            await apiClient.upvoteIssue(issueId);
            // Refresh the issues list
            window.location.reload();
        } catch (err) {
            console.error('Failed to upvote issue:', err);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                        Community Issues
                    </h1>
                    <p className="text-xl text-text-secondary">
                        Track and monitor issues reported by your community
                    </p>
                </div>

                {/* Filters */}
                <div className="card-modern p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-modern w-full"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-modern w-full"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="input-modern w-full"
                            >
                                <option value="all">All Status</option>
                                <option value="1">Open</option>
                                <option value="2">In Progress</option>
                                <option value="3">Resolved</option>
                                <option value="4">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Issues List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                        <p className="text-text-secondary">Loading issues...</p>
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
                    <div className="space-y-6">
                        {filteredIssues.map((issue) => (
                            <div key={issue.id} className="card-modern p-6 hover:border-accent-primary transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-text-primary">
                                                {issue.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status?.name || 'open')}`}>
                                                {issue.status?.name || 'Open'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor('medium')}`}>
                                                Medium
                                            </span>
                                        </div>
                                        <p className="text-text-secondary mb-3">
                                            {issue.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                                            <span>📍 {issue.address || 'Location not specified'}</span>
                                            <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>
                                            <span>👤 {issue.reporter?.user_name || 'Anonymous'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => handleUpvote(issue.id)}
                                            className="flex flex-col items-center p-2 rounded-lg hover:bg-glass-bg transition-colors"
                                        >
                                            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            <span className="text-sm text-text-secondary">0</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {issue.photos && issue.photos.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {issue.photos.slice(0, 3).map((photo, index) => (
                                            <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                                                <img
                                                    src={photo.photo_url}
                                                    alt={`Issue photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-text-secondary">
                                            Category: {issue.category?.name || 'Unknown'}
                                        </span>
                                        {issue.resolved_at && (
                                            <span className="text-sm text-green-600 dark:text-green-400">
                                                Resolved: {new Date(issue.resolved_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/issues/${issue.id}`}
                                        className="text-accent-primary hover:text-accent-secondary font-medium transition-colors"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                        currentPage === page
                                            ? 'bg-accent-primary text-white'
                                            : 'glass-surface border border-glass-border text-text-primary hover:border-accent-primary'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredIssues.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">No Issues Found</h3>
                        <p className="text-text-secondary mb-6">
                            No issues match your current filters. Try adjusting your search criteria.
                        </p>
                        <Link
                            href="/report"
                            className="btn-modern px-8 py-3 rounded-xl font-semibold hover:scale-105"
                        >
                            Report New Issue
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
