'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'users' | 'issues' | 'categories' | 'flags';
  onTabChange: (tab: 'dashboard' | 'users' | 'issues' | 'categories' | 'flags') => void;
}

const navItems = [
  {
    id: 'dashboard' as const,
    label: 'Dashboard',
    icon: '📊',
    description: 'Overview & Analytics'
  },
  {
    id: 'users' as const,
    label: 'Users',
    icon: '👥',
    description: 'Manage Users'
  },
  {
    id: 'issues' as const,
    label: 'Issues',
    icon: '🚨',
    description: 'Issue Management'
  },
  {
    id: 'flags' as const,
    label: 'Flags',
    icon: '🚩',
    description: 'Flag Monitoring'
  },
  {
    id: 'categories' as const,
    label: 'Categories',
    icon: '🏷️',
    description: 'Category Settings'
  }
];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`glass-surface border-r border-glass-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-6 p-2 glass-surface rounded-xl border border-glass-border hover:shadow-lg transition-all duration-300"
        >
          <div className="text-center">
            <span className="text-lg">⚙️</span>
            {!isCollapsed && <span className="ml-2 text-sm text-text-secondary">Admin</span>}
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full p-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-accent-primary/20 border-accent-primary text-accent-primary shadow-lg'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary hover:border-accent-primary/50'
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </nav>

        {/* Back to Main Site */}
        {!isCollapsed && (
          <div className="mt-8 pt-6 border-t border-glass-border">
            <Link
              href="/"
              className="flex items-center p-3 glass-surface rounded-xl border border-glass-border text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-all duration-300"
            >
              <span className="text-lg">🏠</span>
              <span className="ml-3 font-medium">Back to Site</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}