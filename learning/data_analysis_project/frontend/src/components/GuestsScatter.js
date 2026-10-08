import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GuestsScatter({ data=[] }){
  if(!data || data.length===0) return <div>No scatter data</div>;
  const chartData = data.map(d=>({ x: d.guests, y: d.amount }));
  return (
    <div style={{height:320}}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{top:10, right: 20, bottom: 20, left: 20}}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Guests" unit="" />
          <YAxis type="number" dataKey="y" name="Amount" unit="" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v)=>Number(v).toLocaleString()} />
          <Scatter name="Orders" data={chartData} fill="var(--accent)" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
