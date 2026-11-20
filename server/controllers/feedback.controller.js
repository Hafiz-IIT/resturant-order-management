const Feedback = require('../models/feedback.model');
const { validateFeedbackPayload } = require('../utils/requestValidation');

exports.getAllFeedback = async (_req, res) => {
  try {
    return res.json(await Feedback.find().sort({ createdAt: -1 }).limit(500).lean());
  } catch {
    return res.status(500).json({ error: 'Unable to retrieve feedback' });
  }
};

exports.createFeedback = async (req, res) => {
  const parsed = validateFeedbackPayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  try {
    const feedback = await Feedback.create(parsed.value);
    return res.status(201).json(feedback);
  } catch (error) {
    if (error && error.name === 'ValidationError') return res.status(400).json({ error: 'Invalid feedback' });
    return res.status(500).json({ error: 'Unable to create feedback' });
  }
};
