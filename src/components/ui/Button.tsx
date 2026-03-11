import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-poke-yellow text-white font-bold hover:opacity-90 active:scale-[0.97]",
  secondary:
    "border border-poke-border text-poke-text font-semibold hover:border-poke-blue/50 hover:bg-poke-blue/5",
  ghost:
    "text-poke-muted font-medium hover:text-poke-text hover:bg-white/5",
};

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-display px-6 py-3 rounded-xl text-base transition-all duration-200";
  const classes = `${base} ${variantClasses[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
