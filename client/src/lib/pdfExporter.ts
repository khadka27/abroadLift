"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function replaceColorFunctions(
  str: string,
  replacer: (match: string) => string
): string {
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

  // 1. Try DOM computed style conversion via a temporary hidden helper attached to document.body
  try {
    let helper = document.getElementById("pdf-color-convert-helper");
    if (!helper) {
      helper = document.createElement("div");
      helper.id = "pdf-color-convert-helper";
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      helper.style.top = "-9999px";
      helper.style.visibility = "hidden";
      document.body.appendChild(helper);
    }

    helper.style.color = "";
    helper.style.color = colorStr;
    const computed = window.getComputedStyle(helper).color;
    if (
      computed &&
      !/(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(computed)
    ) {
      return computed;
    }
  } catch {
    // ignore
  }

  // 2. Try HTML5 Canvas Context conversion
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillStyle = colorStr;
      const converted = ctx.fillStyle;
      if (
        converted &&
        !/(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(converted)
      ) {
        return converted;
      }
    }
  } catch {
    // ignore
  }

  // 3. Fallback to a solid dark visible color (never transparent!)
  return "#1e3a8a";
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

function createComputedStyleProxy(
  originalStyle: CSSStyleDeclaration
): CSSStyleDeclaration {
  return new Proxy(originalStyle, {
    get(target, prop, receiver) {
      if (prop === "getPropertyValue") {
        return function (property: string) {
          const val = target.getPropertyValue(property);
          if (
            val &&
            /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)
          ) {
            return sanitizeColorString(val);
          }
          return val;
        };
      }
      const val = Reflect.get(target, prop, receiver);
      if (
        typeof prop === "string" &&
        typeof val === "string" &&
        /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)
      ) {
        return sanitizeColorString(val);
      }
      return typeof val === "function" ? val.bind(target) : val;
    },
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

    // Override window.getComputedStyle to intercept and convert all unsupported color functions
    window.getComputedStyle = function (
      elt: Element,
      pseudoElt?: string | null
    ): CSSStyleDeclaration {
      const style = originalGetComputedStyle(elt, pseudoElt);
      return createComputedStyleProxy(style);
    };

    // Capture target element canvas at 2x resolution with sanitized CSS colors & reset animations
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      onclone: (clonedDoc, clonedElement) => {
        // Override clonedDoc.defaultView.getComputedStyle as well
        if (clonedDoc.defaultView) {
          const clonedOrigGetComputedStyle =
            clonedDoc.defaultView.getComputedStyle;
          clonedDoc.defaultView.getComputedStyle = function (
            elt: Element,
            pseudoElt?: string | null
          ): CSSStyleDeclaration {
            const style = clonedOrigGetComputedStyle(elt, pseudoElt);
            return createComputedStyleProxy(style);
          };
        }

        // 1. Sanitize all <style> tags
        const styleTags = clonedDoc.querySelectorAll("style");
        styleTags.forEach((style) => {
          if (style.textContent) {
            style.textContent = sanitizeColorString(style.textContent);
          }
        });

        // 2. Convert stylesheet link rules if accessible
        const linkTags =
          clonedDoc.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']");
        linkTags.forEach((link) => {
          try {
            if (link.sheet) {
              let rulesText = "";
              const rules = link.sheet.cssRules || link.sheet.rules;
              for (let i = 0; i < rules.length; i++) {
                rulesText += rules[i].cssText + "\n";
              }
              if (
                rulesText &&
                /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(rulesText)
              ) {
                const newStyle = clonedDoc.createElement("style");
                newStyle.textContent = sanitizeColorString(rulesText);
                link.parentNode?.insertBefore(newStyle, link);
                link.disabled = true;
              }
            }
          } catch {
            // cross-origin sheet fallback
          }
        });

        // 3. Ensure all elements are visible and disable animations/transforms that obscure content
        const view = clonedDoc.defaultView || window;
        const allElements =
          clonedDoc.querySelectorAll<HTMLElement | SVGElement>("*");

        allElements.forEach((el) => {
          const styleAttr = el.getAttribute("style");
          if (
            styleAttr &&
            /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(styleAttr)
          ) {
            el.setAttribute("style", sanitizeColorString(styleAttr));
          }

          if (el instanceof HTMLElement) {
            // Force animations off and ensure opacity is non-zero
            el.style.animation = "none";
            el.style.transition = "none";

            const comp = view.getComputedStyle(el);
            if (
              comp.opacity === "0" ||
              el.classList.contains("animate-in") ||
              el.classList.contains("fade-in")
            ) {
              el.style.opacity = "1";
              el.style.transform = "none";
            }

            try {
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
                "fill",
                "stroke",
              ];

              for (const prop of colorProps) {
                const val = comp.getPropertyValue(prop);
                if (
                  val &&
                  /(?:lab|oklch|oklab|lch|color|light-dark)\(/i.test(val)
                ) {
                  const sanitized = sanitizeColorString(val);
                  el.style.setProperty(prop, sanitized, "important");
                }
              }
            } catch {
              // ignore
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

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      // Single Page PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
    } else {
      // Multi-Page PDF: slice image without trailing blank pages
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      while (heightLeft > 10) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
      }
    }

    // Direct browser file download - NEVER opens print modal
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
  } finally {
    // Restore original window.getComputedStyle
    window.getComputedStyle = originalGetComputedStyle;

    // Clean up temporary conversion helper if present
    const helper = document.getElementById("pdf-color-convert-helper");
    if (helper && helper.parentNode) {
      helper.parentNode.removeChild(helper);
    }
    if (onComplete) onComplete();
  }
}



