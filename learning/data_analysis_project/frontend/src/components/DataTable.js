import React from 'react';

export default function DataTable({ data = [] }) {
  if (!data || data.length === 0) return <div>No data to display</div>;
  const cols = Object.keys(data[0]);
  return (
    <div style={{ overflowX: 'auto', marginTop: 12 }}>
      <table>
        <thead>
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c + i}>{String(row[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
