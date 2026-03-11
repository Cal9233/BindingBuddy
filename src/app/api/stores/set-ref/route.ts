import { NextRequest, NextResponse } from "next/server";
import { stores } from "@/lib/stores";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();

    if (!slug || !stores[slug]) {
      return NextResponse.json({ error: "Invalid store" }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("store_ref", slug, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
