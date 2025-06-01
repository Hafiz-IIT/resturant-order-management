const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customerName: String,
  rating: Number,
  comment: String,
  sentiment: String,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
