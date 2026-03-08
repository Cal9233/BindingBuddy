"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#080818]/90 backdrop-blur border-b border-white/5 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Binding Buddy TCG"
            width={56}
            height={56}
            className=""
            priority
          />
          <span className="font-display font-bold text-lg text-brand-text leading-tight">
            Binding<span className="text-brand-gold">Buddy</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-base font-medium text-brand-muted">
          <Link href="/" className="hover:text-brand-text transition-colors">
            Shop
          </Link>
          <Link href="/#featured" className="hover:text-brand-text transition-colors">
            Featured
          </Link>
          <Link href="/custom-order" className="hover:text-brand-text transition-colors">
            Custom Order
          </Link>
        </nav>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-colors"
          aria-label="Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-brand-gold text-brand-bg text-xs font-black rounded-full font-display">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
