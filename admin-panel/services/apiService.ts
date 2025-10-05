// API Service for handling data operations
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  avgResolutionTime: number;
  activeReporters: number;
  trendData: {
    issues: number;
    resolved: number;
    time: number;
    reporters: number;
  };
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  reporter: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  createdAt: string;
  lastActive: string;
  reportsCount: number;
}

export interface Activity {
  id: string;
  type: 'report_created' | 'status_updated' | 'issue_resolved' | 'user_registered';
  description: string;
  timestamp: string;
  userId?: string;
  issueId?: string;
}

class ApiService {
  private baseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Dashboard data
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    // Mock data - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            totalIssues: 12543,
            resolvedIssues: 9876,
            avgResolutionTime: 48,
            activeReporters: 2350,
            trendData: {
              issues: 20.1,
              resolved: 18.3,
              time: -5,
              reporters: 2.2,
            },
          },
          success: true,
        });
      }, 500);
    });
  }

  // Issues management
  async getIssues(page = 1, limit = 10, filters?: any): Promise<ApiResponse<{ issues: Issue[]; total: number }>> {
    // Mock data - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIssues: Issue[] = [
          {
            id: 'PR-1237',
            title: 'Water Leakage Report',
            description: 'Severe water leakage near Sector 15',
            status: 'pending',
            priority: 'high',
            category: 'Water Works',
            reporter: 'Amit P.',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            location: {
              lat: 28.6139,
              lng: 77.2090,
              address: 'Sector 15, New Delhi'
            }
          },
          {
            id: 'PR-1234',
            title: 'Pothole on Main Street',
            description: 'Large pothole causing traffic issues',
            status: 'in_progress',
            priority: 'medium',
            category: 'Public Works',
            reporter: 'Priya S.',
            assignedTo: 'Public Works Dept',
            createdAt: '2024-01-14T15:20:00Z',
            updatedAt: '2024-01-15T09:15:00Z',
            location: {
              lat: 28.6141,
              lng: 77.2092,
              address: 'Main Street, New Delhi'
            }
          }
        ];

        resolve({
          data: {
            issues: mockIssues,
            total: 12543,
          },
          success: true,
        });
      }, 300);
    });
  }

  async updateIssueStatus(issueId: string, status: Issue['status']): Promise<ApiResponse<Issue>> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: issueId,
            title: 'Updated Issue',
            description: 'Issue status updated',
            status,
            priority: 'medium',
            category: 'General',
            reporter: 'Admin',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: new Date().toISOString(),
          },
          success: true,
        });
      }, 200);
    });
  }

  // Users management
  async getUsers(page = 1, limit = 10): Promise<ApiResponse<{ users: User[]; total: number }>> {
    // Mock data - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Amit P.',
            email: 'amit@example.com',
            role: 'user',
            isVerified: true,
            createdAt: '2024-01-01T00:00:00Z',
            lastActive: '2024-01-15T10:30:00Z',
            reportsCount: 15,
          },
          {
            id: '2',
            name: 'Priya S.',
            email: 'priya@example.com',
            role: 'user',
            isVerified: true,
            createdAt: '2024-01-02T00:00:00Z',
            lastActive: '2024-01-15T09:15:00Z',
            reportsCount: 8,
          },
        ];

        resolve({
          data: {
            users: mockUsers,
            total: 2350,
          },
          success: true,
        });
      }, 300);
    });
  }

  // Activities feed
  async getActivities(limit = 10): Promise<ApiResponse<Activity[]>> {
    // Mock data - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'report_created',
            description: 'Amit P. reported a new Pothole on Main St (#PR-1239)',
            timestamp: '2024-01-15T10:28:00Z',
            userId: '1',
            issueId: 'PR-1239',
          },
          {
            id: '2',
            type: 'status_updated',
            description: 'Public Works was assigned to Waste Mgmt issue #PR-1235',
            timestamp: '2024-01-15T10:15:00Z',
            issueId: 'PR-1235',
          },
          {
            id: '3',
            type: 'issue_resolved',
            description: 'Streetlight fixed at Park Ave (#PR-1236) by Electricity Dept.',
            timestamp: '2024-01-15T09:00:00Z',
            issueId: 'PR-1236',
          },
        ];

        resolve({
          data: mockActivities,
          success: true,
        });
      }, 200);
    });
  }

  // Search functionality
  async search(query: string, type: 'issues' | 'users' | 'all' = 'all'): Promise<ApiResponse<any[]>> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
          success: true,
          message: `Search results for "${query}"`,
        });
      }, 300);
    });
  }
}

export const apiService = new ApiService();
