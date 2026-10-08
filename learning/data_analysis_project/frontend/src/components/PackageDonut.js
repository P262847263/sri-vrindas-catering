import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['var(--accent-2)','var(--accent-3)','var(--accent-warm)','var(--accent)','var(--accent-2)'];

export default function PackageDonut({ data = [] }){
  if(!data || data.length===0) return <div>No package data</div>;
  const chartData = data.map(d=>({name:d.package, value:d.orders || d.revenue || 0}));
  return (
    <div style={{height:260}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} fill="var(--accent-3)" label />
          {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
