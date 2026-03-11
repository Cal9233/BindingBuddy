import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products – Binding Buddy",
  description:
    "Browse our full collection of laser-engraved Pokemon binders and engraving services.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
