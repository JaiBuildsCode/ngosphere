import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Food', donations: 4000 },
  { name: 'Education', donations: 3000 },
  { name: 'Health', donations: 2000 },
  { name: 'Animal', donations: 2780 },
];

const pieData = [
  { name: 'Active', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Completed', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Live Impact Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Chart 1: Donations Bar Chart */}
        <div className="h-64">
            <h3 className="text-center font-bold text-gray-500 mb-2">Donations by Category (INR)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="donations" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Chart 2: Activity Pie Chart */}
        <div className="h-64">
            <h3 className="text-center font-bold text-gray-500 mb-2">Volunteer Activity Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;