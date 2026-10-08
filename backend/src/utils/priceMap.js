// Server-side price map and lookup helper
// This file holds fallback prices for menu items. The server will use this to
// compute authoritative unit prices when creating bookings.

const regular = {
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

const party = {
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

const upvas = {
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

const thali = {
  'Silver Thali': 199,
  'Gold Thali': 299,
  'Diamond Thali': 399,
  'North Indian Special Thali': 249,
  'Deluxe North Indian Thali': 299,
  'South Indian Meals': 150,
  'Karnataka Special Thali': 299,
  'Economy Simple Thali': 190,
  'Premium Feast Thali': 450,
  'Kids Thali': 130,
};

// Merge maps (priority: regular -> party -> upvas -> thali)
const combined = Object.assign({}, regular, party, upvas, thali);

function normalizeName(name) {
  if (!name) return '';
  return String(name).replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
}

function getPriceForName(name) {
  const n = normalizeName(name);
  if (!n) return 0;
  // direct match
  if (combined[n] !== undefined) return Number(combined[n]);
  // case-insensitive lookup
  const key = Object.keys(combined).find(k => k.toLowerCase() === n.toLowerCase());
  if (key) return Number(combined[key]);
  return 0;
}

module.exports = { getPriceForName };
