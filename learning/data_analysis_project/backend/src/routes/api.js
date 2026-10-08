const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.get('/data', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const docs = await Record.find().limit(limit).lean();
    res.json({ count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/data', async (req, res) => {
  try {
    await Record.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics endpoints
function buildFiltersFromQuery(q) {
  const match = {};
  const andExpr = [];
  if (q.start) {
    andExpr.push({ $gte: [{ $toDate: "$Order Date" }, new Date(q.start)] });
  }
  if (q.end) {
    andExpr.push({ $lte: [{ $toDate: "$Order Date" }, new Date(q.end)] });
  }
  if (andExpr.length) match.$expr = { $and: andExpr };
  // equality filters
  if (q.city) match.City = q.city;
  if (q.eventType) match["Event Type"] = q.eventType;
  if (q.package) match["Menu Package"] = q.package;
  if (q.salesExec) match["Sales Executive"] = q.salesExec;
  if (q.paymentMode) match["Payment Mode"] = q.paymentMode;
  if (q.deliveryStatus) match["Delivery Status"] = q.deliveryStatus;
  return match;
}

router.get('/analytics/summary', async (req, res) => {
  try {
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });
    pipeline.push({
      $group: {
        _id: null,
        totalRevenue: { $sum: { $ifNull: ["$Total Amount", 0] } },
        totalOrders: { $sum: 1 },
        totalGuests: { $sum: { $ifNull: ["$Number of Guests", 0] } },
        customers: { $addToSet: "$Customer Name" }
      }
    });
    pipeline.push({
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalOrders: 1,
        totalGuests: 1,
        totalCustomers: { $size: "$customers" },
        avgOrderValue: { $cond: [{ $eq: ["$totalOrders", 0] }, 0, { $divide: ["$totalRevenue", "$totalOrders"] }] }
      }
    });
    const [result] = await Record.aggregate(pipeline);
    res.json(result || { totalRevenue: 0, totalOrders: 0, totalGuests: 0, totalCustomers: 0, avgOrderValue: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/city', async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10;
    const base = [];
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    if (Object.keys(match).length) base.push({ $match: match });
    const docs = await Record.aggregate([
      ...base,
      { $group: { _id: "$City", revenue: { $sum: { $ifNull: ["$Total Amount", 0] } }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: top }
    ]);
    res.json(docs.map(d => ({ city: d._id, revenue: d.revenue, orders: d.orders })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/event-type', async (req, res) => {
  try {
    const base = [];
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    if (Object.keys(match).length) base.push({ $match: match });
    const docs = await Record.aggregate([
      ...base,
      { $group: { _id: "$Event Type", revenue: { $sum: { $ifNull: ["$Total Amount", 0] } }, orders: { $sum: 1 }, avgGuests: { $avg: { $ifNull: ["$Number of Guests", 0] } } } },
      { $sort: { revenue: -1 } }
    ]);
    res.json(docs.map(d => ({ eventType: d._id, revenue: d.revenue, orders: d.orders, avgGuests: d.avgGuests })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/package', async (req, res) => {
  try {
    const base = [];
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    if (Object.keys(match).length) base.push({ $match: match });
    const docs = await Record.aggregate([
      ...base,
      { $group: { _id: "$Menu Package", revenue: { $sum: { $ifNull: ["$Total Amount", 0] } }, orders: { $sum: 1 } } },
      { $sort: { orders: -1 } }
    ]);
    res.json(docs.map(d => ({ package: d._id, revenue: d.revenue, orders: d.orders })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/monthly', async (req, res) => {
  try {
    // optional year filter
    const year = parseInt(req.query.year) || null;
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    const addFields = { orderDate: { $toDate: "$Order Date" } };
    const pipeline = [{ $addFields: addFields }];
    if (match && Object.keys(match).length) pipeline.push({ $match: match });
    if (year) pipeline.push({ $match: { $expr: { $eq: [{ $year: "$orderDate" }, year] } } });
    pipeline.push({ $group: { _id: { year: { $year: "$orderDate" }, month: { $month: "$orderDate" } }, revenue: { $sum: { $ifNull: ["$Total Amount", 0] } }, orders: { $sum: 1 } } });
    pipeline.push({ $sort: { "_id.year": 1, "_id.month": 1 } });
    const docs = await Record.aggregate(pipeline);
    res.json(docs.map(d => ({ year: d._id.year, month: d._id.month, revenue: d.revenue, orders: d.orders })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/sales-exec', async (req, res) => {
  try {
    const base = [];
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    if (Object.keys(match).length) base.push({ $match: match });
    const docs = await Record.aggregate([
      ...base,
      { $group: { _id: "$Sales Executive", revenue: { $sum: { $ifNull: ["$Total Amount", 0] } }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } }
    ]);
    res.json(docs.map(d => ({ salesExecutive: d._id, revenue: d.revenue, orders: d.orders })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/payment-modes', async (req, res) => {
  try {
    const base = [];
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    if (Object.keys(match).length) base.push({ $match: match });
    const docs = await Record.aggregate([
      ...base,
      { $group: { _id: "$Payment Mode", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(docs.map(d => ({ paymentMode: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top food items (splitting comma-separated `Veg Food Items`)
router.get('/analytics/food-items', async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10;
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });
    pipeline.push({
      $project: {
        items: { $cond: [{ $isArray: { $split: ["$Veg Food Items", ","] } }, { $split: ["$Veg Food Items", ","] }, []] }
      }
    });
    pipeline.push({ $unwind: "$items" });
    pipeline.push({ $project: { item: { $trim: { input: "$items" } } } });
    pipeline.push({ $group: { _id: { $toLower: "$item" }, count: { $sum: 1 } } });
    pipeline.push({ $sort: { count: -1 } });
    pipeline.push({ $limit: top });
    const docs = await Record.aggregate(pipeline);
    res.json(docs.map(d => ({ item: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delivery status counts
router.get('/analytics/delivery-status', async (req, res) => {
  try {
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });
    pipeline.push({ $group: { _id: "$Delivery Status", count: { $sum: 1 } } });
    pipeline.push({ $sort: { count: -1 } });
    const docs = await Record.aggregate(pipeline);
    res.json(docs.map(d => ({ status: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guests vs Amount scatter data (returns limited points)
router.get('/analytics/guests-scatter', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 2000, 5000);
    const q = req.query || {};
    const match = buildFiltersFromQuery(q);
    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });
    pipeline.push({ $project: { guests: { $toDouble: "$Number of Guests" }, amount: { $toDouble: "$Total Amount" } } });
    pipeline.push({ $match: { $and: [{ guests: { $ne: null } }, { amount: { $ne: null } }] } });
    pipeline.push({ $limit: limit });
    const docs = await Record.aggregate(pipeline);
    res.json(docs.map(d => ({ guests: d.guests, amount: d.amount })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
