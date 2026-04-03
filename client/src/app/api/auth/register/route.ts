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

async function generateUniqueUsername(name: string, phoneNumber: string) {
  const baseUsername =
    name
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "")
      .slice(0, 16) || "student";
  const suffix = phoneNumber.slice(-4) || "0000";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate =
      attempt === 0
        ? `${baseUsername}${suffix}`
        : `${baseUsername}${suffix}${attempt}`;
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
    });
    if (!existing) {
      return candidate;
    }
  }

  return `${baseUsername}${suffix}${Date.now().toString().slice(-4)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      countryDialCode,
      phoneNumber,
      prefersWhatsApp,
      // Student profile fields
      nationality,
      currentCountry,
      gpa,
    } = body;

    const normalizedName = (name || "").trim();
    const normalizedEmail = (email || "").toLowerCase().trim();
    const normalizedDialCode = normalizeDialCode(countryDialCode || "");
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber || "");
    const phoneE164 = toE164(normalizedDialCode, normalizedPhoneNumber);
    const wantsWhatsApp =
      typeof prefersWhatsApp === "boolean" ? prefersWhatsApp : true;

    // Validate required fields
    if (!normalizedName || !normalizedEmail) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 },
      );
    }

    if (!normalizedDialCode || !normalizedPhoneNumber) {
      return NextResponse.json(
        { error: "Country code and phone number are required." },
        { status: 400 },
      );
    }

    if (!phoneE164) {
      return NextResponse.json(
        { error: "Invalid phone number format." },
        { status: 400 },
      );
    }

    // Check existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    // Check existing phone
    const existingPhone = await prisma.user.findUnique({
      where: { phoneE164 },
    });
    if (existingPhone) {
      return NextResponse.json(
        { error: "An account with this phone number already exists." },
        { status: 409 },
      );
    }

    const otpCode = generateOtpCode();
    const otpHash = hashOtpCode(otpCode);
    const otpExpiresAt = getOtpExpiry();
    const username = await generateUniqueUsername(
      normalizedName,
      normalizedPhoneNumber,
    );

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        username,
        email: normalizedEmail,
        countryDialCode: normalizedDialCode,
        phoneNumber: normalizedPhoneNumber,
        phoneE164,
        prefersWhatsApp: wantsWhatsApp,
        phoneVerified: false,
        otpCodeHash: otpHash,
        otpExpiresAt,
        role: "STUDENT",
        profile: {
          create: {
            nationality: nationality || null,
            currentCountry: currentCountry || null,
            gpa: gpa ? Number.parseFloat(gpa) : null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        countryDialCode: true,
        phoneNumber: true,
        phoneE164: true,
        phoneVerified: true,
        role: true,
      },
    });

    const otpSendResult = await trySendOtp({
      phoneE164,
      otpCode,
      prefersWhatsApp: wantsWhatsApp,
    });

    if (!otpSendResult.sent) {
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        {
          error: "Unable to send OTP right now. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpLastChannel: otpSendResult.channel,
      },
    });

    return NextResponse.json(
      {
        user,
        otp: {
          sent: true,
          channel: otpSendResult.channel,
          phoneE164,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
