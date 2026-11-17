// Process-local rate limiting for the prototype API.
// Multi-instance deployments must replace this with a shared store (for example Redis).
function createRateLimiter({ maxAttempts, windowMs, clock = Date.now, maxKeys = 10000 } = {}) {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError("maxAttempts must be a positive integer");
  }
  if (!Number.isInteger(windowMs) || windowMs < 1) {
    throw new TypeError("windowMs must be a positive integer");
  }
  if (!Number.isInteger(maxKeys) || maxKeys < 1) {
    throw new TypeError("maxKeys must be a positive integer");
  }

  const buckets = new Map();

  return function rateLimit(req, res, next) {
    const now = clock();
    const key = typeof req.ip === "string" && req.ip
      ? req.ip
      : (req.socket && req.socket.remoteAddress) || "unknown";
    let bucket = buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    if (bucket.count >= maxAttempts) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Too many attempts; try again later" });
    }

    bucket.count += 1;

    // Bound memory use without timers. Remove expired entries on request.
    for (const [entryKey, entry] of buckets) {
      if (now >= entry.resetAt) buckets.delete(entryKey);
    }
    while (buckets.size > maxKeys) {
      const oldestKey = buckets.keys().next().value;
      buckets.delete(oldestKey);
    }

    return next();
  };
}

module.exports = { createRateLimiter };
