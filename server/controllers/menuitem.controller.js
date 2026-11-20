const MenuItem = require('../models/menuItem.model');
const { validateMenuItemPayload } = require('../utils/requestValidation');

exports.getAllMenuItems = async (_req, res) => {
  try {
    return res.json(await MenuItem.find().sort({ category: 1, name: 1 }).lean());
  } catch {
    return res.status(500).json({ error: 'Unable to retrieve menu' });
  }
};

exports.createMenuItem = async (req, res) => {
  const parsed = validateMenuItemPayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  try {
    const item = await MenuItem.create(parsed.value);
    return res.status(201).json(item);
  } catch (error) {
    if (error && error.name === 'ValidationError') return res.status(400).json({ error: 'Invalid menu item' });
    return res.status(500).json({ error: 'Unable to create menu item' });
  }
};
