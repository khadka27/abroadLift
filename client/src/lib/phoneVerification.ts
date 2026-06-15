import crypto from "node:crypto";

export type OtpChannel = "WHATSAPP" | "SMS";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

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
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH);
  return crypto.randomInt(min, max).toString();
}

export function hashOtpCode(otpCode: string) {
  return crypto.createHash("sha256").update(otpCode).digest("hex");
}

export function getOtpExpiry() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export async function trySendOtp({
  phoneE164,
  otpCode,
}: {
  phoneE164: string;
  otpCode: string;
}) {
  const apiKey = process.env.SMSPASAL_API_KEY;
  const campaign = process.env.SMSPASAL_CAMPAIGN_ID;
  const routeId = process.env.SMSPASAL_ROUTE_ID;
  const senderId = process.env.SMSPASAL_SENDER_ID;

  if (apiKey && campaign && routeId && senderId) {
    try {
      // Strip out the '+' from E.164 to pass directly as digits.
      const contacts = phoneE164.replace("+", "");
      const msg = `Your AbroadLift verification code is: ${otpCode}. It expires in 10 minutes.`;

      const url = new URL("https://sms.smspasal.com/smsapi/index.php");
      url.searchParams.append("key", apiKey);
      url.searchParams.append("campaign", campaign);
      url.searchParams.append("routeid", routeId);
      url.searchParams.append("type", "text");
      url.searchParams.append("contacts", contacts);
      url.searchParams.append("senderid", senderId);
      url.searchParams.append("msg", msg);

      const response = await fetch(url.toString(), { method: "GET" });
      const responseText = await response.text();

      console.log(`[SMSPASAL] OTP request for ${contacts}. Response:`, responseText);

      if (responseText.startsWith("SMS-SHOOT-ID/")) {
        return {
          sent: true,
          channel: "SMS" as OtpChannel,
        };
      } else {
        console.error(`[SMSPASAL] Failed to send OTP: ${responseText}`);
      }
    } catch (error) {
      console.error(`[SMSPASAL] API Error:`, error);
    }
  } else {
    console.warn(
      "[OTP_TEST_MODE] SMS Pasal credentials missing. Falling back to test mode."
    );
  }

  // Fallback / Test mode
  console.log(`[OTP_TEST_MODE] OTP ${otpCode} prepared for ${phoneE164}`);
  return {
    sent: true,
    channel: "SMS" as OtpChannel,
  };
}
