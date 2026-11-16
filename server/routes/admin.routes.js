const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/', adminController.createAdmin);
router.get('/', adminController.getAllAdmins);

module.exports = router;
