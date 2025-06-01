const Feedback = require('../models/feedback.model');

exports.getAllFeedback = async (req, res) => {
  const feedback = await Feedback.find();
  res.json(feedback);
};

exports.createFeedback = async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.status(201).json(feedback);
};
