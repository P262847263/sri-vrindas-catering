const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  category: { type: String }
});
// allow per-item customization (notes, choices, etc.). Use Mixed for flexibility.
ItemSchema.add({ customization: { type: mongoose.Schema.Types.Mixed } });
// store unit price for each item at time of booking
ItemSchema.add({ price: { type: Number, default: 0 } });

const BookingSchema = new mongoose.Schema({
  items: [ItemSchema],
  status: { type: String, enum: ['Pending','Confirmed','Preparing','Delivered','Cancelled'], default: 'Pending' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String },
  phoneNumber: { type: String },
  whatsapp: { type: String },
  address: { type: String },
  eventDate: { type: Date },
  numPeople: { type: Number },
  // payment info
  paymentReceived: { type: Boolean, default: false },
  paymentMethod: { type: String },
  paymentAmount: { type: Number },
  // computed grand total from item prices and quantities
  totalAmount: { type: Number, default: 0 },
  // explicit amount of cash handed to admin (if different from paymentAmount)
  cashReceived: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
