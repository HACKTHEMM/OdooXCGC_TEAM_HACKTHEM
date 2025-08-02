"use client"

import { useState } from 'react';
import dynamic from 'next/dynamic';
import IssueTracker from '@/components/issue-tracker';
import ReportIssueForm from '@/components/report-issue-form';
import IssueDetail from '@/components/issue-detail';

// Dynamically import map wrapper to avoid SSR issues
const MapWrapper = dynamic(() => import('@/components/map-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

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
    distance?: number; // Distance from user in km
  };
  reportedBy: string;
  reportedAt: Date;
  priority: 'low' | 'medium' | 'high';
  images: string[]; // Up to 3 images
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

interface IssueForm {
  title: string;
  description: string;
  category: 'roads' | 'lighting' | 'water-supply' | 'cleanliness' | 'public-safety' | 'obstructions';
  priority: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: File[]; // Up to 3 images
  reporterName: string;
  reporterContact: string;
  isAnonymous: boolean;
}

// Sample data for demonstration
const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Water pipe burst on Main Street',
    description: 'Large water pipe has burst causing flooding on the main road. Traffic is heavily affected and water supply to nearby houses is disrupted.',
    category: 'water-supply',
    status: 'reported',
    location: {
      lat: 24.6339,
      lng: 73.2496,
      address: 'Main Street, Kotra, Rajasthan',
      distance: 1.2,
    },
    reportedBy: 'Rajesh Kumar',
    reportedAt: new Date('2024-01-15'),
    priority: 'high',
    images: ['/placeholder-images/water-pipe.svg'],
    isAnonymous: false,
    statusHistory: [
      {
        id: '1-1',
        status: 'reported',
        timestamp: new Date('2024-01-15'),
        updatedBy: 'System',
        note: 'Issue reported by citizen'
      }
    ],
    flagCount: 0,
    isHidden: false,
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Street light not working',
    description: 'Multiple street lights along the highway are not functioning, creating safety hazards during night time.',
    category: 'lighting',
    status: 'in-progress',
    location: {
      lat: 24.6400,
      lng: 73.2550,
      address: 'Highway Road, Kotra, Rajasthan',
      distance: 2.1,
    },
    reportedBy: 'Anonymous',
    reportedAt: new Date('2024-01-14'),
    priority: 'medium',
    images: ['/placeholder-images/street-light.svg'],
    isAnonymous: true,
    statusHistory: [
      {
        id: '2-1',
        status: 'reported',
        timestamp: new Date('2024-01-14'),
        updatedBy: 'System',
        note: 'Issue reported anonymously'
      },
      {
        id: '2-2',
        status: 'in-progress',
        timestamp: new Date('2024-01-16'),
        updatedBy: 'Municipal Worker',
        note: 'Maintenance team assigned to repair'
      }
    ],
    flagCount: 0,
    isHidden: false,
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Pothole on connecting road',
    description: 'Large pothole developed after recent rains, causing vehicle damage and traffic slowdown.',
    category: 'roads',
    status: 'reported',
    location: {
      lat: 24.6280,
      lng: 73.2450,
      address: 'Connecting Road, Kotra, Rajasthan',
      distance: 3.5,
    },
    reportedBy: 'Amit Patel',
    reportedAt: new Date('2024-01-13'),
    priority: 'medium',
    images: ['/placeholder-images/pothole.svg', '/placeholder-images/pothole.svg'],
    isAnonymous: false,
    statusHistory: [
      {
        id: '3-1',
        status: 'reported',
        timestamp: new Date('2024-01-13'),
        updatedBy: 'System',
        note: 'Issue reported with photos'
      }
    ],
    flagCount: 0,
    isHidden: false,
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    title: 'Overflowing garbage bin',
    description: 'Garbage bin has been overflowing for 3 days in the residential area, causing hygiene issues and attracting pests.',
    category: 'cleanliness',
    status: 'resolved',
    location: {
      lat: 24.6350,
      lng: 73.2520,
      address: 'Residential Area, Kotra, Rajasthan',
      distance: 0.8,
    },
    reportedBy: 'Sunita Singh',
    reportedAt: new Date('2024-01-10'),
    priority: 'low',
    images: ['/placeholder-images/garbage-bin.svg'],
    isAnonymous: false,
    statusHistory: [
      {
        id: '4-1',
        status: 'reported',
        timestamp: new Date('2024-01-10'),
        updatedBy: 'System',
        note: 'Issue reported by citizen'
      },
      {
        id: '4-2',
        status: 'in-progress',
        timestamp: new Date('2024-01-11'),
        updatedBy: 'Sanitation Department',
        note: 'Cleaning crew dispatched'
      },
      {
        id: '4-3',
        status: 'resolved',
        timestamp: new Date('2024-01-12'),
        updatedBy: 'Sanitation Department',
        note: 'Garbage collected and bin cleaned'
      }
    ],
    flagCount: 0,
    isHidden: false,
    updatedAt: new Date('2024-01-12'),
  }
];

type ViewMode = 'list' | 'map' | 'report' | 'detail';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [issues, setIssues] = useState<Issue[]>(sampleIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleAddIssue = () => {
    setCurrentView('report');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleViewMap = () => {
    setCurrentView('map');
  };

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setCurrentView('detail');
  };

  const handleFlagIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, flagCount: issue.flagCount + 1, isHidden: issue.flagCount + 1 >= 3 }
        : issue
    ));
  };

  const handleShareIssue = (issue: Issue) => {
    if (navigator.share) {
      navigator.share({
        title: `CivicTrack Issue: ${issue.title}`,
        text: issue.description,
        url: window.location.href + `?issue=${issue.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${issue.title} - ${issue.description}\n${window.location.href}?issue=${issue.id}`);
      alert('Issue details copied to clipboard!');
    }
  };

  const handleSubmitIssue = async (issueForm: IssueForm) => {
    const newIssue: Issue = {
      id: Math.random().toString(36).slice(2),
      title: issueForm.title,
      description: issueForm.description,
      category: issueForm.category,
      status: 'reported',
      location: issueForm.location,
      reportedBy: issueForm.isAnonymous ? 'Anonymous' : issueForm.reporterName,
      reportedAt: new Date(),
      priority: issueForm.priority,
      images: issueForm.images.map((file: File) => URL.createObjectURL(file)),
      isAnonymous: issueForm.isAnonymous,
      statusHistory: [
        {
          id: `${Math.random().toString(36).slice(2)}-1`,
          status: 'reported',
          timestamp: new Date(),
          updatedBy: 'System',
          note: issueForm.isAnonymous ? 'Issue reported anonymously' : 'Issue reported by citizen'
        }
      ],
      flagCount: 0,
      isHidden: false,
      updatedAt: new Date(),
    };

    setIssues(prev => [newIssue, ...prev]);
    setCurrentView('list');
  };

  if (currentView === 'report') {
    return (
      <ReportIssueForm
        onSubmit={handleSubmitIssue}
        onCancel={handleBackToList}
      />
    );
  }

  if (currentView === 'detail' && selectedIssue) {
    return (
      <IssueDetail 
        issue={selectedIssue}
        onBack={handleBackToList}
        onFlag={() => handleFlagIssue(selectedIssue.id)}
        onShare={() => handleShareIssue(selectedIssue)}
        onViewMap={handleViewMap}
      />
    );
  }

  if (currentView === 'map') {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Issues Map View</h1>
            <div className="flex gap-2">
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Back to List
              </button>
              <button
                onClick={handleAddIssue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <MapWrapper csvUrl="/sample-data.csv" />
        </div>
      </div>
    );
  }

  return (
    <IssueTracker
      issues={issues}
      onAddIssue={handleAddIssue}
      onViewMap={handleViewMap}
      currentView={currentView}
      onSelectIssue={handleSelectIssue}
      onFlagIssue={handleFlagIssue}
      onShareIssue={handleShareIssue}
    />
  );
}
