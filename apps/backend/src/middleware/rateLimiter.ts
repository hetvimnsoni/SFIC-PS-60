import type { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimiter(limit: number = 30, windowSeconds: number = 60) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "global";
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    let entry = rateLimitStore.get(ip);
    if (!entry || now > entry.resetAt) {
      entry = { count: 1, resetAt: now + windowMs };
      rateLimitStore.set(ip, entry);
    } else {
      entry.count++;
    }

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - entry.count));

    if (entry.count > limit) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please slow down and try again shortly.",
        retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
      });
    }

    next();
  };
}
