'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface ConnectionTestProps {
    className?: string;
}

export default function ConnectionTest({ className = '' }: ConnectionTestProps) {
    const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
    const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
    const [apiResponseTime, setApiResponseTime] = useState<number | null>(null);
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const checkBackendConnection = async () => {
        const startTime = Date.now();
        try {
            // Test basic API connectivity
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/../health`);
            const endTime = Date.now();
            setApiResponseTime(endTime - startTime);

            if (response.ok) {
                setBackendStatus('connected');

                // Test database connectivity through API
                try {
                    const dbTest = await apiClient.getCategories();
                    if (dbTest.success) {
                        setDatabaseStatus('connected');
                    } else {
                        setDatabaseStatus('failed');
                    }
                } catch (error) {
                    console.error('Database test failed:', error);
                    setDatabaseStatus('failed');
                }
            } else {
                setBackendStatus('failed');
                setDatabaseStatus('failed');
            }
        } catch (error) {
            console.error('Backend connection failed:', error);
            setBackendStatus('failed');
            setDatabaseStatus('failed');
            setApiResponseTime(null);
        }
        setLastCheck(new Date());
    };

    useEffect(() => {
        checkBackendConnection();
        // Check connection every 30 seconds
        const interval = setInterval(checkBackendConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'checking':
                return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />;
            case 'connected':
                return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />;
            case 'failed':
                return <div className="w-3 h-3 bg-red-500 rounded-full" />;
            default:
                return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'checking':
                return 'Checking...';
            case 'connected':
                return 'Connected';
            case 'failed':
                return 'Failed';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className={`glass-surface p-4 rounded-xl border border-glass-border ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">System Status</h3>
                <button
                    onClick={checkBackendConnection}
                    className="text-xs text-accent-primary hover:text-accent-secondary transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(backendStatus)}
                        <span className="text-xs text-text-secondary">Backend API</span>
                    </div>
                    <span className="text-xs font-medium">{getStatusText(backendStatus)}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(databaseStatus)}
                        <span className="text-xs text-text-secondary">Database</span>
                    </div>
                    <span className="text-xs font-medium">{getStatusText(databaseStatus)}</span>
                </div>

                {apiResponseTime && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">Response Time</span>
                        <span className="text-xs font-medium">{apiResponseTime}ms</span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-glass-border">
                    <span className="text-xs text-text-secondary">Last Check</span>
                    <span className="text-xs">{lastCheck.toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
}
