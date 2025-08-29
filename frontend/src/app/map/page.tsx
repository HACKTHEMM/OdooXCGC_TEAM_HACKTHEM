'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/header';
import { Issue } from '../../types/database';
import { apiClient, isApiSuccess } from '../../lib/api-client';

export default function MapPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                        <div className="card-modern p-6">
                            <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🗺️</div>
                                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                                        Interactive Map
                                    </h3>
                                    <p className="text-text-secondary">
                                        Map functionality coming soon! Found {issues.length} issues to display.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}