/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Download,
  Info,
  GraduationCap,
  Home,
  Utensils,
  Bus,
  ShieldCheck,
  TrendingDown,
  Target,
  BookOpen,
  Wifi,
  Plane,
  Smile,
  FileText,
  UserCheck,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Printer,
  HeartPulse,
  MapPin,
  Edit2,
  Check,
  X,
  Phone,
  Shield,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { motion, animate } from "framer-motion";
import { formatNPRDevanagari } from "@/lib/currency";
import { COUNTRY_COSTS_DATA } from "@/lib/countryCosts";

// Unified component to animate currency numbers as single, clean, rounded values
function AnimatedCurrency({
  usdVal,
  usdToNpr,
  currency,
  period,
}: {
  usdVal: number;
  usdToNpr: number;
  currency: "NPR" | "USD";
  period?: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const val = currency === "NPR" ? usdVal * usdToNpr : usdVal;

    const formatUSD = (v: number) => {
      // Round to nearest 100 for larger values, nearest 10 for smaller values
      const rounded = v >= 1000 ? Math.round(v / 100) * 100 : Math.round(v / 10) * 10;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(rounded);
    };

    const formatNPR = (v: number) => {
      return formatNPRDevanagari(v);
    };

    const controls = animate(0, val, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(value) {
        if (currency === "NPR") {
          node.textContent = formatNPR(value);
        } else {
          node.textContent = formatUSD(value);
        }
      },
    });
    return () => controls.stop();
  }, [usdVal, usdToNpr, currency, period]);

  return <span ref={nodeRef}>0</span>;
}

interface FinancialDashboardProps {
  form: Form;
  selectedMatch: Match;
  dynamicLivingCost: any;
  financialMetrics: {
    tuitionUsd: number;
    yearlyLivingUsd: number;
    setupCostsUsd: number;
    graduationDuration: number;
    totalYear1Npr: number;
    totalDegreeCostNpr: number;
    totalTuitionNpr: number;
    totalLivingNpr: number;
    itemizedMonthly: any;
    fmtNpr: (v: number) => string;
    fmtLakhs: (v: number) => string;
    usdToNpr: number;
  };
  costBand: any;
  onBack: () => void;
}

export function FinancialDashboard({
  form,
  selectedMatch,
  dynamicLivingCost,
  financialMetrics,
  costBand,
  onBack,
}: FinancialDashboardProps) {
  const [period, setPeriod] = useState<
    "Before Departure" | "First 6 Months" | "Overall Cost of Living"
  >("Before Departure");
  const [currency, setCurrency] = useState<"NPR" | "USD">("NPR");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [durationYearsOverride, setDurationYearsOverride] = useState<number | null>(null);

  const {
    tuitionUsd,
    yearlyLivingUsd,
    setupCostsUsd,
    totalYear1Npr,
    usdToNpr,
    graduationDuration,
  } = financialMetrics;

  const living = dynamicLivingCost || {
    rent: Math.round(Math.max(tuitionUsd * 0.38, 4200)),
    food: Math.round(Math.max(tuitionUsd * 0.12, 1200)),
    transport: Math.round(Math.max(tuitionUsd * 0.05, 450)),
    insurance: Math.round(Math.max(tuitionUsd * 0.04, 300)),
    other: Math.round(Math.max(tuitionUsd * 0.09, 650)),
  };

  // State to store edited values of categories (in USD)
  const [costs, setCosts] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const matchedCountryCode = useMemo(() => {
    if (selectedMatch.countryCode) {
      let code = selectedMatch.countryCode.toUpperCase().trim();
      if (code === "USA") return "US";
      if (code === "UK") return "GB";
      return code;
    }
    const loc = (selectedMatch.location || "").toLowerCase();
    if (loc.includes("united states") || loc.includes("usa") || loc.includes("us")) return "US";
    if (loc.includes("canada") || loc.includes("ca")) return "CA";
    if (loc.includes("australia") || loc.includes("au")) return "AU";
    if (loc.includes("united kingdom") || loc.includes("uk") || loc.includes("gb") || loc.includes("england") || loc.includes("scotland")) return "GB";
    if (loc.includes("ireland") || loc.includes("ie")) return "IE";
    if (loc.includes("germany") || loc.includes("de")) return "DE";
    if (loc.includes("malta") || loc.includes("mt")) return "MT";
    return "US"; // default fallback
  }, [selectedMatch]);

  useEffect(() => {
    const items = COUNTRY_COSTS_DATA[matchedCountryCode] || [];
    const defaultCosts: Record<string, number> = {};

    items.forEach((item) => {
      // Default to the average of min and max range in USD
      defaultCosts[item.id] = Math.round((item.min + item.max) / 2);
    });

    // Special matched/personal overrides
    defaultCosts["tuition-fee"] = Math.round(tuitionUsd * 0.5);
    defaultCosts["cash-in-hand"] = 1500;

    setCosts(defaultCosts);
  }, [tuitionUsd, matchedCountryCode]);

  const handleSaveEdit = (id: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      const usdVal = currency === "NPR" ? val / usdToNpr : val;
      setCosts((prev) => ({
        ...prev,
        [id]: Math.round(usdVal),
      }));
    }
    setEditingId(null);
  };

  const generatePDF = async () => {
    setGeneratingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const allCats = getCategories();
      const beforeDep = allCats.filter((c) => c.group === "Before Departure");
      const first6 = allCats.filter((c) => c.group === "First 6 Months");

      const totalBefore = beforeDep.reduce((s, c) => s + c.usd, 0);
      const total6m = first6.reduce((s, c) => s + c.usd, 0);
      const grandTotal = totalBefore + total6m;

      const fmtUsd = (v: number) =>
        "$" + Math.round(v).toLocaleString("en-US");
      const fmtNpr = (v: number) => {
        const npr = Math.round(v * usdToNpr);
        if (npr >= 10000000) {
          const crore = npr / 10000000;
          return `Rs ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`;
        }
        if (npr >= 100000) {
          const lakh = npr / 100000;
          return `Rs ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
        }
        return `Rs ${npr.toLocaleString()}`;
      };

      const PW = 210; // A4 width mm
      const ML = 14;  // margin left
      const MR = 14;  // margin right
      const CW = PW - ML - MR; // content width
      let y = 0;

      const checkPage = (needed: number) => {
        if (y + needed > 275) {
          doc.addPage();
          y = 16;
        }
      };

      // ── Header band ────────────────────────────────────────────
      doc.setFillColor(54, 134, 255);
      doc.rect(0, 0, PW, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("AbroadLift  Cost Report", ML, 11);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const universityName = selectedMatch.name || "University";
      const location = selectedMatch.location || "";
      const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      doc.text(`${universityName}  ·  ${location}  ·  ${dateStr}`, ML, 18);

      // Grand total top-right
      doc.setFontSize(8);
      doc.text("GRAND TOTAL", PW - MR - 32, 9, { align: "right" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(fmtUsd(grandTotal), PW - MR, 17, { align: "right" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(fmtNpr(grandTotal), PW - MR, 23, { align: "right" });

      y = 36;

      // ── Summary cards ───────────────────────────────────────────
      const cards = [
        { label: "Before Departure", usd: totalBefore },
        { label: "First 6 Months", usd: total6m },
        { label: "Monthly (avg)", usd: Math.round(total6m / 6) },
      ];
      const cardW = CW / 3 - 3;
      cards.forEach((card, i) => {
        const cx = ML + i * (cardW + 4.5);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(cx, y, cardW, 20, 3, 3, "FD");
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(card.label.toUpperCase(), cx + 4, y + 6);
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.text(fmtUsd(card.usd), cx + 4, y + 13);
        doc.setFontSize(7);
        doc.setTextColor(99, 102, 241);
        doc.text(fmtNpr(card.usd), cx + 4, y + 18);
      });
      y += 28;

      // ── Table renderer ──────────────────────────────────────────
      const drawTable = (
        title: string,
        cats: typeof allCats,
        subtotal: number,
        accentHex: [number, number, number],
      ) => {
        checkPage(18);

        // Section title bar
        doc.setFillColor(...accentHex);
        doc.rect(ML, y, 4, 7, "F");
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(title, ML + 7, y + 5.5);
        y += 12;

        // Column widths
        const colItem = 42;
        const colDesc = CW - colItem - 28 - 28;
        const colUsd = 28;
        const colNpr = 28;

        // Header row
        doc.setFillColor(241, 245, 249);
        doc.rect(ML, y, CW, 7, "F");
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text("ITEM", ML + 2, y + 4.8);
        doc.text("DESCRIPTION", ML + colItem + 2, y + 4.8);
        doc.text("USD", ML + colItem + colDesc + colUsd - 2, y + 4.8, { align: "right" });
        doc.text("NPR", ML + CW - 2, y + 4.8, { align: "right" });
        y += 8;

        // Rows
        cats.forEach((cat, i) => {
          checkPage(10);
          if (i % 2 === 0) {
            doc.setFillColor(252, 252, 253);
            doc.rect(ML, y - 1, CW, 8, "F");
          }
          doc.setTextColor(30, 41, 59);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(cat.label, ML + 2, y + 4);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(7);
          const descLines = doc.splitTextToSize(cat.desc, colDesc - 4);
          doc.text(descLines[0], ML + colItem + 2, y + 4);

          doc.setTextColor(30, 41, 59);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text(fmtUsd(cat.usd), ML + colItem + colDesc + colUsd - 2, y + 4, { align: "right" });
          doc.setTextColor(99, 102, 241);
          doc.text(fmtNpr(cat.usd), ML + CW - 2, y + 4, { align: "right" });

          // separator line
          doc.setDrawColor(241, 245, 249);
          doc.line(ML, y + 7, ML + CW, y + 7);
          y += 8;
        });

        // Subtotal row
        checkPage(10);
        doc.setFillColor(...accentHex, 18);
        doc.setFillColor(accentHex[0], accentHex[1], accentHex[2]);
        doc.setFillColor(241, 245, 249);
        doc.rect(ML, y, CW, 9, "F");
        doc.setDrawColor(...accentHex);
        doc.setLineWidth(0.5);
        doc.line(ML, y, ML + CW, y);
        doc.setLineWidth(0.2);
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${title} Subtotal`, ML + 2, y + 6);
        doc.setTextColor(54, 134, 255);
        doc.text(fmtUsd(subtotal), ML + colItem + colDesc + colUsd - 2, y + 6, { align: "right" });
        doc.setTextColor(99, 102, 241);
        doc.text(fmtNpr(subtotal), ML + CW - 2, y + 6, { align: "right" });
        y += 14;
      };

      drawTable("Before Departure Costs", beforeDep, totalBefore, [54, 134, 255]);
      drawTable("First 6 Months After Arrival", first6, total6m, [16, 185, 129]);

      // ── Grand Total row ─────────────────────────────────────────
      checkPage(14);
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(ML, y, CW, 13, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Grand Total  (Before Departure + First 6 Months)", ML + 4, y + 8.5);
      doc.text(fmtUsd(grandTotal), ML + CW - 32, y + 8.5, { align: "right" });
      doc.setTextColor(147, 197, 253);
      doc.setFontSize(8);
      doc.text(fmtNpr(grandTotal), ML + CW - 2, y + 8.5, { align: "right" });
      y += 20;

      // ── Footer ──────────────────────────────────────────────────
      checkPage(14);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(ML, y, ML + CW, y);
      y += 5;
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        `This report is an estimate by AbroadLift. Actual costs may vary. Exchange rate: 1 USD = ${usdToNpr.toFixed(2)} NPR. Always verify with official sources.`,
        ML,
        y,
        { maxWidth: CW },
      );

      // ── Save ────────────────────────────────────────────────────
      const filename = `AbroadLift_CostReport_${(universityName).replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const getCategories = () => {
    const items = COUNTRY_COSTS_DATA[matchedCountryCode] || [];
    
    const getIcon = (id: string) => {
      if (id === "passport" || id === "aps") return <FileText className="w-5 h-5" />;
      if (id === "visa" || id === "permit" || id === "biometrics" || id === "bank-setup") return <CreditCard className="w-5 h-5" />;
      if (id === "sevis" || id === "laundry") return <Activity className="w-5 h-5" />;
      if (id === "exams" || id === "books") return <BookOpen className="w-5 h-5" />;
      if (id === "medical" || id === "vaccines" || id === "entertainment") return <HeartPulse className="w-5 h-5" />;
      if (id === "health-insurance-init" || id === "insurance" || id === "travel-insurance" || id === "sec-deposit") return <Shield className="w-5 h-5" />;
      if (id === "flight") return <Plane className="w-5 h-5" />;
      if (id === "airport-transport" || id === "baggage" || id === "transport") return <Bus className="w-5 h-5" />;
      if (id === "acc-deposit" || id === "rent-1" || id === "accommodation" || id === "utilities") return <Home className="w-5 h-5" />;
      if (id === "sim" || id === "internet") return <Wifi className="w-5 h-5" />;
      if (id === "mobile") return <Phone className="w-5 h-5" />;
      if (id === "shopping-dep" || id === "shopping") return <ShoppingBag className="w-5 h-5" />;
      if (id === "food") return <Utensils className="w-5 h-5" />;
      return <Info className="w-5 h-5" />;
    };

    const getColorClass = (id: string) => {
      if (id === "passport" || id === "aps" || id === "bank-setup") return "bg-slate-500";
      if (id === "visa" || id === "permit" || id === "biometrics" || id === "university-app-fee") return "bg-blue-500";
      if (id === "sevis") return "bg-indigo-500";
      if (id === "ihs") return "bg-emerald-600";
      if (id === "exams" || id === "books") return "bg-orange-500";
      if (id === "medical" || id === "vaccines" || id === "entertainment") return "bg-rose-500";
      if (id === "health-insurance-init" || id === "insurance" || id === "travel-insurance" || id === "sec-deposit") return "bg-emerald-500";
      if (id === "flight") return "bg-sky-500";
      if (id === "airport-transport" || id === "baggage" || id === "transport") return "bg-violet-500";
      if (id === "acc-deposit" || id === "rent-1" || id === "accommodation" || id === "utilities") return "bg-emerald-500";
      if (id === "sim" || id === "internet") return "bg-pink-500";
      if (id === "mobile") return "bg-pink-500";
      if (id === "shopping-dep" || id === "shopping") return "bg-pink-500";
      if (id === "food") return "bg-orange-500";
      return "bg-slate-500";
    };

    const getHexColor = (id: string) => {
      if (id === "passport" || id === "aps" || id === "bank-setup") return "#64748b";
      if (id === "visa" || id === "permit" || id === "biometrics" || id === "university-app-fee") return "#3b82f6";
      if (id === "sevis") return "#6366f1";
      if (id === "ihs") return "#059669";
      if (id === "exams" || id === "books") return "#f97316";
      if (id === "medical" || id === "vaccines" || id === "entertainment") return "#f43f5e";
      if (id === "health-insurance-init" || id === "insurance" || id === "travel-insurance" || id === "sec-deposit") return "#10b981";
      if (id === "flight") return "#0ea5e9";
      if (id === "airport-transport" || id === "baggage" || id === "transport") return "#a855f7";
      if (id === "acc-deposit" || id === "rent-1" || id === "accommodation" || id === "utilities") return "#10b981";
      if (id === "sim" || id === "internet") return "#ec4899";
      if (id === "mobile") return "#ec4899";
      if (id === "shopping-dep" || id === "shopping") return "#ec4899";
      if (id === "food") return "#f97316";
      return "#64748b";
    };

    const mappedItems = items.map((item) => ({
      id: item.id,
      label: item.label,
      desc: item.description,
      group: item.category === "Before Departure" ? ("Before Departure" as const) : ("First 6 Months" as const),
      usd: costs[item.id] !== undefined ? costs[item.id] : Math.round((item.min + item.max) / 2),
      editable: true,
      icon: getIcon(item.id),
      color: getColorClass(item.id),
      hex: getHexColor(item.id),
    }));

    const beforeDepartureList = mappedItems.filter((i) => i.group === "Before Departure");
    const first6MonthsList = mappedItems.filter((i) => i.group === "First 6 Months");

    beforeDepartureList.unshift({
      id: "tuition-fee",
      label: "Tuition Fee Deposit",
      desc: "First tuition deposit or first semester installment payment required for admission confirmation",
      group: "Before Departure" as const,
      usd: costs["tuition-fee"] !== undefined ? costs["tuition-fee"] : Math.round(tuitionUsd * 0.5),
      editable: false,
      icon: <CreditCard className="w-5 h-5" />,
      color: "bg-emerald-600",
      hex: "#059669",
    });

    beforeDepartureList.push({
      id: "cash-in-hand",
      label: "Cash In Hand",
      desc: "FOREX cash in hand for immediate use upon arrival in country",
      group: "Before Departure" as const,
      usd: costs["cash-in-hand"] !== undefined ? costs["cash-in-hand"] : 1500,
      editable: true,
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-amber-600",
      hex: "#d97706",
    });

    return [...beforeDepartureList, ...first6MonthsList];
  };

  const durationYears = durationYearsOverride ?? graduationDuration ?? 4;

  const categories = useMemo(() => {
    const cats = getCategories();
    if (period === "Before Departure") {
      return cats.filter((c) => c.group === "Before Departure");
    } else if (period === "First 6 Months") {
      return cats.filter((c) => c.group === "First 6 Months");
    }
    // Overall Cost of Living: scale tuition and living items by duration
    return cats.map((cat) => {
      if (cat.id === "tuition-fee") {
        return {
          ...cat,
          label: `Total Tuition (${durationYears} Yrs)`,
          desc: `Annual tuition scaled for ${durationYears}-year programme`,
          usd: Math.round(tuitionUsd * durationYears),
        };
      }
      if (cat.group === "First 6 Months") {
        const scaleFactor = 2 * durationYears; // 6 months × 2 × years
        return {
          ...cat,
          label: `${cat.label} (${durationYears} Yrs)`,
          usd: Math.round(cat.usd * scaleFactor),
        };
      }
      return cat;
    });
  }, [period, costs, tuitionUsd, living, usdToNpr, durationYears]);

  const totalUsd = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.usd, 0),
    [categories],
  );
  const totalNpr = totalUsd * usdToNpr;

  const strokeData = useMemo(() => {
    let currentOffset = 0;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    return categories.map((cat) => {
      const percentage = totalUsd > 0 ? (cat.usd / totalUsd) * 100 : 0;
      const length = (percentage / 100) * circumference;
      const offset = (currentOffset / 100) * circumference;
      currentOffset += percentage;
      return { length, offset, circumference };
    });
  }, [categories, totalUsd]);

  return (
    <div className="relative min-h-screen text-slate-900 pb-24 md:pb-32 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 overflow-hidden">
      {/* Background Glowing Mesh Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-ring" />
      <div className="absolute bottom-40 right-20 w-[450px] h-[450px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-10 relative z-10 space-y-8">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col xl:flex-row xl:items-end justify-between gap-6"
        >
          <div className="space-y-4 max-w-3xl">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold group"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Dashboard
            </button>
            <h1 className="text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-[#111827] tracking-tight leading-[1.1]">
              Estimated Cost Breakdown
            </h1>
            <p className="text-slate-500 text-[15px] md:text-[17px] leading-relaxed font-medium">
              A comprehensive view of your expected expenses for{" "}
              <span className="text-slate-700 font-bold">
                {period === "Overall Cost of Living"
                  ? `your entire ${durationYears}-year study journey`
                  : period === "Before Departure"
                    ? "before you depart"
                    : "your first 6 months after arrival"}
              </span>
              , calculated dynamically based on your preferences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto shrink-0 z-20">
            {/* Currency Toggle */}
            <div className="relative flex items-center bg-white p-1.5 rounded-[22px] border border-slate-200/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)] w-full sm:w-auto overflow-hidden">
              {["NPR", "USD"].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr as any)}
                  className={`relative flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[13px] font-extrabold transition-colors whitespace-nowrap z-10 cursor-pointer ${
                    currency === curr
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {currency === curr && (
                    <motion.span
                      layoutId="activeCurrency"
                      className="absolute inset-0 bg-emerald-500 rounded-2xl z-[-1] shadow-md shadow-emerald-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {curr}
                </button>
              ))}
            </div>

            {/* Period Toggle */}
            <div className="relative flex items-center bg-white p-1.5 rounded-[22px] border border-slate-200/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)] w-full sm:w-auto overflow-hidden">
              {["Before Departure", "First 6 Months", "Overall Cost of Living"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={`relative flex-1 sm:flex-none px-5 py-3 rounded-2xl text-[13px] md:text-[14px] font-extrabold transition-colors whitespace-nowrap z-10 cursor-pointer ${
                    period === p
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {period === p && (
                    <motion.span
                      layoutId="activePeriod"
                      className="absolute inset-0 bg-[#3686FF] rounded-2xl z-[-1] shadow-md shadow-blue-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {p}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar - Summary Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Total Cost Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 md:p-8 rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] relative overflow-hidden group hover:border-[#3686FF]/20 hover:shadow-[0_20px_50px_rgba(54,134,255,0.08)] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    {period === "Overall Cost of Living"
                      ? `Overall Cost (${durationYears} Yrs)`
                      : period === "Before Departure"
                        ? "Before Departure Cost"
                        : "First 6 Months Cost"}
                  </p>
                  <h2 className="text-[34px] sm:text-[42px] font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                    <AnimatedCurrency usdVal={totalUsd} usdToNpr={usdToNpr} currency={currency} period={period} />
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                    {period === "Overall Cost of Living"
                      ? `${durationYears}-year total`
                      : period === "Before Departure"
                        ? "pre-departure"
                        : "first 6 months"}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="h-3 bg-slate-100/80 rounded-full overflow-hidden border border-slate-200/30 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${Math.min(95, (totalYear1Npr / 10000000) * 100)}%`,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className={`h-full rounded-full ${
                        costBand.key === "budget"
                          ? "bg-emerald-500"
                          : costBand.key === "average"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>{currency === "NPR" ? "NPR 0" : "$0"}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                      <span>{currency === "NPR" ? "NPR 10 Crore" : "$75,000"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-amber-50/80 rounded-2xl border border-amber-100 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider leading-none">
                      {costBand.label} Cost Estimate
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benchmarks Card */}
            {true && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 md:p-8 rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] relative overflow-hidden group hover:border-[#3686FF]/20 hover:shadow-[0_20px_50px_rgba(54,134,255,0.08)] transition-all duration-300"
              >
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                  Cost Benchmarks
                </h3>
                <div className="space-y-7">
                  {[
                    {
                      label: "High (Premium Lifestyle)",
                      valUsd: totalUsd * 1.3,
                      color: "bg-rose-500",
                      textColor: "text-rose-600",
                      w: "90%",
                    },
                    {
                      label: "Average (Moderate)",
                      valUsd: totalUsd,
                      color: "bg-amber-500",
                      textColor: "text-amber-600",
                      w: "65%",
                    },
                    {
                      label: "Low (Frugal)",
                      valUsd: totalUsd * 0.75,
                      color: "bg-emerald-500",
                      textColor: "text-emerald-600",
                      w: "45%",
                    },
                  ].map((b, i) => (
                    <div key={i} className="space-y-2.5">
                      <div className="flex justify-between items-end gap-2">
                        <span className={`text-xs font-extrabold ${b.textColor} truncate`}>
                          {b.label}
                        </span>
                        <span className="text-slate-900 font-black text-sm shrink-0">
                          <AnimatedCurrency usdVal={b.valUsd} usdToNpr={usdToNpr} currency={currency} />
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: b.w }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 }}
                          viewport={{ once: true }}
                          className={`h-full ${b.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Potential Savings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 md:p-8 rounded-[36px] border border-emerald-100/50 bg-emerald-50/40 backdrop-blur-sm shadow-sm relative overflow-hidden hover:border-emerald-200 hover:shadow-md transition-all duration-300"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-emerald-700 font-black text-[11px] uppercase tracking-widest mb-5 relative z-10">
                <TrendingDown className="w-4 h-4" />
                <span>Potential Savings</span>
              </div>
              <ul className="space-y-4 relative z-10">
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-sm shadow-emerald-500/50 animate-pulse" />
                  <p className="text-emerald-950/80 text-sm leading-relaxed font-semibold">
                    On-campus jobs can offset living costs by up to <strong className="text-emerald-700 font-extrabold">$6,000/yr</strong>.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-sm shadow-emerald-500/50 animate-pulse" />
                  <p className="text-emerald-950/80 text-sm leading-relaxed font-semibold">
                    Opting for shared off-campus housing saves approx. <strong className="text-emerald-700 font-extrabold">$2,500/yr</strong> compared to dorms.
                  </p>
                </li>
              </ul>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={generatePDF}
              disabled={generatingPdf}
              className="w-full h-[60px] rounded-2xl bg-white border border-slate-200/60 text-slate-800 font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-center gap-2.5 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 active:scale-95 group cursor-pointer disabled:opacity-60"
            >
              {generatingPdf ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-[#3686FF]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-[#3686FF] transition-colors" />
                  Download Full PDF Report
                </>
              )}
            </motion.button>
          </div>

          {/* Right Main Column - Charts & Breakdown */}
          <div className="lg:col-span-8">
            <Card className="rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] overflow-hidden h-full">
              <div className="p-6 sm:p-8 md:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                  <h2 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 tracking-tight">
                    Detailed Expense Categories
                  </h2>

                  {period === "Overall Cost of Living" && (
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
                      {[1, 2, 3, 4].map((yr) => (
                        <button
                          key={yr}
                          onClick={() => setDurationYearsOverride(yr)}
                          className={`px-4 py-2 rounded-lg text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                            durationYears === yr
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {yr === 1 ? "1st yr" : yr === 2 ? "2nd yrs" : `${yr} yrs`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-14 mb-12">
                  {/* Donut Chart */}
                  <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] shrink-0 drop-shadow-md">
                    <svg
                      viewBox="0 0 160 160"
                      className="w-full h-full -rotate-90"
                    >
                      {categories.map((cat, i) => {
                        const { length, offset, circumference } = strokeData[i];
                        return (
                          <motion.circle
                            key={i}
                            cx="80"
                            cy="80"
                            r={65}
                            fill="transparent"
                            stroke={cat.hex}
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${length} ${circumference}`}
                            initial={{ strokeDashoffset: circumference }}
                            whileInView={{ strokeDashoffset: -offset }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                            viewport={{ once: true }}
                          />
                        );
                      })}
                    </svg>
                  </div>

                  {/* Legend Grid */}
                  <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-6 flex-1 w-full">
                    {categories.map((cat, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${cat.color} shadow-sm shrink-0`}
                          />
                          <p className="text-[13px] md:text-[14px] font-bold text-slate-800 leading-none truncate">
                            {cat.label}
                          </p>
                        </div>
                        <div className="pl-5 flex flex-col gap-1">
                          <p className="text-[12px] font-bold text-slate-400">
                            {((cat.usd / totalUsd) * 100).toFixed(1)}%
                          </p>
                          <span className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 tracking-tight">
                            <AnimatedCurrency usdVal={cat.usd} usdToNpr={usdToNpr} currency={currency} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itemized List */}
                <div className="space-y-4">
                  {categories.map((cat, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                      key={cat.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 md:p-6 bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group hover:border-blue-500/20 hover:shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${cat.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg truncate group-hover:text-blue-600 transition-colors">
                          {cat.label}
                        </h4>
                        <p className="text-slate-500 text-sm mt-1 font-semibold line-clamp-1">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0 sm:ml-4 flex flex-col gap-0.5">
                        {editingId === cat.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-28 px-3 py-1.5 border-2 border-blue-500 rounded-xl text-sm font-bold focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(cat.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveEdit(cat.id)}
                              className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-350 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                              <AnimatedCurrency usdVal={cat.usd} usdToNpr={usdToNpr} currency={currency} />
                            </p>
                            {cat.editable && (
                              <button
                                onClick={() => {
                                  setEditingId(cat.id);
                                  // Set initial input value based on current currency
                                  const displayVal = currency === "NPR" ? Math.round(cat.usd * usdToNpr) : cat.usd;
                                  setEditValue(String(displayVal));
                                }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Edit Expense"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Warning Box */}
                <div className="mt-10 p-6 bg-slate-50/80 border border-slate-200/60 rounded-[28px] flex flex-col sm:flex-row gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl pointer-events-none" />
                  <div className="w-12 h-12 rounded-full bg-blue-100/50 border border-blue-200/30 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <h5 className="font-extrabold text-slate-900 text-base mb-2">
                      Inflation & Currency Warning
                    </h5>
                    <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                      Please note that these are estimates based on data from
                      the last academic year. Tuition fees may increase by 3-5%
                      annually. Additionally, if you are paying from a foreign
                      currency, exchange rate fluctuations can impact your final
                      cost.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
