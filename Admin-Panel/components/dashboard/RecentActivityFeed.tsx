import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { FilePlus, Zap, CheckCircle, AlertTriangle, UserPlus } from '../shared/Icons';

const activities = [
    { type: 'New Report', description: 'Amit P. reported a new Pothole on Main St (#PR-1239)', time: '2m ago' },
    { type: 'Status Update', description: 'Public Works was assigned to Waste Mgmt issue #PR-1235', time: '15m ago' },
    { type: 'Resolved', description: 'Streetlight fixed at Park Ave (#PR-1236) by Electricity Dept.', time: '1h ago' },
    { type: 'Escalation', description: 'Water Leakage at Sector 15 (#PR-1237) breached SLA', time: '3h ago' },
    { type: 'New User', description: 'Priya Singh completed Aadhaar verification.', time: '5h ago' },
];

const activityConfig = {
    'New Report': { icon: FilePlus, color: 'bg-blue-500' },
    'Status Update': { icon: Zap, color: 'bg-yellow-500' },
    'Resolved': { icon: CheckCircle, color: 'bg-green-500' },
    'Escalation': { icon: AlertTriangle, color: 'bg-red-500' },
    'New User': { icon: UserPlus, color: 'bg-indigo-500' },
};

const RecentActivityFeed: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 pl-8">
          <div className="absolute left-3.5 top-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type as keyof typeof activityConfig] || activityConfig['New Report'];
            const Icon = config.icon;
            
            return (
              <div key={index} className="relative flex items-start group">
                <div className={`absolute -left-2 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full ${config.color}`}>
                    <Icon className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 ml-4 transition-transform duration-200 group-hover:translate-x-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900">
            View All Activity
        </button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivityFeed;