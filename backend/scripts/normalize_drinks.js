#!/usr/bin/env node
const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');

const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sri-vrindas';

async function main() {
  console.log('Connecting to', MONGO_URI);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // find items where category mentions drink(s) or name is sarbat (case-insensitive)
  const query = {
    $or: [
      { category: { $regex: /drink/i } },
      { name: { $regex: /^sarbat$/i } },
      { name: { $regex: /sarbat/i } }
    ]
  };

  const items = await MenuItem.find(query).lean();
  console.log('Matched items:', items.length);
  items.forEach(it => console.log(` - ${it._id} | ${it.name} | category=${it.category}`));

  if (items.length === 0) {
    await mongoose.disconnect();
    return;
  }

  if (!apply) {
    console.log('\nDry run: not applying changes. To apply, re-run with --apply');
    await mongoose.disconnect();
    return;
  }

  const bulk = MenuItem.collection.initializeUnorderedBulkOp();
  items.forEach(it => {
    bulk.find({ _id: it._id }).updateOne({ $set: { category: 'Beverages' } });
  });

  const res = await bulk.execute();
  console.log('Bulk update result:', res.result || res);

  // show updated docs
  const updated = await MenuItem.find({ _id: { $in: items.map(i => i._id) } }).lean();
  updated.forEach(it => console.log(`UPDATED: ${it._id} | ${it.name} | category=${it.category}`));

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
