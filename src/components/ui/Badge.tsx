interface BadgeProps {
  label: string;
  className?: string;
}

const colorMap: Record<string, string> = {
  "Best Seller": "bg-poke-gold/80 border-poke-gold/60 text-white backdrop-blur-md shadow-sm",
  Limited: "bg-red-500/70 border-red-500/50 text-white backdrop-blur-md shadow-sm",
  New: "bg-poke-blue/70 border-poke-blue/50 text-white backdrop-blur-md shadow-sm",
};

export default function Badge({ label, className = "" }: BadgeProps) {
  const colors =
    colorMap[label] ?? "bg-poke-muted/60 border-poke-muted/40 text-white backdrop-blur-md shadow-sm";

  return (
    <span
      className={`inline-block border text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${colors} ${className}`}
    >
      {label}
    </span>
  );
}
