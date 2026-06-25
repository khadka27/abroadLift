"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calculator,
  MapPin,
  TrendingUp,
  Home,
  Utensils,
  Bus,
  BookOpen,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Info,
  Heart,
} from "lucide-react";
import Link from "next/link";

interface StudyCostResponse {
  city: string;
  country: string;
  exchange_rate: number;
  tuition_npr: number;
  living_npr: number;
  housing_npr: number;
  food_npr: number;
  transport_npr: number;
  healthcare_npr: number;
  education_npr: number;
  total_npr: number;
  monthly_npr: number;
  local_currency?: {
    code: string;
    symbol: string;
    rate_vs_usd: number;
    tuition: number;
    living: number;
    housing: number;
    food: number;
    transport: number;
    healthcare: number;
    total: number;
    monthly: number;
  };
  npr_formatted?: {
    tuition_en: string;
    tuition_dev: string;
    tuition_words: string;
    tuition_words_en?: string;
    living_en: string;
    living_dev: string;
    living_words: string;
    living_words_en?: string;
    housing_en: string;
    housing_dev: string;
    housing_words: string;
    housing_words_en?: string;
    food_en: string;
    food_dev: string;
    food_words: string;
    food_words_en?: string;
    transport_en: string;
    transport_dev: string;
    transport_words: string;
    transport_words_en?: string;
    healthcare_en: string;
    healthcare_dev: string;
    healthcare_words: string;
    healthcare_words_en?: string;
    total_en: string;
    total_dev: string;
    total_words: string;
    total_words_en?: string;
    monthly_en: string;
    monthly_dev: string;
    monthly_words: string;
    monthly_words_en?: string;
  };
}

interface UniversityRecommendation {
  id: string | number;
  name: string;
  location: string;
  tuition: string | number;
  acceptanceRate: number;
  website: string;
  country: string;
}

const COUNTRIES = [
  {
    code: "US",
    name: "USA",
    flag: "🇺🇸",
    cities: ["New York", "Boston", "San Francisco", "Chicago", "Los Angeles"],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    cities: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  },
  {
    code: "GB",
    name: "UK",
    flag: "🇬🇧",
    cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow"],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    cities: ["New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
  },
];

const COLOR_MAP = {
  blue: { box: "bg-blue-500/10", text: "text-blue-500" },
  emerald: { box: "bg-emerald-500/10", text: "text-emerald-500" },
  violet: { box: "bg-violet-500/10", text: "text-violet-500" },
  orange: { box: "bg-orange-500/10", text: "text-orange-500" },
} as const;

export default function CostingPage() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [city, setCity] = useState(COUNTRIES[0].cities[0]);
  const [tuition, setTuition] = useState("25000");
  const [data, setData] = useState<StudyCostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("First Year");
  const [recommendations, setRecommendations] = useState<UniversityRecommendation[]>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const fetchEstimate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cost-estimate?city=${encodeURIComponent(city)}&country=${country.code}&tuition_usd=${tuition}`,
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [city, country.code, tuition]);

  const fetchRecommendations = useCallback(async () => {
    setRecommendationLoading(true);
    try {
      const res = await fetch(
        `/api/universities/search?countries=${encodeURIComponent(country.name)}`,
      );
      const json = await res.json();
      setRecommendations(
        Array.isArray(json?.results) ? json.results.slice(0, 4) : [],
      );
    } catch (e) {
      console.error(e);
      setRecommendations([]);
    } finally {
      setRecommendationLoading(false);
    }
  }, [country.name]);

  useEffect(() => {
    fetchEstimate();
    fetchRecommendations();
  }, [fetchEstimate, fetchRecommendations]);

  // Client-side formatting helpers for fallback or manual calculations
  const toDevanagariDigits = (numStr: string): string => {
    const devanagariMap: Record<string, string> = {
      '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
      '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
    };
    return numStr.split('').map(char => devanagariMap[char] || char).join('');
  };

  const formatLakhCrore = (value: number): string => {
    const num = Math.round(value);
    const numStr = num.toString();
    if (numStr.length <= 3) return numStr;
    const lastThree = numStr.substring(numStr.length - 3);
    const remaining = numStr.substring(0, numStr.length - 3);
    const groups = [];
    let i = remaining.length;
    while (i > 0) {
      if (i >= 2) {
        groups.unshift(remaining.substring(i - 2, i));
        i -= 2;
      } else {
        groups.unshift(remaining.substring(0, i));
        i = 0;
      }
    }
    return groups.join(',') + ',' + lastThree;
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate scaled categories breakdown based on period
  const getBreakdown = () => {
    if (!data) return [];
    
    const isMonthly = period === "Month on Month";
    const factor = isMonthly ? 12 : 1;
    
    return [
      {
        label: "Tuition Fees",
        nprValue: Math.round(data.tuition_npr / factor),
        localValue: data.local_currency ? Math.round(data.local_currency.tuition / factor) : 0,
        note: isMonthly ? "Monthly tuition portion" : "Annual academic tuition costs",
        color: "blue",
        icon: BookOpen,
      },
      {
        label: "Rent & Housing",
        nprValue: Math.round(data.housing_npr / factor),
        localValue: data.local_currency ? Math.round(data.local_currency.housing / factor) : 0,
        note: isMonthly ? "Monthly student rent" : "Annual student housing/rent",
        color: "emerald",
        icon: Home,
      },
      {
        label: "Food & Groceries",
        nprValue: Math.round(data.food_npr / factor),
        localValue: data.local_currency ? Math.round(data.local_currency.food / factor) : 0,
        note: isMonthly ? "Monthly grocery budget" : "Annual grocery & food plans",
        color: "orange",
        icon: Utensils,
      },
      {
        label: "Commute & Transit",
        nprValue: Math.round(data.transport_npr / factor),
        localValue: data.local_currency ? Math.round(data.local_currency.transport / factor) : 0,
        note: isMonthly ? "Monthly public transit pass" : "Annual local transit costs",
        color: "violet",
        icon: Bus,
      },
      {
        label: "Healthcare & Insurance",
        nprValue: Math.round(data.healthcare_npr / factor),
        localValue: data.local_currency ? Math.round(data.local_currency.healthcare / factor) : 0,
        note: isMonthly ? "Monthly insurance portion" : "Annual mandatory health coverage",
        color: "blue",
        icon: Heart,
      },
    ];
  };

  const breakdown = getBreakdown();

  // Cost Mix Percentages
  const totalPercent = data ? Math.max(data.total_npr, 1) : 1;
  const tuitionPct = data ? Math.round((data.tuition_npr / totalPercent) * 100) : 0;
  const livingPct = data ? Math.round((data.living_npr / totalPercent) * 100) : 0;
  const otherPct = data ? Math.max(100 - tuitionPct - livingPct, 0) : 0;

  let costBand = "Loading live estimate";
  if (data) {
    const totalEstimate = data.total_npr;
    if (totalEstimate < 3_000_000) {
      costBand = "Budget Friendly";
    } else if (totalEstimate < 6_000_000) {
      costBand = "Balanced";
    } else {
      costBand = "Premium";
    }
  }

  const recommendationCount = recommendations.length;
  let recommendationSummary = `No live results yet for ${country.name}`;
  if (recommendationLoading) {
    recommendationSummary = "Loading live universities";
  } else if (recommendationCount > 0) {
    recommendationSummary = `${recommendationCount} live options in ${country.name}`;
  }

  const periodHeading = () => {
    if (period === "Month on Month") return "Monthly view";
    if (period === "Year on Year") return "Multi-year view";
    return "First-year view";
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] pb-24"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Upper Navigation Header */}
      <header className="pt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors group"
          >
            <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            <span>Back to Home</span>
          </Link>
          <div className="w-12 h-12 rounded-full bg-[#FFF7E8] border border-[#F7E8C6] flex items-center justify-center text-[#F6C56E] shadow-sm">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mt-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Intro Banner */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            {recommendationSummary}
          </span>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Study Abroad <span className="text-emerald-500">Cost Estimator</span>
            </h1>
            <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed">
              Dynamically calculate your full educational and living investment in NPR and local currencies. 
              Data is synced in real-time from worldwide currency rates and city living indices.
            </p>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (4/12 Width) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
              
              {/* Destination Selector */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Select Destination
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountry(c);
                        setCity(c.cities[0]);
                      }}
                      className={`py-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                        country.code === c.code
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                          : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span className="text-2xl">{c.flag}</span>
                      <span className="text-[11px] font-black">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <label htmlFor="preferred-city-select" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Preferred City
                </label>
                <select
                  id="preferred-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                >
                  {country.cities.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>

              {/* Annual Tuition (USD) */}
              <div className="space-y-2">
                <label htmlFor="annual-tuition-input" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Annual Tuition (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="annual-tuition-input"
                    type="number"
                    value={tuition}
                    onChange={(e) => setTuition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="e.g. 25000"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={fetchEstimate}
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <RefreshCw className="animate-spin w-5 h-5" />
                ) : (
                  <Calculator className="w-5 h-5" />
                )}
                Calculate Estimate
              </button>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-blue-50/50 rounded-3xl p-6 flex gap-4 border border-blue-100/50">
              <Info className="w-6 h-6 text-blue-500 shrink-0" />
              <p className="text-blue-700/80 text-sm leading-relaxed">
                <span className="font-bold">Pro Tip:</span> Living costs can
                vary significantly by lifestyle. This estimate covers standard
                student accommodation, mid-range food plans, and local public
                transport.
              </p>
            </div>
          </div>

          {/* Right Column: Results Dashboard (8/12 Width) */}
          <div className="lg:col-span-8 relative min-h-[500px]">
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[40px]">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
              </div>
            )}

            {data ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Result Header Banner */}
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <TrendingUp className="w-36 h-36" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                        {country.flag}
                      </div>
                      <div>
                        <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-0.5">
                          Selected Destination
                        </p>
                        <h2 className="text-2xl font-black text-white leading-tight">
                          {city}, {country.name}
                        </h2>
                        <p className="text-slate-400 text-xs">
                          Live index-scaled study costs loaded
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-2 font-bold text-slate-200 backdrop-blur-xs">
                        Tuition: {formatUSD(Number(tuition))}
                      </div>
                      <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-2 font-bold text-slate-200 backdrop-blur-xs">
                        Band: {costBand}
                      </div>
                      <Link
                        href="/matches"
                        className="rounded-xl bg-blue-600 px-4 py-2 font-black text-white shadow-md hover:bg-blue-700 transition-colors"
                      >
                        Find Matches
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 3-Card Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: NPR Total Estimate (English & Devanagari) */}
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.03)] space-y-4">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        Estimated Budget
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">/ {period === "Month on Month" ? "month" : "first year"}</p>
                    </div>

                    <div className="space-y-3.5">
                      {/* English Lakh/Crore Wording (User Request Primary) */}
                      <div>
                        <p className="text-2xl font-black text-slate-950 leading-none">
                          NPR {period === "Month on Month" ? (data.npr_formatted?.monthly_en ?? formatLakhCrore(data.monthly_npr)) : (data.npr_formatted?.total_en ?? formatLakhCrore(data.total_npr))}
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 leading-snug">
                          ({period === "Month on Month" ? data.npr_formatted?.monthly_words_en : data.npr_formatted?.total_words_en})
                        </p>
                      </div>

                      <hr className="border-slate-100" />

                      {/* Devanagari Wording (Traditional Layout) */}
                      <div>
                        <p className="text-xl font-extrabold text-slate-700 leading-none">
                          रु {period === "Month on Month" ? (data.npr_formatted?.monthly_dev ?? toDevanagariDigits(formatLakhCrore(data.monthly_npr))) : (data.npr_formatted?.total_dev ?? toDevanagariDigits(formatLakhCrore(data.total_npr)))}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1 leading-snug">
                          ({period === "Month on Month" ? data.npr_formatted?.monthly_words : data.npr_formatted?.total_words})
                        </p>
                      </div>

                      <hr className="border-slate-100" />

                      {/* Local Currency equivalent */}
                      {data.local_currency && (
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {country.name} Currency
                          </p>
                          <p className="text-sm font-black text-emerald-600 mt-0.5">
                            {data.local_currency.symbol}
                            {period === "Month on Month"
                              ? data.local_currency.monthly.toLocaleString()
                              : data.local_currency.total.toLocaleString()}{" "}
                            {data.local_currency.code}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Cost Mix */}
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.03)] flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        Cost Breakdown Mix
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Percentage share of total</p>
                    </div>

                    <div className="space-y-3 mt-4 flex-1 flex flex-col justify-center">
                      {[
                        { label: "Tuition Fees", value: tuitionPct, color: "bg-blue-500" },
                        { label: "Living Expenses", value: livingPct, color: "bg-emerald-500" },
                        { label: "Other Standard Costs", value: otherPct, color: "bg-amber-500" },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color} transition-all duration-500`}
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Live Exchange Rates */}
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.03)] space-y-4">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        Live Exchange Rate
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sync status: Active</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-base font-black text-slate-800 leading-tight">
                          1 USD = {data.exchange_rate.toFixed(2)} NPR
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Real-time USD conversions</p>
                      </div>

                      {data.local_currency && data.local_currency.code !== "USD" && (
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            1 USD = {data.local_currency.rate_vs_usd.toFixed(2)} {data.local_currency.code}
                          </p>
                          <p className="text-[10px] text-slate-400">Local currency rate</p>
                        </div>
                      )}

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-900 block mb-0.5">Tuition budget in NPR:</span>
                        NPR {formatLakhCrore(Number(tuition) * data.exchange_rate)}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Detailed Expense Categories (with period tab selector) */}
                <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.04)] p-6 md:p-8 space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Detailed Expense Categories
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Live cost components based on {city}'s index.
                      </p>
                    </div>
                    
                    {/* Period Selector Tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                      {["First Year", "Month on Month"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setPeriod(tab)}
                          className={`h-9 rounded-lg px-4 text-xs font-black transition-all ${
                            period === tab
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Breakdown Category List */}
                  <div className="space-y-3.5">
                    {breakdown.map((item) => {
                      const Icon = item.icon;
                      const palette = COLOR_MAP[item.color as keyof typeof COLOR_MAP] || COLOR_MAP.blue;

                      return (
                        <div
                          key={item.label}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-100 bg-[#FBFCFE] shadow-[0_8px_20px_rgba(15,23,42,0.01)] hover:border-emerald-200 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${palette.box} group-hover:scale-105 transition-transform`}>
                              <Icon className={`w-4 h-4 ${palette.text}`} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.note}
                              </p>
                            </div>
                          </div>

                          {/* Value Displays in NPR (English & Devanagari) + Local Currency */}
                          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 sm:gap-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                            
                            {/* NPR Wording */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                              {/* English digits Lakh/Crore */}
                              <span className="text-sm font-black text-slate-900">
                                NPR {formatLakhCrore(item.nprValue)}
                              </span>
                              {/* Devanagari digits Lakh/Crore */}
                              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                रु {toDevanagariDigits(formatLakhCrore(item.nprValue))}
                              </span>
                            </div>

                            {/* Target Country Local Money */}
                            {data.local_currency && (
                              <span className="text-[11px] font-semibold text-emerald-600">
                                {data.local_currency.symbol}
                                {item.localValue.toLocaleString()} {data.local_currency.code}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanatory Info Alert */}
                  <div className="rounded-2xl border border-indigo-100 bg-[#F6F7FF] p-4 text-xs text-indigo-600 shadow-[0_8px_20px_rgba(99,102,241,0.04)] flex items-start gap-2.5">
                    <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-0.5">Why this estimate is balanced</p>
                      <p className="leading-relaxed text-indigo-500/90">
                        Tuition fees contribute {tuitionPct}% and living expenses {livingPct}% of the overall first-year estimate. 
                        This distribution allows a balanced financial layout for student visa verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Universities list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Recommended Universities
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Matched institutions in {country.name} based on your preliminary budget
                      </p>
                    </div>
                    <Link
                      href="/matches"
                      className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      See All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {recommendationLoading && recommendations.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((idx) => (
                        <div
                          key={idx}
                          className="h-64 rounded-3xl border border-slate-100 bg-white animate-pulse"
                        />
                      ))}
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendations.map((uni) => {
                        const uniTuitionUsd = typeof uni.tuition === "number" ? uni.tuition : Number(uni.tuition);
                        const tuitionKnown = Number.isFinite(uniTuitionUsd) && uniTuitionUsd > 0;
                        const uniTuitionNpr = tuitionKnown ? uniTuitionUsd * data.exchange_rate : 0;
                        
                        let fitLabel = "Fee on request";
                        let fitColorClass = "bg-slate-50 text-slate-600";
                        if (tuitionKnown && uniTuitionUsd <= Number(tuition)) {
                          fitLabel = "Within budget";
                          fitColorClass = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                        } else if (tuitionKnown) {
                          fitLabel = "Stretch budget";
                          fitColorClass = "bg-amber-50 text-amber-700 border border-amber-100";
                        }

                        const fitScore = tuitionKnown
                          ? Math.max(58, Math.min(97, Math.round(100 - (Math.abs(uniTuitionUsd - Number(tuition)) / Math.max(Number(tuition) || 1, 1)) * 20 + (uni.acceptanceRate || 0) / 3)))
                          : Math.max(60, Math.min(94, Math.round(uni.acceptanceRate || 72)));

                        return (
                          <div
                            key={uni.id}
                            className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs flex flex-col hover:border-slate-300 transition-colors"
                          >
                            {/* University Card Header Banner */}
                            <div className="p-4 relative bg-slate-900 text-white min-h-[90px] flex flex-col justify-end overflow-hidden">
                              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_45%)]" />
                              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                {fitScore}% Fit
                              </span>
                              <p className="text-[9px] font-black tracking-[0.15em] uppercase text-slate-400">
                                {uni.country}
                              </p>
                              <h4 className="font-black text-xs md:text-sm mt-0.5 truncate">
                                {uni.name}
                              </h4>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 flex flex-col flex-1 gap-3.5">
                              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {uni.location}
                              </p>

                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
                                  <span className="text-slate-400 font-semibold uppercase block text-[9px] tracking-wide">Tuition</span>
                                  <span className="font-black text-slate-900 mt-0.5 block">
                                    {tuitionKnown ? formatUSD(uniTuitionUsd) : "Check site"}
                                  </span>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
                                  <span className="text-slate-400 font-semibold uppercase block text-[9px] tracking-wide">Acceptance</span>
                                  <span className="font-black text-slate-900 mt-0.5 block">
                                    {Math.round(uni.acceptanceRate || 0)}%
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 text-[10px] font-bold">
                                <span className={`rounded-lg px-2 py-1 self-start text-[10px] font-black ${fitColorClass}`}>
                                  {fitLabel}
                                </span>
                                {tuitionKnown && (
                                  <span className="text-slate-500 mt-1 block">
                                    NPR {formatLakhCrore(uniTuitionNpr)} / year
                                  </span>
                                )}
                              </div>

                              <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
                                <a
                                  href={uni.website || "/matches"}
                                  target={uni.website ? "_blank" : undefined}
                                  rel={uni.website ? "noreferrer" : undefined}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-[10px] py-2 rounded-lg text-center transition-colors"
                                >
                                  Website
                                </a>
                                <Link
                                  href="/matches"
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] py-2 rounded-lg text-center transition-colors shadow-xs"
                                >
                                  Select
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 text-sm">
                      Live university recommendations will appear here once matching results load for {country.name}.
                    </div>
                  )}
                </div>

                {/* Bottom Report Button */}
                <button className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Download Preliminary Report
                </button>

              </div>
            ) : (
              // Empty State Placeholder
              <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-12 min-h-[500px]">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100/50">
                  <TrendingUp className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to calculate your study budget?
                </h3>
                <p className="max-w-md text-sm text-slate-500 leading-relaxed">
                  Enter your destination country, target city, and annual university tuition fees in the panel to generate a live, itemized financial estimate.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
