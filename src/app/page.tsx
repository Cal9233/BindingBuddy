import Link from "next/link";
import { getProducts, getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const all = getProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-bg py-28 px-4 sm:px-6 lg:px-8">
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-gold opacity-5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-brand-purple opacity-5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-brand-red/10 border border-brand-red/40 text-brand-red text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            xTool Laser Engraved · Made to Order
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-brand-text leading-tight mb-6 tracking-tight">
            Your Pokemon.{" "}
            <span className="text-brand-gold">Engraved.</span>
          </h1>
          <p className="text-brand-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Custom laser-engraved Pokemon designs on binder covers, precision-cut
            with xTool. Every piece is made to order — built for collectors, by collectors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#all-products"
              className="font-display bg-brand-red text-white font-bold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity"
            >
              Shop All Designs
            </Link>
            <Link
              href="#featured"
              className="font-display bg-white/5 text-brand-text font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors border border-white/10 hover:border-brand-purple/40"
            >
              View Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-1 bg-brand-gold rounded-full" />
            <h2 className="font-display text-2xl font-bold text-brand-text">Featured Designs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All products */}
      <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-1 bg-brand-gold rounded-full" />
          <h2 className="font-display text-2xl font-bold text-brand-text">All Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {all.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-brand-card border-y border-white/5 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { icon: "⚡", label: "xTool Precision Laser" },
            { icon: "🎨", label: "Made to Order" },
            { icon: "🃏", label: "Fan-Made Designs" },
            { icon: "📦", label: "Ships in 3–5 Days" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-brand-muted text-sm font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
