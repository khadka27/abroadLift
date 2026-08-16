"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

function replaceColorFunctions(
  str: string,
  replacer: (match: string) => string
): string {
  if (!str) return str;
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
      result += replacer(fullMatch);
      lastIndex = currIndex;
      regex.lastIndex = currIndex;
    }
  }

  result += str.slice(lastIndex);
  return result;
}

function convertColorToRgb(colorStr: string): string {
  if (typeof window === "undefined" || !colorStr) return colorStr;
  const trimmed = colorStr.trim();

  // 1. oklab(L a b / A) or oklab(L a b)
  if (/^oklab\(/i.test(trimmed)) {
    const match = trimmed.match(
      /^oklab\(\s*([-\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*[\/\,]\s*([-\d.]+)(%?))?\s*\)$/i
    );
    if (match) {
      let l = parseFloat(match[1]);
      if (match[2] === "%") l = l / 100;
      const aVal = parseFloat(match[3]);
      const bVal = parseFloat(match[4]);
      let alpha = match[5] !== undefined ? parseFloat(match[5]) : 1;
      if (match[6] === "%") alpha = alpha / 100;

      const [r, g, b] = oklabToRgb(l, aVal, bVal);
      if (alpha < 1) return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // 2. oklch(L C H / A) or oklch(L C H)
  if (/^oklch\(/i.test(trimmed)) {
    const match = trimmed.match(
      /^oklch\(\s*([-\d.]+)(%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*[\/\,]\s*([-\d.]+)(%?))?\s*\)$/i
    );
    if (match) {
      let l = parseFloat(match[1]);
      if (match[2] === "%") l = l / 100;
      const c = parseFloat(match[3]);
      const h = parseFloat(match[4]);
      let alpha = match[5] !== undefined ? parseFloat(match[5]) : 1;
      if (match[6] === "%") alpha = alpha / 100;

      const [r, g, b] = oklchToRgb(l, c, h);
      if (alpha < 1) return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // 3. color(srgb R G B / A)
  if (/^color\(\s*srgb/i.test(trimmed)) {
    const match = trimmed.match(
      /^color\(\s*srgb\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*[\/\,]\s*([-\d.]+))?\s*\)$/i
    );
    if (match) {
      const r = Math.min(255, Math.max(0, Math.round(parseFloat(match[1]) * 255)));
      const g = Math.min(255, Math.max(0, Math.round(parseFloat(match[2]) * 255)));
      const b = Math.min(255, Math.max(0, Math.round(parseFloat(match[3]) * 255)));
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
      if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // 4. light-dark(light, dark)
  if (/^light-dark\(/i.test(trimmed)) {
    const inner = trimmed.slice(11, -1);
    const parts = inner.split(",");
    if (parts[0]) return convertColorToRgb(parts[0].trim());
  }

  // 5. DOM Computed Style Resolution via temporary helper
  try {
    let helper = document.getElementById("pdf-color-convert-helper");
    if (!helper) {
      helper = document.createElement("div");
      helper.id = "pdf-color-convert-helper";
      helper.style.position = "fixed";
      helper.style.left = "-9999px";
      helper.style.top = "-9999px";
      helper.style.visibility = "hidden";
      helper.style.pointerEvents = "none";
      document.body.appendChild(helper);
    }

    helper.style.color = "";
    helper.style.color = trimmed;
    const comp = window.getComputedStyle(helper).color;
    if (
      comp &&
      !/(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(comp)
    ) {
      return comp;
    }
  } catch {
    // ignore
  }

  return "transparent";
}

function sanitizeColorString(str: string): string {
  if (!str) return str;
  if (!/(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(str)) {
    return str;
  }

  return replaceColorFunctions(str, (match) => {
    return convertColorToRgb(match);
  });
}

export async function exportElementToPDF(
  elementOrId: HTMLElement | string,
  filename: string = "AbroadLift_Report",
  onStart?: () => void,
  onComplete?: () => void
) {
  if (typeof window === "undefined") return;

  if (onStart) onStart();

  const originalGetComputedStyle = window.getComputedStyle;

  const wrapComputedStyle = (style: CSSStyleDeclaration): CSSStyleDeclaration => {
    return new Proxy(style, {
      get(target, prop) {
        if (prop === "getPropertyValue") {
          return (propertyName: string) => {
            const val = target.getPropertyValue(propertyName);
            if (val && /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)) {
              return sanitizeColorString(val);
            }
            return val;
          };
        }
        const val = (target as any)[prop];
        if (typeof val === "function") {
          return val.bind(target);
        }
        if (typeof val === "string" && /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)) {
          return sanitizeColorString(val);
        }
        return val;
      },
    });
  };

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

    // 1. Temporarily patch main window.getComputedStyle during html2canvas initialization
    window.getComputedStyle = function (
      elt: Element,
      pseudoElt?: string | null
    ): CSSStyleDeclaration {
      const comp = originalGetComputedStyle.call(window, elt, pseudoElt);
      return wrapComputedStyle(comp);
    };

    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc, clonedElement) => {
        // Patch clonedDoc defaultView getComputedStyle
        if (clonedDoc.defaultView) {
          const clonedOrigGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
          clonedDoc.defaultView.getComputedStyle = function (
            elt: Element,
            pseudoElt?: string | null
          ): CSSStyleDeclaration {
            const comp = clonedOrigGetComputedStyle.call(clonedDoc.defaultView, elt, pseudoElt);
            return wrapComputedStyle(comp);
          };
        }

        // Sanitize all style tags
        const styleTags = clonedDoc.querySelectorAll("style");
        styleTags.forEach((style) => {
          if (style.textContent) {
            style.textContent = sanitizeColorString(style.textContent);
          }
        });

        // Hide action buttons in PDF clone
        const actionButtons = clonedDoc.querySelectorAll(".no-pdf, button");
        actionButtons.forEach((btn) => {
          if (
            btn instanceof HTMLElement &&
            (btn.innerText?.includes("Export") || btn.innerText?.includes("Save"))
          ) {
            btn.style.display = "none";
          }
        });

        // Force explicit inline sanitized styles on all elements
        const colorProps = [
          "color",
          "background-color",
          "border-color",
          "border-top-color",
          "border-right-color",
          "border-bottom-color",
          "border-left-color",
          "outline-color",
          "box-shadow",
          "text-shadow",
          "background",
          "background-image",
          "fill",
          "stroke",
        ];

        const allElements = clonedDoc.querySelectorAll<HTMLElement | SVGElement>("*");
        allElements.forEach((el) => {
          const styleAttr = el.getAttribute("style");
          if (
            styleAttr &&
            /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(styleAttr)
          ) {
            el.setAttribute("style", sanitizeColorString(styleAttr));
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

              for (const prop of colorProps) {
                try {
                  const val = comp.getPropertyValue(prop);
                  if (
                    val &&
                    /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)
                  ) {
                    const sanitized = sanitizeColorString(val);
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
    // ALWAYS restore original getComputedStyle
    window.getComputedStyle = originalGetComputedStyle;
    if (onComplete) onComplete();
  }
}
