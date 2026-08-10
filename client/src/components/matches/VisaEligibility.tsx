/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronLeft,
  Coins,
  FileCheck,
  FileText,
  Globe,
  Info,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
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

export function VisaEligibility({
  form,
  selectedMatch,
  onBack,
  onComplete,
}: VisaEligibilityProps) {
  const [visaAnalysis, setVisaAnalysis] = useState<{
    successChance?: number;
    readinessPercent?: number;
    label?: string;
    guidance?: Array<{ title?: string; description?: string; status?: string }>;
    checklist?: Array<{ title?: string; description?: string; status?: string }>;
  } | null>(null);

  const visaCountry = selectedMatch.countryCode || form.countries[0] || "USA";
  const visaTitle = `${visaCountry} Student Visa (Category F-1 / Study Permit)`;

  const hasFunds =
    parseFloat(String(form.bankBalance || 0)) > 0 ||
    parseFloat(String(form.sponsorIncome || 0)) > 0;
  const userGpa = parseFloat(String(form.gpa || 0)) || 3.0;

  // Local state for interactive document checklist
  const [docsStatus, setDocsStatus] = useState<Record<string, boolean>>({
    passport: !!form.passportReady,
    admissionLetter: true,
    financialProof: hasFunds,
    academicTranscripts: userGpa >= 2.5,
    languageReport: !!form.testScore,
    visaForm: false,
  });

  useEffect(() => {
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

  const toggleDoc = (key: string) => {
    setDocsStatus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const verifiedCount = Object.values(docsStatus).filter(Boolean).length;
  const totalDocs = Object.keys(docsStatus).length;
  const calculatedReadiness = Math.round((verifiedCount / totalDocs) * 100);

  const successChance = Math.min(
    98,
    Math.max(45, (visaAnalysis?.successChance || 82) + (verifiedCount - 3) * 4)
  );

  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const circleOffset = circumference - (calculatedReadiness / 100) * circumference;

  const defaultDocsList = [
    {
      id: "passport",
      title: "Valid International Passport",
      category: "Identity & Travel",
      description: "Must be valid for at least 6 months beyond intended stay.",
      requiredFor: visaCountry,
      icon: FileText,
    },
    {
      id: "admissionLetter",
      title: "Official Acceptance Letter / I-20",
      category: "Academic Entry",
      description: `Unconditional offer letter from ${selectedMatch.name}.`,
      requiredFor: selectedMatch.name,
      icon: BookOpen,
    },
    {
      id: "financialProof",
      title: "Proof of Financial Solvency",
      category: "Financials",
      description: "Bank statements covering 1st-year tuition + living costs.",
      requiredFor: visaCountry,
      icon: Wallet,
    },
    {
      id: "academicTranscripts",
      title: "Official Transcripts & Certificates",
      category: "Academic Records",
      description: "Verified academic marksheets and degree certificates.",
      requiredFor: selectedMatch.name,
      icon: FileCheck,
    },
    {
      id: "languageReport",
      title: "English Proficiency Score Report",
      category: "Language",
      description: `${form.testType || "IELTS/TOEFL"} score report (Minimum equivalent: ${selectedMatch.englishReq || 6.5}).`,
      requiredFor: "Embassy Requirement",
      icon: BadgeCheck,
    },
    {
      id: "visaForm",
      title: "Online Visa Application Form (DS-160 / VAF)",
      category: "Embassy Filing",
      description: "Completed embassy application form & fee receipt.",
      requiredFor: visaCountry,
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 bg-slate-50/70 py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#3366FF] transition-colors mb-3 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Admission Evaluation
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Visa Readiness Assessment
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Verify your documentation portfolio to maximize approval probability for {selectedMatch.name}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs self-start sm:self-auto">
            <Globe className="w-4 h-4 text-[#3366FF]" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              {visaTitle}
            </span>
          </div>
        </div>

        {/* Top 2 Executive Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visa Readiness Spotlight Card */}
          <Card className="lg:col-span-7 rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              
              {/* Concentric Progress Ring */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    fill="none"
                    stroke="#3366FF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circleOffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {calculatedReadiness}%
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">
                    Readiness
                  </span>
                </div>
              </div>

              {/* Status & Key Metrics */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {calculatedReadiness >= 80 ? "High Visa Readiness" : "Action Needed"}
                </div>

                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Estimated Approval Probability: <span className="text-[#3366FF]">{successChance}%</span>
                </h2>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  You have verified <strong className="text-slate-900">{verifiedCount} of {totalDocs}</strong> mandatory visa documents. Toggle any item below to update your live readiness score.
                </p>

                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                    Embassy Time: 15–30 Days
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                    Risk Level: Standard Review
                  </span>
                </div>
              </div>

            </div>
          </Card>

          {/* Financial Proof Summary Card */}
          <Card className="lg:col-span-5 rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#3366FF]" />
                  Financial Solvency Check
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${hasFunds ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                  {hasFunds ? "Sufficient Funds" : "Gap Detected"}
                </span>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Declared Funds Proof</span>
                  <span className="font-extrabold text-slate-900">
                    ${(() => {
                      const b = parseFloat(String(form.bankBalance || 25000));
                      return !isNaN(b) ? b.toLocaleString() : "25,000";
                    })()} USD
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Estimated 1-Year Tuition + Living</span>
                  <span className="font-extrabold text-slate-900">
                    ${(selectedMatch.tuitionFee || 18000) + 12000} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#3366FF] shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-slate-600 leading-snug">
                Embassies require proof of funds deposited for at least 28 days prior to interview appointment.
              </p>
            </div>
          </Card>

        </div>

        {/* Mandatory Document Verification Matrix */}
        <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#3366FF]" />
                Mandatory Visa Document Checklist
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Click any document row to toggle its verification status
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#3366FF] text-[11px] font-black uppercase tracking-wider self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" /> {verifiedCount} / {totalDocs} Verified
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultDocsList.map((doc) => {
              const Icon = doc.icon;
              const isVerified = !!docsStatus[doc.id];

              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isVerified
                      ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300"
                      : "border-slate-200/80 bg-white hover:border-[#3366FF]/40 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className={`p-2.5 rounded-xl ${isVerified ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        isVerified
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {isVerified ? "Verified / Ready" : "Action Needed"}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                      {doc.title}
                    </h4>

                    <p className="text-[11px] font-semibold text-slate-500 mb-3 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>{doc.category}</span>
                    <span className={isVerified ? "text-emerald-700" : "text-slate-500"}>
                      {isVerified ? "✓ Ready" : "Click to mark ready"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Embassy Interview Tips & Guidance Card */}
        <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#3366FF]" />
            Counselor Embassy Interview Preparation Guide
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 text-sm">1. Genuine Student Intent</span>
              <p className="text-slate-500 leading-relaxed">
                Clearly articulate why you selected {selectedMatch.name} and how the degree advances your career goals back home.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 text-sm">2. Strong Financial Clarity</span>
              <p className="text-slate-500 leading-relaxed">
                Be ready to state exact tuition fees (${selectedMatch.tuitionFee || 18000}) and sponsor relationship without hesitation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 text-sm">3. Home Country Ties</span>
              <p className="text-slate-500 leading-relaxed">
                Emphasize family, property, or job prospects in {form.nationality || "your home country"} after graduation.
              </p>
            </div>
          </div>
        </Card>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={onComplete}
            className="w-full h-14 bg-[#3366FF] hover:bg-[#254bdb] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            Generate Final Study & Visa Roadmap
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
