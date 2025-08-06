"use client"

import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, User, Flag, CheckCircle, AlertCircle, Camera, Share2, Calendar } from 'lucide-react';
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

interface IssueDetailProps {
  issue: Issue;
  onBack: () => void;
  onFlag?: (issueId: string) => void;
  onShare?: (issue: Issue) => void;
  onViewMap?: () => void;
}

export default function IssueDetail({ issue, onBack, onFlag, onShare, onViewMap }: IssueDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water-supply': return 'bg-blue-100 text-black border-blue-200';
      case 'lighting': return 'bg-yellow-100 text-black border-yellow-200';
      case 'roads': return 'bg-gray-100 text-black border-gray-200';
      case 'cleanliness': return 'bg-green-100 text-black border-green-200';
      case 'public-safety': return 'bg-red-100 text-black border-red-200';
      case 'obstructions': return 'bg-orange-100 text-black border-orange-200';
      default: return 'bg-purple-100 text-black border-purple-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-50 text-black border-red-200';
      case 'in-progress': return 'bg-orange-50 text-black border-orange-200';
      case 'resolved': return 'bg-green-50 text-black border-green-200';
      default: return 'bg-gray-50 text-black border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-black bg-red-50 border-red-200';
      case 'medium': return 'text-black bg-yellow-50 border-yellow-200';
      case 'low': return 'text-black bg-green-50 border-green-200';
      default: return 'text-black bg-gray-50 border-gray-200';
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
      <div className="glass-surface border-b border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-gray dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green glass-surface px-4 py-2 rounded-xl border border-glass-light-hover dark:border-glass-dark-hover hover:shadow-neon transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Issues
              </button>
            </div>
            <div className="flex items-center gap-2">
              {onShare && (
                <button
                  onClick={() => onShare(issue)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-gray dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green glass-surface rounded-xl border border-glass-light-hover dark:border-glass-dark-hover hover:shadow-neon transition-all duration-300"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              )}
              {onFlag && issue.flagCount < 3 && (
                <button
                  onClick={() => onFlag(issue.id)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-gray dark:text-soft-gray hover:text-red-500 dark:hover:text-red-400 glass-surface rounded-xl border border-glass-light-hover dark:border-glass-dark-hover hover:shadow-neon transition-all duration-300"
                >
                  <Flag className="h-4 w-4" />
                  Flag ({issue.flagCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Issue Header */}
            <div className="glass-surface rounded-2xl p-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold gradient-text-charcoal mb-4">{issue.title}</h1>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${getCategoryColor(issue.category)} backdrop-blur-sm`}>
                      {getCategoryIcon(issue.category)} {getCategoryLabel(issue.category)}
                    </span>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(issue.status)} backdrop-blur-sm`}>
                      {getStatusIcon(issue.status)}
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${getPriorityColor(issue.priority)} backdrop-blur-sm`}>
                      {issue.priority.toUpperCase()} PRIORITY
                    </span>
                    {issue.isAnonymous && (
                      <span className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-iridescent-purple/20 to-vibrant-pink/20 dark:from-iridescent-purple/30 dark:to-neon-green/30 text-iridescent-purple dark:text-neon-green border border-iridescent-purple/30 dark:border-neon-green/30 backdrop-blur-sm">
                        ANONYMOUS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-black leading-relaxed">{issue.description}</p>
              </div>
            </div>

            {/* Images */}
            {issue.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photos ({issue.images.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issue.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer group"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`${issue.title} - Image ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg border hover:shadow-md transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-black text-sm font-medium">
                          Click to enlarge
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status History
              </h2>
              <div className="space-y-4">
                {issue.statusHistory.map((change) => (
                  <div key={change.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(change.status)}`}>
                        {getStatusIcon(change.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-black">
                          {change.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-black">
                          {change.timestamp.toLocaleDateString()} at {change.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-black">
                        Updated by: <span className="font-medium">{change.updatedBy}</span>
                      </p>
                      {change.note && (
                        <p className="text-sm text-black mt-1">{change.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-black">{issue.location.address}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-black">
                  <div>
                    <span className="font-medium">Latitude:</span>
                    <br />
                    {issue.location.lat.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span>
                    <br />
                    {issue.location.lng.toFixed(6)}
                  </div>
                </div>
                {issue.location.distance && (
                  <div className="flex items-center gap-1 text-sm text-black">
                    <MapPin className="h-4 w-4" />
                    {issue.location.distance.toFixed(1)} km from you
                  </div>
                )}
                <button
                  onClick={onViewMap}
                  className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  View on Map
                </button>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Reporter
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-black">{issue.reportedBy}</span>
                  {issue.isAnonymous && (
                    <span className="px-2 py-1 bg-purple-100 text-black text-xs rounded-full">
                      Anonymous
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-black">
                  <Calendar className="h-4 w-4" />
                  Reported on {issue.reportedAt.toLocaleDateString()}
                </div>
                <div className="text-sm text-black">
                  Last updated: {issue.updatedAt.toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Issue Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Issue Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black">Issue ID:</span>
                  <span className="font-mono text-black">#{issue.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Priority:</span>
                  <span className={`font-medium ${issue.priority === 'high' ? 'text-black' :
                    issue.priority === 'medium' ? 'text-black' :
                      'text-black'
                    }`}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Status Updates:</span>
                  <span className="font-medium text-black">{issue.statusHistory.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Photos:</span>
                  <span className="font-medium text-black">{issue.images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Flags:</span>
                  <span className="font-medium text-black">{issue.flagCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={issue.images[selectedImageIndex]}
              alt={`${issue.title} - Image ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75"
            >
              ×
            </button>
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded">
              {selectedImageIndex + 1} of {issue.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
