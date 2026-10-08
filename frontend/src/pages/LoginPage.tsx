import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authApi } from '../services/api';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link, InputAdornment, Avatar, Divider } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      if (res && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        // store a quick role flag for convenience (backend returns user object with isAdmin)
        try {
          const user = res.data.user || null;
          const isAdmin = !!(user && user.isAdmin);
          if (isAdmin) {
            localStorage.setItem('role', 'admin');
            navigate('/admin-panel');
          } else {
            localStorage.removeItem('role');
            navigate('/');
          }
        } catch (e) {
          navigate('/');
        }
      } else {
        setError('Login failed.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
          <Box sx={{ background: 'linear-gradient(135deg, rgba(230,81,0,0.95) 0%, rgba(255,152,0,0.9) 100%)', color: '#fff', p: 4, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.contrastText', color: 'primary.main', width: 72, height: 72, mx: 'auto', mb: 1 }}>
              <RestaurantMenuIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
              Sri Vrindas Catering
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5 }}>
              Sign in to place orders and view your booking history
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, fontWeight: 700 }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" sx={{ fontWeight: 700, color: 'primary.main' }}>Create one</Link>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Are you an admin?{' '}
                  <Link component={RouterLink} to="/admin-login" sx={{ fontWeight: 700, color: 'primary.main' }}>Admin sign in</Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
