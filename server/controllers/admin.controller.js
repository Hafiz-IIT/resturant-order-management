const { randomBytes, scrypt: scryptCallback } = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(scryptCallback);
const Admin = require('../models/Admin.model');

exports.createAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (typeof username !== 'string' || username.trim().length < 3 ||
        typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({
        error: 'username (3+ chars), valid email, and password (12+ chars) are required'
      });
    }
    const salt = randomBytes(16);
    const derived = await scrypt(password, salt, 64);
    const passwordHash = `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`;
    const admin = await Admin.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash
    });
    res.status(201).json({
      id: admin._id, username: admin.username, email: admin.email, createdAt: admin.createdAt
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An admin with that username or email already exists' });
    }
    next(error);
  }
};
