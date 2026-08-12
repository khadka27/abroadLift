"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  LayoutGrid,
  List,
  ExternalLink,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { Match, Form } from "@/types/matches";
import { User } from "next-auth";
import { formatNPRDevanagariRange } from "@/lib/currency";

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
  usdToNpr?: number;
  onSelect: (match: Match) => void;
  onAdjustPreferences: () => void;
  onClearFilters: () => void;
  runMatch: () => void;
}

type DetailsTab = "estimates" | "overview" | "rankings" | "courses" | "facts";

function getAcceptanceMeta(rate: number) {
  if (rate >= 75) {
    return {
      label: "High",
      textClass: "text-emerald-600",
      barClass: "bg-emerald-500",
      iconClass: "text-emerald-500",
    };
  }

  if (rate >= 50) {
    return {
      label: "Medium",
      textClass: "text-amber-600",
      barClass: "bg-amber-500",
      iconClass: "text-amber-500",
    };
  }

  return {
    label: "Low",
    textClass: "text-rose-600",
    barClass: "bg-rose-500",
    iconClass: "text-rose-500",
  };
}

function getRelevantAcceptanceRate(m: Match) {
  const baseRate =
    typeof m.admissionRate === "number" && Number.isFinite(m.admissionRate)
      ? m.admissionRate
      : 62;

  const rank = m.rankingWorld || 0;
  const rankAdjustment = rank
    ? rank <= 50
      ? -16
      : rank <= 100
        ? -12
        : rank <= 250
          ? -8
          : rank <= 500
            ? -4
            : rank <= 1000
              ? 0
              : 3
    : 0;

  const tuition = m.tuitionFee || 0;
  const tuitionAdjustment = tuition
    ? tuition >= 50000
      ? -6
      : tuition >= 35000
        ? -3
        : tuition <= 15000
          ? 5
          : tuition <= 22000
            ? 2
            : 0
    : 0;

  const intl = m.internationalPercentage || 0;
  const intlAdjustment = intl >= 30 ? 4 : intl >= 20 ? 2 : intl <= 10 ? -3 : 0;

  return Math.max(
    18,
    Math.min(
      93,
      Math.round(
        baseRate + rankAdjustment + tuitionAdjustment + intlAdjustment,
      ),
    ),
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyRange(value: number, currency: string, spread = 0.12, usdToNpr = 134.5) {
  if (currency === "USD") {
    return `$${Math.round(value).toLocaleString()}`;
  }
  const valueNpr = value * usdToNpr;
  const low = Math.max(0, Math.round(valueNpr * (1 - spread)));
  const high = Math.round(valueNpr * (1 + spread));
  return formatNPRDevanagariRange(low, high);
}

export function UniversitySelection({
  matches,
  loading,
  error,
  selectedMatch,
  form,
  session,
  usdToNpr = 134.5,
  onSelect,
  onAdjustPreferences,
  onClearFilters,
  runMatch,
}: UniversitySelectionProps) {
  const [detailsMatch, setDetailsMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<DetailsTab>("estimates");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const closeDetails = () => {
    setDetailsMatch(null);
    setActiveTab("estimates");
  };

  const matchesByScore = [...matches].sort(
    (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
  );

  const filteredMatches = matchesByScore.filter((m) => {
    if (m.admissionRate === 0 || (typeof m.matchScore === "number" && m.matchScore <= 0)) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.popularPrograms?.some((p) => p.toLowerCase().includes(q))
    );
  });

  const displayedMatches = filteredMatches.slice(0, visibleLimit);

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
    const reasons: string[] = [];
    const gpa = parseFloat(form.gpa);
    if (!isNaN(gpa) && gpa > 0 && gpa < 2.5) {
      reasons.push(`Your GPA (${gpa}) is below minimum admission requirements (2.5 - 3.0+) for standard universities.`);
    }

    const testScore = parseFloat(form.testScore);
    const testType = form.testType || "IELTS";
    if (form.hasEnglishTest !== false && !isNaN(testScore) && testScore > 0) {
      if (
        (testType === "IELTS" && testScore < 6.0) ||
        (testType === "TOEFL" && testScore < 75) ||
        (testType === "PTE" && testScore < 50) ||
        (testType === "Duolingo" && testScore < 100)
      ) {
        reasons.push(`Your ${testType} score (${testScore}) is below the minimum required proficiency cutoff for direct entry.`);
      }
    }

    const budget = parseFloat(form.budget);
    if (!isNaN(budget) && budget > 0 && budget < 10000) {
      reasons.push(`Your annual tuition budget ($${budget.toLocaleString()}) is lower than typical university tuition fees ($12,000+).`);
    }

    if (form.countries && form.countries.length > 0) {
      reasons.push(`Selected destination country filters (${form.countries.join(", ")}) restricted matching university options.`);
    }

    if (form.degree || form.field) {
      const fieldDesc = [form.degree, form.field, form.program].filter(Boolean).join(" • ");
      if (fieldDesc) {
        reasons.push(`Target program filters (${fieldDesc}) have specific academic prerequisite requirements.`);
      }
    }

    if (reasons.length === 0) {
      reasons.push("Your combined academic, language, location, and budget filters resulted in zero eligible programs.");
    }

    return (
      <div className="text-center py-16 md:py-24 animate-in fade-in zoom-in-95 duration-700 max-w-2xl mx-auto px-6">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/5">
            <Search className="w-9 h-9 text-blue-500" />
          </div>
        </div>

        <h3 className="text-[26px] md:text-[30px] font-[900] text-[#111827] mb-3 tracking-tight">
          No Direct Matches Found
        </h3>
        <p className="text-[#64748b] font-medium text-[15px] mb-8 max-w-md mx-auto leading-relaxed">
          Our matching engine checked all partner institutions against your profile and filters.
        </p>

        {/* Detailed Reasons Box */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 mb-10 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            Why Colleges Were Not Displayed:
          </div>
          <ul className="space-y-2 text-xs font-medium text-slate-700">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span className="leading-normal">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleLimit(20);
            }}
            placeholder="Search universities, courses..."
            className="w-full h-12 md:h-16 pl-12 md:pl-14 pr-6 bg-slate-50/50 rounded-[18px] md:rounded-2xl text-[14px] md:text-[15px] font-regular text-slate-900 outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-[18px] md:rounded-2xl border border-slate-200/60 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`h-10 md:h-14 px-3.5 md:px-4 rounded-[14px] md:rounded-xl flex items-center gap-2 text-xs font-black transition-all ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List View"
              className={`h-10 md:h-14 px-3.5 md:px-4 rounded-[14px] md:rounded-xl flex items-center gap-2 text-xs font-black transition-all ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-6 md:pb-8">
          {displayedMatches.length > 0 ? (
            displayedMatches.map((m) => (
              <div key={m.id} className="relative h-full">
                <MatchCard
                  match={m}
                  currency={form.currency}
                  selected={selectedMatch?.id === m.id}
                  usdToNpr={usdToNpr}
                  onSelect={() => onSelect(m)}
                  onOpenDetails={() => {
                    setDetailsMatch(m);
                    setActiveTab("estimates");
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No universities found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-4 pb-6 md:pb-8">
          {displayedMatches.length > 0 ? (
            displayedMatches.map((m) => (
              <MatchListItem
                key={m.id}
                match={m}
                currency={form.currency}
                selected={selectedMatch?.id === m.id}
                usdToNpr={usdToNpr}
                onSelect={() => onSelect(m)}
                onOpenDetails={() => {
                  setDetailsMatch(m);
                  setActiveTab("estimates");
                }}
              />
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 font-medium">
              No universities found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}

      {/* Load More Pagination */}
      {filteredMatches.length > visibleLimit && (
        <div className="flex flex-col items-center justify-center pt-4 pb-12 gap-3">
          <p className="text-xs font-semibold text-slate-500">
            Showing {displayedMatches.length} of {filteredMatches.length} best matching universities
          </p>
          <button
            onClick={() => setVisibleLimit((prev) => prev + 20)}
            className="px-8 py-3.5 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Load More Universities (+20)
          </button>
        </div>
      )}

      {detailsMatch && (
        <UniversityDetailsModal
          match={detailsMatch}
          currency={form.currency}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          usdToNpr={usdToNpr}
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
  usdToNpr = 134.5,
  onSelect,
  onOpenDetails,
}: {
  match: Match;
  currency: string;
  selected?: boolean;
  usdToNpr?: number;
  onSelect?: () => void;
  onOpenDetails?: () => void;
}) {
  const acceptanceRate = getRelevantAcceptanceRate(m);
  const acceptanceMeta = getAcceptanceMeta(acceptanceRate);

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
        <div className="absolute top-3 left-3 md:top-4 md:left-4 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] md:text-[11px] font-black text-emerald-400 tracking-wider">
            {m.matchScore || 85}% Match
          </span>
        </div>
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
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8px] md:text-[9px] font-bold uppercase tracking-wider shadow-sm">
            {(m.matchScore || 85) >= 90 ? "Excellent Fit" : (m.matchScore || 85) >= 80 ? "Strong Fit" : "Good Fit"}
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
              {m.popularPrograms?.[0] || "Program details available"}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[11px] md:text-[12px] font-medium text-slate-700">
                Duration
              </span>
            </div>
            <span className="text-[11px] md:text-[12px] font-semibold text-[#111827]">
              {m.durationYears ? `${m.durationYears} Years` : "1-4 Years"}
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
              {(() => {
                const fee = (m.tuitionFee && m.tuitionFee > 0)
                  ? m.tuitionFee
                  : (m.countryCode === "CA" || m.location?.includes("CA")) ? 18500
                  : (m.countryCode === "GB" || m.location?.includes("UK")) ? 19500
                  : (m.countryCode === "AU" || m.location?.includes("AU")) ? 22000
                  : (m.countryCode === "DE" || m.location?.includes("DE")) ? 3500
                  : 24500;
                return `${formatCurrencyRange(fee, c, 0.1, usdToNpr)} / yr`;
              })()}
            </span>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 ${acceptanceMeta.iconClass}`}
                />
                <span className="text-[11px] md:text-[12px] font-medium text-slate-700">
                  Acceptance
                </span>
              </div>
              <span
                className={`text-[11px] md:text-[12px] font-bold ${acceptanceMeta.textClass}`}
              >
                {acceptanceRate}% ({acceptanceMeta.label})
              </span>
            </div>
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${acceptanceMeta.barClass}`}
                style={{ width: `${acceptanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Match Reasons Badges */}
        {m.matchReasons && m.matchReasons.length > 0 && (
          <div className="mb-4 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
            {m.matchReasons.slice(0, 2).map((reason, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-50/70 border border-blue-100/80 text-blue-700 text-[10px] font-semibold rounded-md truncate max-w-full"
              >
                ✓ {reason}
              </span>
            ))}
          </div>
        )}

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

function MatchListItem({
  match: m,
  currency: c,
  selected,
  usdToNpr = 134.5,
  onSelect,
  onOpenDetails,
}: {
  match: Match;
  currency: string;
  selected?: boolean;
  usdToNpr?: number;
  onSelect?: () => void;
  onOpenDetails?: () => void;
}) {
  const acceptanceRate = getRelevantAcceptanceRate(m);
  const acceptanceMeta = getAcceptanceMeta(acceptanceRate);

  return (
    <div
      onClick={() => onSelect?.()}
      className={`bg-white border rounded-[24px] p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 group relative ${
        selected
          ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10"
          : "border-slate-100 hover:border-blue-200"
      }`}
    >
      {/* Left: Logo & Uni Info */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative p-2">
          {m.logo ? (
            <Image
              src={m.logo}
              alt={m.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <span className="text-blue-600 font-black text-xl">
              {m.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base md:text-lg font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {m.name}
            </h3>
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
              {m.matchScore || 85}% Match
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-blue-500" />
              #{m.rankingWorld || 1} Global
            </div>
          </div>

          <p className="text-indigo-600 font-bold text-xs md:text-sm mb-2 truncate">
            {m.popularPrograms?.[0] || "Program details available"}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {m.location || "Location TBD"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {m.durationYears ? `${m.durationYears} Years` : "1-4 Years"}
            </span>
          </div>

          {/* Match Reasons Badges */}
          {m.matchReasons && m.matchReasons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {m.matchReasons.slice(0, 3).map((reason, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-bold rounded-md"
                >
                  ✓ {reason}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Metrics (Tuition & Acceptance Rate) */}
      <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
        <div className="text-left lg:text-right">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
            Annual Tuition
          </p>
          <p className="text-sm md:text-base font-black text-slate-900">
            {(() => {
              const fee = (m.tuitionFee && m.tuitionFee > 0)
                ? m.tuitionFee
                : (m.countryCode === "CA" || m.location?.includes("CA")) ? 18500
                : (m.countryCode === "GB" || m.location?.includes("UK")) ? 19500
                : (m.countryCode === "AU" || m.location?.includes("AU")) ? 22000
                : (m.countryCode === "DE" || m.location?.includes("DE")) ? 3500
                : 24500;
              return formatCurrencyRange(fee, c, 0.1, usdToNpr);
            })()}
          </p>
        </div>

        <div className="text-left lg:text-right min-w-[110px]">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
            Acceptance Rate
          </p>
          <p className={`text-sm md:text-base font-black ${acceptanceMeta.textClass}`}>
            {acceptanceRate}% ({acceptanceMeta.label})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.();
            }}
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200 transition-all"
          >
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm ${
              selected
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {selected ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Selected
              </>
            ) : (
              <>
                Select
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UniversityDetailsModal({
  match: m,
  currency: c,
  activeTab,
  setActiveTab,
  usdToNpr = 134.5,
  onClose,
  onShortlist,
}: {
  match: Match;
  currency: string;
  activeTab: DetailsTab;
  setActiveTab: React.Dispatch<React.SetStateAction<DetailsTab>>;
  usdToNpr?: number;
  onClose: () => void;
  onShortlist: () => void;
}) {
  const admissionChance = getRelevantAcceptanceRate(m);
  const yearlyLiving = Math.round(Math.max((m.tuitionFee || 0) * 0.38, 9000));
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
    <div className="fixed inset-0 z-[120] bg-slate-950/50 backdrop-blur-md p-4 md:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Close details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[88vh] rounded-3xl bg-white border border-slate-200/80 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.25)] overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
        {/* Compact Hero Banner */}
        <div className="relative h-36 md:h-44 shrink-0 bg-slate-900 overflow-hidden">
          <Image
            src={m.banner || "/uni-default.webp"}
            alt={m.name}
            fill
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <div className="absolute left-5 md:left-8 bottom-4 md:bottom-6 text-white z-10 pr-14">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                {admissionChance}% Match
              </span>
              {m.rankingWorld && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                  QS #{m.rankingWorld}
                </span>
              )}
            </div>
            <h3 className="text-lg md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-xs">
              {m.name}
            </h3>
            <p className="text-xs font-semibold text-slate-200/90 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              {m.location || "Location not specified"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 border border-white/30 backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer z-20"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Tab Bar */}
        <div className="shrink-0 border-b border-slate-100 px-5 md:px-8 py-3 bg-white flex gap-1.5 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#3686FF] text-white shadow-xs shadow-blue-500/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Minimal Content Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 bg-slate-50/60 hide-scrollbar">
          {activeTab === "estimates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Est. Total Annual Cost
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {formatCurrencyRange((m.tuitionFee || 0) + yearlyLiving, c, 0.12, usdToNpr)}
                  </p>
                </div>
                <div className="mt-5">
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }} />
                    <div className="h-full bg-emerald-500 rounded-full ml-1" style={{ width: "30%" }} />
                    <div className="h-full bg-amber-400 rounded-full ml-1" style={{ width: "10%" }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> Tuition
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Living
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Other
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Admission Probability
                  </p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tight">
                    {admissionChance}%
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-4 leading-relaxed">
                  Based on your GPA, test scores, and institutional acceptance requirements.
                </p>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Info className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">About Institution</h4>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  {m.description ||
                    `${m.name} is a premier institution offering high quality degree programs, modern campus facilities, and research opportunities for international students.`}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">Popular Offerings</h4>
                </div>
                <div className="space-y-2">
                  {courses.slice(0, 3).map((program) => (
                    <div
                      key={program}
                      className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-700 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {program}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rankings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">QS World Rank</p>
                  <p className="text-3xl font-black text-slate-900">#{m.rankingWorld || "N/A"}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">National Rank</p>
                  <p className="text-3xl font-black text-slate-900">#{m.rankingNational || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((program, idx) => (
                <div
                  key={`${program}-${idx}`}
                  className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 mb-2">
                      {formProgramTag(program)}
                    </span>
                    <p className="font-extrabold text-slate-900 text-sm leading-snug">
                      {program}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tuition Fee</p>
                      <p className="font-black text-slate-800">
                        {(() => {
                          const fee = (m.tuitionFee && m.tuitionFee > 0)
                            ? m.tuitionFee
                            : (m.countryCode === "CA" || m.location?.includes("CA")) ? 18500
                            : (m.countryCode === "GB" || m.location?.includes("UK")) ? 19500
                            : (m.countryCode === "AU" || m.location?.includes("AU")) ? 22000
                            : (m.countryCode === "DE" || m.location?.includes("DE")) ? 3500
                            : 24500;
                          return formatCurrencyRange(fee, c, 0.1, usdToNpr);
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Deadline</p>
                      <p className="font-black text-slate-800">
                        {m.deadline || m.applicationDeadline || "Rolling"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "facts" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Type</p>
                <p className="text-sm font-extrabold text-slate-900">{m.type || "Public"}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Established</p>
                <p className="text-sm font-extrabold text-slate-900">{m.founded || "N/A"}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Students</p>
                <p className="text-sm font-extrabold text-slate-900">
                  {m.studentPopulation ? `${m.studentPopulation.toLocaleString()}+` : "N/A"}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">English Req</p>
                <p className="text-sm font-extrabold text-slate-900">IELTS {m.englishReq || "6.5"}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Minimum GPA</p>
                <p className="text-sm font-extrabold text-slate-900">
                  {(m.gpaRequirement ? (m.gpaRequirement > 4.0 ? Math.round(((m.gpaRequirement / 100) * 4.0) * 10) / 10 : m.gpaRequirement) : 3.0).toFixed(1)} / 4.0
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Intl Students</p>
                <p className="text-sm font-extrabold text-slate-900">{m.internationalPercentage || "18"}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Action Footer */}
        <div className="shrink-0 border-t border-slate-100 p-4 md:px-7 md:py-4 bg-white flex items-center justify-between gap-3">
          <Link
            href={`/schools/${m.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            Visit Campus Page <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onShortlist}
            className="px-6 py-3 rounded-xl bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" /> Shortlist University
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
