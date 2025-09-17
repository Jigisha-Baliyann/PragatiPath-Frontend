
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const data = [
  { name: 'Potholes', value: 400 },
  { name: 'Waste Mgmt', value: 300 },
  { name: 'Streetlights', value: 300 },
  { name: 'Water Leakage', value: 200 },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

const IssueCategoryChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Distribution by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCategoryChart;
