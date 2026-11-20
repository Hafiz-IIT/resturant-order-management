const TRANSITIONS = Object.freeze({
  pending: new Set(['preparing', 'cancelled']),
  preparing: new Set(['ready', 'cancelled']),
  ready: new Set(['served', 'cancelled']),
  served: new Set(),
  cancelled: new Set(),
});

function canTransitionOrderStatus(current, next) {
  if (!Object.prototype.hasOwnProperty.call(TRANSITIONS, current) ||
      !Object.prototype.hasOwnProperty.call(TRANSITIONS, next)) return false;
  return current === next || TRANSITIONS[current].has(next);
}

module.exports = { canTransitionOrderStatus };
