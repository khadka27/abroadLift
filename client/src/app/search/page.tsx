/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Search, BookOpen, Coins, ArrowRight, ChevronDown, Globe2, Users,
  Filter, Building2, Star, LayoutGrid, List, Calendar, ChevronLeft,
  ChevronRight, MapPin, Trophy, ClipboardList, Rocket, Loader2, Sparkles, RotateCcw
} from "lucide-react";
import { FlagIcon } from "@/components/matches/FlagIcon";
import SearchGlobe from "@/components/SearchGlobe";

const COUNTRY_CODES: { [key: string]: string } = {
  "All Countries": "US,CA,GB,AU,DE,IE,MT",
  "United States": "US",
  "Canada": "CA",
  "United Kingdom": "GB",
  "Australia": "AU",
  "Germany": "DE",
  "Ireland": "IE",
  "Malta": "MT"
};

function FilterSelect({ icon: Icon, label, value, setValue, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFilterQuery("");
    }
  }, [isOpen]);

  const showSearch = options.length > 5;

  const filteredOptions = useMemo(() => {
    if (!showSearch || !filterQuery) return options;
    return options.filter((opt: string) =>
      opt.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [options, filterQuery, showSearch]);

  return (
    <div ref={dropdownRef} className="flex-1 w-full px-4 py-2 group relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mb-1.5 cursor-pointer select-none"
      >
        <Icon className="w-4 h-4 text-[#3686FF]" />
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-transparent font-extrabold text-[15px] text-slate-900 cursor-pointer py-1 flex items-center justify-between group-hover:text-[#3686FF] transition-colors select-none"
        >
          <span className="truncate pr-4">{value}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-[#3686FF] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#3686FF]" : ""}`} />
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-3 z-50 bg-white/95 backdrop-blur-xl border border-slate-100/80 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] flex flex-col max-h-[300px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {showSearch && (
              <div className="p-2 border-b border-slate-100/80 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none border-none p-0"
                  />
                </div>
              </div>
            )}
            
            <div className="overflow-y-auto py-1 flex-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-4 text-xs font-semibold text-slate-400 text-center">
                  No matching results
                </div>
              ) : (
                filteredOptions.map((opt: string) => {
                  const isSelected = opt === value;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setValue(opt);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[14px] font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? "bg-[#3686FF]/10 text-[#3686FF]" 
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <span className="truncate pr-2">{opt}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#3686FF] shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("All Majors");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const [rawResults, setRawResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableCountries, setAvailableCountries] = useState<{ code: string; name: string }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const MAJOR_OPTIONS = [
    "All Majors",
    "Computer Science & IT",
    "Data Science & AI",
    "Business & Management",
    "Engineering",
    "Medicine & Health",
    "Law",
    "Arts & Humanities",
    "Social Sciences",
    "Hospitality & Tourism",
    "Architecture & Design",
    "Agriculture & Forestry",
    "Education & Teaching",
    "Media & Journalism",
    "Liberal Arts & General"
  ];

  const BUDGET_OPTIONS = [
    "All Budgets",
    "Under $15,000 / yr",
    "$15,000 - $30,000 / yr",
    "$30,000 - $45,000 / yr",
    "Above $45,000 / yr"
  ];

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    rawResults.forEach((uni) => {
      if (uni.location) {
        const parts = uni.location.split(",");
        const cityName = parts[0].trim();
        if (cityName) {
          cities.add(cityName);
        }
      }
    });
    return ["All Cities", ...Array.from(cities).sort()];
  }, [rawResults]);

  useEffect(() => {
    if (!availableCities.includes(selectedCity)) {
      setSelectedCity("All Cities");
    }
  }, [availableCities, selectedCity]);

  const filteredResults = useMemo(() => {
    return rawResults.filter((uni) => {
      // 1. Filter by Major
      if (selectedMajor !== "All Majors") {
        if (!uni.majors || !uni.majors.includes(selectedMajor)) {
          return false;
        }
      }
      
      // 2. Filter by City
      if (selectedCity !== "All Cities") {
        if (!uni.location || !uni.location.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }
      
      // 3. Filter by Budget
      if (selectedBudget !== "All Budgets") {
        const val = uni.tuitionValue || 0;
        if (selectedBudget === "Under $15,000 / yr" && val >= 15000) {
          return false;
        } else if (selectedBudget === "$15,000 - $30,000 / yr" && (val < 15000 || val > 30000)) {
          return false;
        } else if (selectedBudget === "$30,000 - $45,000 / yr" && (val < 30000 || val > 45000)) {
          return false;
        } else if (selectedBudget === "Above $45,000 / yr" && val <= 45000) {
          return false;
        }
      }
      
      return true;
    });
  }, [rawResults, selectedMajor, selectedCity, selectedBudget]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(start, start + itemsPerPage);
  }, [filteredResults, currentPage]);

  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    const delta = 1;

    range.push(1);

    if (currentPage > delta + 3) {
      range.push("...");
    }

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - delta - 2) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResults]);

  // Fetch unique countries dynamically from API to populate the country filter
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await fetch("/api/schools?allCountries=true");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAvailableCountries(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let countryCode = "";
      if (selectedCountry !== "All Countries") {
        const found = availableCountries.find(
          (c) => c.name.toLowerCase() === selectedCountry.toLowerCase()
        );
        countryCode = found ? found.code : "US";
      } else {
        // Fetch all campuses in the API by combining all represented country codes
        countryCode = availableCountries.map((c) => c.code).join(",");
      }

      const response = await fetch(`/api/universities/search?q=${encodeURIComponent(searchQuery)}&countries=${countryCode}`);
      const data = await response.json();
      
      if (data.results) {
        setRawResults(data.results);
      } else {
        setRawResults([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load universities. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCountry, availableCountries]);

  useEffect(() => {
    // Wait until countries are loaded (or check fails) before fetching universities
    if (availableCountries.length > 0 || !loadingCountries) {
      fetchUniversities();
    }
  }, [selectedCountry, availableCountries, loadingCountries, fetchUniversities]);

  const handleClearFilters = () => {
    setSelectedMajor("All Majors");
    setSelectedCity("All Cities");
    setSelectedBudget("All Budgets");
    setSelectedCountry("All Countries");
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF] overflow-x-hidden pb-10">
      
      {/* Modern Glassmorphic Hero */}
      <section className="relative pt-[120px] pb-[140px] px-6 lg:px-12 w-full overflow-hidden">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#3686FF]/8 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] bg-emerald-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
          {/* Mesh Grid */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-start text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full mb-12">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">Global Education Network</span>
              </div>
              
              <h1 className="text-[42px] md:text-[56px] lg:text-[68px] font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter drop-shadow-sm">
                Find Your Dream <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3686FF] to-indigo-500">University Abroad</span>
              </h1>
              
              <p className="text-[16px] md:text-[18px] text-slate-500 font-semibold max-w-xl mb-8 leading-relaxed">
                Compare 15,000+ programs across top destinations. Discover your perfect match and start your global education journey today.
              </p>

              {/* Supported Countries Flags Selection */}
              <div className="w-full mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Popular Destinations</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "United States", code: "US" },
                    { name: "Canada", code: "CA" },
                    { name: "United Kingdom", code: "GB" },
                    { name: "Australia", code: "AU" },
                    { name: "Germany", code: "DE" },
                    { name: "Ireland", code: "IE" },
                    { name: "Malta", code: "MT" }
                  ].map((country) => {
                    const isSelected = selectedCountry === country.name;
                    return (
                      <button
                        key={country.code}
                        onClick={() => {
                          setSelectedCountry(isSelected ? "All Countries" : country.name);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border transition-all duration-300 active:scale-95 cursor-pointer shadow-sm ${
                          isSelected
                            ? "bg-[#3686FF] border-[#3686FF] text-white shadow-blue-500/20 scale-105"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <FlagIcon countryCode={country.code} className="w-4.5 h-3 rounded-sm object-cover shrink-0" />
                        {country.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Globe Area */}
            <div className="lg:col-span-5 flex justify-center items-center overflow-visible w-full min-h-[350px] md:min-h-[450px]">
              <SearchGlobe />
            </div>

          </div>

          {/* Premium Search Bar & Stats */}
          <div className="w-full max-w-[900px]">
            <div className="w-full bg-white p-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center group hover:shadow-[0_25px_60px_rgba(54,134,255,0.1)] hover:border-blue-200 transition-all">
              <div className="flex-1 flex items-center px-6">
                <Search className="w-6 h-6 text-slate-300 group-focus-within:text-[#3686FF] transition-colors mr-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search universities, programs, or countries..."
                  className="w-full h-14 text-[17px] font-bold text-slate-900 placeholder-slate-400 outline-none bg-transparent"
                />
              </div>
              <button 
                onClick={() => fetchUniversities()}
                className="bg-[#3686FF] hover:bg-[#2970E6] text-white px-10 h-14 rounded-full font-black text-[14px] uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(54,134,255,0.2)] hover:shadow-[0_12px_24px_rgba(54,134,255,0.3)] flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Search
              </button>
            </div>


          </div>

        </div>
      </section>

      {/* Floating Filter Bar */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 -mt-16 mb-16">
        <div className="bg-white rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-6 flex flex-col lg:flex-row items-center gap-4 border border-slate-100">
          <FilterSelect icon={BookOpen} label="Major" value={selectedMajor} setValue={setSelectedMajor} options={MAJOR_OPTIONS} />
          <div className="w-full lg:w-px h-px lg:h-12 bg-slate-100 shrink-0" />
          <FilterSelect 
            icon={Globe2} 
            label="Country" 
            value={selectedCountry} 
            setValue={setSelectedCountry} 
            options={["All Countries", ...availableCountries.map((c) => c.name)]} 
          />
          <div className="w-full lg:w-px h-px lg:h-12 bg-slate-100 shrink-0" />
          <FilterSelect icon={Building2} label="City" value={selectedCity} setValue={setSelectedCity} options={availableCities} />
          <div className="w-full lg:w-px h-px lg:h-12 bg-slate-100 shrink-0" />
          <FilterSelect icon={Coins} label="Budget" value={selectedBudget} setValue={setSelectedBudget} options={BUDGET_OPTIONS} />
          
          <button 
            onClick={handleClearFilters}
            className="w-full lg:w-16 h-16 shrink-0 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-[24px] flex items-center justify-center transition-all shadow-xs hover:-translate-y-1 group mt-4 lg:mt-0 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <section className="px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h3 className="text-[28px] font-black text-slate-900 tracking-tight">
              {loading ? "Searching universities..." : `${filteredResults.length} Universities Found`}
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewType("grid")}
                className={`w-12 h-12 flex items-center justify-center rounded-[18px] transition-all cursor-pointer ${
                  viewType === "grid" 
                    ? "bg-white text-slate-900 shadow-md border border-slate-100" 
                    : "bg-transparent text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewType("list")}
                className={`w-12 h-12 flex items-center justify-center rounded-[18px] transition-all cursor-pointer ${
                  viewType === "list" 
                    ? "bg-white text-slate-900 shadow-md border border-slate-100" 
                    : "bg-transparent text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid or List View */}
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
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-bold text-[18px]">No universities found matching your criteria.</p>
              <p className="text-slate-400 font-medium mt-2">Try adjusting your filters above to see more results.</p>
            </div>
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {paginatedResults.map((uni) => (
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
                        <span className="text-[11px] font-black text-[#3686FF] tracking-widest uppercase">#{uni.rankingWorld || "500"} Global</span>
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
                      {uni.logo ? (
                        <Image 
                          src={uni.logo} 
                          alt={`${uni.name} Logo`} 
                          width={48} 
                          height={48} 
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-lg uppercase">
                          {uni.name ? uni.name.slice(0, 2) : "UN"}
                        </div>
                      )}
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
                          href={session ? `/schools/${uni.id}` : `/register?callbackUrl=${encodeURIComponent(`/schools/${uni.id}`)}`} 
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
          ) : (
            <div className="flex flex-col gap-6 mb-20">
              {paginatedResults.map((uni) => (
                <div key={uni.id} className="bg-white rounded-[32px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-1 transition-all duration-400 flex flex-col md:flex-row items-stretch p-6 gap-6 w-full">
                  {/* Left: Image Container */}
                  <div className="relative h-[200px] md:h-auto md:w-[280px] rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={uni.image || "/uni-default.webp"}
                      alt={uni.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-85" />
                    {/* Ranking badge inside image */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Trophy className="w-3.5 h-3.5 text-[#3686FF]" />
                      <span className="text-[10px] font-black text-[#3686FF] tracking-widest uppercase">#{uni.rankingWorld || "500"}</span>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="text-[20px] font-black text-slate-900 leading-tight group-hover:text-[#3686FF] transition-colors">{uni.name}</h4>
                        <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                          Scholarship
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[12px] uppercase tracking-wide mb-4">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="truncate">{uni.location}, {uni.country}</span>
                      </div>

                      <p className="text-slate-500 text-[14px] leading-relaxed mb-4 line-clamp-2 max-w-2xl font-medium">
                        Discover excellence at {uni.name}, a leading institution in {uni.country} offering world-class education with rich academic options.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-slate-500 text-[13px] font-bold">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-slate-700">{uni.acceptanceRate}% Acceptance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4.5 h-4.5 text-[#3686FF]" />
                        <span className="text-slate-700">Diverse Campus</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full md:w-px h-px md:h-auto bg-slate-100 shrink-0" />

                  {/* Right: Actions / Pricing */}
                  <div className="w-full md:w-[200px] flex md:flex-col justify-between md:justify-center items-center md:items-stretch gap-4 shrink-0">
                    <div className="md:text-center w-full">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Est. Tuition/Year</p>
                      <p className="text-[20px] font-black text-slate-900 leading-none">
                        {typeof uni.tuition === 'number' ? `$${uni.tuition.toLocaleString()}` : uni.tuition}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Next: Sep 2026</p>
                    </div>
                    
                    <Link 
                      href={session ? `/schools/${uni.id}` : `/register?callbackUrl=${encodeURIComponent(`/schools/${uni.id}`)}`} 
                      className="bg-[#3686FF] text-white h-12 px-6 rounded-full font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2970E6] transition-all group active:scale-95 shadow-[0_8px_20px_rgba(54,134,255,0.2)] hover:shadow-[0_12px_24px_rgba(54,134,255,0.3)] w-full text-center"
                    >
                      View
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
                {paginationRange.map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={`ellipsis-${idx}`} className="text-slate-300 px-2 font-black select-none">
                        ...
                      </span>
                    );
                  }
                  const pageNum = p as number;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-[16px] text-[14px] font-black transition-all ${
                        isActive
                          ? "bg-[#3686FF] text-white shadow-md shadow-blue-500/20"
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
                className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
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
