import { useEffect, useState } from 'react';
import { Box, Typography, Container, Divider, Paper, Button, useTheme, IconButton, Dialog, DialogContent, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// Footer is provided globally by App.tsx
import { useCart } from '../context/CartContext';
import { menuApi } from '../services/api';
import CustomizationDialog from '../components/CustomizationDialog';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userApi } from '../services/api';
import { getLocalFavoritesKey } from '../utils/localFavoritesKey';

const partyMenu = [
  { title: 'Welcome Drinks', category: 'Beverages', items: ['Fruit Punch','Jaljeera','Lemon Soda','Mango Shake','Milk Shake','Mocktails','Orange Juice','Rose Sharbat','Shikanji','Soft Drinks','Strawberry Shake'], image: '/images/drink.jpg' },
  { title: 'Starters', category: 'Starters', items: [
    'Aloo Bonda',
    'Aloo Chat',
    'Bhel Puri',
    'Bread Toast',
    'Cheese Balls',
    'Cheese Corn Ball',
    'Cheese Sandwich',
    'Crispy Corn',
    'Dahi Puri Chat',
    'Dhokla',
    'French Fries',
    'Ghoogni Chat',
    'Grill Sandwich',
    'Hara Bhara Kabab',
    'Kachori',
    'Khasta Kachori Chat',
    'Mini Samosa',
    'Paneer Tikka',
    'Pani Puri',
    'Papdi Chat',
    'Sev Puri Chat',
    'Spring Roll',
    'Tikki Chola Chat',
    'Vada Pav',
    'Veg Cutlet',
    'Veg Manchurian Dry',
    'Veg Roll',
    'Veg Spring Rolls'
  ], image: '/images/starters.jpg' },
  { title: 'Main Course', category: 'Main Course', items: [
    'Chole Bhature',
    'Dal Makhani',
    'Fried Rice',
    'Jeera Rice with Dal Tadka',
    'Kadai Paneer',
    'Lauki Kofta',
    'Malai Kofta',
    'Manchurian Gravy',
    'Pav Bhaji',
    'Poori Aloo Sabji',
    'Pulao',
    'Shahi Paneer',
    'Veg Biryani'
  ], image: '/images/pav.jpg' },
  { title: 'Heavy Dishes', category: 'Main Course', items: [
    'Chole Bhature',
    'Chole Chawal',
    'Fried Rice with Manchurian',
    'Hakka Noodles with Chilli Paneer',
    'Kadhi Chawal',
    'Pav Bhaji',
    'Poori Aloo Sabji',
    'Rajma Chawal',
    'Stuffed Paratha with Curd & Pickle',
    'Veg Pulao with Raita'
  ], image: '/images/pav.jpg' },
  
  { title: 'Indian Breads', category: 'Indian Breads', items: ['Butter Naan','Chapati','Ghee Roti','Lachha Paratha','Tandoori Roti'], image: '/images/roti.jpg' },
  { title: 'Sides', category: 'Sides', items: ['Green Salad','Papad','Raita ','Pickle'], image: '/images/salad.jpg' },
  { title: 'Desserts', category: 'Desserts', items: [
    'Gulab Jamun',
    'Rasmalai',
    'Pastry',
    'Gajar ka Halwa',
    'Moong Dal Halwa (seasonal)',
    'Black Forest Cake',
    'White Forest Cake',
    'Pineapple Cake',
    'Chocolate Truffle Cake',
    'Red Velvet Cake',
    'Butterscotch Cake',
    'Fresh Fruit Cake',
    'Vanilla Cream Cake',
    'Strawberry Cake',
    'Mango Cake (seasonal)',
    'Vanilla ice cream',
    'Chocolate ice cream',
    'Strawberry ice cream',
    'Butter Scotch ice cream',
    'Kesar Pista ice cream'
  ], image: '/images/dessert.jpg' },
];

const birthdaySections = [
  { title: 'Chinese', category: 'Starters', items: ['Veg Noodles','Veg Manchurian','Fried Rice','Gobi Manchurian','Paneer Manchurian'], image: '/images/chinese.jpg' },
  { title: 'Italian', items: ['Red Pasta','White Pasta','Veg Burger','Pizza'], image: '/images/itelian.jpg' },
];

// Keep original sections order: partyMenu followed by birthdaySections
const consolidatedMenu = [...partyMenu, ...birthdaySections];

// Explicit image mapping for Party images (Welcome Drinks folder)
const partyImageMap: Record<string, string> = {
  'Fruit Punch': '/images/Party/Welcome Drinks/Fruit Punch.jpg',
  'Jaljeera': '/images/Party/Welcome Drinks/Jaljeera.jpg',
  'Lemon Soda': '/images/Party/Welcome Drinks/Lemon Soda.jpg',
  'Mango Shake': '/images/Party/Welcome Drinks/Mango Shake.jpg',
  'Milk Shake': '/images/Party/Welcome Drinks/Milk Shake.jpg',
  'Mocktails': '/images/Party/Welcome Drinks/Mocktails.jpg',
  'Orange Juice': '/images/Party/Welcome Drinks/Orange Juice.jpg',
  'Rose Sharbat': '/images/Party/Welcome Drinks/Rose Sharbat.jpg',
  'Shikanji': '/images/Party/Welcome Drinks/Shikanji.jpg',
  'Soft Drinks': '/images/Party/Welcome Drinks/Soft Drinks.jpg',
  'Strawberry Shake': '/images/Party/Welcome Drinks/Strawberry Shake.jpg',
  'Aloo Bonda': '/images/Party/Starters/Aloo Bonda.jpg',
  'Aloo Chat': '/images/Party/Starters/Aloo Chat.jpg',
  'Bhel Puri': '/images/Party/Starters/Bhel Puri.jpg',
  'Bread Toast': '/images/Party/Starters/Bread Toast.jpg',
  'Cheese Balls': '/images/Party/Starters/Cheese Balls.jpg',
  'Cheese Corn Ball': '/images/Party/Starters/Cheese Corn Ball.jpg',
  'Cheese Sandwich': '/images/Party/Starters/Cheese Sandwich.jpg',
  'Crispy Corn': '/images/Party/Starters/Crispy Corn.jpg',
  'Dahi Puri Chat': '/images/Party/Starters/Dahi Puri Chat.jpg',
  'Dhokla': '/images/Party/Starters/Dhokla.jpg',
  'French Fries': '/images/Party/Starters/French Fries.jpg',
  'Ghoogni Chat': '/images/Party/Starters/Ghoogni Chat.jpg',
  'Grill Sandwich': '/images/Party/Starters/Grill Sandwich.jpg',
  'Hara Bhara Kabab': '/images/Party/Starters/Hara Bhara Kabab.jpg',
  'Kachori': '/images/Party/Starters/Kachori.jpg',
  'Khasta Kachori Chat': '/images/Party/Starters/Khasta Kachori Chat.jpg',
  'Mini Samosa': '/images/Party/Starters/Mini Samosa.jpg',
  'Paneer Tikka': '/images/Party/Starters/Paneer Tikka.jpg',
  'Pani Puri': '/images/Party/Starters/Pani Puri.jpg',
  'Papdi Chat': '/images/Party/Starters/Papdi Chat.jpg',
  'Sev Puri Chat': '/images/Party/Starters/Sev Puri Chat.jpg',
  'Spring Roll': '/images/Party/Starters/Spring Roll.jpg',
  'Tikki Chola Chat': '/images/Party/Starters/Tikki Chola Chat.jpg',
  'Vada Pav': '/images/Party/Starters/Vada Pav.jpg',
  'Veg Cutlet': '/images/Party/Starters/Veg Cutlet.jpg',
  'Veg Manchurian Dry': '/images/Party/Starters/Veg Manchurian Dry.jpg',
  'Veg Roll': '/images/Party/Starters/Veg Roll.jpg',
  'Veg Spring Rolls': '/images/Party/Starters/Veg Spring Rolls.jpg',
  'Butter Naan': '/images/Party/Indian Breads/Butter Naan.jpg',
  'Chapati': '/images/Party/Indian Breads/Chapati.jpg',
  'Ghee Roti': '/images/Party/Indian Breads/Ghee Roti.jpg',
  'Lachha Paratha': '/images/Party/Indian Breads/Lachha Paratha.jpg',
  'Tandoori Roti': '/images/Party/Indian Breads/Tandoori Roti.jpg',
  'Chole Bhature': '/images/Party/Heavy Dishes/Chole Bhature.jpg',
  'Dal Makhani': '/images/Party/Main Course/Dal Makhani.jpg',
  'Fried Rice': '/images/Party/Main Course/Fried Rice.jpg',
  'Jeera Rice with Dal Tadka': '/images/Party/Main Course/Jeera Rice with Dal Tadka.jpg',
  'Kadai Paneer': '/images/Party/Main Course/Kadai Paneer.jpg',
  'Lauki Kofta': '/images/Party/Main Course/Lauki Kofta.jpg',
  'Malai Kofta': '/images/Party/Main Course/Malai Kofta.jpg',
  'Manchurian Gravy': '/images/Party/Main Course/Manchurian Gravy.jpg',
  'Pav Bhaji': '/images/Party/Main Course/Pav Bhaji.jpg',
  'Poori Aloo Sabji': '/images/Party/Main Course/Poori Aloo Sabji.jpg',
  'Pulao': '/images/Party/Main Course/Pulao.jpg',
  'Shahi Paneer': '/images/Party/Main Course/Shahi Paneer.jpg',
  'Veg Biryani': '/images/Party/Main Course/Veg Biryani.jpg',
  'Chole Chawal': '/images/Party/Heavy Dishes/Chole Chawal.jpg',
  'Fried Rice with Manchurian': '/images/Party/Heavy Dishes/Fried Rice with Manchurian.jpg',
  'Hakka Noodles with Chilli Paneer': '/images/Party/Heavy Dishes/Hakka Noodles with Chilli Paneer.jpg',
  'Kadhi Chawal': '/images/Party/Heavy Dishes/Kadhi Chawal.jpg',
  'Rajma Chawal': '/images/Party/Heavy Dishes/Rajma Chawal.jpg',
  'Stuffed Paratha with Curd & Pickle': '/images/Party/Heavy Dishes/Stuffed Paratha with Curd & Pickle.jpg',
  'Veg Pulao with Raita': '/images/Party/Heavy Dishes/Veg Pulao with Raita.jpg',
  // Desserts images
  'Gulab Jamun': '/images/Party/Desserts/Gulab Jamun.jpg',
  'Rasmalai': '/images/Party/Desserts/Rasmalai.jpg',
  'Pastry': '/images/Party/Desserts/Pastry.jpg',
  'Gajar ka Halwa': '/images/Party/Desserts/Gajar ka Halwa.jpg',
  'Moong Dal Halwa (seasonal)': '/images/Party/Desserts/Moong Dal Halwa.jpg',
  'Black Forest Cake': '/images/Party/Desserts/Black Forest Cake.jpg',
  'White Forest Cake': '/images/Party/Desserts/White Forest Cake.jpg',
  'Pineapple Cake': '/images/Party/Desserts/Pineapple Cake.jpg',
  'Chocolate Truffle Cake': '/images/Party/Desserts/Chocolate Truffle Cake.jpg',
  'Red Velvet Cake': '/images/Party/Desserts/Red Velvet Cake.jpg',
  'Butterscotch Cake': '/images/Party/Desserts/Butterscotch Cake.jpg',
  'Fresh Fruit Cake': '/images/Party/Desserts/Fresh Fruit Cake.jpg',
  'Vanilla Cream Cake': '/images/Party/Desserts/Vanilla Cream Cake.jpg',
  'Strawberry Cake': '/images/Party/Desserts/Strawberry Cake.jpg',
  'Mango Cake (seasonal)': '/images/Party/Desserts/Mango Cake.jpg',
  'Vanilla ice cream': '/images/Party/Desserts/Vanilla ice cream.jpg',
  'Chocolate ice cream': '/images/Party/Desserts/Chocolate ice cream.jpg',
  'Strawberry ice cream': '/images/Party/Desserts/Strawberry ice cream.jpg',
  'Butter Scotch ice cream': '/images/Party/Desserts/Butter Scotch ice cream.jpg',
  'Kesar Pista ice cream': '/images/Party/Desserts/Kesar Pista ice cream.jpg',
  'Anjoori Rasmalai': '/images/Party/Desserts/Anjoori Rasmalai.jpg',
  'Jalebi': '/images/Party/Desserts/Jalebi.jpg',
  'Cham Cham': '/images/Party/Desserts/Cham Cham.jpg',
  'Rasagulla': '/images/Party/Desserts/Rasagulla.jpg',
  // Chinese section images
  'Veg Noodles': '/images/Party/Chinese/Veg Noodles.jpg',
  'Veg Manchurian': '/images/Party/Chinese/Veg Manchurian.jpg',
  'Gobi Manchurian': '/images/Party/Chinese/Gobi Manchurian.jpg',
  'Paneer Manchurian': '/images/Party/Chinese/Paneer Manchurian.jpg',
  'Red Pasta': '/images/Party/Italian/Red Pasta.jpg',
'White Pasta': '/images/Party/Italian/White Pasta.jpg',
'Veg Burger': '/images/Party/Italian/Veg Burger.jpg',
'Pizza':'/images/Party/Italian/Pizza.jpg',

};

// Sides images
partyImageMap['Green Salad'] = '/images/Party/Sides/Green Salad.jpg';
partyImageMap['Papad'] = '/images/Party/Sides/Papad.jpg';
partyImageMap['Pickle'] = '/images/Party/Sides/Pickle.jpg';
partyImageMap['Raita'] = '/images/Party/Sides/Raita.jpg';
// Italian images

// Prices (INR) for Party Menu items - fallbacks when API doesn't provide prices
const partyPriceMap: Record<string, number> = {
  // Welcome Drinks
  'Fruit Punch': 60,
  'Jaljeera': 40,
  'Lemon Soda': 40,
  'Mango Shake': 120,
  'Milk Shake': 110,
  'Mocktails': 140,
  'Orange Juice': 90,
  'Rose Sharbat': 60,
  'Shikanji': 50,
  'Soft Drinks': 40,
  'Strawberry Shake': 120,

  // Starters (per plate/portion)
  'Aloo Bonda': 40,
  'Aloo Chat': 70,
  'Bhel Puri': 70,
  'Bread Toast': 60,
  'Cheese Balls': 90,
  'Cheese Corn Ball': 95,
  'Cheese Sandwich': 80,
  'Crispy Corn': 80,
  'Dahi Puri Chat': 80,
  'Dhokla': 60,
  'French Fries': 90,
  'Ghoogni Chat': 80,
  'Grill Sandwich': 120,
  'Hara Bhara Kabab': 140,
  'Kachori': 50,
  'Khasta Kachori Chat': 70,
  'Mini Samosa': 40,
  'Paneer Tikka': 220,
  'Pani Puri': 60,
  'Papdi Chat': 80,
  'Sev Puri Chat': 80,
  'Spring Roll': 100,
  'Tikki Chola Chat': 80,
  'Vada Pav': 50,
  'Veg Cutlet': 70,
  'Veg Manchurian Dry': 150,
  'Veg Roll': 90,
  'Veg Spring Rolls': 100,

  // Main Course
  'Chole Bhature': 160,
  'Dal Makhani': 140,
  'Fried Rice': 120,
  'Jeera Rice with Dal Tadka': 130,
  'Kadai Paneer': 230,
  'Lauki Kofta': 150,
  'Malai Kofta': 160,
  'Manchurian Gravy': 160,
  'Pav Bhaji': 140,
  'Poori Aloo Sabji': 140,
  'Pulao': 120,
  'Shahi Paneer': 240,
  'Veg Biryani': 160,

  // Heavy Dishes
  'Chole Chawal': 150,
  'Fried Rice with Manchurian': 220,
  'Hakka Noodles with Chilli Paneer': 220,
  'Kadhi Chawal': 130,
  'Rajma Chawal': 140,
  'Stuffed Paratha with Curd & Pickle': 120,
  'Veg Pulao with Raita': 140,

  // Indian Breads
  'Butter Naan': 30,
  'Chapati': 15,
  'Ghee Roti': 20,
  'Lachha Paratha': 45,
  'Tandoori Roti': 20,

  // Sides
  'Green Salad': 60,
  'Papad': 20,
  'Pickle': 20,
  'Raita': 40,

  // Desserts
  'Gulab Jamun': 60,
  'Rasmalai': 80,
  'Pastry': 50,
  // Chinese items pricing
  'Veg Noodles': 120,
  'Veg Manchurian': 180,
  'Gobi Manchurian': 170,
  'Paneer Manchurian': 200,
  'Gajar ka Halwa': 90,
  'Moong Dal Halwa (seasonal)': 120,
  'Black Forest Cake': 450,
  'White Forest Cake': 450,
  'Pineapple Cake': 450,
  'Chocolate Truffle Cake': 550,
  'Red Velvet Cake': 500,
  'Butterscotch Cake': 450,
  'Fresh Fruit Cake': 500,
  'Vanilla Cream Cake': 400,
  'Strawberry Cake': 450,
  'Mango Cake (seasonal)': 500,
  'Vanilla ice cream': 60,
  'Chocolate ice cream': 60,
  'Strawberry ice cream': 60,
  'Butter Scotch ice cream': 60,
  'Kesar Pista ice cream': 90,
    // Italian section prices
    'Red Pasta': 180,
    'White Pasta': 180,
    'Veg Burger': 150,
    'Pizza': 250,
};



export default function PartyMenuPage() {
  const theme = useTheme();
  const { cart, addToCart, changeQuantity, setCartOpen } = useCart();
  const [customOpen, setCustomOpen] = useState(false);
  const [customTarget, setCustomTarget] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [discoveredImages, setDiscoveredImages] = useState<Record<string, string>>({});

  // Image viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string | undefined>(undefined);
  const openViewer = (src?: string) => { if (!src) return; setViewerSrc(src); setViewerOpen(true); };
  const closeViewer = () => { setViewerOpen(false); setViewerSrc(undefined); };

  const openCustomize = (menuItem: any) => { setCustomTarget(menuItem); setCustomOpen(true); };
  const closeCustomize = () => { setCustomOpen(false); setCustomTarget(null); };
  const confirmCustomize = ({ notes, quantity }: { notes: string; quantity: number }) => {
    if (!customTarget) return closeCustomize();
    const itemWithOptions = { ...customTarget, customization: { notes } } as any;
    for (let i = 0; i < quantity; i++) addToCart(itemWithOptions);
    setCartOpen(true);
    closeCustomize();
  };
  const [fetchedItems, setFetchedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const fetchItems = async () => {
      try {
        const res = await menuApi.getAll();
        if (!mounted) return;
        setFetchedItems(res.data || []);
      } catch (err) {
        if (!mounted) return;
        setFetchedItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchItems();
    return () => { mounted = false; };
  }, []);

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      const found: Record<string, string> = {};
      for (const section of consolidatedMenu) {
          for (const item of section.items) {
            const itemName = typeof item === 'string' ? item : (item as any).name;
            // use category-based id so it matches render ids
            const category = section.category || getCategory(section.title);
            const id = `${category}-${itemName}`;
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

  useEffect(() => {
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
        let next: string[];
        if (exists) next = s.filter((x) => x !== id);
        else next = [...s, id];
        try { localStorage.setItem(getLocalFavoritesKey(), JSON.stringify(next)); } catch (e) { /* ignore */ }
        try { window.dispatchEvent(new CustomEvent('favoritesChanged')); } catch (e) { /* ignore */ }
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

  const getCategory = (title: string) => {
    const t = (title || '').toLowerCase();
    if (t.includes('cake') || t.includes('dessert') || t.includes('ice cream')) return 'Desserts';
    if (t.includes('starter') || t.includes('starters') || t.includes('chinese') || t.includes('italian')) return 'Starters';
    if (t.includes('drink') || t.includes('welcome') || t.includes('beverage') || t.includes('juice') || t.includes('shake')) return 'Beverages';
    if (t.includes('main') || t.includes('heavy') || t.includes('pulao') || t.includes('biryani') || t.includes('rice') || t.includes('pav') || t.includes('chawal')) return 'Main Course';
    return 'Prasadam';
  };

  const renderSectionItems = (section: any) => {
    if (loading) return <Typography>Loading menu...</Typography>;
    const sectionCategory = (section.category || '').toLowerCase();
    const matchesPartyCategory = (category: string) => {
      const value = category.toLowerCase();
      if (sectionCategory === 'beverages') return value === 'beverages' || value === 'welcome drinks';
      if (sectionCategory === 'main course') return value === 'main course' || value === 'main course (heavy dishes)';
      return value === sectionCategory;
    };
    const apiItems = (fetchedItems || []).filter((it) =>
      (it.menuGroup === 'Party' || !it.menuGroup) &&
      matchesPartyCategory(String(it.category || ''))
    );

    const renderCardFor = (id: string, name: string, image: string, category: string) => {
      // prefer API-provided price if available, otherwise fall back to our partyPriceMap
      const apiMatch = (fetchedItems || []).find((fi) => ((fi.name || '').toString().trim()) === (name || '').toString().trim());
      const resolvedPrice = apiMatch?.price ?? (partyPriceMap[name] ?? 0);
      const menuItem = { _id: id, name, category, price: resolvedPrice, description: '', image, isAvailable: true } as any;
      const cartEntry = (() => { try { return cart.find((ci) => ci.item._id === id) || null; } catch { return null; } })();
      const inCart = Boolean(cartEntry);

      // prefer explicit party images over discovered images from /images/menuimg
      const imageSrc = (menuItem.image && menuItem.image.startsWith('/images/Party/')) ? menuItem.image : (discoveredImages[menuItem._id] || menuItem.image);

      return (
        <Paper
          key={id}
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            minHeight: 120,
            alignItems: 'center',
            gap: 2,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: '1 1 auto', minWidth: 0, flexBasis: 0, pr: 1 }}>
            <Avatar
              src={imageSrc}
              alt={menuItem.name}
              variant="rounded"
              sx={{ width: 72, height: 72, flexShrink: 0, bgcolor: '#fff', boxShadow: 1, cursor: 'pointer', mr: 1 }}
              onClick={() => openViewer(imageSrc)}
            />
            <Box sx={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', display: 'block', color: 'text.primary', fontSize: { xs: '1rem', md: '1.05rem' } }}>
                {menuItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                {menuItem.price ? `₹${menuItem.price}` : ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
                {inCart ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Button size="small" variant="outlined" onClick={() => changeQuantity(id, -1)}>-</Button>
                    <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{cartEntry?.quantity ?? 0}</Typography>
                    <Button size="small" variant="outlined" onClick={() => changeQuantity(id, 1)}>+</Button>
                    <Button variant="contained" color="secondary" size="small" startIcon={<ShoppingCartIcon />} onClick={() => setCartOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
                      View Cart
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openCustomize(menuItem)}
                      sx={{ py: 0.35, px: 0.9, fontSize: '0.72rem', minWidth: 'auto', textTransform: 'none' }}
                    >
                      Customize
                    </Button>
                    <Box sx={{ display: 'inline-flex', gap: 0.4, alignItems: 'center', flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => toggleFavorite(menuItem._id)} aria-label="favorite" sx={{ p: 0.35 }}>
                        {favorites.includes(menuItem._id) ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<ShoppingCartIcon fontSize="small" />}
                        onClick={() => { addToCart(menuItem); setCartOpen(true); }}
                        sx={{ fontWeight: 700, borderRadius: 2, minWidth: 'auto', px: 0.6, py: 0.35, fontSize: '0.76rem', textTransform: 'none' }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      );
    };

    const sectionItems = [
      ...(section.items || []),
      ...apiItems.filter((apiItem: any) => !(section.items || []).some((item: string) => item.trim().toLowerCase() === String(apiItem.name || '').trim().toLowerCase())),
    ];

    return sectionItems.map((item: any) => {
      const category = section.category || getCategory(section.title);
      const itemName = (typeof item === 'string' ? item : item.name || item.title || item.item || '').toString().trim();
      const id = item._id || `${category}-${itemName}`;
      const titleLower = (section.title || '').toLowerCase();
      const categoryLower = (section.category || '').toLowerCase();
      const shouldUsePartyMap = titleLower.includes('welcome drinks') || titleLower.includes('starter') || titleLower.includes('italian') || titleLower.includes('main') || titleLower.includes('bread') || titleLower.includes('side') || titleLower.includes('dessert') || categoryLower === 'starters' || categoryLower === 'main course' || categoryLower === 'indian breads' || categoryLower === 'sides' || categoryLower === 'desserts';
      const mapped = shouldUsePartyMap ? (partyImageMap[itemName.trim()] || undefined) : undefined;
      const imageToUse = mapped || item.image || section.image || '';
      return renderCardFor(id, itemName, imageToUse, category);
    });
  };

  return (
    <>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={4} sx={{ background: 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)', py: { xs: 6, md: 8 }, mb: 6, borderRadius: 0, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{ color: '#d35400', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}
            >
              Party Menu
            </Typography>
            <Typography variant="h5" sx={{ color: '#d35400' }}>Make your party memorable with our delicious menu selection!</Typography>
          </Paper>
          <Container maxWidth="lg">
            {consolidatedMenu.map((section) => (
              <Box key={section.title} sx={{ mb: 7, borderRadius: 4, overflow: 'hidden', position: 'relative', minHeight: 260, background: (() => {
                try {
                  const t = section.title.toLowerCase();
                  const showImageFor = ['welcome drinks','starters','main course (heavy dishes)','main course','indian breads','sides','italian','cakes'];
                  if (showImageFor.includes(t) && section.image) {
                    return `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url(${section.image}) center/cover no-repeat`;
                  }
                  return 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.95))';
                } catch { return 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.95))'; }
              })(), boxShadow: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, pt: 4 }}>
                  <Avatar src={section.image} alt={section.title} sx={{ width: 90, height: 90, mb: 1, boxShadow: 2, bgcolor: '#fff' }} variant="circular" />
                  <Typography variant="h4" color="primary" fontWeight={600} gutterBottom sx={{ letterSpacing: 1 }}>{section.title}</Typography>
                </Box>
                <Divider sx={{ mb: 3, bgcolor: theme.palette.primary.main, height: 3, width: 80, mx: 'auto', borderRadius: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2, alignItems: 'stretch', pb: 4, p: 2 }}>
                  {renderSectionItems(section)}
                </Box>
              </Box>
            ))}
          </Container>
        </Box>
  {/* Footer is now global in App.tsx */}
      </Box>
      <Dialog open={viewerOpen} onClose={closeViewer} maxWidth="lg">
        <DialogContent sx={{ p: 1, position: 'relative', bgcolor: 'background.paper' }}>
          <IconButton onClick={closeViewer} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          {viewerSrc && <img src={viewerSrc} alt="item" style={{ maxWidth: '80vw', maxHeight: '80vh', display: 'block', margin: '0 auto' }} />}
        </DialogContent>
      </Dialog>
      <CustomizationDialog open={customOpen} menuItemName={customTarget?.name} initialQuantity={1} onClose={closeCustomize} onConfirm={confirmCustomize} />
    </>
  );
}