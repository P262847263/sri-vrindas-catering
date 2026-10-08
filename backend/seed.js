import mongoose from 'mongoose';
import MenuItem from './src/models/MenuItem.js';

mongoose.connect('mongodb://localhost:27017/sri-vrindas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const menuItems = [
  { name: 'Matar Paneer', category: 'Main Course', price: 180 },
  { name: 'Shahi Paneer', category: 'Main Course', price: 200 },
  { name: 'Kadhai Paneer', category: 'Main Course', price: 200 },
  { name: 'Shahi Corn Paneer', category: 'Main Course', price: 200 },
  { name: 'Daal Makhni', category: 'Main Course', price: 180 },
  { name: 'Dal Tadka', category: 'Main Course', price: 120 },
  { name: 'Paneer Butter Masala', category: 'Main Course', price: 200 },
  { name: 'Lauki Kofte', category: 'Main Course', price: 160 },
  { name: 'Kadhi Pakoda', category: 'Main Course', price: 140 },
  { name: 'Malai Kofta', category: 'Main Course', price: 220 },
  { name: 'Paneer Bhurji', category: 'Main Course', price: 250 },
  { name: 'Aloo Gobhi Matar', category: 'Starters', price: 120 },
  { name: 'Mix Veg', category: 'Starters', price: 150 },
  { name: 'Masala Bhindi', category: 'Starters', price: 150 },
  { name: 'Aloo Palak', category: 'Starters', price: 140 },
  { name: 'Baigan Bharta', category: 'Starters', price: 120 },
  { name: 'Stuffed Karela', category: 'Starters', price: 140 },
  { name: 'Stuffed Capsicum', category: 'Starters', price: 140 },
  { name: 'Gobhi Manchurian', category: 'Chinese Special', price: 140 },
  { name: 'Veg Manchurian', category: 'Chinese Special', price: 140 },
  { name: 'Momos (10pcs)', category: 'Chinese Special', price: 100 },
  { name: 'Veg Noodles', category: 'Chinese Special', price: 130 },
  { name: 'Veg Pasta', category: 'Chinese Special', price: 140 },
  { name: 'Gulab Jamun', category: 'Desserts', price: 25 },
  { name: 'Rice Kheer', category: 'Desserts', price: 100 },
  { name: 'Sevain Kheer', category: 'Desserts', price: 100 },
  { name: 'Lauki Kheer', category: 'Desserts', price: 120 },
  { name: 'Gazar Halwa', category: 'Desserts', price: 150 },
  { name: 'Sooji Halwa', category: 'Desserts', price: 100 },
  { name: 'Aata Halwa', category: 'Desserts', price: 100 },
  { name: 'Dryfruits Kheer', category: 'Desserts', price: 200 },
  { name: 'Roti/Poori', category: 'Prasadam', price: 10 },
  { name: 'Masala Poori', category: 'Prasadam', price: 20 },
  { name: 'Plain Paratha', category: 'Prasadam', price: 20 },
  { name: 'Aloo Paratha (2pc)', category: 'Prasadam', price: 100 },
  { name: 'Gobhi Paratha (2pc)', category: 'Prasadam', price: 100 },
  { name: 'Carrot Paratha (2pc)', category: 'Prasadam', price: 100 },
  { name: 'Beetroot Paratha (2pc)', category: 'Prasadam', price: 100 },
  { name: 'Paneer Paratha (2pc)', category: 'Prasadam', price: 120 },
  { name: 'Sattu Paratha (2pc)', category: 'Prasadam', price: 150 },
  { name: 'Boondi Raita', category: 'Beverages', price: 80 },
  { name: 'Kheera Raita', category: 'Beverages', price: 90 },
  { name: 'Lauki Raita', category: 'Beverages', price: 100 },
  { name: 'Mix Veg Raita', category: 'Beverages', price: 120 },
  { name: 'Butter Milk', category: 'Beverages', price: 15 },
  { name: 'Plane Rice', category: 'Beverages', price: 100 },
  { name: 'Jira Rice', category: 'Beverages', price: 110 },
  { name: 'Matar Pulao', category: 'Beverages', price: 120 },
  { name: 'Curd Rice', category: 'Beverages', price: 110 },
  { name: 'Veg Pulao', category: 'Beverages', price: 140 },
  { name: 'Veg Biryani', category: 'Beverages', price: 150 },
  { name: 'Kashmiri Pulao', category: 'Beverages', price: 150 },
  { name: 'Idly (6pcs)', category: 'Prasadam', price: 80 },
  { name: 'Masala Dosa (2 pcs)', category: 'Prasadam', price: 100 },
  { name: 'Paneer Dosa (2 pcs)', category: 'Prasadam', price: 120 },
  { name: 'Uttappam (2pcs)', category: 'Prasadam', price: 90 },
  { name: 'Vada (1 pc)', category: 'Prasadam', price: 20 },
  { name: 'Appe (8pcs)', category: 'Prasadam', price: 80 },
];

async function seedDatabase() {
  try {
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);
    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();