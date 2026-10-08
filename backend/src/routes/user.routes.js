const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const { authenticateToken } = require('../middleware/auth');

// Get favorites for logged-in user
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.favorites || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a favorite
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'Missing itemId' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // avoid duplicates
    if (!user.favorites) user.favorites = [];
    if (!user.favorites.find((f) => f.toString() === itemId)) {
      user.favorites.push(itemId);
      await user.save();
    }
    const populated = await User.findById(req.user.id).populate('favorites');
    res.json(populated.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove a favorite
router.delete('/favorites/:itemId', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.favorites = (user.favorites || []).filter((f) => f.toString() !== itemId);
    await user.save();
    const populated = await User.findById(req.user.id).populate('favorites');
    res.json(populated.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
