import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout – Binding Buddy",
  description: "Complete your order for custom laser-engraved Pokemon binders.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
