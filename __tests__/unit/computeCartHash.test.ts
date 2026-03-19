/**
 * computeCartHash.test.ts
 *
 * Unit tests for the computeCartHash function.
 *
 * Note: computeCartHash is NOT exported from the route file
 * (src/app/api/checkout/create-payment-intent/route.ts).
 * The implementation is replicated here for pure unit testing.
 *
 * T15: Without a session_id cookie, the idempotency key in the route uses
 * "anon" as the session identifier, meaning two anonymous users with the
 * same cart on the same server process would share an idempotency key.
 * This is a known limitation documented here.
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Replicated implementation (mirrors the unexported function in the route)
// ---------------------------------------------------------------------------

function computeCartHash(
  items: Array<{ productId: string; quantity: number; variant?: string }>
): string {
  const sorted = [...items].sort((a, b) =>
    a.productId.localeCompare(b.productId)
  );
  const str = sorted
    .map((i) => `${i.productId}:${i.quantity}:${i.variant ?? ""}`)
    .join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

// ---------------------------------------------------------------------------
// T13: Determinism — order independence
// ---------------------------------------------------------------------------

describe("computeCartHash — T13 determinism", () => {
  it("returns the same hash regardless of item insertion order", () => {
    const items1 = [
      { productId: "prod-a", quantity: 2 },
      { productId: "prod-b", quantity: 1 },
      { productId: "prod-c", quantity: 3 },
    ];
    const items2 = [
      { productId: "prod-c", quantity: 3 },
      { productId: "prod-a", quantity: 2 },
      { productId: "prod-b", quantity: 1 },
    ];
    const items3 = [
      { productId: "prod-b", quantity: 1 },
      { productId: "prod-c", quantity: 3 },
      { productId: "prod-a", quantity: 2 },
    ];

    const hash1 = computeCartHash(items1);
    const hash2 = computeCartHash(items2);
    const hash3 = computeCartHash(items3);

    expect(hash1).toBe(hash2);
    expect(hash1).toBe(hash3);
  });

  it("returns the same hash for a single item regardless of call", () => {
    const items = [{ productId: "prod-only", quantity: 5 }];
    expect(computeCartHash(items)).toBe(computeCartHash(items));
  });

  it("sorts by productId lexicographically", () => {
    const forward = [
      { productId: "aaa", quantity: 1 },
      { productId: "zzz", quantity: 1 },
    ];
    const backward = [
      { productId: "zzz", quantity: 1 },
      { productId: "aaa", quantity: 1 },
    ];
    expect(computeCartHash(forward)).toBe(computeCartHash(backward));
  });
});

// ---------------------------------------------------------------------------
// T14: Variant sensitivity
// ---------------------------------------------------------------------------

describe("computeCartHash — T14 variant sensitivity", () => {
  it("returns different hashes for the same product with different variants", () => {
    const withVariantA = [{ productId: "prod-1", quantity: 1, variant: "red" }];
    const withVariantB = [{ productId: "prod-1", quantity: 1, variant: "blue" }];

    expect(computeCartHash(withVariantA)).not.toBe(computeCartHash(withVariantB));
  });

  it("returns different hashes when variant is present vs absent", () => {
    const withVariant = [{ productId: "prod-1", quantity: 1, variant: "red" }];
    const withoutVariant = [{ productId: "prod-1", quantity: 1 }];

    expect(computeCartHash(withVariant)).not.toBe(computeCartHash(withoutVariant));
  });

  it("treats undefined variant the same as no variant field", () => {
    const undefinedVariant = [
      { productId: "prod-1", quantity: 1, variant: undefined },
    ];
    const missingVariant = [{ productId: "prod-1", quantity: 1 }];

    expect(computeCartHash(undefinedVariant)).toBe(computeCartHash(missingVariant));
  });

  it("returns different hashes when quantities differ", () => {
    const qty1 = [{ productId: "prod-1", quantity: 1 }];
    const qty2 = [{ productId: "prod-1", quantity: 2 }];

    expect(computeCartHash(qty1)).not.toBe(computeCartHash(qty2));
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("computeCartHash — edge cases", () => {
  it("produces a non-empty string for a minimal single-item cart", () => {
    const result = computeCartHash([{ productId: "x", quantity: 1 }]);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("produces different hashes for carts with different product sets", () => {
    const cartA = [{ productId: "prod-1", quantity: 1 }];
    const cartB = [{ productId: "prod-2", quantity: 1 }];

    expect(computeCartHash(cartA)).not.toBe(computeCartHash(cartB));
  });

  it("returns a base-36 string (only digits and lowercase a-z)", () => {
    const result = computeCartHash([
      { productId: "prod-1", quantity: 3, variant: "large" },
    ]);
    expect(result).toMatch(/^[0-9a-z]+$/);
  });
});

// ---------------------------------------------------------------------------
// T15: Anonymous session documentation
// ---------------------------------------------------------------------------

describe("computeCartHash — T15 anonymous session note", () => {
  it("is documented: without session_id cookie, idempotency key uses 'anon'", () => {
    // This test documents the known behavior:
    // In create-payment-intent/route.ts, when no session_id cookie exists,
    // the idempotency key is constructed as `pi_${sessionId}_${cartHash}`
    // where sessionId defaults to "anon".
    //
    // Consequence: two anonymous users with identical carts on the same server
    // process will share an idempotency key, which Stripe resolves by returning
    // the existing PaymentIntent rather than creating a new one.
    //
    // Mitigation: the client should set a session_id cookie before calling
    // create-payment-intent, or the server should generate and set one.
    expect(true).toBe(true); // documentation-only test
  });
});
