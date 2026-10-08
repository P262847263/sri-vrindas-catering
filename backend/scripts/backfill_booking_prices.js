#!/usr/bin/env node
// Backfill script: populate item.price and booking.totalAmount for bookings missing them
// Usage: node backfill_booking_prices.js [--apply] [--limit N]

const mongoose = require('mongoose');
const Booking = require('../src/models/Booking');
const { getPriceForName } = require('../src/utils/priceMap');

const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const limitArg = argv.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;

async function run() {
  const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/svvv_catering';
  console.log('Connecting to', mongoUrl);
  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const query = {
      $or: [
        { totalAmount: { $exists: false } },
        { totalAmount: 0 },
        { 'items.price': { $exists: false } },
        { 'items.price': 0 }
      ]
    };
    const cursor = Booking.find(query).cursor();

    let processed = 0;
    let updated = 0;
    const toUpdate = [];

    for await (const doc of cursor) {
      processed++;
      const originalTotal = doc.totalAmount || 0;
      let recomputedTotal = 0;
      let changed = false;

      for (let i = 0; i < (doc.items || []).length; i++) {
        const it = doc.items[i];
        const name = (it.name || '').toString();
        const serverPrice = getPriceForName(name);
        // prefer server price if available, otherwise keep existing price or 0
        const newPrice = serverPrice || (it.price || 0);
        if (!it.price || Number(it.price) !== Number(newPrice)) {
          changed = true;
          it.price = Number(newPrice);
        }
        recomputedTotal += (it.quantity || 1) * (it.price || 0);
      }

      if (!doc.totalAmount || Number(doc.totalAmount) !== Number(recomputedTotal)) {
        changed = true;
        doc.totalAmount = Number(recomputedTotal);
      }

      if (changed) {
        toUpdate.push({ _id: doc._id, totalAmount: doc.totalAmount });
        if (apply) {
          try {
            await doc.save();
            updated++;
            console.log('Updated', doc._id.toString(), 'newTotal=', doc.totalAmount);
          } catch (e) {
            console.error('Failed to save', doc._id.toString(), e.message);
          }
        } else {
          console.log('DRY:', doc._id.toString(), 'would update total to', doc.totalAmount);
        }
      }

      if (limit && processed >= limit) break;
    }

    console.log('Processed:', processed, 'Would update (or updated):', toUpdate.length);
    if (apply) console.log('Applied updates:', updated);
  } catch (e) {
    console.error('Backfill failed:', e);
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
