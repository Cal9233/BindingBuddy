import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const storeRef = cookieStore.get("store_ref")?.value;
  const hasRef = !!storeRef && storeRef !== "organic";
  return NextResponse.json({ hasRef });
}
