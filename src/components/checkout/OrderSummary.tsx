"use client";

import { type CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format-price";

interface OrderSummaryProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export default function OrderSummary({
  items,
  totalItems,
  totalPrice,
}: OrderSummaryProps) {
  return (
    <div className="bg-poke-card border border-poke-border rounded-2xl p-6">
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

      <div className="border-t border-poke-border pt-4">
        <div className="flex justify-between text-poke-text font-bold text-lg">
          <span className="font-display">Total</span>
          <span className="font-display text-poke-yellow">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
