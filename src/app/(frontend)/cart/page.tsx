"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, useTotalItems, useTotalPrice } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format-price";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <svg
          className="w-20 h-20 text-poke-muted/30 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="font-display text-3xl font-bold text-poke-text mb-3">
          Your cart is empty
        </h1>
        <p className="text-poke-muted mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button href="/" variant="primary">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-poke-text mb-10">
        Your Cart{" "}
        <span className="text-poke-muted font-normal text-xl">
          ({totalItems} {totalItems === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-wrap gap-4 sm:gap-5 bg-poke-card border border-poke-border rounded-2xl p-4 sm:p-5"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-poke-text font-semibold text-sm leading-snug mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="font-display text-poke-yellow font-bold text-base">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-col sm:items-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQty(item.productId, item.quantity - 1)
                        : removeItem(item.productId)
                    }
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-poke-text flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    &minus;
                  </button>
                  <span className="w-6 text-center text-poke-text font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-poke-text flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-poke-muted hover:text-red-400 text-xs transition-colors ml-auto sm:ml-0"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-poke-card border border-poke-border rounded-2xl p-6 sticky top-20">
            <h2 className="font-display text-poke-text font-bold text-lg mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-poke-muted mb-5">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-poke-text">
                  {formatPrice(totalPrice)}
                </span>
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

            <Button
              href="/checkout"
              variant="primary"
              className="w-full justify-center py-4"
            >
              Proceed to Checkout
            </Button>

            <Link
              href="/"
              className="block text-center text-poke-muted hover:text-poke-text text-sm mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
