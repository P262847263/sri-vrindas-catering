
const express = require('express');
const MenuItem = require('../models/MenuItem.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.js');
// image uploads removed — menu items no longer accept image files from admin
const router = express.Router();

// NOTE: image upload handling was removed to simplify admin menu management

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const filter = {};
    // optional query params: category, search, available
  if (req.query.category) filter.category = { $regex: new RegExp(String(req.query.category), 'i') };
    if (req.query.search) {
      const q = req.query.search.toString();
      filter.name = { $regex: new RegExp(q, 'i') };
    }
    if (req.query.available) filter.isAvailable = req.query.available === 'true';
    const menuItems = await MenuItem.find(filter);
    res.json(menuItems);
  } catch (error) {
    console.error('menu fetch error', error && error.message ? error.message : error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Add a new menu item (admin only) with optional image upload
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = req.body || {};
    // ensure only allowed fields are used
    const allowed = {
      name: data.name,
      menuGroup: data.menuGroup,
      category: data.category,
      price: data.price,
      isVegan: data.isVegan,
      isAvailable: data.isAvailable,
    };
    const newItem = new MenuItem(allowed);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add menu item' });
  }
});

// Update a menu item (admin only) with optional image
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = req.body || {};
    const allowed = {
      name: data.name,
      menuGroup: data.menuGroup,
      category: data.category,
      price: data.price,
      isVegan: data.isVegan,
      isAvailable: data.isAvailable,
    };
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, allowed, { new: true });
    if (!updated) return res.status(404).json({ error: 'Menu item not found' });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update menu item' });
  }
});

// Delete a menu item by ID (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted', item: deletedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;