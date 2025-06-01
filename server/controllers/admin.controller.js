const Admin = require('../models/admin.model');

exports.createAdmin = async (req, res) => {
  const admin = new Admin(req.body);
  await admin.save();
  res.status(201).json(admin);
};

exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
};
