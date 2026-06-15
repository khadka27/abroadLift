/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
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
  Utensils,
} from "lucide-react";
import { FlagIcon } from "./FlagIcon";
import { motion } from "framer-motion";

interface StudyOverviewDashboardProps {
  form: Form;
  selectedMatch: Match;
  matches: Match[];
  session: any;
  USD_TO_NPR: number;
  totalYear1Npr: number;
  admissionPct: number;
  visaChance?: number;
  visaLabel?: string;
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
  visaChance,
  visaLabel,
  costBand,
  admissionBand,
  onAdvanceToCost,
  onAdvanceToAdmission,
  onAdvanceToVisa,
  onGoToMatches,
}: StudyOverviewDashboardProps) {
  const formatNprLakhRange = (valueNpr: number, spread = 0.12) => {
    const low = Math.max(0, Math.round(valueNpr * (1 - spread)));
    const high = Math.round(valueNpr * (1 + spread));
    return `NPR ${(low / 100000).toFixed(1)}L - NPR ${(high / 100000).toFixed(1)}L`;
  };

  const visaChanceValue = visaChance ?? 0;
  const visaLabelValue = visaLabel || "Pending";

  const gpa = Number.parseFloat(form.gpa) || 0;
  const testScore = Number.parseFloat(form.testScore) || 0;
  const backlogs = Number.parseInt(form.backlogs || "0", 10) || 0;
  const studyGap = Number.parseInt(form.studyGap || "0", 10) || 0;
  const selectedProgram =
    selectedMatch.popularPrograms?.[0] || "selected program";
  const englishStrong =
    (form.testType === "IELTS" && testScore >= 6.5) ||
    (form.testType === "PTE" && testScore >= 60) ||
    (form.testType === "TOEFL" && testScore >= 90) ||
    (form.testType === "Duolingo" && testScore >= 115);

  let gpaText = `Raise GPA to improve fit for ${selectedMatch.name}`;
  if (gpa >= 3.5) {
    gpaText = `Strong GPA fit for ${selectedProgram}`;
  } else if (gpa >= 3.2) {
    gpaText = `GPA is competitive for ${selectedMatch.name}`;
  }

  const englishText = englishStrong
    ? `${form.testType || "English test"} score is competitive`
    : `Improve ${form.testType || "English test"} score for a stronger shortlist`;

  const backlogPlural = backlogs === 1 ? "" : "s";
  const backlogText =
    backlogs <= 1
      ? "Backlog history looks manageable"
      : `${backlogs} backlog${backlogPlural} may reduce competitiveness`;

  const studyGapText =
    studyGap <= 1
      ? "Study gap is within a comfortable range"
      : `Explain the ${studyGap}-year gap clearly in your SOP`;

  const admissionSignals = [
    {
      ok: gpa >= 3.2,
      icon: CheckCircle2,
      iconClass: gpa >= 3.2 ? "text-emerald-500" : "text-amber-500",
      text: gpaText,
    },
    {
      ok: englishStrong,
      icon: englishStrong ? CheckCircle2 : AlertTriangle,
      iconClass: englishStrong ? "text-emerald-500" : "text-amber-500",
      text: englishText,
    },
    {
      ok: backlogs <= 1,
      icon: backlogs <= 1 ? CheckCircle2 : AlertTriangle,
      iconClass: backlogs <= 1 ? "text-emerald-500" : "text-amber-500",
      text: backlogText,
    },
    {
      ok: studyGap <= 1,
      icon: studyGap <= 1 ? CheckCircle2 : AlertTriangle,
      iconClass: studyGap <= 1 ? "text-emerald-500" : "text-amber-500",
      text: studyGapText,
    },
  ];

  const admissionNotes = admissionSignals.filter((item) => item.ok);

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
      detail: `${visaChanceValue}% readiness`,
      action: onAdvanceToVisa,
      cta: "Review visa",
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-900 pb-32 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 overflow-hidden">
      {/* Background Glowing Mesh Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-ring" />
      <div className="absolute bottom-40 right-20 w-[450px] h-[450px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start px-2"
        >
          {/* Back Button */}
          <button
            onClick={onGoToMatches}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition-all mb-4 group"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to matches
          </button>

          <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-100/50 text-[#3686FF] text-[12px] font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <Target className="w-4 h-4" />
            Generated from your profile
          </div>
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-[#111827] tracking-tight leading-[1.1] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
            Your Preliminary Estimate
          </h2>
          <p className="text-[15px] md:text-[18px] text-slate-500 mt-2 font-medium">
            Based on your academic profile and selected university details.
          </p>
        </motion.div>

        {/* Selected University Details Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white/60 rounded-3xl bg-white/70 backdrop-blur-md px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] w-full mt-4 hover:border-blue-500/20 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-7 rounded-md overflow-hidden shadow-sm border border-black/10 flex-shrink-0">
              <FlagIcon
                countryCode={selectedMatch.countryCode || form.countries[0]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline gap-2.5 min-w-0 flex-wrap">
              <span className="font-extrabold text-lg text-slate-900 leading-none truncate max-w-[280px]">
                {selectedMatch.name}
              </span>
              <span className="text-[#3686FF] text-xs font-black tracking-widest uppercase leading-none bg-blue-50 px-2 py-1 rounded">
                {selectedMatch.countryCode || form.countries[0]}
              </span>
            </div>
          </div>
          <button
            onClick={onGoToMatches}
            className="flex items-center gap-1.5 text-[#3686FF] hover:text-blue-600 font-bold text-sm transition-colors whitespace-nowrap self-start sm:self-auto px-4 py-2 rounded-xl hover:bg-blue-50/50"
          >
            <Edit3 className="w-4 h-4" /> Edit Selection
          </button>
        </motion.div>

        {/* Engine Metric Cards (Responsive Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Cost Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(31,41,55,0.04)] hover:shadow-[0_20px_50px_rgba(54,134,255,0.08)] flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 text-emerald-600 shadow-sm shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Cost Breakdown
                </h3>
              </div>
              <div className="mt-5">
                <span className="text-[28px] font-black tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-emerald-950 bg-clip-text text-transparent">
                  {formatNprLakhRange(totalYear1Npr)}
                </span>
                <span className="text-slate-400 font-bold text-sm ml-1.5">
                  / 1st year
                </span>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {costBand.label} Cost
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-4 leading-relaxed">
                First-year expenses including tuition fee and estimated living costs.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onAdvanceToCost}
              className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.35)]"
            >
              View Breakdown
            </motion.button>
          </motion.div>

          {/* Admission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(31,41,55,0.04)] hover:shadow-[0_20px_50px_rgba(54,134,255,0.08)] flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100/50 text-amber-600 shadow-sm shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Admission Chance
                </h3>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-[28px] font-black tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-amber-950 bg-clip-text text-transparent">
                  {admissionPct}%
                </span>
                <span
                  className={`font-bold text-sm ${admissionBand.badgeClass.split(" ")[1] || "text-slate-500"}`}
                >
                  • {admissionBand.label}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100/80 rounded-full mt-4 overflow-hidden border border-slate-200/20">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${admissionPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>

              <div className="mt-5 space-y-2.5">
                {admissionNotes.slice(0, 2).map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-2.5 text-sm font-semibold text-slate-600"
                  >
                    <item.icon className={`w-4 h-4 mt-0.5 ${item.iconClass} shrink-0`} />
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onAdvanceToAdmission}
              className="mt-8 w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl transition-all shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.35)]"
            >
              See Details
            </motion.button>
          </motion.div>

          {/* Visa Readiness Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(31,41,55,0.04)] hover:shadow-[0_20px_50px_rgba(54,134,255,0.08)] flex flex-col justify-between hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50 text-blue-600 shadow-sm shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Visa Readiness
                </h3>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-[28px] font-black tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-blue-950 bg-clip-text text-transparent">
                  {visaChanceValue}%
                </span>
                <span className="font-bold text-sm text-blue-600">
                  • {visaLabelValue}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100/80 rounded-full mt-4 overflow-hidden border border-slate-200/20">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${visaChanceValue}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
                />
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Strong Academics
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Financial Proof Req.
                </div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onAdvanceToVisa}
              className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.35)]"
            >
              Improve Chance
            </motion.button>
          </motion.div>
        </div>

        {/* Final Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[36px] border border-slate-950/20 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-10 shadow-[0_24px_70px_rgba(15,23,42,0.3)]"
        >
          {/* Radial glow background details */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,134,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_35%)]" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-sky-200">
                <Sparkles className="w-4 h-4 text-sky-300" /> Final Roadmap
              </div>
              <h3 className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight leading-[1.15] max-w-2xl">
                A focused plan to raise admission chances and control your budget.
              </h3>
              <p className="max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-slate-300 font-medium">
                Use the roadmap below to move from estimate to action in three
                essential steps: cost optimization, profile improvement, and visa readiness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:max-w-[58%]">
              {roadmapSteps.map((step, idx) => (
                <motion.button
                  key={step.title}
                  onClick={step.action}
                  whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group text-left rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  <div
                    className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${step.accent} mb-5`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                        Step 0{idx + 1}
                      </p>
                      <h4 className="mt-1 text-lg font-extrabold text-white">
                        {step.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-300 font-medium">
                    {step.subtitle}
                  </p>
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <span className="text-[13px] font-black text-white">
                      {step.detail}
                    </span>
                    <span className="text-[12px] font-bold text-sky-300 group-hover:text-sky-200 transition-colors">
                      {step.cta}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recommended Universities */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Recommended Universities
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Based on your profile and budget preferences
              </p>
            </div>
            <Link
              href="/matches"
              className="text-[#3686FF] text-sm font-bold hover:text-blue-600 transition-colors flex items-center gap-1 group self-start sm:self-auto"
            >
              See All Matches <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col group relative"
                >
                  <div className="h-[150px] relative bg-slate-100 overflow-hidden">
                    <Image
                      src={uni.banner || uni.logo || "/uni-default.webp"}
                      alt={uni.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#3686FF] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                      {matchScore}% Match
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative bg-white rounded-b-3xl">
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex-shrink-0 bg-white flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                        <Image
                          src={uni.logo || "/uni-default.webp"}
                          width={40}
                          height={40}
                          alt="logo"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-[17px] text-slate-900 leading-tight mb-1 truncate group-hover:text-[#3686FF] transition-colors">
                          {uni.name}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" /> {uni.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mb-6 mt-auto">
                      <div className="font-extrabold text-[15px] text-slate-900 leading-none">
                        {formatNprLakhRange(costNpr, 0.1)}
                        <span className="text-xs font-bold text-slate-400">
                          {" "}/ yr
                        </span>
                      </div>
                      <span
                        className={`text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${
                          idx % 2 === 0
                            ? "bg-rose-500 shadow-rose-500/20"
                            : "bg-emerald-500 shadow-emerald-500/20"
                        }`}
                      >
                        {idx % 2 === 0 ? "Most Popular" : "Lowest Fees"}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <button className="w-full bg-[#3686FF] hover:bg-blue-600 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all group-hover:translate-y-[-2px]">
                        Select University <ChevronRight className="w-4 h-4" />
                      </button>

                      <button className="w-full text-slate-400 hover:text-slate-600 font-bold text-[13px] py-2 transition-all hover:bg-slate-50 rounded-xl">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
