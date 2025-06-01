const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Order = require('./models/order.model');
const MenuItem = require('./models/menuItem.model');
const Feedback = require('./models/feedback.model');
const Admin = require('./models/admin.model');

const app = express();

app.use(cors());
app.use(express.json());

// Example: Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- MENU ROUTES ---

app.get('/api/menu', async (req, res) => {
  const menu = await MenuItem.find();
  res.json(menu);
});

app.post('/api/menu', async (req, res) => {
  const menuItem = new MenuItem(req.body);
  await menuItem.save();
  res.status(201).json(menuItem);
});

// --- ORDER ROUTES ---

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).json(order);
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// --- FEEDBACK ROUTES ---

app.get('/api/feedback', async (req, res) => {
  const feedback = await Feedback.find();
  res.json(feedback);
});

app.post('/api/feedback', async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.status(201).json(feedback);
});

// --- ADMIN ROUTES (simple example) ---

app.post('/api/admin', async (req, res) => {
  const admin = new Admin(req.body);
  await admin.save();
  res.status(201).json(admin);
});

app.get('/api/admins', async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

// --- SERVER START ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
