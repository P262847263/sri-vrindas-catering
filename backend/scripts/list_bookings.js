const mongoose = require('mongoose');
const Booking = require('../src/models/Booking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sri-vrindas';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const bookings = await Booking.find().lean();
    console.log(JSON.stringify(bookings, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connect error', err.message || err);
    process.exit(1);
  });
