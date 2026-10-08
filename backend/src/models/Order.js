const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      quantity: Number,
      category: String,
      // store any per-item customization the frontend sends
      customization: {}
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  },
  customerName: String,
  phoneNumber: String,
  whatsapp: String,
});

module.exports = mongoose.model('Order', OrderSchema);
