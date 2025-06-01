const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ name: String, quantity: Number }],
  status: { type: String, default: 'Placed' },
  customerName: String,
  tableNumber: Number,
  timestamp: { type: Date, default: Date.now },
  notes: String,
});

module.exports = mongoose.model('Order', orderSchema);
