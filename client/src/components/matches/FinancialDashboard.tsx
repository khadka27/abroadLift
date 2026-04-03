"use client";

import React, { useState, useMemo } from "react";
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
  Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";

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
  onBack
}: FinancialDashboardProps) {
  const [period, setPeriod] = useState<"First Year" | "Year on year" | "Month on month">("First Year");

  const {
    tuitionUsd,
    yearlyLivingUsd,
    setupCostsUsd,
    totalYear1Npr,
    usdToNpr,
    graduationDuration
  } = financialMetrics;

  const living = dynamicLivingCost || {
    rent: 3800,
    food: 1300,
    transport: 500,
    insurance: 320,
    other: 700
  };

  const categories = useMemo(() => {
    let multiplier = 1;
    let includeSetup = false;

    if (period === "First Year") {
      multiplier = 1;
      includeSetup = true;
    } else if (period === "Year on year") {
      // In this context, "Year on year" usually means average annual across duration
      multiplier = 1;
      includeSetup = false; 
    } else if (period === "Month on month") {
      multiplier = 1/12;
      includeSetup = false;
    }

    const cats = [
      { 
        label: "Tuition & Fees", 
        usd: Math.round(tuitionUsd * multiplier), 
        icon: <GraduationCap className="w-5 h-5" />, 
        color: "bg-blue-500", 
        textColor: "text-blue-500", 
        desc: period === "Month on month" ? "Average monthly academic expense" : "Fixed rate for 2 semesters (30 credits)" 
      },
      { 
        label: "Housing", 
        usd: Math.round(living.rent * multiplier), 
        icon: <Home className="w-5 h-5" />, 
        color: "bg-emerald-500", 
        textColor: "text-emerald-500", 
        desc: "Shared apartment with utilities included" 
      },
      { 
        label: "Food & Groceries", 
        usd: Math.round(living.food * multiplier), 
        icon: <Utensils className="w-5 h-5" />, 
        color: "bg-amber-500", 
        textColor: "text-amber-500", 
        desc: "Mix of cooking and occasional dining out" 
      },
      { 
        label: "Transportation", 
        usd: Math.round(living.transport * multiplier), 
        icon: <Bus className="w-5 h-5" />, 
        color: "bg-purple-500", 
        textColor: "text-purple-500", 
        desc: "Local transit pass and occasional rideshares" 
      },
      { 
        label: "Health Insurance", 
        usd: Math.round(living.insurance * multiplier), 
        icon: <ShieldCheck className="w-5 h-5" />, 
        color: "bg-rose-500", 
        textColor: "text-rose-500", 
        desc: "Mandatory university health plan (OSHC)" 
      },
      { 
        label: "Personal & Misc", 
        usd: Math.round(living.other * multiplier), 
        icon: <Info className="w-5 h-5" />, 
        color: "bg-slate-400", 
        textColor: "text-slate-400", 
        desc: "Entertainment, phone plan, and clothes" 
      },
    ];

    if (includeSetup) {
      cats.push({
        label: "Pre-departure & Setup",
        usd: setupCostsUsd,
        icon: <Target className="w-5 h-5" />,
        color: "bg-indigo-500",
        textColor: "text-indigo-500",
        desc: "One-time costs for Visa, SEVIS, and initial settling"
      });
    }

    return cats;
  }, [period, tuitionUsd, living, setupCostsUsd]);

  const totalUsd = useMemo(() => categories.reduce((sum, cat) => sum + cat.usd, 0), [categories]);
  const totalNpr = totalUsd * usdToNpr;

  const fmtUsd = (v: number) => 
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const fmtLakhs = (npr: number) => {
    if (period === "Month on month") {
       return new Intl.NumberFormat("en-NP", {
         style: "currency",
         currency: "NPR",
         maximumFractionDigits: 0,
       }).format(npr);
    }
    const lakhs = npr / 100000;
    return `NPR ${lakhs.toFixed(1)} Lakhs`;
  };

  // Donut chart stroke math
  const strokeData = useMemo(() => {
    let currentOffset = 0;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    
    return categories.map(cat => {
      const percentage = (cat.usd / totalUsd) * 100;
      const length = (percentage / 100) * circumference;
      const offset = (currentOffset / 100) * circumference;
      currentOffset += percentage;
      return { length, offset, circumference };
    });
  }, [categories, totalUsd]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white min-h-screen text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </div>
              Back to Dashboard
            </button>
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#111827] tracking-tight leading-tight">
              Estimated Cost Breakdown
            </h1>
            <p className="text-slate-500 max-w-2xl text-[15px] md:text-[16px] leading-relaxed">
              A comprehensive view of your expected expenses for {period === 'Month on month' ? 'each month' : period === 'Year on year' ? 'the average year' : 'the first year'}, 
              calculated based on current university data and living standards.
            </p>
          </div>

          <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 self-start md:self-center">
            {["First Year", "Year on year", "Month on month"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                  period === p 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Summary Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Total Cost Card */}
            <Card className="p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] bg-white">
              <div className="space-y-6">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    {period === "Month on month" ? "Monthly Total" : period === "First Year" ? "Total Estimated Cost" : "Average Annual Cost"}
                  </p>
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{fmtLakhs(totalNpr)}</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {period === "Month on month" ? "/ month" : period === "First Year" ? "/ 1st year" : "/ year"}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        costBand.key === 'budget' ? 'bg-emerald-500' : costBand.key === 'average' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(95, (totalYear1Npr / 10000000) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>NPR 0</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>NPR 10 crore</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-full border border-amber-100">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[12px] font-bold text-amber-700 uppercase tracking-widest leading-none">
                      {costBand.label} Cost Estimate
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Benchmarks Card (only show for Annual periods) */}
            {period !== "Month on month" && (
              <Card className="p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Cost Benchmarks</h3>
                <div className="space-y-6">
                  {[
                    { label: "High (Premium Lifestyle)", val: fmtUsd(totalUsd * 1.3), color: "bg-rose-500", w: "90%" },
                    { label: "Average (Moderate)", val: fmtUsd(totalUsd), color: "bg-amber-500", w: "65%" },
                    { label: "Low (Frugal)", val: fmtUsd(totalUsd * 0.75), color: "bg-emerald-500", w: "45%" },
                  ].map((b, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className={`text-[12px] font-bold ${b.color.replace('bg-', 'text-')}`}>{b.label}</span>
                        <span className="text-slate-900 font-bold text-[14px]">{b.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full`} style={{ width: b.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Potential Savings */}
            <Card className="p-8 rounded-[32px] border border-emerald-100 bg-emerald-50/30 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-4">
                  <TrendingDown className="w-4 h-4" />
                  Potential Savings
                </div>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p className="text-emerald-800/80 text-[13.5px] leading-relaxed">On-campus jobs can offset living costs by up to $6,000/yr.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p className="text-emerald-800/80 text-[13.5px] leading-relaxed">Opting for shared off-campus housing saves approx. $2,500/yr compared to dorms.</p>
                  </li>
                </ul>
            </Card>

            <button className="w-full h-16 rounded-[24px] bg-white border border-slate-100 text-slate-800 font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <Download className="w-5 h-5" />
              Download Full PDF Report
            </button>
          </div>

          {/* Right Main Column - Charts & Breakdown */}
          <div className="lg:col-span-8">
            <Card className="rounded-[40px] border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
               <div className="p-8 md:p-12">
                  <h2 className="text-xl font-bold text-slate-900 mb-10">Detailed Expense Categories</h2>

                  <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 mb-12">
                    {/* Donut Chart */}
                    <div className="relative w-[200px] h-[200px] shrink-0">
                      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                        {categories.map((cat, i) => {
                          const { length, offset, circumference } = strokeData[i];
                          return (
                            <circle
                              key={i}
                              cx="80"
                              cy="80"
                              r={70}
                              fill="transparent"
                              stroke={cat.color === "bg-blue-500" ? "#3b82f6" : cat.color === "bg-emerald-500" ? "#10b981" : cat.color === "bg-amber-500" ? "#f59e0b" : cat.color === "bg-purple-500" ? "#a855f7" : cat.color === "bg-rose-500" ? "#f43f5e" : cat.color === "bg-indigo-500" ? "#6366f1" : "#94a3b8"}
                              strokeWidth="16"
                              strokeDasharray={`${length} ${circumference}`}
                              strokeDashoffset={-offset}
                              className="transition-all duration-1000 ease-out"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Legend Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 flex-1 w-full">
                       {categories.map((cat, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                               <div>
                                  <p className="text-[13px] font-bold text-slate-900 leading-none mb-1">{cat.label}</p>
                                  <p className="text-[11px] font-medium text-slate-400">{((cat.usd/totalUsd)*100).toFixed(1)}%</p>
                               </div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-900">{fmtUsd(cat.usd)}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Itemized List */}
                  <div className="space-y-4">
                    {categories.map((cat, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 md:p-6 bg-slate-50/50 rounded-[24px] border border-slate-50 group hover:border-blue-100 hover:bg-white transition-all duration-500">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${cat.color} flex items-center justify-center text-white shadow-lg shadow-${cat.color.replace('bg-', '')}/20`}>
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-[15px] whitespace-nowrap overflow-hidden text-overflow-ellipsis">{cat.label}</h4>
                          <p className="text-slate-400 text-xs mt-1 truncate">{cat.desc}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[17px] font-bold text-slate-900 tracking-tight">{fmtUsd(cat.usd)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Warning Box */}
                  <div className="mt-8 p-6 bg-blue-50/30 rounded-[28px] border border-blue-50 flex gap-4">
                    <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-blue-900 text-sm mb-1.5">Inflation & Currency Warning</h5>
                      <p className="text-blue-700/70 text-[13px] leading-relaxed max-w-2xl">
                        Please note that these are estimates based on data from the last academic year. Tuition fees may increase by 3-5% annually. Additionally, if you are paying from a foreign currency, exchange rate fluctuations can impact your final cost.
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
