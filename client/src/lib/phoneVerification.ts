import crypto from "node:crypto";

export type OtpChannel = "WHATSAPP" | "SMS";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

function twilioAuthHeader() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    return null;
  }

  const encoded = Buffer.from(`${sid}:${token}`).toString("base64");
  return `Basic ${encoded}`;
}

function getTwilioSmsFrom() {
  const from = process.env.TWILIO_SMS_FROM?.trim();
  return from || "";
}

export function normalizeDialCode(input: string) {
  const digits = input.replaceAll(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export function normalizePhoneNumber(input: string) {
  return input.replaceAll(/\D/g, "");
}

export function toE164(dialCode: string, phoneNumber: string) {
  const dialDigits = dialCode.replaceAll(/\D/g, "");
  const phoneDigits = phoneNumber.replaceAll(/\D/g, "");

  if (!dialDigits || !phoneDigits) {
    return "";
  }

  const combined = `${dialDigits}${phoneDigits}`;

  if (combined.length < 8 || combined.length > 15) {
    return "";
  }

  return `+${combined}`;
}

export function generateOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH;
  return Math.floor(min + Math.random() * (max - min)).toString();
}

export function hashOtpCode(otpCode: string) {
  return crypto.createHash("sha256").update(otpCode).digest("hex");
}

export function getOtpExpiry() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

async function sendViaTwilio(phoneE164: string, otpCode: string) {
  const authHeader = twilioAuthHeader();
  const from = getTwilioSmsFrom();

  if (!authHeader || !from) {
    console.error(
      "[TWILIO_SMS_MISSING_CONFIG] Missing Twilio SMS credentials.",
    );
    return false;
  }

  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  if (!sid) {
    return false;
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: phoneE164,
        Body: `Your AbroadLift verification code is ${otpCode}`,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[TWILIO_SMS_ERROR]", response.status, errorText);
    return false;
  }

  return true;
}

export async function trySendOtp({
  phoneE164,
  otpCode,
}: {
  phoneE164: string;
  otpCode: string;
}) {
  const primaryChannel: OtpChannel = "SMS";

  const sent = await sendViaTwilio(phoneE164, otpCode);

  if (!sent) {
    return { sent: false, channel: primaryChannel };
  }

  return { sent: true, channel: primaryChannel };
}
