

const express = require('express');
const Message = require('../models/Message.js');
const router = express.Router();

// GET /api/messages - List all contact messages (for admin/debug)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

// POST /api/messages - Save a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newMessage = new Message({ name, email, phone, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save message.' });
  }
});

module.exports = router;
