const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateOrderPayload, validateMenuItemPayload, validateFeedbackPayload,
} = require('../utils/requestValidation');

test('valid order payload is normalized', () => {
  const result = validateOrderPayload({
    customerName: ' Alice ', tableNumber: 4,
    items: [{ name: ' Pasta ', quantity: 2 }],
  });
  assert.deepEqual(result.value, {
    customerName: 'Alice', tableNumber: 4, items: [{ name: 'Pasta', quantity: 2 }],
  });
});

test('order rejects fractional quantities, invalid table numbers and oversized item arrays', () => {
  assert.ok(validateOrderPayload({ customerName: 'A', tableNumber: 1.5, items: [{ name: 'x', quantity: 1 }] }).error);
  assert.ok(validateOrderPayload({ customerName: 'A', tableNumber: 1, items: [{ name: 'x', quantity: 1.5 }] }).error);
  assert.ok(validateOrderPayload({ customerName: 'A', tableNumber: 1, items: Array(31).fill({ name: 'x', quantity: 1 }) }).error);
});

test('menu item rejects string prices and malformed tags', () => {
  assert.ok(validateMenuItemPayload({ name: 'Tea', category: 'Drinks', price: '10' }).error);
  assert.ok(validateMenuItemPayload({ name: 'Tea', category: 'Drinks', price: 10, tags: 'hot' }).error);
  assert.equal(validateMenuItemPayload({ name: 'Tea', category: 'Drinks', price: 10 }).value.tags.length, 0);
});

test('feedback requires integer rating and bounded fields', () => {
  assert.ok(validateFeedbackPayload({ customerName: 'A', rating: 4.5 }).error);
  assert.ok(validateFeedbackPayload({ customerName: 'A', rating: 5, comment: 'x'.repeat(1001) }).error);
  assert.equal(validateFeedbackPayload({ customerName: ' Alice ', rating: 5 }).value.customerName, 'Alice');
});
