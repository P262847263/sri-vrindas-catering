
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env if present (optional)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional; if not installed the app will still work with environment variables provided by the OS
}

const menuRoutes = require('./src/routes/menu.routes.js');
const messageRoutes = require('./src/routes/message.routes.js');
const orderRoutes = require('./src/routes/order.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');
const bookingRoutes = require('./src/routes/booking.routes.js');
const userRoutes = require('./src/routes/user.routes.js');
const galleryRoutes = require('./src/routes/gallery.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Use MONGO_URI environment variable if provided, otherwise fall back to localhost
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sri-vrindas';

// Connect to MongoDB with some sensible options and logging
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Enable CORS
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api/menu', menuRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
// Mount bookings and user routes so frontend API calls work
app.use('/api/bookings', bookingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});