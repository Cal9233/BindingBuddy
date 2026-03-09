interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function HoloCard({ children, className = "" }: HoloCardProps) {
  return <div className={`holo ${className}`}>{children}</div>;
}
