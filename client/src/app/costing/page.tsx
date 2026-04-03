"use client";

import { useState, useEffect } from "react";
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

  const fetchEstimate = async () => {
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
  };

  useEffect(() => {
    fetchEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const getDesktopValue = (value: number) =>
    period === "Month on Month" ? formatNPR(value / 12) : formatLakhs(value);

  const getDesktopHeading = () => {
    if (period === "Month on Month") {
      return "Monthly view";
    }

    return "Annual view";
  };
  const getDesktopValue = (value: number) =>
    period === "Month on Month" ? formatNPR(value / 12) : formatLakhs(value);

  const getDesktopHeading = () => {
    if (period === "Month on Month") {
      return "Monthly view";
    }

    return "Annual view";
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
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Preferred City
                  </label>
                  <select
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
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Annual Tuition (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
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

            {!data ? (
              <div className="aspect-square bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-12">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to crunch the numbers?
                </h3>
                <p className="max-w-[280px]">
                  Select your dream city and tuition fee to see a detailed
                  financial breakdown.
                </p>
              </div>
            ) : (
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
            Back to Dashboard
          </Link>
          <div className="w-14 h-14 rounded-full bg-[#FFF7E8] border border-[#F7E8C6] flex items-center justify-center text-[#F6C56E] shadow-sm">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-[38px] font-black text-slate-900 leading-tight tracking-tight">
              Estimated Cost Breakdown
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500 text-[15px] leading-6">
              A comprehensive view of your expected expenses for the first year,
              calculated based on current university data and living standards.
            </p>
          </div>

          <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-5 items-start">
            <div className="space-y-4">
              <div className="rounded-[22px] border border-slate-100 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)] p-4">
                <p className="text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase">
                  Total Estimated Cost
                </p>
                <h2 className="mt-2 text-[34px] font-black tracking-tight text-slate-900">
                  {data ? formatNPR(data.total_npr) : "--"}
                </h2>
                <p className="mt-1 text-[12px] text-slate-500">/ 1st year</p>
                <div className="mt-4 rounded-xl border border-[#F5E7C2] bg-[#FFF9EA] px-4 py-2 flex items-center justify-center gap-2 text-[12px] font-semibold text-[#D87A00]">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Average Cost
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-100 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)] p-4">
                <p className="text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase">
                  Cost Benchmarks
                </p>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      label: "High",
                      color: "bg-rose-500",
                      value: "$45k - $85k+",
                      width: "92%",
                    },
                    {
                      label: "Average",
                      color: "bg-amber-400",
                      value: "$20k - $45k",
                      width: "70%",
                    },
                    {
                      label: "Low",
                      color: "bg-emerald-500",
                      value: "$5k - $20k",
                      width: "36%",
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span
                          className={
                            item.label === "High"
                              ? "text-rose-500"
                              : item.label === "Average"
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }
                        >
                          {item.label}
                        </span>
                        <span className="text-slate-500">{item.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: item.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full rounded-[16px] border border-slate-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)] py-4 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Download Report
              </button>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-6">
              <h3 className="text-[14px] font-bold text-slate-900">
                Detailed Expense Categories
              </h3>

              <div className="mt-5 space-y-3">
                {breakdown.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#FBFCFE] px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.03)]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${item.color}-500/10`}
                        >
                          <Icon className={`w-4 h-4 text-${item.color}-500`} />
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
                        {formatNPR(item.value)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[18px] border border-indigo-100 bg-[#F6F7FF] px-5 py-4 text-[13px] text-indigo-600 shadow-[0_8px_20px_rgba(99,102,241,0.08)]">
                <p className="font-bold mb-1">Why is this an Average Cost?</p>
                <p className="leading-6 text-indigo-500/85">
                  This university is situated in a region with moderate living
                  costs. While the tuition is slightly above national averages,
                  the lower cost of off-campus housing keeps the overall
                  expenditure balanced.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {["First Year", "Year on Year", "Month on Month"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPeriod(tab)}
                    className={`h-10 rounded-full px-4 text-[12px] font-black transition-all ${period === tab ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.22)]" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[13px] font-bold text-slate-800">
                      {period}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {period === "Month on Month"
                        ? "Monthly view"
                        : "Annual view"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-slate-400">Tuition</span>
                      <span className="font-black text-slate-900">
                        {data
                          ? period === "Month on Month"
                            ? formatNPR(data.tuition_npr / 12)
                            : formatLakhs(data.tuition_npr)
                          : "--"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-slate-400">Living</span>
                      <span className="font-black text-slate-900">
                        {data
                          ? period === "Month on Month"
                            ? formatNPR(data.living_npr / 12)
                            : formatLakhs(data.living_npr)
                          : "--"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-slate-400">Other</span>
                      <span className="font-black text-slate-900">
                        {data
                          ? period === "Month on Month"
                            ? formatNPR(data.education_npr / 12)
                            : formatLakhs(data.education_npr)
                          : "--"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <p className="text-[13px] font-bold text-slate-800 mb-4">
                    Expense Mix
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-full h-full -rotate-90"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="transparent"
                          stroke="#F1F5F9"
                          strokeWidth="5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="transparent"
                          stroke="#3B82F6"
                          strokeWidth="5"
                          strokeDasharray={`${yearlyPct} 100`}
                          strokeLinecap="round"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="transparent"
                          stroke="#10B981"
                          strokeWidth="5"
                          strokeDasharray={`${livingPct} 100`}
                          strokeDashoffset={`-${yearlyPct}`}
                          strokeLinecap="round"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="transparent"
                          stroke="#F59E0B"
                          strokeWidth="5"
                          strokeDasharray={`${otherPct} 100`}
                          strokeDashoffset={`-${yearlyPct + livingPct}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white shadow-inner" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <Info className="w-3.5 h-3.5" />
                Living cost in {city} is dynamically calculated.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
