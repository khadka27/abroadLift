"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  MapPin,
  Trophy,
  Calendar,
  Wallet,
  CheckCircle2,
  ArrowRight,
  X,
  Info,
  Sparkles,
  Building2,
  Award,
  Users,
} from "lucide-react";
import { Match, Form } from "@/types/matches";
import { User } from "next-auth";

interface Session {
  user: User;
  expires: string;
}

interface UniversitySelectionProps {
  matches: Match[];
  loading: boolean;
  error: string;
  selectedMatch: Match | null;
  form: Form;
  session: Session | null;
  onSelect: (match: Match) => void;
  onAdjustPreferences: () => void;
  onClearFilters: () => void;
  runMatch: () => void;
}

type DetailsTab = "estimates" | "overview" | "rankings" | "courses" | "facts";

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function UniversitySelection({
  matches,
  loading,
  error,
  selectedMatch,
  form,
  session,
  onSelect,
  onAdjustPreferences,
  onClearFilters,
  runMatch,
}: UniversitySelectionProps) {
  const [detailsMatch, setDetailsMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<DetailsTab>("estimates");

  const closeDetails = () => {
    setDetailsMatch(null);
    setActiveTab("estimates");
  };

  if (loading) return null; // Handled by transition screen in parent

  if (error) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button
          onClick={runMatch}
          className="text-blue-600 font-black underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-20 md:py-32 animate-in fade-in zoom-in-95 duration-700 max-w-2xl mx-auto px-6">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-28 h-28 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/5">
            <Search className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <h3 className="text-[28px] font-[900] text-[#111827] mb-4 tracking-tight">
          No direct matches found
        </h3>
        <p className="text-[#64748b] font-medium text-[16px] mb-12 max-w-md mx-auto leading-relaxed">
          Our engine couldn&apos;t find an exact match for your current filters.
          Try broadening your criteria for better results.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={onAdjustPreferences}
            className="w-full sm:w-auto px-10 h-14 bg-[#3686FF] hover:bg-[#2970E6] text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_8px_20px_-6px_rgba(59,130,246,0.35)] transition-all active:scale-95"
          >
            Adjust Preferences
          </button>
          <button
            onClick={onClearFilters}
            className="w-full sm:w-auto px-10 h-14 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 p-2 md:p-4 mb-6 md:mb-16 flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search universities, courses..."
            className="w-full h-12 md:h-16 pl-12 md:pl-14 pr-6 bg-slate-50/50 rounded-[18px] md:rounded-2xl text-[14px] md:text-[15px] font-regular text-slate-900 outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-12 md:h-16 px-6 md:px-10 rounded-[18px] md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center gap-2 text-slate-900 font-semibold text-[12px] md:text-sm tracking-tight shadow-sm hover:bg-slate-50 transition-all">
            <ArrowUpDown className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-slate-400" />
            Sort
          </button>
          <button className="flex-1 md:flex-none h-12 md:h-16 px-6 md:px-10 rounded-[18px] md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center gap-2 text-slate-900 font-semibold text-[12px] md:text-sm tracking-tight shadow-sm hover:bg-slate-50 transition-all">
            <SlidersHorizontal className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-slate-400" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-8 md:pb-12">
        {matches.map((m) => (
          <div key={m.id} className="relative h-full">
            <MatchCard
              match={m}
              currency={form.currency}
              selected={selectedMatch?.id === m.id}
              onSelect={() => onSelect(m)}
              onOpenDetails={() => {
                setDetailsMatch(m);
                setActiveTab("estimates");
              }}
            />
          </div>
        ))}
      </div>

      {detailsMatch && (
        <UniversityDetailsModal
          match={detailsMatch}
          currency={form.currency}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={closeDetails}
          onShortlist={() => {
            onSelect(detailsMatch);
            closeDetails();
          }}
        />
      )}
    </div>
  );
}

function MatchCard({
  match: m,
  currency: c,
  selected,
  onSelect,
  onOpenDetails,
}: {
  match: Match;
  currency: string;
  selected?: boolean;
  onSelect?: () => void;
  onOpenDetails?: () => void;
}) {
  return (
    <div
      className={`bg-white border text-left rounded-[20px] md:rounded-[24px] overflow-hidden transition-all duration-300 cursor-pointer relative group flex flex-col h-full ${selected ? "border-blue-500 ring-1 ring-blue-500/20 shadow-xl translate-y-[-4px]" : "border-slate-100 hover:shadow-xl hover:border-blue-200 hover:translate-y-[-2px]"}`}
      onClick={() => {
        onSelect?.();
      }}
    >
      <div className="relative w-full h-[130px] md:h-[160px] overflow-hidden">
        <Image
          src={m.banner || "/uni-default.webp"}
          alt={m.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white flex items-center gap-1.5 shadow-sm">
          <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3b82f6]" />
          <span className="text-[9px] md:text-[10px] font-extrabold text-[#3b82f6] uppercase tracking-wider">
            #{m.rankingWorld || 1} Global
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider truncate max-w-[100px] md:max-w-[120px] text-slate-500">
              {m.location || "LONDON, UK"}
            </span>
          </div>
          <div className="px-3 py-0.5 rounded-full bg-[#ff9f43] text-white text-[8px] md:text-[9px] font-bold uppercase tracking-wider shadow-sm">
            Top Pick
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative p-1.5 md:p-2">
            {m.logo ? (
              <Image
                src={m.logo}
                alt={m.name}
                fill
                className="object-contain p-1.5"
              />
            ) : (
              <span className="text-blue-600 font-semibold text-[16px] md:text-[18px]">
                {m.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] md:text-[17px] font-bold text-[#111827] leading-tight mb-0.5 line-clamp-1">
              {m.name}
            </h3>
            <p className="text-[#4F46E5] font-medium text-[12px] md:text-[13px] tracking-tight truncate">
              {m.popularPrograms?.[0] || "MSc Computer Science"}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5 md:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[11px] md:text-[12px] font-medium text-slate-700">
                Duration
              </span>
            </div>
            <span className="text-[11px] md:text-[12px] font-semibold text-[#111827]">
              1 Year
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[11px] md:text-[12px] font-medium text-slate-700">
                Tuition
              </span>
            </div>
            <span className="text-[11px] md:text-[12px] font-semibold text-[#111827]">
              {m.tuitionFee ? `${formatCurrency(m.tuitionFee, c)} / yr` : "TBD"}
            </span>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#10b981]" />
                <span className="text-[11px] md:text-[12px] font-medium text-slate-700">
                  Acceptance
                </span>
              </div>
              <span className="text-[11px] md:text-[12px] font-bold text-[#10b981]">
                {m.admissionRate || 78}%
              </span>
            </div>
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div
                className="h-full bg-[#10b981] rounded-full transition-all duration-1000"
                style={{ width: `${m.admissionRate || 78}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className={`w-full h-10 md:h-11 rounded-[14px] md:rounded-[16px] font-bold text-[12px] md:text-[13px] shadow-sm flex items-center justify-center gap-1.5 group transition-all ${
              selected
                ? "bg-[#10b981] text-white hover:bg-[#059669] shadow-md"
                : "bg-[#3686FF] text-white hover:shadow-md"
            }`}
          >
            {selected ? (
              <>
                Selected{" "}
                <CheckCircle2 className="w-4 h-4 md:w-4 md:h-4 text-white" />
              </>
            ) : (
              <>
                Select University{" "}
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.();
            }}
            className="w-full h-9 rounded-[12px] border border-transparent text-slate-500 hover:text-[#3686FF] hover:bg-slate-50 font-semibold text-[11px] md:text-[12px] transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function UniversityDetailsModal({
  match: m,
  currency: c,
  activeTab,
  setActiveTab,
  onClose,
  onShortlist,
}: {
  match: Match;
  currency: string;
  activeTab: DetailsTab;
  setActiveTab: React.Dispatch<React.SetStateAction<DetailsTab>>;
  onClose: () => void;
  onShortlist: () => void;
}) {
  const admissionChance = Math.max(10, Math.min(95, m.admissionRate || 60));
  const yearlyLiving = Math.round((m.tuitionFee || 20000) * 0.45);
  const courses =
    m.popularPrograms && m.popularPrograms.length > 0
      ? m.popularPrograms
      : ["Computer Science", "Business Analytics", "Data Science"];

  const tabs = [
    { id: "estimates", label: "Estimates" },
    { id: "overview", label: "Overview" },
    { id: "rankings", label: "Rankings" },
    { id: "courses", label: "Courses & Fees" },
    { id: "facts", label: "Key Facts" },
  ] as const;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/55 backdrop-blur-lg p-3 md:p-8 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close details"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[1040px] max-h-[92vh] rounded-[28px] bg-white border border-slate-200 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.6)] overflow-hidden flex flex-col">
        <div className="relative h-32 md:h-52 shrink-0">
            <Image
              src={m.banner || "/uni-default.webp"}
              alt={m.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute left-4 md:left-7 bottom-3 md:bottom-5 text-white">
              <h3 className="text-[20px] md:text-[34px] font-black leading-none">
                {m.name}
              </h3>
              <p className="text-[11px] md:text-[14px] opacity-90 mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {m.location || "Unknown location"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 md:top-5 md:right-5 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/95 text-slate-700 flex items-center justify-center shadow-md"
              aria-label="Close details"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <div className="shrink-0 border-b border-slate-100 px-2 md:px-6 overflow-x-auto bg-white">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-6 h-11 md:h-14 text-[12px] md:text-[14px] font-bold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-400 border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-7 bg-slate-50/40">
            {activeTab === "estimates" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Estimated Total Cost / Yr
                  </p>
                  <p className="text-[34px] font-black text-slate-900 leading-none">
                    {formatCurrency((m.tuitionFee || 0) + yearlyLiving, c)}
                  </p>
                  <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: "58%" }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />{" "}
                      Tuition
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />{" "}
                      Living
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                      Other
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-[20px] font-extrabold text-slate-900 mb-2">
                    Your Chances
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-[34px] font-black text-blue-600 leading-none">
                      {admissionChance}%
                    </span>
                    <span className="text-[12px] font-semibold text-slate-500 pb-1">
                      admission chance
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-3">
                    Based on your profile and this university&apos;s trend data.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-slate-900">
                      About University
                    </h4>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {m.description ||
                      `${m.name} offers strong academics, modern campus facilities, and excellent global exposure for international students.`}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-slate-900">Highlights</h4>
                  </div>
                  <div className="space-y-2">
                    {courses.slice(0, 3).map((program) => (
                      <div
                        key={program}
                        className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-[13px] font-medium text-slate-700"
                      >
                        {program}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rankings" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4" />
                    <p className="text-[13px] font-bold">Global Excellence</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                      <p className="text-[10px] uppercase font-bold opacity-80">
                        QS World
                      </p>
                      <p className="text-[30px] leading-none font-black mt-1">
                        #{m.rankingWorld || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                      <p className="text-[10px] uppercase font-bold opacity-80">
                        National
                      </p>
                      <p className="text-[30px] leading-none font-black mt-1">
                        #{m.rankingNational || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-3">
                {courses.map((program, idx) => (
                  <div
                    key={`${program}-${idx}`}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 text-[14px]">
                          {program}
                        </p>
                        <p className="text-[12px] text-slate-500 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {m.deadline || m.applicationDeadline || "Rolling"}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                        {formProgramTag(program)}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-[11px] text-slate-500">Tuition Fee</p>
                      <p className="text-[18px] font-black text-slate-900">
                        {m.tuitionFee
                          ? `${formatCurrency(m.tuitionFee, c)}/yr`
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "facts" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase">
                      <Building2 className="w-3.5 h-3.5" /> Type
                    </div>
                    <p className="text-[15px] font-extrabold text-slate-900 mt-2">
                      {m.type || "Public"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase">
                      <Award className="w-3.5 h-3.5" /> Established
                    </div>
                    <p className="text-[15px] font-extrabold text-slate-900 mt-2">
                      {m.founded || "N/A"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase">
                      <MapPin className="w-3.5 h-3.5" /> Campus
                    </div>
                    <p className="text-[15px] font-extrabold text-slate-900 mt-2 line-clamp-1">
                      {m.location || "N/A"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase">
                      <Users className="w-3.5 h-3.5" /> Students
                    </div>
                    <p className="text-[15px] font-extrabold text-slate-900 mt-2">
                      {m.studentPopulation
                        ? `${m.studentPopulation.toLocaleString()}+`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="space-y-2 text-[13px] text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-800">
                        English Requirement:
                      </span>{" "}
                      IELTS {m.englishReq || "6.5"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">
                        Minimum GPA:
                      </span>{" "}
                      {m.gpaRequirement || "3.0"}/4.0
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">
                        International Students:
                      </span>{" "}
                      {m.internationalPercentage || "N/A"}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={onShortlist}
              className="w-full h-12 rounded-[14px] bg-[#3686FF] text-white font-bold text-[14px] shadow-[0_10px_24px_-10px_rgba(54,134,255,0.8)]"
            >
              Shortlist University
            </button>
          </div>
        </div>
      </div>
  );
}

function formProgramTag(program: string) {
  const lower = program.toLowerCase();
  if (
    lower.includes("engineer") ||
    lower.includes("computer") ||
    lower.includes("data")
  ) {
    return "Engineering";
  }
  if (
    lower.includes("business") ||
    lower.includes("management") ||
    lower.includes("finance")
  ) {
    return "Business";
  }
  if (lower.includes("law")) {
    return "Law";
  }
  if (lower.includes("health") || lower.includes("medical")) {
    return "Health";
  }
  return "General";
}
