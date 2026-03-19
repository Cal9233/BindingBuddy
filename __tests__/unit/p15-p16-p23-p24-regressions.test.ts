/**
 * p15-p16-p23-p24-regressions.test.ts
 *
 * Adversarial regression tests for the P15, P16, P23, P24 optimization pass.
 * These tests are intentionally designed to BREAK if the implementation
 * reverts or regresses.
 *
 * P15 — PayPalScriptProvider hoisted to checkout layout
 * P16 — Stripe client memoized at module level
 * P23 — ProductCard wrapped in React.memo
 * P24 — framer-motion lazy-loaded in PageTransition and Hero
 *
 * NOTE: This suite runs under vitest (not jest). The project's test runner
 * is configured for vitest. Jest is invoked via the npm test script but
 * resolves to vitest.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const root = path.resolve(__dirname, "../..");

function readSrc(relPath: string): string {
  return fs.readFileSync(path.join(root, "src", relPath), "utf-8");
}

// ---------------------------------------------------------------------------
// P15 — PayPalScriptProvider must NOT appear in checkout/page.tsx
// ---------------------------------------------------------------------------
describe("P15: PayPalScriptProvider hoisted to layout", () => {
  it("checkout/page.tsx does not import PayPalScriptProvider via an import statement", () => {
    const source = readSrc("app/(frontend)/checkout/page.tsx");
    // Comments referencing PayPalScriptProvider are fine — what must not exist
    // is an import statement that pulls in the provider directly.
    expect(source).not.toMatch(/import\s*\{[^}]*PayPalScriptProvider[^}]*\}/);
  });

  it("checkout/page.tsx does not import from @paypal/react-paypal-js", () => {
    const source = readSrc("app/(frontend)/checkout/page.tsx");
    expect(source).not.toMatch(/from\s*["']@paypal\/react-paypal-js["']/);
  });

  it("checkout/layout.tsx imports PayPalProvider", () => {
    const source = readSrc("app/(frontend)/checkout/layout.tsx");
    expect(source).toContain("PayPalProvider");
  });

  it("checkout/layout.tsx wraps children with PayPalProvider (not a bare fragment)", () => {
    const source = readSrc("app/(frontend)/checkout/layout.tsx");
    // Must not be a pass-through fragment — provider must wrap children
    expect(source).not.toMatch(/<>\s*\{children\}\s*<\/>/);
    expect(source).toContain("<PayPalProvider>");
  });

  it("PayPalProvider.tsx exists and exports a default function", () => {
    const source = readSrc("components/checkout/PayPalProvider.tsx");
    expect(source).toContain("export default function PayPalProvider");
  });

  it("PayPalProvider.tsx is a client component", () => {
    const source = readSrc("components/checkout/PayPalProvider.tsx");
    expect(source).toMatch(/^"use client"/);
  });

  it("PayPalProvider.tsx uses PayPalScriptProvider from @paypal/react-paypal-js", () => {
    const source = readSrc("components/checkout/PayPalProvider.tsx");
    expect(source).toContain("PayPalScriptProvider");
    expect(source).toContain("@paypal/react-paypal-js");
  });

  it("PayPalProvider.tsx does not use 'as any' for config (R6: no untyped session)", () => {
    const source = readSrc("components/checkout/PayPalProvider.tsx");
    expect(source).not.toContain("as any");
  });
});

// ---------------------------------------------------------------------------
// P16 — Stripe client must be a module-level constant, not inline in JSX
// ---------------------------------------------------------------------------
describe("P16: Stripe client memoized at module level", () => {
  it("checkout/page.tsx declares stripePromise at module level (outside function bodies)", () => {
    const source = readSrc("app/(frontend)/checkout/page.tsx");
    // The const must appear before the first `export default function` or
    // `function CheckoutPage` declaration.
    const constIdx = source.indexOf("const stripePromise");
    const funcIdx = source.indexOf("export default function");
    expect(constIdx).toBeGreaterThan(-1);
    expect(constIdx).toBeLessThan(funcIdx);
  });

  it("checkout/page.tsx calls getStripeClient() exactly once at module level", () => {
    const source = readSrc("app/(frontend)/checkout/page.tsx");
    const occurrences = (source.match(/getStripeClient\(\)/g) || []).length;
    expect(occurrences).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// P23 — ProductCard must be wrapped in React.memo
// ---------------------------------------------------------------------------
describe("P23: ProductCard memoized", () => {
  it("ProductCard.tsx imports memo from react", () => {
    const source = readSrc("components/ui/ProductCard.tsx");
    expect(source).toMatch(/import\s*\{[^}]*\bmemo\b[^}]*\}\s*from\s*["']react["']/);
  });

  it("ProductCard.tsx default export is wrapped in memo()", () => {
    const source = readSrc("components/ui/ProductCard.tsx");
    expect(source).toMatch(/export default memo\(/);
  });

  it("ProductCard.tsx does not export the un-memoized component as default", () => {
    const source = readSrc("components/ui/ProductCard.tsx");
    // Should not see `export default ProductCard` without memo wrapping
    expect(source).not.toMatch(/export default ProductCard\s*;/);
  });
});

// ---------------------------------------------------------------------------
// P24 — framer-motion must be lazy-loaded in PageTransition and Hero
// ---------------------------------------------------------------------------
describe("P24: framer-motion lazy-loaded", () => {
  it("PageTransition.tsx uses next/dynamic to lazy-load framer-motion", () => {
    const source = readSrc("components/layout/PageTransition.tsx");
    expect(source).toContain("next/dynamic");
    expect(source).toContain("framer-motion");
  });

  it("PageTransition.tsx does NOT import motion directly at the top level", () => {
    const source = readSrc("components/layout/PageTransition.tsx");
    // A direct top-level import would look like: import { motion } from "framer-motion"
    // It must not appear outside a dynamic() callback
    expect(source).not.toMatch(/^import\s*\{[^}]*motion[^}]*\}\s*from\s*["']framer-motion["']/m);
  });

  it("PageTransition.tsx dynamic import loads framer-motion inside the callback", () => {
    const source = readSrc("components/layout/PageTransition.tsx");
    // The import("framer-motion") call must be inside a dynamic() argument
    expect(source).toMatch(/dynamic\s*\(/);
    expect(source).toMatch(/import\s*\(\s*["']framer-motion["']\s*\)/);
  });

  it("Hero.tsx uses next/dynamic to lazy-load framer-motion", () => {
    const source = readSrc("components/sections/Hero.tsx");
    expect(source).toContain("next/dynamic");
    expect(source).toContain("framer-motion");
  });

  it("Hero.tsx does NOT import motion directly at the top level", () => {
    const source = readSrc("components/sections/Hero.tsx");
    expect(source).not.toMatch(/^import\s*\{[^}]*motion[^}]*\}\s*from\s*["']framer-motion["']/m);
  });

  it("Hero.tsx dynamic import loads framer-motion inside the callback", () => {
    const source = readSrc("components/sections/Hero.tsx");
    expect(source).toMatch(/dynamic\s*\(/);
    expect(source).toMatch(/import\s*\(\s*["']framer-motion["']\s*\)/);
  });

  it("Hero.tsx includes a non-empty loading fallback (R7: no empty layout shift)", () => {
    const source = readSrc("components/sections/Hero.tsx");
    // loading: () => null is acceptable for PageTransition (enhancement-only)
    // but Hero must have a placeholder div to prevent layout shift
    expect(source).toMatch(/loading:\s*\(\)\s*=>\s*\(/);
  });

  it("PageTransition.tsx maintains children pass-through in the animated wrapper", () => {
    const source = readSrc("components/layout/PageTransition.tsx");
    // The inner component must render {children}
    expect(source).toContain("{children}");
  });
});
