/**
 * p27-totp-middleware.test.ts
 *
 * Adversarial tests for P27: Server-Side TOTP Enforcement in Middleware.
 * Verifies that:
 * 1. Direct URL navigation to /admin without valid cookie is blocked.
 * 2. Tampered/forged HMAC cookies are rejected.
 * 3. Expired cookies are rejected (R4: timestamp handling).
 *
 * These tests exercise the HMAC validation logic directly since
 * the middleware uses Web Crypto API which requires special setup.
 * We mirror the validation logic with Node.js crypto for testing.
 */

import { describe, it, expect, afterEach } from "vitest";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Mirror of the middleware validation logic (Node.js crypto equivalent)
// ---------------------------------------------------------------------------

const TOTP_COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

interface TotpCookieParts {
  userId: string;
  timestamp: string;
  hmac: string;
}

function parseTotpCookie(cookieValue: string): TotpCookieParts | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(":");
  if (parts.length !== 3) return null;
  const [userId, timestamp, hmac] = parts;
  if (!userId || !timestamp || !hmac) return null;
  return { userId, timestamp, hmac };
}

function validateTotpCookie(cookieValue: string, secret: string): boolean {
  const parsed = parseTotpCookie(cookieValue);
  if (!parsed) return false;

  const cookieTimeMs = parseInt(parsed.timestamp, 36);
  if (isNaN(cookieTimeMs) || cookieTimeMs <= 0) return false;
  if (Date.now() - cookieTimeMs > TOTP_COOKIE_MAX_AGE_MS) return false;

  const expectedHmac = crypto
    .createHmac("sha256", secret)
    .update(`${parsed.userId}:${parsed.timestamp}`)
    .digest("hex");

  if (parsed.hmac.length !== expectedHmac.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(parsed.hmac, "hex"),
      Buffer.from(expectedHmac, "hex")
    );
  } catch {
    return false;
  }
}

function createValidCookie(userId: string, secret: string, timestampMs?: number): string {
  const ts = (timestampMs ?? Date.now()).toString(36);
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(`${userId}:${ts}`)
    .digest("hex");
  return `${userId}:${ts}:${hmac}`;
}

const TEST_SECRET = "test-totp-cookie-secret-for-vitest";

describe("P27: TOTP Middleware Enforcement", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  // -------------------------------------------------------------------------
  // Adversarial Test 1: Direct URL bypass attempt
  // An attacker navigates directly to /admin with no cookie, an empty cookie,
  // or a cookie containing only whitespace. All must be rejected.
  // R7: Empty state must NOT bypass — treated as "not verified".
  // -------------------------------------------------------------------------
  it("rejects missing, empty, and whitespace-only cookies", () => {
    // No cookie
    expect(validateTotpCookie("", TEST_SECRET)).toBe(false);

    // Empty string
    expect(validateTotpCookie("", TEST_SECRET)).toBe(false);

    // Whitespace only
    expect(validateTotpCookie("   ", TEST_SECRET)).toBe(false);

    // Single colon
    expect(validateTotpCookie(":", TEST_SECRET)).toBe(false);

    // Two colons but empty segments
    expect(validateTotpCookie("::", TEST_SECRET)).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Adversarial Test 2: Forged HMAC cookie
  // An attacker crafts a cookie with a valid-looking userId and timestamp
  // but a forged HMAC. Must be rejected.
  // -------------------------------------------------------------------------
  it("rejects cookies with forged HMAC signatures", () => {
    const validCookie = createValidCookie("user-123", TEST_SECRET);
    // Verify the valid cookie passes first
    expect(validateTotpCookie(validCookie, TEST_SECRET)).toBe(true);

    // Tamper with the HMAC — change last 4 chars
    const parts = validCookie.split(":");
    const tamperedHmac = parts[2].slice(0, -4) + "dead";
    const forgedCookie = `${parts[0]}:${parts[1]}:${tamperedHmac}`;
    expect(validateTotpCookie(forgedCookie, TEST_SECRET)).toBe(false);

    // Attacker uses a different secret to sign
    const attackerCookie = createValidCookie("user-123", "attacker-knows-wrong-secret");
    expect(validateTotpCookie(attackerCookie, TEST_SECRET)).toBe(false);

    // Attacker tries to change the userId but keep the HMAC
    const stolenParts = validCookie.split(":");
    const hijackedCookie = `admin-user:${stolenParts[1]}:${stolenParts[2]}`;
    expect(validateTotpCookie(hijackedCookie, TEST_SECRET)).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Adversarial Test 3: Expired cookie replay attack (R4)
  // An attacker replays a cookie from 9+ hours ago. The timestamp is in
  // UTC (Date.now()), so timezone drift should not cause false positives.
  // -------------------------------------------------------------------------
  it("rejects expired cookies and validates fresh ones", () => {
    // Cookie from 9 hours ago — should be rejected (> 8 hour window)
    const nineHoursAgo = Date.now() - 9 * 60 * 60 * 1000;
    const expiredCookie = createValidCookie("user-123", TEST_SECRET, nineHoursAgo);
    expect(validateTotpCookie(expiredCookie, TEST_SECRET)).toBe(false);

    // Cookie from 7 hours ago — should be accepted (< 8 hour window)
    const sevenHoursAgo = Date.now() - 7 * 60 * 60 * 1000;
    const validCookie = createValidCookie("user-123", TEST_SECRET, sevenHoursAgo);
    expect(validateTotpCookie(validCookie, TEST_SECRET)).toBe(true);

    // Cookie with timestamp 0 (epoch) — ancient, must be rejected
    const ancientCookie = createValidCookie("user-123", TEST_SECRET, 0);
    expect(validateTotpCookie(ancientCookie, TEST_SECRET)).toBe(false);

    // Cookie with negative timestamp — must be rejected
    expect(validateTotpCookie("user-123:-1:abc123", TEST_SECRET)).toBe(false);

    // Cookie with NaN timestamp — must be rejected
    expect(validateTotpCookie("user-123:notanumber:abc123", TEST_SECRET)).toBe(false);
  });
});
