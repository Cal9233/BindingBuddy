"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { getReferral } from "@/lib/referral";
import { getStoreName } from "@/lib/stores";

const inputClass =
  "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-gold/40 transition-colors text-sm";

const labelClass =
  "block text-brand-muted text-xs font-semibold uppercase tracking-wider mb-1.5";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [referral, setReferralState] = useState<string | null>(null);

  useEffect(() => {
    setReferralState(getReferral());
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-black text-brand-text mb-4">Nothing to checkout</h1>
        <Link
          href="/"
          className="font-display bg-brand-gold text-brand-bg font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-black text-brand-text mb-3">Coming Soon!</h1>
        <p className="text-brand-muted mb-8">
          Payment processing isn&apos;t live yet — but your order would have gone through right here. Stay tuned!
        </p>
        <Link
          href="/"
          className="font-display bg-brand-gold text-brand-bg font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-black text-brand-text mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <section className="bg-brand-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display text-brand-text font-black text-lg mb-5">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" placeholder="Ash" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" placeholder="Ketchum" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email</label>
                <input type="email" placeholder="ash@pallettown.com" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-brand-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display text-brand-text font-black text-lg mb-5">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Street Address</label>
                <input type="text" placeholder="1 Trainer Road" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>City</label>
                  <input type="text" placeholder="Pallet Town" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" placeholder="CA" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ZIP</label>
                  <input type="text" placeholder="90210" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* Payment placeholder */}
          <section className="bg-brand-card border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-brand-text font-black text-lg">Payment</h2>
              <span className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-8 text-center">
              <svg className="w-10 h-10 text-brand-muted/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-brand-muted/40 text-sm">Payment integration coming soon</p>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-card border border-white/5 rounded-2xl p-6 sticky top-20">
            <h2 className="font-display text-brand-text font-black text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm gap-2">
                  <span className="text-brand-muted line-clamp-1 flex-1">
                    {item.name}{" "}
                    <span className="text-brand-muted/50">×{item.quantity}</span>
                  </span>
                  <span className="text-brand-text flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-brand-muted border-t border-white/5 pt-4 mb-5">
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

            {referral && (
              <div className="flex items-center gap-2 bg-brand-purple/5 border border-brand-purple/30 rounded-xl px-4 py-3 mb-2 text-sm">
                <svg className="w-4 h-4 text-brand-purple flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-brand-muted">Referred by</span>
                <span className="text-brand-purple font-semibold ml-1">{getStoreName(referral)}</span>
              </div>
            )}

            <button
              onClick={() => setSubmitted(true)}
              className="font-display w-full bg-brand-gold text-brand-bg font-bold py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Place Order
            </button>

            <Link
              href="/cart"
              className="block text-center text-brand-muted hover:text-brand-text text-sm mt-4 transition-colors"
            >
              ← Edit Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
