import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['var(--accent-3)','var(--accent-2)','var(--accent-warm)','var(--accent-2)','var(--accent)'];

export default function PaymentPie({ data = [] }){
  if(!data || data.length===0) return <div>No payment data</div>;
  const chartData = data.map(d=>({name:d.paymentMode, value:d.count}));
  return (
    <div style={{height:260}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label/>
          {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
