import { notFound } from "next/navigation";
import { stores, getStoreName } from "@/lib/stores";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!stores[slug]) return {};
  const name = getStoreName(slug);
  return {
    title: `Welcome from ${name} | Binding Buddy`,
    description: `Shop laser-engraved Pokemon binder covers — referred by ${name}.`,
  };
}

export default async function StoreRefPage({ params }: Props) {
  const { slug } = await params;

  if (!stores[slug]) {
    notFound();
  }

  const name = getStoreName(slug);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        <span className="inline-block bg-poke-blue/10 border border-poke-blue/30 text-poke-blue text-xs font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
          Partner Store
        </span>

        <h1 className="font-display text-4xl font-bold text-poke-text mb-3">
          Welcome from {name}!
        </h1>

        <p className="text-poke-muted mb-10 leading-relaxed">
          Thanks for visiting through our partner. Browse our collection of
          laser-engraved Pokemon binder covers and find your perfect match.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/products" variant="primary">
            Shop All Products
          </Button>
          <Button href="/#featured" variant="secondary">
            Featured Picks
          </Button>
        </div>
      </div>
    </div>
  );
}
