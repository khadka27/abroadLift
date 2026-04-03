import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  generateOtpCode,
  getOtpExpiry,
  hashOtpCode,
  trySendOtp,
} from "@/lib/phoneVerification";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    const normalizedIdentifier = (identifier || "").trim().toLowerCase();
    if (!normalizedIdentifier) {
      return NextResponse.json(
        { error: "Email or username is required." },
        { status: 400 },
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedIdentifier },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { username: normalizedIdentifier },
      });
    }

    if (!user || !user.phoneE164) {
      return NextResponse.json(
        {
          error: "No account found with a verified phone for this identifier.",
        },
        { status: 404 },
      );
    }

    const otpCode = generateOtpCode();
    const otpHash = hashOtpCode(otpCode);
    const otpExpiresAt = getOtpExpiry();

    const sendResult = await trySendOtp({
      phoneE164: user.phoneE164,
      otpCode,
      prefersWhatsApp: user.prefersWhatsApp,
    });

    if (!sendResult.sent) {
      return NextResponse.json(
        { error: "Unable to send OTP right now. Please try again." },
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
