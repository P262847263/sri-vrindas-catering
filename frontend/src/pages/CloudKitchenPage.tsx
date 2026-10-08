import React from 'react';
import { Container, Typography, Box, useTheme, Divider, Paper, Avatar, Button, IconButton } from '@mui/material';
// Footer is provided globally by App.tsx
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import CustomizationDialog from '../components/CustomizationDialog';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userApi } from '../services/api';
import { menuApi } from '../services/api';
import { getLocalFavoritesKey } from '../utils/localFavoritesKey';

const cloudSections = [
  {
    category: 'Daily Tiffin Service',
    image: '/images/main1.jpg',
    items: [
      'Regular Tiffin – 2 Chapati | 1 Subzi | Rice | Dal | Salad',
      'Special Tiffin – 3 Chapati | 2 Subzi | Rice | Dal | Sweet',
      'Mini Tiffin – 2 Chapati | 1 Subzi | Curd | Rice',
      'Ekadashi Tiffin – Sabudana Khichdi | Paneer Curry | Fruit | Curd',
      'South Indian Tiffin – Idli | Vada | Upma | Chutney | Sambar',
    ],
  },
  {
    category: 'Breakfast Menu',
    image: '/images/food1.jpg',
    items: [
      'Idli Sambar',
      'Medu Vada with Coconut Chutney',
      'Upma / Rava Kichdi',
      'Pongal with Sambar',
      'Poha with Sev and Coconut',
      'Aloo Paratha with Curd and Pickle',
      'Vegetable Sandwich / Paneer Sandwich',
      'Dosa Varieties – Plain, Masala, Rava, Set Dosa',
      'Poori Bhaji',
      'Sabudana Khichdi (Fasting Option)'
    ],
  },
  {
    category: 'Lunch Menu',
    image: '/images/rice.jpg',
    items: [
      'North Indian Thali (Chapati, Dal, Rice, 2 Curries, Sweet)',
      'South Indian Meal (Sambar, Rasam, Poriyal, Rice, Curd)',
      'Jeera Rice with Dal Tadka',
      'Paneer Butter Masala with Roti',
      'Veg Pulao with Raita',
      'Chole Bhature Combo',
      'Mixed Veg Curry with Chapati',
      'Curd Rice with Pickle',
    ],
  },
  {
    category: 'Dinner Menu',
    image: '/images/biryani.jpg',
    items: [
      'Phulka / Roti with Dal and Subzi',
      'Khichdi with Curd and Papad',
      'Veg Biryani with Raita',
      'Paneer Tikka Masala with Naan',
      'Stuffed Paratha with Boondi Raita',
      'Lemon Rice with Aloo Fry',
      'Light Mini Thali (Chapati, 1 Curry, Rice, Sweet)'
    ],
  },
  {
    category: 'Starters & Snacks',
    image: '/images/st1.jpg',
    items: [
      'Paneer Tikka',
      'Veg Cutlet',
      'Hara Bhara Kabab',
      'Dhokla / Khandvi',
      'Samosa / Kachori',
      'Mini Idli Fry'
    ],
  },
  {
    category: 'Sweets & Desserts',
    image: '/images/desserts.jpg',
    items: [
      'Gulab Jamun',
      'Rasgulla',
      'Kheer / Payasam',
      'Moong Dal Halwa',
      'Kesari Bath / Sheera',
      'Ladoo (Besan, Coconut, Boondi)'
    ],
  },
  {
    category: 'Beverages & Add-Ons',
    image: '/images/bevarages.jpg',
    items: [
      'Buttermilk (Chaas)',
      'Sweet Lassi / Salted Lassi',
      'Fresh Lemon Soda',
      'Tulsi / Jeera Herbal Drink',
      'Salad & Raita',
      'Papad & Pickle',
      'Extra Sweet Bowl'
    ],
  }
];

export default function CloudKitchenPage() {
  const theme = useTheme();
  const { cart, addToCart, changeQuantity, setCartOpen } = useCart();
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [customOpen, setCustomOpen] = React.useState(false);
  const [customTarget, setCustomTarget] = React.useState<any>(null);
  const [fetchedItems, setFetchedItems] = React.useState<any[]>([]);

  const openCustomize = (menuItem: any) => { setCustomTarget(menuItem); setCustomOpen(true); };
  const closeCustomize = () => { setCustomOpen(false); setCustomTarget(null); };
  const confirmCustomize = ({ notes, quantity }: { notes: string; quantity: number }) => {
    if (!customTarget) return closeCustomize();
    const itemWithOptions = { ...customTarget, customization: { notes } } as any;
    // add multiple times according to quantity
    for (let i = 0; i < quantity; i++) addToCart(itemWithOptions);
    setCartOpen(true);
    closeCustomize();
  };

  React.useEffect(() => {
    let mounted = true;
    menuApi.getAll().then((res) => {
      if (mounted) setFetchedItems(res.data || []);
    }).catch(() => {
      if (mounted) setFetchedItems([]);
    });
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await userApi.getFavorites();
        if (!mounted) return;
        const data = res.data || [];
        const ids = Array.isArray(data) ? data.map((m: any) => m._id).filter(Boolean) : [];
        const local = JSON.parse(localStorage.getItem(getLocalFavoritesKey()) || '[]');
        const merged = Array.from(new Set([...(ids || []), ...(Array.isArray(local) ? local : [])]));
        setFavorites(merged);
      } catch (e) {
        // ignore if not logged in or API fails
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleFavorite = async (id: string) => {
    // If id is not a Mongo ObjectId, toggle locally in localStorage
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setFavorites((s) => {
        const exists = s.includes(id);
        const next = exists ? s.filter(x => x !== id) : [...s, id];
        try { localStorage.setItem(getLocalFavoritesKey(), JSON.stringify(next)); } catch(e) {}
        try { window.dispatchEvent(new CustomEvent('favoritesChanged')); } catch(e) { /* ignore */ }
        return next;
      });
      return;
    }
    try {
      if (favorites.includes(id)) {
        await userApi.removeFavorite(id);
        setFavorites((s) => s.filter((x) => x !== id));
      } else {
        await userApi.addFavorite(id);
        setFavorites((s) => [...s, id]);
      }
    } catch (e) {
      // ignore
    }
  };

  // Simple pricing heuristic — replace with real prices from backend when available
  const getPrice = (category: string, name: string) => {
    const n = (name || '').toLowerCase();
    const c = (category || '').toLowerCase();
    if (c.includes('tiffin')) {
      if (n.includes('special')) return 140;
      if (n.includes('mini')) return 70;
      return 199; // regular
    }
    if (c.includes('breakfast')) return 120;
    if (c.includes('lunch') || c.includes('dinner')) {
      if (n.includes('biryani') || n.includes('pulao')) return 160;
      if (n.includes('thali')) return 180;
      return 249;
    }
    if (c.includes('starters')) return 90;
    if (c.includes('dessert')) return 60;
    if (c.includes('beverages')) return 40;
    return 99;
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)' }}>
      <Box sx={{ flex: 1 }}>
        <Paper
          elevation={4}
          sx={{
            // Use same warm cream hero background as RegularMenuPage for visual parity
            background: 'linear-gradient(90deg, #fffaf0 0%, #fff3dd 100%)',
            py: { xs: 6, md: 8 },
            mb: 6,
            borderRadius: 0,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{ color: '#d35400', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}
          >
            🌿 Sri Vrinda’s Cloud Kitchen
          </Typography>
          <Typography variant="h5" sx={{ color: '#d35400' }}>
            Healthy, sattvik meals delivered to your door — daily tiffins, breakfast, lunch & more.
          </Typography>
        </Paper>

        <Container maxWidth="lg">
          {cloudSections.map((section) => (
            <Box
              key={section.category}
              sx={{
                mb: 7,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 260,
                background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${section.image}) center/cover no-repeat`,
                boxShadow: 3,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, pt: 3 }}>
                <Avatar src={section.image} alt={section.category} sx={{ width: 90, height: 90, mb: 1, boxShadow: 2, bgcolor: '#fff' }} variant="circular" />
                <Typography variant="h4" color="primary" fontWeight={600} gutterBottom sx={{ letterSpacing: 1 }}>
                  {section.category}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3, bgcolor: theme.palette.primary.main, height: 3, width: 80, mx: 'auto', borderRadius: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(220px, 1fr))' }, gap: 3, pb: 4, px: 2 }}>
                {[...section.items, ...fetchedItems.filter((apiItem) =>
                  (apiItem.menuGroup === 'Cloud Kitchen' || !apiItem.menuGroup) &&
                  String(apiItem.category || '').toLowerCase() === section.category.toLowerCase() &&
                  !section.items.some((item) => String(item).trim().toLowerCase() === String(apiItem.name).trim().toLowerCase())
                )].map((item: any) => {
                  const itemName = typeof item === 'string' ? item : item.name;
                  const id = item._id || `${section.category}-${itemName}`;
                  const price = typeof item === 'string' ? getPrice(section.category, item) : (item.price ?? getPrice(section.category, itemName));
                  const menuItem = {
                    _id: id,
                    name: itemName,
                    category: section.category,
                    price,
                    description: '',
                    image: item.image || section.image,
                    isAvailable: true,
                  } as any;
                  // split long item strings into a compact title + details
                  const raw = String(itemName || '');
                  // split on dash (–), forward slash (/) or pipe (|) to get a short title and remaining details
                  const parts = raw.split(/[–\/|]/).map(s => s.trim()).filter(Boolean);
                  const title = parts.length ? parts[0] : raw;
                  const details = parts.length > 1 ? parts.slice(1).join(', ') : '';
                  // Prefer an entry without customization when showing inline controls for plain Add-to-Cart flows.
                  const cartEntry = (() => {
                    // entry with no customization (default Add to Cart)
                    const plain = cart.find((ci) => ci.item._id === id && (ci.customization === null || ci.customization === undefined));
                    if (plain) return plain;
                    // fallback to any entry with same id (could be customized)
                    return cart.find((ci) => ci.item._id === id) || null;
                  })();
                  const inCart = Boolean(cartEntry);

                  return (
                    <Paper
                      key={id}
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: 2,
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
                      }}
                    >
                      <Box sx={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#222', whiteSpace: 'normal' }}>
                            {title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 700 }}>
                            ₹{menuItem.price?.toLocaleString('en-IN')}
                          </Typography>
                          {details ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontSize: '0.95rem' }}>
                              {details}
                            </Typography>
                          ) : null}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
                          {inCart ? (
                            <>
                              <Button size="small" variant="outlined" onClick={() => changeQuantity(id, -1, cartEntry?.customization)}>-</Button>
                              <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{cartEntry?.quantity ?? 0}</Typography>
                              <Button size="small" variant="outlined" onClick={() => changeQuantity(id, 1, cartEntry?.customization)}>+</Button>
                              <Button variant="contained" color="secondary" size="small" startIcon={<ShoppingCartIcon />} onClick={() => setCartOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
                                View
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outlined" size="small" onClick={() => openCustomize(menuItem)} sx={{ textTransform: 'none' }}>Customize</Button>
                              <IconButton size="small" onClick={() => toggleFavorite(menuItem._id)} aria-label="favorite">
                                {favorites.includes(menuItem._id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                              </IconButton>
                              <Button variant="contained" color="primary" size="small" startIcon={<ShoppingCartIcon />} onClick={() => { addToCart(menuItem); setCartOpen(true); }} sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}>
                                Add
                              </Button>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Container>
        <CustomizationDialog open={customOpen} menuItemName={customTarget?.name} initialQuantity={1} onClose={closeCustomize} onConfirm={confirmCustomize} />
      </Box>
  {/* Footer is now global in App.tsx */}
    </Box>
  );
}
