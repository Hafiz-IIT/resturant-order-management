const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authenticateAdmin = require('../middleware/auth.middleware');
const { createRateLimiter } = require('../middleware/rateLimit');
const limitCustomerOrders = createRateLimiter({ maxAttempts: 20, windowMs: 10 * 60 * 1000 });

// Customers may place orders; reading all orders and changing their status are
// administrative operations and require authentication.
router.get('/', authenticateAdmin, orderController.getAllOrders);
router.post('/', limitCustomerOrders, orderController.createOrder);
router.patch('/:id/status', authenticateAdmin, orderController.updateOrderStatus);

module.exports = router;
