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
                description: "Streetlight has been out for 3 days, creating safety concerns",
                upvotes: 23
            },
            {
                id: 3,
                title: "Water leak in Central Park",
                category: "Water Supply",
                status: "resolved",
                priority: "urgent",
                location: "Central Park, Near Fountain",
                reportedBy: "Mike Johnson",
                reportedDate: "2025-01-20",
                description: "Major water leak causing flooding in park area",
                upvotes: 67
            },
            {
                id: 4,
                title: "Overflowing garbage bin at Bus Stop #12",
                category: "Cleanliness",
                status: "open",
                priority: "medium",
                location: "Bus Stop #12, Market Street",
                reportedBy: "Sarah Wilson",
                reportedDate: "2025-01-30",
                description: "Garbage bin has been overflowing for several days, attracting pests",
                upvotes: 18
            },
            {
                id: 5,
                title: "Damaged sidewalk near school",
                category: "Roads",
                status: "open",
                priority: "high",
                location: "Elm Street, Near Elementary School",
                reportedBy: "David Brown",
                reportedDate: "2025-01-29",
                description: "Cracked and uneven sidewalk poses safety risk for children",
                upvotes: 34
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
            case 'open': return 'bg-red-100 text-red-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-yellow-500 text-white';
            case 'low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const categories = ['all', 'Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
    const statuses = ['all', 'open', 'in-progress', 'resolved', 'closed'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Issues</h1>
                    <p className="text-lg text-gray-600">
                        Browse and track municipal issues reported by your community
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Report Button */}
                        <div className="flex items-end">
                            <Link
                                href="/report"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                            >
                                Report New Issue
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    {filteredIssues.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <p className="text-gray-500 text-lg">No issues found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredIssues.map((issue) => (
                            <div key={issue.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                                                {issue.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{issue.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span>📍 {issue.location}</span>
                                            <span>👤 {issue.reportedBy}</span>
                                            <span>📅 {issue.reportedDate}</span>
                                            <span>👍 {issue.upvotes} upvotes</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
                                        </span>
                                        <span className="text-sm text-gray-500">#{issue.category}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        👍 Upvote ({issue.upvotes})
                                    </button>
                                    <Link
                                        href={`/issues/${issue.id}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination (placeholder) */}
                {filteredIssues.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="px-4 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded-md">
                                1
                            </button>
                            <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                3
                            </button>
                            <button className="px-4 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
