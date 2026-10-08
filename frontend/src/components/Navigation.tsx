import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography, Badge, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { useEffect } from 'react';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Services', path: '/services' },
  { title: 'Menu', path: '/menu' },
  { title: 'Gallery', path: '/gallery' },
  { title: 'Contact', path: '/contact' },
  { title: 'Bulk Order', path: '/bulk-order' },
];

export default function Navigation() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem('token'));
  // determine if the current token belongs to an admin by decoding the JWT payload
  const getIsAdmin = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const parts = token.split('.');
      if (parts.length < 2) return false;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return Boolean(payload && payload.isAdmin);
    } catch (e) {
      return false;
    }
  };
  const isAdmin = getIsAdmin();
  const getUsernameFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload?.username || payload?.userId || null;
    } catch (e) {
      return null;
    }
  };
  const username = getUsernameFromToken();

  const getDisplayName = (name: string | null) => {
    if (!name) return null;
    // if it's an email, show only the part before @ for admins
    const at = name.indexOf('@');
    if (at > 0) return name.slice(0, at);
    return name;
  };
  const displayName = getDisplayName(username);

  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!isLoggedIn) return setFavCount(0);
        const res = await userApi.getFavorites();
        if (!mounted) return;
        const data = res.data || [];
        setFavCount(Array.isArray(data) ? data.length : 0);
      } catch (e) {
        // ignore
      }
    };
    load();
    const onFavChange = () => { load(); };
    window.addEventListener('favoritesChanged', onFavChange);
    return () => { mounted = false; window.removeEventListener('favoritesChanged', onFavChange); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // optional: clear any other session keys
    navigate('/');
    // force a reload to update UI if needed
    window.location.reload();
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  

  return (
    <AppBar position="sticky" color="default" elevation={2} sx={{ background: '#f7f7f7' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <Toolbar disableGutters sx={{ width: '100%', justifyContent: 'center', minHeight: 80 }}>
          {/* Logo/Brand for larger screens */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 3,
              pl: 1,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              color: '#222',
              textDecoration: 'none',
              alignItems: 'center',
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: 1,
              fontSize: 28,
              lineHeight: 1.1,
              minWidth: '170px',
              pr: 1,
              overflow: 'visible',
              zIndex: 1200,
            }}
          >
            Sri Vrinda's
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.path} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
              {isLoggedIn && !isAdmin ? (
                // For mobile, include the account options in the same mobile menu
                [
                  <MenuItem key="my-bookings" component={RouterLink} to="/my-bookings" onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">My Bookings</Typography>
                  </MenuItem>,
                  <MenuItem key="wishlist" component={RouterLink} to="/wishlist" onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Wishlist</Typography>
                  </MenuItem>,
                  <MenuItem key="logout" onClick={() => { handleCloseNavMenu(); handleLogout(); }}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                ]
              ) : (
                <MenuItem key="login" component={RouterLink} to="/login" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              )}
              {isAdmin && (
                <MenuItem key="admin-panel" component={RouterLink} to="/admin-panel" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Admin Panel</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo/Brand for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            Sri Vrinda's
          </Typography>

          {/* Desktop menu and Login/Logout controls */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              {pages.map((page) => (
              <Button
                key={page.path}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ mx: 1, color: 'inherit', fontWeight: 600, fontSize: 18, letterSpacing: 1 }}
              >
                {page.title}
              </Button>
            ))}
            {isLoggedIn && (
              <>
                {!isAdmin && (
                  <>
                    <Button key="my-bookings-btn" component={RouterLink} to="/my-bookings" onClick={handleCloseNavMenu} sx={{ mx: 1, color: 'inherit', fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>
                      My Bookings
                    </Button>
                    <Tooltip key="wishlist-tooltip" title="My wishlist">
                      <IconButton key="wishlist-btn" component={RouterLink} to="/wishlist" size="large" color="inherit" sx={{ ml: 1 }}>
                        <Badge badgeContent={favCount} color="error">
                          <FavoriteIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </>
                )}

                {isAdmin && (
                  <Button key="admin-panel-btn" component={RouterLink} to="/admin-panel" onClick={handleCloseNavMenu} sx={{ mx: 1, color: 'inherit', fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>
                    Admin Panel
                  </Button>
                )}

                {/* Logout button with username underneath (visible for all logged-in users) */}
                <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button onClick={handleLogout} color="secondary" variant="outlined" sx={{ px: 2 }}>Logout</Button>
                  {displayName && (
                    <Typography sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'normal', textAlign: 'center', wordBreak: 'break-word' }}>
                      {`Hii...${displayName}`}
                    </Typography>
                  )}
                </Box>
              </>
            )}
            {!isLoggedIn && (
              <Button component={RouterLink} to="/login" color="primary" variant="contained" sx={{ ml: 2 }}>Login</Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
