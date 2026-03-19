/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { CA, US, AU, GB, DE, IE, NL } from "country-flag-icons/react/3x2";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Search,
  Briefcase,
  Monitor,
  HeartPulse,
  Scale,
  Palette,
  LineChart,
  Microscope,
  Brain,
  Award,
  AlignLeft,
  ExternalLink,
  ChevronLeft,
  Calculator,
  RefreshCw,
  MapPin,
  Cloud,
  Clock,
  Plane,
  Sun,
  Moon,
  Globe,
} from "lucide-react";

/* ─────────────── Flag component ─────────────── */
const FlagIcon = ({
  countryCode,
  className = "w-6 h-4",
  ...props
}: {
  countryCode: string;
  className?: string;
  [key: string]: any;
}) => {
  const map: Record<string, any> = {
    CA,
    US,
    USA: US,
    AU,
    GB,
    UK: GB,
    DE,
    IE,
    NL,
    CH: US, // Placeholder for Switzerland if not in lucide icons, but let's check
  };
  const Fl = map[countryCode?.toUpperCase()];
  return Fl ? (
    <Fl className={`${className} rounded shadow-sm`} {...props} />
  ) : (
    <div className={`${className} bg-zinc-200 rounded`} />
  );
};

/* ─────────────── Types ─────────────── */
interface Form {
  countries: string[];
  degree: string;
  field: string;
  program: string;
  testType: string;
  testScore: string;
  budget: string;
  currency: string;
  scholarship: boolean;
  name: string;
  email: string;
  gpa: string;
}

interface Match {
  id: string | number;
  name: string;
  location?: string;
  countryCode?: string;
  tuitionFee?: number;
  englishReq?: number;
  website?: string;
  admissionRate?: number;
  rankingWorld?: number;
  rankingNational?: number;
  scholarships?: { name: string; value: string }[];
  description?: string;
  type?: string;
  founded?: number;
  studentPopulation?: number;
  popularPrograms?: string[];
  applicationDeadline?: string;
  gpaRequirement?: number;
  matchType?: string;
  internationalPercentage?: number;
  salaryMedian?: number;
}

/* ─────────────── Static data ─────────────── */
const COUNTRIES = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "U.S.A." },
  { code: "AU", name: "Australia" },
  { code: "GB", name: "U.K." },
  { code: "DE", name: "Germany" },
  { code: "IE", name: "Ireland" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "MY", name: "Malaysia" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "UAE" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "CH", name: "Switzerland" },
];

const DEGREES = [
  { v: "foundation", l: "Foundation", icon: AlignLeft },
  { v: "diploma", l: "Diploma", icon: Award },
  { v: "bachelor", l: "Bachelor's", icon: BookOpen },
  { v: "master", l: "Master's", icon: GraduationCap },
  { v: "phd", l: "PhD", icon: Microscope },
];

const FIELDS = [
  { v: "Business & Management", icon: Briefcase },
  { v: "Computer Science & IT", icon: Monitor },
  { v: "Engineering", icon: Search },
  { v: "Medicine & Health", icon: HeartPulse },
  { v: "Law", icon: Scale },
  { v: "Arts & Humanities", icon: Palette },
  { v: "Data Science", icon: LineChart },
  { v: "Natural Sciences", icon: Microscope },
  { v: "Social Sciences", icon: Brain },
];

const PROGRAMS: Record<string, string[]> = {
  "Business & Management": [
    "MBA",
    "Finance",
    "Marketing",
    "Accounting",
    "Economics",
  ],
  "Computer Science & IT": [
    "Software Engineering",
    "Cybersecurity",
    "AI & ML",
    "Data Engineering",
  ],
  Engineering: ["Mechanical", "Civil", "Electrical", "Chemical", "Aerospace"],
  "Medicine & Health": ["Medicine", "Nursing", "Pharmacy", "Public Health"],
  Law: ["LLB", "LLM", "Criminal Law", "Corporate Law", "International Law"],
  "Arts & Humanities": ["English Lit", "History", "Philosophy", "Fine Arts"],
  "Data Science": [
    "Data Science",
    "Business Analytics",
    "Statistics",
    "Machine Learning",
  ],
  "Natural Sciences": [
    "Biology",
    "Chemistry",
    "Physics",
    "Environmental Science",
  ],
  "Social Sciences": [
    "Psychology",
    "Sociology",
    "Political Science",
    "International Relations",
  ],
};

const TESTS = [
  { v: "IELTS", eg: "6.5" },
  { v: "TOEFL", eg: "90" },
  { v: "PTE", eg: "65" },
  { v: "Duolingo", eg: "110" },
];

const CURRENCIES = ["USD", "GBP", "AUD", "CAD", "EUR"];
const BUDGET_PRESETS = [
  { v: "15000", l: "$15K" },
  { v: "25000", l: "$25K" },
  { v: "40000", l: "$40K" },
  { v: "60000", l: "$60K+" },
];

const STEPS = [
  {
    label: "Welcome",
    question: "Your Global Education Journey Starts Here.",
  },
  {
    label: "Destination Country",
    question: "Which countries are you interested in?",
  },
  {
    label: "Degree Level",
    question: "What degree level are you planning to pursue?",
  },
  {
    label: "Study Area",
    question: "Which field of study interests you most?",
  },
  {
    label: "English Proficiency",
    question: "Do you have an English test score?",
  },
  {
    label: "Budget",
    question: "What is your estimated annual budget?",
  },
  {
    label: "Student Profile",
    question: "Tell us a bit about yourself!",
  },
  {
    label: "Your Matches",
    question: "Your highly recommended universities!",
  },
];

const DEF: Form = {
  countries: [],
  degree: "",
  field: "",
  program: "",
  testType: "IELTS",
  testScore: "",
  budget: "",
  currency: "USD",
  scholarship: false,
  name: "",
  email: "",
  gpa: "",
};

/* ─────────────── UI Components ─────────────── */

function SearchSelect({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  return (
    <div className="relative w-full z-10">
      <button
        onClick={() => {
          setOpen(!open);
          setQuery("");
        }}
        className={`w-full relative flex items-center pl-10 pr-4 h-[54px] bg-white border border-gray-200 rounded-[14px] text-left transition-all shadow-sm ${
          open
            ? "border-blue-500 ring-4 ring-blue-500/10"
            : "hover:border-gray-300"
        }`}
      >
        <Search
          className="w-[20px] h-[20px] text-[#7c8b9f] absolute left-3.5 top-1/2 -translate-y-1/2"
          strokeWidth={1.5}
        />
        <span
          className={`text-[14px] font-medium leading-none truncate ${value ? "text-gray-900 font-bold" : "text-[#8a98ac]"}`}
        >
          {value || placeholder}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 shadow-xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[250px] animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <Search className="w-4 h-4 ml-1 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent p-1 text-[15px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 min-h-[44px] flex items-center rounded-xl text-[14px] font-medium transition-colors ${
                    value === opt
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MatchCard({
  match: m,
  currency: c,
}: {
  match: Match;
  currency: string;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-white border text-left border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {m.name}
              </h3>
              {m.matchType === "exact" && (
                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                  Best Match
                </span>
              )}
              {m.matchType === "recommended" && (
                <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                  Recommended
                </span>
              )}
              {m.matchType === "similar" && (
                <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                  Similar Match
                </span>
              )}
            </div>
            <p className="flex items-center gap-2 text-gray-500 text-xs font-medium">
              {m.countryCode && (
                <FlagIcon
                  countryCode={m.countryCode}
                  className="w-4 h-3 rounded-sm"
                />
              )}
              {m.location}
            </p>
          </div>
          {m.rankingWorld != null && !isNaN(Number(m.rankingWorld)) && (
            <div className={`flex flex-col items-end`}>
              <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                Number(m.rankingWorld) <= 100 
                ? 'bg-linear-to-br from-amber-50 to-orange-50 text-amber-700 border-amber-200' 
                : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}>
                #{m.rankingWorld} World
              </span>
              {Number(m.rankingWorld) <= 100 && (
                <span className="text-[8px] font-bold text-amber-500 mt-1 uppercase tracking-tighter">Elite Institution</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {m.tuitionFee != null && (
            <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-700 font-semibold">
              💰 {fmt(m.tuitionFee)}/yr
            </span>
          )}
          {m.admissionRate != null && !isNaN(Number(m.admissionRate)) && (
            <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-700 font-semibold">
              📈 {m.admissionRate}% Accept
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors"
          >
            {showDetails ? "Hide" : "Details"}
          </button>
            {m.website && (
              <a
                href={m.website}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        {showDetails && (
          <div className="bg-gray-50 p-5 border-t border-gray-100 text-sm">
            <p className="text-gray-600 mb-4 text-xs leading-relaxed">
              {m.description || "Information about this institution's unique programs and campus life can be found on their official website."}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {m.rankingNational && (
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    National Rank
                  </span>
                  <span className="text-xs font-bold text-gray-700">
                    #{m.rankingNational}
                  </span>
                </div>
              )}
              <div className={`bg-white p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1 ${!m.rankingNational ? 'col-span-2' : ''}`}>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Students
                </span>
                <span className="text-xs font-bold text-gray-700">
                  {m.studentPopulation ? `${m.studentPopulation.toLocaleString()}+` : "10,000+"}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1 col-span-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Campus Type
                </span>
                <span className="text-xs font-bold text-gray-700">
                  {m.type || "Public Research Institution"}
                </span>
              </div>
              {m.popularPrograms && m.popularPrograms.length > 0 && (
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1 col-span-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Popular Programs
                  </span>
                  <span className="text-xs font-bold text-gray-700 line-clamp-1">
                    {m.popularPrograms.join(", ")}
                  </span>
                </div>
              )}
              <div className="p-2.5 rounded-xl flex flex-col gap-1 col-span-2 text-indigo-600 bg-indigo-50/20 border border-indigo-100 shadow-xs">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                  Admission Status
                </span>
                <span className="text-xs font-black">
                  {(m as any).deadline || "Rolling Admissions / Active"}
                </span>
              </div>
              {m.internationalPercentage != null && (
                <div className="bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100 flex flex-col gap-1">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                    Intl. Students
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {m.internationalPercentage}%
                  </span>
                </div>
              )}
              {m.salaryMedian != null && (
                <div className="bg-amber-50/30 p-2.5 rounded-xl border border-amber-100 flex flex-col gap-1">
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                    Avg. Salary
                  </span>
                  <span className="text-xs font-bold text-amber-700">
                    ${m.salaryMedian.toLocaleString()}/yr
                  </span>
                </div>
              )}
            </div>
            <DestinationInsight match={m} />
            
            {m.scholarships && m.scholarships.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Scholarships
                </p>
                <div className="space-y-1">
                  {m.scholarships.map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-xs bg-white p-2 rounded border border-gray-100"
                    >
                      <span className="font-medium text-gray-700">{s.name}</span>
                      <span className="font-bold text-emerald-600">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <MatchCostEstimator match={m} />
          </div>
        )}
      </div>
    );
  }

function DestinationInsight({ match: m }: { match: Match }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        const city = m.location?.split(",")[0] || "London";
        const country = m.countryCode || "GB";
        const res = await fetch(`/api/destination-insight?city=${city}&country=${country}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [m.location, m.countryCode]);

  if (loading) return <div className="h-20 bg-gray-50 animate-pulse rounded-2xl border border-gray-100 mt-4" />;
  if (!data || data.error) return null;

  return (
    <div className="mt-6 bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{data.city} Insight</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
              <Clock className="w-3 h-3 opacity-80" />
              <span className="text-[10px] font-bold">{data.localTime}</span>
            </div>
             <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
               {data.isDay ? <Sun className="w-3 h-3 text-amber-300" /> : <Moon className="w-3 h-3 text-blue-200" />}
               <span className="text-[10px] font-bold uppercase tracking-tighter">{data.isDay ? 'Day' : 'Night'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{Math.round(data.temp)}°</span>
              <span className="text-sm font-bold opacity-80">C</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black opacity-60 uppercase">
              <Cloud className="w-3 h-3" />
              <span>Real-time Conditions</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[10px] font-bold opacity-90 uppercase tracking-tighter bg-white/10 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-sm shadow-sm">
              <Plane className="w-3 h-3 rotate-45" />
              <span>{data.distance.toLocaleString()} KM From Base</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCostEstimator({ match: m }: { match: Match }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchEstimate = async () => {
    if (data) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    try {
      // Extract city from location "City, State"
      const city = m.location?.split(",")[0] || "New York";
      const country = m.countryCode || "US";
      const res = await fetch(
        `/api/cost-estimate?city=${city}&country=${country}&tuition_usd=${m.tuitionFee || 20000}`,
      );
      const json = await res.json();
      setData(json);
      setExpanded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatNPR = (val: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mt-6 border-t border-dashed border-gray-200 pt-5">
      <button
        onClick={fetchEstimate}
        disabled={loading}
        className="w-full py-3 bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-100 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs hover:from-emerald-500/20 hover:to-teal-500/20 transition-all disabled:opacity-50"
      >
        {loading ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Calculator className="w-3.5 h-3.5" />
        )}
        {expanded ? "Hide Cost Estimate" : "Estimate Total Cost in NPR"}
      </button>

      {expanded && data && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm space-y-3">
            <div className="flex justify-between items-end border-b border-gray-50 pb-3">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Total Annual (NPR)
                </p>
                <p className="text-xl font-black text-slate-900">
                  {formatNPR(data.total_npr)}
                </p>
              </div>
              <div className="bg-emerald-50 px-2 py-1 rounded text-[10px] font-bold text-emerald-700">
                1 USD ≈ {data.exchange_rate.toFixed(1)} NPR
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Education
                </p>
                <p className="text-[11px] font-bold text-gray-700">
                  {formatNPR(data.tuition_npr)}
                </p>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Housing
                </p>
                <p className="text-[11px] font-bold text-gray-700">
                  {formatNPR(data.housing_npr)}
                </p>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Food
                </p>
                <p className="text-[11px] font-bold text-gray-700">
                  {formatNPR(data.food_npr)}
                </p>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Pocket Money
                </p>
                <p className="text-[11px] font-bold text-gray-700">
                  {formatNPR(data.monthly_npr)}/mo
                </p>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 italic text-center">
              *Estimates include living expenses in {data.city} converted using
              live rates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
export default function AbroadLiftMatchesPage() {
  const { status } = useSession();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(DEF);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const fetchProfileData = async () => {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const data = await res.json();
            const p = data.profile || {};
            setForm((prev) => ({
              ...prev,
              name: data.name || prev.name,
              email: data.email || prev.email,
              gpa: p.gpa?.toString() || prev.gpa,
            }));
          }
        } catch (e) {
          console.error("Failed to load profile", e);
        }
      };
      fetchProfileData();
    }
  }, [status]);

  const updateForm = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const toggleCountry = (code: string) => {
    setForm((prev) => ({
      ...prev,
      countries: prev.countries.includes(code)
        ? prev.countries.filter((c) => c !== code)
        : [...prev.countries, code],
    }));
  };

  // const currentStepData = STEPS[step];
  const canContinue = (
    [
      form.name.trim().length > 0,
      form.countries.length > 0,
      form.degree,
      form.field,
      form.testScore,
      form.budget,
      form.email,
    ] as (string | boolean | number)[]
  )[step];

  const handleNext = () => {
    if (step < STEPS.length - 2) setStep(step + 1);
    else {
      setStep(STEPS.length - 1);
      runMatch();
    }
  };

  const runMatch = async () => {
    setLoading(true);
    setError("");
    setMatches([]);
    try {
      const query = new URLSearchParams({
        countries: form.countries.join(","),
        budget: form.budget || "0",
        englishScore: form.testScore || "0",
        degreeLevel: form.degree,
        field: form.field || "",
      });
      const res = await fetch(`/api/matches?${query}`);
      if (!res.ok)
        throw new Error("Our matching engine is temporarily overloaded.");
      const data = await res.json();


      setMatches(data.matches || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching matches.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    // 0: Welcome
    if (step === 0) {
      return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-blue-50 w-fit px-3 py-1.5 rounded-full text-blue-600 font-bold text-[11px] tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5" />
              JOIN 50K+ INTERNATIONAL STUDENTS
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
              Your Global Education <span className="text-blue-600">Journey</span> Starts Here.
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              We&apos;ll help you find the perfect university based on your goals, budget, and dreams.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="What's your name?"
                className="w-full h-16 bg-white border border-gray-100 rounded-2xl px-6 text-lg font-bold text-gray-900 outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-300"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canContinue) handleNext();
                }}
              />
            </div>
            
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className={`w-full h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                canContinue 
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer"
                : "bg-blue-100 text-blue-300 cursor-not-allowed"
              }`}
            >
              Get Started
              <ChevronLeft className="w-5 h-5 rotate-180" strokeWidth={3} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
             <div>
               <p className="text-2xl font-black text-slate-900">800+</p>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Universities</p>
             </div>
             <div>
               <p className="text-2xl font-black text-slate-900">32</p>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Countries</p>
             </div>
             <div>
               <p className="text-2xl font-black text-slate-900">12k+</p>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Admissions</p>
             </div>
          </div>
        </div>
      );
    }

    // 1: Destination
    if (step === 1) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-2xl">
           <div className="mb-10">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">
                Hi {form.name.split(" ")[0] || "there"}! Where do you want to study?
              </h2>
              <p className="text-gray-400 font-bold text-lg mb-8">Choose one or more countries you&apos;re interested in.</p>
           </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COUNTRIES.map((c) => {
              const isSel = form.countries.includes(c.code);
              return (
                <button
                  key={c.code}
                  onClick={() => toggleCountry(c.code)}
                  className={`group relative flex flex-col items-center justify-center gap-4 p-5 py-8 rounded-[24px] border-2 transition-all duration-300 ${
                    isSel
                      ? "border-blue-500 bg-white shadow-2xl shadow-blue-500/10 -translate-y-1"
                      : "border-gray-50 bg-white hover:border-gray-100 hover:shadow-xl hover:-translate-y-1 shadow-xs"
                  }`}
                >
                  <div className={`w-12 h-8 rounded-md overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-110 ${isSel ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                    <FlagIcon
                      countryCode={c.code}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-xs font-black tracking-tight text-center ${isSel ? "text-slate-900" : "text-gray-400"}`}
                  >
                    {c.name}
                  </span>
                  {isSel && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg scale-110 animate-in zoom-in">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 2: Degree
    if (step === 2) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
           <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Degree Level</h2>
              <p className="text-gray-500 font-medium">What level of education are you aiming for?</p>
           </div>
          <div className="grid grid-cols-2 gap-3">
            {DEGREES.map((d) => {
              const isSel = form.degree === d.v;
              const Icon = d.icon;
              return (
                <button
                  key={d.v}
                  onClick={() => updateForm("degree", d.v)}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-200 text-center min-h-[120px] ${
                    isSel
                      ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500 scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${isSel ? "text-blue-600" : "text-gray-400"}`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={`text-sm font-bold ${isSel ? "text-blue-800" : "text-gray-700"}`}
                  >
                    {d.l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 3: Field
    if (step === 3) {
      const programsList = form.field ? PROGRAMS[form.field] || [] : [];
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
           <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Field of Study</h2>
              <p className="text-gray-500 font-medium">Tell us what you want to study so we can match you perfectly.</p>
           </div>
          
          <div className="flex flex-col gap-4">
            <SearchSelect
              placeholder="Select a field of study"
              options={FIELDS.map((f) => f.v)}
              value={form.field}
              onChange={(v) => {
                updateForm("field", v);
                updateForm("program", "");
              }}
            />
            {form.field && (
              <SearchSelect
                placeholder="Select a specific program"
                options={programsList}
                value={form.program}
                onChange={(v) => updateForm("program", v)}
              />
            )}
          </div>
        </div>
      );
    }

    // 4: English
    if (step === 4) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
           <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">English Proficiency</h2>
              <p className="text-gray-500 font-medium">Do you have an English test score? Most universities require one.</p>
           </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {TESTS.map((t) => {
              const isSel = form.testType === t.v;
              return (
                <button
                  key={t.v}
                  onClick={() => updateForm("testType", t.v)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isSel
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold"
                  }`}
                >
                  <div
                    className={`font-bold text-sm ${isSel ? "text-blue-800" : "text-gray-800"}`}
                  >
                    {t.v}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 mb-4 text-center">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Your {form.testType} Score
            </label>
            <input
              type={
                form.testType === "Duolingo" || form.testType === "TOEFL"
                  ? "number"
                  : "text"
              }
              value={form.testScore}
              onChange={(e) => updateForm("testScore", e.target.value)}
              placeholder={`${TESTS.find((x) => x.v === form.testType)?.eg || "6.5"}`}
              className="w-full text-6xl font-black text-center text-gray-900 outline-none bg-transparent placeholder:text-gray-100"
              autoFocus
            />
          </div>
        </div>
      );
    }

    // 5: Budget
    if (step === 5) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
           <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Estimated Budget</h2>
              <p className="text-gray-500 font-medium">What is your estimated annual budget for tuition and fees?</p>
           </div>

          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => updateForm("currency", c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  form.currency === c
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 shadow-xs"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 mb-6 text-center">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Annual Budget
            </label>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-black text-gray-200 uppercase">
                {form.currency}
              </span>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => updateForm("budget", e.target.value)}
                placeholder="25000"
                className="w-56 text-6xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-100"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BUDGET_PRESETS.map((p) => (
              <button
                key={p.v}
                onClick={() => updateForm("budget", p.v)}
                className={`py-3 px-2 rounded-2xl border font-bold text-xs transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  form.budget === p.v 
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 shadow-xs"
                }`}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 6: Profile
    if (step === 6) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
           <div className="mb-4">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Final Details</h2>
              <p className="text-gray-500 font-medium">Just a few more things before we reveal your matches.</p>
           </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              placeholder="jane@example.com"
              className="w-full text-lg font-bold text-gray-900 outline-none bg-transparent placeholder:text-gray-300"
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Current GPA <span className="normal-case font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={form.gpa}
              onChange={(e) => updateForm("gpa", e.target.value)}
              placeholder="3.8"
              className="w-full text-lg font-bold text-gray-900 outline-none bg-transparent placeholder:text-gray-300"
            />
          </div>
        </div>
      );
    }

    // 7: Results
    if (step === 7) {
      return (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">
              {loading
                ? "Matching..."
                : error
                  ? "Oh no!"
                  : matches.length === 0
                    ? "No exact matches"
                    : `${matches.length} Universities Found`}
            </h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              {loading ? "Our AI is curating the best institutions for your profile." : "Based on your background and preferences."}
            </p>
          </div>

          {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 rounded-2xl border-4 border-blue-50 w-full h-full shadow-inner" />
                 <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 border-t-transparent animate-spin w-full h-full" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-3xl text-center">
              <p className="font-bold mb-2">Match engine failed</p>
              <p className="text-xs mb-6 opacity-75">{error}</p>
              <button
                onClick={() => runMatch()}
                className="px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div className="bg-white border text-center border-gray-100 p-10 rounded-[32px] shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
              <p className="font-black text-gray-900 mb-2 text-xl">
                No direct matches
              </p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-xs mx-auto">
                We couldn&apos;t find an exact match for your specific criteria.
                Try adjusting your budget or study field.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep(5)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[15px] font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
                >
                  Adjust Budget
                </button>
                <button
                  onClick={() => {
                    setForm({ ...form, budget: "100000", field: "" });
                    runMatch();
                  }}
                  className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[15px] font-bold hover:bg-gray-50 transition-all"
                >
                  Broaden My Search
                </button>
              </div>
            </div>
          )}

          {!loading && matches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} currency={form.currency} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white relative overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-900">
      {/* Left Panel - Hero Image & Testimonial */}
      <div className="relative w-full lg:w-[45%] h-[35vh] lg:h-screen bg-slate-100 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
          alt="Student Graduation"
          fill
          className="object-cover"
          priority
        />
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/40 via-blue-800/60 to-slate-900/80 mix-blend-multiply" />
        
        {/* Logo and Brand */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12 z-20 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3">
            <GraduationCap className="w-7 h-7 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">NextDegree</span>
        </div>

        {/* Floating Testimonial Card */}
        <div className="absolute bottom-12 left-8 right-8 lg:left-12 lg:right-12 z-20 hidden md:block">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] shadow-2xl max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
             <p className="text-white text-lg font-medium leading-relaxed italic mb-8">
               &ldquo;NextDegree made my application to Yale so simple. The personalized roadmap was exactly what I needed to navigate the complex visa process.&rdquo;
             </p>
             <div className="flex items-center gap-4">
               <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
                 <Image 
                   src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                   alt="Sarah Jenkins" 
                   fill
                   className="object-cover"
                 />
               </div>
               <div>
                  <h4 className="text-white font-bold text-sm">Sarah Jenkins</h4>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Masters in CS, Class of 2025</p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Form Flow */}
      <div className="relative flex-1 h-[65vh] lg:h-screen flex flex-col bg-white overflow-hidden">
        {/* Top Nav */}
        <div className="px-8 py-6 lg:px-12 lg:py-8 flex justify-between items-center z-30">
          <div className="flex items-center gap-1.5">
             {step > 0 && (
               <button 
                 onClick={() => setStep(step - 1)}
                 className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm"
               >
                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                 Back
               </button>
             )}
          </div>
          <div className="flex items-center gap-4">
             <span className="text-slate-400 text-xs font-bold tracking-widest hidden sm:inline">NEED HELP?</span>
             <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
               SUPPORT
             </button>
          </div>
        </div>

        {/* Progress Bar (Visible after Welcome) */}
        {step > 0 && (
          <div className="px-8 lg:px-12 mb-4">
            <div className="flex gap-1.5 w-full max-w-sm">
              {STEPS.slice(1).map((_, i) => {
                const stepIdx = i + 1;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                      stepIdx <= step ? (stepIdx === step ? "bg-blue-500 scale-y-125" : "bg-blue-200") : "bg-gray-100"
                    }`}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-[10px] font-black text-blue-500 uppercase tracking-widest">
              Step {step} of {STEPS.length - 1}: {STEPS[step].label}
            </p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto override-scroll px-8 lg:px-12 py-4 pb-32">
          {renderStep()}
        </div>

        {/* Fixed Footer Actions (Optional Overlay) */}
        {step > 0 && step < STEPS.length - 1 && (
          <div className="absolute bottom-0 left-0 w-full p-8 lg:px-12 bg-white/80 backdrop-blur-md border-t border-gray-50 flex items-center justify-between z-30">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Up</span>
               <span className="text-gray-900 font-black text-sm">{STEPS[step+1]?.label || "Finish"}</span>
            </div>
            <button
               onClick={handleNext}
               disabled={!canContinue}
               className={`px-10 h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                 canContinue
                   ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20 hover:-translate-y-0.5"
                   : "bg-gray-100 text-gray-400 cursor-not-allowed"
               }`}
             >
               Continue
               <ChevronLeft className="w-5 h-5 rotate-180" strokeWidth={3} />
             </button>
          </div>
        )}

        {/* Branding Footer (Only on Welcome) */}
        {step === 0 && (
          <div className="absolute bottom-6 left-8 lg:left-12 flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest z-30">
            <span>© 2026 NEXTDEGREE GLOBAL</span>
            <div className="flex gap-4">
              <button className="hover:text-gray-900 transition-colors">PRIVACY</button>
              <button className="hover:text-gray-900 transition-colors">TERMS</button>
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .override-scroll::-webkit-scrollbar { width: 4px; }
        .override-scroll::-webkit-scrollbar-track { background: transparent; }
        .override-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .override-scroll:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }
      `,
        }}
      />
    </div>
  );
}
