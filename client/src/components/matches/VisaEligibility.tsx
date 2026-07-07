/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  ListChecks,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { motion } from "framer-motion";

interface VisaEligibilityProps {
  form: Form;
  selectedMatch: Match;
  onBack: () => void;
  onComplete: () => void;
}

export interface VisaGuidanceItem {
  title?: string;
  t?: string;
  description?: string;
  d?: string;
  status?: string;
  s?: string;
}

type CardTone = "blue" | "green" | "amber";

const getSuccessMeta = (successChance: number) => {
  if (successChance >= 80) {
    return {
      label: "Excellent",
      color: "text-emerald-400",
      badge: "bg-emerald-50 text-emerald-700",
    };
  }

  if (successChance >= 60) {
    return {
      label: "Moderate",
      color: "text-blue-400",
      badge: "bg-blue-50 text-blue-700",
    };
  }

  return {
    label: "High Vigilance",
    color: "text-amber-400",
    badge: "bg-amber-50 text-amber-700",
  };
};

const getChecklistClass = (status?: string) => {
  if (status === "complete") return "bg-emerald-50 text-emerald-600";
  if (status === "loading") return "bg-amber-50 text-amber-500";
  return "bg-slate-100 text-slate-400";
};

export function VisaEligibility({
  form,
  selectedMatch,
  onBack,
  onComplete,
}: VisaEligibilityProps) {
  const [visaAnalysis, setVisaAnalysis] = React.useState<{
    successChance?: number;
    readinessPercent?: number;
    label?: string;
    guidance?: VisaGuidanceItem[];
    checklist?: Array<{
      title?: string;
      description?: string;
      status?: string;
    }>;
  } | null>(null);
  const [activeTab, setActiveTab] = React.useState<"overview" | "checklist">(
    "overview",
  );
  const visaCountry = selectedMatch.countryCode || form.countries[0] || "USA";
  const visaTitle = `${visaCountry} Student Visa`;
  const isHighRiskCountry = ["AU", "UK"].includes(
    selectedMatch.countryCode || "",
  );
  const hasFunds =
    Number.parseFloat(form.bankBalance) > 0 ||
    Number.parseFloat(form.sponsorIncome) > 0;
  const successChance = visaAnalysis?.successChance ?? 0;
  const readinessPercent = visaAnalysis?.readinessPercent ?? 0;
  const successMeta = getSuccessMeta(successChance);

  const guidanceList = React.useMemo(
    () => visaAnalysis?.guidance || [],
    [visaAnalysis],
  );

  const completedCount = guidanceList.filter(
    (item) => (item.status || item.s || "PENDING") === "VERIFIED",
  ).length;
  const totalCount = Math.max(guidanceList.length, 1);
  const missingDocs = guidanceList
    .filter((item) => (item.status || item.s || "PENDING") !== "VERIFIED")
    .slice(0, 3);

  const checklistItems = React.useMemo(
    () =>
      visaAnalysis?.checklist?.map((item) => ({
        title: item.title || "Checklist Item",
        description: item.description || "",
        status: item.status || "pending",
        icon: FileCheck,
      })) || [],
    [visaAnalysis],
  );

  const categoryCards: Array<{
    title: string;
    detail: string;
    percent: number;
    icon: React.ComponentType<{ className?: string }>;
    tone: CardTone;
  }> = [
    {
      title: "Identity & Forms",
      detail: form.passportReady
        ? `Passport and forms are prepared for ${visaCountry}`
        : `Passport, DS-160, and visa forms for ${visaCountry}`,
      percent: (() => {
        if (form.passportReady) return 100;
        if (form.intake) return 62;
        return 33;
      })(),
      icon: FileText,
      tone: "blue",
    },
    {
      title: "Financial Proof",
      detail: hasFunds
        ? `Bank statements, funds, and sponsor letters are ready for ${visaCountry}`
        : "Bank statements, funds, and sponsor letters",
      percent: (() => {
        if (hasFunds) return 88;
        if (form.bankBalance) return 66;
        return 50;
      })(),
      icon: Wallet,
      tone: "green",
    },
    {
      title: "Academic Records",
      detail: form.gpa
        ? `Transcripts, offer letter, and GPA ${form.gpa}`
        : "Transcripts, offer letter, and enrollment proof",
      percent: form.gpa ? 72 : 44,
      icon: BookOpen,
      tone: "amber",
    },
  ];

  const recentVerified = [
    form.passportReady ? "Valid Passport" : null,
    form.docsReady ? "Submission Pack" : null,
    hasFunds ? "Bank Statements" : null,
    form.gpa ? "Academic Records" : null,
  ].filter(Boolean) as string[];

  React.useEffect(() => {
    let active = true;
    fetch("/api/visa-prediction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, match: selectedMatch }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!active || data?.error) return;
        setVisaAnalysis(data);
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, [form, selectedMatch]);

  const tabButtonClass = (tab: "overview" | "checklist") =>
    `flex-1 h-12 md:h-14 rounded-[18px] md:rounded-[22px] text-[12px] md:text-sm font-bold transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`;

  const getToneClass = (tone: "blue" | "green" | "amber") => {
    if (tone === "blue") return "bg-blue-50 text-blue-600";
    if (tone === "green") return "bg-emerald-50 text-emerald-600";
    return "bg-amber-50 text-amber-600";
  };

  const getProgressClass = (tone: "blue" | "green" | "amber") => {
    if (tone === "blue") return "bg-blue-500";
    if (tone === "green") return "bg-emerald-500";
    return "bg-amber-500";
  };

  const statusToneClass = (status?: string) =>
    status === "VERIFIED" ? "text-emerald-500" : "text-slate-400";

  return (
    <div className="relative min-h-screen text-slate-900 pb-24 md:pb-32 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 overflow-hidden">
      {/* Background Glowing Mesh Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-ring" />
      <div className="absolute bottom-40 right-20 w-[450px] h-[450px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-10 space-y-6 md:space-y-8 relative z-10">
        
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
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold group bg-transparent border-0 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Dashboard
            </button>
            <h1 className="text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Visa Readiness
            </h1>
            <p className="text-slate-500 text-[15px] md:text-[17px] leading-relaxed font-medium">
              Track your required visa documentation. A complete and organized document portfolio is the single most critical factor in securing your student visa.
            </p>
          </div>
          
          <div className="hidden xl:flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-[11px] font-black text-slate-500 tracking-[0.18em] uppercase">
              {visaTitle}
            </span>
          </div>
        </motion.div>

        {/* Tab Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative flex w-full max-w-full sm:max-w-[360px] rounded-[22px] bg-white border border-slate-200 p-1.5 mx-auto sm:mx-0 shadow-sm overflow-hidden">
            {["overview", "checklist"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative flex-1 h-12 rounded-[18px] text-[13px] font-extrabold transition-colors z-10 cursor-pointer ${
                  activeTab === tab ? "text-[#3686FF]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="activeVisaTab"
                    className="absolute inset-0 bg-blue-50 border border-blue-100/30 rounded-[18px] z-[-1]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab === "overview" ? "Readiness Overview" : "Document Checklist"}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "overview" ? (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6 items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 md:p-10 rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-10 items-center">
                  <div className="flex items-center justify-center relative w-40 h-40 md:w-44 md:h-44 mx-auto shrink-0 animate-float">
                    {/* Outer pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-pulse-ring pointer-events-none" />
                    
                    <svg
                      viewBox="0 0 36 36"
                      className="h-full w-full -rotate-90 transform filter drop-shadow-[0_4px_12px_rgba(54,134,255,0.15)]"
                    >
                      <defs>
                        <linearGradient id="visaCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="3.5"
                      />
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="transparent"
                        stroke="url(#visaCircleGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 16}
                        initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                        whileInView={{ strokeDashoffset: (2 * Math.PI * 16) - (readinessPercent / 100) * (2 * Math.PI * 16) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl md:text-4xl font-black text-slate-900 leading-none">
                        {readinessPercent}%
                      </span>
                      <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                        Ready
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.18em] w-fit mx-auto lg:mx-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Action Required
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-[24px] md:text-[30px] font-black text-slate-900 tracking-tight leading-tight">
                        {successMeta.label}{" "}
                        <span className={successMeta.color}>Visa Readiness</span>
                      </h2>
                      <p className="text-[14px] md:text-[15px] text-slate-500 leading-relaxed max-w-2xl font-semibold">
                        You have verified {completedCount} out of {totalCount}{" "}
                        required documents. Missing critical paperwork like visa
                        forms and financial proof represents the main risk to your
                        application.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
                      <div
                        className={`inline-flex px-4 py-2 rounded-full ${successMeta.badge} text-[11px] font-black uppercase tracking-[0.18em] border border-blue-100/30`}
                      >
                        {successChance}% Success Chance
                      </div>
                      <div className="inline-flex px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-[0.18em]">
                        {selectedMatch.countryCode} Destination
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 md:p-8 rounded-[36px] border-none bg-gradient-to-br from-indigo-600 via-blue-600 to-[#1e40af] text-white shadow-xl shadow-blue-900/20 overflow-hidden relative flex flex-col justify-between gap-6"
              >
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-100/90 mb-5">
                    Missing Documents
                  </div>
                  <div className="space-y-4">
                    {missingDocs.map((item) => (
                      <div
                        key={item.title || item.t}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 w-4.5 h-4.5 rounded-full border border-white/30 flex items-center justify-center bg-white/10 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm md:text-[15px] font-black leading-tight text-white">
                            {item.title || item.t}
                          </p>
                          <p className="text-[12px] text-blue-100/80 leading-snug mt-1 font-semibold">
                            {item.description || item.d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("checklist")}
                  className="relative z-10 w-full h-14 rounded-2xl bg-white text-blue-600 font-extrabold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-black/5 hover:bg-slate-50 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Go to Checklist <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg md:text-[20px] font-extrabold text-slate-900">
                  Document Categories Status
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="p-6 rounded-[32px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-blue-500/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${getToneClass(card.tone)}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                            {card.percent}% Complete
                          </div>
                        </div>
                        <h4 className="text-[16px] md:text-[18px] font-extrabold text-slate-900 leading-tight mb-2">
                          {card.title}
                        </h4>
                        <p className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed font-semibold">
                          {card.detail}
                        </p>
                      </div>
                      <div className="mt-6 h-2 rounded-full bg-slate-100/80 overflow-hidden border border-slate-200/20">
                        <motion.div
                          className={`h-full rounded-full ${getProgressClass(card.tone)}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${card.percent}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-6 md:p-8 rounded-[36px] border border-slate-100 bg-white shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-emerald-500 animate-bounce-slow" />
                    <h3 className="text-lg md:text-[20px] font-extrabold text-slate-900">
                      Recently Verified
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {recentVerified.length > 0 ? (
                      recentVerified.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-[22px] bg-emerald-50/60 px-5 py-4 border border-emerald-100/20"
                        >
                          <div className="w-7 h-7 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-sm border border-emerald-100">
                            <BadgeCheck className="w-4 h-4" />
                          </div>
                          <span className="text-[14px] md:text-[15px] font-bold text-slate-700">
                            {item}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-slate-500 text-sm font-semibold text-center leading-relaxed">
                        No documents verified yet. Complete the checklist to populate this section.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 md:p-8 rounded-[36px] border border-slate-100 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg md:text-[20px] font-extrabold text-slate-900">
                    Readiness Signals
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[22px] bg-slate-50 px-5 py-4.5 border border-slate-100/40">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                      Academics
                    </p>
                    <p className="text-[15px] font-black text-slate-900">
                      {Number.parseInt(form.backlogs) < 2
                        ? "High Trust Fit"
                        : "Moderate"}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 px-5 py-4.5 border border-slate-100/40">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                      Financials
                    </p>
                    <p
                      className={`text-[15px] font-black ${hasFunds ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {hasFunds ? "Fully Verified" : "Funding Gap Detected"}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 px-5 py-4.5 border border-slate-100/40">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                      Embassy Risk
                    </p>
                    <p
                      className={`text-[15px] font-black ${isHighRiskCountry ? "text-amber-600" : "text-slate-900"}`}
                    >
                      {isHighRiskCountry ? "Higher scrutiny" : "Standard review"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-6 md:p-8 rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    Document Checklist
                  </h4>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-0.5">
                    Critical steps for {visaCountry} visa
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                {checklistItems.map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <motion.div
                      key={st.title}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 md:p-6 bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] group hover:border-blue-500/20 hover:shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${getChecklistClass(st.status)}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-[15px] tracking-tight">
                            {st.title}
                          </h5>
                          <p className="text-[12px] font-semibold text-slate-400 leading-snug mt-1">
                            {st.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                        <span
                          className={`text-[10px] font-black tracking-widest uppercase ${statusToneClass(st.status)}`}
                        >
                          {st.status || "PENDING"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 rounded-[28px] border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-extrabold text-slate-900">
                  Next Action
                </h3>
                <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                  Step 1
                </div>
              </div>
              <p className="text-[14px] text-slate-500 font-semibold leading-relaxed">
                Review the overview tab, then upload or mark each required
                document as ready. This keeps the visa flow aligned with your
                matches journey.
              </p>
            </Card>
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full h-16 bg-[#3686FF] hover:bg-blue-600 text-white rounded-3xl font-extrabold text-sm uppercase tracking-widest shadow-[0_12px_30px_rgba(54,134,255,0.25)] hover:shadow-[0_15px_40px_rgba(54,134,255,0.35)] flex items-center justify-center gap-3 mt-10 transition-all duration-300 cursor-pointer"
        >
          Generate Final Roadmap
          <ArrowRight className="w-5 h-5 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
}
