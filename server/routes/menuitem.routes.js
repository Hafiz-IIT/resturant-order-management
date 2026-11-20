const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuitem.controller');
const requireAdminToken = require('../middleware/requireAdminToken');

router.get('/', menuItemController.getAllMenuItems);
router.post('/', requireAdminToken, menuItemController.createMenuItem);
module.exports = router;
