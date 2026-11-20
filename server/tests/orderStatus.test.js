const test = require('node:test');
const assert = require('node:assert/strict');
const { canTransitionOrderStatus } = require('../lib/orderStatus');

test('allows valid forward order transitions', () => {
  assert.equal(canTransitionOrderStatus('pending', 'preparing'), true);
  assert.equal(canTransitionOrderStatus('preparing', 'ready'), true);
  assert.equal(canTransitionOrderStatus('ready', 'served'), true);
  assert.equal(canTransitionOrderStatus('pending', 'cancelled'), true);
});

test('rejects backwards and terminal-state transitions', () => {
  assert.equal(canTransitionOrderStatus('served', 'pending'), false);
  assert.equal(canTransitionOrderStatus('cancelled', 'preparing'), false);
  assert.equal(canTransitionOrderStatus('ready', 'preparing'), false);
});

test('allows idempotent status updates and rejects unknown states', () => {
  assert.equal(canTransitionOrderStatus('pending', 'pending'), true);
  assert.equal(canTransitionOrderStatus('unknown', 'pending'), false);
});
