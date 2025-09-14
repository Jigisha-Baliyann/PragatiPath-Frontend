import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ShieldCheck } from '../shared/Icons';

const ProgressBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
);

const SystemStatus: React.FC = () => {
    const slaCompliance = 98.2;
    const userVerificationRate = 92.5;

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                    <div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">All Systems Operational</p>
                        <p className="text-xs text-muted-foreground">Last checked: 1 minute ago</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium">SLA Compliance</h4>
                            <span className="text-sm font-bold text-green-600">{slaCompliance}%</span>
                        </div>
                        <ProgressBar value={slaCompliance} color="bg-green-500" />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium">User Verification Rate</h4>
                            <span className="text-sm font-bold text-blue-600">{userVerificationRate}%</span>
                        </div>
                        <ProgressBar value={userVerificationRate} color="bg-blue-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SystemStatus;
