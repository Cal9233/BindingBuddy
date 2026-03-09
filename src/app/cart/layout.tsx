import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart – Binding Buddy",
  description: "Review your cart before checkout.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
