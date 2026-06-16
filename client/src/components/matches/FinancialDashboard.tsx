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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { motion, animate } from "framer-motion";

// Unified component to animate currency numbers
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

    const fmt = (v: number, curr: string) =>
      new Intl.NumberFormat(curr === "NPR" ? "en-NP" : "en-US", {
        style: "currency",
        currency: curr,
        maximumFractionDigits: 0,
      }).format(v);

    const controls = animate(0, val, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(value) {
        const low = Math.max(0, Math.round(value * 0.88));
        const high = Math.round(value * 1.12);

        if (currency === "NPR") {
          if (period === "First Year" || period === "Year on year") {
            node.textContent = `NPR ${(low / 100000).toFixed(1)} - ${(high / 100000).toFixed(1)} Lakhs`;
          } else {
            node.textContent = `${fmt(low, "NPR")} - ${fmt(high, "NPR")}`;
          }
        } else {
          node.textContent = `${fmt(low, "USD")} - ${fmt(high, "USD")}`;
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
    "First Year" | "Year on year" | "Month on month"
  >("First Year");
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

  const categories = useMemo(() => {
    let multiplier = 1;
    let includeSetup = false;

    if (period === "First Year") {
      multiplier = 1;
      includeSetup = true;
    } else if (period === "Year on year") {
      multiplier = 1;
      includeSetup = false;
    } else if (period === "Month on month") {
      multiplier = 1 / 12;
      includeSetup = false;
    }

    const cats = [
      {
        label: "Tuition & Fees",
        usd: Math.round(tuitionUsd * multiplier),
        icon: <GraduationCap className="w-5 h-5" />,
        color: "bg-blue-500",
        hex: "#3b82f6",
        desc:
          period === "Month on month"
            ? "Average monthly academic expense"
            : "Fixed rate for 2 semesters (30 credits)",
      },
      {
        label: "Housing",
        usd: Math.round(living.rent * multiplier),
        icon: <Home className="w-5 h-5" />,
        color: "bg-emerald-500",
        hex: "#10b981",
        desc: "Shared apartment with utilities included",
      },
      {
        label: "Food & Groceries",
        usd: Math.round(living.food * multiplier),
        icon: <Utensils className="w-5 h-5" />,
        color: "bg-amber-500",
        hex: "#f59e0b",
        desc: "Mix of cooking and occasional dining out",
      },
      {
        label: "Transportation",
        usd: Math.round(living.transport * multiplier),
        icon: <Bus className="w-5 h-5" />,
        color: "bg-purple-500",
        hex: "#a855f7",
        desc: "Local transit pass and occasional rideshares",
      },
      {
        label: "Health Insurance",
        usd: Math.round(living.insurance * multiplier),
        icon: <ShieldCheck className="w-5 h-5" />,
        color: "bg-rose-500",
        hex: "#f43f5e",
        desc: "Mandatory university health plan",
      },
      {
        label: "Personal & Misc",
        usd: Math.round(living.other * multiplier),
        icon: <Info className="w-5 h-5" />,
        color: "bg-slate-400",
        hex: "#94a3b8",
        desc: "Entertainment, phone plan, and clothes",
      },
    ];

    if (includeSetup) {
      cats.push({
        label: "Pre-departure & Setup",
        usd: setupCostsUsd,
        icon: <Target className="w-5 h-5" />,
        color: "bg-indigo-500",
        hex: "#6366f1",
        desc: "One-time costs for Visa, SEVIS, and initial settling",
      });
    }

    return cats;
  }, [period, tuitionUsd, living, setupCostsUsd]);

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
      const percentage = (cat.usd / totalUsd) * 100;
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
                {period === "Month on month"
                  ? "each month"
                  : period === "Year on year"
                    ? "the average year"
                    : "the first year"}
              </span>
              , calculated based on current university data and living standards.
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
              {["First Year", "Year on year", "Month on month"].map((p) => (
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
                    {period === "Month on month"
                      ? "Monthly Total"
                      : period === "First Year"
                        ? "Total Estimated Cost"
                        : "Average Annual Cost"}
                  </p>
                  <h2 className="text-[34px] sm:text-[42px] font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                    <AnimatedCurrency usdVal={totalUsd} usdToNpr={usdToNpr} currency={currency} period={period} />
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                    {period === "Month on month"
                      ? "per month"
                      : period === "First Year"
                        ? "1st year"
                        : "per year"}
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
            {period !== "Month on month" && (
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
                      key={i}
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
                        <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                           <AnimatedCurrency usdVal={cat.usd} usdToNpr={usdToNpr} currency={currency} />
                        </p>
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
