"use client"

import { useState } from 'react';
import { Search, Plus, MapPin, List, Flag, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';
import Header from './header';

interface Issue {
    id: string;
    title: string;
    description: string;
    category: 'roads' | 'lighting' | 'water-supply' | 'cleanliness' | 'public-safety' | 'obstructions';
    status: 'reported' | 'in-progress' | 'resolved';
    location: {
        lat: number;
        lng: number;
        address: string;
        distance?: number;
    };
    reportedBy: string;
    reportedAt: Date;
    priority: 'low' | 'medium' | 'high';
    images: string[];
    isAnonymous: boolean;
    statusHistory: StatusChange[];
    flagCount: number;
    isHidden: boolean;
    updatedAt: Date;
}

interface StatusChange {
    id: string;
    status: 'reported' | 'in-progress' | 'resolved';
    timestamp: Date;
    updatedBy: string;
    note?: string;
}

interface IssueTrackerProps {
    issues: Issue[];
    onAddIssue: () => void;
    onViewMap: () => void;
    currentView: 'list' | 'map' | 'detail';
    onSelectIssue?: (issue: Issue) => void;
    onFlagIssue?: (issueId: string) => void;
    onShareIssue?: (issue: Issue) => void;
}

export default function IssueTracker({
    issues,
    onAddIssue,
    onViewMap,
    currentView,
    onSelectIssue,
    onFlagIssue,
    onShareIssue
}: IssueTrackerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDistance, setFilterDistance] = useState('all');

    // Filter issues based on search and filters
    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.location.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
        const matchesDistance = filterDistance === 'all' ||
            (issue.location.distance && issue.location.distance <= parseInt(filterDistance));

        return matchesSearch && matchesCategory && matchesStatus && matchesDistance;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'water-supply': return 'bg-bright-blue/10 text-bright-blue dark:bg-bright-blue/20 dark:text-bright-blue border-bright-blue/20';
            case 'lighting': return 'bg-vibrant-pink/10 text-vibrant-pink dark:bg-vibrant-pink/20 dark:text-vibrant-pink border-vibrant-pink/20';
            case 'roads': return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
            case 'cleanliness': return 'bg-neon-green/10 text-neon-green dark:bg-neon-green/20 dark:text-neon-green border-neon-green/20';
            case 'public-safety': return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20';
            case 'obstructions': return 'bg-iridescent-purple/10 text-iridescent-purple dark:bg-iridescent-purple/20 dark:text-iridescent-purple border-iridescent-purple/20';
            default: return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'water-supply': return '💧';
            case 'lighting': return '💡';
            case 'roads': return '🛣️';
            case 'cleanliness': return '🧹';
            case 'public-safety': return '🚨';
            case 'obstructions': return '🚧';
            default: return '📋';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'water-supply': return 'Water Systems';
            case 'lighting': return 'IoT Lighting';
            case 'roads': return 'Smart Roads';
            case 'cleanliness': return 'Clean Tech';
            case 'public-safety': return 'Public Safety';
            case 'obstructions': return 'Obstructions';
            default: return category;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reported': return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20';
            case 'in-progress': return 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/20';
            case 'resolved': return 'bg-neon-green/10 text-neon-green dark:bg-neon-green/20 dark:text-neon-green border-neon-green/20';
            default: return 'bg-slate-gray/10 text-slate-gray dark:bg-soft-gray/20 dark:text-soft-gray border-slate-gray/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 border-l-4';
            case 'medium': return 'border-l-yellow-500 border-l-4';
            case 'low': return 'border-l-neon-green border-l-4';
            default: return 'border-l-slate-gray border-l-4';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Header */}
            <Header />

            {/* Controls */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="glass-surface rounded-2xl p-8 mb-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-gray dark:text-soft-gray h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3 glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            >
                                <option value="all">All Categories</option>
                                <option value="roads">🛣️ Smart Roads</option>
                                <option value="lighting">💡 IoT Lighting</option>
                                <option value="water-supply">💧 Water Systems</option>
                                <option value="cleanliness">🧹 Clean Tech</option>
                                <option value="public-safety">🚨 Public Safety</option>
                                <option value="obstructions">🚧 Obstructions</option>
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            >
                                <option value="all">All Statuses</option>
                                <option value="reported">Reported</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>

                            <select
                                value={filterDistance}
                                onChange={(e) => setFilterDistance(e.target.value)}
                                className="px-4 py-3 glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                            >
                                <option value="all">All Distances</option>
                                <option value="1">Within 1 km</option>
                                <option value="3">Within 3 km</option>
                                <option value="5">Within 5 km</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onViewMap}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${currentView === 'map'
                                    ? 'bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white shadow-neon'
                                    : 'glass-surface border-glass-light-hover dark:border-glass-dark-hover text-charcoal dark:text-white hover:shadow-neon'
                                    }`}
                            >
                                <MapPin className="h-4 w-4" />
                                Map View
                            </button>

                            <button
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${currentView === 'list'
                                    ? 'bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white shadow-neon'
                                    : 'glass-surface border-glass-light-hover dark:border-glass-dark-hover text-charcoal dark:text-white hover:shadow-neon'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                                List View
                            </button>

                            <button
                                onClick={onAddIssue}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white rounded-xl hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105 font-semibold"
                            >
                                <Plus className="h-4 w-4" />
                                Report Issue
                            </button>
                        </div>
                    </div>
                </div>

                {/* Issues List */}
                <div className="space-y-6">
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map((issue) => (
                            <div
                                key={issue.id}
                                className={`glass-surface rounded-2xl p-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass hover:shadow-glass-light dark:hover:shadow-glass-dark transition-all duration-300 cursor-pointer hover:-translate-y-1 ${getPriorityColor(issue.priority)}`}
                                onClick={() => onSelectIssue?.(issue)}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            {issue.images.length > 0 && (
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={issue.images[0]}
                                                        alt="Issue"
                                                        width={80}
                                                        height={80}
                                                        className="w-20 h-20 object-cover rounded-xl border border-glass-light-hover dark:border-glass-dark-hover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-charcoal-text dark:text-white mb-2">{issue.title}</h3>
                                                <p className="text-muted-gray dark:text-soft-gray mb-4 line-clamp-2">{issue.description}</p>

                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${getCategoryColor(issue.category)}`}>
                                                        {getCategoryIcon(issue.category)} {getCategoryLabel(issue.category)}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${getStatusColor(issue.status)}`}>
                                                        {issue.status.replace('-', ' ').toUpperCase()}
                                                    </span>
                                                    {issue.isAnonymous && (
                                                        <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-iridescent-purple/20 text-iridescent-purple dark:bg-iridescent-purple/30 dark:text-iridescent-purple border border-iridescent-purple/30">
                                                            Anonymous
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-muted-gray dark:text-soft-gray">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="truncate">{issue.location.address}</span>
                                                    </div>
                                                    <span>
                                                        {issue.reportedAt.toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-glass-light-hover dark:border-glass-dark-hover">
                                            <p className="text-xs text-muted-gray dark:text-soft-gray">
                                                Reported by: <span className="font-medium text-charcoal-text dark:text-white">{issue.reportedBy}</span>
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {onFlagIssue && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFlagIssue(issue.id);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 text-xs text-slate-gray dark:text-soft-gray hover:text-red-500 dark:hover:text-red-400 glass-surface rounded-lg border border-glass-light-hover dark:border-glass-dark-hover hover:shadow-neon transition-all duration-300"
                                                    >
                                                        <Flag className="h-3 w-3" />
                                                        Flag
                                                    </button>
                                                )}
                                                {onShareIssue && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onShareIssue(issue);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 text-xs text-slate-gray dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green glass-surface rounded-lg border border-glass-light-hover dark:border-glass-dark-hover hover:shadow-neon transition-all duration-300"
                                                    >
                                                        <Share2 className="h-3 w-3" />
                                                        Share
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status History Preview */}
                                        {issue.statusHistory.length > 1 && (
                                            <div className="mt-4 pt-4 border-t border-glass-light-hover dark:border-glass-dark-hover">
                                                <div className="flex items-center gap-2 text-xs text-slate-gray dark:text-soft-gray">
                                                    <Clock className="h-3 w-3" />
                                                    Last update: {issue.statusHistory[issue.statusHistory.length - 1].timestamp.toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="glass-surface rounded-2xl p-12 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
                                <div className="w-24 h-24 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="h-12 w-12 text-bright-blue dark:text-neon-green opacity-70" />
                                </div>
                                <h3 className="text-xl font-bold text-charcoal dark:text-white mb-4">No Issues Found</h3>
                                <p className="text-slate-gray dark:text-soft-gray mb-8">
                                    No issues match your search criteria. Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={onAddIssue}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white px-8 py-3 rounded-xl hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 hover:scale-105 font-semibold"
                                >
                                    <Plus className="h-4 w-4" />
                                    Report First Issue
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
