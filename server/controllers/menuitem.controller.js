const MenuItem = require('../models/menuItem.model');

exports.getAllMenuItems = async (req, res, next) => {
  try {
    const menu = await MenuItem.find().sort({ category: 1, name: 1 }).lean();
    res.json(menu);
  } catch (error) { next(error); }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const { name, category, price, tags = [] } = req.body || {};
    if (typeof name !== 'string' || !name.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
        (category !== undefined && typeof category !== 'string') ||
        !Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
      return res.status(400).json({ error: 'Invalid menu item fields' });
    }
    const menuItem = await MenuItem.create({
      name: name.trim(), category, price, tags: tags.map(tag => tag.trim()).filter(Boolean)
    });
    res.status(201).json(menuItem);
  } catch (error) { next(error); }
};
