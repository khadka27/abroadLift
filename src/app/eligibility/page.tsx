"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  GraduationCap,
  Calendar,
  Layers,
  BarChart3,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Award,
  BookOpen,
  MapPin,
} from "lucide-react";
import { CA, US, AU, GB, DE, IE, NL } from "country-flag-icons/react/3x2";
import Link from "next/link";
import { Inter, Outfit } from "next/font/google";
import { RECOMMENDED_UNIVERSITIES } from "@/lib/data/universityMetaData";
import NextImage from "next/image";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

/* ─────────────── Flag Component ─────────────── */
const FlagIcon = ({
  countryCode,
  className = "w-6 h-4",
}: {
  countryCode: string;
  className?: string;
}) => {
  const map: Record<string, React.ComponentType<{ className?: string }>> = { CA, US, USA: US, AU, GB, UK: GB, DE, IE, NL };
  const TargetFlag = map[countryCode?.toUpperCase()];
  
  return TargetFlag ? (
    <TargetFlag className={`${className} rounded shadow-sm`} />
  ) : (
    <div className={`${className} bg-zinc-200 rounded`} />
  );
};

/* ─────────────── Logic Helpers ─────────────── */

const COUNTRIES = [
  { code: "US", name: "USA", gapLimit: 5 },
  { code: "CA", name: "Canada", gapLimit: 2 },
  { code: "AU", name: "Australia", gapLimit: 1 },
  { code: "GB", name: "UK", gapLimit: 2 },
  { code: "DE", name: "Germany", gapLimit: 5 },
  { code: "IE", name: "Ireland", gapLimit: 3 },
];

const DEGREES = ["Bachelor's", "Master's", "PhD"];

const getGapEligibility = (countries: string[], gap: number) => {
  return countries.map(code => {
    const c = COUNTRIES.find((x) => x.code === code);
    if (!c) return { code, status: "unknown", message: "Unknown" };

    if (gap <= c.gapLimit) {
      return {
        code,
        name: c.name,
        status: "acceptable",
        message: "Acceptable",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        tips: "Your study gap is within the normal range. Minimal justification needed.",
      };
    } else if (gap <= c.gapLimit + 3) {
      return {
        code,
        name: c.name,
        status: "moderate",
        message: "Needs Justification",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        tips: "Provide work experience letters or certificates for this period to explain the gap.",
      };
    } else {
      return {
        code,
        name: c.name,
        status: "challenging",
        message: "Challenging",
        color: "text-rose-600 bg-rose-50 border-rose-100",
        tips: "Heavy documentation of work, health, or personal circumstances is required. GTE might be strict.",
      };
    }
  });
};

const getAcceptanceRateDifficulty = (gpa: number, testScore: number) => {
  if (gpa >= 3.5 && testScore >= 7) return { label: "Easy", color: "text-emerald-500", percent: 85 };
  if (gpa >= 3.0 && testScore >= 6.5) return { label: "Moderate", color: "text-amber-500", percent: 60 };
  return { label: "Competitive", color: "text-rose-500", percent: 35 };
};

/* ─────────────────────────────────────────────
   Acceptance Rate Finder Component
 ───────────────────────────────────────────── */

interface UnivResult {
  id: string;
  name: string;
  location: string;
  tuition: string | number;
  acceptanceRate: number;
  website: string;
  country: string;
}

function AcceptanceRateFinder() {
  const [query, setQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["US"]);
  const [results, setResults] = useState<UnivResult[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev => 
      prev.includes(code) 
        ? (prev.length > 1 ? prev.filter(c => c !== code) : prev) 
        : [...prev, code]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/universities/search?q=${encodeURIComponent(query)}&countries=${selectedCountries.join(",")}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-24 pt-24 border-t border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className={`text-4xl font-black text-slate-900 mb-4 ${outfit.className}`}>
          University <span className="text-teal-600">Acceptance Rate</span> Finder
        </h2>
        <p className="text-slate-500">
          Search across multiple countries to compare acceptance rates, admission difficulty, and costs.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-16 space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter Countries:</span>
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => toggleCountry(c.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                selectedCountries.includes(c.code)
                  ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-500"
              }`}
            >
              <FlagIcon countryCode={c.code} className="w-4 h-3" />
              <span className="text-xs font-bold">{c.name}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter university name..."
              className="w-full bg-white border border-slate-200 rounded-[24px] pl-14 pr-6 py-5 text-lg font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-12 py-5 rounded-[24px] font-black text-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin w-6 h-6" /> : "Search"}
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                <div className="w-16 h-4 bg-slate-100 rounded-full" />
              </div>
              <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-4" />
              <div className="h-4 bg-slate-50 rounded w-1/2 mb-6" />
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex justify-between"><div className="w-20 h-3 bg-slate-50 rounded" /><div className="w-10 h-3 bg-slate-100 rounded" /></div>
                <div className="flex justify-between"><div className="w-20 h-3 bg-slate-50 rounded" /><div className="w-10 h-3 bg-slate-100 rounded" /></div>
              </div>
            </div>
          ))
        ) : results.map((uni, i) => (
          <div key={i} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                <GraduationCap className="w-6 h-6 text-slate-400 group-hover:text-teal-600" />
              </div>
              <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {uni.country}
              </div>
            </div>
            
            <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors">
              {uni.name}
            </h4>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-6">
              <MapPin className="w-3.5 h-3.5 text-slate-300" />
              {uni.location}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acceptance Rate</span>
                <span className="text-sm font-black text-emerald-600">{uni.acceptanceRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${uni.acceptanceRate < 25 ? 'bg-rose-50 text-rose-600' : uni.acceptanceRate < 50 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {uni.acceptanceRate < 25 ? 'Hard' : uni.acceptanceRate < 50 ? 'Moderate' : 'Easy'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Fee</span>
                <span className="text-sm font-black text-slate-700">{typeof uni.tuition === 'number' ? `$${uni.tuition.toLocaleString()}/yr` : uni.tuition}</span>
              </div>
            </div>

            <a 
              href={uni.website?.startsWith('http') ? uni.website : `https://${uni.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-600 text-xs font-black rounded-2xl transition-all"
            >
              School Website <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && query && (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
           <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-medium">No universities found matching &ldquo;{query}&rdquo; in selected countries.</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */

export default function EligibilityHub() {
  const [form, setForm] = useState({
    countries: ["US"],
    degree: "Master's",
    gradYear: 2023,
    studyGap: 1,
    gpa: 3.2,
    englishScore: 6.5,
    activity: "",
    lastEdu: "Bachelor in Computer Science",
  });

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const data = await res.json();
            const p = data.profile || {};
            setForm((prev) => ({
              ...prev,
              gpa: p.gpa || prev.gpa,
              countries: p.nationality ? [p.nationality] : prev.countries,
            }));
          }
        } catch (e) {
          console.error("Failed to load profile", e);
        }
      };
      fetchProfile();
    }
  }, [status]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const gapStatuses = getGapEligibility(form.countries, form.studyGap);
  const difficulty = getAcceptanceRateDifficulty(form.gpa, form.englishScore);

  const toggleFormCountry = (code: string) => {
    setForm(prev => ({
      ...prev,
      countries: prev.countries.includes(code)
        ? (prev.countries.length > 1 ? prev.countries.filter(c => c !== code) : prev.countries)
        : [...prev.countries, code]
    }));
  };

  const handleCheck = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] pb-20 ${inter.className}`}>
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="w-40 h-10 relative">
              <NextImage src="/logo.png" alt="AbroadLift Logo" fill className="object-contain object-left" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> AI-Powered Admissions Assistant
            </div>
          </div>
          <h1 className={`text-5xl font-black text-slate-900 mb-4 max-w-3xl leading-tight ${outfit.className}`}>
            Check Your <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-500">Eligibility</span> for International Universities
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Get instant insights on study gaps, acceptance chances, and university recommendations based on your profile.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-600" /> Academic Profile
              </h3>

              <div className="space-y-6">
                {/* Country */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Destination Countries
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => toggleFormCountry(c.code)}
                        className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border transition-all h-28 ${
                          form.countries.includes(c.code) 
                            ? "bg-white border-teal-500 text-teal-700 shadow-[0_10px_30px_-5px_rgba(20,184,166,0.1)] ring-2 ring-teal-500/10" 
                            : "bg-slate-50 border-slate-100 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <div className="w-10 h-7 flex items-center justify-center">
                          <FlagIcon countryCode={c.code} className="w-full h-full object-cover rounded-sm shadow-sm" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level & Last Ed */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Study Level</label>
                    <select 
                      value={form.degree}
                      onChange={(e) => setForm({...form, degree: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Graduation Year</label>
                    <input 
                      type="number" 
                      value={form.gradYear}
                      onChange={(e) => {
                        const yr = parseInt(e.target.value);
                        setForm({...form, gradYear: yr, studyGap: Math.max(0, 2026 - yr)});
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* GPA & English */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">GPA / Percentage</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={form.gpa}
                      onChange={(e) => setForm({...form, gpa: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">IELTS Score</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={form.englishScore}
                      onChange={(e) => setForm({...form, englishScore: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* Gap Activity */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" /> Gap Activity (Work, Hobby, Study)
                  </label>
                  <textarea 
                    value={form.activity}
                    onChange={(e) => setForm({...form, activity: e.target.value})}
                    placeholder="e.g. 2 years working as a Software Engineer..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-teal-500/20 min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  onClick={handleCheck}
                  disabled={isProcessing}
                  className="w-full bg-linear-to-r from-violet-300 to-indigo-300 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 group"
                >
                  {isProcessing ? <RefreshCw className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                  Continue to Analysis
                </button>
              </div>
            </div>

            <div className="bg-[#EEF2FF] rounded-[32px] p-6 flex gap-4 border border-[#C7D2FE]/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="relative z-10">
                <p className="text-indigo-900 font-bold text-sm mb-1">Need help with documents?</p>
                <p className="text-indigo-700/70 text-xs leading-relaxed">
                  Our consultants can help you prepare perfectly justified gap statements and SOPs.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Results & AI Report */}
          <div className="lg:col-span-7 space-y-8">
            {!showResult && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8">
                  <Search className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Awaiting Analysis...</h2>
                <p className="text-slate-500 max-w-sm mb-8">
                  Fill in your academic profile on the left to see your personalized university eligibility report.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 text-left">
                    <BarChart3 className="w-5 h-5 text-teal-500 mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Feature</p>
                    <p className="text-sm font-bold text-slate-800">Gap Checker</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 text-left">
                    <Award className="w-5 h-5 text-emerald-500 mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Feature</p>
                    <p className="text-sm font-bold text-slate-800">Acceptance Odds</p>
                  </div>
                </div>
              </div>
            )}

            {(isProcessing || showResult) && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* 1. Score Overview */}
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center relative overflow-hidden text-clip">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <BarChart3 className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Acceptance Chance</p>
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * difficulty.percent) / 100} className={difficulty.color} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-xl font-black text-slate-900">{difficulty.percent}%</span>
                    </div>
                    <p className={`text-sm font-black ${difficulty.color}`}>{difficulty.label}</p>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Calendar className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Study Gap Status</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {gapStatuses.map((g, idx) => (
                        <div key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold ${g.color}`}>
                           {g.status === 'acceptable' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                           {g.code}: {g.message}
                        </div>
                      ))}
                    </div>
                    <p className="text-xl font-black text-slate-900">{form.studyGap} {form.studyGap === 1 ? 'Year' : 'Years'}</p>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <BookOpen className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Profile Strength</p>
                    <p className="text-4xl font-black text-slate-900 mb-1">{form.gpa >= 3.5 ? 'Elite' : form.gpa >= 3.0 ? 'Strong' : 'Average'}</p>
                    <p className="text-xs text-slate-500 font-medium">For Top-tier matches</p>
                  </div>
                </div>

                {/* 2. AI Structured Report */}
                <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Assistant Report
                      </div>
                      <h3 className="text-2xl font-black">Admissions Advisor Analysis</h3>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           const countryList = gapStatuses.map(g => `${g.name}: ${g.message}`).join(", ");
                           const text = `Eligibility Report for ${countryList}\nGap: ${form.studyGap} years\nAcceptance Chance: ${difficulty.percent}%`;
                           navigator.clipboard.writeText(text);
                           alert("Report summary copied to clipboard!");
                         }}
                         className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-colors"
                         title="Copy Summary"
                       >
                         <Layers className="w-5 h-5" />
                       </button>
                       <button className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-colors" onClick={() => handleCheck()}>
                         <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                       </button>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Status Sections */}
                    <div className="grid border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                      <h4 className="flex items-center gap-2.5 text-slate-900 font-bold mb-4">
                        <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        </span>
                        Eligibility Verdict
                      </h4>
                      <div className="space-y-4">
                        <p className="text-slate-600 leading-relaxed text-sm">
                          Based on your academic profile and <strong>{form.studyGap}-year study gap</strong>, here is your standing:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {gapStatuses.map((g, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border ${g.color} flex flex-col gap-1`}>
                              <div className="flex items-center justify-between font-black text-xs">
                                <span>{g.name}</span>
                                <span className="uppercase text-[10px]">{g.message}</span>
                              </div>
                              <p className="text-[11px] leading-tight opacity-80">{g.tips}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                      <div>
                        <h4 className="flex items-center gap-2.5 text-slate-900 font-bold mb-4">
                          <FileText className="w-5 h-5 text-indigo-600" /> Required Documents
                        </h4>
                        <ul className="space-y-2">
                          {['Academic Transcripts', 'English Test Report (TRF)', 'Statement of Purpose (SOP)', '2-3 Recommendation Letters', 'Passport Copy'].map(doc => (
                            <li key={doc} className="flex items-center gap-2 text-sm text-slate-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" /> {doc}
                            </li>
                          ))}
                          {form.studyGap > 0 && (
                            <li className="flex items-center gap-2 text-sm text-indigo-600 font-bold">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Gap Justification Docs
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2.5 text-slate-900 font-bold mb-4">
                          <Sparkles className="w-5 h-5 text-amber-600" /> Key Recommendations
                        </h4>
                        <div className="text-sm text-slate-500 leading-relaxed italic">
                           &ldquo;Always highlight {form.activity.length > 5 ? 'your experience' : 'any courses or volunteering'} during this time to show personal growth.&rdquo;
                           <br/><br/>
                           &ldquo;For {gapStatuses.find(g => g.status !== 'acceptable')?.name || 'challenging'} destinations, consider applying to private universities which are often more flexible.&rdquo;
                        </div>
                      </div>
                    </div>

                    {/* Suggested Universities */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="flex items-center gap-2.5 text-slate-900 font-bold">
                          <GraduationCap className="w-5 h-5 text-emerald-600" /> Suggested Universities
                        </h4>
                        <Link href="/matches" className="text-xs font-bold text-teal-600 hover:gap-2 transition-all flex items-center gap-1 group">
                          View All Matches <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {form.countries.flatMap(c => RECOMMENDED_UNIVERSITIES[c] || []).slice(0, 3).map((uni, i) => (
                           <Link key={i} href={`/matches?country=${uni.code}`} className="p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/10 transition-all group block text-left">
                             <div className="flex justify-between items-start mb-3">
                               <FlagIcon countryCode={uni.code} className="w-5 h-3.5" />
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{uni.rank} World</span>
                             </div>
                             <h5 className="font-bold text-slate-900 text-xs mb-2 leading-tight h-8 line-clamp-2">{uni.name}</h5>
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] text-emerald-600 font-black">{uni.rate} Accept</span>
                               <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                 <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                               </div>
                             </div>
                           </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Acceptance Rate Finder Tool ── */}
        <AcceptanceRateFinder />
      </main>

      {/* Floating Action for Mobile */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[200]">
        {!showResult ? (
          <button 
            onClick={handleCheck}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl"
          >
            Check Eligibility Now
          </button>
        ) : (
          <button 
            onClick={() => setShowResult(false)}
            className="w-full bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl"
          >
            New Analysis
          </button>
        )}
      </div>
    </div>
  );
}
