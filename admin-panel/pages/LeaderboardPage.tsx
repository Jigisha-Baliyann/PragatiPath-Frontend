
import React from 'react';
import { LeaderboardUser } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Trophy, UserCircle } from '../components/shared/Icons';

const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Vikram Bose', points: 1750, reports: 35, confirmations: 50, upvotes: 200 },
  { rank: 2, name: 'Amit Patel', points: 1250, reports: 25, confirmations: 40, upvotes: 150 },
  { rank: 3, name: 'Priya Singh', points: 900, reports: 18, confirmations: 30, upvotes: 100 },
  { rank: 4, name: 'Rohan Mehta', points: 850, reports: 15, confirmations: 25, upvotes: 90 },
  { rank: 5, name: 'Anjali Sharma', points: 700, reports: 12, confirmations: 20, upvotes: 80 },
];

const PodiumCard: React.FC<{ user: LeaderboardUser, color: string, height: string, iconSize: string }> = ({ user, color, height, iconSize }) => (
    <div className="flex flex-col items-center">
        <div className={`text-5xl font-bold ${color}`}>{user.rank}</div>
        <div className={`relative ${height} w-24 flex flex-col justify-end items-center bg-gray-200 dark:bg-gray-700 rounded-t-lg p-2`}>
            <Trophy className={`absolute -top-6 ${iconSize} ${color}`} />
            <div className="mt-4 text-center">
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{user.points} pts</p>
            </div>
        </div>
    </div>
)

const LeaderboardPage: React.FC = () => {
  const [top3, rest] = [mockLeaderboard.slice(0, 3), mockLeaderboard.slice(3)];
  const [second, first, third] = [top3[1], top3[0], top3[2]];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Community Leaderboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top Citizens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end space-x-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {second && <PodiumCard user={second} color="text-gray-400" height="h-32" iconSize="h-10 w-10"/>}
            {first && <PodiumCard user={first} color="text-yellow-400" height="h-40" iconSize="h-12 w-12"/>}
            {third && <PodiumCard user={third} color="text-yellow-600" height="h-24" iconSize="h-8 w-8"/>}
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upvotes</th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {rest.map((user) => (
                    <tr key={user.rank}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.rank}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 dark:text-white">{user.points}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.reports}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.confirmations}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.upvotes}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </CardContent>
         <CardFooter className="flex justify-end space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Export as PDF</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Export as CSV</button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
