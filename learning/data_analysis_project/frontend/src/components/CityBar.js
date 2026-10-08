import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function CityBar({ data=[] }){
  if(!data || data.length===0) return <div>No city data</div>;
  const chartData = data.map(d=>({city:d.city, revenue:d.revenue, orders:d.orders}));
  return (
    <div style={{height:300}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{top:5,right:20,left:20,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="city" type="category" />
          <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
          <Bar dataKey="revenue" fill="var(--accent)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
