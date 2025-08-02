'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { AnalyticsSummary, User, Issue, Category } from '../../types/database';
import AdminDashboard from '../../components/admin/AdminDashboard';
import UserManagement from '../../components/admin/UserManagement';
import IssueManagement from '../../components/admin/IssueManagement';
import FlagMonitoring from '../../components/admin/FlagMonitoring';
import CategoryManagement from '../../components/admin/CategoryManagement';
import AdminSidebar from '../../components/admin/AdminSidebar';

type AdminTab = 'dashboard' | 'users' | 'issues' | 'categories' | 'flags';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsRes, usersRes, issuesRes, categoriesRes] = await Promise.all([
        apiClient.getAnalyticsSummary(),
        apiClient.getUsers(),
        apiClient.getIssues(),
        apiClient.getCategories()
      ]);

      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }

      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
      }

      if (issuesRes.success && issuesRes.data) {
        setIssues(issuesRes.data.data || []);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Admin data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading admin panel...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={loadAdminData}
              className="btn-modern px-6 py-3"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard analytics={analytics} />;
      case 'users':
        return <UserManagement users={users} onUsersUpdate={setUsers} />;
      case 'issues':
        return <IssueManagement issues={issues} onIssuesUpdate={setIssues} />;
      case 'flags':
        return <FlagMonitoring onIssueUpdate={setIssues} />;
      case 'categories':
        return <CategoryManagement categories={categories} onCategoriesUpdate={setCategories} />;
      default:
        return <AdminDashboard analytics={analytics} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-surface border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text-accent">
                Admin Panel
              </h1>
              <p className="text-text-secondary">
                Manage your CivicTrack platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-text-secondary">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Content Area */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 