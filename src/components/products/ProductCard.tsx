import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";

interface Props {
  product: Product;
}

const categoryLabel: Record<Product["category"], string> = {
  "engraved-binder": "Engraved Binder",
  "engraving-only": "Engraving Service",
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="group flex flex-col bg-brand-card rounded-2xl overflow-hidden border border-white/5 hover:border-brand-purple/40 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/10">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <div className="relative h-56 bg-gradient-to-br from-white/5 to-white/[0.03] flex items-center justify-center">
          <svg
            className="w-24 h-24 text-white/10 group-hover:text-brand-gold/20 transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
          </svg>
          {product.featured && (
            <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-brand-muted uppercase tracking-widest font-medium">
              {categoryLabel[product.category]}
            </span>
            {product.pokemon && (
              <span className="text-xs text-brand-red font-semibold">
                · {product.pokemon}
              </span>
            )}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-brand-text font-bold text-base mt-1.5 leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-brand-muted text-sm line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-white/5">
          <span className="font-display text-brand-gold font-black text-xl">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </div>
  );
}
