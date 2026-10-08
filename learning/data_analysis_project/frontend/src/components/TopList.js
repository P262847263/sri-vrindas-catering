import React from 'react';

export default function TopList({ items = [], labelKey, valueKey, subKey }) {
  if (!items || items.length === 0) return <div>No data</div>;
  return (
    <table style={{width:'100%'}}>
      <thead>
        <tr><th>Name</th><th style={{textAlign:'right'}}>Value</th><th style={{textAlign:'right'}}>Extra</th></tr>
      </thead>
      <tbody>
        {items.map((it, i) => (
          <tr key={i}>
            <td>{it[labelKey]}</td>
            <td style={{textAlign:'right'}}>{(it[valueKey]||it[valueKey]==0)?Number(it[valueKey]).toLocaleString():''}</td>
            <td style={{textAlign:'right'}}>{subKey? (it[subKey]||'') : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
