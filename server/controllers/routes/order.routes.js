const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
