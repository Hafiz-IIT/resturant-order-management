const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const authenticateAdmin = require('../middleware/auth.middleware');

router.get('/', authenticateAdmin, feedbackController.getAllFeedback);
router.post('/', feedbackController.createFeedback);

module.exports = router;
