"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Award, Search, Filter, Loader2, Sparkles, AlertCircle, CheckCircle, 
  ChevronRight, ChevronLeft, Calendar, Coins, GraduationCap, Globe2, BookOpen
} from "lucide-react";
import { evaluateScholarship } from "@/lib/scholarship-evaluator";
import Loading from "@/components/ui/Loading";

interface Scholarship {
  _id: string;
  scholarship_id: number;
  title: string;
  description?: string;
  automatically_applied?: boolean;
  award_amount_currency_code?: string;
  award_amount_currency_symbol?: string;
  award_amount_from?: string | number;
  award_amount_to?: string | number;
  award_amount_type?: string;
  eligible_levels?: string[];
  eligible_nationalities?: string[];
  slug?: string;
  source_url?: string;
  school_group_name?: string;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAutoApplied, setOnlyAutoApplied] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  // Description modal / expanded view
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // User Profile criteria for eligibility checking
  const [userProfile, setUserProfile] = useState({
    gpa: 3.5,
    englishScore: 7.0,
    testType: "IELTS",
    degreeLevel: "Master's Degree",
    nationality: "Nepal",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const p = data.profile || {};
          setUserProfile({
            gpa: p.gpa ? parseFloat(String(p.gpa)) : 3.5,
            englishScore: p.englishScore ? parseFloat(String(p.englishScore)) : 7.0,
            testType: p.testType || "IELTS",
            degreeLevel: p.degreeLevel || "Master's Degree",
            nationality: p.nationality || "Nepal",
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadProfile();
  }, []);

  const fetchScholarships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/scholarships?page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to retrieve scholarship data.");
      }
      const resData = await response.json();
      if (resData.success && resData.data) {
        setScholarships(resData.data);
        if (resData.pagination) {
          setTotalPages(resData.pagination.totalPages || 1);
        }
      } else {
        setScholarships([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  // Client-side filtering combined with paginated results
  const filteredScholarships = scholarships.filter((s) => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = s.title?.toLowerCase().includes(q);
      const matchesDesc = s.description?.toLowerCase().includes(q);
      const matchesSchool = s.school_group_name?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesSchool) {
        return false;
      }
    }

    // Auto-applied filter
    if (onlyAutoApplied && !s.automatically_applied) {
      return false;
    }

    // Eligible levels filter
    if (selectedLevel !== "All Levels") {
      const matchesLevel = s.eligible_levels?.some(
        (l) => l?.toLowerCase().includes(selectedLevel.toLowerCase())
      );
      if (!matchesLevel) return false;
    }

    return true;
  });

  // Simple renderer to format markdown-like text nicely in HTML
  const formatMarkdown = (text?: string) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      let content = line.trim();
      if (!content) return <div key={idx} className="h-2" />;

      // Header H1 / H2
      if (content.startsWith("#")) {
        const level = content.match(/^#+/)?.[0].length || 1;
        const textOnly = content.replace(/^#+\s*/, "");
        const headerClass = level === 1 
          ? "text-xl font-bold text-slate-800 mt-4 mb-2" 
          : "text-lg font-bold text-slate-800 mt-3 mb-2";
        return React.createElement(`h${Math.min(6, level + 1)}`, { key: idx, className: headerClass }, textOnly);
      }

      // Bullet Point
      if (content.startsWith("-") || content.startsWith("*")) {
        const textOnly = content.replace(/^[-*]\s*/, "");
        // Format bold tags inside bullet
        return (
          <li key={idx} className="list-disc ml-5 mb-1 text-slate-600 text-[14px]">
            {parseBoldText(textOnly)}
          </li>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-slate-600 text-[14px] leading-relaxed mb-2">
          {parseBoldText(content)}
        </p>
      );
    });
  };

  // Helper to parse **bold** text inside strings
  const parseBoldText = (str: string) => {
    const parts = str.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900">{part}</strong> : part);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF] overflow-x-hidden pb-20">
      
      {/* Hero Header */}
      <section className="relative pt-[120px] pb-[100px] px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[-5%] w-[350px] h-[350px] bg-[#3686FF]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">Financial Aid & Merit Awards</span>
          </div>

          <h1 className="text-[42px] md:text-[56px] lg:text-[72px] font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            International <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3686FF] to-indigo-500">Scholarships</span>
          </h1>

          <p className="text-[16px] md:text-[18px] text-slate-500 font-medium max-w-2xl mb-8 leading-relaxed">
            Discover entrance grants, merit fellowships, and automatically applied awards to fund your studies abroad.
          </p>
        </div>
      </section>

      {/* Filter & User Profile Eligibility Section */}
      <section className="max-w-[1280px] mx-auto px-6 mb-12 space-y-6">
        {/* User Input Criteria Bar for Scholarship Evaluation */}
        <div className="bg-slate-900 rounded-[24px] md:rounded-[32px] p-6 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2 border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Eligibility Checker
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Your Academic Credentials</h2>
              <p className="text-xs text-slate-300 font-medium">Adjust your criteria to see real-time eligibility scores for all active awards</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Evaluating for:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                {userProfile.nationality || "International"} Student
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* GPA Input */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Academic GPA (out of 4.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={userProfile.gpa}
                onChange={(e) => setUserProfile({ ...userProfile, gpa: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/10 text-white font-black text-sm px-3 py-1.5 rounded-xl outline-none focus:ring-2 ring-blue-400"
              />
            </div>

            {/* English Test Score Input */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Language Score ({userProfile.testType})</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9.0"
                value={userProfile.englishScore}
                onChange={(e) => setUserProfile({ ...userProfile, englishScore: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/10 text-white font-black text-sm px-3 py-1.5 rounded-xl outline-none focus:ring-2 ring-blue-400"
              />
            </div>

            {/* Target Degree Level */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Target Degree Level</label>
              <select
                value={userProfile.degreeLevel}
                onChange={(e) => setUserProfile({ ...userProfile, degreeLevel: e.target.value })}
                className="w-full bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl outline-none border border-white/10 focus:ring-2 ring-blue-400"
              >
                <option value="Master's Degree">Master's Degree / Postgrad</option>
                <option value="4-Year Bachelor's Degree">Bachelor's Degree</option>
                <option value="2-Year Undergraduate Diploma">Diploma / Certificate</option>
                <option value="Doctoral / PhD">Doctoral / PhD</option>
              </select>
            </div>

            {/* Country of Origin */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Citizenship / Country</label>
              <input
                type="text"
                value={userProfile.nationality}
                onChange={(e) => setUserProfile({ ...userProfile, nationality: e.target.value })}
                placeholder="e.g. Nepal"
                className="w-full bg-white/10 text-white font-bold text-xs px-3 py-2 rounded-xl outline-none focus:ring-2 ring-blue-400 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">
          
          {/* Search bar */}
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#3686FF] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships, schools, keywords..."
              className="w-full h-14 pl-14 pr-6 bg-slate-50/70 rounded-2xl text-[15px] font-medium text-slate-900 outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Level Filter Dropdown */}
          <div className="relative w-full lg:w-48">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full h-14 px-5 bg-slate-50/70 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all appearance-none cursor-pointer"
            >
              <option value="All Levels">All Levels</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {/* Checkbox filter for auto-applied */}
          <label className="flex items-center gap-3 cursor-pointer select-none px-2 shrink-0">
            <input
              type="checkbox"
              checked={onlyAutoApplied}
              onChange={(e) => setOnlyAutoApplied(e.target.checked)}
              className="w-5 h-5 rounded-lg border-slate-200 text-[#3686FF] focus:ring-blue-500/20 cursor-pointer accent-[#3686FF]"
            />
            <span className="text-[13px] font-bold text-slate-700 whitespace-nowrap">Auto-applied Only</span>
          </label>

        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-[1280px] mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <Loading size="lg" text="Fetching live scholarships..." />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm text-center px-6">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <p className="text-slate-800 font-black text-[20px] mb-2">Unable to load scholarships</p>
            <p className="text-slate-500 font-medium text-[14px] max-w-md mb-6">{error}</p>
            <button onClick={fetchScholarships} className="bg-[#3686FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2970E6] transition-all">Try again</button>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm px-6">
            <p className="text-slate-500 font-bold text-[18px]">No scholarships matched your criteria.</p>
            <p className="text-slate-400 font-medium mt-2">Adjust your search parameters or filter checkboxes.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredScholarships.map((s) => {
                const isExpanded = expandedId === s._id;
                const evalResult = evaluateScholarship(userProfile, s);
                const numAmt = parseFloat(String(s.award_amount_from));
                const displayAmount = s.award_amount_from && !isNaN(numAmt)
                  ? `${s.award_amount_currency_symbol || "$"}${numAmt.toLocaleString()}`
                  : "Funding Available";

                return (
                  <div 
                    key={s._id} 
                    className="bg-white rounded-[32px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col justify-between hover:shadow-[0_20px_60px_rgba(54,134,255,0.06)] hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center text-[#3686FF] shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${evalResult.badgeBg} ${evalResult.badgeBorder}`}>
                            {evalResult.status} ({evalResult.score}%)
                          </span>
                          {s.automatically_applied && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-500" /> Auto-Applied
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & School */}
                      <h3 className="text-[19px] font-black text-slate-900 leading-tight mb-2 line-clamp-2">
                        {s.title}
                      </h3>
                      <p className="text-[#3686FF] font-bold text-[12px] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Globe2 className="w-3.5 h-3.5" /> {s.school_group_name || "Partner University"}
                      </p>

                      {/* Key Reasons / Warnings */}
                      <div className="mb-4 bg-slate-50/70 p-3 rounded-xl space-y-1">
                        {evalResult.matchReasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold truncate">
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                        {evalResult.warningReasons.slice(0, 1).map((warning, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold truncate">
                            <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>

                      {/* Details blocks */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="rounded-xl bg-slate-50/70 p-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Value</span>
                          <span className="text-[14px] font-black text-slate-800 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-500" /> {displayAmount}
                          </span>
                        </div>
                        <div className="rounded-xl bg-slate-50/70 p-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Apply Method</span>
                          <span className="text-[12px] font-black text-slate-800 truncate block">
                            {s.automatically_applied ? "No Extra Forms" : "Separate Form"}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <div className={`text-slate-500 font-medium text-[13px] leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                          {isExpanded ? formatMarkdown(s.description) : (s.description || "").replace(/<[^>]*>/g, '').replace(/[\#\*]/g, '')}
                        </div>
                        {s.description && s.description.length > 150 && (
                          <button 
                            onClick={() => setExpandedId(isExpanded ? null : s._id)}
                            className="text-[#3686FF] hover:text-indigo-600 font-bold text-[12px] mt-2 block transition-colors"
                          >
                            {isExpanded ? "Collapse Details" : "Read Full Requirements →"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="border-t border-slate-50 pt-6 mt-auto">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {s.eligible_levels?.slice(0, 2).map((lvl, idx) => (
                          <span key={idx} className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                            {lvl}
                          </span>
                        ))}
                      </div>

                      {s.source_url && (
                        <a 
                          href={s.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                        >
                          Official Guidelines <BookOpen className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button 
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-50 disabled:pointer-events-none hover:shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    const isSelected = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-[14px] font-black text-[13px] transition-all ${
                          isSelected 
                            ? "bg-[#3686FF] text-white shadow-md shadow-blue-500/10" 
                            : "bg-transparent text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-50 disabled:pointer-events-none hover:shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
