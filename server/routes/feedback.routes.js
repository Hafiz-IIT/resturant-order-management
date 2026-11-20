const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const authenticateAdmin = require('../middleware/auth.middleware');
const { createRateLimiter } = require('../middleware/rateLimit');
const limitFeedback = createRateLimiter({ maxAttempts: 10, windowMs: 10 * 60 * 1000 });

router.get('/', authenticateAdmin, feedbackController.getAllFeedback);
router.post('/', limitFeedback, feedbackController.createFeedback);

module.exports = router;
