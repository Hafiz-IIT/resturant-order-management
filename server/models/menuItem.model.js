const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
  category: { type: String, required: true, trim: true, minlength: 1, maxlength: 60 },
  price: { type: Number, required: true, min: 0, max: 100000 },
  tags: { type: [{ type: String, trim: true, maxlength: 40 }], default: [] },
}, { strict: 'throw' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
