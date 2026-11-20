const test = require('node:test');
const assert = require('node:assert/strict');
const { createRateLimiter } = require('../middleware/rateLimit');

function invoke(middleware, ip) {
  let nextCalled = false;
  let statusCode = 200;
  let retryAfter;
  const res = {
    set(name, value) {
      if (name === 'Retry-After') retryAfter = value;
      return this;
    },
    status(value) {
      statusCode = value;
      return this;
    },
    json(body) {
      return body;
    },
  };
  middleware({ ip }, res, () => { nextCalled = true; });
  return { nextCalled, statusCode, retryAfter };
}

test('rate limiter blocks requests above the configured attempt limit', () => {
  let now = 1000;
  const limit = createRateLimiter({
    maxAttempts: 2,
    windowMs: 5000,
    clock: () => now,
  });

  assert.equal(invoke(limit, '192.0.2.1').nextCalled, true);
  assert.equal(invoke(limit, '192.0.2.1').nextCalled, true);
  const blocked = invoke(limit, '192.0.2.1');
  assert.equal(blocked.nextCalled, false);
  assert.equal(blocked.statusCode, 429);
  assert.equal(blocked.retryAfter, '5');

  now += 5000;
  assert.equal(invoke(limit, '192.0.2.1').nextCalled, true);
});

test('rate-limit capacity does not evict active client buckets', () => {
  const limit = createRateLimiter({
    maxAttempts: 1,
    windowMs: 1000,
    maxKeys: 1,
    clock: () => 100,
  });

  assert.equal(invoke(limit, '192.0.2.1').nextCalled, true);
  const capacityBlocked = invoke(limit, '192.0.2.2');
  assert.equal(capacityBlocked.nextCalled, false);
  assert.equal(capacityBlocked.statusCode, 429);
  assert.equal(capacityBlocked.retryAfter, '1');

  // The first client's active bucket must still be enforced after the
  // second address attempted to force key-capacity eviction.
  const originalClientBlocked = invoke(limit, '192.0.2.1');
  assert.equal(originalClientBlocked.nextCalled, false);
  assert.equal(originalClientBlocked.statusCode, 429);
});

test('non-finite limiter clock fails closed', () => {
  const limit = createRateLimiter({
    maxAttempts: 1,
    windowMs: 1000,
    clock: () => Number.NaN,
  });
  const result = invoke(limit, '192.0.2.1');
  assert.equal(result.nextCalled, false);
  assert.equal(result.statusCode, 503);
});

test('invalid rate-limit configuration is rejected', () => {
  assert.throws(() => createRateLimiter({ maxAttempts: 0, windowMs: 1000 }), /maxAttempts/);
  assert.throws(() => createRateLimiter({ maxAttempts: 2, windowMs: 0 }), /windowMs/);
});
