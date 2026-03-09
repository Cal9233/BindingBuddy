import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About – Binding Buddy",
  description:
    "Learn about Binding Buddy — custom laser-engraved Pokemon binders made with xTool precision.",
};

const values = [
  {
    title: "Precision",
    description:
      "Every binder is engraved with an xTool laser machine, delivering clean, detailed linework that holds up over time.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "Made to Order",
    description:
      "Nothing is mass-produced. Every piece is crafted when you order, ensuring quality and attention to detail.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        />
      </svg>
    ),
  },
  {
    title: "By Collectors",
    description:
      "We're Pokemon TCG collectors ourselves. We know what matters: card protection, clean aesthetics, and premium feel.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block bg-poke-blue/10 border border-poke-blue/30 text-poke-blue text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          Our Story
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-poke-text tracking-tight mb-5">
          Built for Collectors,{" "}
          <span className="text-poke-yellow">by Collectors</span>
        </h1>
        <p className="text-poke-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Binding Buddy started from a simple idea: Pokemon card binders should
          look as good as the cards inside them. We use xTool laser technology to
          engrave stunning Pokemon designs onto premium binder covers — one piece
          at a time.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {values.map((v) => (
          <div
            key={v.title}
            className="bg-poke-card border border-poke-border rounded-2xl p-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-poke-blue/10 border border-poke-blue/20 text-poke-blue mb-4">
              {v.icon}
            </div>
            <h3 className="font-display font-bold text-poke-text text-base mb-2">
              {v.title}
            </h3>
            <p className="text-poke-muted text-sm leading-relaxed">
              {v.description}
            </p>
          </div>
        ))}
      </div>

      {/* Process */}
      <div className="bg-poke-card border border-poke-border rounded-2xl p-8 mb-16">
        <h2 className="font-display text-2xl font-bold text-poke-text tracking-tight mb-4">
          The Process
        </h2>
        <div className="space-y-4 text-poke-muted text-sm leading-relaxed">
          <p>
            Every binder starts as a clean, premium leatherette cover. We take
            your chosen design — whether from our library or your custom
            submission — and optimize it for laser output.
          </p>
          <p>
            The design is then loaded into our xTool laser machine, which
            engraves the artwork directly into the cover material. The result is
            a permanent, tactile design that won&apos;t peel, fade, or wear off.
          </p>
          <p>
            After engraving, each binder is inspected for quality, cleaned, and
            carefully packaged for shipping. Most orders ship within 3–5 business
            days.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-poke-text mb-4">
          Ready to see the collection?
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/products" variant="primary">
            Browse Products
          </Button>
          <Button href="/contact" variant="secondary">
            Request a Custom Design
          </Button>
        </div>
      </div>
    </div>
  );
}
