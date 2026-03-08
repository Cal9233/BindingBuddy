"use client";

import { useEffect } from "react";
import { setReferral } from "@/lib/referral";

/**
 * Invisible component mounted in the root layout.
 * Reads ?ref= from the URL on first load and persists it silently.
 * If no ?ref= is present, any existing referral is preserved.
 */
export default function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && ref.trim()) {
      setReferral(ref.trim().toLowerCase());
    }
  }, []);

  return null;
}
