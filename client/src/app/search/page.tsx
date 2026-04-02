/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Search, 
  BookOpen, 
  Coins, 
  ArrowRight, 
  ChevronDown, 
  Globe2, 
  Users,
  Filter,
  Building2,
  Star,
  LayoutGrid,
  List,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Trophy,
  ClipboardList,
  Rocket,
  Loader2
} from "lucide-react";



const COUNTRY_CODES: { [key: string]: string } = {
  "All Countries": "US,CA,GB,AU,DE",
  "United States": "US",
  "Canada": "CA",
  "United Kingdom": "GB",
  "Australia": "AU",
  "Germany": "DE"
};


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
    <main className="min-h-screen bg-white font-sans selection:bg-[#3366FF]/20 selection:text-[#3366FF]">
      {/* Hero Section with Library Background */}
      <section className="relative pt-[120px] pb-[160px] px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format"
            alt="Library background"
            fill
            className="object-cover opacity-60"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-b from-blue-900/70 via-blue-800/40 to-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-black text-white leading-[1.1] mb-6 drop-shadow-sm">
            Find Your Dream <br className="hidden md:block" />
            University Abroad
          </h1>
          <p className="text-lg md:text-xl text-blue-50/90 font-medium max-w-2xl mb-12 leading-relaxed">
            Compare 15,000+ programs across 80 countries. Your global education journey starts here.
          </p>

          {/* Main Search Bar */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-[32px] shadow-2xl flex items-center mb-16 border-4 border-white/20 backdrop-blur-sm">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-6 h-6 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, programs, or countries..."
                className="w-full h-14 text-lg font-medium text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
            <button 
              onClick={() => fetchUniversities()}
              className="bg-[#3366FF] hover:bg-[#2952cc] text-white px-10 h-14 rounded-[24px] font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              Search
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 text-white w-full max-w-5xl">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black mb-1 drop-shadow-md">2,500+</span>
              <span className="text-blue-100/80 font-bold uppercase tracking-widest text-sm">Universities</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black mb-1 drop-shadow-md">80+</span>
              <span className="text-blue-100/80 font-bold uppercase tracking-widest text-sm">Countries</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black mb-1 drop-shadow-md">50,000+</span>
              <span className="text-blue-100/80 font-bold uppercase tracking-widest text-sm">Students Placed</span>
            </div>
          </div>
        </div>

        {/* Floating Filter Bar */}
        <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-full max-w-[1240px] px-6 z-20">
          <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-6 lg:p-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-6 border border-gray-100">
            {/* Major Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 px-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Major</span>
              </div>
              <div className="relative group">
                <select 
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="w-full bg-[#f8faff] rounded-2xl px-5 h-[64px] font-bold text-gray-900 appearance-none outline-none border border-transparent focus:border-blue-200 transition-all cursor-pointer text-sm"
                >
                  <option>Computer Science</option>
                  <option>Business Admin</option>
                  <option>Data Science</option>
                  <option>Engineering</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Country Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 px-2">
                <Globe2 className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Country</span>
              </div>
              <div className="relative group">
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#f8faff] rounded-2xl px-5 h-[64px] font-bold text-gray-900 appearance-none outline-none border border-transparent focus:border-blue-200 transition-all cursor-pointer text-sm"
                >
                  <option>All Countries</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* City Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 px-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">City</span>
              </div>
              <div className="relative group">
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#f8faff] rounded-2xl px-5 h-[64px] font-bold text-gray-900 appearance-none outline-none border border-transparent focus:border-blue-200 transition-all cursor-pointer text-sm"
                >
                  <option>New York</option>
                  <option>Toronto</option>
                  <option>London</option>
                  <option>Sydney</option>
                  <option>Berlin</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Budget Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 px-2">
                <Coins className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Budget Range</span>
              </div>
              <div className="relative group">
                <select 
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-[#f8faff] rounded-2xl px-5 h-[64px] font-bold text-gray-900 appearance-none outline-none border border-transparent focus:border-blue-200 transition-all cursor-pointer text-sm"
                >
                  <option>$20k - $40k / yr</option>
                  <option>$10k - $20k / yr</option>
                  <option>$40k - $60k / yr</option>
                  <option>$60k+ / yr</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Apply Button */}
            <div className="lg:pt-6 pt-2">
             <button 
                onClick={handleApplyFilters}
                className="h-[64px] bg-[#3366FF] hover:bg-[#2952cc] text-white px-6 rounded-2xl font-black text-[13px] transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 w-full lg:w-auto active:scale-95 group uppercase tracking-[0.2em]"
              >
                  Apply Filters
                  <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pt-24 pb-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-100 gap-4">
            <h3 className="text-[22px] font-black text-gray-900">
              {loading ? "Searching..." : `${results.length} Universities Found`}
            </h3>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white shadow-lg transition-all">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#3366FF] animate-spin mb-4" />
              <p className="text-gray-500 font-bold">Finding best universities for you...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <button onClick={() => fetchUniversities()} className="text-[#3366FF] font-black underline">Try again</button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 font-bold">No universities found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {results.map((uni) => (
                <div key={uni.id} className="bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                  {/* Image Area */}
                  <div className="relative h-[240px] w-full overflow-hidden">
                    <Image
                      src={uni.image || "/uni-default.webp"}
                      alt={uni.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white">
                        <Trophy className="w-3.5 h-3.5 text-[#3366FF]" />
                        <span className="text-[11px] font-black text-[#3366FF] tracking-wide">#4 Global</span>
                      </div>
                      <div className="bg-[#3366FF] text-white px-4 py-1.5 rounded-full text-[11px] font-black shadow-lg shadow-blue-500/20">
                        Scholarship Available
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl border border-gray-100 p-2 flex items-center justify-center bg-white shadow-sm">
                        <Image 
                          src={uni.logo || `https://logo.clearbit.com/${new URL(uni.website).hostname}`} 
                          alt={`${uni.name} Logo`} 
                          width={32} 
                          height={32} 
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[20px] font-black text-gray-900 leading-tight mb-1 truncate">{uni.name}</h4>
                        <div className="flex items-center gap-1.5 text-red-500 font-bold text-[11px]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{uni.location}, {uni.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-500">{uni.acceptanceRate}% Acceptance</span>
                    </div>

                    <p className="text-gray-400 text-[13px] leading-relaxed mb-8 line-clamp-2 font-medium">
                      Discover excellence at {uni.name}, a leading institution in {uni.country} offering world-class education.
                    </p>

                    {/* Info Blocks */}
                    <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Tuition/Year</p>
                        <p className="text-[16px] font-black text-gray-900">
                          {typeof uni.tuition === 'number' ? `$${uni.tuition.toLocaleString()}` : uni.tuition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Intake</p>
                        <div className="flex items-center justify-end gap-1.5 text-gray-900 font-black">
                          <Calendar className="w-4 h-4 text-[#3366FF]" />
                          <span className="text-[13px]">Sep 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-[13px] font-black">Diverse Community</span>
                      </div>
                      <Link 
                        href={session ? `/universities/${uni.id}` : `/register?callbackUrl=${encodeURIComponent(`/universities/${uni.id}`)}`} 
                        className="bg-[#3366FF] text-white px-6 py-3 rounded-[16px] font-black text-[13px] flex items-center gap-2 hover:bg-[#2952cc] transition-all group active:scale-95 shadow-lg shadow-blue-500/20"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 rounded-2xl bg-[#3366FF] text-white font-black text-sm shadow-xl shadow-blue-500/20">1</button>
              <button className="w-12 h-12 rounded-2xl bg-white text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">2</button>
              <button className="w-12 h-12 rounded-2xl bg-white text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">3</button>
              <span className="text-gray-300 px-2 font-bold">...</span>
              <button className="w-12 h-12 rounded-2xl bg-white text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">31</button>
            </div>
            <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section className="py-24 px-6 lg:px-12 bg-[#F0F7FF] relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-white rounded-full blur-[120px] opacity-60" />
          <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-white rounded-full blur-[120px] opacity-60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)]" />
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10 text-center">
          <div className="mb-16">
            <h5 className="text-[#3366FF] font-black tracking-[0.2em] uppercase text-[10px] mb-4">How it Works</h5>
            <h2 className="text-[40px] md:text-[52px] font-black text-gray-900 leading-tight mb-6">
              Our Proven <span className="text-[#3366FF]">Work Process</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">
              Three simple steps to your global education journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-0 relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[4px] bg-[#001D4A] rounded-full z-0 opacity-100" />

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
              <div key={i} className="flex flex-col items-center relative z-10 px-8">
                <div className="relative mb-8">
                  {/* Icon Circle */}
                  <div className="w-[120px] h-[120px] rounded-full bg-[#3366FF] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <step.icon className="w-10 h-10 relative z-10" strokeWidth={2.5} />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute top-[40px] -right-4 w-12 h-12 rounded-full bg-[#001D4A] border-4 border-[#F0F7FF] flex items-center justify-center text-white font-black text-sm z-20">
                    {step.id}
                  </div>
                </div>
                <h4 className="text-[24px] font-black text-gray-900 mb-4">{step.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed max-w-[280px]">
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
