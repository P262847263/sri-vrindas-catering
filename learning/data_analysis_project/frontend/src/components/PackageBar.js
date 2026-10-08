import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function PackageBar({ data=[] }){
  if(!data || data.length===0) return <div>No package data</div>;
  const chartData = data.map(d=>({pkg:d.package, orders:d.orders, revenue:d.revenue}));
  return (
    <div style={{height:250}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{top:5,right:20,left:20,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pkg" />
          <YAxis />
          <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
          <Bar dataKey="orders" fill="var(--accent-2)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
