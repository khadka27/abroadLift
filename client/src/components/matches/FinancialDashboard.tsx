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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { motion, animate } from "framer-motion";

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
      if (v >= 100000) {
        const lakhs = v / 100000;
        return `NPR ${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} Lakhs`;
      }
      // Round to nearest 100 for small amounts
      const rounded = Math.round(v / 100) * 100;
      return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 0,
      }).format(rounded);
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
    "Before Departure" | "First 6 Months" | "Combined Total"
  >("Before Departure");
  const [currency, setCurrency] = useState<"NPR" | "USD">("NPR");

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

  useEffect(() => {
    const defaultCosts: Record<string, number> = {
      "identity-docs": 75,
      "language-classes": 300,
      "counsellor-fee": 110,
      "admissions-testing": 425,
      "visa-compliance": 685,
      "tuition-fee": Math.round(tuitionUsd * 0.5),
      "flight-tickets": 1200,
      "shopping": Math.round(100000 / usdToNpr),
      "cash-in-hand": 1500,
      "cost-of-living": Math.round((living.rent + living.food) * 6),
      "internet-phone": 300,
      "transportation": Math.round(living.transport * 6),
      "academic-recurring": 600,
      "buffer": 900,
      "local-compliance": 300,
    };
    setCosts(defaultCosts);
  }, [tuitionUsd, living.rent, living.food, living.transport, usdToNpr]);

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

  const getCategories = () => {
    const cats = [
      {
        id: "identity-docs",
        label: "Identity & Civil Documents",
        desc: "Passport, police clearance, photos, translations, notarization, courier",
        group: "Before Departure" as const,
        usd: costs["identity-docs"] || 75,
        editable: false,
        icon: <FileText className="w-5 h-5" />,
        color: "bg-slate-500",
        hex: "#64748b",
      },
      {
        id: "language-classes",
        label: "Language Classes and Exam",
        desc: "IELTS/Language coaching classes and registration exam fee (optional)",
        group: "Before Departure" as const,
        usd: costs["language-classes"] || 300,
        editable: true,
        icon: <BookOpen className="w-5 h-5" />,
        color: "bg-teal-500",
        hex: "#14b8a6",
      },
      {
        id: "counsellor-fee",
        label: "Counsellor / Agency Service Fee",
        desc: "Service fee for counsellor guidance, visa lodging, and applications",
        group: "Before Departure" as const,
        usd: costs["counsellor-fee"] || 110,
        editable: true,
        icon: <UserCheck className="w-5 h-5" />,
        color: "bg-indigo-500",
        hex: "#6366f1",
      },
      {
        id: "admissions-testing",
        label: "Admissions & Testing",
        desc: "Application fees, English tests, credential evaluation, counsellor fee",
        group: "Before Departure" as const,
        usd: costs["admissions-testing"] || 425,
        editable: true,
        icon: <GraduationCap className="w-5 h-5" />,
        color: "bg-blue-500",
        hex: "#3b82f6",
      },
      {
        id: "visa-compliance",
        label: "Visa & Compliance",
        desc: "Visa fee, SEVIS/biometrics, medical/TB, health surcharge insurance, bank docs",
        group: "Before Departure" as const,
        usd: costs["visa-compliance"] || 685,
        editable: false,
        icon: <ShieldCheck className="w-5 h-5" />,
        color: "bg-rose-500",
        hex: "#f43f5e",
      },
      {
        id: "tuition-fee",
        label: "Tuition Fee",
        desc: "First tuition deposit or first semester installment payment",
        group: "Before Departure" as const,
        usd: costs["tuition-fee"] || Math.round(tuitionUsd * 0.5),
        editable: false,
        icon: <CreditCard className="w-5 h-5" />,
        color: "bg-emerald-600",
        hex: "#059669",
      },
      {
        id: "flight-tickets",
        label: "Flight Tickets",
        desc: "Flight tickets, baggage, airport transfer, FX markup, wire transfer",
        group: "Before Departure" as const,
        usd: costs["flight-tickets"] || 1200,
        editable: true,
        icon: <Plane className="w-5 h-5" />,
        color: "bg-sky-500",
        hex: "#0ea5e9",
      },
      {
        id: "shopping",
        label: "Shopping",
        desc: "One-time shopping for clothing, adapters, bags, luggage, and electronics",
        group: "Before Departure" as const,
        usd: costs["shopping"] || Math.round(100000 / usdToNpr),
        editable: true,
        icon: <ShoppingBag className="w-5 h-5" />,
        color: "bg-pink-500",
        hex: "#ec4899",
      },
      {
        id: "cash-in-hand",
        label: "Cash In Hand",
        desc: "FOREx cash in hand for immediate use upon arrival ($1500)",
        group: "First 6 Months" as const,
        usd: costs["cash-in-hand"] || 1500,
        editable: true,
        icon: <DollarSign className="w-5 h-5" />,
        color: "bg-amber-600",
        hex: "#d97706",
      },
      {
        id: "cost-of-living",
        label: "Cost Of Living",
        desc: "6 months on-campus housing and food included (or first few weeks living cost)",
        group: "First 6 Months" as const,
        usd: costs["cost-of-living"] || Math.round((living.rent + living.food) * 6),
        editable: false,
        icon: <Home className="w-5 h-5" />,
        color: "bg-emerald-500",
        hex: "#10b981",
      },
      {
        id: "internet-phone",
        label: "Internet & Phone",
        desc: "Monthly high-speed data, sim card, utilities and phone plan bills",
        group: "First 6 Months" as const,
        usd: costs["internet-phone"] || 300,
        editable: true,
        icon: <Wifi className="w-5 h-5" />,
        color: "bg-cyan-500",
        hex: "#06b6d4",
      },
      {
        id: "transportation",
        label: "Transportation",
        desc: "Monthly public transit pass and regular commute price",
        group: "First 6 Months" as const,
        usd: costs["transportation"] || Math.round(living.transport * 6),
        editable: true,
        icon: <Bus className="w-5 h-5" />,
        color: "bg-purple-500",
        hex: "#a855f7",
      },
      {
        id: "academic-recurring",
        label: "Academic Recurring",
        desc: "Academic printing, books/software, field trip/lab material if ongoing",
        group: "First 6 Months" as const,
        usd: costs["academic-recurring"] || 600,
        editable: true,
        icon: <Printer className="w-5 h-5" />,
        color: "bg-orange-500",
        hex: "#f97316",
      },
      {
        id: "buffer",
        label: "Buffer",
        desc: "Medical checkups, contingency savings, weather replacement clothing",
        group: "First 6 Months" as const,
        usd: costs["buffer"] || 900,
        editable: true,
        icon: <HeartPulse className="w-5 h-5" />,
        color: "bg-rose-500",
        hex: "#f43f5e",
      },
      {
        id: "local-compliance",
        label: "Local Compliance After Arrival",
        desc: "Residence permit, BRP collection, local city and health registration",
        group: "First 6 Months" as const,
        usd: costs["local-compliance"] || 300,
        editable: true,
        icon: <MapPin className="w-5 h-5" />,
        color: "bg-lime-600",
        hex: "#65a30d",
      },
    ];
    return cats;
  };

  const categories = useMemo(() => {
    const cats = getCategories();
    if (period === "Before Departure") {
      return cats.filter((c) => c.group === "Before Departure");
    } else if (period === "First 6 Months") {
      return cats.filter((c) => c.group === "First 6 Months");
    }
    return cats;
  }, [period, costs, tuitionUsd, living, usdToNpr]);

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
            <h1 className="text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-[#111827] tracking-tight leading-[1.1] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
              Estimated Cost Breakdown
            </h1>
            <p className="text-slate-500 text-[15px] md:text-[17px] leading-relaxed font-medium">
              A comprehensive view of your expected expenses for{" "}
              <span className="text-slate-700 font-bold">
                {period === "Combined Total"
                  ? "the entire journey (Before Departure + First 6 Months)"
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
              {["Before Departure", "First 6 Months", "Combined Total"].map((p) => (
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
                    {period === "Combined Total"
                      ? "Grand Total Cost"
                      : period === "Before Departure"
                        ? "Before Departure Cost"
                        : "First 6 Months Cost"}
                  </p>
                  <h2 className="text-[34px] sm:text-[42px] font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                    <AnimatedCurrency usdVal={totalUsd} usdToNpr={usdToNpr} currency={currency} period={period} />
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                    {period === "Combined Total"
                      ? "grand total"
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
              className="w-full h-[60px] rounded-2xl bg-white border border-slate-200/60 text-slate-800 font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-center gap-2.5 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 active:scale-95 group cursor-pointer"
            >
              <Download className="w-5 h-5 text-slate-400 group-hover:text-[#3686FF] transition-colors" />
              Download Full PDF Report
            </motion.button>
          </div>

          {/* Right Main Column - Charts & Breakdown */}
          <div className="lg:col-span-8">
            <Card className="rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] overflow-hidden h-full">
              <div className="p-6 sm:p-8 md:p-12">
                <h2 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 mb-10 tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                  Detailed Expense Categories
                </h2>

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
