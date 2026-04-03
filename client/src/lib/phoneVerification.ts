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
  return crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

export function hashOtpCode(otpCode: string) {
  return crypto.createHash("sha256").update(otpCode).digest("hex");
}

export function getOtpExpiry() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

async function sendViaTwilio(
  channel: OtpChannel,
  phoneE164: string,
  otpCode: string,
) {
  // Twilio sending skipped for testing
  console.log(
    `[TEST_MODE] Skipping ${channel} send to ${phoneE164}. Code: ${otpCode}`,
  );
  return true;
}

export async function trySendOtp({
  phoneE164,
  otpCode,
  prefersWhatsApp,
}: {
  phoneE164: string;
  otpCode: string;
  prefersWhatsApp: boolean;
}) {
  const primaryChannel: OtpChannel = prefersWhatsApp ? "WHATSAPP" : "SMS";

  // Directly "send" via mock
  await sendViaTwilio(primaryChannel, phoneE164, otpCode);

  return { sent: true, channel: primaryChannel };
}
