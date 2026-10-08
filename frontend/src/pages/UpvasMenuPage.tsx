import React from 'react';
import { Container, Typography, Box, useTheme, Divider, Paper, Avatar, Button, Dialog, DialogContent, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
// Footer is provided globally by App.tsx
import CustomizationDialog from '../components/CustomizationDialog';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import { menuApi, userApi } from '../services/api';
import { getLocalFavoritesKey } from '../utils/localFavoritesKey';

// explicit mappings for upvas menu items stored under public/images/upvas
const upvasItemImageMap: Record<string, string> = {
  // Drinks
  'Fresh Fruit Juice': '/images/upvas/Drinks/Fresh Fruit Juice.jpg',
  'Masala Chaas': '/images/upvas/Drinks/Masala Chaas.jpg',
  'Coconut Water': '/images/upvas/Drinks/Coconut Water.jpg',
  'Lemon Water with Honey': '/images/upvas/Drinks/Lemon Water with Honey.jpg',
  // Snacks / Starters
  'Sabudana Vada': '/images/upvas/Snacks  Starters/Sabudana Vada.jpg',
  'Sabudana Khichdi': '/images/upvas/Snacks  Starters/Sabudana Khichdi.jpg',
  'Farali Dhokla': '/images/upvas/Snacks  Starters/Farali Dhokla.jpg',
  'Singhare ke Pakode': '/images/upvas/Snacks  Starters/Singhare ke Pakode.jpg',
  'Kuttu Atta Poori': '/images/upvas/Snacks  Starters/Kuttu Atta Poori.jpg',
  // Main Dishes
  'Aloo Tamatar Sabji': '/images/upvas/Main Dishes/Aloo Tamatar Sabji.jpg',
  'Dahi Aloo': '/images/upvas/Main Dishes/Dahi Aloo.jpg',
  'Sama Rice': '/images/upvas/Main Dishes/Sama Rice.jpg',
  'Kuttu Atta Paratha': '/images/upvas/Main Dishes/Kuttu Atta Paratha.jpg',
  'Makhana Mix': '/images/upvas/Main Dishes/Makhana Curry.jpg',
  'Lauki Raita': '/images/upvas/Main Dishes/Lauki Raita.jpg',
  'Pumpkin Sabji': '/images/upvas/Main Dishes/Pumpkin Sabji.jpg',
  // Sides
  'Curd': '/images/upvas/Sides/Curd.jpg',
  'Green Chutney': '/images/upvas/Sides/Green Chutney.jpg',
  'Peanut Salad': '/images/upvas/Sides/Peanut Salad.jpg',
  'Fruit Salad': '/images/upvas/Sides/Fruit Salad.jpg',
  // Sweets / Desserts
  'Sabudana Kheer': '/images/upvas/Sweets  Desserts/Sabudana Kheer.jpg',
  'Makhane ki Kheer': '/images/upvas/Sweets  Desserts/Makhane ki Kheer.jpg',
  'Lauki Halwa': '/images/upvas/Sweets  Desserts/Lauki Halwa.jpg',
  'Rajgira Ladoo': '/images/upvas/Sweets  Desserts/Rajgira Ladoo.jpg',
  'Coconut Barfi': '/images/upvas/Sweets  Desserts/Coconut Barfi.jpg',
};

// Price map (INR) for Upvas menu items — used as fallbacks when no API price is present
const upvasPriceMap: Record<string, number> = {
  // Drinks
  'Fresh Fruit Juice': 80,
  'Masala Chaas': 50,
  'Coconut Water': 60,
  'Lemon Water with Honey': 60,

  // Snacks / Starters
  'Sabudana Vada': 90,
  'Sabudana Khichdi': 120,
  'Farali Dhokla': 80,
  'Singhare ke Pakode': 100,
  'Kuttu Atta Poori': 60,

  // Main Dishes
  'Aloo Tamatar Sabji': 140,
  'Dahi Aloo': 130,
  'Sama Rice': 120,
  'Kuttu Atta Paratha': 90,
  'Makhana Mix': 180,
  'Lauki Raita': 40,
  'Pumpkin Sabji': 120,

  // Sides
  'Curd': 30,
  'Green Chutney': 20,
  'Peanut Salad': 80,
  'Fruit Salad': 90,

  // Sweets / Desserts
  'Sabudana Kheer': 90,
  'Makhane ki Kheer': 100,
  'Lauki Halwa': 90,
  'Rajgira Ladoo': 80,
  'Coconut Barfi': 70,
};

const upvasMenu = [
  {
    category: 'Drinks',
    icon: '🥤',
    image: '/images/juice1.jpg',
    items: [
      'Fresh Fruit Juice',
      'Masala Chaas',
      'Coconut Water',
      'Lemon Water with Honey',
    ]
  },
  {
    category: 'Snacks / Starters',
    icon: '🍴',
    image: '/images/sabudanavada.jpg',
    items: [
      'Sabudana Vada',
      'Sabudana Khichdi',
      'Farali Dhokla',
      'Singhare ke Pakode',
      'Kuttu Atta Poori',
    ]
  },
  {
    category: 'Main Dishes',
    icon: '🍲',
    image: '/images/sabudana11.jpg',
    items: [
      'Aloo Tamatar Sabji',
      'Dahi Aloo',
      'Sama Rice',
      'Kuttu Atta Paratha',
      'Makhana Mix',
      'Lauki Raita',
      'Pumpkin Sabji',
    ]
  },
  {
    category: 'Sides',
    icon: '🥗',
    image: '/images/fruitsalad.jpg',
    items: [
      'Curd',
      'Green Chutney',
      'Peanut Salad',
      'Fruit Salad',
    ]
  },
  {
    category: 'Sweets / Desserts',
    icon: '🍮',
    image: '/images/sabudanakheer.jpg',
    items: [
      'Sabudana Kheer',
      'Makhane ki Kheer',
      'Lauki Halwa',
      'Rajgira Ladoo',
      'Coconut Barfi',
    ]
  }
];

export default function UpvasMenuPage() {
  const theme = useTheme();
  const { cart, addToCart, changeQuantity, setCartOpen } = useCart();
  const [customOpen, setCustomOpen] = React.useState(false);
  const [customTarget, setCustomTarget] = React.useState<any>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [discoveredImages, setDiscoveredImages] = React.useState<Record<string, string>>({});
  const [fetchedItems, setFetchedItems] = React.useState<any[]>([]);

  // Image viewer
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerSrc, setViewerSrc] = React.useState<string | undefined>(undefined);
  const openViewer = (src?: string) => { if (!src) return; setViewerSrc(src); setViewerOpen(true); };
  const closeViewer = () => { setViewerOpen(false); setViewerSrc(undefined); };

  React.useEffect(() => {
    let mounted = true;
    menuApi.getAll().then((res) => {
      if (mounted) setFetchedItems(res.data || []);
    }).catch(() => {
      if (mounted) setFetchedItems([]);
    });
    return () => { mounted = false; };
  }, []);

  const openCustomize = (menuItem: any) => { setCustomTarget(menuItem); setCustomOpen(true); };
  const closeCustomize = () => { setCustomOpen(false); setCustomTarget(null); };
  const confirmCustomize = ({ notes, quantity }: { notes: string; quantity: number }) => {
    if (!customTarget) return closeCustomize();
    const itemWithOptions = { ...customTarget, customization: { notes } } as any;
    for (let i = 0; i < quantity; i++) addToCart(itemWithOptions);
    setCartOpen(true);
  };

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
      } catch (e) { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleFavorite = async (id: string) => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setFavorites((s) => {
        const exists = s.includes(id);
        const next = exists ? s.filter(x => x !== id) : [...s, id];
        try { localStorage.setItem(getLocalFavoritesKey(), JSON.stringify(next)); } catch(e) { }
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
    } catch (e) { /* ignore */ }
  };

  // probe filenames under public/images/menuimg/regular for images matching items (best-effort)
  const probeImageUrl = (url: string) => new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

  const makeCandidates = (name: string) => {
    const cleaned = name.replace(/\s+/g, ' ').trim();
    const noParens = cleaned.replace(/[()]/g, '');
    const forms = [cleaned, noParens, cleaned.replace(/\s+/g, '-'), noParens.replace(/\s+/g, '-'), cleaned.replace(/\s+/g, '_')];
    const exts = ['.jpg', '.jpeg', '.png', '.webp'];
    const list: string[] = [];
    for (const f of forms) {
      for (const e of exts) list.push(`/images/menuimg/regular/${f}${e}`);
      for (const e of exts) list.push(`/images/menuimg/regular/${f.toLowerCase()}${e}`);
    }
    return Array.from(new Set(list));
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const found: Record<string, string> = {};
      for (const section of upvasMenu) {
        for (const item of section.items) {
          const itemName = typeof item === 'string' ? item : (item as any).name;
          const id = `${section.category}-${itemName}`;
          const candidates = makeCandidates(itemName);
          for (const url of candidates) {
            // eslint-disable-next-line no-await-in-loop
            const ok = await probeImageUrl(url);
            if (ok) { found[id] = url; break; }
          }
        }
      }
      if (!mounted) return;
      setDiscoveredImages(found);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
      <Box sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Paper elevation={4} sx={{ background: 'linear-gradient(90deg, #fffaf0 0%, #fff3dd 100%)', py: { xs: 6, md: 8 }, mb: 6, borderRadius: 0, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" fontWeight={700} gutterBottom sx={{ color: '#d35400', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>
            Upvas Special Menu
          </Typography>
          <Typography variant="h5" sx={{ color: '#d35400' }}>
            Sattvic, fasting-friendly dishes for Ekadashi, festivals, and special upvas days
          </Typography>
        </Paper>
        <Container maxWidth="lg" sx={{ pr: { xs: 2, md: 10 } }}>
          {upvasMenu.map((section) => {
            const displayCategory = section.category.replace(/\s*\/\s*/g, ' ');
            const apiItems = fetchedItems.filter((item) =>
              (item.menuGroup === 'Upvas' || !item.menuGroup) &&
              (String(item.category || '').toLowerCase() === section.category.toLowerCase() ||
                (section.category === 'Drinks' && String(item.category || '').toLowerCase() === 'beverages'))
            );
            const sectionItems = [
              ...section.items,
              ...apiItems.filter((apiItem) => !section.items.some((item) => String(item).trim().toLowerCase() === String(apiItem.name).trim().toLowerCase())),
            ];
            return (
              <Box key={section.category} sx={{ mb: 7, borderRadius: 4, overflow: 'hidden', position: 'relative', minHeight: 320, background: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url(${section.image}) center/cover no-repeat`, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, pt: 4 }}>
                  <Avatar src={section.image} alt={displayCategory} sx={{ width: 90, height: 90, mb: 1, boxShadow: 2, bgcolor: '#fff' }} variant="circular" />
                  <Typography variant="h4" color="primary" fontWeight={600} gutterBottom sx={{ letterSpacing: 1, whiteSpace: { xs: 'normal', sm: 'nowrap' } }}>{displayCategory}</Typography>
                </Box>
                <Divider sx={{ mb: 3, bgcolor: theme.palette.primary.main, height: 3, width: 80, mx: 'auto', borderRadius: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2, alignItems: 'stretch', pb: 4, p: 2 }}>
                  {sectionItems.map((item: any) => {
                    const itemName = typeof item === 'string' ? item : (item as any).name;
                    const trimmedName = String(itemName).trim();
                    const displayName = (typeof item === 'string' ? item : (item as any).name).replace(/\s*\/\s*/g, ' ');
                    const id = `${section.category}-${trimmedName}`;
                    // Use nullish coalescing to pick fallback price; guard with trimmed key to avoid mismatches
                    const resolvedPrice = typeof item === 'string' ? (upvasPriceMap[trimmedName] ?? 0) : (item.price ?? upvasPriceMap[trimmedName] ?? 0);
                    const menuItem = {
                      _id: id,
                      name: displayName,
                      category: section.category,
                      price: resolvedPrice,
                      description: '',
                      image: upvasItemImageMap[itemName] || discoveredImages[id] || section.image,
                      isAvailable: true,
                    } as any;
                    const cartEntry = (() => { try { return cart.find((ci) => ci.item._id === id) || null; } catch { return null; } })();
                    const inCart = Boolean(cartEntry);

                    return (
                      <Paper key={id} elevation={2} sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', minHeight: 120, alignItems: 'center', gap: 2, width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: '1 1 auto', minWidth: 0, flexBasis: 0, pr: 1 }}>
                          <Avatar src={discoveredImages[menuItem._id] || menuItem.image} alt={menuItem.name} variant="rounded" sx={{ width: 72, height: 72, flexShrink: 0, bgcolor: '#fff', boxShadow: 1, cursor: 'pointer', mr: 1 }} onClick={() => openViewer(discoveredImages[menuItem._id] || menuItem.image)} />
                          <Box sx={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title={menuItem.name} placement="top" arrow>
                              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', display: 'block', color: 'text.primary', fontSize: { xs: '1rem', md: '1.05rem' } }}>{menuItem.name}</Typography>
                            </Tooltip>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                              {menuItem.price ? `₹${menuItem.price}` : ''}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
                              {inCart ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                  <Button size="small" variant="outlined" onClick={() => changeQuantity(id, -1)}>-</Button>
                                  <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{cartEntry?.quantity ?? 0}</Typography>
                                  <Button size="small" variant="outlined" onClick={() => changeQuantity(id, 1)}>+</Button>
                                  <Button variant="contained" color="secondary" size="small" startIcon={<ShoppingCartIcon />} onClick={() => setCartOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>View Cart</Button>
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
                                  <Button variant="outlined" size="small" onClick={() => openCustomize(menuItem)} sx={{ py: 0.35, px: 0.9, fontSize: '0.72rem', minWidth: 'auto', textTransform: 'none' }}>Customize</Button>
                                  <Box sx={{ display: 'inline-flex', gap: 0.4, alignItems: 'center', flexShrink: 0 }}>
                                    <IconButton size="small" onClick={() => toggleFavorite(menuItem._id)} aria-label="favorite" sx={{ p: 0.35 }}>{favorites.includes(menuItem._id) ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}</IconButton>
                                    <Button variant="contained" color="primary" size="small" startIcon={<ShoppingCartIcon fontSize="small" />} onClick={() => { addToCart(menuItem); setCartOpen(true); }} sx={{ fontWeight: 700, borderRadius: 2, minWidth: 'auto', px: 0.6, py: 0.35, fontSize: '0.76rem', textTransform: 'none' }}>Add</Button>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Container>
      </Box>
      <CustomizationDialog open={customOpen} menuItemName={customTarget?.name} initialQuantity={1} onClose={closeCustomize} onConfirm={confirmCustomize} />
      <Dialog open={viewerOpen} onClose={closeViewer} maxWidth="lg">
        <DialogContent sx={{ p: 0, backgroundColor: '#000' }}>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton onClick={closeViewer} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }} aria-label="close"><CloseIcon /></IconButton>
            {viewerSrc ? <img src={viewerSrc} alt="menu" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', display: 'block' }} /> : null}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
