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
  if (typeof clock !== "function") {
    throw new TypeError("clock must be a function");
  }

  const buckets = new Map();

  return function rateLimit(req, res, next) {
    const now = clock();
    if (typeof now !== "number" || !Number.isFinite(now)) {
      return res.status(503).json({ error: "Rate limiter clock is unavailable" });
    }
    const key = typeof req.ip === "string" && req.ip
      ? req.ip
      : (req.socket && req.socket.remoteAddress) || "unknown";

    // Expire old entries before enforcing the key cap.
    for (const [entryKey, entry] of buckets) {
      if (now >= entry.resetAt) buckets.delete(entryKey);
    }

    let bucket = buckets.get(key);
    if (!bucket && buckets.size >= maxKeys) {
      // Never evict an active bucket: doing so lets an attacker reset another
      // client's attempt count by rotating source addresses.
      const earliestReset = Math.min(...Array.from(buckets.values(), entry => entry.resetAt));
      const retryAfter = Math.max(1, Math.ceil((earliestReset - now) / 1000));
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Rate limiter capacity reached; try again later" });
    }

    if (!bucket) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    if (bucket.count >= maxAttempts) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Too many attempts; try again later" });
    }

    bucket.count += 1;
    return next();
  };
}

module.exports = { createRateLimiter };
