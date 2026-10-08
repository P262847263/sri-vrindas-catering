const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');
const User = require('../models/User.js');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'sri-vrindas-secret';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const GMAIL_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9.]*[A-Za-z0-9])?@gmail\.com$/i;

// Admin login (existing)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Try admin first
  const admin = await Admin.findOne({ username });
  if (admin) {
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { username: admin.username, isSuperAdmin: admin.isSuperAdmin, isAdmin: true } });
  }

  // If no admin found, try user (allow login by userId or username)
  const user = await User.findOne({ $or: [{ userId: username }, { username }] });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const validUser = await bcrypt.compare(password, user.password);
  if (!validUser) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, username: user.username || user.userId, isAdmin: false }, SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, username: user.username, userId: user.userId, mobile: user.mobile, isAdmin: false } });
});

// User signup
router.post('/signup', async (req, res) => {
  const { userId, username, mobile, password } = req.body;
  if (!userId || !password) return res.status(400).json({ message: 'Missing required fields' });
  if (!GMAIL_PATTERN.test(String(userId).trim())) {
    return res.status(400).json({ message: 'Please use a valid Gmail address ending with @gmail.com.' });
  }
  if (!PASSWORD_PATTERN.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.' });
  }
  const existing = await User.findOne({ userId });
  if (existing) return res.status(409).json({ message: 'User with this ID already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ userId, username, mobile, password: hash });
  await user.save();
  res.status(201).json({ message: 'User created' });
});

// Get current admin/user token info
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json(user);
  });
});

module.exports = router;
