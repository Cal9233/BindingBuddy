interface BadgeProps {
  label: string;
  className?: string;
}

const colorMap: Record<string, string> = {
  "Best Seller": "bg-poke-gold/15 border-poke-gold/40 text-poke-gold",
  Limited: "bg-red-500/10 border-red-500/40 text-red-400",
  New: "bg-poke-blue/10 border-poke-blue/40 text-poke-blue",
};

export default function Badge({ label, className = "" }: BadgeProps) {
  const colors =
    colorMap[label] ?? "bg-poke-muted/10 border-poke-muted/30 text-poke-muted";

  return (
    <span
      className={`inline-block border text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${colors} ${className}`}
    >
      {label}
    </span>
  );
}
