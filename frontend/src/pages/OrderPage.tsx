// Footer is provided globally by App.tsx

import { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, Snackbar, Alert, Fade } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/api';


function OrderPage() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId') || '';
  const [form, setForm] = useState({
    qty: 1,
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        items: [ { name: itemId || 'Custom order', quantity: Number(form.qty || 1) } ],
        customerName: form.name,
        phoneNumber: form.phone,
        address: form.address,
      };
      // If user is not logged in, save pending order and redirect to login
      if (!localStorage.getItem('token')) {
        try { sessionStorage.setItem('pendingOrder', JSON.stringify({ ...payload, action: 'place' })); } catch (err) { /* ignore */ }
        navigate(`/login?redirect=${encodeURIComponent('/my-bookings')}`);
        return;
      }

      // submit booking when authenticated
      await bookingApi.create(payload as any);
      // clear form and navigate to My Bookings where status will show
      setForm({ qty: 1, name: '', phone: '', address: '' });
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
      <Box sx={{ flex: 1 }}>
        {/* Decorative floating icons */}
        <Box sx={{ position: 'absolute', top: 30, left: 40, fontSize: 60, opacity: 0.10, zIndex: 0 }}>🛒</Box>
        <Box sx={{ position: 'absolute', top: 120, right: 60, fontSize: 70, opacity: 0.10, zIndex: 0 }}>🍽️</Box>
        <Box sx={{ position: 'absolute', bottom: 60, left: 80, fontSize: 70, opacity: 0.10, zIndex: 0 }}>🎉</Box>
        {/* Hero Section */}
        <Fade in timeout={1200}>
          <Box>
            <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 6, mb: 5, borderRadius: 6, boxShadow: 8, position: 'relative', overflow: 'hidden', backgroundImage: "url('/images/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: { xs: 120, md: 180 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Overlay for better text contrast */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, textShadow: '2px 2px 12px rgba(0,0,0,0.7)', zIndex: 2, fontSize: { xs: 28, md: 44 }, letterSpacing: 2 }}>
                Place Your Order
              </Typography>
            </Box>
          </Box>
        </Fade>
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4, mt: 2, width: '100%', maxWidth: 500 }}>
            <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
              Fill in your details and we’ll get in touch to confirm your order.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Item ID (prefilled if from menu)"
                name="itemId"
                value={itemId}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Quantity"
                name="qty"
                type="number"
                value={form.qty}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 'bold', borderRadius: 3, py: 1.5, fontSize: 18, mt: 2 }} disabled={loading}>
                {loading ? 'Placing Order...' : 'Order Now'}
              </Button>
            </form>
          </Paper>
          {/* Success notification removed — bookings are visible under My Bookings with status 'Order placed' */}
          <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
          {/* Floating actions provided globally by FloatingActions component */}
        </Container>
      </Box>
  {/* Footer is now global in App.tsx */}
    </Box>
  );
}

export default OrderPage;
