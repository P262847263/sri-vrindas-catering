import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useCart } from '../context/CartContext';
import { useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../services/api';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Auto-submit any pending order saved before login
  React.useEffect(() => {
    let mounted = true;
    const trySubmitPending = async () => {
      try {
        const pendingRaw = sessionStorage.getItem('pendingOrder');
        const token = localStorage.getItem('token');
        if (!pendingRaw || !token) return;
        const pending = JSON.parse(pendingRaw);
        if (!pending || pending.action !== 'place') return;
        setLoading(true);
        // submit booking using bookingApi
        await bookingApi.create(pending as any);
        // invalidate bookings cache so My Bookings shows fresh data
        try { queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] }); } catch (e) { /* ignore */ }
        if (!mounted) return;
        setOrderStatus('Order placed successfully!');
        try { sessionStorage.removeItem('pendingOrder'); } catch (e) { /* ignore */ }
        clearCart();
        navigate('/my-bookings');
      } catch (err) {
        console.error('Auto-submit pending order failed', err);
        setOrderStatus('Failed to place order.');
      } finally {
        setLoading(false);
      }
    };
    trySubmitPending();
    return () => { mounted = false; };
  }, [navigate, clearCart]);

  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [address, setAddress] = useState('');

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
            Your Cart
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Your cart is empty.
            </Typography>
          ) : (
            cart.map((ci) => (
              <ListItem key={ci.item._id} secondaryAction={
                <IconButton edge="end" onClick={() => removeFromCart(ci.item._id)}>
                  <CloseIcon />
                </IconButton>
              }>
                    <ListItemText
                      primary={`${ci.item.name}`}
                      secondary={`Quantity: ${ci.quantity} • Price: ₹${ci.item?.price ?? 0} • Total: ₹${(Number(ci.item?.price || 0) * (ci.quantity || 0))}`}
                    />
              </ListItem>
            ))
          )}
        </List>
            {cart.length > 0 && (
              <Box sx={{ mt: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>Grand Total</Typography>
                <Typography variant="h6" fontWeight={800}>₹{cart.reduce((s, ci) => s + (Number(ci.item?.price || 0) * (ci.quantity || 0)), 0)}</Typography>
              </Box>
            )}
        {cart.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={e => {
                  // Accept only numbers
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPhoneNumber(val);
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
              />
              <input
                type="number"
                min="1"
                placeholder="Number of People"
                value={numPeople}
                onChange={e => setNumPeople(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
              />
              <textarea
                placeholder="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px', resize: 'vertical' }}
                rows={2}
              />
            </Box>
              <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<WhatsAppIcon />}
              sx={{ mb: 1 }}
              disabled={!customerName || !phoneNumber || !numPeople || !address || loading}
              onClick={async () => {
                const token = localStorage.getItem('token');
                // include per-item price and grand total when creating booking
                const itemsWithPrice = cart.map(ci => ({ name: ci.item.name, quantity: ci.quantity, category: ci.item.category, price: Number(ci.item?.price || 0) }));
                const totalAmount = itemsWithPrice.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
                const order = {
                  items: itemsWithPrice,
                  customerName,
                  phoneNumber,
                  numPeople,
                  address,
                  whatsapp: phoneNumber,
                  totalAmount,
                };
                if (!token) {
                  try { sessionStorage.setItem('pendingOrder', JSON.stringify({ ...order, action: 'place' })); } catch (err) { /* ignore */ }
                  navigate(`/login?redirect=${encodeURIComponent('/my-bookings')}`);
                  return;
                }
                setLoading(true);
                setOrderStatus(null);
                try {
                  await bookingApi.create(order as any);
                  setOrderStatus('Order placed successfully!');
                  // Build WhatsApp message including unit price, line total and grand total
                  let grandTotal = 0;
                  const lines = cart.map((ci, idx) => {
                    const unit = Number(ci.item?.price || 0);
                    const qty = Number(ci.quantity || 0);
                    const lineTotal = unit * qty;
                    grandTotal += lineTotal;
                    return `${idx + 1}. ${ci.item.name} x${qty} @ ₹${unit} = ₹${lineTotal}`;
                  });
                  const msg = `Order from Sri Vrinda’s Catering:%0AName: ${customerName}%0APhone: ${phoneNumber}%0ANumber of People: ${numPeople}%0AAddress: ${address}%0A` +
                    lines.join('%0A') + `%0A%0AGrand Total: ₹${grandTotal}%0A`;
                  setTimeout(() => {
                    clearCart();
                    setCustomerName('');
                    setPhoneNumber('');
                    setNumPeople('');
                    setAddress('');
                  }, 2000);
                  window.open(`https://wa.me/918147056141?text=${msg}`, '_blank');
                } catch (err) {
                  setOrderStatus('Failed to place order.');
                }
                setLoading(false);
              }}
            >
              {loading ? 'Placing Order...' : 'Order via WhatsApp'}
            </Button>
            <Button variant="outlined" color="error" fullWidth onClick={clearCart}>
              Clear Cart
            </Button>
            {orderStatus && (
              <Typography variant="body2" color={orderStatus.includes('success') ? 'success.main' : 'error.main'} sx={{ mt: 1 }}>
                {orderStatus}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
