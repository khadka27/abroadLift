import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  hashOtpCode,
  normalizeDialCode,
  normalizePhoneNumber,
  toE164,
} from "@/lib/phoneVerification";

export async function POST(req: Request) {
  try {
    const { phoneE164, countryDialCode, phoneNumber, otp } = await req.json();

    const normalizedPhoneE164 =
      (phoneE164 || "").trim() ||
      toE164(
        normalizeDialCode(countryDialCode || ""),
        normalizePhoneNumber(phoneNumber || ""),
      );

    if (!normalizedPhoneE164 || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { phoneE164: normalizedPhoneE164 },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found for this phone number." },
        { status: 404 },
      );
    }

    const inputHash = hashOtpCode(otp);
    const isOtpValid =
      user.otpCodeHash &&
      user.otpExpiresAt &&
      inputHash === user.otpCodeHash &&
      user.otpExpiresAt.getTime() > Date.now();

    if (!isOtpValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 401 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        otpCodeHash: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("[VERIFY_SIGNUP_OTP_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
