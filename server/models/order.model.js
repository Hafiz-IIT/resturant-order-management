const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, maxlength: 120 },
  tableNumber: { type: Number, required: true, min: 1, validate: Number.isInteger },
  items: {
    type: [{
      name: { type: String, required: true, trim: true },
      quantity: { type: Number, required: true, min: 1, max: 100, validate: Number.isInteger },
    }],
    validate: value => Array.isArray(value) && value.length > 0 && value.length <= 30,
  },
  status: {
    type: String, enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'], default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', orderSchema);
