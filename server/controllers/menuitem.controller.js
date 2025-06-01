const MenuItem = require('../models/menuItem.model');

exports.getAllMenuItems = async (req, res) => {
  const menu = await MenuItem.find();
  res.json(menu);
};

exports.createMenuItem = async (req, res) => {
  const menuItem = new MenuItem(req.body);
  await menuItem.save();
  res.status(201).json(menuItem);
};
