export function TrustBadges() {
  return (
    <div className="flex flex-col gap-2.5 mt-4 p-4 bg-poke-card/50 rounded-lg border border-poke-border">
      <div className="flex items-center gap-2 text-sm text-poke-muted">
        {/* Lock icon */}
        <svg
          className="w-4 h-4 text-green-500 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <span>Secured by Stripe &mdash; 256-bit SSL encryption</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-poke-muted">
        {/* Shield icon */}
        <svg
          className="w-4 h-4 text-poke-gold shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span>Your card details never touch our servers</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-poke-muted">
        {/* Refresh / guarantee icon */}
        <svg
          className="w-4 h-4 text-poke-blue shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span>100% satisfaction guarantee</span>
      </div>
    </div>
  );
}
