/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Search, BookOpen, Coins, ArrowRight, ChevronDown, Globe2, Users,
  Filter, Building2, Star, LayoutGrid, List, Calendar, ChevronLeft,
  ChevronRight, MapPin, Trophy, ClipboardList, Rocket, Loader2, Sparkles
} from "lucide-react";

const COUNTRY_CODES: { [key: string]: string } = {
  "All Countries": "US,CA,GB,AU,DE",
  "United States": "US",
  "Canada": "CA",
  "United Kingdom": "GB",
  "Australia": "AU",
  "Germany": "DE"
};

function FilterSelect({ icon: Icon, label, value, setValue, options }: any) {
  return (
    <div className="flex-1 w-full px-4 py-2 group">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#3686FF]" />
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent font-extrabold text-[15px] text-slate-900 appearance-none outline-none cursor-pointer"
        >
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-[#3686FF] transition-colors" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("Computer Science");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedCity, setSelectedCity] = useState("New York");
  const [selectedBudget, setSelectedBudget] = useState("$20k - $40k / yr");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const countryCode = COUNTRY_CODES[selectedCountry] || "US";
      const response = await fetch(`/api/universities/search?q=${encodeURIComponent(searchQuery)}&countries=${countryCode}`);
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load universities. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCountry]);

  useEffect(() => {
    fetchUniversities();
  }, [selectedCountry, fetchUniversities]);

  const handleApplyFilters = () => {
    fetchUniversities();
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF] overflow-x-hidden pb-10">
      
      {/* Modern Glassmorphic Hero */}
      <section className="relative pt-[140px] pb-[180px] px-6 lg:px-12 flex flex-col items-center text-center">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#3686FF]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
          {/* Mesh Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">Global Education Network</span>
          </div>
          
          <h1 className="text-[48px] md:text-[64px] lg:text-[80px] font-black text-slate-900 leading-[1.05] mb-6 tracking-tighter drop-shadow-sm">
            Find Your Dream <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3686FF] to-indigo-500">University Abroad</span>
          </h1>
          
          <p className="text-[16px] md:text-[20px] text-slate-500 font-medium max-w-2xl mb-12 leading-relaxed">
            Compare 15,000+ programs across 80 countries. Discover your perfect match and start your global education journey today.
          </p>

          {/* Premium Search Bar */}
          <div className="w-full max-w-[800px] bg-white/80 p-3 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white flex items-center mb-16 backdrop-blur-xl group hover:shadow-[0_30px_80px_rgba(54,134,255,0.12)] hover:bg-white transition-all">
            <div className="flex-1 flex items-center px-6">
              <Search className="w-6 h-6 text-slate-300 group-focus-within:text-[#3686FF] transition-colors mr-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, programs, or countries..."
                className="w-full h-14 text-[18px] font-medium text-slate-900 placeholder-slate-400 outline-none bg-transparent"
              />
            </div>
            <button 
              onClick={() => fetchUniversities()}
              className="bg-[#3686FF] hover:bg-[#2970E6] text-white px-10 h-14 rounded-full font-extrabold text-[15px] transition-all shadow-[0_10px_20px_rgba(54,134,255,0.3)] hover:shadow-[0_15px_30px_rgba(54,134,255,0.4)] flex items-center gap-2 uppercase tracking-wide hover:-translate-y-0.5 active:translate-y-0"
            >
              Search Now
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 md:gap-20 text-slate-900 w-full max-w-3xl border-t border-slate-200/50 pt-12 relative">
            <div className="flex flex-col items-center">
              <span className="text-[32px] md:text-[48px] font-black tracking-tighter leading-none mb-2 text-[#3686FF]">2.5k+</span>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-[12px]">Universities</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-slate-200/50 px-8 md:px-20">
              <span className="text-[32px] md:text-[48px] font-black tracking-tighter leading-none mb-2 text-[#3686FF]">80+</span>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-[12px]">Countries</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[32px] md:text-[48px] font-black tracking-tighter leading-none mb-2 text-[#3686FF]">50k+</span>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-[12px]">Placed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Filter Bar */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 -mt-16 mb-16">
        <div className="bg-white rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-6 flex flex-col lg:flex-row items-center gap-4 border border-slate-100">
          <FilterSelect icon={BookOpen} label="Major" value={selectedMajor} setValue={setSelectedMajor} options={["Computer Science", "Business Admin", "Data Science", "Engineering"]} />
          <div className="w-full lg:w-px h-px lg:h-12 bg-slate-100 shrink-0" />
          <FilterSelect icon={Globe2} label="Country" value={selectedCountry} setValue={setSelectedCountry} options={["All Countries", "United States", "Canada", "United Kingdom", "Australia", "Germany"]} />
          <div className="w-full lg:w-px h-px lg:h-12 bg-slate-100 shrink-0" />
          <FilterSelect icon={Building2} label="City" value={selectedCity} setValue={setSelectedCity} options={["New York", "Toronto", "London", "Sydney", "Berlin"]} />
          <div className="w-full lg:w-px h-px lg:h-12 bg-slate-100 shrink-0" />
          <FilterSelect icon={Coins} label="Budget" value={selectedBudget} setValue={setSelectedBudget} options={["$20k - $40k / yr", "$10k - $20k / yr", "$40k - $60k / yr", "$60k+ / yr"]} />
          
          <button 
            onClick={handleApplyFilters}
            className="w-full lg:w-16 h-16 shrink-0 bg-slate-900 hover:bg-black text-white rounded-[24px] flex items-center justify-center transition-all shadow-lg hover:-translate-y-1 group mt-4 lg:mt-0"
          >
            <Filter className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <section className="px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h3 className="text-[28px] font-black text-slate-900 tracking-tight">
              {loading ? "Searching universities..." : `${results.length} Universities Found`}
            </h3>
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-white text-slate-900 shadow-md border border-slate-100 transition-all">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-transparent text-slate-400 hover:bg-white hover:shadow-sm border border-transparent transition-all">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
              <Loader2 className="w-12 h-12 text-[#3686FF] animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[12px]">Analyzing global database...</p>
            </div>
          ) : error ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
              <p className="text-rose-500 font-bold mb-4">{error}</p>
              <button onClick={() => fetchUniversities()} className="text-[#3686FF] font-black underline uppercase tracking-widest text-[12px]">Try again</button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-bold text-[18px]">No universities found matching your criteria.</p>
              <p className="text-slate-400 font-medium mt-2">Try adjusting your filters above to see more results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {results.map((uni) => (
                <div key={uni.id} className="bg-white rounded-[36px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden group hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                  {/* Image Area */}
                  <div className="relative h-[260px] w-full overflow-hidden shrink-0">
                    <Image
                      src={uni.image || "/uni-default.webp"}
                      alt={uni.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Trophy className="w-3.5 h-3.5 text-[#3686FF]" />
                        <span className="text-[11px] font-black text-[#3686FF] tracking-widest uppercase">#4 Global</span>
                      </div>
                      <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                        Scholarship
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-1 relative bg-white">
                    {/* Logo Overlay */}
                    <div className="absolute -top-12 left-8 w-20 h-20 rounded-[24px] border-[4px] border-white bg-white shadow-xl flex items-center justify-center p-2 z-20">
                      <Image 
                        src={uni.logo || `https://logo.clearbit.com/${new URL(uni.website).hostname}`} 
                        alt={`${uni.name} Logo`} 
                        width={48} 
                        height={48} 
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    <div className="pt-8 mb-4">
                      <h4 className="text-[22px] font-black text-slate-900 leading-tight mb-2 line-clamp-1">{uni.name}</h4>
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[12px] uppercase tracking-wide">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span className="truncate">{uni.location}, {uni.country}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[13px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{uni.acceptanceRate}% Acceptance</span>
                    </div>

                    <p className="text-slate-500 text-[14px] leading-relaxed mb-8 line-clamp-2 font-medium">
                      Discover excellence at {uni.name}, a leading institution in {uni.country} offering world-class education.
                    </p>

                    <div className="mt-auto">
                      {/* Info Blocks */}
                      <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-[20px] bg-slate-50 border border-slate-100">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tuition/Year</p>
                          <p className="text-[18px] font-black text-slate-900">
                            {typeof uni.tuition === 'number' ? `$${uni.tuition.toLocaleString()}` : uni.tuition}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Intake</p>
                          <div className="flex items-center justify-end gap-1.5 text-slate-900 font-black">
                            <Calendar className="w-4 h-4 text-[#3686FF]" />
                            <span className="text-[15px]">Sep 2026</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Users className="w-4 h-4 text-[#3686FF]" />
                          <span className="text-[12px] font-bold uppercase tracking-widest">Diverse Campus</span>
                        </div>
                        <Link 
                          href={session ? `/universities/${uni.id}` : `/register?callbackUrl=${encodeURIComponent(`/universities/${uni.id}`)}`} 
                          className="bg-[#3686FF] text-white h-12 px-6 rounded-full font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2970E6] transition-all group active:scale-95 shadow-[0_8px_20px_rgba(54,134,255,0.3)] hover:shadow-[0_12px_24px_rgba(54,134,255,0.4)]"
                        >
                          View
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <button className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
              <button className="w-10 h-10 rounded-[16px] bg-[#3686FF] text-white font-black text-[14px] shadow-md shadow-blue-500/20">1</button>
              <button className="w-10 h-10 rounded-[16px] bg-transparent text-slate-500 font-bold text-[14px] hover:bg-slate-50 transition-all">2</button>
              <button className="w-10 h-10 rounded-[16px] bg-transparent text-slate-500 font-bold text-[14px] hover:bg-slate-50 transition-all">3</button>
              <span className="text-slate-300 px-2 font-black">...</span>
              <button className="w-10 h-10 rounded-[16px] bg-transparent text-slate-500 font-bold text-[14px] hover:bg-slate-50 transition-all">31</button>
            </div>
            <button className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section className="py-32 px-6 lg:px-12 bg-white relative overflow-hidden mt-20 border-t border-slate-100">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(54,134,255,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <div className="mb-24">
            <h5 className="text-[#3686FF] font-black tracking-[0.2em] uppercase text-[12px] mb-4">How it Works</h5>
            <h2 className="text-[40px] md:text-[56px] font-black text-slate-900 leading-none mb-6 tracking-tight">
              Our Proven <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3686FF] to-indigo-500">Work Process</span>
            </h2>
            <p className="text-slate-500 font-medium text-[18px] max-w-xl mx-auto">
              Three simple steps to your global education journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-8 relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-slate-100 rounded-full z-0" />

            {[
              {
                id: "01",
                title: "Discover",
                desc: "Search and filter universities by subject, country, budget, and ranking to find your perfect match.",
                icon: Search
              },
              {
                id: "02",
                title: "Compare",
                desc: "Side-by-side comparison of tuition, requirements, scholarships, and campus life across institutions.",
                icon: ClipboardList
              },
              {
                id: "03",
                title: "Apply",
                desc: "Submit applications directly through our platform with guided support at every step.",
                icon: Rocket
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center relative z-10 px-4 group">
                <div className="relative mb-10">
                  {/* Icon Circle */}
                  <div className="w-[120px] h-[120px] rounded-[40px] bg-white border border-slate-100 flex items-center justify-center text-[#3686FF] shadow-[0_20px_40px_rgba(54,134,255,0.08)] relative overflow-hidden group-hover:shadow-[0_20px_60px_rgba(54,134,255,0.15)] group-hover:-translate-y-2 transition-all duration-500 rotate-45 group-hover:rotate-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 relative z-10">
                      <step.icon className="w-12 h-12" strokeWidth={2} />
                    </div>
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-white font-black text-[14px] z-20 shadow-sm group-hover:bg-[#3686FF] transition-colors">
                    {step.id}
                  </div>
                </div>
                <h4 className="text-[24px] font-black text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
