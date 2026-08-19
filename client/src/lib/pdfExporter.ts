"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function labToRgb(l: number, aComp: number, bComp: number): [number, number, number] {
  const y = (l + 16) / 116;
  const x = aComp / 500 + y;
  const z = y - bComp / 200;

  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;

  const xFinal = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
  const yFinal = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
  const zFinal = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

  const X = xFinal * 0.95047;
  const Y = yFinal * 1.00000;
  const Z = zFinal * 1.08883;

  let rLin = X * +3.2406 + Y * -1.5372 + Z * -0.4986;
  let gLin = X * -0.9689 + Y * +1.8758 + Z * +0.0415;
  let bLin = X * +0.0557 + Y * -0.2040 + Z * +1.0570;

  rLin = Math.max(0, rLin);
  gLin = Math.max(0, gLin);
  bLin = Math.max(0, bLin);

  const toSrgb = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;

  const r = Math.min(255, Math.max(0, Math.round(toSrgb(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(toSrgb(gLin) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(toSrgb(bLin) * 255)));

  return [r, g, b];
}

function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const bComp = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * bComp;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bComp;
  const s_ = l - 0.0894841775 * a - 1.291485548 * bComp;

  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;

  let rLin = +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  let gLin = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  let bLin = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

  rLin = Math.max(0, rLin);
  gLin = Math.max(0, gLin);
  bLin = Math.max(0, bLin);

  const toSrgb = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

  const r = Math.min(255, Math.max(0, Math.round(toSrgb(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(toSrgb(gLin) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(toSrgb(bLin) * 255)));

  return [r, g, b];
}

function oklabToRgb(l: number, aComp: number, bComp: number): [number, number, number] {
  const l_ = l + 0.3963377774 * aComp + 0.2158037573 * bComp;
  const m_ = l - 0.1055613458 * aComp - 0.0638541728 * bComp;
  const s_ = l - 0.0894841775 * aComp - 1.291485548 * bComp;

  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;

  let rLin = +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  let gLin = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  let bLin = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

  rLin = Math.max(0, rLin);
  gLin = Math.max(0, gLin);
  bLin = Math.max(0, bLin);

  const toSrgb = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

  const r = Math.min(255, Math.max(0, Math.round(toSrgb(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(toSrgb(gLin) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(toSrgb(bLin) * 255)));

  return [r, g, b];
}

function parseColorToRgb(colorStr: string, isTextProperty: boolean = false): string {
  if (!colorStr) return isTextProperty ? "#0f172a" : "transparent";
  const str = colorStr.trim();

  // 1. Parse lab(...)
  const labMatch = str.match(
    /lab\(\s*([-\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*[\/\,]\s*([-\d.]+)(%?))?\s*\)/i
  );
  if (labMatch) {
    let l = parseFloat(labMatch[1]);
    if (labMatch[2] === "%") l = l;
    const aVal = parseFloat(labMatch[3]);
    const bVal = parseFloat(labMatch[4]);
    let alpha = labMatch[5] !== undefined ? parseFloat(labMatch[5]) : 1;
    if (labMatch[6] === "%") alpha = alpha / 100;

    const [r, g, b] = labToRgb(l, aVal, bVal);
    if (alpha < 1 && !isNaN(alpha)) {
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 2. Parse lch(...)
  const lchMatch = str.match(
    /lch\(\s*([-\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:deg|rad|turn)?(?:\s*[\/\,]\s*([-\d.]+)(%?))?\s*\)/i
  );
  if (lchMatch) {
    let l = parseFloat(lchMatch[1]);
    const c = parseFloat(lchMatch[3]);
    const h = parseFloat(lchMatch[4]);
    let alpha = lchMatch[5] !== undefined ? parseFloat(lchMatch[5]) : 1;
    if (lchMatch[6] === "%") alpha = alpha / 100;

    const hRad = (h * Math.PI) / 180;
    const aVal = c * Math.cos(hRad);
    const bVal = c * Math.sin(hRad);

    const [r, g, b] = labToRgb(l, aVal, bVal);
    if (alpha < 1 && !isNaN(alpha)) {
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 3. Parse oklch(...)
  const oklchMatch = str.match(
    /oklch\(\s*([-\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:deg|rad|turn)?(?:\s*[\/\,]\s*([-\d.]+)(%?))?\s*\)/i
  );
  if (oklchMatch) {
    let l = parseFloat(oklchMatch[1]);
    if (oklchMatch[2] === "%") l = l / 100;
    const c = parseFloat(oklchMatch[3]);
    const h = parseFloat(oklchMatch[4]);
    let alpha = oklchMatch[5] !== undefined ? parseFloat(oklchMatch[5]) : 1;
    if (oklchMatch[6] === "%") alpha = alpha / 100;

    const [r, g, b] = oklchToRgb(l, c, h);
    if (alpha < 1 && !isNaN(alpha)) {
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 4. Parse oklab(...)
  const oklabMatch = str.match(
    /oklab\(\s*([-\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*[\/\,]\s*([-\d.]+)(%?))?\s*\)/i
  );
  if (oklabMatch) {
    let l = parseFloat(oklabMatch[1]);
    if (oklabMatch[2] === "%") l = l / 100;
    const aVal = parseFloat(oklabMatch[3]);
    const bVal = parseFloat(oklabMatch[4]);
    let alpha = oklabMatch[5] !== undefined ? parseFloat(oklabMatch[5]) : 1;
    if (oklabMatch[6] === "%") alpha = alpha / 100;

    const [r, g, b] = oklabToRgb(l, aVal, bVal);
    if (alpha < 1 && !isNaN(alpha)) {
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 5. Parse color(srgb r g b / a)
  const colorFnMatch = str.match(
    /color\(\s*srgb\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*[\/\,]\s*([-\d.]+))?\s*\)/i
  );
  if (colorFnMatch) {
    const r = Math.min(255, Math.max(0, Math.round(parseFloat(colorFnMatch[1]) * 255)));
    const g = Math.min(255, Math.max(0, Math.round(parseFloat(colorFnMatch[2]) * 255)));
    const b = Math.min(255, Math.max(0, Math.round(parseFloat(colorFnMatch[3]) * 255)));
    const a = colorFnMatch[4] !== undefined ? parseFloat(colorFnMatch[4]) : 1;
    if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 6. light-dark(light, dark)
  if (/^light-dark\(/i.test(str)) {
    const inner = str.slice(11, -1);
    const parts = inner.split(",");
    if (parts[0]) return parseColorToRgb(parts[0].trim(), isTextProperty);
  }

  // Mandatory fallback if string contains ANY lab/oklch/oklab syntax to prevent html2canvas crash
  if (/(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(str)) {
    return isTextProperty ? "#0f172a" : "transparent";
  }

  return str;
}

function sanitizeCssString(str: string, isTextProperty: boolean = false): string {
  if (!str) return str;
  if (!/(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(str)) {
    return str;
  }

  const keywords = ["lab", "oklch", "oklab", "lch", "color", "light-dark"];
  const regex = new RegExp(`(?:${keywords.join("|")})\\(`, "gi");

  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    const startIndex = match.index;
    let openCount = 1;
    let currIndex = regex.lastIndex;

    while (currIndex < str.length && openCount > 0) {
      const char = str[currIndex];
      if (char === "(") openCount++;
      else if (char === ")") openCount--;
      currIndex++;
    }

    if (openCount === 0) {
      result += str.slice(lastIndex, startIndex);
      const fullMatch = str.slice(startIndex, currIndex);
      result += parseColorToRgb(fullMatch, isTextProperty);
      lastIndex = currIndex;
      regex.lastIndex = currIndex;
    }
  }

  result += str.slice(lastIndex);
  return result;
}

export async function exportElementToPDF(
  elementOrId: HTMLElement | string,
  filename: string = "AbroadLift_Report",
  onStart?: () => void,
  onComplete?: () => void
) {
  if (typeof window === "undefined") return;

  if (onStart) onStart();

  // Allow DOM to settle after loading state change
  await new Promise((resolve) => setTimeout(resolve, 150));

  try {
    const element =
      typeof elementOrId === "string"
        ? document.getElementById(elementOrId)
        : elementOrId;

    if (!element) {
      console.error(`PDF Export Error: Element '${elementOrId}' not found.`);
      if (onComplete) onComplete();
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrollX = window.scrollX || window.pageXOffset || 0;

    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: -scrollX,
      scrollY: -scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      onclone: (clonedDoc, clonedElement) => {
        // 1. Sanitize all <style> tags in cloned document
        const styleTags = clonedDoc.querySelectorAll("style");
        styleTags.forEach((style) => {
          if (style.textContent) {
            style.textContent = sanitizeCssString(style.textContent, false);
          }
        });

        // 2. Hide export/save action buttons inside PDF clone
        const actionButtons = clonedDoc.querySelectorAll(".no-pdf, button");
        actionButtons.forEach((btn) => {
          if (btn instanceof HTMLElement) {
            btn.style.display = "none";
          }
        });

        // 3. Process all cloned elements safely: guarantee text is never transparent!
        const allElements = clonedDoc.querySelectorAll<HTMLElement | SVGElement>("*");
        allElements.forEach((el) => {
          const styleAttr = el.getAttribute("style");
          if (
            styleAttr &&
            /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(styleAttr)
          ) {
            el.setAttribute("style", sanitizeCssString(styleAttr, false));
          }

          if (el instanceof HTMLElement) {
            el.style.animation = "none";
            el.style.transition = "none";

            const comp = clonedDoc.defaultView?.getComputedStyle(el);
            if (comp) {
              if (
                comp.opacity === "0" ||
                el.classList.contains("animate-in") ||
                el.classList.contains("fade-in")
              ) {
                el.style.opacity = "1";
                el.style.transform = "none";
              }

              // Text Color: guarantee dark, crisp, non-transparent text!
              const textColor = comp.getPropertyValue("color");
              if (
                textColor &&
                (textColor === "transparent" ||
                  /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(textColor))
              ) {
                const sanitizedText = sanitizeCssString(textColor, true);
                el.style.setProperty(
                  "color",
                  sanitizedText === "transparent" ? "#0f172a" : sanitizedText,
                  "important"
                );
              }

              // Background & Border colors
              const bgProps = [
                "background-color",
                "border-color",
                "border-top-color",
                "border-right-color",
                "border-bottom-color",
                "border-left-color",
                "outline-color",
                "box-shadow",
                "text-shadow",
                "fill",
                "stroke",
              ];

              for (const prop of bgProps) {
                try {
                  const val = comp.getPropertyValue(prop);
                  if (
                    val &&
                    /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)
                  ) {
                    const sanitized = sanitizeCssString(val, false);
                    el.style.setProperty(prop, sanitized, "important");
                  }
                } catch {
                  // ignore
                }
              }
            }
          }
        });

        if (clonedElement instanceof HTMLElement) {
          clonedElement.style.opacity = "1";
          clonedElement.style.transform = "none";
          clonedElement.style.animation = "none";
          clonedElement.style.transition = "none";
        }
      },
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error("PDF Export Error: Captured canvas is empty.");
      if (onComplete) onComplete();
      return;
    }

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
  } finally {
    if (onComplete) onComplete();
  }
}
