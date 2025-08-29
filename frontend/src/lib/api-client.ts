// API client for CivicTrack application database operations

import {
  User,
  Issue,
  Category,
  CreateIssueForm,
  IssueFilters,
  PaginatedResponse,
  IssuePhoto,
  CreateUserForm,
  LoginRequest,
  PasswordChangeRequest,
  ProfileUpdateRequest,
  IssueStatus
} from '../types/database';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civictrackk.vercel.app/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Add JWT token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
      };

      // Only add Content-Type for non-FormData requests
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Auth endpoints
  async register(userData: CreateUserForm): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/users/me');
  }

  // Issue endpoints
  async getIssues(filters?: IssueFilters, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Issue>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters || {}).map(([key, value]) => [key, String(value)])
      ),
    });

    return this.request(`/issues?${params}`);
  }

  async getIssueById(id: number): Promise<ApiResponse<Issue>> {
    return this.request(`/issues/${id}`);
  }

  async createIssue(issueData: CreateIssueForm): Promise<ApiResponse<Issue>> {
    const formData = new FormData();
    Object.entries(issueData).forEach(([key, value]) => {
      if (key !== 'photos') {
        formData.append(key, String(value));
      }
    });

    if (issueData.photos) {
      issueData.photos.forEach((photo, index) => {
        formData.append(`images`, photo);
      });
    }

    return this.request('/issues', {
      method: 'POST',
      body: formData,
    });
  }

  async addComment(issueId: number, comment: string): Promise<ApiResponse<void>> {
    return this.request(`/issues/${issueId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ comment_text: comment }),
    });
  }

  async updateIssueStatus(issueId: number, status: IssueStatus): Promise<ApiResponse<void>> {
    return this.request(`/issues/${issueId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status_id: status.id || 1, change_reason: `Status changed to ${status.name}` }),
    });
  }

  async flagIssue(issueId: number, reason: string): Promise<ApiResponse<void>> {
    return this.request(`/issues/${issueId}/flag`, {
      method: 'POST',
      body: JSON.stringify({ flag_reason: reason }),
    });
  }

  async upvoteIssue(issueId: number): Promise<ApiResponse<void>> {
    return this.request(`/issues/${issueId}/upvote`, {
      method: 'POST',
    });
  }

  async downvoteIssue(issueId: number): Promise<ApiResponse<void>> {
    return this.request(`/issues/${issueId}/downvote`, {
      method: 'POST',
    });
  }

  async getMapIssues(): Promise<ApiResponse<Issue[]>> {
    return this.request('/issues/map');
  }

  async getNearbyIssues(lat: number, lng: number, radius: number): Promise<ApiResponse<Issue[]>> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString()
    });
    return this.request(`/issues/nearby?${params}`);
  }

  // Admin endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/admin/users');
  }

  async banUser(userId: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'PUT',
    });
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request('/issues/categories');
  }

  async createCategory(category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(categoryId: number, category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request(`/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(categoryId: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  async getFlaggedIssues(): Promise<ApiResponse<Issue[]>> {
    return this.request('/admin/issues/flagged');
  }

  async hideIssue(issueId: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/issues/${issueId}/hide`, {
      method: 'PUT',
    });
  }

  async deleteIssue(issueId: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/issues/${issueId}/delete`, {
      method: 'DELETE',
    });
  }

  async getAnalyticsSummary(): Promise<ApiResponse<AnalyticsSummary>> {
    return this.request('/admin/analytics/summary');
  }

  // Public statistics endpoint (no authentication required)
  async getPublicStats(): Promise<ApiResponse<AnalyticsSummary>> {
    return this.request('/issues/stats');
  }

  // Image upload endpoint
  async uploadImage(formData: FormData): Promise<ApiResponse<IssuePhoto>> {
    return this.request('/uploads/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Let the browser set the appropriate Content-Type for FormData
    });
  }

  // Notifications endpoint
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request('/notifications');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;

// Export utility functions for common operations
export const formatApiError = (error: string): string => {
  // Format API errors for user display
  if (error.includes('Network')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (error.includes('401')) {
    return 'Authentication required. Please log in again.';
  }
  if (error.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  if (error.includes('404')) {
    return 'The requested resource was not found.';
  }
  if (error.includes('500')) {
    return 'Server error. Please try again later.';
  }
  return error;
};

export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } => {
  return response.success && response.data !== undefined;
};
