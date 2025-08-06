'use client';

import { useState, useEffect } from 'react';
import { Issue } from '../../types/database';
import { apiClient } from '../../lib/api-client';

interface FlagMonitoringProps {
  onIssueUpdate?: (issues: Issue[]) => void;
}

interface FlagData {
  id: number;
  issue_id: number;
  reason: string;
  flagged_by: string;
  flagged_at: string;
  issue: Issue;
}

export default function FlagMonitoring({ onIssueUpdate }: FlagMonitoringProps) {
  const [flaggedIssues, setFlaggedIssues] = useState<Issue[]>([]);
  const [flagDetails, setFlagDetails] = useState<FlagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<FlagData | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');

  useEffect(() => {
    loadFlagData();
  }, []);

  const loadFlagData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getFlaggedIssues();

      if (response.success && response.data) {
        setFlaggedIssues(response.data);
        // In a real implementation, you'd have a separate endpoint for flag details
        // For now, we'll create mock flag data
        const mockFlagData: FlagData[] = response.data.map((issue, index) => ({
          id: index + 1,
          issue_id: issue.id,
          reason: `Inappropriate content - ${index + 1}`,
          flagged_by: `User${index + 1}`,
          flagged_at: new Date(Date.now() - index * 3600000).toISOString(),
          issue
        }));
        setFlagDetails(mockFlagData);
      }
    } catch (error) {
      console.error('Failed to load flag data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: number) => {
    try {
      setLoading(true);
      // In a real implementation, you'd call an API to resolve the flag
      const updatedFlags = flagDetails.filter(flag => flag.id !== flagId);
      setFlagDetails(updatedFlags);

      // Update the issue's flag count
      const updatedIssues = flaggedIssues.map(issue => ({
        ...issue,
        flag_count: Math.max(0, (issue.flag_count || 0) - 1)
      }));
      setFlaggedIssues(updatedIssues);

      if (onIssueUpdate) {
        onIssueUpdate(updatedIssues);
      }
    } catch (error) {
      console.error('Failed to resolve flag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideIssue = async (issueId: number) => {
    try {
      setLoading(true);
      const response = await apiClient.hideIssue(issueId);

      if (response.success) {
        const updatedIssues = flaggedIssues.filter(issue => issue.id !== issueId);
        setFlaggedIssues(updatedIssues);

        if (onIssueUpdate) {
          onIssueUpdate(updatedIssues);
        }
      }
    } catch (error) {
      console.error('Failed to hide issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlags = flagDetails.filter(flag => {
    if (filterStatus === 'pending') return true; // All flags are pending in this mock
    if (filterStatus === 'resolved') return false; // No resolved flags in this mock
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading flag data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text-charcoal mb-2">
          🚩 Flag Monitoring
        </h2>
        <p className="text-text-secondary">
          Monitor and manage flagged issues and content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-black text-xl">
              🚩
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {flaggedIssues.length}
              </h3>
              <p className="text-text-secondary text-sm">Flagged Issues</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-black text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {flagDetails.length}
              </h3>
              <p className="text-text-secondary text-sm">Total Flags</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-black text-xl">
              ⏳
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {flagDetails.length}
              </h3>
              <p className="text-text-secondary text-sm">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-black text-xl">
              ✅
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                0
              </h3>
              <p className="text-text-secondary text-sm">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${filterStatus === 'all'
                  ? 'bg-accent-primary text-black'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary'
                }`}
            >
              All Flags
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${filterStatus === 'pending'
                  ? 'bg-accent-primary text-black'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary'
                }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${filterStatus === 'resolved'
                  ? 'bg-accent-primary text-black'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary'
                }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Flag List */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold gradient-text-charcoal mb-6">
          Flag Details ({filteredFlags.length})
        </h3>

        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className="glass-surface rounded-xl p-4 border border-red-500/50 bg-red-500/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-red-500">🚩</span>
                    <h4 className="font-medium text-text-primary">
                      {flag.issue.title}
                    </h4>
                    <span className="px-2 py-1 rounded-full text-xs border bg-red-500/20 text-red-500 border-red-500/30">
                      Flag #{flag.id}
                    </span>
                  </div>

                  <p className="text-text-secondary text-sm mb-3">
                    <strong>Flag Reason:</strong> {flag.reason}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>Flagged by: {flag.flagged_by}</span>
                    <span>•</span>
                    <span>Flagged: {new Date(flag.flagged_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Issue by: {flag.issue.reporter?.user_name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>Category: {flag.issue.category?.name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setSelectedFlag(flag)}
                    className="px-3 py-1 text-xs glass-surface border border-glass-border rounded-lg text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    Review
                  </button>

                  <button
                    onClick={() => handleResolveFlag(flag.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => handleHideIssue(flag.issue.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-red-500 text-black rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Hide Issue
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredFlags.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-text-secondary">
                No flags found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Flag Details Modal */}
      {selectedFlag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-modern p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text-charcoal">
                Flag Details
              </h3>
              <button
                onClick={() => setSelectedFlag(null)}
                className="text-text-secondary hover:text-accent-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 glass-surface rounded-xl border border-red-500/50 bg-red-500/5">
                <h4 className="font-medium text-red-500 mb-2">🚩 Flag Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Flag ID:</strong> #{selectedFlag.id}</div>
                  <div><strong>Flagged by:</strong> {selectedFlag.flagged_by}</div>
                  <div><strong>Flagged at:</strong> {new Date(selectedFlag.flagged_at).toLocaleString()}</div>
                  <div><strong>Reason:</strong> {selectedFlag.reason}</div>
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Issue Title</label>
                <p className="text-text-primary font-medium">{selectedFlag.issue.title}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Issue Description</label>
                <p className="text-text-primary">{selectedFlag.issue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-text-secondary text-sm">Status</label>
                  <p className="text-text-primary">{selectedFlag.issue.status?.name || 'Open'}</p>
                </div>

                <div>
                  <label className="text-text-secondary text-sm">Category</label>
                  <p className="text-text-primary">{selectedFlag.issue.category?.name || 'Unknown'}</p>
                </div>

                <div>
                  <label className="text-text-secondary text-sm">Reporter</label>
                  <p className="text-text-primary">{selectedFlag.issue.reporter?.user_name || 'Anonymous'}</p>
                </div>

                <div>
                  <label className="text-text-secondary text-sm">Created</label>
                  <p className="text-text-primary">
                    {new Date(selectedFlag.issue.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedFlag.issue.address && (
                <div>
                  <label className="text-text-secondary text-sm">Location</label>
                  <p className="text-text-primary">{selectedFlag.issue.address}</p>
                </div>
              )}

              {selectedFlag.issue.photos && selectedFlag.issue.photos.length > 0 && (
                <div>
                  <label className="text-text-secondary text-sm">Photos ({selectedFlag.issue.photos.length})</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedFlag.issue.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo.photo_url}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  handleResolveFlag(selectedFlag.id);
                  setSelectedFlag(null);
                }}
                className="flex-1 btn-modern"
              >
                Resolve Flag
              </button>

              <button
                onClick={() => {
                  handleHideIssue(selectedFlag.issue.id);
                  setSelectedFlag(null);
                }}
                className="px-4 py-2 bg-red-500 text-black rounded-xl hover:bg-red-600 transition-colors"
              >
                Hide Issue
              </button>

              <button
                onClick={() => setSelectedFlag(null)}
                className="px-4 py-2 glass-surface border border-glass-border rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 