const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { getPriceForName } = require('../utils/priceMap');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendWhatsApp, sendEmail } = require('../utils/notify');

function calcItemTotal(items = []) {
  return (Array.isArray(items) ? items : []).reduce((sum, it) => {
    const price = Number(it?.price || 0);
    const quantity = Number(it?.quantity || 1);
    return sum + (price * quantity);
  }, 0);
}

function normalizeBookingForResponse(booking) {
  if (!booking) return booking;

  const computedTotal = Number(booking.totalAmount || 0) > 0 ? Number(booking.totalAmount) : calcItemTotal(booking.items || []);
  if (Number.isFinite(computedTotal)) booking.totalAmount = computedTotal;

  const paymentValue = Number(booking.paymentAmount || booking.cashReceived || 0);
  if (booking.paymentReceived !== true && paymentValue > 0) {
    booking.paymentReceived = true;
  }

  if (Number.isFinite(Number(booking.paymentAmount)) && Number(booking.paymentAmount) > 0 && !booking.paymentMethod) {
    booking.paymentMethod = booking.cashReceived ? 'cash' : 'other';
  }

  return booking;
}

// Helper to normalize admin WhatsApp number for wa.me links (digits only, no plus)
function normalizeWhatsAppForWaMe(wh) {
  if (!wh) return null;
  // accept formats like 'whatsapp:+9199xxxx' or '+9199xxxx' or '9199xxxx' or '099...'
  return String(wh).replace(/^whatsapp:/i, '').replace(/[^0-9]/g, '');
}

// Create a booking (user)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items: rawItems, customerName, phoneNumber, whatsapp, address, eventDate, numPeople, paymentMethod, paymentAmount, cashReceived } = req.body;
    // compute authoritative per-item prices on the server using our price map
    const items = Array.isArray(rawItems) ? rawItems.map((it) => {
      const name = it.name || it.item || '';
      const qty = Number(it.quantity || it.qty || 1);
      const serverPrice = getPriceForName(name);
      const price = serverPrice || Number(it.price || 0);
      return { name: name, quantity: qty, category: it.category || '', customization: it.customization || undefined, price };
    }) : [];
    const totalAmount = items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
    const bookingData = { items, customerName, phoneNumber, whatsapp, address, eventDate, numPeople, customerId: req.user.id, totalAmount };
    if (paymentMethod) bookingData.paymentMethod = paymentMethod;
    if (paymentAmount !== undefined) bookingData.paymentAmount = Number(paymentAmount);
    if (cashReceived !== undefined) bookingData.cashReceived = Number(cashReceived);
    // if a payment amount or cashReceived was provided, mark paymentReceived true
    if ((paymentAmount !== undefined && !Number.isNaN(Number(paymentAmount))) || (cashReceived !== undefined && !Number.isNaN(Number(cashReceived)))) {
      bookingData.paymentReceived = true;
    }

    const booking = new Booking(bookingData);
    await booking.save();

    // collect notification send results to return to caller
    const notifyResults = { customerWhatsSent: false, adminWhatsSent: false };

    // send WhatsApp confirmation to customer if possible (whatsapp should be in international format e.g. whatsapp:+123...)
    try {
      if (whatsapp) {
        const r = await sendWhatsApp(whatsapp, `Your booking ${booking._id} is created and pending confirmation.`);
        notifyResults.customerWhatsSent = !!(r && (r.sid || r.messageId || r.id));
      }
    } catch (e) {
      console.error('notify failed', e && e.message ? e.message : e);
      notifyResults.customerWhatsSent = false;
    }
    try { if (phoneNumber && phoneNumber.includes('@')) await sendEmail(phoneNumber, 'Booking received', `Your booking ${booking._id} is created and pending confirmation.`); } catch(e){/* ignore */}

    // Additionally, notify the restaurant/admin via WhatsApp if configured
    try {
      const adminWhats = process.env.ADMIN_WHATSAPP || process.env.RESTAURANT_WHATSAPP;
      if (adminWhats) {
        const itemLines = (booking.items || []).map(it => `- ${it.name || it.item || ''} x ${it.quantity || 1} @ ₹${Number(it.price || 0)}`).join('\n');
        const msg = `New booking ${booking._id}\nCustomer: ${booking.customerName || ''}\nPhone: ${booking.phoneNumber || ''}\nAddress: ${booking.address || ''}\nItems:\n${itemLines}\nTotal: ₹${Number(booking.totalAmount || 0)}`;
        try {
          const r2 = await sendWhatsApp(adminWhats, msg);
          notifyResults.adminWhatsSent = !!(r2 && (r2.sid || r2.messageId || r2.id));
        } catch (e) {
          console.error('admin notify failed', e && e.message ? e.message : e);
          notifyResults.adminWhatsSent = false;
        }
        // include normalized admin number (digits-only) so client can open wa.me fallback
        try { notifyResults.adminNumber = normalizeWhatsAppForWaMe(adminWhats); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }

    res.json({ booking, notify: notifyResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Send booking via WhatsApp only (no DB save) - allows unauthenticated use
router.post('/whatsapp', async (req, res) => {
  try {
    const { items: rawItems, customerName, phoneNumber, address } = req.body || {};
    const items = Array.isArray(rawItems) ? rawItems.map((it) => ({ name: it.name || it.item || '', quantity: Number(it.quantity || it.qty || 1), price: getPriceForName(it.name || it.item || '') || Number(it.price || 0) })) : [];
    const total = items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
    const adminWhats = process.env.ADMIN_WHATSAPP || process.env.RESTAURANT_WHATSAPP;
    const itemLines = items.map((it) => `- ${it.name || ''} x ${it.quantity} @ ₹${Number(it.price || 0)}`).join('\n');
    const msg = `New WhatsApp order\nCustomer: ${customerName || ''}\nPhone: ${phoneNumber || ''}\nAddress: ${address || ''}\nItems:\n${itemLines}\nTotal: ₹${total}`;

    let sent = false;
    try {
      if (adminWhats) {
        const r = await sendWhatsApp(adminWhats, msg);
        sent = !!(r && (r.sid || r.messageId || r.id));
      }
    } catch (e) {
      console.error('whatsapp send failed', e && e.message ? e.message : e);
      sent = false;
    }

    // If Twilio isn't configured or sending failed, return normalized admin number so client can open wa.me link
    const adminNumber = normalizeWhatsAppForWaMe(adminWhats);
    return res.json({ success: true, sent, adminNumber });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send WhatsApp order' });
  }
});

// Admin: list all bookings (with optional status filter)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings.map(normalizeBookingForResponse));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list bookings' });
  }
});

// Get bookings for the logged-in user
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings.map(normalizeBookingForResponse));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list your bookings' });
  }
});

// Get booking by id (user or admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    // allow if admin or owner
    if (req.user.isAdmin || (booking.customerId && booking.customerId.toString() === req.user.id)) {
      return res.json(normalizeBookingForResponse(booking));
    }
    res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

// Allow user to cancel their own booking
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.customerId && booking.customerId.toString() !== req.user.id && !req.user.isAdmin) return res.status(403).json({ error: 'Not allowed' });
    booking.status = 'Cancelled';
    await booking.save();
    try { if (booking.whatsapp) sendWhatsApp(booking.whatsapp, `Your booking ${booking._id} has been cancelled.`); } catch(e){console.error('notify failed',e&&e.message?e.message:e)}
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Admin: update booking status
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = status;
    // when admin confirms an order, mark payment as received by default
    if (String(status).toLowerCase() === 'confirmed') {
      booking.paymentReceived = true;
    }
    // if caller provides a paymentMethod, save it
    if (req.body.paymentMethod) booking.paymentMethod = req.body.paymentMethod;
    // if caller provides a paymentAmount, save it (number expected)
    if (req.body.paymentAmount !== undefined) {
      const amt = Number(req.body.paymentAmount);
      if (!Number.isNaN(amt)) booking.paymentAmount = amt;
    }
    // if caller provides cashReceived (amount handed to admin), save it
    if (req.body.cashReceived !== undefined) {
      const c = Number(req.body.cashReceived);
      if (!Number.isNaN(c)) booking.cashReceived = c;
    }

    const computedAmount = Number(booking.paymentAmount || booking.cashReceived || 0);
    if (computedAmount > 0) booking.paymentReceived = true;
    if (booking.totalAmount === undefined || Number(booking.totalAmount) === 0) {
      booking.totalAmount = calcItemTotal(booking.items || []);
    }

    await booking.save();
  try { if (booking.whatsapp) sendWhatsApp(booking.whatsapp, `Your booking ${booking._id} status is now: ${booking.status}`); } catch(e){console.error('notify failed',e&&e.message?e.message:e)}
  try { if (booking.phoneNumber && booking.phoneNumber.includes('@')) await sendEmail(booking.phoneNumber, 'Booking status update', `Your booking ${booking._id} status is now: ${booking.status}`); } catch(e){/* ignore */}
    res.json(normalizeBookingForResponse(booking));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;

