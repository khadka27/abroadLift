import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import prisma from "@/lib/db";
import { hashOtpCode } from "@/lib/phoneVerification";

export async function POST(req: Request) {
  try {
    const { phoneE164, otp } = await req.json();

    if (!phoneE164 || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required." },
        { status: 400 },
      );
    }

    const normalizedPhoneE164 = phoneE164.trim();

    const user = await prisma.user.findUnique({
      where: { phoneE164: normalizedPhoneE164 },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that phone number." },
        { status: 401 },
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

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("NEXTAUTH_SECRET is required for secure JWT issuance.");
    }

    const token = await encode({
      secret,
      maxAge: 60 * 60 * 24 * 7,
      token: {
        id: user.id,
        email: user.email,
        role: user.role,
        tokenType: "mobile",
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile,
      },
      token,
    });
  } catch (error) {
    console.error("[MOBILE_LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
