'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/header';
import IssuesMap from '../../components/issues-map';
import { Issue } from '../../types/database';
import { apiClient, isApiSuccess } from '../../lib/api-client';

export default function MapPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getIssues();

                if (isApiSuccess(response)) {
                    setIssues(response.data.data || []);
                } else {
                    setError(response.error || 'Failed to load issues');
                }
            } catch (err) {
                setError('Failed to load issues for map');
                console.error('Error fetching issues for map:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const handleIssueSelect = (issue: Issue) => {
        setSelectedIssue(issue);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
            <Header />

            <div className="pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text-charcoal mb-4">
                            Issues Map
                        </h1>
                        <p className="text-xl text-text-secondary">
                            Explore issues in your community on an interactive map
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                            <p className="text-text-secondary">Loading map data...</p>
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
                            {/* Map Container */}
                            <div className="card-modern p-6">
                                <div className="h-96 lg:h-[500px]">
                                    <IssuesMap
                                        issues={issues}
                                        onIssueSelect={handleIssueSelect}
                                    />
                                </div>
                            </div>

                            {/* Selected Issue Details */}
                            {selectedIssue && (
                                <div className="card-modern p-6">
                                    <h3 className="text-xl font-semibold text-text-primary mb-4">
                                        Selected Issue Details
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-lg mb-2">{selectedIssue.title}</h4>
                                            <p className="text-text-secondary mb-4">{selectedIssue.description}</p>

                                            <div className="space-y-2 text-sm">
                                                {selectedIssue.address && (
                                                    <p><strong>Address:</strong> {selectedIssue.address}</p>
                                                )}
                                                {selectedIssue.location_description && (
                                                    <p><strong>Location:</strong> {selectedIssue.location_description}</p>
                                                )}
                                                <p><strong>Status:</strong>
                                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedIssue.is_resolved ? 'bg-green-100 text-green-700' :
                                                        selectedIssue.is_flagged ? 'bg-purple-100 text-purple-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {selectedIssue.is_resolved ? 'Resolved' :
                                                            selectedIssue.is_flagged ? 'Flagged' : 'Open'}
                                                    </span>
                                                </p>
                                                <p><strong>Reported:</strong> {new Date(selectedIssue.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-medium mb-2">Coordinates</h5>
                                            <p className="text-sm text-text-secondary">
                                                Latitude: {Number(selectedIssue.latitude).toFixed(6)}<br />
                                                Longitude: {Number(selectedIssue.longitude).toFixed(6)}
                                            </p>

                                            {selectedIssue.category && (
                                                <div className="mt-4">
                                                    <h5 className="font-medium mb-2">Category</h5>
                                                    <p className="text-sm text-text-secondary">{selectedIssue.category.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Summary Statistics */}
                            <div className="card-modern p-6">
                                <h3 className="text-xl font-semibold text-text-primary mb-4">
                                    Map Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-accent-primary">
                                            {issues.length}
                                        </div>
                                        <div className="text-text-secondary text-sm">Total Issues</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-500">
                                            {issues.filter(i => !i.is_resolved && !i.is_flagged).length}
                                        </div>
                                        <div className="text-text-secondary text-sm">Open</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-500">
                                            {issues.filter(i => i.is_resolved).length}
                                        </div>
                                        <div className="text-text-secondary text-sm">Resolved</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-500">
                                            {issues.filter(i => i.is_flagged).length}
                                        </div>
                                        <div className="text-text-secondary text-sm">Flagged</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}