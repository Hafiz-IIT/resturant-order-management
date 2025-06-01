const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true },
  tags: [String],
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
