const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Record = require('./models/Record');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/svdb';

async function importFile(filePath) {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: null });
  if (!data || data.length === 0) {
    console.log('No rows found in the first sheet.');
    process.exit(0);
  }

  // Insert in batches to avoid very large single inserts
  const batchSize = 1000;
  for (let i = 0; i < data.length; i += batchSize) {
    const chunk = data.slice(i, i + batchSize);
    await Record.insertMany(chunk);
    console.log(`Inserted ${i + chunk.length}/${data.length}`);
  }

  console.log(`Import complete. Inserted ${data.length} records.`);
  process.exit(0);
}

const fileArg = process.argv[2] || path.join(process.env.USERPROFILE || '.', 'Downloads', 'sv.xlsx');
console.log('Importing file:', fileArg);
importFile(fileArg).catch(err => {
  console.error(err);
  process.exit(1);
});
