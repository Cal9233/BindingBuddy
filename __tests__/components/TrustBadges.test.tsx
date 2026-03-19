/**
 * TrustBadges.test.tsx
 *
 * Tests that the TrustBadges component renders all three trust signals
 * with correct text and accessible SVG icons.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustBadges } from "@/components/checkout/TrustBadges";

describe("TrustBadges", () => {
  it("renders 'Secured by Stripe' text", () => {
    render(<TrustBadges />);
    expect(screen.getByText(/secured by stripe/i)).toBeInTheDocument();
  });

  it("renders 'card details never touch our servers' text", () => {
    render(<TrustBadges />);
    expect(
      screen.getByText(/card details never touch our servers/i)
    ).toBeInTheDocument();
  });

  it("renders 'satisfaction guarantee' text", () => {
    render(<TrustBadges />);
    expect(screen.getByText(/satisfaction guarantee/i)).toBeInTheDocument();
  });

  it("renders exactly 3 SVG icons with aria-hidden='true'", () => {
    const { container } = render(<TrustBadges />);
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs.length).toBe(3);
  });

  it("renders a containing div element", () => {
    const { container } = render(<TrustBadges />);
    // The component renders a div with flex layout
    const wrapper = container.firstElementChild;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.tagName.toLowerCase()).toBe("div");
  });

  it("all trust items are rendered in the document", () => {
    render(<TrustBadges />);
    // Verify we have 3 badge rows by finding all flex item divs containing text
    const textElements = [
      /secured by stripe/i,
      /card details never touch our servers/i,
      /satisfaction guarantee/i,
    ];
    for (const pattern of textElements) {
      expect(screen.getByText(pattern)).toBeInTheDocument();
    }
  });
});
