import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function EventBar({ data=[] }){
  if(!data || data.length===0) return <div>No event data</div>;
  const chartData = data.map(d=>({event:d.eventType, revenue:d.revenue, orders:d.orders}));
  return (
    <div style={{height:280}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{top:5,right:20,left:20,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="event" />
          <YAxis />
          <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
          <Bar dataKey="revenue" fill="var(--accent-3)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
