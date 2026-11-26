interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Checks and increments rate limit for a client IP or identifier
 * @param ip Client IP address or key
 * @param maxRequests Maximum requests allowed within window (default 15)
 * @param windowMs Window duration in milliseconds (default 60,000ms = 1 min)
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 15,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const safeIp = ip || 'anonymous_client';
  const entry = rateLimitMap.get(safeIp);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(safeIp, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
