/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  GraduationCap,
  HeartPulse,
  ListChecks,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";

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
  const [visaGuidance, setVisaGuidance] = React.useState<VisaGuidanceItem[]>(
    [],
  );
  const [activeTab, setActiveTab] = React.useState<"overview" | "checklist">(
    "overview",
  );
  const hasFunds =
    Number.parseFloat(form.bankBalance) > 0 ||
    Number.parseFloat(form.sponsorIncome) > 0;
  const isHighRiskCountry = ["AU", "UK"].includes(
    selectedMatch.countryCode || "",
  );
  const visaCountry = selectedMatch.countryCode || form.countries[0] || "USA";
  const visaTitle = `${visaCountry} Student Visa`;

  // Dynamic Success Chance
  let successBase = 75;
  if (!hasFunds) {
    successBase -= 20;
  }
  if (Number.parseInt(form.backlogs) > 3) {
    successBase -= 10;
  }
  if (Number.parseInt(form.studyGap) > 2) {
    successBase -= 5;
  }
  if (isHighRiskCountry) {
    successBase -= 10;
  }

  const successChance = Math.max(30, Math.min(98, successBase));
  const successMeta = getSuccessMeta(successChance);
  const readinessPercent = Math.max(
    18,
    Math.min(
      96,
      successChance - (hasFunds ? 0 : 8) + (visaGuidance.length > 0 ? 2 : 0),
    ),
  );

  const guidanceList = React.useMemo(() => {
    if (visaGuidance.length > 0) return visaGuidance;

    return [
      {
        title: "Proof of Funds Mapping",
        description: `Show ${selectedMatch.countryCode === "AU" ? "AUD 28,000 - AUD 36,000" : "$22,000 - $30,000"} in liquid assets`,
        status: hasFunds ? "VERIFIED" : "REQUIRED",
      },
      {
        title: "GTE / SOP Statement",
        description: form.program
          ? `Draft strong purpose for ${form.program}`
          : "Draft strong purpose that matches academic history",
        status: form.program ? "VERIFIED" : "REQUIRED",
      },
      {
        title: "Health Insurance",
        description: `Mandatory for ${visaCountry} student visa duration`,
        status: selectedMatch.countryCode === "AU" ? "REQUIRED" : "PENDING",
      },
      {
        title: "Document Upload",
        description: form.docsReady
          ? "Upload package is ready for review"
          : "Upload the required documents to move forward",
        status: form.docsReady ? "VERIFIED" : "REQUIRED",
      },
    ];
  }, [
    visaGuidance,
    hasFunds,
    selectedMatch.countryCode,
    form.program,
    visaCountry,
  ]);

  const completedCount = guidanceList.filter(
    (item) => (item.status || item.s || "PENDING") === "VERIFIED",
  ).length;
  const totalCount = Math.max(guidanceList.length, 1);
  const missingDocs = guidanceList
    .filter((item) => (item.status || item.s || "PENDING") !== "VERIFIED")
    .slice(0, 3);

  const checklistItems = React.useMemo(() => {
    const passportReady = !!form.passportReady;
    const docsReady = !!form.docsReady;
    const fundReady = hasFunds;
    const academicReady = Number.parseFloat(form.gpa || "0") >= 2.5;
    const englishReady = form.hasEnglishTest === false || !!form.testScore;
    const intakeReady = !!form.intake;
    const healthReady =
      selectedMatch.countryCode === "AU" || selectedMatch.countryCode === "UK"
        ? !!form.scholarship || !!form.testDone
        : true;

    return [
      {
        title: "Passport",
        description: `Valid passport with enough validity for ${visaCountry}`,
        status: passportReady ? "complete" : "pending",
        icon: FileText,
      },
      {
        title: "Financial Evidence",
        description: fundReady
          ? `Bank statement and sponsor support are available for ${visaCountry}`
          : "Bank statement and sponsor support documents are still needed",
        status: fundReady ? "complete" : "loading",
        icon: Banknote,
      },
      {
        title: "Admission Offer",
        description: selectedMatch.name
          ? `${selectedMatch.name} offer is selected`
          : "Selected university offer",
        status: selectedMatch ? "complete" : "pending",
        icon: GraduationCap,
      },
      {
        title: "Academic Records",
        description: form.gpa
          ? `CGPA ${form.gpa}, transcripts, and degree certificates`
          : "Transcripts, mark sheets, and degree certificates",
        status: academicReady ? "complete" : "pending",
        icon: BookOpen,
      },
      {
        title: "English Test",
        description: englishReady
          ? `${form.testType || "English"} score is available`
          : "Add your English score before final submission",
        status: englishReady ? "complete" : "loading",
        icon: ShieldCheck,
      },
      {
        title: "Medical / Insurance",
        description: "Health coverage and required medical documents",
        status: healthReady ? "complete" : "pending",
        icon: HeartPulse,
      },
      {
        title: "Submission Pack",
        description: intakeReady
          ? "Final visa application and supporting copies"
          : "Select your intake and upload the final visa package",
        status: docsReady && intakeReady ? "complete" : "loading",
        icon: FileCheck,
      },
    ];
  }, [
    form.passportReady,
    form.docsReady,
    form.testType,
    form.testScore,
    form.hasEnglishTest,
    form.intake,
    hasFunds,
    form.gpa,
    form.scholarship,
    form.testDone,
    selectedMatch,
    visaCountry,
  ]);

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
    const code =
      selectedMatch.countryCode?.toLowerCase() ||
      form.countries[0]?.toLowerCase() ||
      "usa";
    fetch(`/api/visa-guidance?countryCode=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.steps || data.requirements)) {
          setVisaGuidance(data.steps || data.requirements);
        } else {
          setVisaGuidance([
            {
              title: "Proof of Funds Mapping",
              description: `Show ${selectedMatch.countryCode === "AU" ? "AUD 28,000 - AUD 36,000" : "$22,000 - $30,000"} in liquid assets`,
              status: hasFunds ? "VERIFIED" : "REQUIRED",
            },
            {
              title: "GTE / SOP Statement",
              description: "Draft strong purpose that matches academic history",
              status: "REQUIRED",
            },
            {
              title: "Health Insurance (OSHC/IHS)",
              description: "Mandatory for student visa duration",
              status: "PENDING",
            },
          ]);
        }
      })
      .catch(console.error);
  }, [form.countries, selectedMatch, hasFunds]);

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full px-4 pb-16 space-y-5 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center justify-between pt-2 pb-2 italic uppercase tracking-tighter">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Visa Readiness
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full bg-white border border-slate-100 px-3 py-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="text-[11px] font-black text-slate-500 tracking-[0.18em]">
            {visaTitle}
          </span>
        </div>
      </div>

      <p className="text-slate-500 text-[14px] md:text-[16px] font-medium leading-relaxed max-w-2xl">
        Track your required visa documentation. A complete and organized
        document portfolio is the single most critical factor in securing your
        student visa.
      </p>

      <div className="flex w-full max-w-full sm:max-w-85 md:max-w-90 rounded-[18px] md:rounded-[22px] bg-white border border-slate-200 shadow-sm p-1 mx-auto sm:mx-0">
        <button
          className={tabButtonClass("overview")}
          onClick={() => setActiveTab("overview")}
        >
          Readiness Overview
        </button>
        <button
          className={tabButtonClass("checklist")}
          onClick={() => setActiveTab("checklist")}
        >
          Document Checklist
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-5 lg:gap-6 items-stretch">
            <Card className="p-5 md:p-7 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.18)] bg-white overflow-hidden relative">
              <div className="absolute -right-20 -top-16 w-56 h-56 rounded-full bg-blue-50/80 blur-3xl" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 md:gap-7 items-center">
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-45 md:h-45 rounded-full bg-slate-50 flex items-center justify-center">
                    <div className="w-29 h-29 sm:w-32 sm:h-32 md:w-33 md:h-33 rounded-full border-12 border-blue-100 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent -rotate-18 flex items-center justify-center bg-white shadow-inner">
                      <div className="text-center rotate-18">
                        <div className="text-4xl md:text-5xl font-black text-slate-900 leading-none">
                          {readinessPercent}%
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                          Ready
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.18em] w-fit">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Action Required
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-[24px] md:text-[30px] font-black text-slate-900 tracking-tight leading-tight">
                      {successMeta.label}{" "}
                      <span className={successMeta.color}>Visa Readiness</span>
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed max-w-2xl">
                      You have verified {completedCount} out of {totalCount}{" "}
                      required documents. Missing critical paperwork like visa
                      forms and financial proof represents the main risk to your
                      application.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div
                      className={`inline-flex px-4 py-2 rounded-full ${successMeta.badge} text-[11px] font-black uppercase tracking-[0.18em]`}
                    >
                      {successChance}% Success Chance
                    </div>
                    <div className="inline-flex px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-[0.18em]">
                      {selectedMatch.countryCode} Destination
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 md:p-6 rounded-3xl md:rounded-[40px] border-0 shadow-[0_18px_50px_-25px_rgba(37,99,235,0.35)] bg-blue-600 text-white overflow-hidden relative">
              <div className="absolute -right-16 -top-20 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-100/90 mb-5">
                    <Sparkles className="w-4 h-4" />
                    Missing Documents
                  </div>
                  <div className="space-y-4">
                    {missingDocs.map((item) => (
                      <div
                        key={item.title || item.t}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 w-4 h-4 rounded-full border-2 border-white/25 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                        <div>
                          <p className="text-sm md:text-[15px] font-black leading-tight">
                            {item.title || item.t}
                          </p>
                          <p className="text-[12px] text-blue-100/80 leading-snug mt-1">
                            {item.description || item.d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("checklist")}
                  className="w-full h-14 rounded-[18px] bg-white text-blue-600 font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  Go to Uploads <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg md:text-[20px] font-black text-slate-900">
                Document Categories Status
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categoryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.title}
                    className="p-5 rounded-[26px] md:rounded-[30px] border border-slate-100 bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${getToneClass(card.tone)}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.18em]">
                        {card.percent}% Complete
                      </div>
                    </div>
                    <h4 className="text-[15px] md:text-[17px] font-black text-slate-900 leading-tight mb-2">
                      {card.title}
                    </h4>
                    <p className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed">
                      {card.detail}
                    </p>
                    <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProgressClass(card.tone)}`}
                        style={{ width: `${card.percent}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
            <Card className="p-5 md:p-6 rounded-3xl md:rounded-[34px] border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg md:text-[20px] font-black text-slate-900">
                  Recently Verified
                </h3>
              </div>
              <div className="space-y-3">
                {recentVerified.length > 0 ? (
                  recentVerified.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-[20px] bg-emerald-50/60 px-4 py-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-sm border border-emerald-100">
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[14px] md:text-[15px] font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-slate-500 text-[14px] font-medium">
                    No documents verified yet. Complete the checklist to
                    populate this section.
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 md:p-6 rounded-3xl md:rounded-[34px] border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <ListChecks className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg md:text-[20px] font-black text-slate-900">
                  Readiness Signals
                </h3>
              </div>
              <div className="space-y-4">
                <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                    Academics
                  </p>
                  <p className="text-[15px] font-black text-slate-900">
                    {Number.parseInt(form.backlogs) < 2
                      ? "High Trust"
                      : "Moderate"}
                  </p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                    Financials
                  </p>
                  <p
                    className={`text-[15px] font-black ${hasFunds ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {hasFunds ? "Verified" : "Gap"}
                  </p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                    Embassy Risk
                  </p>
                  <p
                    className={`text-[15px] font-black ${isHighRiskCountry ? "text-amber-600" : "text-slate-900"}`}
                  >
                    {isHighRiskCountry ? "Higher scrutiny" : "Standard review"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5">
          <Card className="p-5 md:p-7 rounded-[28px] md:rounded-[40px] border border-slate-100 shadow-sm bg-white">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-500/30">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <h4 className="font-black text-slate-900 leading-none text-base md:text-lg">
                  Document Checklist
                </h4>
                <p className="text-[12px] md:text-sm font-bold text-slate-500 italic">
                  Critical steps for {visaCountry} visa
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 mt-6">
              {checklistItems.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.title}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 md:p-6 bg-slate-50/60 rounded-3xl md:rounded-[30px] border border-slate-100 group hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1 pr-0 sm:pr-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${getChecklistClass(st.status)}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-black text-slate-900 text-[14px] md:text-[15px] tracking-tight">
                          {st.title}
                        </h5>
                        <p className="text-[11px] md:text-xs font-medium text-slate-500 leading-tight mt-1 md:mt-1.5">
                          {st.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-3 w-full sm:w-auto">
                      <span
                        className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase ${statusToneClass(st.status)}`}
                      >
                        {st.status || "PENDING"}
                      </span>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 md:p-6 rounded-3xl md:rounded-[34px] border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] md:text-[18px] font-black text-slate-900">
                Next Action
              </h3>
              <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.18em]">
                Step 1
              </div>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed">
              Review the overview tab, then upload or mark each required
              document as ready. This keeps the visa flow aligned with your
              matches journey.
            </p>
          </Card>
        </div>
      )}

      <button
        onClick={onComplete}
        className="w-full h-16 md:h-18 bg-[#3686FF] text-white rounded-3xl md:rounded-4xl font-black text-[13px] md:text-sm uppercase tracking-widest shadow-[0_20px_40px_-5px_rgba(54,134,255,0.3)] flex items-center justify-center gap-3 mt-8 md:mt-12 group hover:bg-blue-600 transition-all active:scale-95 duration-300 italic"
      >
        Generate Final Roadmap{" "}
        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
