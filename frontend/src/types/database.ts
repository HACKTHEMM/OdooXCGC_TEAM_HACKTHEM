// Database schema interfaces for CivicTrack application

export interface AnalyticsSummary {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  totalUsers: number;
  activeUsers: number;
  popularCategories: Array<{
    name: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    date: string;
    details: string;
  }>;
}

export interface User {
  id: number;
  user_name: string;
  email: string;
  phone?: string;
  password_hash: string;
  is_verified: boolean;
  is_anonymous: boolean;
  is_banned: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  color_code?: string; // Hex color codes
  is_active: boolean;
  created_at: Date;
}

export interface IssueStatus {
  id: number;
  name: string;
  description?: string;
  color_code?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  category_id: number;
  status_id: number;
  reporter_id: number;
  is_anonymous: boolean;
  
  // Location information
  latitude: number;
  longitude: number;
  address?: string;
  location_description?: string;
  
  // Tracking and moderation
  is_flagged: boolean;
  flag_count: number;
  is_hidden: boolean;
  is_resolved: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  
  // Relationships
  category?: Category;
  status?: IssueStatus;
  reporter?: User;
  photos?: IssuePhoto[];
  status_history?: IssueStatusLog[];
}

export interface IssuePhoto {
  id: number;
  issue_id: number;
  photo_url: string;
  photo_order: number; // 1, 2, or 3
  file_size?: number; // in bytes
  mime_type?: string;
  uploaded_at: Date;
}

export interface IssueStatusLog {
  id: number;
  issue_id: number;
  old_status_id?: number;
  new_status_id: number;
  changed_by?: number;
  change_reason?: string;
  notes?: string;
  changed_at: Date;
  
  // Relationships
  old_status?: IssueStatus;
  new_status?: IssueStatus;
  changed_by_user?: User;
}

export interface Notification {
  id: number;
  user_id: number;
  issue_id: number;
  notification_type: 'status_update' | 'new_comment' | 'issue_resolved' | 'issue_flagged';
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
  
  // Relationships
  user?: User;
  issue?: Issue;
}

export interface IssueFlag {
  id: number;
  issue_id: number;
  flagger_id: number;
  flag_reason: 'spam' | 'inappropriate' | 'duplicate' | 'false_report' | 'other';
  flag_details?: string;
  flagged_at: Date;
  
  // Relationships
  issue?: Issue;
  flagger?: User;
}

export interface AdminUser {
  id: number;
  user_id: number;
  admin_level: 'moderator' | 'admin' | 'super_admin';
  permissions: string[]; // JSON array stored as text
  is_active: boolean;
  created_by?: number;
  created_at: Date;
  
  // Relationships
  user?: User;
  created_by_user?: User;
}

export interface AdminAction {
  id: number;
  admin_id: number;
  action_type: 'issue_status_change' | 'user_ban' | 'issue_hide' | 'category_update' | 'other';
  target_type: 'issue' | 'user' | 'category' | 'other';
  target_id: number;
  action_details?: string;
  created_at: Date;
  
  // Relationships
  admin?: AdminUser;
}

export interface UserLocation {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  address?: string;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
  
  // Relationships
  user?: User;
}

export interface DailyAnalytics {
  id: number;
  analytics_date: Date;
  total_issues_reported: number;
  total_issues_resolved: number;
  most_reported_category_id?: number;
  average_resolution_time_hours?: number;
  total_new_users: number;
  total_active_users: number;
  
  // Relationships
  most_reported_category?: Category;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types for creating/updating
export interface CreateIssueForm {
  title: string;
  description: string;
  category_id: number;
  latitude: number;
  longitude: number;
  address?: string;
  location_description?: string;
  is_anonymous: boolean;
  photos?: File[]; // For file uploads
}

export interface UpdateIssueForm {
  title?: string;
  description?: string;
  category_id?: number;
  status_id?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  location_description?: string;
  is_resolved?: boolean;
}

export interface CreateUserForm {
  user_name: string;
  email: string;
  phone?: string;
  password: string;
  is_anonymous?: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Filter and search types
export interface IssueFilters {
  category_id?: number;
  status_id?: number;
  is_resolved?: boolean;
  is_flagged?: boolean;
  distance_km?: number; // For proximity filtering
  reporter_id?: number;
  date_from?: Date;
  date_to?: Date;
  search_term?: string;
}

export interface UserFilters {
  is_verified?: boolean;
  is_banned?: boolean;
  is_anonymous?: boolean;
  date_from?: Date;
  date_to?: Date;
  search_term?: string;
}

// Default category mappings to match the component interfaces
export const CATEGORY_MAPPINGS = {
  'roads': 'Roads',
  'lighting': 'Lighting', 
  'water-supply': 'Water Supply',
  'cleanliness': 'Cleanliness',
  'public-safety': 'Public Safety',
  'obstructions': 'Obstructions'
} as const;

export const STATUS_MAPPINGS = {
  'reported': 'Reported',
  'in-progress': 'In Progress', 
  'resolved': 'Resolved',
  'closed': 'Closed'
} as const;

export const PRIORITY_MAPPINGS = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'urgent': 'Urgent'
} as const;
