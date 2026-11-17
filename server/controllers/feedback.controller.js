const Feedback = require('../models/feedback.model');

exports.getAllFeedback = async (_req, res) => {
  try {
    return res.json(await Feedback.find().sort({ createdAt: -1 }).lean());
  } catch {
    return res.status(500).json({ error: 'Unable to retrieve feedback' });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body || {};
    const feedback = await Feedback.create({ customerName, rating, comment });
    return res.status(201).json(feedback);
  } catch (error) {
    if (error && error.name === 'ValidationError') return res.status(400).json({ error: 'Invalid feedback' });
    return res.status(500).json({ error: 'Unable to create feedback' });
  }
};
