const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// prepare uploads directory
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safe);
  }
});
const upload = multer({ storage });

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const items = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('gallery fetch error', err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Add a gallery image (admin only) - expects { url, caption }
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { url, caption } = req.body || {};
    if (!url) return res.status(400).json({ error: 'Missing url' });
    const gi = new GalleryImage({ url, caption });
    await gi.save();
    res.status(201).json(gi);
  } catch (err) {
    console.error('gallery add error', err);
    res.status(400).json({ error: 'Failed to add gallery image' });
  }
});

// Upload an image file (admin only) -> saves to public/uploads and returns { url }
router.post('/upload', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // URL path served from server.js: app.use('/uploads', express.static(...))
    const url = `/uploads/${req.file.filename}`;
    return res.status(201).json({ url });
  } catch (err) {
    console.error('gallery upload error', err);
    return res.status(500).json({ error: 'Failed to upload' });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const del = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: del });
  } catch (err) {
    console.error('gallery delete error', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
