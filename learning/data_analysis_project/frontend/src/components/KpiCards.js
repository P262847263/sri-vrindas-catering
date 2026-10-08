import React from 'react';

function fmt(v){
  if (v === null || v === undefined) return '-';
  if (typeof v === 'number') return v.toLocaleString(undefined, {maximumFractionDigits:2});
  return v;
}

export default function KpiCards({ summary }) {
  if (!summary) return null;
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div style={{fontSize:12,color:'var(--muted)'}}>Total Revenue</div>
        <div className="kpi-value">₹ {fmt(summary.totalRevenue)}</div>
      </div>
      <div className="kpi-card">
        <div style={{fontSize:12,color:'var(--muted)'}}>Total Orders</div>
        <div className="kpi-value">{fmt(summary.totalOrders)}</div>
      </div>
      <div className="kpi-card">
        <div style={{fontSize:12,color:'var(--muted)'}}>Total Customers</div>
        <div className="kpi-value">{fmt(summary.totalCustomers)}</div>
      </div>
      <div className="kpi-card">
        <div style={{fontSize:12,color:'var(--muted)'}}>Total Guests</div>
        <div className="kpi-value">{fmt(summary.totalGuests)}</div>
      </div>
      <div className="kpi-card">
        <div style={{fontSize:12,color:'var(--muted)'}}>Avg Order Value</div>
        <div className="kpi-value">₹ {fmt(summary.avgOrderValue)}</div>
      </div>
    </div>
  );
}

