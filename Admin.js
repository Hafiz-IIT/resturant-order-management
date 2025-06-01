const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed
});

module.exports = mongoose.model('Admin', adminSchema);
