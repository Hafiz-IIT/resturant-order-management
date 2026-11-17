const transitions = Object.freeze({
  pending: new Set(['preparing', 'cancelled']),
  preparing: new Set(['ready', 'cancelled']),
  ready: new Set(['served', 'cancelled']),
  served: new Set(),
  cancelled: new Set(),
});

function canTransitionOrderStatus(current, next) {
  if (current === next) return true;
  return Boolean(transitions[current] && transitions[current].has(next));
}

module.exports = { canTransitionOrderStatus };
