import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Box, TextField, Button, Typography, Alert, Link, InputAdornment, Avatar } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockIcon from '@mui/icons-material/Lock';
import { authApi } from '../services/api';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const gmailPattern = /^[A-Za-z0-9](?:[A-Za-z0-9.]*[A-Za-z0-9])?@gmail\.com$/i;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!gmailPattern.test(userId.trim())) {
      setError('Please enter a valid Gmail address ending with @gmail.com.');
      return;
    }
    if (!passwordRequirements.test(password)) {
      setError('Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // include userId, mobile and username (if any) in payload
      await authApi.signup({ userId, username, mobile, password });
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1400);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed. Try a different username.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, rgba(230,81,0,0.95) 0%, rgba(255,152,0,0.9) 100%)', color: '#fff' }}>
          <Avatar sx={{ bgcolor: 'primary.contrastText', color: 'primary.main', width: 72, height: 72, mx: 'auto', mb: 1 }}>
            <PersonAddIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={800}>Create your account</Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>Join Sri Vrindas to place orders and track them</Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSignup} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Gmail Address" value={userId} onChange={e => setUserId(e.target.value.trim())} type="email" required fullWidth placeholder="example@gmail.com" helperText="Use a valid address ending with @gmail.com" />
            <TextField label="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" fullWidth helperText="Digits only, e.g., 919812345678" />
            <TextField label="Username (optional)" value={username} onChange={e => setUsername(e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><PersonAddIcon /></InputAdornment> }} />
            <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required fullWidth helperText="At least 8 characters, including uppercase, lowercase, number, and special character" InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }} />
            <TextField label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" required fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }} />
            <Button type="submit" variant="contained" size="large" disabled={loading || !userId || !password || !confirmPassword}>{loading ? 'Creating...' : 'Create Account'}</Button>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>Already have an account? <Link component={RouterLink} to="/login" sx={{ fontWeight: 700 }}>Sign in</Link></Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
