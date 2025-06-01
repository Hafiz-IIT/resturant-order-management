const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  ingredients: [String],
  tags: [String],
  availability: Boolean,
  image: String,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
