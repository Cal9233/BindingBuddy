import { NextRequest, NextResponse } from "next/server";
import { getPayPalApiBase, getPayPalAccessToken } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    const base = getPayPalApiBase();

    const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PayPal capture failed: ${text}`);
    }

    const data = await res.json();

    if (data.status !== "COMPLETED") {
      throw new Error(`PayPal order status: ${data.status}`);
    }

    const captureId =
      data.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

    return NextResponse.json({ status: data.status, captureId });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
