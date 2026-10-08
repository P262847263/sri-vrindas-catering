const mongoose = require('mongoose');
const Booking = require('../src/models/Booking');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sri-vrindas';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const filter = { status: 'Confirmed', $or: [{ paymentReceived: { $exists: false } }, { paymentReceived: false }] };
    const update = { $set: { paymentReceived: true } };
    const res = await Booking.updateMany(filter, update);
    console.log(`Matched ${res.matchedCount}, modified ${res.modifiedCount} bookings.`);
    await mongoose.disconnect();
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
