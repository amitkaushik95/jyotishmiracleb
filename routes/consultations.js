const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

// Public: submit consultation request (saves to MongoDB)
router.post('/', async (req, res) => {
  try {
    const { name, dob, time, place, mobile, email, query } = req.body;
    if (!name || !dob || !time || !place || !mobile || !email || !query) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const doc = await Consultation.create({
      name: String(name).trim(),
      dob: String(dob).trim(),
      time: String(time).trim(),
      place: String(place).trim(),
      mobile: String(mobile).trim(),
      email: String(email).trim(),
      query: String(query).trim()
    });
    res.status(201).json({ id: doc._id, message: 'Consultation request submitted' });
  } catch (err) {
    console.error('Consultation create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional: list consultations (e.g. for admin; can add auth later)
router.get('/', async (req, res) => {
  try {
    const list = await Consultation.find().sort({ createdAt: -1 }).limit(500);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
