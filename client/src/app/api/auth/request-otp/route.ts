import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  generateOtpCode,
  getOtpExpiry,
  hashOtpCode,
  normalizeDialCode,
  normalizePhoneNumber,
  toE164,
  trySendOtp,
} from "@/lib/phoneVerification";

export async function POST(req: Request) {
  try {
    const { phoneE164, countryDialCode, phoneNumber } = await req.json();

    const normalizedPhoneE164 =
      (phoneE164 || "").trim() ||
      toE164(
        normalizeDialCode(countryDialCode || ""),
        normalizePhoneNumber(phoneNumber || ""),
      );
    const rawPhoneDigits = normalizePhoneNumber(phoneNumber || phoneE164 || "").replace(/^0+/, "");

    if (!normalizedPhoneE164 && !rawPhoneDigits) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedPhoneE164 ? [{ phoneE164: normalizedPhoneE164 }] : []),
          ...(rawPhoneDigits.length >= 7 ? [
            { phoneNumber: rawPhoneDigits },
            { phoneNumber: `0${rawPhoneDigits}` },
            { phoneE164: { endsWith: rawPhoneDigits } },
          ] : []),
        ],
      },
    });

    if (!user?.phoneE164) {
      return NextResponse.json(
        {
          error: "No account found for this phone number.",
        },
        { status: 404 },
      );
    }

    const otpCode = generateOtpCode();
    const otpHash = hashOtpCode(otpCode);
    const otpExpiresAt = getOtpExpiry();

    const sendResult = await trySendOtp({
      phoneE164: normalizedPhoneE164,
      otpCode,
    });

    if (!sendResult.sent) {
      return NextResponse.json(
        { error: sendResult.error || "Unable to send OTP right now. Please try again." },
        { status: 503 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCodeHash: otpHash,
        otpExpiresAt,
        otpLastChannel: sendResult.channel,
      },
    });

    return NextResponse.json({
      sent: true,
      channel: sendResult.channel,
    });
  } catch (error) {
    console.error("[REQUEST_OTP_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
