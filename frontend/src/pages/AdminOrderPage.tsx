
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../services/api';
import { Box, Typography, Paper, Card, CardHeader, CardContent, Avatar, Chip, Stack, IconButton, Tooltip, Select, MenuItem, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, InputAdornment, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const AdminOrderPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: ordersData, isLoading, error } = useQuery<any[], Error>({
    queryKey: ['bookings', 'admin'],
    queryFn: async () => {
      const res = await bookingApi.getAll();
      return res.data || [];
    }
  });
  const orders: any[] = ordersData || [];

  const updateMutation = useMutation<any, Error, { id: string; status: string; paymentAmount?: number; paymentMethod?: string }>(
    {
      mutationFn: async ({ id, status, ...rest }) => {
        const res = await bookingApi.updateStatus(id, status as any, rest);
        return res.data;
      },
      onSuccess: () => {
        // refresh both admin list and user's own bookings
        queryClient.invalidateQueries({ queryKey: ['bookings', 'admin'] });
        queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
      }
    }
  );

  // dialog state for confirming payment when changing status to Confirmed
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [confirmOrder, setConfirmOrder] = React.useState<any | null>(null);
  const [confirmNewStatus, setConfirmNewStatus] = React.useState<string>('Confirmed');
  const [confirmAmount, setConfirmAmount] = React.useState<number | ''>('');
  const [confirmMethod, setConfirmMethod] = React.useState<string>('cash');

  const openConfirmDialog = (order: any, status: string) => {
    setConfirmOrder(order);
    setConfirmNewStatus(status);
    const total = calcTotal(order.items) || 0;
    setConfirmAmount(total);
    setConfirmMethod('cash');
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmOrder(null);
    setConfirmAmount('');
  };

  const submitConfirm = () => {
    if (!confirmOrder) return closeConfirmDialog();
    const amt = confirmAmount === '' ? calcTotal(confirmOrder.items) || 0 : Number(confirmAmount || 0);
    updateMutation.mutate({ id: confirmOrder._id, status: confirmNewStatus, paymentAmount: amt, paymentMethod: confirmMethod });
    closeConfirmDialog();
  };

  // filter/search state for the admin list
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  

  const calcTotal = (items: any[] = []) => items.reduce((sum, it) => sum + ((Number(it.price || 0)) * (Number(it.quantity || 1))), 0);

  const getOrderTotal = (order: any) => {
    const totalFromDb = Number(order?.totalAmount || 0);
    if (totalFromDb > 0) return totalFromDb;
    return calcTotal(order?.items || []);
  };

  const isPaid = (order: any) => Boolean(
    order?.paymentReceived ||
    Number(order?.paymentAmount || 0) > 0 ||
    Number(order?.cashReceived || 0) > 0
  );

  const getDisplayAmount = (order: any) => {
    const paymentAmount = Number(order?.paymentAmount || 0);
    const cashReceived = Number(order?.cashReceived || 0);
    if (paymentAmount > 0) return paymentAmount;
    if (cashReceived > 0) return cashReceived;
    return getOrderTotal(order);
  };

  const getPaymentInfo = (order: any) => {
    // try several common fields that might hold payment info
    const raw = order?.paymentMethod || order?.payment?.method || order?.paidBy || order?.payment_mode || order?.paymentMethodType || order?.paymentMethodLabel || order?.payment;
  if (!raw) return { label: 'Not specified', key: 'unknown', icon: undefined };
    const v = String(raw).toLowerCase();
  if (v.includes('cash')) return { label: 'Cash', key: 'cash', icon: <CurrencyRupeeIcon fontSize="small" /> };
  if (v.includes('upi')) return { label: 'UPI', key: 'upi', icon: <PaymentIcon fontSize="small" /> };
  if (v.includes('card')) return { label: 'Card', key: 'card', icon: <CreditCardIcon fontSize="small" /> };
    // fallback: show raw value
  return { label: String(raw), key: 'other', icon: <PaymentIcon fontSize="small" /> };
  };

  

  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success'|'error'|'info'|'warning' }>({ open: false, message: '', severity: 'success' });

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-99999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textArea);
      return ok;
    } catch (e) {
      return false;
    }
  };

  const copyPhoneWithFeedback = async (phone?: string) => {
    const text = String(phone || '');
    if (!text) {
      setSnackbar({ open: true, message: 'No phone number to copy', severity: 'warning' });
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: 'Phone copied to clipboard', severity: 'success' });
        return;
      }
    } catch (e) {
      // fall through to fallback
    }
    const ok = fallbackCopyTextToClipboard(text);
    setSnackbar({ open: ok, message: ok ? 'Phone copied to clipboard' : 'Copy failed', severity: ok ? 'success' : 'error' });
  };

  return (
    <Box sx={{ bgcolor: '#fbf7ef', minHeight: '100vh', width: '100%', py: 4 }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" fontWeight={800} mb={2} textAlign="center">
          Bookings & Orders
        </Typography>

      {/* top stats & filters */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }} elevation={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Orders</Typography>
          <Typography color="text.secondary">Total: <strong>{orders.length}</strong></Typography>
          <Typography color="text.secondary">Pending: <strong>{orders.filter(o=>String(o.status).toLowerCase()==='pending').length}</strong></Typography>
          <Typography color="text.secondary">Confirmed: <strong>{orders.filter(o=>String(o.status).toLowerCase()==='confirmed').length}</strong></Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by customer, phone, or item"
            value={searchTerm}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 320 }}
          />
          <FormControl size="small">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(String(e.target.value))} sx={{ minWidth: 160 }}>
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="preparing">Preparing</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>}
      {error && <Typography color="error" textAlign="center">Failed to load orders.</Typography>}

      {orders.length === 0 && !isLoading ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6">No orders found</Typography>
          <Typography color="text.secondary">You don't have any bookings yet.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {orders
            .filter((order) => {
              // status filter
              if (statusFilter && statusFilter !== 'all') {
                if (String(order.status || '').toLowerCase() !== statusFilter) return false;
              }
              // search filter
              if (searchTerm && searchTerm.trim() !== '') {
                const q = searchTerm.toLowerCase();
                if ((order.customerName || '').toLowerCase().includes(q)) return true;
                if ((order.phoneNumber || '').toLowerCase().includes(q)) return true;
                if (Array.isArray(order.items) && order.items.some((it:any) => (it.name || '').toLowerCase().includes(q))) return true;
                return false;
              }
              return true;
            })
            .map((order) => {
            const status = String(order.status || 'Pending');
            const statusColor = status.toLowerCase() === 'pending' ? 'warning' : status.toLowerCase() === 'confirmed' ? 'success' : status.toLowerCase() === 'cancelled' ? 'default' : 'info';
            return (
              <Box key={order._id}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: 3 } }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{(order.customerName || 'U').charAt(0)}</Avatar>}
                    title={<Typography sx={{ fontWeight: 700 }}>{order.customerName || 'Unknown'}</Typography>}
                    subheader={<Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString()}</Typography>}
                    action={<Stack alignItems="flex-end" spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={status} size="small" color={statusColor as any} />
                          {isPaid(order) ? (
                            <Chip label="Paid" size="small" color="success" />
                          ) : (
                            <Button size="small" onClick={() => openConfirmDialog(order, status)} disabled={updateMutation.isPending}>Mark Paid</Button>
                          )}
                        </Stack>
                        {/* show detected payment method (uses getPaymentInfo) */}
                        {(() => {
                          const p = getPaymentInfo(order);
                          return (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {p.icon}
                              {p.label}
                            </Typography>
                          );
                        })()}
                        <Typography sx={{ fontWeight: 800 }}>₹{getDisplayAmount(order).toFixed(0)}</Typography>
                    </Stack>}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>{order.phoneNumber || 'N/A'}</Typography>
                      <Tooltip title="Call">
                        <IconButton size="small" href={`tel:${order.phoneNumber}`}><CallIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="WhatsApp">
                        <IconButton size="small" onClick={() => window.open(`https://wa.me/${order.phoneNumber}`, '_blank')}><WhatsAppIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Copy">
                        <IconButton size="small" onClick={() => copyPhoneWithFeedback(order.phoneNumber)}><ContentCopyIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </Stack>

                    {order.address && <><Typography variant="body2" color="text.secondary">Address</Typography><Typography variant="body2" sx={{ mb: 1 }}>{order.address}</Typography></>}

                    <Typography variant="subtitle2" color="text.secondary">Items</Typography>
                    <List disablePadding>
                      {order.items?.slice(0,3).map((it:any, i:number) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemText primary={<Typography sx={{ fontWeight: 700 }}>{it.name}</Typography>} secondary={<Typography variant="caption">x{it.quantity || 1} • {it.category || ''}</Typography>} />
                          <ListItemSecondaryAction sx={{ right: 8 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{(Number(it.price ?? 0) * (it.quantity || 1)).toFixed(0)}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary={<Typography variant="caption">+{order.items.length - 3} more items</Typography>} />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                          value={order.status || 'Pending'}
                          onChange={(e) => {
                            const newStatus = e.target.value as string;
                            if (String(newStatus).toLowerCase() === 'confirmed') {
                              openConfirmDialog(order, newStatus);
                            } else {
                              updateMutation.mutate({ id: order._id, status: newStatus });
                            }
                          }}
                          disabled={updateMutation.isPending}
                        >
                          {['Pending','Confirmed','Preparing','Delivered','Cancelled'].map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Stack direction="row" spacing={0.5}>
                        {updateMutation.isPending && <CircularProgress size={18} />}
                        <Button size="small" onClick={() => copyPhoneWithFeedback(order.phoneNumber)}>Copy</Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Confirm payment dialog */}
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 1 }}>
            <TextField label="Amount (₹)" value={confirmAmount} onChange={e => setConfirmAmount(e.target.value === '' ? '' : Number(e.target.value))} type="number" />
            <FormControl size="small">
              <Select value={confirmMethod} onChange={e => setConfirmMethod(e.target.value as string)}>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button variant="contained" onClick={submitConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};

export default AdminOrderPage;
