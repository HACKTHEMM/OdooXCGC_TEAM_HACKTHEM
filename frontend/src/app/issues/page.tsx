"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';

interface Issue {
    id: number;
    title: string;
    category: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    location: string;
    reportedBy: string;
    reportedDate: string;
    description: string;
    upvotes: number;
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - replace with actual API call
    useEffect(() => {
        const mockIssues: Issue[] = [
            {
                id: 1,
                title: "Large pothole on Main Street",
                category: "Roads",
                status: "open",
                priority: "high",
                location: "Main Street, Downtown",
                reportedBy: "John Doe",
                reportedDate: "2025-01-28",
                description: "Large pothole causing traffic issues and potential damage to vehicles",
                upvotes: 45
            },
            {
                id: 2,
                title: "Broken streetlight on Oak Avenue",
                category: "Lighting",
                status: "in-progress",
                priority: "medium",
                location: "Oak Avenue, Residential Area",
                reportedBy: "Jane Smith",
                reportedDate: "2025-01-25",
                description: "Streetlight has been flickering and now completely out",
                upvotes: 23
            },
            {
                id: 3,
                title: "Water leak at Central Park",
                category: "Water Supply",
                status: "resolved",
                priority: "urgent",
                location: "Central Park, City Center",
                reportedBy: "Mike Johnson",
                reportedDate: "2025-01-20",
                description: "Major water leak flooding the park pathway",
                upvotes: 67
            },
            {
                id: 4,
                title: "Overflowing trash bin at Bus Stop 12",
                category: "Cleanliness",
                status: "open",
                priority: "low",
                location: "Bus Stop 12, Market District",
                reportedBy: "Sarah Wilson",
                reportedDate: "2025-01-30",
                description: "Trash bin overflowing, attracting pests and creating unsanitary conditions",
                upvotes: 12
            },
            {
                id: 5,
                title: "Damaged fence around playground",
                category: "Public Safety",
                status: "in-progress",
                priority: "high",
                location: "Sunset Elementary School",
                reportedBy: "David Brown",
                reportedDate: "2025-01-22",
                description: "Playground fence has several broken sections posing safety risk to children",
                upvotes: 89
            }
        ];

        setIssues(mockIssues);
        setFilteredIssues(mockIssues);
    }, []);

    // Filter issues based on category, status, and search query
    useEffect(() => {
        let filtered = issues;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(issue => issue.category === selectedCategory);
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(issue => issue.status === selectedStatus);
        }

        if (searchQuery) {
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredIssues(filtered);
    }, [issues, selectedCategory, selectedStatus, searchQuery]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-vibrant-pink/10 text-vibrant-pink dark:bg-vibrant-pink/20 dark:text-vibrant-pink border-vibrant-pink/20';
            case 'in-progress':
                return 'bg-bright-blue/10 text-bright-blue dark:bg-bright-blue/20 dark:text-bright-blue border-bright-blue/20';
            case 'resolved':
                return 'bg-neon-green/10 text-neon-green dark:bg-neon-green/20 dark:text-neon-green border-neon-green/20';
            case 'closed':
                return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
            default:
                return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-gradient-to-r from-vibrant-pink to-bright-blue text-white';
            case 'high':
                return 'bg-vibrant-pink/10 text-vibrant-pink dark:bg-vibrant-pink/20 dark:text-vibrant-pink border-vibrant-pink/20';
            case 'medium':
                return 'bg-bright-blue/10 text-bright-blue dark:bg-bright-blue/20 dark:text-bright-blue border-bright-blue/20';
            case 'low':
                return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
            default:
                return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
        }
    };

    const categories = ['all', 'Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
    const statuses = ['all', 'open', 'in-progress', 'resolved', 'closed'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
            <Header />

            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="text-center mb-12 animate-slide-up">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent mb-6">
                        Community Issues
                    </h1>
                    <p className="text-xl text-slate-gray dark:text-soft-gray max-w-3xl mx-auto mb-8">
                        Track and engage with municipal issues reported by your community. Together, we can build a smarter, more responsive city.
                    </p>
                    <Link
                        href="/report"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Report New Issue
                    </Link>
                </div>

                {/* Filters */}
                <div className="glass-surface rounded-2xl p-6 mb-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Search Issues
                            </label>
                            <input
                                type="text"
                                placeholder="Search by title, description, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-end">
                            <div className="glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 w-full text-center">
                                <div className="text-2xl font-bold bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple bg-clip-text text-transparent">
                                    {filteredIssues.length}
                                </div>
                                <div className="text-sm text-slate-gray dark:text-soft-gray">
                                    Issues Found
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Issues List */}
                <div className="space-y-6">
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map((issue, index) => (
                            <div
                                key={issue.id}
                                className="glass-surface rounded-2xl p-6 border border-glass-light-hover dark:border-glass-dark-hover hover:border-bright-blue dark:hover:border-neon-green transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-light dark:hover:shadow-glass-dark animate-slide-up group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-charcoal dark:text-white group-hover:text-bright-blue dark:group-hover:text-neon-green transition-colors">
                                                {issue.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(issue.priority)}`}>
                                                {issue.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-slate-gray dark:text-soft-gray mb-4 line-clamp-2">
                                            {issue.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-slate-gray dark:text-soft-gray">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {issue.location}
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-gray dark:text-soft-gray">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(issue.reportedDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-gray dark:text-soft-gray">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {issue.reportedBy}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl p-3">
                                                <div className="text-lg font-bold text-bright-blue dark:text-neon-green">
                                                    {issue.upvotes}
                                                </div>
                                                <div className="text-xs text-slate-gray dark:text-soft-gray">
                                                    Upvotes
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(issue.status)}`}>
                                                {issue.status.replace('-', ' ').toUpperCase()}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border border-slate-gray/20">
                                                {issue.category}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/issues/${issue.id}`}
                                            className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-6 py-3 rounded-xl font-semibold hover:shadow-neon transition-all duration-300 hover:scale-105"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="glass-surface rounded-2xl p-12 border border-glass-light-hover dark:border-glass-dark-hover">
                                <div className="w-16 h-16 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M6.343 6.343L17.657 17.657" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-4">
                                    No Issues Found
                                </h3>
                                <p className="text-slate-gray dark:text-soft-gray mb-6">
                                    No issues match your current search criteria. Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                        setSelectedStatus('all');
                                    }}
                                    className="glass-surface border border-bright-blue dark:border-neon-green text-bright-blue dark:text-neon-green px-6 py-3 rounded-xl font-semibold hover:shadow-neon transition-all duration-300 hover:scale-105"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
