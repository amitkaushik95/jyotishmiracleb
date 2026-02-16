require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://amit:amit@124507@cluster0.ff2unwj.mongodb.net/?appName=Cluster0';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@jyotishmiracle.com';

  const existing = await User.findOne({ username });
  if (existing) {
    console.log('Admin user already exists:', username);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({ username, password: hash, role: 'admin', email });
  console.log('Created admin user:', user.username);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
