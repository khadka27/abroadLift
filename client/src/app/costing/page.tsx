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
} from "lucide-react";

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
import Link from "next/link";

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
  const [recommendations, setRecommendations] = useState<
    UniversityRecommendation[]
  >([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const fetchEstimate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cost-estimate?city=${city}&country=${country.code}&tuition_usd=${tuition}`,
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

  const formatNPR = (val: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatLakhs = (val: number) => {
    const lakhs = val / 100000;

    return `${lakhs.toFixed(lakhs >= 10 ? 0 : 1)} Lakhs`;
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const breakdown = data
    ? [
        {
          label: "Tuition Fees",
          value: data.tuition_npr,
          note: "Annual academic costs",
          color: "blue",
          icon: BookOpen,
        },
        {
          label: "Living Expenses",
          value: data.living_npr,
          note: "Accommodation, food, transit",
          color: "emerald",
          icon: Home,
        },
        {
          label: "Visa & Application",
          value: data.education_npr,
          note: "One-time processing fees",
          color: "violet",
          icon: DollarSign,
        },
        {
          label: "Counselling & Prep",
          value: 0,
          note: "Exams and advisory services",
          color: "orange",
          icon: Info,
        },
      ]
    : [];

  const totalPercent = data ? Math.max(data.total_npr, 1) : 1;
  const yearlyPct = data
    ? Math.round((data.tuition_npr / totalPercent) * 100)
    : 0;
  const livingPct = data
    ? Math.round((data.living_npr / totalPercent) * 100)
    : 0;
  const otherPct = data ? Math.max(100 - yearlyPct - livingPct, 8) : 0;
  const totalEstimate = data?.total_npr ?? 0;
  const monthlyEstimate = data?.monthly_npr ?? 0;
  const tuitionEstimate = data?.tuition_npr ?? 0;
  let costBand = "Loading live estimate";
  if (data) {
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
  const topRecommendation = recommendations[0];
  const annualTuitionUsd = Number(tuition) || 0;
  const currentExchangeRate = data?.exchange_rate || 133.5;
  const currentTuitionBudgetNpr = annualTuitionUsd * currentExchangeRate;
  const costTabs = ["First Year", "Year on Year", "Month on Month"];
  const periodValue = (value: number) => {
    if (period === "Month on Month") {
      return formatNPR(value / 12);
    }

    return formatLakhs(value);
  };
  const periodHeading = () => {
    if (period === "Month on Month") {
      return "Monthly view";
    }

    if (period === "Year on Year") {
      return "Multi-year view";
    }

    return "First-year view";
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <main className="md:hidden pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Inputs */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">
                Global Study{" "}
                <span className="text-emerald-500">Cost Estimator</span>
              </h1>
              <p className="text-slate-500 text-lg">
                Calculate your full educational investment in Nepali Rupees
                (NPR). Data synced from worldwide living cost indices.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
              {/* Destination Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Select Destination
                </label>
                <div className="grid grid-cols-5 gap-2">
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
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-[10px] font-black">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City & Tuition */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="preferred-city"
                    className="text-xs font-black uppercase tracking-widest text-slate-400"
                  >
                    Preferred City
                  </label>
                  <select
                    id="preferred-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-size-[20px_20px] bg-position-[right_16px_center] bg-no-repeat"
                  >
                    {country.cities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="annual-tuition"
                    className="text-xs font-black uppercase tracking-widest text-slate-400"
                  >
                    Annual Tuition (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="annual-tuition"
                      type="number"
                      value={tuition}
                      onChange={(e) => setTuition(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="e.g. 25000"
                    />
                  </div>
                </div>
              </div>

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

          {/* Right Side: Results */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[40px]">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
              </div>
            )}

            {data ? (
              <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Result Header */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                  </div>
                  <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-2">
                    Total Educational Investment
                  </p>
                  <h2 className="text-4xl font-black mb-1">
                    {formatNPR(data.total_npr)}
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    Synced at 1 USD = {data.exchange_rate.toFixed(2)} NPR
                  </p>
                </div>

                {/* Breakdown Grid */}
                <div className="p-8 space-y-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
                    Annual Breakdown
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Tuition Fee
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {formatNPR(data.tuition_npr)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <Home className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Rent & Housing
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {formatNPR(data.housing_npr)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <Utensils className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Food & Groceries
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {formatNPR(data.food_npr)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <Bus className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Commute
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {formatNPR(data.transport_npr)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-slate-400 font-bold text-xs uppercase mb-1">
                          Monthly Pocket Money
                        </p>
                        <p className="text-2xl font-black text-emerald-600">
                          {formatNPR(data.monthly_npr)}
                        </p>
                      </div>
                      <Link
                        href="/matches"
                        className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all"
                      >
                        Find Universities <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-800 font-medium italic">
                      Disclaimer: These are estimated figures. Visa fees, travel
                      insurance, and airfare are not included.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-12">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to crunch the numbers?
                </h3>
                <p className="max-w-70">
                  Select your dream city and tuition fee to see a detailed
                  financial breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <main className="hidden md:block pt-24 pb-20 px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors"
          >
            <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              ←
            </span>
            <span>Back to Dashboard</span>
          </Link>
          <div className="w-14 h-14 rounded-full bg-[#FFF7E8] border border-[#F7E8C6] flex items-center justify-center text-[#F6C56E] shadow-sm">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              {recommendationSummary}
            </span>
            <div className="max-w-3xl">
              <h1 className="text-[40px] font-black text-slate-900 leading-tight tracking-tight">
                Your Preliminary Estimate
              </h1>
              <p className="mt-2 text-slate-500 text-[15px] leading-6">
                Based on your academic profile and selected university details
                for {city}, {country.name}. The desktop view refreshes with live
                cost and university data.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
                  {country.flag}
                </div>
                <div>
                  <p className="text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase">
                    Selected Destination
                  </p>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {city}, {country.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Live cost data synced for this destination.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="rounded-full bg-slate-50 border border-slate-100 px-4 py-2 font-bold text-slate-700">
                  Tuition {formatNPR(tuitionEstimate || 0)}
                </div>
                <div className="rounded-full bg-slate-50 border border-slate-100 px-4 py-2 font-bold text-slate-700">
                  {costBand}
                </div>
                <Link
                  href="/matches"
                  className="rounded-full bg-blue-600 px-4 py-2 font-black text-white shadow-[0_10px_20px_rgba(37,99,235,0.22)] transition-colors hover:bg-blue-700"
                >
                  Edit Selection
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase">
                Estimated Cost
              </p>
              <h2 className="mt-3 text-[32px] font-black tracking-tight text-slate-900">
                {data ? formatNPR(totalEstimate) : "--"}
              </h2>
              <p className="mt-1 text-[12px] text-slate-500">
                / {period.toLowerCase()}
              </p>
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 flex items-center justify-between gap-2 text-[12px] font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{periodHeading()}</span>
                <span>{data ? formatNPR(monthlyEstimate) : "--"} / month</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase">
                Cost Mix
              </p>
              <div className="mt-4 space-y-4">
                {[
                  { label: "Tuition", value: yearlyPct, color: "bg-blue-500" },
                  {
                    label: "Living",
                    value: livingPct,
                    color: "bg-emerald-500",
                  },
                  { label: "Other", value: otherPct, color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase">
                Live Exchange
              </p>
              <h3 className="mt-3 text-[26px] font-black tracking-tight text-slate-900">
                1 USD = {data ? data.exchange_rate.toFixed(2) : "--"} NPR
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Monthly living cost in {city} is currently{" "}
                {data ? formatNPR(monthlyEstimate) : "loading"}.
              </p>
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-[12px] text-slate-600">
                Tuition budget: {formatNPR(currentTuitionBudgetNpr || 0)}
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
            <div className="rounded-[30px] border border-slate-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-[15px] font-black text-slate-900">
                    Detailed Expense Categories
                  </h3>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Live cost components for {country.name} based on the
                    selected city.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {costTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPeriod(tab)}
                      className={`h-10 rounded-full px-4 text-[12px] font-black transition-all ${period === tab ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.22)]" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {breakdown.map((item) => {
                  const Icon = item.icon;
                  const palette =
                    COLOR_MAP[item.color as keyof typeof COLOR_MAP];

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#FBFCFE] px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.03)]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${palette.box}`}
                        >
                          <Icon className={`w-4 h-4 ${palette.text}`} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.note}
                          </p>
                        </div>
                      </div>
                      <p className="text-[14px] font-black text-slate-800">
                        {periodValue(item.value)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[18px] border border-indigo-100 bg-[#F6F7FF] px-5 py-4 text-[13px] text-indigo-600 shadow-[0_8px_20px_rgba(99,102,241,0.08)]">
                <p className="font-bold mb-1">
                  Why this estimate feels balanced
                </p>
                <p className="leading-6 text-indigo-500/85">
                  {data
                    ? `The selected city keeps the overall estimate balanced, with tuition contributing ${yearlyPct}% and living expenses ${livingPct}% of the total.`
                    : "We refresh the numbers from live cost data so the estimate reflects the selected city and tuition."}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <Info className="w-3.5 h-3.5" />
                Living cost in {city} is dynamically calculated.
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[30px] border border-[#e8dcc4] bg-linear-to-br from-[#fdfbf6] to-[#f4ead9] shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-sm">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-500" /> Improve Your
                      Chances
                    </h3>
                    <p className="text-[12px] text-slate-600 mt-2 leading-6">
                      {topRecommendation
                        ? `Strong live candidates include ${topRecommendation.name} and other universities in ${country.name}.`
                        : `We’ll highlight the strongest live universities once recommendations load.`}
                    </p>
                    <ul className="text-[11px] font-bold text-slate-800 space-y-1.5 mt-4 ml-1">
                      <li className="flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-slate-900 rounded-full" />{" "}
                        Review lower-fee universities first
                      </li>
                      <li className="flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-slate-900 rounded-full" />{" "}
                        Compare living costs by city
                      </li>
                    </ul>
                    <Link
                      href="/matches"
                      className="inline-flex mt-4 items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-black text-[12px] px-6 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition-all"
                    >
                      View Plan
                    </Link>
                  </div>
                  <div className="w-32 h-32 rounded-[28px] bg-white/70 border border-white/80 flex items-center justify-center shadow-sm shrink-0">
                    <div className="text-center">
                      <TrendingUp className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.18em]">
                        {costBand}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-black text-slate-900">
                      Recommended Universities
                    </h2>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Based on your profile & budget
                    </p>
                  </div>
                  <Link
                    href="/matches"
                    className="text-blue-500 text-xs font-bold hover:underline"
                  >
                    See All
                  </Link>
                </div>

                {recommendationLoading && recommendations.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["loading-1", "loading-2", "loading-3", "loading-4"].map(
                      (item) => (
                        <div
                          key={item}
                          className="h-80 rounded-3xl border border-slate-200 bg-white animate-pulse"
                        />
                      ),
                    )}
                  </div>
                ) : recommendationCount > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {recommendations.map((uni) => {
                      const tuitionUsd =
                        typeof uni.tuition === "number"
                          ? uni.tuition
                          : Number(uni.tuition);
                      const tuitionKnown =
                        Number.isFinite(tuitionUsd) && tuitionUsd > 0;
                      const tuitionNpr = tuitionKnown
                        ? tuitionUsd * currentExchangeRate
                        : 0;
                      let fitLabel = "Fee on request";
                      if (tuitionKnown && tuitionUsd <= annualTuitionUsd) {
                        fitLabel = "Within budget";
                      } else if (tuitionKnown) {
                        fitLabel = "Stretch";
                      }
                      const fitScore = tuitionKnown
                        ? Math.max(
                            58,
                            Math.min(
                              97,
                              Math.round(
                                100 -
                                  (Math.abs(tuitionUsd - annualTuitionUsd) /
                                    Math.max(annualTuitionUsd || 1, 1)) *
                                    20 +
                                  (uni.acceptanceRate || 0) / 3,
                              ),
                            ),
                          )
                        : Math.max(
                            60,
                            Math.min(94, Math.round(uni.acceptanceRate || 72)),
                          );

                      return (
                        <div
                          key={uni.id}
                          className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col"
                        >
                          <div className="h-32 relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-700">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_45%)]" />
                            <div className="absolute top-3 right-3 bg-emerald-100/90 backdrop-blur-sm text-emerald-800 text-[10px] font-black px-2 py-1 rounded-full shadow-sm border border-emerald-200">
                              {fitScore}% Fit
                            </div>
                            <div className="absolute left-4 bottom-4 right-4 text-white">
                              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-white/70">
                                {uni.country}
                              </p>
                              <h3 className="mt-1 text-[15px] font-black leading-tight">
                                {uni.name}
                              </h3>
                            </div>
                          </div>

                          <div className="p-4 flex flex-col flex-1 gap-3">
                            <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {uni.location}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                                <p className="text-slate-400 font-semibold uppercase tracking-wide">
                                  Tuition
                                </p>
                                <p className="mt-1 font-black text-slate-900">
                                  {tuitionKnown
                                    ? `${formatUSD(tuitionUsd)}`
                                    : "Check site"}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                                <p className="text-slate-400 font-semibold uppercase tracking-wide">
                                  Acceptance
                                </p>
                                <p className="mt-1 font-black text-slate-900">
                                  {Math.round(uni.acceptanceRate || 0)}%
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span
                                className={`rounded-full px-2.5 py-1 ${tuitionKnown && tuitionUsd <= annualTuitionUsd ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                              >
                                {fitLabel}
                              </span>
                              <span className="text-slate-500">
                                {tuitionKnown
                                  ? `${formatNPR(tuitionNpr)} / year`
                                  : "Live fee band"}
                              </span>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-2">
                              <a
                                href={uni.website || "/matches"}
                                target={uni.website ? "_blank" : undefined}
                                rel={uni.website ? "noreferrer" : undefined}
                                className="bg-[#f1f5f9] hover:bg-slate-200 text-slate-800 font-black text-[11px] py-2.5 rounded-lg shadow-sm text-center transition-colors"
                              >
                                View Details
                              </a>
                              <Link
                                href="/matches"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-black text-[11px] py-2.5 rounded-lg shadow-sm text-center"
                              >
                                Select University
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                    Live university recommendations will appear here once the
                    API returns results for {country.name}.
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="w-full rounded-2xl border border-slate-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)] py-4 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Download Report
          </button>
        </div>
      </main>
    </div>
  );
}
