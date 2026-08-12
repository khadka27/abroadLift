/**
 * Country-Specific Phone Number Validation Utility
 * Supports accurate digit counts, format rules, and dynamic placeholders per country dial code.
 */

export type PhoneValidationResult = {
  isValid: boolean;
  errorMsg: string;
};

export function validatePhoneByCountry(phone: string, dialCode: string): PhoneValidationResult {
  if (!dialCode || !dialCode.trim()) {
    return { isValid: false, errorMsg: "Please select a country code." };
  }

  if (!phone || !phone.trim()) {
    return { isValid: false, errorMsg: "Phone number is required." };
  }

  if (/[^0-9\s\-\(\)\+]/.test(phone)) {
    return {
      isValid: false,
      errorMsg: "Phone number must contain digits only (letters and special characters are not allowed).",
    };
  }

  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return { isValid: false, errorMsg: "Phone number is required." };
  }

  const cleanDial = dialCode.replace(/\D/g, "");

  switch (cleanDial) {
    case "977": // Nepal
      if (!/^9\d{9}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Nepali phone numbers must be 10 digits starting with 9 (e.g., 9812345678).",
        };
      }
      break;

    case "91": // India
      if (!/^[6-9]\d{9}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Indian phone numbers must be 10 digits starting with 6-9 (e.g., 9876543210).",
        };
      }
      break;

    case "1": // US & Canada
      if (!/^[2-9]\d{9}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "US/Canada phone numbers must be 10 digits (e.g., 2025550143).",
        };
      }
      break;

    case "44": // United Kingdom
      if (!/^(7\d{9}|\d{10,11})$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "UK phone numbers must be 10-11 digits (e.g., 7911123456).",
        };
      }
      break;

    case "61": // Australia
      if (!/^(4\d{8}|\d{9})$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Australian mobile numbers must be 9 digits starting with 4 (e.g., 412345678).",
        };
      }
      break;

    case "880": // Bangladesh
      if (!/^1[3-9]\d{8}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Bangladeshi phone numbers must be 10 digits starting with 1 (e.g., 1712345678).",
        };
      }
      break;

    case "92": // Pakistan
      if (!/^3\d{9}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Pakistani phone numbers must be 10 digits starting with 3 (e.g., 3001234567).",
        };
      }
      break;

    case "971": // UAE
      if (!/^5\d{8}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "UAE mobile numbers must be 9 digits starting with 5 (e.g., 501234567).",
        };
      }
      break;

    case "234": // Nigeria
      if (!/^[789]\d{9}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Nigerian phone numbers must be 10 digits starting with 7, 8, or 9.",
        };
      }
      break;

    case "86": // China
      if (!/^1[3-9]\d{9}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Chinese mobile numbers must be 11 digits starting with 1 (e.g., 13800138000).",
        };
      }
      break;

    case "81": // Japan
      if (!/^(0?[789]0\d{8}|\d{10})$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Japanese mobile numbers must be 10-11 digits (e.g., 9012345678).",
        };
      }
      break;

    case "49": // Germany
      if (!/^\d{10,11}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "German phone numbers must be 10-11 digits.",
        };
      }
      break;

    default: // Standard E.164 (7 to 15 digits)
      if (!/^\d{7,15}$/.test(digits)) {
        return {
          isValid: false,
          errorMsg: "Enter a valid phone number (7–15 digits).",
        };
      }
      break;
  }

  return { isValid: true, errorMsg: "" };
}

export function getPhonePlaceholder(dialCode: string): string {
  const cleanDial = dialCode.replace(/\D/g, "");
  switch (cleanDial) {
    case "977":
      return "9812345678";
    case "91":
      return "9876543210";
    case "1":
      return "2025550143";
    case "44":
      return "7911123456";
    case "61":
      return "412345678";
    case "880":
      return "1712345678";
    case "92":
      return "3001234567";
    case "971":
      return "501234567";
    case "234":
      return "8012345678";
    case "86":
      return "13800138000";
    default:
      return "9812345678";
  }
}
