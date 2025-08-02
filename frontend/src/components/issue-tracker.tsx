"use client"

import { useState } from 'react';
import { Search, Plus, MapPin, List, Bell, User, Flag, Clock, CheckCircle, Share2 } from 'lucide-react';
import Image from 'next/image';

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
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDistance, setFilterDistance] = useState<string>('all');

  const filteredIssues = issues.filter(issue => {
    if (issue.isHidden) return false; // Don't show hidden issues
    
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesDistance = filterDistance === 'all' || 
                           (issue.location.distance !== undefined && 
                            issue.location.distance <= parseFloat(filterDistance));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDistance;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water-supply': return 'bg-blue-100 text-blue-800';
      case 'lighting': return 'bg-yellow-100 text-yellow-800';
      case 'roads': return 'bg-gray-100 text-gray-800';
      case 'cleanliness': return 'bg-green-100 text-green-800';
      case 'public-safety': return 'bg-red-100 text-red-800';
      case 'obstructions': return 'bg-orange-100 text-orange-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water-supply': return '💧';
      case 'lighting': return '💡';
      case 'roads': return '🛣️';
      case 'cleanliness': return '🗑️';
      case 'public-safety': return '⚠️';
      case 'obstructions': return '🚧';
      default: return '📋';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'water-supply': return 'Water Supply';
      case 'lighting': return 'Lighting';
      case 'roads': return 'Roads';
      case 'cleanliness': return 'Cleanliness';
      case 'public-safety': return 'Public Safety';
      case 'obstructions': return 'Obstructions';
      default: return category;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Issue Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="roads">Roads</option>
                <option value="lighting">Lighting</option>
                <option value="water-supply">Water Supply</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="public-safety">Public Safety</option>
                <option value="obstructions">Obstructions</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="reported">Reported</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filterDistance}
                onChange={(e) => setFilterDistance(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Distances</option>
                <option value="1">Within 1 km</option>
                <option value="3">Within 3 km</option>
                <option value="5">Within 5 km</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onViewMap}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  currentView === 'map'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                Map View
              </button>
              
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  currentView === 'list'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
                List View
              </button>

              <button
                onClick={onAddIssue}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Report Issue
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
              </div>
              <div className="ml-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <List className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Reported</p>
                <p className="text-2xl font-bold text-red-600">
                  {issues.filter(i => i.status === 'reported').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {issues.filter(i => i.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(issue.priority)} p-6 hover:shadow-md transition-shadow`}
            >
              {issue.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {issue.images.slice(0, 3).map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${issue.title} - Image ${index + 1}`}
                      width={120}
                      height={80}
                      className="w-20 h-16 object-cover rounded border"
                    />
                  ))}
                  {issue.images.length > 3 && (
                    <div className="w-20 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                      +{issue.images.length - 3} more
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {issue.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                  {issue.status.replace('-', ' ')}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {issue.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(issue.category)}`}>
                  {getCategoryIcon(issue.category)} {getCategoryLabel(issue.category)}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {issue.priority} priority
                </span>
                {issue.location.distance && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {issue.location.distance.toFixed(1)} km away
                  </span>
                )}
                {issue.isAnonymous && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Anonymous
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{issue.location.address}</span>
                </div>
                <span>
                  {issue.reportedAt.toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Reported by: <span className="font-medium">{issue.reportedBy}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectIssue?.(issue)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                    {issue.flagCount < 3 && (
                      <button
                        onClick={() => onFlagIssue?.(issue.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                      >
                        <Flag className="h-3 w-3" />
                        Flag ({issue.flagCount})
                      </button>
                    )}
                    <button
                      onClick={() => onShareIssue?.(issue)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                    >
                      <Share2 className="h-3 w-3" />
                      Share
                    </button>
                  </div>
                </div>
                
                {/* Status History Preview */}
                {issue.statusHistory.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Last update: {issue.statusHistory[issue.statusHistory.length - 1].timestamp.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
