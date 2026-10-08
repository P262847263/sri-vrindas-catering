import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authApi } from '../services/api';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  children: React.ReactElement;
}

export default function ProtectedRoute({ requireAdmin, children }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (mounted) {
          setAuthorized(false);
          setChecking(false);
        }
        return;
      }
      try {
        const res = await authApi.getCurrentUser();
        // backend /auth/me returns decoded token payload which includes isAdmin
        const payload: any = res.data;
        if (requireAdmin) {
          if (payload && payload.isAdmin) {
            if (mounted) setAuthorized(true);
          } else {
            if (mounted) setAuthorized(false);
          }
        } else {
          if (mounted) setAuthorized(true);
        }
      } catch (err) {
        if (mounted) setAuthorized(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, [requireAdmin]);

  if (checking) {
    return (
      <Box sx={{ width: '100%', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authorized) {
    // redirect to login with redirect back to attempted page
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
