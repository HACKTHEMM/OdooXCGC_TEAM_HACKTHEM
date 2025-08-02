'use client';

import { useState, useEffect } from 'react';
import { AnalyticsSummary, Issue } from '../../types/database';
import { apiClient } from '../../lib/api-client';

interface AdminDashboardProps {
  analytics: AnalyticsSummary | null;
}

export default function AdminDashboard({ analytics }: AdminDashboardProps) {
  const [flaggedIssues, setFlaggedIssues] = useState<Issue[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [flaggedRes, recentRes] = await Promise.all([
        apiClient.getFlaggedIssues(),
        apiClient.getIssues()
      ]);

      if (flaggedRes.success && flaggedRes.data) {
        setFlaggedIssues(flaggedRes.data);
      }

      if (recentRes.success && recentRes.data) {
        setRecentIssues(recentRes.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No analytics data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Issues',
      value: analytics.totalIssues.toLocaleString(),
      icon: '🚨',
      color: 'from-bright-blue to-vibrant-pink',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Resolved Issues',
      value: analytics.resolvedIssues.toLocaleString(),
      icon: '✅',
      color: 'from-neon-green to-iridescent-purple',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: analytics.activeUsers.toLocaleString(),
      icon: '👥',
      color: 'from-vibrant-pink to-bright-blue',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending Issues',
      value: analytics.pendingIssues.toLocaleString(),
      icon: '⏳',
      color: 'from-iridescent-purple to-neon-green',
      change: '-5%',
      changeType: 'negative'
    },
    {
      title: 'Flagged Issues',
      value: flaggedIssues.length.toString(),
      icon: '🚩',
      color: 'from-red-500 to-pink-500',
      change: flaggedIssues.length > 0 ? `+${flaggedIssues.length}` : '0',
      changeType: flaggedIssues.length > 0 ? 'negative' : 'positive'
    }
  ];

  const recentActivity = [
    ...recentIssues.slice(0, 3).map(issue => ({
      type: 'issue' as const,
      message: `New issue: ${issue.title}`,
      time: new Date(issue.created_at).toLocaleTimeString(),
      icon: '🚨',
      priority: issue.flag_count > 0 ? 'high' : 'normal'
    })),
    ...flaggedIssues.slice(0, 2).map(issue => ({
      type: 'flag' as const,
      message: `Issue flagged: ${issue.title}`,
      time: new Date(issue.created_at).toLocaleTimeString(),
      icon: '🚩',
      priority: 'high'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text-charcoal mb-2">
          Dashboard Overview
        </h2>
        <p className="text-text-secondary">
          Monitor your platform's performance and activity
        </p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="card-modern p-6 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent mb-1">
                {stat.value}
              </h3>
              <p className="text-text-secondary text-sm">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="card-modern p-6">
          <h3 className="text-xl font-bold gradient-text-charcoal mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 glass-surface rounded-xl border transition-all duration-300 ${
                  activity.priority === 'high' 
                    ? 'border-red-500/50 bg-red-500/5' 
                    : 'border-glass-border hover:shadow-lg'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                  activity.priority === 'high' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                    : 'bg-gradient-to-r from-accent-primary to-accent-secondary'
                }`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium text-sm">
                    {activity.message}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {activity.time}
                  </p>
                </div>
                {activity.priority === 'high' && (
                  <span className="text-red-500 text-xs">⚠️</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Flag Monitoring */}
        <div className="card-modern p-6">
          <h3 className="text-xl font-bold gradient-text-charcoal mb-4">
            🚩 Flag Monitoring
          </h3>
          {flaggedIssues.length > 0 ? (
            <div className="space-y-3">
              {flaggedIssues.slice(0, 4).map((issue) => (
                <div
                  key={issue.id}
                  className="p-3 glass-surface rounded-xl border border-red-500/50 bg-red-500/5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-500">🚩</span>
                    <h4 className="font-medium text-text-primary text-sm">
                      {issue.title}
                    </h4>
                  </div>
                  <p className="text-text-secondary text-xs mb-2 line-clamp-1">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      {issue.reporter?.user_name || 'Anonymous'}
                    </span>
                    <span className="text-red-500 font-medium">
                      {issue.flag_count} flags
                    </span>
                  </div>
                </div>
              ))}
              {flaggedIssues.length > 4 && (
                <div className="text-center pt-2">
                  <p className="text-text-secondary text-sm">
                    +{flaggedIssues.length - 4} more flagged issues
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-text-secondary text-sm">
                No flagged issues at the moment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold gradient-text-charcoal mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="group p-3 glass-surface rounded-xl border border-glass-border text-text-primary hover:text-accent-primary hover:border-accent-primary transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <span className="text-lg">👥</span>
              <div>
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-text-secondary">View and manage user accounts</div>
              </div>
            </div>
          </button>
          
          <button className="group p-3 glass-surface rounded-xl border border-glass-border text-text-primary hover:text-accent-primary hover:border-accent-primary transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <span className="text-lg">🚨</span>
              <div>
                <div className="font-medium">Review Issues</div>
                <div className="text-xs text-text-secondary">Review flagged and pending issues</div>
              </div>
            </div>
          </button>
          
          <button className="group p-3 glass-surface rounded-xl border border-glass-border text-text-primary hover:text-accent-primary hover:border-accent-primary transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏷️</span>
              <div>
                <div className="font-medium">Manage Categories</div>
                <div className="text-xs text-text-secondary">Update issue categories</div>
              </div>
            </div>
          </button>
          
          <button className="group p-3 glass-surface rounded-xl border border-glass-border text-text-primary hover:text-accent-primary hover:border-accent-primary transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <span className="text-lg">📊</span>
              <div>
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-text-secondary">Detailed platform analytics</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold gradient-text-charcoal mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 glass-surface rounded-xl border border-green-500/20">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-medium text-green-500">API Server</div>
              <div className="text-xs text-text-secondary">Online</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 glass-surface rounded-xl border border-green-500/20">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-medium text-green-500">Database</div>
              <div className="text-xs text-text-secondary">Connected</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 glass-surface rounded-xl border border-green-500/20">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-medium text-green-500">File Storage</div>
              <div className="text-xs text-text-secondary">Available</div>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 glass-surface rounded-xl border ${
            flaggedIssues.length > 0 
              ? 'border-red-500/20' 
              : 'border-green-500/20'
          }`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              flaggedIssues.length > 0 ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <div>
              <div className={`font-medium ${
                flaggedIssues.length > 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                Flag Monitoring
              </div>
              <div className="text-xs text-text-secondary">
                {flaggedIssues.length > 0 ? `${flaggedIssues.length} flagged` : 'All clear'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 