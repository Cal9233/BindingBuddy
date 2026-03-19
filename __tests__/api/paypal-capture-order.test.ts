/**
 * paypal-capture-order.test.ts
 *
 * Unit tests for POST /api/checkout/paypal/capture-order
 * Uses real crypto for HMAC signing. PayPal API calls are mocked via global fetch.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Mocks (must be declared before any imports of the route)
// vi.hoisted() ensures variables are initialized before vi.mock() factories run
// ---------------------------------------------------------------------------

const {
  mockPayloadFind,
  mockPayloadUpdate,
  mockPayloadCreate,
  mockCreateOrder,
  mockValidateShippingAddress,
  mockCookiesGet,
  mockCookiesDelete,
  mockCookiesSet,
} = vi.hoisted(() => ({
  mockPayloadFind: vi.fn(),
  mockPayloadUpdate: vi.fn(),
  mockPayloadCreate: vi.fn(),
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

vi.mock("@/lib/paypal", () => ({
  getPayPalApiBase: vi.fn(() => "https://api.sandbox.paypal.com"),
  getPayPalAccessToken: vi.fn(() => Promise.resolve("test-access-token")),
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
    "trainer-hub": "Trainer Hub",
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

import { POST } from "@/app/api/checkout/paypal/capture-order/route";

// ---------------------------------------------------------------------------
// Signing helpers (mirror the route's implementation)
// ---------------------------------------------------------------------------

const SECRET = "test-secret";

function signOrderId(orderId: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`paypal_order:${orderId}`)
    .digest("hex");
}

function createPendingCookie(data: object): string {
  const b64 = Buffer.from(JSON.stringify(data)).toString("base64");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(`pp_pending:${b64}`)
    .digest("hex");
  return `${b64}.${sig}`;
}

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

// PayPal order IDs must match /^[A-Z0-9]{17}$/
const VALID_ORDER_ID = "7XE897650X0792145";

const validAddress = {
  fullName: "Test User",
  line1: "123 Main St",
  city: "Phoenix",
  state: "AZ",
  postalCode: "85001",
  country: "US",
};

const validItems = [
  { productId: "prod-1", name: "Charizard Binder", price: 2500, quantity: 1 },
];

const defaultPendingOrderData = {
  items: validItems,
  customerEmail: "ash@pallet.town",
  shippingAddress: validAddress,
  storeRef: "cool-cards-phoenix",
  totalCents: 2500,
};

/** Build the PayPal capture success response body */
function buildCaptureResponse(opts: {
  status?: string;
  captureId?: string;
  amount?: string;
  customId?: string;
  buyerEmail?: string;
} = {}): object {
  return {
    status: opts.status ?? "COMPLETED",
    payer: { email_address: opts.buyerEmail ?? "ash@pallet.town" },
    purchase_units: [
      {
        custom_id: opts.customId ?? null,
        payments: {
          captures: [
            {
              id: opts.captureId ?? "capture-abc123",
              amount: { value: opts.amount ?? "25.00", currency_code: "USD" },
            },
          ],
        },
      },
    ],
  };
}

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/checkout/paypal/capture-order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();

  process.env.PAYPAL_SIGNING_SECRET = SECRET;

  // Default fetch: successful capture
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(buildCaptureResponse()),
    text: () => Promise.resolve(""),
  } as unknown as Response);

  // Default cookies: valid sig + valid pending order
  mockCookiesGet.mockImplementation((name: string) => {
    if (name === "pp_order_sig") {
      return { value: signOrderId(VALID_ORDER_ID) };
    }
    if (name === "pp_pending_order") {
      return { value: createPendingCookie(defaultPendingOrderData) };
    }
    return undefined;
  });

  // Default shipping validation
  mockValidateShippingAddress.mockReturnValue({
    success: true,
    data: validAddress,
  });

  // Default createOrder response
  mockCreateOrder.mockResolvedValue({
    id: "order-new",
    customerEmail: "ash@pallet.town",
    items: validItems,
    total: 2500,
    shippingAddress: validAddress,
    paymentMethod: "paypal",
    paymentId: VALID_ORDER_ID,
    storeRef: "cool-cards-phoenix",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — input validation", () => {
  it("returns 400 for missing orderId", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/missing orderId/i);
  });

  it("returns 400 for malformed orderId (wrong format)", async () => {
    const res = await POST(makeRequest({ orderId: "bad-id" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid order id format/i);
  });

  it("returns 400 for orderId that is too short", async () => {
    // Only 16 chars — must be exactly 17
    const res = await POST(makeRequest({ orderId: "7XE897650X079214" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid order id format/i);
  });
});

// ---------------------------------------------------------------------------
// T7: Cookie tampering — signature mismatch
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — T7 cookie tampering", () => {
  it("returns 400 when pp_order_sig does not match orderId HMAC", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "pp_order_sig") {
        return { value: "tampered-signature-that-does-not-match" };
      }
      if (name === "pp_pending_order") {
        return { value: createPendingCookie(defaultPendingOrderData) };
      }
      return undefined;
    });

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Order ID mismatch");
  });

  it("returns 400 when pp_order_sig cookie is absent", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "pp_pending_order") {
        return { value: createPendingCookie(defaultPendingOrderData) };
      }
      return undefined;
    });

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Order ID mismatch");
  });
});

// ---------------------------------------------------------------------------
// T8: Expired/missing pending order cookie
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — T8 expired cookie", () => {
  it("returns 400 when pp_pending_order cookie is absent", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "pp_order_sig") {
        return { value: signOrderId(VALID_ORDER_ID) };
      }
      return undefined;
    });

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/order session expired/i);
  });

  it("returns 400 when pp_pending_order cookie has invalid HMAC", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "pp_order_sig") {
        return { value: signOrderId(VALID_ORDER_ID) };
      }
      if (name === "pp_pending_order") {
        const b64 = Buffer.from(JSON.stringify(defaultPendingOrderData)).toString("base64");
        return { value: `${b64}.badsignature` };
      }
      return undefined;
    });

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/order session expired/i);
  });
});

// ---------------------------------------------------------------------------
// T6: Happy path
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — T6 happy path", () => {
  it("returns COMPLETED with captureId and orderId after successful capture", async () => {
    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("COMPLETED");
    expect(json.captureId).toBe("capture-abc123");
    expect(json.orderId).toBe("order-new");
    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentMethod: "paypal",
        paymentId: VALID_ORDER_ID,
        total: 2500,
      })
    );
  });

  it("deletes both cookies after successful order creation", async () => {
    await POST(makeRequest({ orderId: VALID_ORDER_ID }));

    expect(mockCookiesDelete).toHaveBeenCalledWith("pp_order_sig");
    expect(mockCookiesDelete).toHaveBeenCalledWith("pp_pending_order");
  });
});

// ---------------------------------------------------------------------------
// T9: Amount mismatch — logs error but still creates order
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — T9 amount mismatch", () => {
  it("still creates order when captured amount differs from totalCents", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Capture returns 30.00 but pending order expects 25.00
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(buildCaptureResponse({ amount: "30.00" })),
      text: () => Promise.resolve(""),
    } as unknown as Response);

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("COMPLETED");

    // Verify the mismatch was logged (single-argument console.error call in route)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Amount mismatch")
    );

    // Order is still created
    expect(mockCreateOrder).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// T12: custom_id attribution fallback
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — T12 custom_id attribution", () => {
  it("uses custom_id from capture response when pendingOrder.storeRef is empty", async () => {
    // Cookie has empty storeRef
    const pendingDataNoStore = { ...defaultPendingOrderData, storeRef: "" };
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "pp_order_sig") {
        return { value: signOrderId(VALID_ORDER_ID) };
      }
      if (name === "pp_pending_order") {
        return { value: createPendingCookie(pendingDataNoStore) };
      }
      return undefined;
    });

    // PayPal capture response includes custom_id: "trainer-hub"
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(buildCaptureResponse({ customId: "trainer-hub" })),
      text: () => Promise.resolve(""),
    } as unknown as Response);

    await POST(makeRequest({ orderId: VALID_ORDER_ID }));

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ storeRef: "trainer-hub" })
    );
  });

  it("falls back to 'organic' when custom_id is also unregistered", async () => {
    const pendingDataNoStore = { ...defaultPendingOrderData, storeRef: "" };
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "pp_order_sig") {
        return { value: signOrderId(VALID_ORDER_ID) };
      }
      if (name === "pp_pending_order") {
        return { value: createPendingCookie(pendingDataNoStore) };
      }
      return undefined;
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(buildCaptureResponse({ customId: "nonexistent-store" })),
      text: () => Promise.resolve(""),
    } as unknown as Response);

    await POST(makeRequest({ orderId: VALID_ORDER_ID }));

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ storeRef: "organic" })
    );
  });
});

// ---------------------------------------------------------------------------
// Cookie deletion timing
// ---------------------------------------------------------------------------

describe("POST /api/checkout/paypal/capture-order — cookie deletion timing", () => {
  it("does NOT delete cookies when order creation throws", async () => {
    mockCreateOrder.mockRejectedValue(new Error("DB write failed"));

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));

    // Still returns a response (critical path: money captured)
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.warning).toMatch(/being processed/i);

    // Cookies must NOT have been deleted since order creation failed
    expect(mockCookiesDelete).not.toHaveBeenCalled();
  });

  it("returns 500 when PayPal capture API fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve("PayPal error"),
    } as unknown as Response);

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/payment processing failed/i);
  });

  it("returns 500 when PayPal capture response status is not COMPLETED", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...buildCaptureResponse(), status: "PENDING" }),
      text: () => Promise.resolve(""),
    } as unknown as Response);

    const res = await POST(makeRequest({ orderId: VALID_ORDER_ID }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/payment processing failed/i);
  });
});
