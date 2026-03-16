import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // P27: Server-side TOTP enforcement for /admin routes
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/mfa-verify") &&
    !pathname.startsWith("/api/") &&
    !request.cookies.get("totp_verified")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/mfa-verify";
    return NextResponse.redirect(url);
  }

  // Store referral cookie — from ?ref= query param OR /ref/[slug] path
  const response = NextResponse.next();
  const queryRef = request.nextUrl.searchParams.get("ref");
  const pathMatch = pathname.match(/^\/ref\/([a-z0-9-]+)$/);
  const storeRef = queryRef || (pathMatch ? pathMatch[1] : null);

  // MED-1: Validate store_ref against allowlist pattern before setting cookie
  const STORE_REF_REGEX = /^[a-z0-9-]{1,64}$/;
  if (storeRef && STORE_REF_REGEX.test(storeRef.trim().toLowerCase())) {
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
