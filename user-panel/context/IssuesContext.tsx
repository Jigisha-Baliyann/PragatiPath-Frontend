import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Issue } from '../types';
import { mockIssues } from '../constants';

interface IssuesContextType {
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateIssue: (issueId: string, updates: Partial<Issue>) => void;
  getUserIssues: (userId: string) => Issue[];
  getIssuesByReporter: (reporterName: string) => Issue[];
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

const ISSUES_STORAGE_KEY = 'pragatipath_issues';

export const IssuesProvider = ({ children }: { children: ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

  // Load issues from localStorage on mount
  useEffect(() => {
    const storedIssues = localStorage.getItem(ISSUES_STORAGE_KEY);
    if (storedIssues) {
      try {
        const parsedIssues = JSON.parse(storedIssues).map((issue: any) => ({
          ...issue,
          reportedAt: new Date(issue.reportedAt),
          timeline: issue.timeline.map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }))
        }));
        setIssues(parsedIssues);
      } catch (error) {
        console.error('Error loading issues from storage:', error);
        setIssues(mockIssues);
      }
    } else {
      // Initialize with mock issues if no stored issues
      setIssues(mockIssues);
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(mockIssues));
    }
  }, []);

  // Save issues to localStorage whenever issues change
  useEffect(() => {
    if (issues.length > 0) {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
    }
  }, [issues]);

  const addIssue = (newIssue: Issue) => {
    setIssues(prevIssues => {
      const updatedIssues = [newIssue, ...prevIssues];
      return updatedIssues;
    });
  };

  const updateIssue = (issueId: string, updates: Partial<Issue>) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
  };

  const getUserIssues = (userId: string): Issue[] => {
    return issues.filter(issue => {
      // Check if the issue was reported by a user with this ID
      // This handles both mock users and authenticated users
      const mockUser = mockUsers.find(u => u.id === userId);
      if (mockUser) {
        return issue.reportedBy === mockUser.name;
      }
      // For authenticated users, we need to check by user ID or name
      // Since we don't store user ID in issues, we'll use name matching
      return false; // This will be handled by getIssuesByReporter
    });
  };

  const getIssuesByReporter = (reporterName: string): Issue[] => {
    return issues.filter(issue => issue.reportedBy === reporterName);
  };

  const value: IssuesContextType = {
    issues,
    addIssue,
    updateIssue,
    getUserIssues,
    getIssuesByReporter,
  };

  return (
    <IssuesContext.Provider value={value}>
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = (): IssuesContextType => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};
