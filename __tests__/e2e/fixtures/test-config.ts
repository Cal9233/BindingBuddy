/**
 * E2E Test Configuration — Checkout Flow
 *
 * Contains test credentials and fixture data for Playwright + PayPal MCP tests.
 * All values are sandbox/test-mode only.
 */

export const TEST_CONFIG = {
  baseUrl: "http://localhost:3000",

  // PayPal sandbox buyer account
  paypal: {
    buyerEmail: "sb-dhtmq50049387@personal.example.com",
    buyerPassword: "+h,IDK-9",
  },

  // Stripe test cards
  stripe: {
    success: { number: "4242424242424242", exp: "12/28", cvc: "123" },
    decline: { number: "4000000000000002", exp: "12/28", cvc: "123" },
    insufficientFunds: { number: "4000000000009995", exp: "12/28", cvc: "123" },
    threeDSecure: { number: "4000000000003220", exp: "12/28", cvc: "123" },
    processingError: { number: "4000000000000119", exp: "12/28", cvc: "123" },
  },

  // Test customer data
  customer: {
    fullName: "Test Checkout User",
    email: "test-checkout@genthrust-test.com",
    line1: "123 Test Street",
    city: "Doral",
    state: "FL",
    postalCode: "33166",
    country: "US" as const,
  },

  // Timeouts for flaky sandbox interactions
  timeouts: {
    paypalPopup: 15_000,
    paypalPopupRetries: 3,
    stripeIframe: 10_000,
    pageNavigation: 10_000,
    apiResponse: 10_000,
  },
} as const;
