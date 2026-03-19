"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  currency: "USD" as const,
  intent: "capture" as const,
};

/**
 * PayPalProvider — hoisted to the checkout layout so the PayPal SDK (~150KB)
 * loads once and persists across tab switches inside the checkout route.
 *
 * When NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set (e.g. in local dev without
 * PayPal credentials) we skip the provider entirely so PayPalButtons can
 * render its own unconfigured-state UI without the SDK throwing.
 */
export default function PayPalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!paypalOptions.clientId) {
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
