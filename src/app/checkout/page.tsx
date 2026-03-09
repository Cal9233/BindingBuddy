"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore, useTotalItems, useTotalPrice } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="h-8 w-48 bg-poke-card rounded-xl animate-pulse mx-auto" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    if (success) {
      clearCart();
    }
  }, [success, clearCart]);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (!data.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-poke-text mb-3">
          Thank You!
        </h1>
        <p className="text-poke-muted mb-8">
          Your order has been placed. We&apos;ll start engraving right away.
          Check your email for a confirmation.
        </p>
        <Button href="/" variant="primary">
          Back to Shop
        </Button>
      </div>
    );
  }

  if (canceled) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-poke-text mb-3">
          Checkout Canceled
        </h1>
        <p className="text-poke-muted mb-8">
          Your order was not completed. Your cart items are still saved.
        </p>
        <Button href="/cart" variant="primary">
          Return to Cart
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-poke-text mb-4">
          Nothing to checkout
        </h1>
        <Button href="/" variant="primary">
          Go to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-poke-text mb-10">
        Checkout
      </h1>

      <div className="bg-poke-card border border-poke-border rounded-2xl p-6 mb-6">
        <h2 className="font-display text-poke-text font-bold text-lg mb-5">
          Order Summary
        </h2>

        <div className="space-y-3 mb-5">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm gap-2"
            >
              <span className="text-poke-muted line-clamp-1 flex-1">
                {item.name}{" "}
                <span className="text-poke-muted/50">
                  &times;{item.quantity}
                </span>
              </span>
              <span className="text-poke-text flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 text-sm text-poke-muted border-t border-poke-border pt-4 mb-5">
          <div className="flex justify-between">
            <span>Subtotal ({totalItems} items)</span>
            <span className="text-poke-text">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-400">Free</span>
          </div>
        </div>

        <div className="border-t border-poke-border pt-4 mb-6">
          <div className="flex justify-between text-poke-text font-bold text-lg">
            <span className="font-display">Total</span>
            <span className="font-display text-poke-yellow">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <Button
          onClick={handleCheckout}
          disabled={loading}
          variant="primary"
          className="w-full justify-center py-4"
        >
          {loading ? "Redirecting to Stripe..." : "Pay with Stripe"}
        </Button>

        <Link
          href="/cart"
          className="block text-center text-poke-muted hover:text-poke-text text-sm mt-4 transition-colors"
        >
          &larr; Edit Cart
        </Link>
      </div>
    </div>
  );
}
