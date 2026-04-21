/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiting for API routes.
 * For production at scale, consider upgrading to Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const resetTime = now + config.windowMs;
  const key = config.keyPrefix ? `${config.keyPrefix}:${identifier}` : identifier;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime,
    };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit configurations for different use cases
 */
export const rateLimitConfigs = {
  auth: { limit: 5, windowMs: 60 * 1000, keyPrefix: 'auth' },
  register: { limit: 3, windowMs: 60 * 60 * 1000, keyPrefix: 'register' },
  api: { limit: 60, windowMs: 60 * 1000, keyPrefix: 'api' },
  game: { limit: 120, windowMs: 60 * 1000, keyPrefix: 'game' },
  chat: { limit: 30, windowMs: 60 * 1000, keyPrefix: 'chat' },
} as const;

/**
 * Extract client identifier from request
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return `ip:${forwardedFor.split(',')[0].trim()}`;
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return `ip:${realIp}`;
  
  return 'anonymous';
}

/**
 * Create rate limit error response
 */
export function rateLimitErrorResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
        'Retry-After': result.retryAfter?.toString() || '0',
      },
    }
  );
}
