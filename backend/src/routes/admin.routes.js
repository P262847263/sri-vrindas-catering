const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { Parser } = require('json2csv');

// Booking analytics used by the admin data analysis page.
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const [users, facets] = await Promise.all([
      User.countDocuments(),
      Booking.aggregate([
        {
          $addFields: {
            itemTotal: {
              $reduce: {
                input: { $ifNull: ['$items', []] },
                initialValue: 0,
                in: {
                  $add: [
                    '$$value',
                    {
                      $multiply: [
                        { $convert: { input: '$$this.price', to: 'double', onError: 0, onNull: 0 } },
                        { $convert: { input: '$$this.quantity', to: 'double', onError: 1, onNull: 1 } }
                      ]
                    }
                  ]
                }
              }
            },
            numericTotal: { $convert: { input: '$totalAmount', to: 'double', onError: 0, onNull: 0 } },
            numericPayment: { $convert: { input: '$paymentAmount', to: 'double', onError: 0, onNull: 0 } },
            numericCash: { $convert: { input: '$cashReceived', to: 'double', onError: 0, onNull: 0 } }
          }
        },
        {
          $addFields: {
            bookingTotal: { $cond: [{ $gt: ['$numericTotal', 0] }, '$numericTotal', '$itemTotal'] }
          }
        },
        {
          $addFields: {
            collectedAmount: {
              $cond: [
                { $gt: ['$numericPayment', 0] },
                '$numericPayment',
                {
                  $cond: [
                    { $gt: ['$numericCash', 0] },
                    '$numericCash',
                    { $cond: ['$paymentReceived', '$bookingTotal', 0] }
                  ]
                }
              ]
            }
          }
        },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  amountBooked: { $sum: '$bookingTotal' },
                  amountCollected: { $sum: '$collectedAmount' },
                  paidCount: { $sum: { $cond: [{ $gt: ['$collectedAmount', 0] }, 1, 0] } },
                  pendingCount: { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'pending'] }, 1, 0] } }
                }
              }
            ],
            statuses: [
              { $group: { _id: '$status', count: { $sum: 1 } } },
              { $sort: { count: -1 } }
            ],
            monthly: [
              { $match: { createdAt: { $gte: sixMonthsAgo } } },
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                  bookings: { $sum: 1 },
                  revenue: { $sum: '$collectedAmount' }
                }
              },
              { $sort: { _id: 1 } }
            ],
            popularItems: [
              { $unwind: '$items' },
              { $match: { 'items.name': { $type: 'string', $ne: '' } } },
              {
                $group: {
                  _id: '$items.name',
                  quantity: {
                    $sum: { $convert: { input: '$items.quantity', to: 'double', onError: 1, onNull: 1 } }
                  }
                }
              },
              { $sort: { quantity: -1, _id: 1 } },
              { $limit: 5 }
            ],
            payments: [
              { $match: { collectedAmount: { $gt: 0 } } },
              {
                $group: {
                  _id: { $ifNull: ['$paymentMethod', 'Not specified'] },
                  count: { $sum: 1 },
                  amount: { $sum: '$collectedAmount' }
                }
              },
              { $sort: { amount: -1 } }
            ]
          }
        }
      ])
    ]);

    const report = facets[0] || {};
    const totals = report.totals?.[0] || {};
    const monthlyByKey = new Map((report.monthly || []).map((entry) => [entry._id, entry]));
    const monthly = [];
    const monthCursor = new Date(sixMonthsAgo);
    for (let i = 0; i < 6; i += 1) {
      const key = `${monthCursor.getFullYear()}-${String(monthCursor.getMonth() + 1).padStart(2, '0')}`;
      const entry = monthlyByKey.get(key);
      monthly.push({ month: key, bookings: entry?.bookings || 0, revenue: entry?.revenue || 0 });
      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }

    res.json({
      generatedAt: new Date().toISOString(),
      totalUsers: users,
      totalBookings: totals.total || 0,
      amountBooked: totals.amountBooked || 0,
      amountCollected: totals.amountCollected || 0,
      pendingPayments: Math.max(0, (totals.amountBooked || 0) - (totals.amountCollected || 0)),
      paidBookings: totals.paidCount || 0,
      pendingBookings: totals.pendingCount || 0,
      statuses: (report.statuses || []).map((entry) => ({ status: entry._id || 'Unknown', count: entry.count })),
      monthly,
      popularItems: (report.popularItems || []).map((entry) => ({ name: entry._id, quantity: entry.quantity })),
      payments: (report.payments || []).map((entry) => ({ method: entry._id || 'Not specified', count: entry.count, amount: entry.amount }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Dashboard summary
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ totalUsers, totalBookings, totalOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// List users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// Update user (block/unblock or update fields)
router.patch('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updates = req.body || {};
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Export bookings as CSV
router.get('/reports/bookings.csv', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().lean();
    const fields = ['_id','customerName','phoneNumber','status','createdAt','eventDate','numPeople'];
    const parser = new Parser({ fields });
    const csv = parser.parse(bookings);
    res.header('Content-Type', 'text/csv');
    res.attachment('bookings.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
