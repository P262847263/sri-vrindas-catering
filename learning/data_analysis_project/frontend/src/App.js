import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Charts from './components/Charts';
import KpiCards from './components/KpiCards';
import TopList from './components/TopList';
import MonthlyLine from './components/MonthlyLine';
import PaymentPie from './components/PaymentPie';
import CityBar from './components/CityBar';
import PackageBar from './components/PackageBar';
import EventBar from './components/EventBar';
import SalesExecBar from './components/SalesExecBar';
import FoodBar from './components/FoodBar';
import DeliveryPie from './components/DeliveryPie';
import GuestsScatter from './components/GuestsScatter';
import Filters from './components/Filters';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [cities, setCities] = useState([]);
  const [events, setEvents] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [salesExec, setSalesExec] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ start: '', end: '', city: '', eventType: '', package: '' });
  const [foodItems, setFoodItems] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [scatterData, setScatterData] = useState([]);

  const fetchAll = async (appliedFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (appliedFilters.start) qs.set('start', appliedFilters.start);
      if (appliedFilters.end) qs.set('end', appliedFilters.end);
      if (appliedFilters.city) qs.set('city', appliedFilters.city);
      if (appliedFilters.eventType) qs.set('eventType', appliedFilters.eventType);
      if (appliedFilters.package) qs.set('package', appliedFilters.package);

      const qstr = qs.toString() ? `?${qs.toString()}` : '';

      const params = {};
      if (appliedFilters.start) params.start = appliedFilters.start;
      if (appliedFilters.end) params.end = appliedFilters.end;
      if (appliedFilters.city) params.city = appliedFilters.city;
      if (appliedFilters.eventType) params.eventType = appliedFilters.eventType;
      if (appliedFilters.package) params.package = appliedFilters.package;

      const requests = [
        axios.get('/api/data', { params: { limit: 500, ...params } }),
        axios.get('/api/analytics/summary', { params }),
        axios.get('/api/analytics/city', { params: { top: 5, ...params } }),
        axios.get('/api/analytics/event-type', { params }),
        axios.get('/api/analytics/package', { params }),
        axios.get('/api/analytics/monthly', { params: { year: 2026, ...params } }),
        axios.get('/api/analytics/sales-exec', { params }),
        axios.get('/api/analytics/payment-modes', { params }),
        axios.get('/api/analytics/food-items', { params }),
        axios.get('/api/analytics/delivery-status', { params }),
        axios.get('/api/analytics/guests-scatter', { params: { limit: 2000, ...params } })
      ];

      const settled = await Promise.allSettled(requests);

      const getVal = (i) => settled[i].status === 'fulfilled' ? settled[i].value : null;

      const dRes = getVal(0);
      const sumRes = getVal(1);
      const cityRes = getVal(2);
      const eventRes = getVal(3);
      const pkgRes = getVal(4);
      const monRes = getVal(5);
      const execRes = getVal(6);
      const payRes = getVal(7);
      const foodRes = getVal(8);
      const deliveryRes = getVal(9);
      const scatterRes = getVal(10);

      if (settled.some(s => s.status === 'rejected')) {
        console.warn('Some requests failed', settled.map((s,i)=> s.status==='rejected' ? {index:i, reason: s.reason && (s.reason.message || s.reason)} : null).filter(Boolean));
      }

      setData(dRes && (dRes.data.data || []) || []);
      setSummary(sumRes && sumRes.data ? sumRes.data : null);
      setCities(cityRes && (cityRes.data || cityRes.data.value) ? (cityRes.data || cityRes.data.value) : []);
      setEvents(eventRes && (eventRes.data || eventRes.data.value) ? (eventRes.data || eventRes.data.value) : []);
      setPackagesData(pkgRes && (pkgRes.data || pkgRes.data.value) ? (pkgRes.data || pkgRes.data.value) : []);
      setMonthly(monRes && (monRes.data || monRes.data.value) ? (monRes.data || monRes.data.value) : []);
      setSalesExec(execRes && (execRes.data || execRes.data.value) ? (execRes.data || execRes.data.value) : []);
      setPayments(payRes && (payRes.data || payRes.data.value) ? (payRes.data || payRes.data.value) : []);
      setFoodItems(foodRes && foodRes.data ? foodRes.data : []);
      setDeliveryStatus(deliveryRes && deliveryRes.data ? deliveryRes.data : []);
      setScatterData(scatterRes && scatterRes.data ? scatterRes.data : []);
    } catch (err) {
      console.error('fetchAll error', err.config ? err.config.url : '', err.response ? err.response.status : '', err);
      const url = err.config ? err.config.url : '';
      const status = err.response ? err.response.status : '';
      setError(`${url} -> ${status} ${err.message || 'Request failed'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchAll(filters); }, []);

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div>
            <h1 className="title">SV Data Viewer</h1>
            <div className="subtitle">Interactive dashboard — summary and breakdowns of `sv.xlsx`</div>
          </div>
          <div className="small-muted">Showing: last 90 days · Refresh to update</div>
        </div>
      {loading && <div>Loading…</div>}
      {error && <div className="error">Error: {error}</div>}
          <Filters filters={filters} setFilters={setFilters} cities={cities} events={events} packages={packagesData} onApply={()=>fetchAll(filters)} />

          {!loading && !error && (
        <>
          <KpiCards summary={summary} />
          <div className="controls">Rows: {data.length}</div>

          <div className="grid-2">
            <div className="section">
              <h3>Top Cities (by revenue)</h3>
              <CityBar data={cities} />
            </div>
            <div className="section">
              <h3>Top Event Types</h3>
              <EventBar data={events} />
            </div>
          </div>

          <div className="grid-2">
            <div className="section">
              <h3>Menu Packages</h3>
              <PackageBar data={packagesData} />
            </div>
            <div className="section">
              <h3>Payment Modes</h3>
              <PaymentPie data={payments} />
            </div>
          </div>

          <section style={{marginTop:20}}>
            <h3>Monthly Revenue (2026)</h3>
            <MonthlyLine data={monthly} />
          </section>

          <section style={{marginTop:16}}>
            <h3>Sales Executive Performance</h3>
            <SalesExecBar data={salesExec} />
          </section>

          <div className="grid-2">
            <div className="section">
              <h3>Top Food Items</h3>
              <FoodBar data={foodItems} />
            </div>
            <div className="section">
              <h3>Delivery Status</h3>
              <DeliveryPie data={deliveryStatus} />
            </div>
          </div>

          <section className="section" style={{marginTop:18}}>
            <h3>Guests vs Total Amount</h3>
            <GuestsScatter data={scatterData} />
          </section>
        </>
      )}
      </div>
    </div>
  );
}
