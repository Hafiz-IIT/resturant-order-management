const Admin = require('../models/Admin.model');
const { hashPassword, verifyPassword, signToken, safeEqual } = require('../utils/auth');

function validateAdminInput(body) {
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const email = typeof body?.email === 'string' && body.email.trim() ? body.email.trim() : undefined;
  if (!/^[A-Za-z0-9_.-]{3,40}$/.test(username)) {
    return { error: 'username must be 3–40 characters using letters, numbers, dot, underscore or hyphen' };
  }
  if (password.length < 12) return { error: 'password must contain at least 12 characters' };
  return { value: { username, password, email } };
}

function publicAdmin(admin) {
  const value = admin.toObject ? admin.toObject() : { ...admin };
  delete value.password;
  delete value.passwordHash;
  delete value.bootstrapLock;
  delete value.__v;
  return value;
}

function duplicateError(error) {
  return error && error.code === 11000;
}

exports.bootstrapAdmin = async (req, res) => {
  const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!bootstrapSecret || Buffer.byteLength(bootstrapSecret, 'utf8') < 32) {
    return res.status(503).json({ error: 'Initial admin bootstrap is not configured' });
  }
  if (!safeEqual(req.get('x-bootstrap-secret'), bootstrapSecret)) {
    return res.status(401).json({ error: 'Invalid bootstrap credential' });
  }

  const parsed = validateAdminInput(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });

  try {
    const admin = await Admin.create({
      ...parsed.value,
      passwordHash: hashPassword(parsed.value.password),
      bootstrapLock: true,
    });
    return res.status(201).json({ admin: publicAdmin(admin) });
  } catch (error) {
    if (duplicateError(error)) {
      return res.status(409).json({ error: 'Admin bootstrap has already been completed or the username/email is taken' });
    }
    return res.status(500).json({ error: 'Unable to create initial admin' });
  }
};

exports.login = async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

  try {
    const admin = await Admin.findOne({ username }).select('+passwordHash');
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = signToken(
      { sub: admin._id.toString(), username: admin.username },
      process.env.JWT_SECRET,
    );
    return res.json({ token, token_type: 'Bearer', expires_in: 3600, admin: publicAdmin(admin) });
  } catch {
    return res.status(500).json({ error: 'Unable to authenticate admin' });
  }
};

exports.createAdmin = async (req, res) => {
  const parsed = validateAdminInput(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  try {
    const admin = await Admin.create({
      ...parsed.value,
      passwordHash: hashPassword(parsed.value.password),
      bootstrapLock: false,
    });
    return res.status(201).json({ admin: publicAdmin(admin) });
  } catch (error) {
    if (duplicateError(error)) return res.status(409).json({ error: 'Username or email already exists' });
    return res.status(500).json({ error: 'Unable to create admin' });
  }
};

exports.getAllAdmins = async (_req, res) => {
  try {
    const admins = await Admin.find().select('-passwordHash -bootstrapLock -__v').lean();
    return res.json(admins);
  } catch {
    return res.status(500).json({ error: 'Unable to retrieve admins' });
  }
};
