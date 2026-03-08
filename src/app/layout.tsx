import type { Metadata } from "next";
import { Exo_2, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ReferralCapture from "@/components/referral/ReferralCapture";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-exo2",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Binding Buddy – Custom Laser-Engraved Pokemon Binders",
  description:
    "Custom xTool laser-engraved Pokemon binder covers, made to order for serious collectors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${exo2.variable} ${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-brand-bg font-sans text-brand-text">
        <CartProvider>
          <ReferralCapture />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
