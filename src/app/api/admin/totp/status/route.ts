import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();

    const { user } = await payload.auth({ headers: headersList });
    if (!user) {
      // Clear TOTP session cookie if user is not authenticated
      const cookieStore = await cookies();
      cookieStore.delete("totp_verified");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const typedUser = user as { id: string; totpEnabled?: boolean };
    const cookieStore = await cookies();
    const totpEnabled = typedUser.totpEnabled === true;
    const totpVerified = cookieStore.get("totp_verified")?.value === "true";

    console.log("[TOTP Status]", {
      userId: typedUser.id,
      totpEnabled,
      cookieValue: cookieStore.get("totp_verified")?.value ?? "(none)",
    });

    return NextResponse.json({
      totpEnabled,
      totpVerified: !totpEnabled || totpVerified,
    });
  } catch (error) {
    console.error("TOTP status error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
