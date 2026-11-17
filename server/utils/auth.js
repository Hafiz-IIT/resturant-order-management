const crypto = require('node:crypto');

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const TOKEN_TTL_SECONDS = 60 * 60;

function requireSecret(secret) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes of high-entropy secret material');
  }
  return secret;
}

function safeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const a = Buffer.from(left, 'utf8');
  const b = Buffer.from(right, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('password must contain at least 12 characters');
  }
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 64 * 1024 * 1024,
  });
  return ['scrypt', SCRYPT_N, SCRYPT_R, SCRYPT_P,
    salt.toString('base64url'), derived.toString('base64url')].join('$');
}

function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || typeof encoded !== 'string') return false;
  const parts = encoded.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [n, r, p] = parts.slice(1, 4).map(Number);
  if (n !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P) return false;
  try {
    const salt = Buffer.from(parts[4], 'base64url');
    const expected = Buffer.from(parts[5], 'base64url');
    if (salt.length !== 16 || expected.length !== KEY_LENGTH) return false;
    const actual = crypto.scryptSync(password, salt, KEY_LENGTH, {
      N: n, r, p, maxmem: 64 * 1024 * 1024,
    });
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function signToken(claims, secret, options = {}) {
  requireSecret(secret);
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const ttlSeconds = options.ttlSeconds ?? TOKEN_TTL_SECONDS;
  if (!Number.isInteger(now) || !Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
    throw new Error('token time values must be valid positive integers');
  }
  if (!claims || typeof claims.sub !== 'string' || !claims.sub) {
    throw new Error('token subject is required');
  }
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    sub: claims.sub,
    username: typeof claims.username === 'string' ? claims.username : '',
    iat: now,
    exp: now + ttlSeconds,
  }));
  const signingInput = header + '.' + payload;
  const signature = crypto.createHmac('sha256', secret).update(signingInput).digest('base64url');
  return signingInput + '.' + signature;
}

function verifyToken(token, secret, now = Math.floor(Date.now() / 1000)) {
  requireSecret(secret);
  if (typeof token !== 'string' || !Number.isInteger(now)) throw new Error('invalid token');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('invalid token');
  let header;
  let payload;
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    throw new Error('invalid token');
  }
  if (header.alg !== 'HS256' || header.typ !== 'JWT') throw new Error('unsupported token');
  const signingInput = parts[0] + '.' + parts[1];
  const expected = crypto.createHmac('sha256', secret).update(signingInput).digest();
  let supplied;
  try {
    supplied = Buffer.from(parts[2], 'base64url');
  } catch {
    throw new Error('invalid token');
  }
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    throw new Error('invalid token signature');
  }
  if (typeof payload.sub !== 'string' || !payload.sub ||
      !Number.isInteger(payload.iat) || !Number.isInteger(payload.exp) ||
      payload.exp <= now || payload.iat > now + 60) {
    throw new Error('expired or invalid token claims');
  }
  return payload;
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken, safeEqual };
