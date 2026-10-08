import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function MonthlyLine({ data = [] }) {
  if (!data || data.length === 0) return <div>No monthly data</div>;
  // transform to label
  const transformed = data.map(d => ({
    label: `${d.month}/${d.year}`,
    revenue: d.revenue,
    orders: d.orders
  }));
  return (
    <div style={{height:300}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={transformed} margin={{top:10,right:20,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="var(--accent)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
