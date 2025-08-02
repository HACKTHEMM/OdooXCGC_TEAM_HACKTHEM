'use client';

import { useState } from 'react';
import { User } from '../../types/database';
import { apiClient } from '../../lib/api-client';

interface UserManagementProps {
  users: User[];
  onUsersUpdate: (users: User[]) => void;
}

export default function UserManagement({ users, onUsersUpdate }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.is_banned) ||
                         (filterStatus === 'banned' && user.is_banned);
    return matchesSearch && matchesFilter;
  });

  const handleBanUser = async (userId: number, ban: boolean) => {
    try {
      setLoading(true);
      const response = await apiClient.banUser(userId);
      
      if (response.success) {
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, is_banned: ban } : user
        );
        onUsersUpdate(updatedUsers);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isBanned: boolean) => {
    return isBanned 
      ? 'bg-red-500/20 text-red-500 border-red-500/30' 
      : 'bg-green-500/20 text-green-500 border-green-500/30';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text-charcoal mb-2">
          User Management
        </h2>
        <p className="text-text-secondary">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-bright-blue to-vibrant-pink rounded-xl flex items-center justify-center text-white text-xl">
              👥
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {users.length}
              </h3>
              <p className="text-text-secondary text-sm">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-iridescent-purple rounded-xl flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {users.filter(u => !u.is_banned).length}
              </h3>
              <p className="text-text-secondary text-sm">Active Users</p>
            </div>
          </div>
        </div>
        
        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-vibrant-pink to-bright-blue rounded-xl flex items-center justify-center text-white text-xl">
              🚫
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {users.filter(u => u.is_banned).length}
              </h3>
              <p className="text-text-secondary text-sm">Banned Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filterStatus === 'all'
                  ? 'bg-accent-primary text-white'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filterStatus === 'active'
                  ? 'bg-accent-primary text-white'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('banned')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filterStatus === 'banned'
                  ? 'bg-accent-primary text-white'
                  : 'glass-surface border border-glass-border text-text-secondary hover:text-accent-primary'
              }`}
            >
              Banned
            </button>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold gradient-text-charcoal mb-6">
          Users ({filteredUsers.length})
        </h3>
        
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="glass-surface rounded-xl p-4 border border-glass-border hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {user.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">
                      {user.user_name}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(user.is_banned)}`}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                      <span className="text-xs text-text-secondary">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.is_banned ? (
                    <button
                      onClick={() => handleBanUser(user.id, false)}
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBanUser(user.id, true)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Ban
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="px-4 py-2 glass-surface border border-glass-border rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-text-secondary">
                No users found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-modern p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text-charcoal">
                User Details
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-text-secondary hover:text-accent-primary"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">Name</label>
                <p className="text-text-primary font-medium">{selectedUser.user_name}</p>
              </div>
              
              <div>
                <label className="text-text-secondary text-sm">Email</label>
                <p className="text-text-primary font-medium">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="text-text-secondary text-sm">Status</label>
                <p className={`font-medium ${selectedUser.is_banned ? 'text-red-500' : 'text-green-500'}`}>
                  {selectedUser.is_banned ? 'Banned' : 'Active'}
                </p>
              </div>
              
              <div>
                <label className="text-text-secondary text-sm">Joined</label>
                <p className="text-text-primary">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="text-text-secondary text-sm">Last Updated</label>
                <p className="text-text-primary">
                  {new Date(selectedUser.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              {selectedUser.is_banned ? (
                <button
                  onClick={() => {
                    handleBanUser(selectedUser.id, false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 btn-modern"
                >
                  Unban User
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleBanUser(selectedUser.id, true);
                    setSelectedUser(null);
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Ban User
                </button>
              )}
              
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 glass-surface border border-glass-border px-4 py-2 rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
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