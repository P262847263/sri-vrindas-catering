import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Snackbar, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function BulkOrderPage() {
  const [csv, setCsv] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // No toggle: always save booking; server attempts to notify via WhatsApp. If server didn't send but returned adminNumber, we show a confirmation dialog.
  const [waDialogOpen, setWaDialogOpen] = useState(false);
  const [waDialogAdminNumber, setWaDialogAdminNumber] = useState<string | null>(null);
  const [waDialogBody, setWaDialogBody] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Preset thali options (name, description, price)
  const THALIS = [
    { id: 'silver', name: 'Silver Thali', desc: 'Chhole, Mix Veg, Boondi Raita, Plain Rice, Poori, Papad, One Sweet', price: 199 },
    { id: 'gold', name: 'Gold Thali', desc: 'Matar Paneer, Mix Veg, Daal Fry, Cucumber Raita, Pulao Rice, Poori, Papad, One Sweet', price: 299 },
    { id: 'diamond', name: 'Diamond Thali', desc: 'Shahi Paneer, Mix Veg, Daal Fry, Kadhi Pakoda, Veg Biryani, Jeera Rice, Poori, Papad, Two Sweets', price: 399 },
    { id: 'north-special', name: 'North Indian Special Thali', desc: 'Paneer Tomato Gravy, Dal Tadka, Jeera Rice, Roti / Poori, Aloo Jeera, Curd, Salad, Sweet: Gulab Jamun', price: 249 },
    { id: 'deluxe-north', name: 'Deluxe North Indian Thali', desc: 'Shahi Paneer, Dal Makhani, Veg Pulao, Mixed Veg Sabzi, Roti / Naan, Boondi Raita, Pickle, Sweet: Rasgulla / Jalebi', price: 299 },
    { id: 'south-meals', name: 'South Indian Meals', desc: 'Sambar, Rasam, Rice, Chapati (optional), Pickle, Sweet: Kesari Bath', price: 150 },
    { id: 'karnataka-special', name: 'Karnataka Special Thali', desc: 'Bisi Bele Bath, Sambar, Rasam, Kosambari, Puliyogare, Chapati, Curd Rice, Sweet: Payasam', price: 299 },
    { id: 'economy-simple', name: 'Economy Simple Thali', desc: 'Sabzi, Dal, Rice, 2 Rotis, Salad, Pickle', price: 190 },
    { id: 'premium-feast', name: 'Premium Feast Thali', desc: 'Paneer Curry, Mixed Veg Curry, Dal Fry, Veg Pulao, Roti / Naan, Raita, Papad, Sweet: Kheer / Gulab Jamun, Drink: Lemon Juice', price: 450 },
    { id: 'kids-thali', name: "Kids Thali", desc: 'Jeera Rice, Dal, Mild Paneer Curry, Poori, Curd, Sweet: Halwa', price: 130 },
  ];
  // Parse CSV lines into items: expected format per line: itemName,quantity
  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const items: Array<{ name: string; quantity: number }> = [];
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (!parts[0]) continue;
      const qty = parts[1] ? Number(parts[1]) : 1;
      items.push({ name: parts[0], quantity: Number.isNaN(qty) ? 1 : Math.max(1, qty) });
    }
    return items;
  };

  const getItemPrice = (name: string) => THALIS.find(thali => thali.name.trim().toLowerCase() === name.trim().toLowerCase())?.price || 0;

  const buildOrderMessage = (payload: { items: Array<{ name: string; quantity: number; price?: number }>; customerName: string; phoneNumber: string; address: string; totalAmount?: number | string }) => {
    const itemLines = (payload.items || []).map((it, idx) => {
      const unitPrice = Number(it.price || getItemPrice(it.name));
      return `${idx + 1}. ${it.name} x ${it.quantity} @ ₹${unitPrice} = ₹${unitPrice * it.quantity}`;
    }).join('\n');
    const total = Number(payload.totalAmount ?? 0);
    return `New WhatsApp order\nCustomer: ${payload.customerName}\nPhone: ${payload.phoneNumber}\nAddress: ${payload.address}\nItems:\n${itemLines}\nTotal: ₹${total}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const items = parseCsv(csv);
    if (!items.length) { setError('Please provide at least one item (format: name,quantity per line).'); return; }
    if (!name || !phone || !address) { setError('Please fill name, phone and address.'); return; }
    const payload = {
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: getItemPrice(i.name) })),
      customerName: name,
      phoneNumber: phone,
      address,
    } as any;

    // If not logged in, save pending order and redirect to login
    const token = localStorage.getItem('token');
    if (!token) {
      try { sessionStorage.setItem('pendingOrder', JSON.stringify({ ...payload, action: 'place' })); } catch (err) { /* ignore */ }
      navigate(`/login?redirect=${encodeURIComponent('/my-bookings')}`);
      return;
    }

    setLoading(true);
    try {
      // Save booking to DB and let server attempt notify
      const token = localStorage.getItem('token');
      if (!token) {
        try { sessionStorage.setItem('pendingOrder', JSON.stringify({ ...payload, action: 'place' })); } catch (err) { /* ignore */ }
        navigate(`/login?redirect=${encodeURIComponent('/my-bookings')}`);
        return;
      }

      const res = await axios.post('/api/bookings', payload, { headers: { Authorization: `Bearer ${token}` } });
      const notify = (res as any)?.data?.notify || null;
      const totalAmount = Number((res as any)?.data?.booking?.totalAmount ?? 0);
      try { queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] }); } catch (e) { /* ignore */ }
      // build success message
      let msg = 'Order placed successfully.';
      if (notify) {
        const c = notify.customerWhatsSent;
        const a = notify.adminWhatsSent;
        
        if (c && a) msg += ' Order and admin notification sent to WhatsApp.';
        else if (c) msg += ' Order sent to customer WhatsApp.';
        else if (a) msg += ' Order sent to restaurant WhatsApp.';
        else msg += ' WhatsApp notification not sent.';
        setSuccessMsg(msg);
        // if server provided adminNumber and adminWhats wasn't sent, show confirmation dialog to open WhatsApp
        if (!a && notify.adminNumber) {
          setWaDialogAdminNumber(notify.adminNumber);
          const body = buildOrderMessage({
            items: payload.items || [],
            customerName: payload.customerName,
            phoneNumber: payload.phoneNumber,
            address: payload.address || '',
            totalAmount,
          });
          setWaDialogBody(body);
          setWaDialogOpen(true);
          return;
        }
      }
      setSuccessMsg(msg);
      // show success briefly then navigate to My Bookings
      setTimeout(() => navigate('/my-bookings'), 1800);
      return;
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to place bulk order');
    } finally {
      setLoading(false);
    }
  };

  const sendViaWhatsApp = async () => {
    setError('');
    const items = parseCsv(csv);
    if (!items.length) { setError('Please provide at least one item (format: name,quantity per line).'); return; }
    if (!name || !phone || !address) { setError('Please fill name, phone and address.'); return; }

    const payload = {
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: getItemPrice(i.name) })),
      customerName: name,
      phoneNumber: phone,
      address,
    } as any;

    const token = localStorage.getItem('token');
    if (!token) {
      try { sessionStorage.setItem('pendingOrder', JSON.stringify({ ...payload, action: 'place' })); } catch (err) { /* ignore */ }
      navigate(`/login?redirect=${encodeURIComponent('/my-bookings')}`);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/bookings', payload, { headers: { Authorization: `Bearer ${token}` } });
      const notify = (res as any)?.data?.notify || null;
      const totalAmount = Number((res as any)?.data?.booking?.totalAmount ?? 0);
      // build message for WhatsApp
      const body = buildOrderMessage({
        items: payload.items || [],
        customerName: payload.customerName,
        phoneNumber: payload.phoneNumber,
        address: payload.address || '',
        totalAmount,
      });
      const adminNumber = notify?.adminNumber || '918147056141';
      // open WhatsApp Web (wa.me accepts numbers without plus)
      // clear form and notify UI, then open WhatsApp
      setCsv(''); setName(''); setPhone(''); setAddress('');
      setSuccessMsg('Opening WhatsApp...');
      window.open(`https://api.whatsapp.com/send?phone=${adminNumber}&text=${encodeURIComponent(body)}`, '_blank');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to place bulk order');
    } finally {
      setLoading(false);
    }
  };

  const addThali = (thali: { id: string; name: string; desc: string; price: number }) => {
    // Ask for quantity (minimum 20 plates for thalis)
    const qStr = window.prompt(`Enter quantity for ${thali.name} (minimum 20):`, '20');
    if (!qStr) return;
    const q = Number(qStr);
    if (Number.isNaN(q) || q < 20) {
      window.alert('Thalis have a minimum order of 20 plates. Please enter 20 or more.');
      return;
    }
    // Append a line to the CSV textarea
    const line = `${thali.name},${q}`;
    setCsv(prev => (prev ? prev.trim() + '\n' + line : line));
  };

  // CSV file upload handler: expects lines like: Item name,quantity
  const handleCsvFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      // sanitize CRLFs and ensure valid lines
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      // validate basic CSV pattern and append to textarea
      const appended = lines.map(l => {
        const parts = l.split(',').map(p => p.trim());
        if (!parts[0]) return null;
        const qty = parts[1] ? Number(parts[1]) : 1;
        return `${parts[0]},${Number.isNaN(qty) ? 1 : Math.max(1, qty)}`;
      }).filter(Boolean) as string[];
      if (appended.length) setCsv(prev => (prev ? prev.trim() + '\n' + appended.join('\n') : appended.join('\n')));
    };
    reader.readAsText(file);
  };

  // (no client-side WhatsApp override; server should handle admin notifications)

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg,#fffbe7 0%,#f5f7fa 100%)' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Thali presets */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Thalis (Customizable, Minimum 20 Plates)</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            {THALIS.map(t => (
              <Paper key={t.id} sx={{ p: 2, minWidth: 240, flex: '1 1 240px' }} elevation={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{t.name} <span style={{ float: 'right', fontWeight: 700 }}>₹{t.price}</span></Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>{t.desc}</Typography>
                <Button variant="outlined" size="small" onClick={() => addThali(t)}>Add to bulk order</Button>
              </Paper>
            ))}
          </Box>
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Bulk Order
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Paste one item per line in the format: <code>Item name,quantity</code>. Quantity is optional and defaults to 1.
        </Typography>

        <Paper sx={{ p: 4 }} elevation={6}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
              <TextField
                label="Items (one per line: name,quantity)"
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
                multiline
                rows={8}
                fullWidth
                margin="normal"
                placeholder={'Paneer butter masala,10\nVeg biryani,20'}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 1 }}>
                <input
                  id="csv-file-input"
                  accept=".csv,text/csv"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={(e) => handleCsvFile(e.target.files ? e.target.files[0] : null)}
                />
                <label htmlFor="csv-file-input">
                  <IconButton component="span" color="primary" title="Upload CSV file">
                    <UploadFileIcon />
                  </IconButton>
                </label>
                <Button variant="text" size="small" onClick={() => { setCsv(''); }}>
                  Clear
                </Button>
              </Box>
            </Box>

            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth margin="normal" required multiline rows={3} />
            {/* Restaurant WhatsApp override removed — server should provide admin contact */}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                size="large"
                sx={{ mt: 2, px: 6, py: 1.8, fontWeight: 800, backgroundColor: '#25D366', boxShadow: '0 8px 16px rgba(0,0,0,0.12)' }}
                onClick={sendViaWhatsApp}
                disabled={loading}
              >
                {loading ? 'Placing order...' : 'ORDER VIA WHATSAPP'}
              </Button>
            </Box>
          </form>
        </Paper>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Snackbar>
        <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')}>
          <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
        </Snackbar>
        <Dialog open={waDialogOpen} onClose={() => setWaDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm WhatsApp Order</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Message preview — will be sent to the restaurant</Typography>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: '#f7f7f7', p: 2, borderRadius: 1 }}>{waDialogBody}</Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>Click Confirm to open WhatsApp with this message. You will still need to press Send in WhatsApp.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWaDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (waDialogAdminNumber) { window.open(`https://api.whatsapp.com/send?phone=${waDialogAdminNumber}&text=${encodeURIComponent(waDialogBody)}`, '_blank'); setWaDialogOpen(false); setSuccessMsg('Opening WhatsApp...'); } }} variant="contained">Confirm</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
