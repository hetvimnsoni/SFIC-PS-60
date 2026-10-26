import { RateLimitError } from "../utils/errors";

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Enforces in-memory rate limiting per client identifier (IP or user ID).
 * Default: 30 requests per 60-second window.
 */
export function checkRateLimit(
  clientId: string,
  maxRequests: number = 30,
  windowSeconds: number = 60
): { remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  let record = rateLimitStore.get(clientId);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(clientId, record);
  }

  // Filter out expired timestamps
  record.timestamps = record.timestamps.filter((ts) => ts > cutoff);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    throw new RateLimitError(
      `Rate limit exceeded. Too many requests. Please wait ${retryAfterSeconds} seconds before retrying.`
    );
  }

  record.timestamps.push(now);
  const remaining = maxRequests - record.timestamps.length;
  const resetTime = Math.ceil((record.timestamps[0] + windowMs) / 1000);

  return { remaining, resetTime };
}

/**
 * Cleanup expired rate-limit records periodically
 */
export function pruneRateLimitStore(): void {
  const now = Date.now();
  const maxWindowMs = 300 * 1000;
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => ts > now - maxWindowMs);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}
