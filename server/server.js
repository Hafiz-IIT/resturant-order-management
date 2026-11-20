const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/order.routes');
const menuItemRoutes = require('./routes/menuitem.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '32kb' }));

app.get('/health', (req, res) => {
  res.json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'degraded' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admins', adminRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Request validation failed' });
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({ error: 'A record with those unique fields already exists' });
  }
  console.error('Request failed:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  if (!process.env.ADMIN_API_TOKEN || process.env.ADMIN_API_TOKEN.length < 32) {
    throw new Error('ADMIN_API_TOKEN must be configured with at least 32 characters');
  }
  await mongoose.connect(process.env.MONGO_URI);
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

if (require.main === module) {
  start().catch(error => {
    console.error('Server startup failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
