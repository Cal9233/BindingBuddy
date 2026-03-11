import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Store referral cookie — from ?ref= query param OR /ref/[slug] path
  const response = NextResponse.next();
  const queryRef = request.nextUrl.searchParams.get("ref");
  const pathMatch = pathname.match(/^\/ref\/([a-z0-9-]+)$/);
  const storeRef = queryRef || (pathMatch ? pathMatch[1] : null);

  if (storeRef) {
    response.cookies.set("store_ref", storeRef.trim().toLowerCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
