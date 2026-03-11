"use client";

export type PaymentMethod = "card" | "paypal";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const tabs: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  {
    id: "card",
    label: "Credit Card",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.737A.859.859 0 015.79 2h6.857c2.276 0 3.88.456 4.766 1.353.39.396.653.84.793 1.322.151.515.178 1.13.081 1.876l-.012.076v.668l.52.298c.44.22.79.482 1.054.787.314.365.52.814.612 1.337.096.543.076 1.19-.06 1.923-.159.859-.415 1.607-.765 2.22a4.56 4.56 0 01-1.197 1.467c-.488.39-1.068.683-1.724.873-.636.184-1.36.277-2.153.277h-.512a1.544 1.544 0 00-1.528 1.306l-.038.222-.648 4.108-.03.163a.15.15 0 01-.148.128H7.076z" />
      </svg>
    ),
  },
];

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-sm transition-all duration-200 border ${
            selected === tab.id
              ? "bg-poke-blue/10 border-poke-blue text-poke-text"
              : "bg-poke-card border-poke-border text-poke-muted hover:border-poke-blue/30 hover:text-poke-text"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
