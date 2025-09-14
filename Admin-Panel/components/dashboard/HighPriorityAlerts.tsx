
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Siren } from '../shared/Icons';

const alerts = [
    { id: 'PR-1237', description: 'Water Leakage report has breached SLA by 4 hours.' },
    { id: 'PR-1234', description: 'Severity "High" pothole report unassigned for 24 hours.' },
    { id: 'SYS-001', description: 'Multiple reports filed for power outage in Sector 21.' },
];

const HighPriorityAlerts: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>High Priority Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 pt-0.5">
                <Siren className="w-5 h-5 text-red-500"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.description}
                </p>
                <button className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                    View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
       <CardFooter>
        <button className="w-full justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
            Manage Alerts
        </button>
      </CardFooter>
    </Card>
  );
};

export default HighPriorityAlerts;
