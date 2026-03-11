import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { verifyToken } from "@/lib/totp";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();

    const { user } = await payload.auth({ headers: headersList });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const typedUser = user as {
      id: string;
      totpSecret?: string;
      totpEnabled?: boolean;
    };

    const { token, action } = (await req.json()) as {
      token: string;
      action?: "enable" | "verify";
    };

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Get the secret directly from DB (field is hidden from API reads)
    const fullUser = await payload.findByID({
      collection: "users",
      id: typedUser.id,
      overrideAccess: true,
    });

    const secret = (fullUser as Record<string, unknown>).totpSecret as
      | string
      | undefined;

    if (!secret) {
      return NextResponse.json(
        { error: "TOTP not set up. Run setup first." },
        { status: 400 }
      );
    }

    const valid = verifyToken(token, secret);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid TOTP code" },
        { status: 400 }
      );
    }

    // If this is the initial enable action, mark TOTP as enabled
    if (action === "enable" && !typedUser.totpEnabled) {
      await payload.update({
        collection: "users",
        id: typedUser.id,
        data: { totpEnabled: true } as Record<string, unknown>,
        overrideAccess: true,
      });
    }

    // Set session cookie so user isn't prompted again until logout
    const cookieStore = await cookies();
    cookieStore.set("totp_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Session cookie — expires when browser closes
    });

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("TOTP verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
