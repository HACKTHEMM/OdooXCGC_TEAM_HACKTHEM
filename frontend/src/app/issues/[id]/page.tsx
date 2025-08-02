"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    assignedTo?: string;
    estimatedResolution?: string;
    updates: {
        id: number;
        date: string;
        status: string;
        message: string;
        author: string;
    }[];
}

interface Comment {
    id: number;
    author: string;
    date: string;
    message: string;
}

export default function IssueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockIssue: Issue = {
            id: parseInt(params.id as string),
            title: "Large pothole on Main Street",
            category: "Roads",
            status: "in-progress",
            priority: "high",
            location: "Main Street, Downtown (coordinates: 40.7128, -74.0060)",
            reportedBy: "John Doe",
            reportedDate: "2025-01-28",
            description: "There is a large pothole on Main Street near the intersection with Oak Avenue. The pothole is approximately 3 feet in diameter and 8 inches deep, causing significant traffic issues and potential damage to vehicles. Several cars have already been damaged, and it poses a safety hazard, especially during nighttime driving. The issue has been ongoing for about a week and seems to be getting worse with recent rain.",
            upvotes: 45,
            assignedTo: "Department of Public Works",
            estimatedResolution: "2025-02-05",
            updates: [
                {
                    id: 1,
                    date: "2025-01-28",
                    status: "open",
                    message: "Issue reported and received for review",
                    author: "System"
                },
                {
                    id: 2,
                    date: "2025-01-29",
                    status: "open",
                    message: "Issue reviewed and verified. Assigned to Department of Public Works.",
                    author: "Municipal Coordinator"
                },
                {
                    id: 3,
                    date: "2025-01-30",
                    status: "in-progress",
                    message: "Work crew dispatched to assess the damage and material requirements.",
                    author: "Department of Public Works"
                },
                {
                    id: 4,
                    date: "2025-02-01",
                    status: "in-progress",
                    message: "Materials ordered. Work scheduled to begin on February 3rd, weather permitting.",
                    author: "Department of Public Works"
                }
            ]
        };

        const mockComments: Comment[] = [
            {
                id: 1,
                author: "Jane Smith",
                date: "2025-01-29",
                message: "I can confirm this pothole is really bad. My car's tire was damaged yesterday when I hit it."
            },
            {
                id: 2,
                author: "Mike Johnson",
                date: "2025-01-30",
                message: "Thanks for reporting this! I've been avoiding this street for days."
            },
            {
                id: 3,
                author: "Sarah Wilson",
                date: "2025-02-01",
                message: "Glad to see it's being worked on. This has been a major issue for our neighborhood."
            }
        ];

        setIssue(mockIssue);
        setComments(mockComments);
        setLoading(false);
    }, [params.id]);

    const handleUpvote = () => {
        if (!hasUpvoted && issue) {
            setIssue(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
            setHasUpvoted(true);
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment: Comment = {
                id: comments.length + 1,
                author: "Current User", // Replace with actual user name
                date: new Date().toISOString().split('T')[0],
                message: newComment.trim()
            };
            setComments(prev => [...prev, comment]);
            setNewComment('');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-800 border-red-200';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h1>
                        <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist or has been removed.</p>
                        <Link href="/issues" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Back to Issues
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <Link href="/issues" className="text-gray-700 hover:text-blue-600">Issues</Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-gray-500">Issue #{issue.id}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Main Issue Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                                    {issue.priority.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Issue #{issue.id}</span>
                                <span>•</span>
                                <span>📍 {issue.location}</span>
                                <span>•</span>
                                <span>📅 Reported {issue.reportedDate}</span>
                                <span>•</span>
                                <span>👤 {issue.reportedBy}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
                                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
                            </span>
                            <span className="text-sm text-gray-500">#{issue.category}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                        <p className="text-gray-700 leading-relaxed">{issue.description}</p>
                    </div>

                    {/* Issue Details */}
                    {issue.assignedTo && (
                        <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Assigned To</h3>
                                <p className="text-gray-900">{issue.assignedTo}</p>
                            </div>
                            {issue.estimatedResolution && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Estimated Resolution</h3>
                                    <p className="text-gray-900">{issue.estimatedResolution}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button
                            onClick={handleUpvote}
                            disabled={hasUpvoted}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${hasUpvoted
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            <span>👍</span>
                            <span>{hasUpvoted ? 'Upvoted' : 'Upvote'} ({issue.upvotes})</span>
                        </button>
                        <div className="flex gap-3">
                            <button className="text-gray-600 hover:text-gray-700">Share</button>
                            <button className="text-gray-600 hover:text-gray-700">Follow Updates</button>
                        </div>
                    </div>
                </div>

                {/* Status Updates */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Updates</h2>
                    <div className="space-y-4">
                        {issue.updates.map((update, index) => (
                            <div key={update.id} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-3 h-3 rounded-full mt-2 ${index === issue.updates.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}></div>
                                    {index < issue.updates.length - 1 && (
                                        <div className="w-0.5 h-8 bg-gray-200 ml-1 mt-1"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">{update.author}</span>
                                        <span className="text-sm text-gray-500">{update.date}</span>
                                    </div>
                                    <p className="text-gray-700">{update.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Community Comments ({comments.length})
                    </h2>

                    {/* Add Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment to help or provide additional information..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="mt-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className={`px-4 py-2 rounded-md transition-colors ${newComment.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No comments yet. Be the first to comment!
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="border-l-4 border-blue-100 pl-4 py-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">{comment.author}</span>
                                        <span className="text-sm text-gray-500">{comment.date}</span>
                                    </div>
                                    <p className="text-gray-700">{comment.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
