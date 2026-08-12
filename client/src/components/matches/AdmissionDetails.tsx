/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ArrowRight,
  TrendingUp,
  XCircle,
  Award,
  Sparkles,
  Coins,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { motion, animate } from "framer-motion";
import { Scholarship } from "@/lib/api/abroadlift";
import { evaluateScholarship } from "@/lib/scholarship-evaluator";

function AnimatedPercentRange({ lower, upper }: { lower: number; upper: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, 1, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = `${Math.round(lower * v)}% - ${Math.round(upper * v)}%`;
      },
    });
    return () => controls.stop();
  }, [lower, upper]);
  return <span ref={nodeRef}>0% - 0%</span>;
}

function AnimatedPercent({ val }: { val: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, val, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = `${Math.round(v)}%`;
      },
    });
    return () => controls.stop();
  }, [val]);
  return <span ref={nodeRef}>0%</span>;
}

interface AdmissionDetailsProps {
  form: Form;
  selectedMatch: Match;
  admissionPct: number;
  admissionBand: { label: string; colorName?: string; badgeClass?: string };
  onBack: () => void;
  onAdvanceToVisa: () => void;
  admissionAnalysis?: any;
}

function scoreTierValue(
  strong: boolean,
  moderate: boolean,
  values: { strong: number; moderate: number; low: number },
) {
  if (strong) return values.strong;
  if (moderate) return values.moderate;
  return values.low;
}

function scoreTierLabel(
  strong: boolean,
  moderate: boolean,
  labels: { strong: string; moderate: string; low: string },
) {
  if (strong) return labels.strong;
  if (moderate) return labels.moderate;
  return labels.low;
}

export function AdmissionDetails({
  form,
  selectedMatch,
  admissionPct,
  admissionBand,
  onBack,
  onAdvanceToVisa,
  admissionAnalysis,
}: AdmissionDetailsProps) {
  const gpa = Number.parseFloat(form.gpa) || 0;
  const testScore = Number.parseFloat(form.testScore) || 0;
  const backlogs = Number.parseInt(form.backlogs || "0", 10) || 0;
  const studyGap = Number.parseInt(form.studyGap || "0", 10) || 0;

  const [scholarships, setScholarships] = React.useState<Scholarship[]>([]);
  const [loadingSchol, setLoadingSchol] = React.useState(true);

  useEffect(() => {
    async function loadLiveScholarships() {
      try {
        const res = await fetch("/api/scholarships?limit=4");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setScholarships(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load active scholarships:", err);
      } finally {
        setLoadingSchol(false);
      }
    }
    loadLiveScholarships();
  }, []);

  const isGpaStrong = gpa >= 3.2;
  const isGpaModerate = gpa >= 2.8;
  const isTestStrong =
    (form.testType === "IELTS" && testScore >= 6.5) ||
    (form.testType === "PTE" && testScore >= 60) ||
    (form.testType === "TOEFL" && testScore >= 90) ||
    (form.testType === "Duolingo" && testScore >= 115);
  const isTestModerate =
    (form.testType === "IELTS" && testScore >= 6) ||
    (form.testType === "PTE" && testScore >= 55) ||
    (form.testType === "TOEFL" && testScore >= 80) ||
    (form.testType === "Duolingo" && testScore >= 105);

  const gpaBoost = scoreTierValue(isGpaStrong, isGpaModerate, {
    strong: 20,
    moderate: 12,
    low: 6,
  });
  const testBoost = scoreTierValue(isTestStrong, isTestModerate, {
    strong: 15,
    moderate: 9,
    low: 4,
  });
  const testFactorBase = scoreTierValue(isTestStrong, isTestModerate, {
    strong: 86,
    moderate: 68,
    low: 44,
  });
  const gpaStatus = scoreTierLabel(isGpaStrong, isGpaModerate, {
    strong: "Excellent",
    moderate: "Moderate",
    low: "Needs Work",
  });
  const testStatus = scoreTierLabel(isTestStrong, isTestModerate, {
    strong: "Excellent",
    moderate: "Moderate",
    low: "Low",
  });

  const isEligible = admissionAnalysis?.factors ? admissionAnalysis.factors.isEligible : true;

  const rawProfileScore = Math.max(
    30,
    Math.min(
      95,
      Math.round(
        admissionPct * 0.6 + gpaBoost + testBoost - backlogs * 2 - studyGap * 2,
      ),
    ),
  );
  const profileScore = isEligible ? rawProfileScore : 0;

  const lowerBand = isEligible ? Math.max(5, Math.min(95, Math.round(admissionPct - 7))) : 0;
  const upperBand = isEligible ? Math.max(
    lowerBand + 5,
    Math.min(98, Math.round(admissionPct + 8)),
  ) : 0;

  const gpaFactor = Math.max(
    25,
    Math.min(95, Math.round((gpa / (gpa <= 4 ? 4 : 10)) * 100)),
  );
  const testFactor = Math.max(20, Math.min(95, Math.round(testFactorBase)));

  const finalAcademicScore = admissionAnalysis?.factors
    ? admissionAnalysis.factors.academicScore
    : gpaFactor;
  const finalEnglishScore = admissionAnalysis?.factors
    ? admissionAnalysis.factors.englishScore
    : testFactor;

  let academicStatus = gpaStatus;
  let englishStatus = testStatus;

  if (admissionAnalysis?.factors) {
    academicStatus = `${finalAcademicScore}%`;
    englishStatus = `${finalEnglishScore}%`;
    if (admissionAnalysis.factors.actualGpa < admissionAnalysis.factors.requiredGpa) {
      academicStatus = "Ineligible (Below Minimum)";
    }
    if (admissionAnalysis.factors.actualIelts < admissionAnalysis.factors.requiredIelts) {
      englishStatus = "Ineligible (Below Minimum)";
    }
  }

  const recommendationFactor = Math.max(
    35,
    Math.min(95, Math.round(70 - backlogs * 4 + (studyGap === 0 ? 10 : 0))),
  );
  const extracurricularFactor = Math.max(
    20,
    Math.min(95, Math.round(62 - studyGap * 4 + (backlogs === 0 ? 8 : 0))),
  );

  const strengths: string[] = [];
  const risks: string[] = [];

  if (isGpaStrong && isEligible)
    strengths.push("Strong academic performance aligns with target programs.");
  if (isTestStrong && isEligible)
    strengths.push(
      `${form.testType || "English test"} score is competitive for this intake.`,
    );
  if (backlogs <= 1)
    strengths.push("Academic history is consistent with low backlog risk.");
  if (studyGap <= 1)
    strengths.push(
      "Study timeline appears stable for visa and admission review.",
    );

  if (!isTestStrong || !isEligible)
    risks.push("Language score can be improved to raise acceptance odds.");
  if (!isGpaStrong || !isEligible)
    risks.push(
      "Academic score is slightly below top-tier preference benchmarks.",
    );
  if (backlogs > 2)
    risks.push(
      "Higher backlog count may reduce competitiveness for selective programs.",
    );
  if (studyGap > 2)
    risks.push("Long study gap may need stronger SOP justification.");

  if (strengths.length === 0) {
    strengths.push(
      "Profile has a balanced base to build on with targeted improvements.",
    );
  }

  if (risks.length === 0) {
    risks.push(
      "Keep application quality high across SOP, LORs, and deadlines.",
    );
  }

  const trendYears = [2021, 2022, 2023, 2024, 2025, 2026];
  const trendValues = trendYears.map((_, index) => {
    const wave = Math.sin(index * 1.2) * 4;
    const base = admissionPct + (4 - index * 1.5);
    return Math.max(10, Math.min(95, Math.round(base + wave)));
  });

  const rawMin = Math.min(...trendValues);
  const rawMax = Math.max(...trendValues);
  const yTickMin = Math.max(0, Math.floor((rawMin - 6) / 10) * 10);
  const yTickMax = Math.min(100, Math.ceil((rawMax + 6) / 10) * 10);
  const ySpan = Math.max(10, yTickMax - yTickMin);

  const yTicks = [
    yTickMax,
    Math.round(yTickMin + ySpan * 0.75),
    Math.round(yTickMin + ySpan * 0.50),
    Math.round(yTickMin + ySpan * 0.25),
    yTickMin,
  ];

  const svgWidth = 560;
  const svgHeight = 220;
  const plotLeft = 50;
  const plotRight = 525;
  const plotTop = 35;
  const plotBottom = 175;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const trendPointsArr = trendValues.map((val, index) => {
    const x = plotLeft + (index / (trendValues.length - 1)) * plotWidth;
    const y = plotBottom - ((val - yTickMin) / ySpan) * plotHeight;
    return { x, y, val };
  });

  const getBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const bezierPath = getBezierPath(trendPointsArr);

  const factorRows = [
    {
      label: "Academic Fit Score (60% Weight)",
      value: finalAcademicScore,
      status: academicStatus,
      bar: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Language Fit Score (40% Weight)",
      value: finalEnglishScore,
      status: englishStatus,
      bar: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      label: "Recommendations",
      value: recommendationFactor,
      status: recommendationFactor >= 75 ? "Very Good" : "Moderate",
      bar: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      label: "Extracurriculars",
      value: extracurricularFactor,
      status: extracurricularFactor >= 70 ? "Strong" : "Improving",
      bar: "bg-rose-500",
      textColor: "text-rose-600",
    },
  ];

  const profileScoreCircumference = 2 * Math.PI * 16;
  const profileScoreOffset = profileScoreCircumference - (profileScore / 100) * profileScoreCircumference;

  return (
    <div className="relative min-h-screen text-slate-900 pb-24 md:pb-32 bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Background Dot Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none -z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-10 space-y-6 md:space-y-8 relative z-10">
        
        {/* Header Navigation & Institution Context Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#3366FF] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-xs group-hover:border-[#3366FF]/30 group-hover:bg-blue-50 transition-all">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-slate-700 group-hover:text-[#3366FF]" />
              </div>
              Back to Dashboard
            </button>

            {/* Quick Context Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-bold shadow-xs">
                GPA: <strong className="text-slate-900">{form.gpa}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-bold shadow-xs">
                {form.testType || "Language"}: <strong className="text-slate-900">{form.testScore || "Not specified"}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#3366FF] text-[11px] font-black uppercase tracking-wider">
                {selectedMatch.countryCode || "Canada"}
              </span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#3366FF] text-[10px] font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Admissions Evaluation Engine
            </div>
            <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-black text-slate-900 tracking-tight leading-[1.05]">
              Admission Chances{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: "2px #3366FF", color: "transparent" }}
              >
                Analysis.
              </span>
            </h1>
            <p className="text-slate-500 text-[15px] md:text-[17px] leading-relaxed font-medium max-w-3xl mt-2">
              Comprehensive profile evaluation for{" "}
              <strong className="text-slate-900 font-extrabold">{selectedMatch.name}</strong>{" "}
              ({selectedMatch.popularPrograms?.[0] || form.program || "Target Program"}). Based on academic benchmarks, language thresholds, and cohort trends.
            </p>
          </div>
        </motion.div>

        {/* Main Probability Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[32px] border border-slate-200/80 bg-white shadow-[0_16px_50px_rgba(0,0,0,0.03)] relative overflow-hidden p-6 md:p-10"
        >
          {/* Top border accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${isEligible ? "bg-[#3366FF]" : "bg-rose-500"}`} />

          {!isEligible && admissionAnalysis?.factors ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Ineligible - Below Minimum Entry Benchmark
                </div>
                <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-black text-rose-600 tracking-tight leading-none mb-4">
                  Below Requirements
                </h2>
                <div className="text-slate-600 text-[14px] md:text-[15px] max-w-2xl font-medium leading-relaxed space-y-4">
                  <p>
                    Your current credentials do not meet the minimum entry requirements set by{" "}
                    <strong className="text-slate-900 font-bold">{selectedMatch.name}</strong>.
                  </p>
                  <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3 text-sm">
                    <h4 className="font-bold text-rose-900 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      Required vs. Actual Credentials:
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-rose-900/90 font-medium">
                      {admissionAnalysis.factors.actualIelts < admissionAnalysis.factors.requiredIelts && (
                        <li>
                          <strong>Language Threshold:</strong> College requires minimum IELTS equivalent of{" "}
                          <span className="font-black text-rose-700">{admissionAnalysis.factors.requiredIelts}</span> (Your score:{" "}
                          <span className="font-black text-rose-700">{admissionAnalysis.factors.actualIelts}</span>).
                        </li>
                      )}
                      {admissionAnalysis.factors.actualGpa < admissionAnalysis.factors.requiredGpa && (
                        <li>
                          <strong>GPA Threshold:</strong> College requires minimum GPA equivalent of{" "}
                          <span className="font-black text-rose-700">{admissionAnalysis.factors.requiredGpa}</span> (Your GPA:{" "}
                          <span className="font-black text-rose-700">{admissionAnalysis.factors.actualGpa.toFixed(2)}</span>).
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative h-[150px] w-[150px] shrink-0 mx-auto md:mx-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#ef4444" strokeWidth="3" strokeDasharray={profileScoreCircumference} strokeDashoffset={profileScoreCircumference} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <XCircle className="w-8 h-8 text-rose-500 mb-1" />
                  <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Ineligible</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Acceptance Probability
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                    {admissionBand.label}
                  </span>
                </div>

                <h2 className="text-[44px] sm:text-[56px] md:text-[64px] font-black text-[#3366FF] tracking-tight leading-none">
                  <AnimatedPercentRange lower={lowerBand} upper={upperBand} />
                </h2>

                <p className="text-slate-600 text-[14px] md:text-[15px] max-w-2xl font-medium leading-relaxed">
                  Calculated based on your <strong className="text-slate-900 font-bold">GPA {form.gpa}</strong>,{" "}
                  <strong className="text-slate-900 font-bold">{form.testType || "Language"} {form.testScore}</strong>, and historical acceptance data for{" "}
                  <strong className="text-slate-900 font-bold">{selectedMatch.name}</strong>.
                </p>

                {/* Sub-Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Academic Fit: {academicStatus}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Language Fit: {englishStatus}
                  </span>
                </div>
              </div>

              {/* Concentric Progress Ring */}
              <div className="relative h-[150px] w-[150px] md:h-[170px] md:w-[170px] shrink-0 mx-auto md:mx-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="16"
                    fill="transparent"
                    stroke="#3366FF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={profileScoreCircumference}
                    initial={{ strokeDashoffset: profileScoreCircumference }}
                    whileInView={{ strokeDashoffset: profileScoreOffset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[32px] md:text-[38px] font-black text-slate-900 leading-none">
                    <AnimatedPercent val={profileScore} />
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Profile Fit</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* 2-Column Balanced Analytical Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Column (Radar Competitiveness Map & Historical Trends) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Competitiveness Radar + Factors Card */}
            <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs">
              <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">
                Profile Competitiveness Breakdown
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Radar Visual */}
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/60 p-6 flex flex-col justify-center items-center">
                  <p className="mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Visual Balance Map
                  </p>
                  <div className="w-full max-w-[260px] h-[210px] flex items-center justify-center relative">
                    <svg viewBox="-20 -10 140 120" className="w-full h-full overflow-visible">
                      <polygon points="50,10 88,38 74,82 26,82 12,38" fill="rgba(241, 245, 249, 0.6)" stroke="#cbd5e1" strokeWidth="1" />
                      <polygon points="50,23.3 75.3,42 66,71.3 34,71.3 24.7,42" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
                      <polygon points="50,36.7 62.7,46 58,60.7 42,60.7 37.3,46" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

                      <line x1="50" y1="50" x2="50" y2="10" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="50" y1="50" x2="88" y2="38" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="50" y1="50" x2="74" y2="82" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="50" y1="50" x2="26" y2="82" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="50" y1="50" x2="12" y2="38" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" />

                      <text x="50" y="-2" textAnchor="middle" fontSize="7" fontWeight="900" fill="#475569">ACADEMIC</text>
                      <text x="93" y="40" textAnchor="start" fontSize="7" fontWeight="900" fill="#475569">LANGUAGE</text>
                      <text x="74" y="93" textAnchor="middle" fontSize="7" fontWeight="900" fill="#475569">RECS</text>
                      <text x="26" y="93" textAnchor="middle" fontSize="7" fontWeight="900" fill="#475569">EXTRA</text>
                      <text x="7" y="40" textAnchor="end" fontSize="7" fontWeight="900" fill="#475569">OVERALL</text>

                      <motion.polygon
                        points={`${50},${50 - 40 * (gpaFactor / 100)} ${50 + 40 * (testFactor / 100) * 0.951},${50 - 40 * (testFactor / 100) * 0.309} ${50 + 40 * (recommendationFactor / 100) * 0.588},${50 + 40 * (recommendationFactor / 100) * 0.809} ${50 - 40 * (extracurricularFactor / 100) * 0.588},${50 + 40 * (extracurricularFactor / 100) * 0.809} ${50 - 40 * (profileScore / 100) * 0.951},${50 - 40 * (profileScore / 100) * 0.309}`}
                        fill="rgba(51, 102, 255, 0.2)"
                        stroke="#3366FF"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ transformOrigin: "50px 50px" }}
                      />

                      {[
                        `${50},${50 - 40 * (gpaFactor / 100)}`,
                        `${50 + 40 * (testFactor / 100) * 0.951},${50 - 40 * (testFactor / 100) * 0.309}`,
                        `${50 + 40 * (recommendationFactor / 100) * 0.588},${50 + 40 * (recommendationFactor / 100) * 0.809}`,
                        `${50 - 40 * (extracurricularFactor / 100) * 0.588},${50 + 40 * (extracurricularFactor / 100) * 0.809}`,
                        `${50 - 40 * (profileScore / 100) * 0.951},${50 - 40 * (profileScore / 100) * 0.309}`
                      ].map((pt, i) => (
                        <circle key={i} cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="3" fill="#ffffff" stroke="#3366FF" strokeWidth="2" />
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Factor Bars */}
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/60 p-6 flex flex-col justify-between">
                  <p className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Evaluation Weighting
                  </p>
                  <div className="space-y-4">
                    {factorRows.map((item, i) => (
                      <div key={item.label}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{item.label}</span>
                          <span className={`text-[11px] font-black ${item.textColor}`}>{item.status}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
                          <motion.div
                            className="h-full bg-[#3366FF] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.08 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Historical Acceptance Rate Trends Card */}
            <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight">
                Acceptance Rate Trend ({selectedMatch.popularPrograms?.[0] || "Cohort"})
              </h3>
              <div className="overflow-x-auto py-2">
                <div className="min-w-[420px]">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
                    {/* Top Legend inside SVG */}
                    <g transform="translate(50, 16)">
                      <circle cx="0" cy="0" r="4" fill="#3366FF" />
                      <text x="12" y="4" fontSize="10" fontWeight="900" fill="#475569" className="uppercase tracking-widest">
                        Acceptance Rate Benchmark Trend (%)
                      </text>
                    </g>

                    {/* Y-axis Ticks & Horizontal Grid Lines */}
                    {yTicks.map((tickVal) => {
                      const y = plotBottom - ((tickVal - yTickMin) / ySpan) * plotHeight;
                      return (
                        <g key={tickVal}>
                          <line x1={plotLeft} y1={y} x2={plotRight} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1={plotLeft - 4} y1={y} x2={plotLeft} y2={y} stroke="#94a3b8" strokeWidth="1.5" />
                          <text x={plotLeft - 8} y={y + 3.5} textAnchor="end" fontSize="10" fontWeight="700" fill="#64748b">
                            {tickVal}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Vertical Grid Lines & X-axis Ticks & Year Labels */}
                    {trendYears.map((year, index) => {
                      const x = plotLeft + (index / (trendYears.length - 1)) * plotWidth;
                      return (
                        <g key={year}>
                          <line x1={x} y1={plotTop} x2={x} y2={plotBottom} stroke="#f1f5f9" strokeWidth="1" />
                          <line x1={x} y1={plotBottom} x2={x} y2={plotBottom + 5} stroke="#94a3b8" strokeWidth="1.5" />
                          <text x={x} y={plotBottom + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
                            {year}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-Axis Main Axis Line */}
                    <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Y-Axis Main Axis Line */}
                    <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Area fill under curve */}
                    <motion.path
                      d={`${bezierPath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`}
                      fill="rgba(51, 102, 255, 0.06)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                    />

                    {/* Smooth Line Curve */}
                    <motion.path
                      fill="none"
                      stroke="#3366FF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      d={bezierPath}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 1.2 }}
                      viewport={{ once: true }}
                    />

                    {/* Data Nodes & Value Badges */}
                    {trendPointsArr.map((pt, index) => (
                      <g key={index} className="group cursor-pointer">
                        <circle cx={pt.x} cy={pt.y} r="7" fill="rgba(51, 102, 255, 0.15)" />
                        <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#3366FF" strokeWidth="2.5" />
                        <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                          <rect x="-14" y="-12" width="28" height="15" rx="4" fill="#0f172a" />
                          <text textAnchor="middle" y="-1.5" fontSize="9" fontWeight="900" fill="#ffffff">
                            {pt.val}%
                          </text>
                        </g>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-blue-50/70 border border-blue-100 p-4 flex gap-3">
                <TrendingUp className="w-5 h-5 text-[#3366FF] shrink-0 mt-0.5" />
                <p className="text-xs text-blue-950 font-semibold leading-relaxed">
                  <strong>Counselor Advice:</strong> Target program acceptance rates have tightened slightly. Submitting well-structured Statement of Purpose (SOP) and verified reference letters will significantly improve conversion.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column (Strengths, Focus Areas, Matrix Table & Action Plan) */}
          <div className="space-y-6 lg:col-span-5 flex flex-col">
            
            {/* Strengths Card */}
            <Card className="rounded-[32px] border-l-4 border-l-emerald-500 border-y border-r border-slate-200/80 bg-white p-6 shadow-xs">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Profile Strengths
              </h3>
              <div className="space-y-2.5">
                {strengths.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-950 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risks / Focus Areas Card */}
            <Card className="rounded-[32px] border-l-4 border-l-amber-500 border-y border-r border-slate-200/80 bg-white p-6 shadow-xs">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Key Focus Areas
              </h3>
              <div className="space-y-2.5">
                {risks.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-2.5 bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="text-xs font-semibold text-amber-950 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Requirements Matrix Card */}
            <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight">
                Requirements Matrix
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="p-3">Criterion</th>
                      <th className="p-3">Your Data</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {/* GPA */}
                    {(() => {
                      const userGpaVal = parseFloat(String(gpa)) || 0;
                      const normUserGpa = userGpaVal > 4.0 ? (userGpaVal / 100) * 4.0 : userGpaVal;
                      const rawReq = selectedMatch.gpaRequirement || 3.0;
                      const normReqGpa = rawReq > 4.0 ? Math.round(((rawReq / 100) * 4.0) * 10) / 10 : rawReq;
                      const meetsGpa = normUserGpa >= normReqGpa;
                      return (
                        <tr>
                          <td className="p-3 font-bold text-slate-800">🎓 GPA</td>
                          <td className="p-3 font-extrabold text-slate-900">{userGpaVal > 0 ? `${normUserGpa.toFixed(2)}` : "N/A"} <span className="text-[10px] font-normal text-slate-400">({normReqGpa.toFixed(1)} req)</span></td>
                          <td className="p-3 text-center">
                            {meetsGpa ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Meets
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-100">
                                Below
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Language */}
                    {(() => {
                      const userTestType = form.testType || "IELTS";
                      const rawScoreVal = parseFloat(String(form.testScore)) || 0;
                      const reqIelts = selectedMatch.englishReq || 6.5;
                      const meetsLang = rawScoreVal >= reqIelts || testScore >= reqIelts;
                      const displayScore = rawScoreVal > 0 ? form.testScore : (testScore > 0 ? String(testScore) : "N/A");
                      return (
                        <tr>
                          <td className="p-3 font-bold text-slate-800">💬 {userTestType}</td>
                          <td className="p-3 font-extrabold text-slate-900">{displayScore} <span className="text-[10px] font-normal text-slate-400">({reqIelts.toFixed(1)} req)</span></td>
                          <td className="p-3 text-center">
                            {meetsLang ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Meets
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-100">
                                Below
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Backlogs */}
                    <tr>
                      <td className="p-3 font-bold text-slate-800">⚠️ Backlogs</td>
                      <td className="p-3 font-extrabold text-slate-900">{backlogs} <span className="text-[10px] font-normal text-slate-400">(≤ 2 max)</span></td>
                      <td className="p-3 text-center">
                        {backlogs <= 2 ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Low Risk
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100">
                            Warning
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Study Gap */}
                    <tr>
                      <td className="p-3 font-bold text-slate-800">⏳ Study Gap</td>
                      <td className="p-3 font-extrabold text-slate-900">{studyGap} Yr <span className="text-[10px] font-normal text-slate-400">(≤ 2 max)</span></td>
                      <td className="p-3 text-center">
                        {studyGap <= 2 ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Ok
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100">
                            SOP Need
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* High-Impact Action Plan Banner (Clean Light Theme) */}
            <Card className="rounded-[32px] border border-blue-100 bg-white p-6 text-slate-900 shadow-sm">
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#3686FF]">
                {isEligible ? "Action Plan to 90%+ Match" : "Recommended Roadmap"}
              </h3>

              <div className="space-y-3 text-xs font-medium text-slate-600 mb-6">
                {!isEligible && admissionAnalysis?.factors ? (
                  <>
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[10px] font-black text-blue-600">1</span>
                      <span className="leading-relaxed">
                        Achieve at least <strong className="text-slate-900">{admissionAnalysis.factors.requiredIelts}</strong> IELTS score.
                      </span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[10px] font-black text-blue-600">2</span>
                      <span className="leading-relaxed">Target colleges accepting GPA <strong className="text-slate-900">{form.gpa}</strong>.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[10px] font-black text-blue-600">1</span>
                      <span className="leading-relaxed">
                        Improve <strong className="text-slate-900">{form.testType || "Language"}</strong> score by half a band.
                      </span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[10px] font-black text-blue-600">2</span>
                      <span className="leading-relaxed">Submit application early to qualify for entrance awards.</span>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={isEligible ? onAdvanceToVisa : onBack}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[#3366FF] hover:bg-[#254bdb] text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
              >
                {isEligible ? "Start Application Form" : "Explore Other Colleges"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Card>

          </div>
        </div>

        {/* Full-Width Active Financial Aid & Scholarship Eligibility Section */}
        <div className="w-full">
          <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#3366FF]" />
                  Active Financial Aid & Scholarship Eligibility Evaluation
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Evaluated against real active entrance awards from top institutions for your criteria
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#3366FF] text-[11px] font-black uppercase tracking-wider self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5" /> Evaluated
              </span>
            </div>

            {loadingSchol ? (
              <div className="p-8 text-center text-slate-400 font-semibold text-xs animate-pulse bg-slate-50/80 rounded-2xl">
                Evaluating profile against active scholarships...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scholarships.map((sch) => {
                  const result = evaluateScholarship(
                    {
                      gpa,
                      englishScore: testScore,
                      testType: form.testType,
                      degreeLevel: form.degree || form.highestEducation,
                      nationality: form.nationality,
                      backlogs,
                      studyGap,
                    },
                    sch
                  );
                  const numAmt = parseFloat(String(sch.award_amount_from));
                  const displayAmount = sch.award_amount_from && !isNaN(numAmt)
                    ? `${sch.award_amount_currency_symbol || "$"}${numAmt.toLocaleString()}`
                    : "Funding Available";

                  return (
                    <div
                      key={sch._id}
                      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-[#3366FF]/30 transition-all hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${result.badgeBg} ${result.badgeBorder}`}>
                            {result.status} ({result.score}%)
                          </span>
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            {displayAmount}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug line-clamp-1">
                          {sch.title}
                        </h4>
                        <p className="text-[11px] font-bold text-[#3366FF] uppercase tracking-wider mb-3">
                          {sch.school_group_name || "Institution Award"}
                        </p>

                        <div className="space-y-1.5 mb-4">
                          {result.matchReasons.slice(0, 2).map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="truncate">{reason}</span>
                            </div>
                          ))}
                          {result.warningReasons.slice(0, 1).map((warning, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="truncate">{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {sch.source_url && (
                        <a
                          href={sch.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-100 text-[11px] font-black text-slate-600 hover:text-[#3366FF] transition-colors"
                        >
                          <span>Official Award Details</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
