const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerName, phoneNumber, items } = req.body;
    if (!customerName || !phoneNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, phone number, and items are required.' });
    }
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (admin-only could be applied)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
