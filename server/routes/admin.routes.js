const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticateAdmin = require('../middleware/auth.middleware');

// Bootstrap is available only before the first admin exists and requires a
// one-time secret supplied out-of-band. All other admin operations require a
// signed, unexpired bearer token.
router.post('/bootstrap', adminController.bootstrapAdmin);
router.post('/login', adminController.login);
router.post('/', authenticateAdmin, adminController.createAdmin);
router.get('/', authenticateAdmin, adminController.getAllAdmins);

module.exports = router;
