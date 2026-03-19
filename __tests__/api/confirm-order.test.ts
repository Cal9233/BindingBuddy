/**
 * confirm-order.test.ts
 *
 * Unit tests for POST /api/checkout/stripe/confirm-order
 * Stripe client is mocked — no real API calls.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks (must be declared before any imports of the route)
// vi.hoisted() ensures variables are initialized before vi.mock() factories run
// ---------------------------------------------------------------------------

const {
  mockPayloadFind,
  mockPayloadUpdate,
  mockPayloadCreate,
  mockPaymentIntentsRetrieve,
  mockCreateOrder,
  mockValidateShippingAddress,
  mockCookiesGet,
  mockCookiesDelete,
  mockCookiesSet,
} = vi.hoisted(() => ({
  mockPayloadFind: vi.fn(),
  mockPayloadUpdate: vi.fn(),
  mockPayloadCreate: vi.fn(),
  mockPaymentIntentsRetrieve: vi.fn(),
  mockCreateOrder: vi.fn(),
  mockValidateShippingAddress: vi.fn(),
  mockCookiesGet: vi.fn(),
  mockCookiesDelete: vi.fn(),
  mockCookiesSet: vi.fn(),
}));

vi.mock("@payload-config", () => ({ default: {} }));

vi.mock("payload", () => ({
  getPayload: vi.fn(() =>
    Promise.resolve({
      find: mockPayloadFind,
      update: mockPayloadUpdate,
      create: mockPayloadCreate,
    })
  ),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    paymentIntents: { retrieve: mockPaymentIntentsRetrieve },
  })),
}));

vi.mock("@/lib/orders/create-order", () => ({
  createOrder: mockCreateOrder,
  confirmOrder: vi.fn().mockResolvedValue({ id: "order-1", status: "confirmed" }),
}));

vi.mock("@/lib/email/send-order-confirmation", () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/inventory/deduct-stock", () => ({
  deductStock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/shipping/validation", () => ({
  validateShippingAddress: mockValidateShippingAddress,
}));

vi.mock("@/lib/stores", () => ({
  stores: {
    "cool-cards-phoenix": "Cool Cards Phoenix",
    "organic": "Organic",
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: mockCookiesGet,
      delete: mockCookiesDelete,
      set: mockCookiesSet,
    })
  ),
}));

import { POST } from "@/app/api/checkout/stripe/confirm-order/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_PI_ID = "pi_3OqTesting12345678";

const validItems = [
  { productId: "prod-1", name: "Charizard Binder", price: 2500, quantity: 1 },
];

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/checkout/stripe/confirm-order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validAddress = {
  fullName: "Test User",
  line1: "123 Main St",
  city: "Phoenix",
  state: "AZ",
  postalCode: "85001",
  country: "US" as const,
};

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();

  // Default: no existing order
  mockPayloadFind.mockResolvedValue({ docs: [] });
  mockPayloadUpdate.mockResolvedValue({});
  mockPayloadCreate.mockResolvedValue({
    id: "order-new",
    customerEmail: "ash@pallet.town",
    items: validItems,
    total: 2500,
    shippingAddress: validAddress,
    paymentMethod: "stripe",
    paymentId: VALID_PI_ID,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Default PI: succeeded with matching amount
  mockPaymentIntentsRetrieve.mockResolvedValue({
    id: VALID_PI_ID,
    status: "succeeded",
    amount: 2500,
    receipt_email: "ash@pallet.town",
    metadata: {},
  });

  // Default: valid shipping address
  mockValidateShippingAddress.mockReturnValue({
    success: true,
    data: validAddress,
  });

  // Default: createOrder returns a well-formed order
  mockCreateOrder.mockResolvedValue({
    id: "order-new",
    customerEmail: "ash@pallet.town",
    items: validItems,
    total: 2500,
    shippingAddress: validAddress,
    paymentMethod: "stripe",
    paymentId: VALID_PI_ID,
    storeRef: "organic",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Default: no store_ref cookie
  mockCookiesGet.mockReturnValue(undefined);
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

describe("POST /api/checkout/stripe/confirm-order — input validation", () => {
  it("returns 400 for missing paymentIntentId", async () => {
    const res = await POST(
      makeRequest({ items: validItems, totalCents: 2500, customerEmail: "a@b.com" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid payment intent/i);
  });

  it("returns 400 for malformed paymentIntentId", async () => {
    const res = await POST(
      makeRequest({ paymentIntentId: "bad-id", items: validItems, totalCents: 2500 })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid payment intent/i);
  });

  it("returns 400 for missing items", async () => {
    const res = await POST(
      makeRequest({ paymentIntentId: VALID_PI_ID, items: [], totalCents: 2500 })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/missing order items/i);
  });

  it("returns 400 for totalCents below minimum", async () => {
    const res = await POST(
      makeRequest({ paymentIntentId: VALID_PI_ID, items: validItems, totalCents: 10 })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid order total/i);
  });

  it("returns 400 when PI is not succeeded", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({
      id: VALID_PI_ID,
      status: "requires_payment_method",
      amount: 2500,
      metadata: {},
    });
    const res = await POST(
      makeRequest({ paymentIntentId: VALID_PI_ID, items: validItems, totalCents: 2500 })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/not been completed/i);
  });

  it("returns 400 when PI amount does not match totalCents", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({
      id: VALID_PI_ID,
      status: "succeeded",
      amount: 9999,
      metadata: {},
    });
    const res = await POST(
      makeRequest({ paymentIntentId: VALID_PI_ID, items: validItems, totalCents: 2500 })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/mismatch/i);
  });
});

// ---------------------------------------------------------------------------
// T1: Happy path
// ---------------------------------------------------------------------------

describe("POST /api/checkout/stripe/confirm-order — T1 happy path", () => {
  it("creates order and returns COMPLETED with orderId", async () => {
    mockCookiesGet.mockReturnValue(undefined);

    const res = await POST(
      makeRequest({
        paymentIntentId: VALID_PI_ID,
        items: validItems,
        totalCents: 2500,
        customerEmail: "ash@pallet.town",
        shippingAddress: validAddress,
      })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("COMPLETED");
    expect(json.orderId).toBe("order-new");
    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customerEmail: "ash@pallet.town",
        paymentMethod: "stripe",
        paymentId: VALID_PI_ID,
        total: 2500,
      })
    );
  });
});

// ---------------------------------------------------------------------------
// T2: Idempotency — existing order with items
// ---------------------------------------------------------------------------

describe("POST /api/checkout/stripe/confirm-order — T2 idempotency", () => {
  it("returns duplicate:true and does NOT call createOrder when order already exists with items", async () => {
    mockPayloadFind.mockResolvedValue({
      docs: [
        {
          id: "existing-order",
          status: "confirmed",
          items: validItems,
        },
      ],
    });

    const res = await POST(
      makeRequest({
        paymentIntentId: VALID_PI_ID,
        items: validItems,
        totalCents: 2500,
        customerEmail: "ash@pallet.town",
        shippingAddress: validAddress,
      })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.duplicate).toBe(true);
    expect(json.orderId).toBe("existing-order");
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// T10: Attribution — PI metadata takes priority over cookie
// ---------------------------------------------------------------------------

describe("POST /api/checkout/stripe/confirm-order — T10 PI metadata attribution priority", () => {
  it("uses PI metadata store_ref over cookie value", async () => {
    // PI metadata says cool-cards-phoenix; cookie has something different
    mockPaymentIntentsRetrieve.mockResolvedValue({
      id: VALID_PI_ID,
      status: "succeeded",
      amount: 2500,
      metadata: { store_ref: "cool-cards-phoenix" },
    });
    mockCookiesGet.mockImplementation((name: string) =>
      name === "store_ref" ? { value: "organic" } : undefined
    );

    await POST(
      makeRequest({
        paymentIntentId: VALID_PI_ID,
        items: validItems,
        totalCents: 2500,
        customerEmail: "ash@pallet.town",
        shippingAddress: validAddress,
      })
    );

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ storeRef: "cool-cards-phoenix" })
    );
  });
});

// ---------------------------------------------------------------------------
// T11: Unregistered slug falls back to "organic"
// ---------------------------------------------------------------------------

describe("POST /api/checkout/stripe/confirm-order — T11 unregistered slug fallback", () => {
  it("falls back to 'organic' storeRef when PI metadata has an unregistered slug", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({
      id: VALID_PI_ID,
      status: "succeeded",
      amount: 2500,
      metadata: { store_ref: "nonexistent-store" },
    });

    await POST(
      makeRequest({
        paymentIntentId: VALID_PI_ID,
        items: validItems,
        totalCents: 2500,
        customerEmail: "ash@pallet.town",
        shippingAddress: validAddress,
      })
    );

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ storeRef: "organic" })
    );
  });
});

// ---------------------------------------------------------------------------
// Backfill: existing order with empty items gets backfilled
// ---------------------------------------------------------------------------

describe("POST /api/checkout/stripe/confirm-order — backfill empty items", () => {
  it("calls payload.update to backfill items when existing order has empty items array", async () => {
    const { deductStock } = await import("@/lib/inventory/deduct-stock");

    mockPayloadFind.mockResolvedValue({
      docs: [
        {
          id: "fallback-order",
          status: "pending",
          items: [],
        },
      ],
    });

    const res = await POST(
      makeRequest({
        paymentIntentId: VALID_PI_ID,
        items: validItems,
        totalCents: 2500,
        customerEmail: "ash@pallet.town",
        shippingAddress: validAddress,
      })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.duplicate).toBe(true);
    expect(json.orderId).toBe("fallback-order");

    expect(mockPayloadUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "orders",
        id: "fallback-order",
        data: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ productId: "prod-1" }),
          ]),
        }),
      })
    );

    expect(deductStock).toHaveBeenCalled();
  });

  it("calls payload.update to backfill when existing order has null items", async () => {
    mockPayloadFind.mockResolvedValue({
      docs: [
        {
          id: "null-items-order",
          status: "pending",
          items: null,
        },
      ],
    });

    await POST(
      makeRequest({
        paymentIntentId: VALID_PI_ID,
        items: validItems,
        totalCents: 2500,
        customerEmail: "ash@pallet.town",
        shippingAddress: validAddress,
      })
    );

    expect(mockPayloadUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "null-items-order" })
    );
  });
});
