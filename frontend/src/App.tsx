import Footer from './components/Footer';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MenuPage from './pages/MenuPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import CloudKitchenPage from './pages/CloudKitchenPage';

import OrderPage from './pages/OrderPage';
import BulkOrderPage from './pages/BulkOrderPage';
import AboutUsPage from './pages/AboutUsPage';
import RegularMenuPage from './pages/RegularMenuPage';
import PartyMenuPage from './pages/PartyMenuPage';
import BirthdayMenuPage from './pages/BirthdayMenuPage';
import UpvasMenuPage from './pages/UpvasMenuPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrderPage from './pages/AdminOrderPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AdminAnalysisPage from './pages/AdminAnalysisPage';
import MyBookingsPage from './pages/MyBookingsPage';
import WishlistPage from './pages/WishlistPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { CartProvider, useCart } from './context/CartContext';
import CartSidebar from './components/CartSidebar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import Badge from '@mui/material/Badge';
import { IconButton, Box } from '@mui/material';

// Create a client
const queryClient = new QueryClient();

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e65100', // A warm orange color suitable for food/catering
    },
    secondary: {
      main: '#2e7d32', // A fresh green color
    },
  },
});

function FloatingActions({ setCartOpen }: { setCartOpen: (open: boolean) => void }) {
  const { cart } = useCart();
  const total = cart.reduce((s, ci) => s + ci.quantity, 0);
  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <IconButton
        aria-label="whatsapp"
        sx={{ bgcolor: '#25D366', color: '#fff', boxShadow: 4, ':hover': { bgcolor: '#1ebc55' } }}
        size="large"
        onClick={() => window.open('https://wa.me/918147056141', '_blank')}
      >
        <WhatsAppIcon fontSize="large" />
      </IconButton>

      <IconButton
        aria-label="call"
        sx={{ bgcolor: '#0D47A1', color: '#fff', boxShadow: 4, ':hover': { bgcolor: '#08306b' } }}
        size="large"
        onClick={() => window.open('tel:8147056141')}
      >
        <PhoneIcon fontSize="large" />
      </IconButton>

      <IconButton color="primary" size="large" sx={{ boxShadow: 4, bgcolor: '#fff' }} onClick={() => setCartOpen(true)}>
        <Badge badgeContent={total} color="error">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
    </Box>
  );
}

function App() {
  const [cartOpen, setCartOpen] = React.useState(false);

  // Auto-logout when user leaves the site: clear stored auth so next visit requires login.
  React.useEffect(() => {
    // When the page is unloaded/hidden, save the timestamp so other tabs or next visit
    // can detect how long the user was away. We will only logout if they've been away >= 30s.
    const setLeftAt = () => {
      try { localStorage.setItem('leftAt', String(Date.now())); } catch (e) { /* ignore */ }
    };

    const performLogout = () => {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('pendingOrder');
        // notify other tabs that logout happened
        localStorage.setItem('loggedOutAt', String(Date.now()));
      } catch (e) {
        // ignore storage errors
      }
      // redirect to login
      if (window.location.pathname !== '/login') window.location.href = '/login';
    };

    // Called when the tab becomes visible or on initial load to decide whether to logout
    const checkLeftTimeout = () => {
      try {
        const left = localStorage.getItem('leftAt');
        if (!left) return;
        const leftTs = Number(left || '0');
        if (Number.isNaN(leftTs)) return;
        const now = Date.now();
        // if user was away for 30s or more, logout
        if (now - leftTs >= 30 * 1000) {
          performLogout();
        }
      } catch (e) { /* ignore */ }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkLeftTimeout();
      }
    };

    // when unloading, mark the leave time (do NOT clear auth immediately)
    window.addEventListener('beforeunload', setLeftAt);
    window.addEventListener('pagehide', setLeftAt);
    document.addEventListener('visibilitychange', onVisibility);

    const onStorage = (e: StorageEvent) => {
      // if another tab initiated a logout, clear here too and redirect
      if (e.key === 'loggedOutAt') {
        try { localStorage.removeItem('token'); localStorage.removeItem('role'); sessionStorage.removeItem('pendingOrder'); } catch (err) { }
        if (window.location.pathname !== '/login') window.location.href = '/login';
      }
    };
    window.addEventListener('storage', onStorage);

    // check immediately on mount in case leftAt was set earlier
    checkLeftTimeout();

    return () => {
      window.removeEventListener('beforeunload', setLeftAt);
      window.removeEventListener('pagehide', setLeftAt);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <CartProvider>
            <Navigation />
            <FloatingActions setCartOpen={setCartOpen} />
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />           
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/bulk-order" element={<BulkOrderPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/regular-menu" element={<RegularMenuPage />} />
              <Route path="/party-menu" element={<PartyMenuPage />} />
              <Route path="/birthday-menu" element={<BirthdayMenuPage />} />
              <Route path="/upvas-menu" element={<UpvasMenuPage />} />
              <Route path="/cloud-kitchen" element={<CloudKitchenPage />} />
              <Route path="/admin-menu" element={<ProtectedRoute requireAdmin><AdminMenuPage /></ProtectedRoute>} />
              <Route path="/admin-orders" element={<ProtectedRoute requireAdmin><AdminOrderPage /></ProtectedRoute>} />
              <Route path="/admin-panel" element={<ProtectedRoute requireAdmin><AdminPanelPage /></ProtectedRoute>} />
              <Route path="/admin-analysis" element={<ProtectedRoute requireAdmin><AdminAnalysisPage /></ProtectedRoute>} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
            <Footer />
          </CartProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App;
