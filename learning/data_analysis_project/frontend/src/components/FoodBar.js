import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function FoodBar({ data=[] }){
  if(!data || data.length===0) return <div>No food items data</div>;
  const chartData = data.map(d=>({item:d.item, count:d.count}));
  return (
    <div style={{height:320}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{top:5,right:20,left:20,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="item" type="category" width={220} />
          <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
          <Bar dataKey="count" fill="var(--accent-2)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
