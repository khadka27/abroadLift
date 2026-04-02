"use client";

import React from "react";
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
  ArrowRight 
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
  runMatch
}: UniversitySelectionProps) {

  if (loading) return null; // Handled by transition screen in parent

  if (error) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button onClick={runMatch} className="text-blue-600 font-black underline">Try again</button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16 md:py-24 animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-6 h-6 text-slate-300" />
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 mb-2">No direct matches found</h3>
        <p className="text-slate-400 font-medium text-[15px] mb-10">Try adjusting your filters to see more results.</p>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button onClick={onAdjustPreferences} className="w-full sm:w-auto px-8 h-12 bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-widest">Adjust Preferences</button>
          <button onClick={onClearFilters} className="w-full sm:w-auto px-8 h-12 bg-white border border-slate-200 text-slate-500 rounded-full font-bold text-[11px] uppercase tracking-widest">Clear Filters</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 p-3 md:p-4 mb-10 md:mb-16 flex flex-col md:flex-row items-center gap-3 md:gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search universities, courses..."
            className="w-full h-14 md:h-16 pl-14 pr-8 bg-slate-50/50 rounded-[20px] md:rounded-2xl text-[15px] font-regular text-slate-900 outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-14 md:h-16 px-8 md:px-10 rounded-[20px] md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center gap-2 text-slate-900 font-semibold text-[13px] md:text-sm tracking-tight shadow-sm hover:bg-slate-50 transition-all">
            <ArrowUpDown className="w-[16px] h-[16px] text-slate-400" />
            Sort
          </button>
          <button className="flex-1 md:flex-none h-14 md:h-16 px-8 md:px-10 rounded-[20px] md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center gap-2 text-slate-900 font-semibold text-[13px] md:text-sm tracking-tight shadow-sm hover:bg-slate-50 transition-all">
            <SlidersHorizontal className="w-[16px] h-[16px] text-slate-400" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-12 pb-32">
        {matches.map((m) => (
          <div key={m.id} className="relative h-full">
            <MatchCard
              match={m}
              currency={form.currency}
              selected={selectedMatch?.id === m.id}
              onSelect={() => onSelect(m)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match: m, currency: c, selected, onSelect }: { match: Match; currency: string; selected?: boolean; onSelect?: () => void }) {
  const fmtVal = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      className={`bg-white border text-left rounded-[36px] overflow-hidden transition-all duration-500 cursor-pointer relative group flex flex-col h-full ${selected ? "border-blue-500 ring-1 ring-blue-500/20 shadow-2xl translate-y-[-6px]" : "border-slate-100 hover:shadow-2xl hover:border-blue-200 hover:translate-y-[-4px]"}`}
      onClick={onSelect}
    >
      <div className="relative w-full h-[180px] sm:h-[230px] overflow-hidden">
        <Image src={m.banner || "/uni-default.webp"} alt={m.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white flex items-center gap-2 shadow-lg">
          <Trophy className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-[11px] font-extrabold text-[#3b82f6] uppercase tracking-widest">#{m.rankingWorld || 1} Global</span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest truncate max-w-[140px] text-slate-500">{m.location || "LONDON, UK"}</span>
          </div>
          <div className="px-5 py-1.5 rounded-full bg-[#ff9f43] text-white text-[9px] font-bold uppercase tracking-widest shadow-sm">Recommended</div>
        </div>

        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative p-3">
            {m.logo ? <Image src={m.logo} alt={m.name} fill className="object-contain p-2" /> : <span className="text-blue-600 font-semibold text-[22px]">{m.name.charAt(0)}</span>}
          </div>
          <div className="min-w-0">
            <h3 className="text-[22px] font-bold text-[#111827] leading-tight mb-1">{m.name}</h3>
            <p className="text-[#4F46E5] font-semibold text-[16px] tracking-tight">{m.popularPrograms?.[0] || "MSc Computer Science"}</p>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500"><Calendar className="w-5 h-5" /><span className="text-[13px] font-semibold text-black">Duration</span></div>
            <span className="text-[13px] font-semibold text-[#111827]">1 Year</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500"><Wallet className="w-5 h-5" /><span className="text-[13px] font-semibold text-black">Tuition</span></div>
            <span className="text-[13px] font-semibold text-[#111827]">{m.tuitionFee ? `${fmtVal(m.tuitionFee)} / yr` : "TBD"}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500"><CheckCircle2 className="w-5 h-5 text-[#10b981]" /><span className="text-[13px] font-semibold text-black">Acceptance Rate</span></div>
              <span className="text-[14px] font-extrabold text-[#10b981] uppercase">{m.admissionRate || 78}%</span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-[#10b981] rounded-full transition-all duration-1000" style={{ width: `${m.admissionRate || 78}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button onClick={(e) => { e.stopPropagation(); onSelect?.(); }} className="w-full h-16 rounded-[30px] bg-[#3686FF] text-white font-bold text-[16px] shadow-[0_8px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group">
            Select University <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
