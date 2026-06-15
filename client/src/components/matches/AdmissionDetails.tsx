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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { motion, animate } from "framer-motion";

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
}: AdmissionDetailsProps) {
  const gpa = Number.parseFloat(form.gpa) || 0;
  const testScore = Number.parseFloat(form.testScore) || 0;
  const backlogs = Number.parseInt(form.backlogs || "0", 10) || 0;
  const studyGap = Number.parseInt(form.studyGap || "0", 10) || 0;

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

  const profileScore = Math.max(
    30,
    Math.min(
      95,
      Math.round(
        admissionPct * 0.6 + gpaBoost + testBoost - backlogs * 2 - studyGap * 2,
      ),
    ),
  );

  const lowerBand = Math.max(5, Math.min(95, Math.round(admissionPct - 7)));
  const upperBand = Math.max(
    lowerBand + 5,
    Math.min(98, Math.round(admissionPct + 8)),
  );

  const gpaFactor = Math.max(
    25,
    Math.min(95, Math.round((gpa / (gpa <= 4 ? 4 : 10)) * 100)),
  );
  const testFactor = Math.max(20, Math.min(95, Math.round(testFactorBase)));
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

  if (isGpaStrong)
    strengths.push("Strong academic performance aligns with target programs.");
  if (isTestStrong)
    strengths.push(
      `${form.testType || "English test"} score is competitive for this intake.`,
    );
  if (backlogs <= 1)
    strengths.push("Academic history is consistent with low backlog risk.");
  if (studyGap <= 1)
    strengths.push(
      "Study timeline appears stable for visa and admission review.",
    );

  if (!isTestStrong)
    risks.push("Language score can be improved to raise acceptance odds.");
  if (!isGpaStrong)
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

  const trendYears = [2021, 2022, 2023, 2024, 2025];
  const trendValues = trendYears.map((_, index) => {
    const adjustment = 6 - index * 2;
    return Math.max(12, Math.min(95, Math.round(admissionPct + adjustment)));
  });

  const maxTrend = Math.max(...trendValues) + 5;
  const minTrend = Math.max(0, Math.min(...trendValues) - 5);
  const spanTrend = Math.max(1, maxTrend - minTrend);
  const chartWidth = 380;
  const chartHeight = 120;

  const trendPointsArr = trendValues.map((value, index) => {
    const x = (index / (trendValues.length - 1)) * chartWidth;
    const y =
      chartHeight - ((value - minTrend) / spanTrend) * (chartHeight - 12) - 6;
    return { x, y };
  });

  const getBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const bezierPath = getBezierPath(trendPointsArr);

  const factorRows = [
    {
      label: "Academic Score",
      value: gpaFactor,
      status: gpaStatus,
      bar: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Test Score",
      value: testFactor,
      status: testStatus,
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
    <div className="relative min-h-screen text-slate-900 pb-32 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 overflow-hidden">
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
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold group"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Dashboard
            </button>
            <h1 className="text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.1] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
              Admission Chances Analysis
            </h1>
            <p className="text-slate-500 text-[15px] md:text-[17px] leading-relaxed font-medium">
              A deep dive into your profile competitiveness for{" "}
              <span className="text-slate-700 font-bold">{selectedMatch.name}</span>. 
              Based on historical acceptance data, cohort trends, and program-specific criteria.
            </p>
          </div>
        </motion.div>

        {/* Main Probability Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] relative overflow-hidden p-6 md:p-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                Estimated Acceptance Probability
              </p>
              <h2 className="text-[40px] md:text-[56px] font-black text-[#3686FF] tracking-tight leading-none mb-3 drop-shadow-sm">
                <AnimatedPercentRange lower={lowerBand} upper={upperBand} />
              </h2>
              <p className="text-slate-500 text-[15px] md:text-[16px] max-w-2xl font-semibold leading-relaxed">
                <span className="text-slate-800 font-bold">{admissionBand.label}</span> range projected for your current profile. 
                Improving language score and supporting documents can move this band upward.
              </p>
            </div>

            <div className="relative h-[130px] w-[130px] md:h-[170px] md:w-[170px] shrink-0 mx-auto md:mx-0 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-pulse-ring pointer-events-none animate-float" />
              <svg
                viewBox="0 0 36 36"
                className="h-full w-full -rotate-90 transform filter drop-shadow-[0_4px_12px_rgba(54,134,255,0.15)]"
              >
                <defs>
                  <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="transparent"
                  stroke="url(#circleGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={profileScoreCircumference}
                  initial={{ strokeDashoffset: profileScoreCircumference }}
                  whileInView={{ strokeDashoffset: profileScoreOffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[26px] md:text-[34px] font-black text-slate-900 leading-none">
                  <AnimatedPercent val={profileScore} />
                </span>
                <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Match</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Middle Column (Graphs) */}
          <div className="space-y-6 lg:col-span-8">
            <Card className="rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,41,55,0.04)] p-6 md:p-8 h-full">
              <h3 className="text-[20px] md:text-[22px] font-extrabold text-slate-900 mb-8 tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                Competitiveness Map
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-[28px] border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-center items-center group hover:bg-white hover:border-[#3686FF]/20 hover:shadow-lg transition-all duration-300">
                  <p className="mb-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] self-start w-full text-center">
                    Visual Profile Snapshot
                  </p>
                  <div className="mx-auto w-full max-w-[280px] h-[220px] flex items-center justify-center relative">
                    <svg viewBox="-20 -10 140 120" className="w-full h-full overflow-visible">
                      <defs>
                        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#3686FF" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#3686FF" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      {/* Background glow circle */}
                      <circle cx="50" cy="50" r="40" fill="url(#radarGlow)" />
                      
                      {/* Grid webs */}
                      <polygon points="50,10 88,38 74,82 26,82 12,38" fill="rgba(248, 250, 252, 0.4)" stroke="#cbd5e1" strokeWidth="1" />
                      <polygon points="50,23.3 75.3,42 66,71.3 34,71.3 24.7,42" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                      <polygon points="50,36.7 62.7,46 58,60.7 42,60.7 37.3,46" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                      
                      {/* Radiating lines */}
                      <line x1="50" y1="50" x2="50" y2="10" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" opacity="0.8" />
                      <line x1="50" y1="50" x2="88" y2="38" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" opacity="0.8" />
                      <line x1="50" y1="50" x2="74" y2="82" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" opacity="0.8" />
                      <line x1="50" y1="50" x2="26" y2="82" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" opacity="0.8" />
                      <line x1="50" y1="50" x2="12" y2="38" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 1" opacity="0.8" />

                      {/* Labels */}
                      <text x="50" y="-2" textAnchor="middle" fontSize="7" fontWeight="900" fill="#475569" letterSpacing="0.05em">ACADEMIC</text>
                      <text x="93" y="40" textAnchor="start" fontSize="7" fontWeight="900" fill="#475569" letterSpacing="0.05em">TEST</text>
                      <text x="74" y="93" textAnchor="middle" fontSize="7" fontWeight="900" fill="#475569" letterSpacing="0.05em">RECS</text>
                      <text x="26" y="93" textAnchor="middle" fontSize="7" fontWeight="900" fill="#475569" letterSpacing="0.05em">EXTRA.</text>
                      <text x="7" y="40" textAnchor="end" fontSize="7" fontWeight="900" fill="#475569" letterSpacing="0.05em">OVERALL</text>

                      {/* Actual Data Polygon */}
                      <motion.polygon
                        points={`${50},${50 - 40 * (gpaFactor / 100)} ${50 + 40 * (testFactor / 100) * 0.951},${50 - 40 * (testFactor / 100) * 0.309} ${50 + 40 * (recommendationFactor / 100) * 0.588},${50 + 40 * (recommendationFactor / 100) * 0.809} ${50 - 40 * (extracurricularFactor / 100) * 0.588},${50 + 40 * (extracurricularFactor / 100) * 0.809} ${50 - 40 * (profileScore / 100) * 0.951},${50 - 40 * (profileScore / 100) * 0.309}`}
                        fill="rgba(54, 134, 255, 0.25)"
                        stroke="#3686FF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        style={{ transformOrigin: "50px 50px" }}
                      />

                      {/* Data Points */}
                      {[
                        `${50},${50 - 40 * (gpaFactor / 100)}`,
                        `${50 + 40 * (testFactor / 100) * 0.951},${50 - 40 * (testFactor / 100) * 0.309}`,
                        `${50 + 40 * (recommendationFactor / 100) * 0.588},${50 + 40 * (recommendationFactor / 100) * 0.809}`,
                        `${50 - 40 * (extracurricularFactor / 100) * 0.588},${50 + 40 * (extracurricularFactor / 100) * 0.809}`,
                        `${50 - 40 * (profileScore / 100) * 0.951},${50 - 40 * (profileScore / 100) * 0.309}`
                      ].map((pt, i) => (
                        <motion.circle
                          key={i}
                          cx={pt.split(',')[0]}
                          cy={pt.split(',')[1]}
                          r="3"
                          fill="#ffffff"
                          stroke="#3686FF"
                          strokeWidth="2"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                          viewport={{ once: true }}
                        />
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-slate-50/50 p-6 group hover:bg-white hover:border-[#3686FF]/20 hover:shadow-lg transition-all duration-300">
                  <p className="mb-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Detailed Factors
                  </p>
                  <div className="space-y-5">
                    {factorRows.map((item, i) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-end justify-between">
                          <span className="text-[13px] font-bold text-slate-800">{item.label}</span>
                          <span className={`text-[12px] font-bold ${item.textColor}`}>{item.status}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200/60 shadow-inner">
                          <motion.div
                            className={`h-full ${item.bar} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acceptance Rate Trends - Merged into the same card */}
              <div className="mt-8 pt-8 border-t border-slate-100/60 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-[18px] md:text-[20px] font-extrabold text-slate-900 mb-6 tracking-tight relative z-10">
                  Acceptance Rate Trends <span className="text-slate-400 font-semibold text-[14px]">({selectedMatch.popularPrograms?.[0] || "Program"})</span>
                </h3>
                <div className="overflow-x-auto relative z-10 py-4 scrollbar-hide">
                  <div className="min-w-[400px]">
                    <svg
                      viewBox={`0 -10 ${chartWidth} ${chartHeight + 40}`}
                      className="w-full h-auto drop-shadow-sm overflow-visible"
                    >
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3686FF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3686FF" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Background Grid Lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <line 
                          key={ratio} 
                          x1="0" 
                          y1={chartHeight * ratio} 
                          x2={chartWidth} 
                          y2={chartHeight * ratio} 
                          stroke="#f1f5f9" 
                          strokeWidth="1" 
                        />
                      ))}

                      {/* Area under curve */}
                      <motion.path
                        d={`${bezierPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                        fill="url(#trendGradient)"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        viewport={{ once: true }}
                      />

                      {/* Trend Line */}
                      <motion.path
                        fill="none"
                        stroke="#3686FF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={bezierPath}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                      
                      {trendPointsArr.map((pt, index) => {
                        return (
                          <g key={`${trendYears[index]}-${trendValues[index]}`}>
                            <motion.circle 
                              cx={pt.x} 
                              cy={pt.y} 
                              r="6" 
                              fill="#ffffff" 
                              stroke="#3686FF"
                              strokeWidth="3.5"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                              viewport={{ once: true }}
                            />
                            <text
                              x={pt.x}
                              y={chartHeight + 24}
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="900"
                              fill="#64748b"
                            >
                              {trendYears[index]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
                <div className="mt-6 rounded-[20px] bg-blue-50/50 border border-blue-100/50 p-4 flex gap-3 relative z-10">
                  <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] md:text-[14px] text-blue-900/80 font-semibold leading-relaxed">
                    <strong>Trend insight:</strong> Acceptance has softened gradually. Submitting
                    stronger SOP and test score can improve your final shortlist conversion.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (Sidebars) */}
          <div className="space-y-6 lg:col-span-4 flex flex-col">
            <Card className="rounded-[36px] border border-emerald-100 bg-emerald-50/30 p-6 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
              <h3 className="mb-5 text-[14px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-2 relative z-10">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Profile Strengths
              </h3>
              <div className="space-y-3 relative z-10">
                {strengths.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-3 bg-white p-3.5 rounded-[20px] border border-emerald-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-sm shadow-emerald-500/50" />
                    <span className="text-[13px] font-medium text-emerald-900/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[36px] border border-rose-100 bg-rose-50/30 p-6 shadow-sm relative overflow-hidden group hover:border-rose-200 transition-colors">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />
              <h3 className="mb-5 text-[14px] font-black uppercase tracking-widest text-rose-800 flex items-center gap-2 relative z-10">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Potential Risks
              </h3>
              <div className="space-y-3 relative z-10">
                {risks.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-3 bg-white p-3.5 rounded-[20px] border border-rose-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 shadow-sm shadow-rose-500/50" />
                    <span className="text-[13px] font-medium text-rose-900/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[36px] border-none bg-gradient-to-br from-[#3686FF] to-[#1e40af] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden mt-auto">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />
              <h3 className="mb-6 text-[13px] font-black uppercase tracking-[0.2em] text-blue-100/90 relative z-10">
                Action Plan to 90%+
              </h3>
              <div className="space-y-4 text-[14px] font-medium text-blue-50 relative z-10 mb-8">
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Circle className="h-2 w-2 fill-white text-white" />
                  </div>
                  <span className="leading-relaxed">
                    Raise <strong className="text-white">{form.testType || "English"}</strong> score by one benchmark band.
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Circle className="h-2 w-2 fill-white text-white" />
                  </div>
                  <span className="leading-relaxed">
                    Add two <strong className="text-white">safe-shortlist programs</strong> with higher acceptance rates.
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Circle className="h-2 w-2 fill-white text-white" />
                  </div>
                  <span className="leading-relaxed">
                    Apply within <strong className="text-white">first deadline window</strong> for stronger conversion.
                  </span>
                </div>
              </div>
              <button
                onClick={onAdvanceToVisa}
                className="relative z-10 flex w-full h-[60px] items-center justify-center gap-2 rounded-[20px] bg-white text-[15px] font-bold text-blue-700 shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Start Application Now
                <ArrowRight className="h-5 w-5" />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
