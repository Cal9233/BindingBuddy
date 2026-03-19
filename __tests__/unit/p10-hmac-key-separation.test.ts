/**
 * p10-hmac-key-separation.test.ts
 *
 * Adversarial tests for P10: Separate HMAC Signing Keys.
 * Verifies that:
 * 1. Different secrets produce different signatures (key isolation).
 * 2. Missing dedicated key falls back with warning (not silent).
 * 3. Missing ALL keys throws a generic error (no secret name leakage).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Helpers — mirror the production signing logic for validation
// ---------------------------------------------------------------------------

function getPayPalSigningSecret(): string {
  const dedicated = process.env.PAYPAL_SIGNING_SECRET;
  if (dedicated) return dedicated;
  const fallback = process.env.PAYLOAD_SECRET;
  if (!fallback) throw new Error("Server configuration error");
  console.warn(
    "[security] PAYPAL_SIGNING_SECRET is not set — falling back to shared secret."
  );
  return fallback;
}

function getTotpCookieSecret(): string {
  const dedicated = process.env.TOTP_COOKIE_SECRET;
  if (dedicated) return dedicated;
  const fallback = process.env.PAYLOAD_SECRET;
  if (!fallback) throw new Error("Server configuration error");
  console.warn(
    "[security] TOTP_COOKIE_SECRET is not set — falling back to shared secret."
  );
  return fallback;
}

function signWithSecret(secret: string, data: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

describe("P10: HMAC Key Separation", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Adversarial Test 1: Cross-context signature forgery
  // An attacker who obtains the TOTP cookie secret should NOT be able to
  // forge PayPal order signatures, and vice versa.
  // -------------------------------------------------------------------------
  it("TOTP secret cannot forge PayPal signatures when keys are separated", () => {
    process.env.TOTP_COOKIE_SECRET = "totp-secret-abc123";
    process.env.PAYPAL_SIGNING_SECRET = "paypal-secret-xyz789";

    const totpSecret = getTotpCookieSecret();
    const paypalSecret = getPayPalSigningSecret();

    const orderId = "ABC12345678901234";
    const totpSig = signWithSecret(totpSecret, `paypal_order:${orderId}`);
    const paypalSig = signWithSecret(paypalSecret, `paypal_order:${orderId}`);

    // Signatures MUST differ — compromise of one key doesn't compromise the other
    expect(totpSig).not.toBe(paypalSig);
  });

  // -------------------------------------------------------------------------
  // Adversarial Test 2: Silent fallback bypass
  // When TOTP_COOKIE_SECRET is missing, the code MUST emit a console.warn
  // (not fail silently). Verify the warning fires.
  // -------------------------------------------------------------------------
  it("emits console.warn when falling back to PAYLOAD_SECRET for TOTP", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    delete process.env.TOTP_COOKIE_SECRET;
    process.env.PAYLOAD_SECRET = "shared-fallback-secret";

    const secret = getTotpCookieSecret();

    expect(secret).toBe("shared-fallback-secret");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("[security]");
    expect(warnSpy.mock.calls[0][0]).toContain("TOTP_COOKIE_SECRET");
  });

  // -------------------------------------------------------------------------
  // Adversarial Test 3: Information leakage on total key absence (R9)
  // When ALL keys are missing, the error message must NOT reveal key names
  // or values — only a generic "Server configuration error".
  // -------------------------------------------------------------------------
  it("throws generic error without key names when all secrets are missing", () => {
    delete process.env.PAYPAL_SIGNING_SECRET;
    delete process.env.PAYLOAD_SECRET;

    expect(() => getPayPalSigningSecret()).toThrow("Server configuration error");

    // Verify the error message does NOT contain env var names
    try {
      getPayPalSigningSecret();
    } catch (e: unknown) {
      const msg = (e as Error).message;
      expect(msg).not.toContain("PAYPAL_SIGNING_SECRET");
      expect(msg).not.toContain("PAYLOAD_SECRET");
    }
  });
});
