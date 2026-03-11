import { notFound } from "next/navigation";
import { stores, getStoreName } from "@/lib/stores";
import PrintButton from "./PrintButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!stores[slug]) return {};
  const name = getStoreName(slug);
  return {
    title: `Print QR Card — ${name} | Binding Buddy`,
  };
}

export default async function PrintPage({ params }: Props) {
  const { slug } = await params;

  if (!stores[slug]) {
    notFound();
  }

  const name = getStoreName(slug);
  const refUrl = `bindingbuddy.com/ref/${slug}`;

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-card {
            background: white !important;
            border: 2px solid #e5e7eb !important;
            color: #111 !important;
            box-shadow: none !important;
          }
          .print-card * { color: #111 !important; }
          .print-card .print-muted { color: #666 !important; }
        }
      `}</style>

      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="print-card bg-poke-card border border-poke-border rounded-2xl p-10 max-w-sm w-full text-center shadow-lg">
          {/* Logo / Brand */}
          <p className="font-display text-2xl font-bold text-poke-text mb-1">
            Binding Buddy
          </p>
          <p className="text-poke-muted print-muted text-sm mb-6">
            Laser-Engraved Pokemon Binder Covers
          </p>

          {/* Store Name */}
          <p className="font-display text-lg font-semibold text-poke-text mb-5">
            {name}
          </p>

          {/* QR Code */}
          <div className="bg-white rounded-xl p-4 inline-block mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/stores/${slug}/qr?size=300`}
              alt={`QR code for ${name}`}
              width={200}
              height={200}
              className="block"
            />
          </div>

          {/* Human-readable URL */}
          <p className="text-poke-muted print-muted text-sm mb-2">
            Scan to shop online
          </p>
          <p className="font-display text-poke-text font-semibold text-sm">
            {refUrl}
          </p>
        </div>

        {/* Print Button (hidden on print) */}
        <div className="no-print mt-8">
          <PrintButton />
        </div>
      </div>
    </>
  );
}
