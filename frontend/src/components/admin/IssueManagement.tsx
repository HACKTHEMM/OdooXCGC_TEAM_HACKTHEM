'use client';

import { useState, useEffect } from 'react';
import { Issue } from '../../types/database';
import { apiClient } from '../../lib/api-client';

interface IssueManagementProps {
  issues: Issue[];
  onIssuesUpdate: (issues: Issue[]) => void;
}

export default function IssueManagement({ issues, onIssuesUpdate }: IssueManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFlagged, setFilterFlagged] = useState<'all' | 'flagged' | 'not-flagged'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [flaggedIssues, setFlaggedIssues] = useState<Issue[]>([]);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  useEffect(() => {
    loadFlaggedIssues();
  }, []);

  const loadFlaggedIssues = async () => {
    try {
      const response = await apiClient.getFlaggedIssues();
      if (response.success && response.data) {
        setFlaggedIssues(response.data);
      }
    } catch (error) {
      console.error('Failed to load flagged issues:', error);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (issue as any).status_name === filterStatus;
    const matchesCategory = filterCategory === 'all' || (issue as any).category_name === filterCategory;
    const matchesFlagged = filterFlagged === 'all' ||
      (filterFlagged === 'flagged' && issue.flag_count > 0) ||
      (filterFlagged === 'not-flagged' && issue.flag_count === 0);
    return matchesSearch && matchesStatus && matchesCategory && matchesFlagged;
  });

  const handleUpdateStatus = async (issueId: number, status: string) => {
    try {
      setLoading(true);
      // Create a minimal IssueStatus object with just the name
      const statusObj = { name: status, id: 0, sort_order: 0, is_active: true };
      const response = await apiClient.updateIssueStatus(issueId, statusObj);

      if (response.success) {
        const updatedIssues = issues.map(issue =>
          issue.id === issueId ? {
            ...issue,
            status: {
              id: issue.status?.id || 0,
              name: status,
              description: issue.status?.description,
              color_code: issue.status?.color_code,
              sort_order: issue.status?.sort_order || 0,
              is_active: issue.status?.is_active || true
            }
          } : issue
        );
        onIssuesUpdate(updatedIssues);
      }
    } catch (error) {
      console.error('Failed to update issue status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideIssue = async (issueId: number) => {
    try {
      setLoading(true);
      const response = await apiClient.hideIssue(issueId);

      if (response.success) {
        const updatedIssues = issues.filter(issue => issue.id !== issueId);
        onIssuesUpdate(updatedIssues);
      }
    } catch (error) {
      console.error('Failed to hide issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagIssue = async (issueId: number, reason: string) => {
    try {
      setLoading(true);
      const response = await apiClient.flagIssue(issueId, reason);

      if (response.success) {
        // Update the issue's flag count
        const updatedIssues = issues.map(issue =>
          issue.id === issueId ? { ...issue, flag_count: (issue.flag_count || 0) + 1 } : issue
        );
        onIssuesUpdate(updatedIssues);
        setShowFlagModal(false);
        setFlagReason('');
        loadFlaggedIssues(); // Refresh flagged issues list
      }
    } catch (error) {
      console.error('Failed to flag issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'roads': return '🛣️';
      case 'lighting': return '💡';
      case 'water-supply': return '💧';
      case 'cleanliness': return '🧹';
      case 'public-safety': return '🚨';
      case 'obstructions': return '🚧';
      default: return '📋';
    }
  };

  const categories = Array.from(new Set(issues.map(issue => (issue as any).category_name).filter(Boolean)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text-charcoal mb-2">
          Issue Management & Monitoring
        </h2>
        <p className="text-text-secondary">
          Review, manage, and monitor reported issues and flags
        </p>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-bright-blue to-vibrant-pink rounded-xl flex items-center justify-center text-black text-xl">
              🚨
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {issues.length}
              </h3>
              <p className="text-text-secondary text-sm">Total Issues</p>
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
                {issues.filter(i => (i as any).status_name === 'open').length}
              </h3>
              <p className="text-text-secondary text-sm">Open Issues</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-black text-xl">
              🔄
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {issues.filter(i => (i as any).status_name === 'in-progress').length}
              </h3>
              <p className="text-text-secondary text-sm">In Progress</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-iridescent-purple rounded-xl flex items-center justify-center text-black text-xl">
              ✅
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {issues.filter(i => (i as any).status_name === 'resolved').length}
              </h3>
              <p className="text-text-secondary text-sm">Resolved</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-black text-xl">
              🚩
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {issues.filter(i => (i.flag_count || 0) > 0).length}
              </h3>
              <p className="text-text-secondary text-sm">Flagged Issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="card-modern p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern w-full"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'open' | 'in-progress' | 'resolved')}
            className="input-modern"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-modern"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterFlagged}
            onChange={(e) => setFilterFlagged(e.target.value as 'all' | 'flagged' | 'not-flagged')}
            className="input-modern"
          >
            <option value="all">All Issues</option>
            <option value="flagged">Flagged Only</option>
            <option value="not-flagged">Not Flagged</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterCategory('all');
              setFilterFlagged('all');
            }}
            className="btn-modern"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Issue List */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold gradient-text-charcoal mb-6">
          Issues ({filteredIssues.length})
        </h3>

        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`glass-surface rounded-xl p-4 border transition-all duration-300 ${(issue.flag_count || 0) > 0
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-glass-border hover:shadow-lg'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{getCategoryIcon((issue as any).category_name || '')}</span>
                    <h4 className="font-medium text-text-primary">
                      {issue.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor((issue as any).status_name || 'open')}`}>
                      {(issue as any).status_name || 'Open'}
                    </span>
                    {(issue.flag_count || 0) > 0 && (
                      <span className="px-2 py-1 rounded-full text-xs border bg-red-500/20 text-red-500 border-red-500/30">
                        🚩 {issue.flag_count} flags
                      </span>
                    )}
                  </div>

                  <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>By: {(issue as any).reporter_name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{(issue as any).category_name || 'Unknown'}</span>
                    {issue.address && (
                      <>
                        <span>•</span>
                        <span>{issue.address}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <select
                    value={(issue as any).status_name || 'open'}
                    onChange={(e) => handleUpdateStatus(issue.id, e.target.value)}
                    disabled={loading}
                    className="px-3 py-1 text-xs glass-surface border border-glass-border rounded-lg"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="px-3 py-1 text-xs glass-surface border border-glass-border rounded-lg text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowFlagModal(true);
                    }}
                    className="px-3 py-1 text-xs bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Flag
                  </button>

                  <button
                    onClick={() => handleHideIssue(issue.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-red-500 text-black rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Hide
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚨</div>
              <p className="text-text-secondary">
                No issues found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Flagged Issues Summary */}
      {flaggedIssues.length > 0 && (
        <div className="card-modern p-6">
          <h3 className="text-xl font-bold gradient-text-charcoal mb-6">
            🚩 Flagged Issues ({flaggedIssues.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flaggedIssues.slice(0, 6).map((issue) => (
              <div
                key={issue.id}
                className="glass-surface rounded-xl p-4 border border-red-500/50 bg-red-500/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500">🚩</span>
                  <h4 className="font-medium text-text-primary text-sm">
                    {issue.title}
                  </h4>
                </div>
                <p className="text-text-secondary text-xs mb-2 line-clamp-2">
                  {issue.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">
                    {(issue as any).reporter_name || 'Anonymous'}
                  </span>
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-accent-primary hover:text-accent-secondary"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-modern p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text-charcoal">
                Issue Details
              </h3>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-text-secondary hover:text-accent-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-text-secondary text-sm">Title</label>
                <p className="text-text-primary font-medium">{selectedIssue.title}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Description</label>
                <p className="text-text-primary">{selectedIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-text-secondary text-sm">Status</label>
                  <p className="text-text-primary">{(selectedIssue as any).status_name || 'Open'}</p>
                </div>

                <div>
                  <label className="text-text-secondary text-sm">Category</label>
                  <p className="text-text-primary">{(selectedIssue as any).category_name || 'Unknown'}</p>
                </div>

                <div>
                  <label className="text-text-secondary text-sm">Reporter</label>
                  <p className="text-text-primary">{selectedIssue.reporter?.user_name || 'Anonymous'}</p>
                </div>

                <div>
                  <label className="text-text-secondary text-sm">Created</label>
                  <p className="text-text-primary">
                    {new Date(selectedIssue.created_at).toLocaleDateString()}
                  </p>
                </div>

                {(selectedIssue.flag_count || 0) > 0 && (
                  <div className="col-span-2">
                    <label className="text-text-secondary text-sm">Flags</label>
                    <p className="text-red-500 font-medium">🚩 {selectedIssue.flag_count} flags</p>
                  </div>
                )}
              </div>

              {selectedIssue.address && (
                <div>
                  <label className="text-text-secondary text-sm">Location</label>
                  <p className="text-text-primary">{selectedIssue.address}</p>
                </div>
              )}

              {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                <div>
                  <label className="text-text-secondary text-sm">Photos ({selectedIssue.photos.length})</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedIssue.photos.map((photo, index) => (
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
              <select
                value={selectedIssue.status?.name || 'open'}
                onChange={(e) => {
                  handleUpdateStatus(selectedIssue.id, e.target.value);
                  setSelectedIssue(null);
                }}
                className="flex-1 input-modern"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                onClick={() => {
                  setShowFlagModal(true);
                }}
                className="px-4 py-2 bg-orange-500 text-black rounded-xl hover:bg-orange-600 transition-colors"
              >
                Flag Issue
              </button>

              <button
                onClick={() => {
                  handleHideIssue(selectedIssue.id);
                  setSelectedIssue(null);
                }}
                className="px-4 py-2 bg-red-500 text-black rounded-xl hover:bg-red-600 transition-colors"
              >
                Hide Issue
              </button>

              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 glass-surface border border-glass-border rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-modern p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text-charcoal">
                Flag Issue
              </h3>
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="text-text-secondary hover:text-accent-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">Issue</label>
                <p className="text-text-primary font-medium">{selectedIssue.title}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Flag Reason</label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Enter the reason for flagging this issue..."
                  className="input-modern w-full"
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (flagReason.trim()) {
                    handleFlagIssue(selectedIssue.id, flagReason);
                  }
                }}
                disabled={loading || !flagReason.trim()}
                className="flex-1 btn-modern"
              >
                {loading ? 'Flagging...' : 'Submit Flag'}
              </button>

              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="flex-1 glass-surface border border-glass-border px-4 py-2 rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 