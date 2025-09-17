import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import useAnimatedCounter from '../hooks/useAnimatedCounter';
import DepartmentPerformanceChart from '../components/dashboard/DepartmentPerformanceChart';
import IssueCategoryChart from '../components/dashboard/IssueCategoryChart';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import HighPriorityAlerts from '../components/dashboard/HighPriorityAlerts';
import SystemStatus from '../components/dashboard/SystemStatus';
import { FileText, CheckCircle, Clock, Users, ArrowUp, ArrowDown } from '../components/shared/Icons';

const KpiCard: React.FC<{ title: string; value: number; suffix?: string; icon: React.ReactNode, trendValue: number }> = ({ title, value, suffix, icon, trendValue }) => {
    const counterRef = useAnimatedCounter<HTMLSpanElement>({ to: value });
    const isPositive = trendValue >= 0;
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    <span ref={counterRef}>0</span>
                    {suffix}
                </div>
                <div className={`mt-1 flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    <span>{Math.abs(trendValue)}% from last month</span>
                </div>
            </CardContent>
        </Card>
    );
};


const DashboardPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-600 dark:text-gray-400">A real-time snapshot of civic engagement and operational performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <KpiCard title="Total Issues Reported" value={12543} icon={<FileText className="h-5 w-5" />} trendValue={20.1} />
                        <KpiCard title="Issues Resolved" value={9876} icon={<CheckCircle className="h-5 w-5" />} trendValue={18.3} />
                        <KpiCard title="Avg Resolution Time (hrs)" value={48} icon={<Clock className="h-5 w-5"/>} trendValue={-5}/>
                        <KpiCard title="Active Reporters" value={2350} icon={<Users className="h-5 w-5" />} trendValue={2.2} />
                    </div>
                    
                    <DepartmentPerformanceChart />
                    <RecentActivityFeed />
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-8">
                    <SystemStatus />
                    <HighPriorityAlerts />
                    <IssueCategoryChart />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;