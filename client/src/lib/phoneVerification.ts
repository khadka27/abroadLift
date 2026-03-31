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
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return crypto.randomInt(min, max + 1).toString();
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
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authHeader = twilioAuthHeader();

  if (!sid || !authHeader) {
    return false;
  }

  const fromNumber =
    channel === "WHATSAPP"
      ? process.env.TWILIO_WHATSAPP_FROM
      : process.env.TWILIO_SMS_FROM;

  if (!fromNumber) {
    return false;
  }

  const to = channel === "WHATSAPP" ? `whatsapp:${phoneE164}` : phoneE164;
  const from = channel === "WHATSAPP" ? `whatsapp:${fromNumber}` : fromNumber;
  const body = `Your AbroadLift OTP is ${otpCode}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`;

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: body,
      }),
    },
  );

  return response.ok;
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
  const fallbackChannel: OtpChannel = prefersWhatsApp ? "SMS" : "WHATSAPP";

  try {
    const primarySent = await sendViaTwilio(primaryChannel, phoneE164, otpCode);
    if (primarySent) {
      return { sent: true, channel: primaryChannel };
    }

    const fallbackSent = await sendViaTwilio(
      fallbackChannel,
      phoneE164,
      otpCode,
    );
    if (fallbackSent) {
      return { sent: true, channel: fallbackChannel };
    }

    return { sent: false as const };
  } catch (error) {
    console.error("[OTP_SEND_ERROR]", error);
    return { sent: false as const };
  }
}
