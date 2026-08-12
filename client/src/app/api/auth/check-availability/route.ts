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
      const rawPhoneDigits = normalizedPhone.replace(/^0+/, "");
      if (!phoneE164 && !rawPhoneDigits) {
        return NextResponse.json({ available: false, field: "phone", reason: "invalid_format" });
      }
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            ...(phoneE164 ? [{ phoneE164 }] : []),
            ...(rawPhoneDigits.length >= 7 ? [
              { phoneNumber: rawPhoneDigits },
              { phoneNumber: `0${rawPhoneDigits}` },
              { phoneE164: { endsWith: rawPhoneDigits } },
            ] : []),
          ],
        },
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
