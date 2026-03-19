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
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

export default function CostingPage() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [city, setCity] = useState(COUNTRIES[0].cities[0]);
  const [tuition, setTuition] = useState("25000");
  const [data, setData] = useState<StudyCostResponse | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className={`min-h-screen bg-[#f8fafc] ${inter.className}`}>


      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
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
    </div>
  );
}
