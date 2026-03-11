import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Order – Binding Buddy",
  description:
    "Submit a custom design request for a laser-engraved Pokemon binder.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
