const MenuItem = require('../models/menuItem.model');

exports.getAllMenuItems = async (_req, res) => {
  try {
    return res.json(await MenuItem.find().sort({ category: 1, name: 1 }).lean());
  } catch {
    return res.status(500).json({ error: 'Unable to retrieve menu' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, category, price, tags } = req.body || {};
    const item = await MenuItem.create({ name, category, price, tags });
    return res.status(201).json(item);
  } catch (error) {
    if (error && error.name === 'ValidationError') return res.status(400).json({ error: 'Invalid menu item' });
    return res.status(500).json({ error: 'Unable to create menu item' });
  }
};
