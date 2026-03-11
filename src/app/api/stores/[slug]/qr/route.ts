import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { stores } from "@/lib/stores";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!stores[slug]) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const size = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("size")) || 400, 100),
    1000,
  );
  const download = request.nextUrl.searchParams.get("download") === "true";

  const url = `https://bindingbuddy.com/ref/${slug}`;
  const buffer = await QRCode.toBuffer(url, {
    width: size,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  const headers: Record<string, string> = {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=86400",
  };

  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${slug}-qr.png"`;
  }

  return new NextResponse(new Uint8Array(buffer), { headers });
}
