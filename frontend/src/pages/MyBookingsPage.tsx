import { Box, Typography, Paper, Button, Chip, Stack, CircularProgress, Snackbar, Alert, Card, CardHeader, CardContent, Avatar, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { bookingApi } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function MyBookingsPage() {
  // Use react-query to fetch and manage bookings so UI stays in sync with server.
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery<any[], Error>({
    queryKey: ['bookings', 'mine'],
    queryFn: async () => {
      const res = await bookingApi.getMine();
      return res.data || [];
    }
  });

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [query, setQuery] = useState('');
  const cancelMutation = useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const r = await bookingApi.cancel(id);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
      setSnackbar({ open: true, message: 'Booking cancelled successfully', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err?.message || 'Failed to cancel booking', severity: 'error' });
    },
  });

  const cancelBooking = (id: string) => {
    setCancellingId(id);
    cancelMutation.mutate(id, { onSettled: () => setCancellingId(null) });
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(s => ({ ...s, open: false }));
  };

  const openDetails = (b: any) => {
    setSelectedBooking(b);
    setDetailOpen(true);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
    setDetailOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#f9f3e9', minHeight: '100vh', width: '100%', py: 4 }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1100px', mx: 'auto' }}>
        <Typography variant="h4" fontWeight={800} mb={2} textAlign="center">My Bookings</Typography>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }} elevation={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1">Total bookings</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{bookings.length}</Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by name, phone or item"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            sx={{ minWidth: 260 }}
          />
        </Stack>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : bookings.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6">No bookings found</Typography>
          <Typography color="text.secondary">You don't have any bookings yet. Create one from the menu.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {bookings.slice().sort((a:any,b:any)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).filter((bk:any) => {
            if (!query) return true;
            const q = query.toLowerCase();
            if ((bk.customerName||'').toLowerCase().includes(q)) return true;
            if ((bk.phoneNumber||'').toLowerCase().includes(q)) return true;
            if (Array.isArray(bk.items) && bk.items.some((it:any) => (it.name||'').toLowerCase().includes(q))) return true;
            return false;
          }).map((b:any) => (
            <Box key={b._id}>
              <Card sx={{ borderRadius:2, boxShadow:2, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: (theme) => theme.palette.background.paper, transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 }, borderLeft: (theme) => `4px solid ${theme.palette.primary.main}` }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{(b.customerName||'U').charAt(0)}</Avatar>}
                  title={<Typography sx={{ fontWeight:700 }}>{b.customerName || 'You'}</Typography>}
                  subheader={<Typography variant="caption" color="text.secondary">{new Date(b.createdAt).toLocaleString()}</Typography>}
                  action={(
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton size="small" onClick={() => openDetails(b)} aria-label="view details"><VisibilityIcon /></IconButton>
                      <Chip label={b.status === 'Pending' ? 'Order placed' : b.status} size="small" color={b.status === 'Pending' ? 'warning' : b.status === 'Confirmed' ? 'success' : 'default'} />
                      {b.paymentReceived && (
                        <Chip label="Paid" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                      {b.status !== 'Cancelled' && b.status !== 'Delivered' && (
                        <Button variant="outlined" color="error" size="small" onClick={() => cancelBooking(b._id)} disabled={cancellingId === b._id}>
                          {cancellingId === b._id ? <CircularProgress size={16} /> : 'Cancel'}
                        </Button>
                      )}
                    </Stack>
                  )}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography sx={{ fontWeight:700, mb:1 }}>{b.phoneNumber || 'N/A'}</Typography>

                  {b.address && (<>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body2" sx={{ mb:1 }}>{b.address}</Typography>
                  </>)}

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Items</Typography>
                  <Stack spacing={1} sx={{ mt:1 }}>
                    {b.items?.slice(0,4).map((it:any, i:number) => {
                      const unit = Number(it.price || 0);
                      const qty = Number(it.quantity || 1);
                      const line = unit * qty;
                      return (
                        <Box key={i} sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <Box>
                            <Typography sx={{ fontWeight:700 }}>{it.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{it.category || ''}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">x{qty} • ₹{unit.toFixed(0)} = ₹{line.toFixed(0)}</Typography>
                        </Box>
                      );
                    })}
                    {b.items && b.items.length > 4 && <Typography variant="caption">+{b.items.length - 4} more items</Typography>}
                  </Stack>
                </CardContent>
                <Box sx={{ p:2, pt:0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                    <Typography variant="h6" sx={{ fontWeight:800 }}>
                      ₹{Number(b.cashReceived ?? b.paymentAmount ?? b.paidAmount ?? b.amount ?? ((b.items || []).reduce((s:number,it:any)=>s + ((it.price||0)*(it.quantity||1)),0))).toFixed(0)}
                    </Typography>
                  </Stack>
                  {b.paymentReceived && (
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Paid" color="success" size="small" />
                    </Box>
                  )}
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Booking details dialog */}
      <Dialog open={detailOpen} onClose={closeDetails} fullWidth maxWidth="md">
        <DialogTitle>Booking details</DialogTitle>
        <DialogContent>
          {selectedBooking ? (
            <Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedBooking.customerName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
                  {selectedBooking.phoneNumber && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2"><strong>Phone:</strong> {selectedBooking.phoneNumber}</Typography>
                      <IconButton href={`tel:${selectedBooking.phoneNumber}`} size="small" aria-label="call"><CallIcon fontSize="small"/></IconButton>
                      <IconButton onClick={() => window.open(`https://wa.me/${selectedBooking.phoneNumber}`, '_blank')} size="small" aria-label="whatsapp"><WhatsAppIcon fontSize="small"/></IconButton>
                    </Box>
                  )}
                  {selectedBooking.address && <Typography variant="body2" sx={{ mb: 1 }}><strong>Address:</strong> {selectedBooking.address}</Typography>}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>Items</Typography>
                  <Stack spacing={1}>
                    {selectedBooking.items?.map((it: any, i: number) => {
                      const unit = Number(it.price || 0);
                      const qty = Number(it.quantity || 1);
                      const line = unit * qty;
                      return (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>{it.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{it.category || ''}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">x{qty} • ₹{unit.toFixed(0)} = ₹{line.toFixed(0)}</Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
                <Box sx={{ minWidth: 220 }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip label={selectedBooking.status} size="small" color={selectedBooking.status === 'Confirmed' ? 'success' : selectedBooking.status === 'Pending' ? 'warning' : 'default'} />
                    {selectedBooking.paymentReceived && <Chip label="Paid" size="small" color="success" />}
                  </Stack>
                  {/* Grand total computed from item prices (falls back to 0 when price missing) */}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Grand Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>₹{Number((selectedBooking.items || []).reduce((s: number, it: any) => s + ((Number(it.price || 0)) * (Number(it.quantity || 1))), 0)).toFixed(0)}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Amount Paid</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>₹{Number(selectedBooking.cashReceived ?? selectedBooking.paymentAmount ?? selectedBooking.paidAmount ?? selectedBooking.amount ?? ((selectedBooking.items || []).reduce((s: number, it: any) => s + ((it.price || 0) * (it.quantity || 1)), 0))).toFixed(0)}</Typography>
                  {selectedBooking.paymentMethod && <Typography variant="body2" sx={{ mt: 1 }}>Payment: {selectedBooking.paymentMethod}</Typography>}
                  {selectedBooking.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                      <Typography variant="body2">{selectedBooking.notes}</Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails}>Close</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
}
