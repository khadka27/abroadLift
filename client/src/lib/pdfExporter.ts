"use client";

import jsPDF from "jspdf";

export async function exportElementToPDF(
  elementOrId: HTMLElement | string,
  filename: string = "AbroadLift_Report",
  onStart?: () => void,
  onComplete?: () => void,
) {
  if (typeof window === "undefined") return;

  if (onStart) onStart();

  try {
    const html2canvasModule = await import("html2canvas");
    const html2canvas = html2canvasModule.default || html2canvasModule;

    const element =
      typeof elementOrId === "string"
        ? document.getElementById(elementOrId)
        : elementOrId;

    if (!element) {
      console.error(`PDF Export Error: Element '${elementOrId}' not found.`);
      if (onComplete) onComplete();
      return;
    }

    // Capture element canvas at high DPI
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    // Add subsequent pages if canvas exceeds single page height
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    // Save and download PDF directly
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Generation Failed:", error);
    // Fallback: If canvas capture fails, offer native print fallback gracefully
    window.print();
  } finally {
    if (onComplete) onComplete();
  }
}
