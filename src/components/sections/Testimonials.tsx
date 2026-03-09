const testimonials = [
  {
    quote:
      "The Charizard engraving on my binder is insanely detailed. Easily the best piece in my collection display.",
    author: "Alex R.",
    detail: "Competitive TCG Player",
  },
  {
    quote:
      "Ordered a custom Gengar design — the linework was perfect and it shipped way faster than I expected.",
    author: "Jordan M.",
    detail: "Pokemon Collector",
  },
  {
    quote:
      "I've bought three binders so far. The quality is consistent every single time. These guys know what they're doing.",
    author: "Sam T.",
    detail: "Repeat Customer",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-2xl font-bold text-poke-text tracking-tight mb-3">
          What Collectors Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="bg-poke-card border border-poke-border rounded-2xl p-6 flex flex-col"
          >
            <svg
              className="w-6 h-6 text-poke-gold/40 mb-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-poke-text text-sm leading-relaxed flex-1 mb-4">
              {t.quote}
            </p>
            <div>
              <p className="font-display font-bold text-poke-text text-sm">
                {t.author}
              </p>
              <p className="text-poke-muted text-xs">{t.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
