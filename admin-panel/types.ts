
export type Page = 'Dashboard' | 'Reports' | 'Users' | 'Leaderboard' | 'Help' | 'Profile' | 'Settings' | 'DigitalSignature';

export interface Report {
  id: string;
  category: 'Pothole' | 'Waste Management' | 'Streetlight' | 'Water Leakage' | 'Other';
  location: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  reporter: string;
  assignedTo: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface User {
  id: string;
  name: string;
  aadhaarStatus: 'Verified' | 'Pending' | 'Not Linked';
  reportsFiled: number;
  points: number;
  joinDate: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  reports: number;
  confirmations: number;
  upvotes: number;
}