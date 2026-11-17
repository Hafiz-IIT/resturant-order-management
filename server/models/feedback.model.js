const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  rating: { type: Number, min: 1, max: 5, required: true, validate: Number.isInteger },
  comment: { type: String, trim: true, maxlength: 1000, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { strict: 'throw' });

module.exports = mongoose.model('Feedback', feedbackSchema);
