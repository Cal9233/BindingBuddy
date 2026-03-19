"use client";

const steps = ["Cart", "Shipping", "Payment"] as const;

export function CheckoutProgress({ currentStep }: { currentStep: number }) {
  return (
    <nav
      aria-label="Checkout progress"
      className="flex items-center justify-center gap-1 sm:gap-2 py-4 mb-6"
    >
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1 sm:gap-2">
          <div
            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors
              ${i < currentStep ? "bg-green-600 text-white" : ""}
              ${i === currentStep ? "bg-poke-yellow text-poke-dark ring-2 ring-poke-yellow/30" : ""}
              ${i > currentStep ? "bg-poke-card text-poke-muted border border-poke-border" : ""}
            `}
            aria-current={i === currentStep ? "step" : undefined}
          >
            {i < currentStep ? "\u2713" : i + 1}
          </div>
          <span
            className={`text-xs sm:text-sm hidden sm:inline ${
              i === currentStep
                ? "font-semibold text-poke-text"
                : "text-poke-muted"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-4 sm:w-8 h-0.5 ${
                i < currentStep ? "bg-green-600" : "bg-poke-border"
              }`}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
