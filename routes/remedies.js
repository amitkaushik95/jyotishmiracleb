const express = require('express');
const router = express.Router();
const Remedy = require('../models/Remedy');
const auth = require('../middleware/auth');

// Public: list remedies (supports simple query)
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    const filter = {};
    if (q) filter.$or = [ { customerId: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') } ];
    const list = await Remedy.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected: create remedy
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    if (!data.customerId || !data.name) return res.status(400).json({ message: 'customerId and name required' });
    const r = await Remedy.create({
      customerId: data.customerId,
      name: data.name,
      dob: data.dob || '',
      remedies: Array.isArray(data.remedies) ? data.remedies : []
    });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const r = await Remedy.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected update
router.put('/:id', auth, async (req, res) => {
  try {
    const data = req.body;
    const updated = await Remedy.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await Remedy.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
