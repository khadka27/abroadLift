/**
 * Auto-converts Percentage (%) and 10-Point Scale scores to a standard 4.0 GPA scale.
 * 
 * Examples:
 * - "85%" or "85" -> "3.40"
 * - "90%" or "90" -> "3.60"
 * - "100%" or "100" -> "4.00"
 * - "8.5" (out of 10) -> "3.40"
 * - "3.8" (out of 4) -> "3.80"
 */
export function convertGpaTo4Scale(rawGpa: string | number | undefined | null): string {
  if (rawGpa === undefined || rawGpa === null || rawGpa === "") return "";
  const str = rawGpa.toString().trim();
  if (!str) return "";

  const isPercentage = str.endsWith("%");
  const cleaned = str.replace("%", "").trim();
  const num = parseFloat(cleaned);

  if (isNaN(num) || num < 0) return str;

  // Case 1: Percentage Scale (e.g. 85%, 85 -> 3.40 / 4.0)
  if (isPercentage || (num > 10.0 && num <= 100.0)) {
    const converted = Math.min(4.0, (num / 100.0) * 4.0);
    return (Math.round(converted * 100) / 100).toFixed(2);
  }

  // Case 2: 10-Point CGPA Scale (e.g. 8.5 out of 10 -> 3.40 / 4.0)
  if (num > 4.0 && num <= 10.0) {
    const converted = Math.min(4.0, (num / 10.0) * 4.0);
    return (Math.round(converted * 100) / 100).toFixed(2);
  }

  // Case 3: Already on 4.0 scale (<= 4.0)
  if (num <= 4.0) {
    return num.toFixed(2);
  }

  return str;
}

/**
 * Returns the numeric 4.0 GPA float value from any input scale (Percentage, 10-point, 4.0).
 */
export function parseGpaToFloat(rawGpa: string | number | undefined | null): number | null {
  const convertedStr = convertGpaTo4Scale(rawGpa);
  if (!convertedStr) return null;
  const parsed = parseFloat(convertedStr);
  return isNaN(parsed) ? null : parsed;
}
