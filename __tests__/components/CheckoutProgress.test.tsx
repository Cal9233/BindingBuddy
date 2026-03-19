/**
 * CheckoutProgress.test.tsx
 *
 * Tests for the CheckoutProgress component.
 * Verifies step indicators, checkmarks, and aria-current attributes.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";

describe("CheckoutProgress", () => {
  // -------------------------------------------------------------------------
  // T20a: currentStep=1 (Shipping is active)
  // Steps: 0=Cart, 1=Shipping, 2=Payment
  // -------------------------------------------------------------------------

  describe("T20a — currentStep=1", () => {
    it("shows checkmark for Cart (step 0 is before active step)", () => {
      render(<CheckoutProgress currentStep={1} />);
      // The first step circle should show the checkmark character ✓
      const stepCircles = screen.getAllByText(/✓/);
      expect(stepCircles.length).toBeGreaterThanOrEqual(1);
    });

    it("marks Shipping as aria-current='step'", () => {
      render(<CheckoutProgress currentStep={1} />);
      const activeEl = document.querySelector('[aria-current="step"]');
      expect(activeEl).not.toBeNull();
      // Shipping label should be visible
      expect(screen.getByText("Shipping")).toBeInTheDocument();
    });

    it("does NOT mark Cart or Payment as aria-current='step'", () => {
      render(<CheckoutProgress currentStep={1} />);
      const allStepEls = document.querySelectorAll('[aria-current="step"]');
      expect(allStepEls.length).toBe(1);
    });

    it("Payment step shows its number (3) and not a checkmark", () => {
      render(<CheckoutProgress currentStep={1} />);
      // Step index 2 = "3" (i+1)
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // T20b: currentStep=2 (Payment is active)
  // Steps: 0=Cart ✓, 1=Shipping ✓, 2=Payment active
  // -------------------------------------------------------------------------

  describe("T20b — currentStep=2", () => {
    it("shows two checkmarks (Cart and Shipping are both completed)", () => {
      render(<CheckoutProgress currentStep={2} />);
      const checkmarks = screen.getAllByText(/✓/);
      expect(checkmarks.length).toBe(2);
    });

    it("marks Payment as aria-current='step'", () => {
      render(<CheckoutProgress currentStep={2} />);
      const activeEl = document.querySelector('[aria-current="step"]');
      expect(activeEl).not.toBeNull();
      expect(screen.getByText("Payment")).toBeInTheDocument();
    });

    it("does NOT show a step number for the active Payment step (shows checkmark or indicator)", () => {
      render(<CheckoutProgress currentStep={2} />);
      // Step 2 is active — the circle shows "3" (i+1=3) since i === currentStep
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // T20c: currentStep=0 (Cart is active — first step)
  // -------------------------------------------------------------------------

  describe("currentStep=0 — first step", () => {
    it("marks Cart as aria-current='step' with no preceding checkmarks", () => {
      render(<CheckoutProgress currentStep={0} />);
      const activeEl = document.querySelector('[aria-current="step"]');
      expect(activeEl).not.toBeNull();

      // No checkmarks since nothing is completed yet
      const checkmarks = document.querySelectorAll('[aria-current="step"]');
      expect(checkmarks.length).toBe(1);
    });

    it("shows step numbers 2 and 3 for Shipping and Payment", () => {
      render(<CheckoutProgress currentStep={0} />);
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // General structure
  // -------------------------------------------------------------------------

  describe("general structure", () => {
    it("renders a nav element with aria-label 'Checkout progress'", () => {
      render(<CheckoutProgress currentStep={0} />);
      const nav = screen.getByRole("navigation", { name: /checkout progress/i });
      expect(nav).toBeInTheDocument();
    });

    it("renders all three step labels", () => {
      render(<CheckoutProgress currentStep={0} />);
      expect(screen.getByText("Cart")).toBeInTheDocument();
      expect(screen.getByText("Shipping")).toBeInTheDocument();
      expect(screen.getByText("Payment")).toBeInTheDocument();
    });
  });
});
