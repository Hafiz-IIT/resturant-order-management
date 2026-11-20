const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const requireAdminToken = require('../middleware/requireAdminToken');

router.get('/', requireAdminToken, orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id/status', requireAdminToken, orderController.updateOrderStatus);
module.exports = router;
