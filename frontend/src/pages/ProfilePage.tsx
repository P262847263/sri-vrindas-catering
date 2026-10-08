import { Box, Typography, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { authApi } from '../services/api';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({ name: '', address: '', phone: '' });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (mounted) setProfile(res.data || {});
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      await authApi.updateProfile(profile);
      alert('Profile updated');
    } catch (e) { alert('Failed to update'); }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={2}>Your Profile</Typography>
      <TextField label="Name" fullWidth value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} sx={{ mb: 2 }} />
      <TextField label="Phone" fullWidth value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} sx={{ mb: 2 }} />
      <TextField label="Address" fullWidth multiline rows={3} value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} sx={{ mb: 2 }} />
      <Button variant="contained" onClick={save} disabled={loading}>Save</Button>
    </Box>
  );
}
