import { Fab, Box, Badge } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function FloatingActions() {
  const { cart, setCartOpen } = useCart();
  const itemCount = cart.reduce((s, ci) => s + ci.quantity, 0);
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, width: 80, height: 260, zIndex: 3000 }}>
      {/* Cart on top */}
      <Box sx={{ position: 'absolute', right: 0, bottom: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* halo */}
        <Box sx={{ position: 'absolute', width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,111,0,0.06)', filter: 'blur(6px)', zIndex: 1 }} />
        <Fab
          onClick={() => setCartOpen(true)}
          sx={{
            position: 'relative',
            zIndex: 2,
            width: 72,
            height: 72,
            minHeight: 72,
            backgroundColor: '#ff6f00',
            color: 'white',
            boxShadow: '0 14px 30px rgba(17,24,39,0.25)',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 36px rgba(17,24,39,0.28)' },
            '& .MuiSvgIcon-root': { fontSize: 30 }
          }}
          aria-label="Cart"
        >
          <Badge badgeContent={itemCount} color="error" overlap="circular" sx={{ '& .MuiBadge-badge': { fontWeight: 700 } }}>
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      </Box>

      {/* WhatsApp middle (require login) */}
      <Fab
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 92,
          width: 64,
          height: 64,
          minHeight: 64,
          backgroundColor: '#25D366',
          color: 'white',
          boxShadow: '0 12px 28px rgba(37,211,102,0.2)',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(37,211,102,0.22)' },
          '& .MuiSvgIcon-root': { fontSize: 26 }
        }}
        onClick={() => {
          const token = localStorage.getItem('token');
          if (!token) {
            // redirect to login page so user can authenticate before placing orders
            navigate('/login');
            return;
          }
          // user is authenticated, open WhatsApp chat
          window.open('https://wa.me/918147056141', '_blank');
        }}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </Fab>

      {/* Call at bottom */}
      <Fab
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 20,
          width: 64,
          height: 64,
          minHeight: 64,
          backgroundColor: '#004080',
          color: 'white',
          boxShadow: '0 12px 28px rgba(0,64,128,0.2)',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(0,64,128,0.22)' },
          '& .MuiSvgIcon-root': { fontSize: 26 }
        }}
        href="tel:+918147056141"
        aria-label="Call"
      >
        <PhoneIcon />
      </Fab>
    </Box>
  );
}
