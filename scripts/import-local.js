require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Remedy = require('../models/Remedy');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://amit:amit@124507@cluster0.ff2unwj.mongodb.net/?appName=Cluster0';

async function run() {
  const argPath = process.argv[2];
  const defaultPath = path.resolve(__dirname, '..', '..', 'remedies-export.json');
  const filePath = argPath ? path.resolve(process.cwd(), argPath) : defaultPath;

  if (!fs.existsSync(filePath)) {
    console.error('Import file not found:', filePath);
    console.error('Create a JSON export of your local data and place it at:', defaultPath);
    console.error('Or run: npm run import-local -- ./path/to/export.json');
    process.exit(1);
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Failed to read file:', err.message);
    process.exit(1);
  }

  let items;
  try {
    items = JSON.parse(raw);
    if (!Array.isArray(items)) throw new Error('Import file must be a JSON array');
  } catch (err) {
    console.error('Invalid JSON import file:', err.message);
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  let created = 0;
  let updated = 0;

  for (const entry of items) {
    // Normalize entry
    const customerId = entry.customerId || entry.customerID || entry.id || entry._id;
    const name = entry.name || entry.customerName || '';
    const dob = entry.dob || entry.dateOfBirth || '';
    const remedies = Array.isArray(entry.remedies)
      ? entry.remedies
      : [entry.remedy1, entry.remedy2, entry.remedy3, entry.remedy4, entry.remedy5].filter(r => r && r.trim());

    if (!customerId) {
      console.warn('Skipping entry without customerId:', entry);
      continue;
    }

    const doc = {
      customerId: String(customerId),
      name: name,
      dob: dob,
      remedies: remedies
    };

    try {
      const res = await Remedy.findOneAndUpdate({ customerId: doc.customerId }, doc, { upsert: true, new: true });
      if (res) {
        // If upserted newly, mongoose returns the doc; we can't easily tell created vs updated reliably here without extra checks
        updated++;
      }
    } catch (err) {
      console.error('Failed to upsert', customerId, err.message);
    }
  }

  console.log(`Import complete. Processed: ${items.length}, upserted: ${updated}`);
  process.exit(0);
}

run().catch(err => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
