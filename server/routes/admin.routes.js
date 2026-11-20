const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const requireAdminToken = require('../middleware/requireAdminToken');

router.post('/', requireAdminToken, adminController.createAdmin);
module.exports = router;
