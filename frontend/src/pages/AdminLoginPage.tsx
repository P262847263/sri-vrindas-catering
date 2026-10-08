import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import { Container, Box, TextField, Button, Typography, Paper, Alert, InputAdornment, Avatar } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/admin-panel';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      if (res && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate(redirect);
      } else {
        setError('Login failed.');
      }
    } catch (err: any) {
      const resp = err?.response?.data;
      setError(resp?.message || resp?.error || JSON.stringify(resp) || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={8} sx={{ borderRadius: 4 }}>
        <Box sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'grid', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto' }}>
              <AdminPanelSettingsIcon />
            </Avatar>
            <Typography variant="h5" textAlign="center">Admin Sign In</Typography>
            <TextField label="Admin Username" value={username} onChange={e => setUsername(e.target.value)} required InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }} />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }} />
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLoginPage;
