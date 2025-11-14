// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- MongoDB connection ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/movieboxd';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('error', err => {
  console.error('Mongo connection error:', err);
});

// --- Schema & Model ---
const reviewSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 10, default: 7 }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// --- Routes ---

// Create
app.post('/api/reviews', async (req, res) => {
  try {
    const { movie, text, rating } = req.body;
    const doc = await Review.create({ movie, text, rating });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read (all)
app.get('/api/reviews', async (_req, res) => {
  try {
    const docs = await Review.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update
app.put('/api/reviews/:id', async (req, res) => {
  try {
    const { movie, text, rating } = req.body;
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { movie, text, rating },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
