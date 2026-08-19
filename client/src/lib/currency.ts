export function toDevanagariDigits(numStr: string): string {
  // Return Western digits as requested (Roman English Devanagari)
  return numStr;
}

export function formatLakhCrore(value: number): string {
  const num = Math.round(value);
  const numStr = num.toString();
  if (numStr.length <= 3) return numStr;
  const lastThree = numStr.substring(numStr.length - 3);
  const remaining = numStr.substring(0, numStr.length - 3);
  const groups = [];
  let i = remaining.length;
  while (i > 0) {
    if (i >= 2) {
      groups.unshift(remaining.substring(i - 2, i));
      i -= 2;
    } else {
      groups.unshift(remaining.substring(0, i));
      i = 0;
    }
  }
  return groups.join(',') + ',' + lastThree;
}

export function formatNPRDevanagari(v: number, includeSymbol: boolean = true): string {
  const num = Math.round(v);
  const prefix = includeSymbol ? "Rs " : "";
  if (num >= 10000000) {
    const crore = num / 10000000;
    const formatted = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2);
    const trimmed = parseFloat(formatted).toString();
    return `${prefix}${trimmed} Crore`;
  } else if (num >= 100000) {
    const lakh = num / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2);
    const trimmed = parseFloat(formatted).toString();
    return `${prefix}${trimmed} Lakh`;
  }
  return `${prefix}${formatLakhCrore(num)}`;
}

export function formatNPRDevanagariRange(low: number, high: number, includeSymbol: boolean = true): string {
  const prefix = includeSymbol ? "Rs " : "";
  
  // Format low
  let lowStr = "";
  if (low >= 10000000) {
    const crore = low / 10000000;
    const formatted = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1);
    lowStr = `${parseFloat(formatted).toString()} Crore`;
  } else if (low >= 100000) {
    const lakh = low / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1);
    lowStr = `${parseFloat(formatted).toString()} Lakh`;
  } else {
    lowStr = formatLakhCrore(low);
  }

  // Format high
  let highStr = "";
  if (high >= 10000000) {
    const crore = high / 10000000;
    const formatted = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1);
    highStr = `${parseFloat(formatted).toString()} Crore`;
  } else if (high >= 100000) {
    const lakh = high / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1);
    highStr = `${parseFloat(formatted).toString()} Lakh`;
  } else {
    highStr = formatLakhCrore(high);
  }

  // If units are the same (e.g. both are lakh or crore), we can simplify or just join them
  const units = [" Crore", " Lakh"];
  let matchedUnit = "";
  for (const unit of units) {
    if (lowStr.endsWith(unit) && highStr.endsWith(unit)) {
      matchedUnit = unit;
      break;
    }
  }

  if (matchedUnit) {
    const cleanLow = lowStr.replace(matchedUnit, "");
    const cleanHigh = highStr.replace(matchedUnit, "");
    return `${prefix}${cleanLow} - ${cleanHigh}${matchedUnit}`;
  }

  return `${prefix}${lowStr} - ${highStr}`;
}

export function getRateToNpr(countryName: string): number {
  const norm = countryName?.toLowerCase().trim() || "united states";
  if (norm.includes("canada")) return 134.5 / 1.36; // CAD to NPR
  if (norm.includes("united kingdom") || norm.includes("uk")) return 134.5 / 0.79; // GBP to NPR
  if (norm.includes("australia")) return 134.5 / 1.50; // AUD to NPR
  if (norm.includes("germany") || norm.includes("ireland") || norm.includes("europe")) return 134.5 / 0.93; // EUR to NPR
  if (norm.includes("india")) return 134.5 / 83.50; // INR to NPR
  return 134.5; // Default: USD to NPR
}

export function formatUSD(v: number): string {
  if (isNaN(v)) return "$0 USD";
  return `$${Math.round(v).toLocaleString("en-US")} USD`;
}

/**
 * Formats a financial amount string/number into a dual currency format showing both USD ($) and NPR (Rs).
 * Example: "$25,000 USD (Rs 33.63 Lakh)" or "Rs 35 Lakh ($26,022 USD)"
 */
export function formatDualCurrencyDisplay(
  rawVal: number | string | null | undefined,
  currency: string = "USD"
): string {
  if (rawVal === null || rawVal === undefined || rawVal === "") return "Not set";
  const num = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal).replace(/,/g, ""));
  if (isNaN(num) || num <= 0) return "Not set";

  let usdAmount = 0;
  let nprAmount = 0;

  const isNPRBase = currency === "NPR" || num > 500000;

  if (isNPRBase) {
    nprAmount = num;
    usdAmount = num / 134.5;
    return `${formatNPRDevanagari(nprAmount)} (${formatUSD(usdAmount)})`;
  } else {
    usdAmount = num;
    nprAmount = num * 134.5;
    return `${formatUSD(usdAmount)} (${formatNPRDevanagari(nprAmount)})`;
  }
}

/**
 * Provides live real-time conversion hint during input editing.
 */
export function formatLiveConversionHint(
  amountStr: string,
  currency: string = "USD"
): string {
  if (!amountStr) return "";
  const num = parseFloat(String(amountStr).replace(/,/g, ""));
  if (isNaN(num) || num <= 0) return "";

  const isNPRBase = currency === "NPR" || num > 500000;

  if (isNPRBase) {
    const usd = num / 134.5;
    return `≈ ${formatUSD(usd)} (${formatNPRDevanagari(num)})`;
  } else {
    const npr = num * 134.5;
    return `≈ ${formatNPRDevanagari(npr)} (Rs ${formatLakhCrore(npr)})`;
  }
}

export function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return "$";
  const c = currency.trim().toUpperCase();
  switch (c) {
    case "NPR":
      return "Rs ";
    case "CAD":
      return "C$";
    case "GBP":
      return "£";
    case "AUD":
      return "A$";
    case "EUR":
      return "€";
    case "INR":
      return "₹";
    case "USD":
    default:
      return "$";
  }
}

export function formatBudgetDisplay(
  amount: number | string | null | undefined,
  currency?: string | null
): string {
  if (amount === null || amount === undefined || amount === "") return "Not set";
  const num = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/,/g, ""));
  if (isNaN(num)) return "Not set";

  if (currency === "NPR" || num > 500000) {
    return formatNPRDevanagari(num);
  }
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${num.toLocaleString("en-US")}`;
}

