import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts, formatPrice } from "@/lib/products";
import AddToCartButton from "@/components/products/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryLabel: Record<string, string> = {
  "engraved-binder": "Engraved Binder",
  "engraving-only": "Engraving Service",
};

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-brand-muted mb-10">
        <Link href="/" className="hover:text-brand-text transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-brand-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image placeholder */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl border border-white/5 aspect-square flex items-center justify-center">
          <svg
            className="w-40 h-40 text-white/10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
          </svg>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span className="text-xs text-brand-muted uppercase tracking-widest font-medium">
                {categoryLabel[product.category] ?? product.category}
              </span>
              {product.featured && (
                <span className="bg-brand-red/10 border border-brand-red/40 text-brand-red text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              {/* xTool badge */}
              <span className="bg-brand-purple/10 border border-brand-purple/40 text-brand-purple text-xs font-semibold px-2.5 py-0.5 rounded-full">
                xTool Laser Engraved
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-text leading-tight">
              {product.name}
            </h1>
          </div>

          <p className="font-display text-4xl font-black text-brand-gold">
            {formatPrice(product.price)}
          </p>

          <p className="text-brand-muted text-base leading-relaxed">
            {product.description}
          </p>

          {/* Metadata rows */}
          {(product.pokemon || product.binderType) && (
            <div className="bg-brand-card border border-white/5 rounded-xl p-4 flex flex-col gap-2.5 text-sm">
              {product.pokemon && (
                <div className="flex justify-between">
                  <span className="text-brand-muted">Pokemon</span>
                  <span className="text-brand-text font-semibold">{product.pokemon}</span>
                </div>
              )}
              {product.binderType && (
                <div className="flex justify-between">
                  <span className="text-brand-muted">Binder Type</span>
                  <span className="text-brand-text font-semibold">{product.binderType}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-muted">Engraving Method</span>
                <span className="text-brand-text font-semibold">xTool Laser</span>
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                product.stock === 0
                  ? "bg-red-500"
                  : product.stock > 0 && product.stock <= 10
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <span className="text-brand-muted">
              {product.stock === -1
                ? "Available"
                : product.stock === 0
                ? "Out of stock"
                : product.stock <= 10
                ? `Only ${product.stock} left`
                : "In stock"}
            </span>
          </div>

          {/* Add to cart */}
          <div className="max-w-xs">
            <AddToCartButton product={product} />
          </div>

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text text-sm transition-colors mt-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
