const { verifyToken } = require('../utils/auth');

module.exports = function authenticateAdmin(req, res, next) {
  const authorization = req.headers.authorization || '';
  const match = /^Bearer ([A-Za-z0-9._-]+)$/.exec(authorization);
  if (!match) {
    return res.status(401).json({ error: 'Bearer token required' });
  }

  try {
    const claims = verifyToken(match[1], process.env.JWT_SECRET);
    req.admin = { id: claims.sub, username: claims.username };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
