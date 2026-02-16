const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const remedyRoutes = require('./routes/remedies');
const consultationRoutes = require('./routes/consultations');

const app = express();
app.use(cors());
app.use(express.json());

const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');

// API health check (for frontend to detect backend)
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/remedies', remedyRoutes);
app.use('/api/consultations', consultationRoutes);

// Serve frontend: / and /frontend -> frontend/index.html; static files from frontend
app.use('/frontend', express.static(frontendDir));
app.get('/frontend', (req, res) => res.sendFile(path.join(frontendDir, 'index.html')));
app.get('/frontend/admin.html', (req, res) => res.sendFile(path.join(frontendDir, 'admin.html')));
app.use(express.static(frontendDir));
app.get('/', (req, res) => res.sendFile(path.join(frontendDir, 'index.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(frontendDir, 'admin.html')));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
