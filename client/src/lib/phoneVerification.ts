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

  if (apiKey && senderId) {
    try {
      // Strip out the '+' from E.164 to pass directly as digits.
      const contacts = phoneE164.replace("+", "");
      const msg = `Your AbroadLift verification code is: ${otpCode}. It expires in 10 minutes.`;

      const url = new URL("https://sms.smspasal.com/smsapi/index");
      url.searchParams.append("key", apiKey);
      if (campaign) url.searchParams.append("campaign", campaign);
      if (routeId) url.searchParams.append("routeid", routeId);
      url.searchParams.append("type", "text");
      url.searchParams.append("contacts", contacts);
      url.searchParams.append("senderid", senderId);
      url.searchParams.append("msg", msg);
      url.searchParams.append("responsetype", "json");

      const response = await fetch(url.toString(), { method: "GET" });
      
      let isSuccess = false;
      let errorMsg = "";

      // Try to parse the response as JSON
      try {
        const responseData = await response.json();
        console.log(`[SMSPASAL] OTP request for ${contacts}. Response (JSON):`, responseData);

        if (
          responseData &&
          responseData.response_message !== "error" &&
          (responseData.status === "success" ||
            responseData.response_message === "success" ||
            (typeof responseData.sms_shootid === "string" && responseData.sms_shootid.length > 0) ||
            (typeof responseData.remarks === "string" && responseData.remarks.startsWith("SMS-SHOOT-ID/")))
        ) {
          isSuccess = true;
        } else {
          errorMsg =
            responseData.message ||
            responseData.error ||
            responseData.remarks ||
            JSON.stringify(responseData);
        }
      } catch {
        // Fallback to text parsing if response is not JSON
        const responseText = await response.text();
        console.log(`[SMSPASAL] OTP request for ${contacts}. Response (Text):`, responseText);
        if (responseText.startsWith("SMS-SHOOT-ID/")) {
          isSuccess = true;
        } else {
          errorMsg = responseText;
        }
      }

      if (isSuccess) {
        return {
          sent: true,
          channel: "SMS" as OtpChannel,
        };
      } else {
        console.error(`[SMSPASAL] Failed to send OTP: ${errorMsg}`);
        return {
          sent: false,
          error: errorMsg,
          channel: "SMS" as OtpChannel,
        };
      }
    } catch (error) {
      console.error(`[SMSPASAL] API Error:`, error);
      return {
        sent: false,
        error: error instanceof Error ? error.message : String(error),
        channel: "SMS" as OtpChannel,
      };
    }
  } else {
    // If credentials are missing in production, fail. Otherwise fall back to test mode.
    if (process.env.NODE_ENV === "production") {
      console.error("[OTP] SMS Pasal credentials missing in production!");
      return {
        sent: false,
        error: "SMS credentials missing",
        channel: "SMS" as OtpChannel,
      };
    }

    console.warn(
      "[OTP_TEST_MODE] SMS Pasal credentials missing. Falling back to test mode."
    );
  }

  // Fallback / Test mode in non-production environments when credentials are not configured
  console.log(`[OTP_TEST_MODE] OTP ${otpCode} prepared for ${phoneE164}`);
  return {
    sent: true,
    channel: "SMS" as OtpChannel,
  };
}
