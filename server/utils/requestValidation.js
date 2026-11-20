function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateOrderPayload(body) {
  if (!isPlainObject(body)) return { error: 'Order body must be an object' };
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const tableNumber = body.tableNumber;
  const items = body.items;
  if (!customerName || customerName.length > 100) return { error: 'customerName must contain 1-100 characters' };
  if (!Number.isInteger(tableNumber) || tableNumber < 1 || tableNumber > 500) {
    return { error: 'tableNumber must be an integer between 1 and 500' };
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
    return { error: 'items must contain between 1 and 30 entries' };
  }
  const normalizedItems = [];
  for (const item of items) {
    if (!isPlainObject(item)) return { error: 'each order item must be an object' };
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    if (!name || name.length > 120) return { error: 'item name must contain 1-120 characters' };
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      return { error: 'item quantity must be an integer between 1 and 100' };
    }
    normalizedItems.push({ name, quantity: item.quantity });
  }
  return { value: { customerName, tableNumber, items: normalizedItems } };
}

function validateMenuItemPayload(body) {
  if (!isPlainObject(body)) return { error: 'Menu item body must be an object' };
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  if (!name || name.length > 120 || !category || category.length > 60) {
    return { error: 'name and category are required and must fit their length limits' };
  }
  if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0 || body.price > 100000) {
    return { error: 'price must be a finite number between 0 and 100000' };
  }
  const tags = body.tags === undefined ? [] : body.tags;
  if (!Array.isArray(tags) || tags.length > 30 ||
      tags.some(tag => typeof tag !== 'string' || !tag.trim() || tag.trim().length > 40)) {
    return { error: 'tags must be an array of 1-40 character strings (maximum 30)' };
  }
  return { value: { name, category, price: body.price, tags: tags.map(tag => tag.trim()) } };
}

function validateFeedbackPayload(body) {
  if (!isPlainObject(body)) return { error: 'Feedback body must be an object' };
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const comment = body.comment === undefined ? '' : body.comment;
  if (!customerName || customerName.length > 100) return { error: 'customerName must contain 1-100 characters' };
  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    return { error: 'rating must be an integer between 1 and 5' };
  }
  if (typeof comment !== 'string' || comment.length > 1000) {
    return { error: 'comment must be a string of at most 1000 characters' };
  }
  return { value: { customerName, rating: body.rating, comment: comment.trim() } };
}

module.exports = { validateOrderPayload, validateMenuItemPayload, validateFeedbackPayload };
