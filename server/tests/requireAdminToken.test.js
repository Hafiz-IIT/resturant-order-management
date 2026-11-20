const test = require('node:test');
const assert = require('node:assert/strict');
const requireAdminToken = require('../middleware/requireAdminToken');

function invoke(header) {
  const req = { get: () => header };
  let statusCode = 200;
  let body;
  let nextCalled = false;
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; }
  };
  requireAdminToken(req, res, () => { nextCalled = true; });
  return { statusCode, body, nextCalled };
}

test('rejects requests when the server token is not configured', () => {
  const previous = process.env.ADMIN_API_TOKEN;
  delete process.env.ADMIN_API_TOKEN;
  try {
    const result = invoke('Bearer supplied');
    assert.equal(result.statusCode, 401);
    assert.equal(result.nextCalled, false);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_API_TOKEN;
    else process.env.ADMIN_API_TOKEN = previous;
  }
});

test('rejects missing and incorrect bearer tokens', () => {
  process.env.ADMIN_API_TOKEN = 'a'.repeat(40);
  assert.equal(invoke(undefined).statusCode, 401);
  assert.equal(invoke('Bearer wrong').statusCode, 401);
});

test('accepts the configured bearer token', () => {
  process.env.ADMIN_API_TOKEN = 'a'.repeat(40);
  const result = invoke(`Bearer ${process.env.ADMIN_API_TOKEN}`);
  assert.equal(result.nextCalled, true);
  assert.equal(result.statusCode, 200);
});
