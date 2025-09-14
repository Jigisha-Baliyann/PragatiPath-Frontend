
import React from 'react';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const mockUsers: User[] = [
  { id: 'USR-001', name: 'Amit Patel', aadhaarStatus: 'Verified', reportsFiled: 25, points: 1250, joinDate: '2023-01-15' },
  { id: 'USR-002', name: 'Priya Singh', aadhaarStatus: 'Verified', reportsFiled: 18, points: 900, joinDate: '2023-03-22' },
  { id: 'USR-003', name: 'Rajesh Kumar', aadhaarStatus: 'Pending', reportsFiled: 5, points: 250, joinDate: '2024-05-10' },
  { id: 'USR-004', name: 'Sunita Gupta', aadhaarStatus: 'Not Linked', reportsFiled: 2, points: 100, joinDate: '2024-06-01' },
  { id: 'USR-005', name: 'Vikram Bose', aadhaarStatus: 'Verified', reportsFiled: 35, points: 1750, joinDate: '2022-11-30' },
];

const UsersPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Registered Citizens</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={mockUsers} />
        </CardContent>
      </Card>
    </div>
  );
};

const UsersTable: React.FC<{ users: User[] }> = ({ users }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhaar Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports Filed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant={user.aadhaarStatus === 'Verified' ? 'success' : user.aadhaarStatus === 'Pending' ? 'warning' : 'destructive'}>{user.aadhaarStatus}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.reportsFiled}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.points}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">View History</a>
                            <a href="#" className="text-red-600 hover:text-red-900">Block</a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
