import { useState, useEffect, useCallback } from 'react';
import { apiService, DashboardStats, Issue, User, Activity } from '../services/apiService';

// Custom hook for dashboard data
export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Custom hook for issues management
export const useIssues = (page = 1, limit = 10, filters?: any) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getIssues(page, limit, filters);
      
      if (response.success) {
        setIssues(response.data.issues);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch issues');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  const updateIssueStatus = useCallback(async (issueId: string, status: Issue['status']) => {
    try {
      const response = await apiService.updateIssueStatus(issueId, status);
      
      if (response.success) {
        // Update local state
        setIssues(prev => prev.map(issue => 
          issue.id === issueId ? { ...issue, status, updatedAt: response.data.updatedAt } : issue
        ));
        return true;
      } else {
        setError(response.error || 'Failed to update issue status');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return { 
    issues, 
    total, 
    loading, 
    error, 
    refetch: fetchIssues,
    updateIssueStatus 
  };
};

// Custom hook for users management
export const useUsers = (page = 1, limit = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUsers(page, limit);
      
      if (response.success) {
        setUsers(response.data.users);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, loading, error, refetch: fetchUsers };
};

// Custom hook for activities feed
export const useActivities = (limit = 10) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getActivities(limit);
      
      if (response.success) {
        setActivities(response.data);
      } else {
        setError(response.error || 'Failed to fetch activities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
};

// Custom hook for search functionality
export const useSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, type: 'issues' | 'users' | 'all' = 'all') => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.search(query, type);
      
      if (response.success) {
        setResults(response.data);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};
