const Order = require('../models/order.model');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(500).lean();
    res.json(orders);
  } catch (error) { next(error); }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, tableNumber, items } = req.body || {};
    if (typeof customerName !== 'string' || !customerName.trim() ||
        !Number.isInteger(tableNumber) || tableNumber < 1 ||
        !Array.isArray(items) || items.length === 0 || items.length > 30 ||
        items.some(item => !item || typeof item.name !== 'string' || !item.name.trim() ||
          !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
      return res.status(400).json({ error: 'Invalid order: provide customerName, positive tableNumber, and 1-30 valid items' });
    }
    const order = await Order.create({
      customerName: customerName.trim(),
      tableNumber,
      items: items.map(item => ({ name: item.name.trim(), quantity: item.quantity }))
    });
    res.status(201).json(order);
  } catch (error) { next(error); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const allowed = ['pending', 'preparing', 'ready', 'served', 'cancelled'];
    const { status } = req.body || {};
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(
      req.params.id, { $set: { status } }, { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ error: 'Invalid order ID' });
    next(error);
  }
};
