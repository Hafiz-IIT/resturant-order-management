const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
  quantity: { type: Number, required: true, min: 1, max: 100 },
}, { _id: false, strict: 'throw' });

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  tableNumber: { type: Number, required: true, min: 1, max: 500 },
  items: { type: [orderItemSchema], required: true, validate: [(items) => items.length > 0, 'At least one order item is required'] },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}, { strict: 'throw' });

module.exports = mongoose.model('Order', orderSchema);
