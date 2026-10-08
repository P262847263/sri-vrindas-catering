import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function SalesExecBar({ data=[] }){
  if(!data || data.length===0) return <div>No sales exec data</div>;
  const chartData = data.map(d=>({salesExecutive:d.salesExecutive, revenue:d.revenue}));
  return (
    <div style={{height:320}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{top:5,right:20,left:20,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="salesExecutive" />
          <YAxis />
          <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
          <Bar dataKey="revenue" fill="var(--accent)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
