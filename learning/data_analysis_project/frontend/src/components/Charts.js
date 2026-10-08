import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function findFirstNumericColumn(data) {
  if (!data || data.length === 0) return null;
  const cols = Object.keys(data[0]);
  for (const c of cols) {
    for (let i = 0; i < Math.min(20, data.length); i++) {
      const v = data[i][c];
      if (v !== null && v !== undefined && typeof v === 'number') return c;
      // also allow numeric-like strings
      if (v !== null && v !== undefined && !isNaN(Number(v))) return c;
    }
  }
  return null;
}

function buildHistogram(data, col, bins = 10) {
  const values = data.map(r => Number(r[col])).filter(v => Number.isFinite(v));
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  values.forEach(v => {
    let idx = Math.floor((v - min) / width);
    if (idx < 0) idx = 0;
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });
  return counts.map((count, i) => ({
    bin: `${(min + i * width).toFixed(2)}`,
    count
  }));
}

export default function Charts({ data = [] }) {
  const col = findFirstNumericColumn(data);
  if (!col) return <div>No numeric column found for charts.</div>;
  const hist = buildHistogram(data, col, 12);
  return (
    <div style={{ height: 300 }}>
      <h3>Histogram: {col}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hist} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bin" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
