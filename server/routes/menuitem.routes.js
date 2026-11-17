const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuitem.controller');
const authenticateAdmin = require('../middleware/auth.middleware');

router.get('/', menuItemController.getAllMenuItems);
router.post('/', authenticateAdmin, menuItemController.createMenuItem);

module.exports = router;
