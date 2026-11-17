const Order = require('../models/order.model');
const { canTransitionOrderStatus } = require('../utils/orderStatus');

function handleError(res, error) {
  if (error && error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid order data', details: error.message });
  }
  return res.status(500).json({ error: 'Order operation failed' });
}

exports.getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customerName, tableNumber, items } = req.body || {};
    const order = await Order.create({ customerName, tableNumber, items });
    return res.status(201).json(order);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body || {};
  if (typeof status !== 'string') return res.status(400).json({ error: 'status is required' });
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!canTransitionOrderStatus(order.status, status)) {
      return res.status(409).json({ error: `Invalid order status transition: ${order.status} -> ${status}` });
    }
    order.status = status;
    await order.save();
    return res.json(order);
  } catch (error) {
    if (error && error.name === 'CastError') return res.status(400).json({ error: 'Invalid order id' });
    return handleError(res, error);
  }
};
