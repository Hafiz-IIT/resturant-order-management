const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword, signToken, verifyToken, safeEqual } = require('../utils/auth');

const SECRET = 'test-only-secret-with-at-least-32-bytes-long';

test('password hashes are salted and verify without exposing the password', () => {
  const password = 'correct horse battery staple';
  const first = hashPassword(password);
  const second = hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(verifyPassword(password, first), true);
  assert.equal(verifyPassword('wrong password', first), false);
  assert.equal(first.includes(password), false);
});

test('password policy rejects short values', () => {
  assert.throws(() => hashPassword('short'), /at least 12 characters/);
});

test('signed bearer token verifies and expires', () => {
  const token = signToken({ sub: 'admin-1', username: 'owner' }, SECRET, { now: 100, ttlSeconds: 60 });
  assert.equal(verifyToken(token, SECRET, 120).sub, 'admin-1');
  assert.throws(() => verifyToken(token, SECRET, 160), /expired/);
});

test('tampered token and weak signing secret are rejected', () => {
  const token = signToken({ sub: 'admin-1' }, SECRET, { now: 100, ttlSeconds: 60 });
  const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
  assert.throws(() => verifyToken(tampered, SECRET, 101), /signature/);
  assert.throws(() => signToken({ sub: 'admin-1' }, 'weak'), /32 bytes/);
});

test('bootstrap secret comparison is constant-time and type-safe', () => {
  assert.equal(safeEqual('same-secret', 'same-secret'), true);
  assert.equal(safeEqual('same-secret', 'other-secret'), false);
  assert.equal(safeEqual(undefined, 'same-secret'), false);
});

const { canTransitionOrderStatus } = require('../utils/orderStatus');

test('order status transitions follow the declared state machine', () => {
  assert.equal(canTransitionOrderStatus('pending', 'preparing'), true);
  assert.equal(canTransitionOrderStatus('preparing', 'ready'), true);
  assert.equal(canTransitionOrderStatus('ready', 'served'), true);
  assert.equal(canTransitionOrderStatus('served', 'pending'), false);
  assert.equal(canTransitionOrderStatus('pending', 'served'), false);
  assert.equal(canTransitionOrderStatus('pending', 'pending'), true);
});
