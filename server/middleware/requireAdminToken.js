const { timingSafeEqual } = require('node:crypto');

module.exports = function requireAdminToken(req, res, next) {
  const expected = process.env.ADMIN_API_TOKEN;
  const supplied = req.get('authorization') || '';
  const token = supplied.startsWith('Bearer ') ? supplied.slice(7) : '';
  if (!expected || !token) {
    return res.status(401).json({ error: 'Administrative authorization required' });
  }
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(token);
  if (expectedBuffer.length !== suppliedBuffer.length ||
      !timingSafeEqual(expectedBuffer, suppliedBuffer)) {
    return res.status(401).json({ error: 'Administrative authorization required' });
  }
  next();
};
