
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const data = [
  { name: 'Water Works', Resolved: 400, Pending: 240 },
  { name: 'Sanitation', Resolved: 300, Pending: 139 },
  { name: 'Public Works', Resolved: 200, Pending: 980 },
  { name: 'Electricity', Resolved: 278, Pending: 390 },
  { name: 'Traffic', Resolved: 189, Pending: 480 },
];

const DepartmentPerformanceChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pending" fill="#f59e0b" />
              <Bar dataKey="Resolved" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentPerformanceChart;
