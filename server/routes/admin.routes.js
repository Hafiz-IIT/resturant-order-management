const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticateAdmin = require('../middleware/auth.middleware');
const { createRateLimiter } = require('../middleware/rateLimit');

// Process-local guardrails for this single-process prototype. Production
// multi-instance deployments must use a shared rate-limit store.
const limitBootstrap = createRateLimiter({ maxAttempts: 3, windowMs: 60 * 60 * 1000 });
const limitLogin = createRateLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });

// Bootstrap is available only before the first admin exists and requires a
// one-time secret supplied out-of-band. All other admin operations require a
// signed, unexpired bearer token.
router.post('/bootstrap', limitBootstrap, adminController.bootstrapAdmin);
router.post('/login', limitLogin, adminController.login);
router.post('/', authenticateAdmin, adminController.createAdmin);
router.get('/', authenticateAdmin, adminController.getAllAdmins);

module.exports = router;
