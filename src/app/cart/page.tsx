"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <svg
          className="w-20 h-20 text-brand-muted/30 mx-auto mb-6"
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
        <h1 className="font-display text-3xl font-black text-brand-text mb-3">Your cart is empty</h1>
        <p className="text-brand-muted mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/"
          className="font-display bg-brand-gold text-brand-bg font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-black text-brand-text mb-10">
        Your Cart{" "}
        <span className="text-brand-muted font-normal text-xl">
          ({totalItems} {totalItems === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-5 bg-brand-card border border-white/5 rounded-2xl p-5"
            >
              {/* Placeholder image */}
              <div className="w-20 h-20 bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white/10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-brand-text font-semibold text-sm leading-snug mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="font-display text-brand-gold font-bold text-base">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                {/* Qty control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQty(item.productId, item.quantity - 1)
                        : removeItem(item.productId)
                    }
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-brand-text flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-brand-text font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-brand-text flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-brand-muted/50 hover:text-brand-red text-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-card border border-white/5 rounded-2xl p-6 sticky top-20">
            <h2 className="font-display text-brand-text font-black text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm text-brand-muted mb-5">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-brand-text">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between text-brand-text font-black text-lg">
                <span className="font-display">Total</span>
                <span className="font-display text-brand-gold">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="font-display block w-full bg-brand-gold text-brand-bg font-bold text-center py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="block text-center text-brand-muted hover:text-brand-text text-sm mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
