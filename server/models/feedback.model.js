const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
