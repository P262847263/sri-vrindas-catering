import React from 'react';

export default function Filters({ filters, setFilters, cities=[], events=[], packages=[], onApply }){
  return (
    <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
      <div>
        <label>Start</label><br/>
        <input type="date" value={filters.start||''} onChange={e=>setFilters(f=>({...f,start:e.target.value}))} />
      </div>
      <div>
        <label>End</label><br/>
        <input type="date" value={filters.end||''} onChange={e=>setFilters(f=>({...f,end:e.target.value}))} />
      </div>
      <div>
        <label>City</label><br/>
        <select value={filters.city||''} onChange={e=>setFilters(f=>({...f,city:e.target.value}))}>
          <option value="">All</option>
          {cities.map(c=> <option key={c.city||c} value={c.city||c}>{c.city||c}</option>)}
        </select>
      </div>
      <div>
        <label>Event Type</label><br/>
        <select value={filters.eventType||''} onChange={e=>setFilters(f=>({...f,eventType:e.target.value}))}>
          <option value="">All</option>
          {events.map(e=> <option key={e.eventType||e} value={e.eventType||e}>{e.eventType||e}</option>)}
        </select>
      </div>
      <div>
        <label>Package</label><br/>
        <select value={filters.package||''} onChange={e=>setFilters(f=>({...f,package:e.target.value}))}>
          <option value="">All</option>
          {packages.map(p=> <option key={p.package||p} value={p.package||p}>{p.package||p}</option>)}
        </select>
      </div>
      <div>
        <button onClick={onApply} style={{padding:'8px 12px',background:'#2563eb',color:'#fff',border:'none',borderRadius:6}}>Apply</button>
      </div>
    </div>
  );
}
