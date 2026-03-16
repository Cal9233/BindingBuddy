import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Upstash Redis rate limiting
// Falls back to no-op limiters when env vars are not configured.
// ---------------------------------------------------------------------------

const upstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const sharedRedis = upstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

function createLimiter(
  tokens: number,
  windowSeconds: number,
  prefix: string
): Ratelimit {
  if (!sharedRedis) {
    return {
      limit: async () => ({
        success: true,
        limit: 0,
        remaining: Infinity,
        reset: 0,
        pending: Promise.resolve(),
      }),
    } as unknown as Ratelimit;
  }

  return new Ratelimit({
    redis: sharedRedis,
    limiter: Ratelimit.slidingWindow(tokens, `${windowSeconds} s`),
    prefix,
  });
}

/** 10 requests per 60 seconds — checkout routes */
export const checkoutLimiter = createLimiter(10, 60, "ratelimit:checkout");

/** 5 requests per 15 minutes — TOTP verification */
export const totpLimiter = createLimiter(5, 900, "ratelimit:totp");

/** 3 requests per 15 minutes — contact form */
export const contactLimiter = createLimiter(3, 900, "ratelimit:contact");

// ---------------------------------------------------------------------------
// Legacy in-memory rate limiter (kept for backward compatibility)
// Used by TOTP and contact routes that haven't migrated yet.
// ---------------------------------------------------------------------------

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_ATTEMPTS = 5;

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
}

interface RateLimitConfig {
  windowMs?: number;
  maxAttempts?: number;
}

const stores = new Map<string, Map<string, RateLimitRecord>>();

function getStore(namespace: string): Map<string, RateLimitRecord> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }
  return store;
}

export function getRateLimitKey(
  req: NextRequest,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`;
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function isRateLimited(
  key: string,
  namespace: string,
  config?: RateLimitConfig
): boolean {
  const windowMs = config?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxAttempts = config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const store = getStore(namespace);

  const record = store.get(key);
  if (!record) return false;

  if (Date.now() - record.firstAttempt > windowMs) {
    store.delete(key);
    return false;
  }

  return record.count >= maxAttempts;
}

export function recordFailedAttempt(
  key: string,
  namespace: string,
  config?: RateLimitConfig
): void {
  const windowMs = config?.windowMs ?? DEFAULT_WINDOW_MS;
  const store = getStore(namespace);

  const record = store.get(key);
  if (!record || Date.now() - record.firstAttempt > windowMs) {
    store.set(key, { count: 1, firstAttempt: Date.now() });
  } else {
    record.count++;
  }
}

export function clearFailedAttempts(
  key: string,
  namespace: string
): void {
  getStore(namespace).delete(key);
}
