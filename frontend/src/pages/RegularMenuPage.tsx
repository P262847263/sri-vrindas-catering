import { Container, Typography, Box, useTheme, Divider, Paper, Avatar, Button, Dialog, DialogContent, Tooltip } from '@mui/material';
// Footer is provided globally by App.tsx
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import React from 'react';
import CustomizationDialog from '../components/CustomizationDialog';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import { menuApi, userApi } from '../services/api';
import { getLocalFavoritesKey } from '../utils/localFavoritesKey';

const regularMenu = [
	{
		category: 'Starters / Snacks',
		image: '/images/st1.jpg',
		items: [
			'Paneer Tikka',
			'Hara Bhara Kabab',
			'Corn & Cheese Balls',
			'Veg Spring Rolls',
			'Stuffed Capsicum',
			'Veg Cutlet',
			'Aloo Chaat',
			'Paneer Pakora',
			'Baby Corn Manchurian',
			'Dhokla ',
			'Corn Fritters',
			'Veg Frankie / Wraps',
			'Mini Samosas',
			'Paneer Nuggets',
			'Tandoori Broccoli',
			'Cheese Paneer Rolls',
			'Sweet Potato Chaat',
			'Malai Corn Tikki',
			'Paneer Spring Rolls',
		],
	},
	{
		category: 'Main Course – Curries & Gravies',
		image: '/images/main1.jpg',
		items: [
			'Paneer Butter Masala',
			'Palak Paneer',
			'Navratan Korma',
			'Dal Tadka',
			'Dal Makhani',
			'Chana Masala',
			'Rajma Masala',
			'Mixed Veg Curry',
			'Aloo Gobi',
			'Baingan Bharta',
			'Lauki Kofta Curry',
			'Malai Kofta',
			'Veg Jalfrezi',
			'Kadhi Pakora',
			'Veg Kolhapuri',
			'Shahi Paneer',
			'Paneer Tikka Masala',
			'Paneer Bhurji',
			'Kadai Paneer',
             'Pumpkin Curry',
		],
	},
	{
		category: 'Rice & Biryani',
		image: '/images/rice.jpg',
		items: [
			'Steamed Rice',
			'Jeera Rice',
			'Veg Pulao',
			'Paneer Pulao',
			'Peas Pulao',
			'Veg Biryani',
			'Lemon Rice',
			'Coconut Rice',
			'Saffron Rice',
			'Tomato Rice',
		],
	},
	{
		category: 'Indian Breads',
		image: '/images/roti.jpg',
		items: [
			'Tandoori Roti',
			'Butter Naan',
			'Laccha Paratha',
			'Plain Paratha',
			'Pudina Paratha (Mint Flavored)',
			'Aloo Paratha (Stuffed Potato)',
			'Gobi Paratha (Stuffed Cauliflower)',
			'Paneer Paratha (Stuffed Cottage Cheese)',
			'Methi Paratha (Fenugreek Flavored)',
			'Cheese Paratha',
			'Spinach Paratha',
			'Kulcha (Plain / Stuffed)',
			'Rumali Roti',
			'Bajra Roti',
			'Jowar Roti',
			'Garlic-free Butter Roti',
			'Cheese & Corn Paratha',
		],
	},
	{
		category: 'South Indian Specialties',
		image: '/images/dosa.jpg',
		items: [
			'Masala Dosa',
			'Plain Dosa',
			'Idli with Coconut Chutney',
			'Medu Vada',
			'Upma',
			'Rava Dosa',
			'Pongal',
		],
	},
	{
		category: 'Desserts',
		image: '/images/desserts.jpg',
		items: [
			'Gulab Jamun',
			'Rasgulla',
			'Kaju Katli',
			'Halwa (Carrot / Suji / Moong Dal)',
			'Sandesh',
			'Rasmalai',
			'Moong Dal Halwa',
			'Malpua',
			'Payasam / Kheer',
			'Coconut Ladoo',
		],
	},
	{
		category: 'Beverages',
		image: '/images/bevarages.jpg',
		items: [
			'Lassi (Sweet / Salted)',
			'Lemonade',
			'Fresh Fruit Juice',
			'Buttermilk',
			'Rose Milk',
			'Badam Milk',
		],
	},
];

// map specific menu item names to images placed in public/images/menuimg/regular
const itemImageMap: Record<string, string> = {
	'Aloo Chaat': '/images/menuimg/regular/aloochat.jpg',
	'Baby Corn Manchurian (Dry)': '/images/menuimg/regular/Baby Corn Manchurian (Dry).jpg',
	'Corn Fritters': '/images/menuimg/regular/Corn Fritters.jpg',
	'Corn & Cheese Balls': '/images/menuimg/regular/Corn-and-Cheese-balls.jpg',
	'Dhokla': '/images/menuimg/regular/Dhokla.jpg',
	'Hara Bhara Kabab': '/images/menuimg/regular/hara-bhara.jpg',
	'Malai Corn Tikki': '/images/menuimg/regular/Malai Corn Tikki.jpg',
	'Mini Samosas': '/images/menuimg/regular/Mini Samosas.jpg',
	'Paneer Nuggets': '/images/menuimg/regular/Paneer Nuggets.jpg',
	'Paneer Spring Rolls': '/images/menuimg/regular/Paneer Spring Rolls.jpg',
	'Paneer Tikka': '/images/menuimg/regular/Paneer-Tikka.jpg',
	'Paneer Pakora': '/images/menuimg/regular/pannerpakoda.jpg',
	'Stuffed Capsicum': '/images/menuimg/regular/stuffedcapjpg.jpg',
	'Sweet Potato Chaat': '/images/menuimg/regular/Sweet Potato Chaat.jpg',
	'Tandoori Broccoli': '/images/menuimg/regular/tandoribrocli.jpg.png',
	'Veg Frankie / Wraps': '/images/menuimg/regular/Veg Frankie.jpg',
	'Veg Cutlet': '/images/menuimg/regular/vegcutlet.jpg',
	'Veg Spring Rolls': '/images/menuimg/regular/vegetable-spring-rolls-recipe.jpg',
	// Main course images (placed under public/images/menuimg/regular/Maincourse)
	'Paneer Butter Masala': '/images/menuimg/regular/Maincourse/Paneer Butter Masala.jpg',
	'Palak Paneer': '/images/menuimg/regular/Maincourse/Palak Paneer.jpg',
	'Navratan Korma': '/images/menuimg/regular/Maincourse/Navratan Korma.jpg',
	'Dal Tadka': '/images/menuimg/regular/Maincourse/Dal Tadka.jpg',
	'Dal Makhani': '/images/menuimg/regular/Maincourse/Dal Makhani.jpg',
	'Chana Masala': '/images/menuimg/regular/Maincourse/Chana Masala.jpg',
	'Rajma Masala': '/images/menuimg/regular/Maincourse/Rajma Masala.jpg',
	'Mixed Veg Curry': '/images/menuimg/regular/Maincourse/Mixed Veg Curry.jpg',
	'Aloo Gobi': '/images/menuimg/regular/Maincourse/Aloo Gobi.jpg',
	'Baingan Bharta': '/images/menuimg/regular/Maincourse/Baingan Bharta.jpg',
	'Lauki Kofta Curry': '/images/menuimg/regular/Maincourse/Lauki Kofta Curry.jpg',
	'Malai Kofta': '/images/menuimg/regular/Maincourse/Malai Kofta.jpg',
	'Veg Jalfrezi': '/images/menuimg/regular/Maincourse/Veg Jalfrezi.jpg',
	'Kadhi Pakora': '/images/menuimg/regular/Maincourse/Kadhi Pakora.jpg',
	'Pumpkin Curry': '/images/menuimg/regular/Maincourse/Pumpkin Curry.jpg',
	'Veg Kolhapuri': '/images/menuimg/regular/Maincourse/Veg Kolhapuri.jpg',
	// Additional paneer variants present in the folder
	'Paneer Tikka Masala': '/images/menuimg/regular/Maincourse/Paneer Tikka Masala.jpg',
	'Paneer Bhurji': '/images/menuimg/regular/Maincourse/Paneer Bhurji.jpg',
	'Shahi Paneer': '/images/menuimg/regular/Maincourse/Shahi Paneer.jpg',
	'Kadai Paneer': '/images/menuimg/regular/Maincourse/Kadai Paneer.jpg',
};

// Prices (INR) for items in the regular menu
const priceMap: Record<string, number> = {
	// Starters / Snacks
	'Paneer Tikka': 220,
	'Hara Bhara Kabab': 140,
	'Corn & Cheese Balls': 150,
	'Veg Spring Rolls': 120,
	'Stuffed Capsicum': 160,
	'Veg Cutlet': 90,
	'Aloo Chaat': 80,
	'Paneer Pakora': 140,
	'Baby Corn Manchurian': 180,
	'Dhokla ': 70,
	'Corn Fritters': 90,
	'Veg Frankie / Wraps': 110,
	'Mini Samosas': 60,
	'Paneer Nuggets': 130,
	'Tandoori Broccoli': 160,
	'Cheese Paneer Rolls': 170,
	'Sweet Potato Chaat': 100,
	'Malai Corn Tikki': 120,
	'Paneer Spring Rolls': 150,

	// Main Course – Curries & Gravies
	'Paneer Butter Masala': 220,
	'Palak Paneer': 220,
	'Navratan Korma': 210,
	'Dal Tadka': 120,
	'Dal Makhani': 140,
	'Chana Masala': 130,
	'Rajma Masala': 130,
	'Mixed Veg Curry': 140,
	'Aloo Gobi': 120,
	'Baingan Bharta': 150,
	'Lauki Kofta Curry': 150,
	'Malai Kofta': 160,
	'Veg Jalfrezi': 180,
	'Kadhi Pakora': 130,
	'Veg Kolhapuri': 170,
	'Shahi Paneer': 240,
	'Paneer Tikka Masala': 250,
	'Paneer Bhurji': 250,
	'Kadai Paneer': 200,
	'Pumpkin Curry': 120,

	// Rice & Biryani
	'Steamed Rice': 100,
	'Jeera Rice': 110,
	'Veg Pulao': 140,
	'Paneer Pulao': 140,
	'Peas Pulao': 120,
	'Veg Biryani': 160,
	'Lemon Rice': 90,
	'Coconut Rice': 100,
	'Saffron Rice': 110,
	'Tomato Rice': 90,

	// Indian Breads
	'Tandoori Roti': 20,
	'Butter Naan': 30,
	'Laccha Paratha': 40,
	'Plain Paratha': 35,
	'Pudina Paratha (Mint Flavored)': 45,
	'Aloo Paratha (Stuffed Potato)': 60,
	'Gobi Paratha (Stuffed Cauliflower)': 60,
	'Paneer Paratha (Stuffed Cottage Cheese)': 70,
	'Methi Paratha (Fenugreek Flavored)': 45,
	'Cheese Paratha': 80,
	'Spinach Paratha': 50,
	'Kulcha (Plain / Stuffed)': 50,
	'Rumali Roti': 20,
	'Bajra Roti': 30,
	'Jowar Roti': 30,
	'Garlic-free Butter Roti': 30,
	'Cheese & Corn Paratha': 85,

	// South Indian Specialties
	'Masala Dosa': 100,
	'Plain Dosa': 90,
	'Idli with Coconut Chutney': 80,
	'Medu Vada': 70,
	'Upma': 80,
	'Rava Dosa': 110,
	'Pongal': 100,

	// Desserts
	'Gulab Jamun': 25,
	'Rasgulla': 60,
	'Kaju Katli': 80,
	'Halwa (Carrot / Suji / Moong Dal)': 100,
	'Sandesh': 80,
	'Rasmalai': 90,
	'Moong Dal Halwa': 100,
	'Malpua': 70,
	'Payasam / Kheer': 100,
	'Coconut Ladoo': 50,

	// Beverages
	'Lassi (Sweet / Salted)': 80,
	'Lemonade': 50,
	'Fresh Fruit Juice': 120,
	'Buttermilk': 15,
	'Rose Milk': 70,
	'Badam Milk': 120,
};

// Explicit mappings for Rice & Biryani images held under the `Rice` folder
Object.assign(itemImageMap, {
	'Steamed Rice': '/images/menuimg/regular/Rice/Steamed Rice.jpg',
	'Jeera Rice': '/images/menuimg/regular/Rice/Jeera Rice.jpg',
	'Veg Pulao': '/images/menuimg/regular/Rice/Veg Pulao.jpg',
	'Paneer Pulao': '/images/menuimg/regular/Rice/Paneer Pulao.jpg',
	'Peas Pulao': '/images/menuimg/regular/Rice/Peas Pulao.jpg',
	'Veg Biryani': '/images/menuimg/regular/Rice/Veg Biryani.jpg',
	'Lemon Rice': '/images/menuimg/regular/Rice/Lemon Rice.jpg',
	'Coconut Rice': '/images/menuimg/regular/Rice/Coconut Rice.jpg',
	'Saffron Rice': '/images/menuimg/regular/Rice/Saffron Rice.jpg',
	'Tomato Rice': '/images/menuimg/regular/Rice/Tomato Rice.jpg',
});

// Explicit mappings for Indian Breads images located in `public/images/menuimg/regular/indianbreads`
Object.assign(itemImageMap, {
	'Tandoori Roti': '/images/menuimg/regular/indianbreads/Tandoori Roti.jpg',
	'Butter Naan': '/images/menuimg/regular/indianbreads/Butter Naan.jpg',
	'Laccha Paratha': '/images/menuimg/regular/indianbreads/Laccha Paratha.jpg',
	'Plain Paratha': '/images/menuimg/regular/indianbreads/Plain Paratha.jpg',
	'Pudina Paratha (Mint Flavored)': '/images/menuimg/regular/indianbreads/Pudina Paratha (Mint Flavored).jpg',
	'Aloo Paratha (Stuffed Potato)': '/images/menuimg/regular/indianbreads/Aloo Paratha (Stuffed Potato).jpg',
	'Gobi Paratha (Stuffed Cauliflower)': '/images/menuimg/regular/indianbreads/Gobi Paratha (Stuffed Cauliflower).jpg',
	'Paneer Paratha (Stuffed Cottage Cheese)': '/images/menuimg/regular/indianbreads/Paneer Paratha (Stuffed Cottage Cheese).jpg',
	'Methi Paratha (Fenugreek Flavored)': '/images/menuimg/regular/indianbreads/Methi Paratha (Fenugreek Flavored).jpg',
	'Cheese Paratha': '/images/menuimg/regular/indianbreads/Cheese Paratha.jpg',
	'Spinach Paratha': '/images/menuimg/regular/indianbreads/Spinach Paratha.jpg',
	'Kulcha (Plain / Stuffed)': '/images/menuimg/regular/indianbreads/Kulcha (Plain Stuffed).jpg',
	'Rumali Roti': '/images/menuimg/regular/indianbreads/Rumali Roti.jpg',
	'Bajra Roti': '/images/menuimg/regular/indianbreads/Bajra Roti.jpg',
	'Jowar Roti': '/images/menuimg/regular/indianbreads/Jowar Roti.jpg',
	'Garlic-free Butter Roti': '/images/menuimg/regular/indianbreads/Garlic-free Butter Roti.jpg',
	'Cheese & Corn Paratha': '/images/menuimg/regular/indianbreads/Cheese & Corn Paratha.jpg',
});

// Explicit mappings for South Indian Specialties images in `public/images/menuimg/regular/dosawala`
Object.assign(itemImageMap, {
	'Masala Dosa': '/images/menuimg/regular/dosawala/Masala Dosa.jpg',
	'Plain Dosa': '/images/menuimg/regular/dosawala/Plain Dosa.jpg',
	'Idli with Coconut Chutney': '/images/menuimg/regular/dosawala/Idli with Coconut Chutney.jpg',
	'Medu Vada': '/images/menuimg/regular/dosawala/Medu Vada.jpg',
	'Upma': '/images/menuimg/regular/dosawala/Upma.jpg',
	'Rava Dosa': '/images/menuimg/regular/dosawala/Rava Dosa.jpg',
	'Pongal': '/images/menuimg/regular/dosawala/Pongal.jpg',
});

// Explicit mappings for Desserts images in `public/images/menuimg/regular/Desserts`
Object.assign(itemImageMap, {
	'Gulab Jamun': '/images/menuimg/regular/Desserts/Gulab Jamun.jpg',
	'Rasgulla': '/images/menuimg/regular/Desserts/Rasgulla.jpg',
	'Kaju Katli': '/images/menuimg/regular/Desserts/Kaju Katli.jpg',
	'Halwa (Carrot / Suji / Moong Dal)': '/images/menuimg/regular/Desserts/Halwa (Carrot Suji Moong Dal).jpg',
	'Sandesh': '/images/menuimg/regular/Desserts/Sandesh.jpg',
	'Rasmalai': '/images/menuimg/regular/Desserts/Rasmalai.jpg',
	'Moong Dal Halwa': '/images/menuimg/regular/Desserts/Moong Dal Halwa.jpg',
	'Malpua': '/images/menuimg/regular/Desserts/Malpua.jpg',
	'Payasam / Kheer': '/images/menuimg/regular/Desserts/Payasam Kheer.jpg',
	'Coconut Ladoo': '/images/menuimg/regular/Desserts/Coconut Ladoo.jpg',
});

// Explicit mappings for Beverages images in `public/images/menuimg/regular/bevrages`
Object.assign(itemImageMap, {
	'Lassi (Sweet / Salted)': '/images/menuimg/regular/bevrages/Lassi (Sweet Salted).jpg',
	'Lemonade': '/images/menuimg/regular/bevrages/Lemonade.jpg',
	'Fresh Fruit Juice': '/images/menuimg/regular/bevrages/Fresh Fruit Juice.jpg',
	'Buttermilk': '/images/menuimg/regular/bevrages/Buttermilk.jpg',
	'Rose Milk': '/images/menuimg/regular/bevrages/Rose Milk.jpg',
	'Badam Milk': '/images/menuimg/regular/bevrages/Badam Milk.jpg',
});

export default function RegularMenuPage() {
		const theme = useTheme();
		const { cart, addToCart, changeQuantity, setCartOpen } = useCart();
		const [customOpen, setCustomOpen] = React.useState(false);
		const [customTarget, setCustomTarget] = React.useState<any>(null);
		const [favorites, setFavorites] = React.useState<string[]>([]);
		const [discoveredImages, setDiscoveredImages] = React.useState<Record<string, string>>({});
		const [fetchedItems, setFetchedItems] = React.useState<any[]>([]);

		// Image viewer state for clicking item images
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

		// Ensure any previously-stored menu images are cleared (no admin upload access)
		React.useEffect(() => {
			try { localStorage.removeItem('menuImages'); } catch (e) { /* ignore */ }
		}, []);

		// probe filenames under public/images/menuimg/regular for images matching items
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
				// also try lowercase
				for (const e of exts) list.push(`/images/menuimg/regular/${f.toLowerCase()}${e}`);
			}
			return Array.from(new Set(list));
		};

		React.useEffect(() => {
			let mounted = true;
			(async () => {
				const found: Record<string, string> = {};
				for (const section of regularMenu) {
					for (const item of section.items) {
						const itemName = typeof item === 'string' ? item : (item as any).name;
						const id = `${section.category}-${itemName}`;
						// if there's an explicit mapping in itemImageMap, skip discovery
						if (itemImageMap[itemName]) continue;
						const candidates = makeCandidates(itemName);
						for (const url of candidates) {
							// eslint-disable-next-line no-await-in-loop
							const ok = await probeImageUrl(url);
							if (ok) {
								found[id] = url;
								break;
							}
						}
					}
				}
				if (!mounted) return;
				setDiscoveredImages(found);
			})();
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
					// merge with any client-side local favorites (for static/demo menu items)
					const local = JSON.parse(localStorage.getItem(getLocalFavoritesKey()) || '[]');
					const merged = Array.from(new Set([...(ids || []), ...(Array.isArray(local) ? local : [])]));
					setFavorites(merged);
				} catch (e) {
					// ignore
				}
			})();
			return () => { mounted = false; };
		}, []);

		const toggleFavorite = async (id: string) => {
			// If id is not a Mongo ObjectId (24 hex chars), treat it as a local/demo item
			if (!/^[0-9a-fA-F]{24}$/.test(id)) {
				setFavorites((s) => {
					const exists = s.includes(id);
					let next: string[];
					if (exists) next = s.filter((x) => x !== id);
					else next = [...s, id];
					try { localStorage.setItem(getLocalFavoritesKey(), JSON.stringify(next)); } catch (e) { /* ignore */ }
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
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)',
				position: 'relative',
			}}
		>
			<Box sx={{ flex: 1 }}>
				{/* (Upload UI removed) */}
				{/* Hero Section */}
				<Paper
					elevation={4}
					sx={{
						// cream hero background for a warm, elegant look
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
						sx={{
							color: '#d35400',
							textShadow: '0 1px 0 rgba(255,255,255,0.5)',
						}}
					>
						Regular Menu
					</Typography>
					<Typography variant="h5" sx={{ color: '#d35400' }}>
						Explore our delicious vegetarian menu, crafted for every occasion.
					</Typography>
				</Paper>
				<Container maxWidth="lg" sx={{ pr: { xs: 2, md: 10 } }}>
					{regularMenu.map((section) => {
						const displayCategory = section.category.replace(/\s*\/\s*/g, ' ');
						const apiItems = fetchedItems.filter((item) =>
							(item.menuGroup === 'Regular' || !item.menuGroup) &&
							String(item.category || '').toLowerCase() === section.category.toLowerCase()
						);
						const sectionItems = [
							...section.items,
							...apiItems.filter((apiItem) => !section.items.some((item) => String(item).trim().toLowerCase() === String(apiItem.name).trim().toLowerCase())),
						];
						return (
						<Box
							key={section.category}
							sx={{
								mb: 7,
								borderRadius: 4,
								overflow: 'hidden',
								position: 'relative',
								minHeight: 320,
								background: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url(${section.image}) center/cover no-repeat`,
								boxShadow: 3,
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									mb: 2,
									pt: 4,
								}}
							>
								<Avatar
									src={section.image}
									alt={displayCategory}
									sx={{
										width: 90,
										height: 90,
										mb: 1,
										boxShadow: 2,
										bgcolor: '#fff',
									}}
									variant="circular"
								/>
								<Typography
									variant="h4"
									color="primary"
									fontWeight={600}
									gutterBottom
									sx={{ letterSpacing: 1, whiteSpace: { xs: 'normal', sm: 'nowrap' } }}
								>
									{displayCategory}
								</Typography>
							</Box>
							<Divider
								sx={{
									mb: 3,
									bgcolor: theme.palette.primary.main,
									height: 3,
									width: 80,
									mx: 'auto',
									borderRadius: 2,
								}}
							/>
							<Box
								sx={{
									display: 'grid',
									// Use fewer columns on medium screens so each card has room for controls
									gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
									gap: 2,
									alignItems: 'stretch',
									pb: 4,
									p: 2,
								}}
							>
								{sectionItems.map((item: any) => {
									// support both string items and object items with image/name
									const itemName = typeof item === 'string' ? item : (item as any).name;
									const displayName = (typeof item === 'string' ? item : (item as any).name).replace(/\s*\/\s*/g, ' ');
									// try per-item image mapping first, then allow item object image, then fall back to section image
									const mappedImage = itemImageMap[itemName];
									const itemImage = typeof item === 'string' ? (mappedImage || undefined) : ((item as any).image || mappedImage || section.image);
									const id = `${section.category}-${itemName}`;
									const menuItem = {
										_id: id,
										name: displayName,
										category: section.category,
										price: typeof item === 'string' ? (priceMap[itemName] ?? 0) : (item.price ?? priceMap[itemName] ?? 0),
										description: '',
										image: itemImage || section.image,
										isAvailable: true,
									} as any;
									const cartEntry = (() => {
										try {
											return cart.find((ci) => ci.item._id === id) || null;
										} catch {
											return null;
										}
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
							// stack vertically on small screens, horizontally on md+
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
														src={discoveredImages[menuItem._id] || menuItem.image}
														alt={menuItem.name}
														variant="rounded"
														sx={{ width: 72, height: 72, flexShrink: 0, bgcolor: '#fff', boxShadow: 1, cursor: 'pointer', mr: 1 }}
														onClick={() => openViewer(discoveredImages[menuItem._id] || menuItem.image)}
													/>
													<Box sx={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
														<Tooltip title={menuItem.name} placement="top" arrow>
															<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', display: 'block', color: 'text.primary', fontSize: { xs: '1rem', md: '1.05rem' } }}>
																{menuItem.name}
															</Typography>
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
																	{/* group wishlist + add so Add sits immediately beside the heart icon */}
																	<Box sx={{ display: 'inline-flex', gap: 0.4, alignItems: 'center', flexShrink: 0 }}>
																		<IconButton size="small" onClick={() => toggleFavorite(menuItem._id)} aria-label="favorite" sx={{ p: 0.35 }}>
																			{favorites.includes(menuItem._id) ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
																		</IconButton>
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			startIcon={<ShoppingCartIcon fontSize="small" />}
																			onClick={() => {
																				addToCart(menuItem);
																				setCartOpen(true);
																			}}
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
								})}
							</Box>
						</Box>
						);
						})}
					</Container>
				{/* Floating actions are provided globally by FloatingActions in App.tsx */}
			</Box>
			{/* Footer is now global in App.tsx */}
			<CustomizationDialog
				open={customOpen}
				menuItemName={customTarget?.name}
				initialQuantity={1}
				onClose={closeCustomize}
				onConfirm={confirmCustomize}
			/>
			{/* Image viewer dialog for clicked item images */}
			<Dialog open={viewerOpen} onClose={closeViewer} maxWidth="lg">
				<DialogContent sx={{ p: 0, backgroundColor: '#000' }}>
					<Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<IconButton onClick={closeViewer} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }} aria-label="close">
							<CloseIcon />
						</IconButton>
						{viewerSrc ? (
							<img src={viewerSrc} alt="menu" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', display: 'block' }} />
						) : null}
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
