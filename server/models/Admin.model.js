const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  email: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
  bootstrapLock: { type: Boolean, default: false, select: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

adminSchema.index(
  { bootstrapLock: 1 },
  { unique: true, partialFilterExpression: { bootstrapLock: true } },
);

adminSchema.set('toJSON', {
  transform(_document, returned) {
    delete returned.passwordHash;
    delete returned.bootstrapLock;
    delete returned.__v;
    return returned;
  },
});

module.exports = mongoose.model('Admin', adminSchema);
