const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItem.controller');

router.get('/', menuItemController.getAllMenuItems);
router.post('/', menuItemController.createMenuItem);

module.exports = router;
