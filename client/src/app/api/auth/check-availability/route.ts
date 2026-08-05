import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeDialCode, normalizePhoneNumber, toE164 } from "@/lib/phoneVerification";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase().trim();
  const dialCode = searchParams.get("dialCode")?.trim();
  const phone = searchParams.get("phone")?.trim();

  try {
    if (email) {
      const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!basicEmailRegex.test(email)) {
        return NextResponse.json({ available: false, field: "email", reason: "invalid_format" });
      }
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      return NextResponse.json({
        available: !existing,
        field: "email",
        reason: existing ? "taken" : null,
      });
    }

    if (dialCode && phone) {
      const normalizedDial = normalizeDialCode(dialCode);
      const normalizedPhone = normalizePhoneNumber(phone);
      const phoneE164 = toE164(normalizedDial, normalizedPhone);
      if (!phoneE164) {
        return NextResponse.json({ available: false, field: "phone", reason: "invalid_format" });
      }
      const existing = await prisma.user.findUnique({
        where: { phoneE164 },
        select: { id: true },
      });
      return NextResponse.json({
        available: !existing,
        field: "phone",
        reason: existing ? "taken" : null,
      });
    }

    return NextResponse.json({ error: "Missing query params" }, { status: 400 });
  } catch (error) {
    console.error("[CHECK_AVAILABILITY_ERROR]", error);
    return NextResponse.json({ available: true, field: null, reason: "db_error" });
  }
}
