import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Match, Form } from "@/types/matches";
import {
  Bell,
  Edit3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Target,
  Bookmark,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { FlagIcon } from "./FlagIcon";

interface StudyOverviewDashboardProps {
  form: Form;
  selectedMatch: Match;
  matches: Match[];
  session: any;
  USD_TO_NPR: number;
  totalYear1Npr: number;
  admissionPct: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  costBand: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admissionBand: any;
  onAdvanceToCost: () => void;
  onAdvanceToAdmission: () => void;
  onAdvanceToVisa: () => void;
  onGoToMatches: () => void;
}

export function StudyOverviewDashboard({
  form,
  selectedMatch,
  matches,
  session,
  USD_TO_NPR,
  totalYear1Npr,
  admissionPct,
  costBand,
  admissionBand,
  onAdvanceToCost,
  onAdvanceToAdmission,
  onAdvanceToVisa,
  onGoToMatches,
}: StudyOverviewDashboardProps) {
  const userName = session?.user?.name?.split(" ")[0] || form.name || "Student";
  const formatNprLakhRange = (valueNpr: number, spread = 0.12) => {
    const low = Math.max(0, Math.round(valueNpr * (1 - spread)));
    const high = Math.round(valueNpr * (1 + spread));
    return `NPR ${(low / 100000).toFixed(1)}L - NPR ${(high / 100000).toFixed(1)}L`;
  };

  // Visa Chance Logic
  const isHighRiskCountry = ["AU", "UK"].includes(
    selectedMatch.countryCode || "",
  );
  const hasFunds =
    parseFloat(form.bankBalance) > 0 || parseFloat(form.sponsorIncome) > 0;
  let visaBase = 75;
  if (!hasFunds) visaBase -= 20;
  if (parseInt(form.backlogs) > 3) visaBase -= 10;
  if (parseInt(form.studyGap) > 2) visaBase -= 5;
  if (isHighRiskCountry) visaBase -= 10;
  const visaChance = Math.max(30, Math.min(98, visaBase));
  const visaLabel =
    visaChance >= 80
      ? "Excellent"
      : visaChance >= 60
        ? "Moderate"
        : "Needs Work";

  const roadmapSteps = [
    {
      title: "Cost",
      subtitle: "Trim the first-year budget",
      detail: formatNprLakhRange(totalYear1Npr),
      action: onAdvanceToCost,
      cta: "Open breakdown",
      accent: "from-blue-500 to-cyan-500",
    },
    {
      title: "Admission",
      subtitle: `Lift your ${admissionPct}% match score`,
      detail: admissionBand.label,
      action: onAdvanceToAdmission,
      cta: "Improve profile",
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Visa",
      subtitle: "Strengthen financial proof",
      detail: `${visaChance}% readiness`,
      action: onAdvanceToVisa,
      cta: "Review visa",
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 py-5">
      <div className="max-w-7xl mx-auto px-5 mt-8 space-y-10">
        <div className="flex flex-col items-start px-2">
          {/* Back Button */}
          <button
            onClick={onGoToMatches}
            className="flex items-center gap-1.5 text-slate-500 hover:text-[#3686FF] font-medium text-[14px] transition-colors mb-4 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to matches
          </button>

          <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-100/50 text-[#3686FF] text-[12px] font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm">
            <Target className="w-4 h-4" />
            Generated from your profile
          </div>
          <h2 className="text-[28px] md:text-[36px] font-semibold text-[#111827] tracking-tight leading-tight">
            Your Preliminary Estimate
          </h2>
          <p className="text-[15px] md:text-[18px] text-slate-500 regular mt-2">
            Based on your academic profile and selected university details.
          </p>
        </div>

        {/* Selected University Details Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-200 rounded-2xl bg-white/95 px-4 py-3 shadow-sm w-full mt-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-[30px] h-[22px] rounded-[3px] overflow-hidden shadow-sm border border-black/10 flex-shrink-0">
              <FlagIcon
                countryCode={selectedMatch.countryCode || form.countries[0]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
              <span className="font-semibold text-[15px] text-slate-900 leading-none truncate max-w-[220px]">
                {selectedMatch.name}
              </span>
              <span className="text-[#3686FF] text-[13px] font-medium tracking-wide uppercase leading-none">
                {selectedMatch.countryCode || form.countries[0]}
              </span>
            </div>
          </div>
          <button
            onClick={onGoToMatches}
            className="flex items-center gap-1.5 text-[#3686FF] hover:text-blue-600 font-medium text-[13px] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Selection
          </button>
        </div>

        {/* Engine Metric Cards (Responsive Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Cost Card */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/npr-symbol.png"
                    width={24}
                    height={24}
                    alt="NPR"
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium text-slate-800 text-[16px]">
                  Estimated Cost
                </h3>
              </div>
              <div className="mt-4">
                <span className="text-[24px] font-semibold tracking-tight text-slate-900">
                  {formatNprLakhRange(totalYear1Npr)}
                </span>
                <span className="text-slate-500 font-regular text-[16px] ml-1">
                  / year
                </span>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-block bg-[#419203] px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${costBand.badgeClass}`}
                >
                  • {costBand.label}
                </span>
              </div>
              <p className="text-[14px] font-regular text-slate-500 mt-3">
                Tuition + Living
              </p>
            </div>
            <button
              onClick={onAdvanceToCost}
              className="mt-6 w-full py-3 bg-[#449D00] text-white font-medium text-[16px] rounded-[16px] transition-colors shadow-md shadow-[#63b931]/20"
            >
              View Breakdown
            </button>
          </div>

          {/* Admission Card */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center border border-red-200">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-medium  text-slate-800 text-[16px]">
                  Admission Chance
                </h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[24px] font-semibold tracking-tight text-slate-900">
                  {admissionPct}%
                </span>
                <span
                  className={`font-medium text-[16px] ${admissionBand.badgeClass.split(" ")[1] || "text-slate-600"}`}
                >
                  - {admissionBand.label}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full ${admissionBand.badgeClass.split(" ")[0].replace("bg-", "bg-") || "bg-blue-500"}`}
                  style={{ width: `${admissionPct}%` }}
                ></div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Good GPA Match
                </div>
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Improve English bounds
                </div>
              </div>
            </div>
            <button
              onClick={onAdvanceToAdmission}
              className="mt-4 w-full py-3 bg-[#F89D35]  text-white font-medium text-[16px] rounded-[16px] transition-colors shadow-md shadow-[#ff9f43]/20"
            >
              See Details
            </button>
          </div>

          {/* Visa Readiness Card */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/visa-logo.png"
                    width={24}
                    height={24}
                    alt="Visa"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-slate-800 text-[16px]">
                  Visa Readiness
                </h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[24px] font-black tracking-tight text-slate-900">
                  {visaChance}%
                </span>
                <span className="font-medium text-sm text-blue-500">
                  - {visaLabel}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${visaChance}%` }}
                ></div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strong Academics
                </div>
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Financial Proof Req.
                </div>
              </div>
            </div>
            <button
              onClick={onAdvanceToVisa}
              className="mt-4 w-full py-3 bg-[#3686FF] text-white font-medium text-[16px] rounded-[16px] transition-colors shadow-md shadow-blue-500/20"
            >
              Improve Chance
            </button>
          </div>
        </div>

        {/* Final Roadmap */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-[#10213d] p-6 md:p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,134,255,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_28%)]" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">
                <Sparkles className="w-4 h-4" /> Final Roadmap
              </div>
              <h3 className="mt-4 text-[28px] md:text-[34px] font-semibold text-white tracking-tight leading-tight max-w-2xl">
                A focused plan to raise admission chances and keep your costs
                under control.
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-slate-300">
                Use the roadmap below to move from estimate to action in three
                steps: cost, admission, and visa readiness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:max-w-[58%]">
              {roadmapSteps.map((step) => (
                <button
                  key={step.title}
                  onClick={step.action}
                  className="group text-left rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <div
                    className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${step.accent} mb-4`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                        Step
                      </p>
                      <h4 className="mt-1 text-[18px] font-semibold text-white">
                        {step.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                    {step.subtitle}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-[13px] font-bold text-white">
                      {step.detail}
                    </span>
                    <span className="text-[12px] font-semibold text-sky-300">
                      {step.cta}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Universities */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div className="space-y-1">
              <h2 className="text-[20px] font-semibold text-slate-900">
                Recommended Universities
              </h2>
              <p className="text-[14px] font-regular text-slate-500">
                Based on your profile & budget
              </p>
            </div>
            <Link
              href="/matches"
              className="text-[#3686FF] text-[14px] font-semibold hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 3).map((uni, idx) => {
              const costUsd = Math.round(
                uni.currency === "NPR"
                  ? (uni.tuitionFee || 22000) / USD_TO_NPR
                  : uni.tuitionFee || 22000,
              );
              const costNpr = Math.round(costUsd * USD_TO_NPR);
              const matchScore = Math.max(
                70,
                Math.round((uni.admissionRate || 65) + Math.random() * 10),
              );

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_12px_35px_rgba(15,23,42,0.06)] flex flex-col"
                >
                  <div className="h-[140px] relative bg-slate-200">
                    <Image
                      src={uni.banner || uni.logo || "/uni-default.webp"}
                      alt={uni.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 border-b border-black/10" />
                    <div className="absolute top-3 right-3 bg-white text-[#3686FF] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {matchScore}% Match
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-[46px] h-[46px] rounded-full border border-slate-100 overflow-hidden shadow-sm flex-shrink-0 bg-white flex items-center justify-center p-1.5">
                        <Image
                          src={uni.logo || "/uni-default.webp"}
                          width={40}
                          height={40}
                          alt="logo"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[17px] text-slate-900 leading-tight mb-1 truncate max-w-[220px]">
                          {uni.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5" /> {uni.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mb-5 mt-auto">
                      <div className="font-semibold text-[15px] text-slate-900 leading-tight">
                        {formatNprLakhRange(costNpr, 0.1)}
                        <span className="text-[12px] font-regular text-slate-500">
                          {" "}
                          / year
                        </span>
                      </div>
                      <span
                        className={`text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm ${idx % 2 === 0 ? "bg-[#ff0000]" : "bg-[#4CAF50]"}`}
                      >
                        {idx % 2 === 0 ? "Most Popular" : "Lowest Fees"}
                      </span>
                    </div>

                    <button className="w-full bg-[#3686FF] hover:bg-blue-600 text-white font-semibold text-[14px] py-3 rounded-[14px] shadow-sm mb-3 flex items-center justify-center gap-1.5 transition-all">
                      Select University <span>&rarr;</span>
                    </button>

                    <button className="w-full text-slate-400 hover:text-slate-600 font-semibold text-[13px] transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
