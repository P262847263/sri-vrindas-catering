const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to local MongoDB if available
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/srivrindas';
mongoose.connect(MONGODB_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.warn('MongoDB connection failed:', err.message));

// Simple Order model
const orderSchema = new mongoose.Schema({
  items: [{ itemId: String, qty: Number }],
  customerName: String,
  phoneNumber: String,
  address: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Simple Booking model
const bookingSchema = new mongoose.Schema({
  customerName: String,
  phoneNumber: String,
  email: String,
  eventDate: String,
  eventType: String,
  numberOfGuests: Number,
  serviceType: String,
  specialRequirements: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`Backend server listening on ${port}`));
