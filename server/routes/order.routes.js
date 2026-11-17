const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authenticateAdmin = require('../middleware/auth.middleware');

// Customers may place orders; reading all orders and changing their status are
// administrative operations and require authentication.
router.get('/', authenticateAdmin, orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id/status', authenticateAdmin, orderController.updateOrderStatus);

module.exports = router;
