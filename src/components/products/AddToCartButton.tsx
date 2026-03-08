"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  compact?: boolean;
}

export default function AddToCartButton({ product, compact = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`font-display flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
          added
            ? "bg-green-500 text-white"
            : "bg-brand-gold text-brand-bg hover:opacity-90"
        }`}
      >
        {added ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Added
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`font-display w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-200 ${
        added
          ? "bg-green-500 text-white"
          : "bg-brand-gold text-brand-bg hover:opacity-90 active:scale-95"
      }`}
    >
      {added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
