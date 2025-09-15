import React from 'react';

// ==============================
// Enums
// ==============================
export enum IssueStatus {
  Reported = 'Reported',
  Acknowledged = 'Acknowledged',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export enum IssueCategory {
  Pothole = 'Pothole',
  Streetlight = 'Broken Streetlight',
  Waste = 'Waste Management',
  Graffiti = 'Graffiti',
  PublicTransport = 'Public Transport',
  Other = 'Other',
}

export enum Department {
  PublicWorks = 'Public Works',
  Sanitation = 'Sanitation',
  ParksAndRec = 'Parks and Recreation',
  Transportation = 'Transportation',
  CodeEnforcement = 'Code Enforcement',
}

// ==============================
// Badge Interface
// ==============================
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

// ==============================
// Comment Interface
// ==============================
export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  text: string;
  timestamp: Date;
}

// ==============================
// Issue Interface
// ==============================
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  imageUrl?: string;
  address: string;
  reportedBy: string;
  reportedAt: Date;
  upvotes: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  timeline: {
    status: IssueStatus;
    date: Date;
    notes?: string;
  }[];
  comments?: Comment[];
  assignedDepartment?: Department;
}

// ==============================
// User Interfaces
// ==============================
export interface User {
  id: string;
  name: string;
  email?: string; // optional for phone/Aadhaar login
  password?: string; // for mock/demo purposes only
  role: 'admin' | 'citizen';
  avatarUrl: string;
  points?: number;
  rank?: number;
  badges?: Badge[];
  phone?: string;
  aadhaar?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;     // optional for OTP login
  role: 'admin' | 'citizen';
  avatarUrl: string;
  phone?: string;     // for OTP login
  aadhaar?: string;   // for Aadhaar login
}

// ==============================
// Optional: API Response Types
// ==============================
export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export interface OTPResponse {
  success: boolean;
  otp?: string; // for testing/demo
  message?: string;
}
