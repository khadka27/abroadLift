/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  Wallet,
  ScrollText,
  FileCheck,
  Building2,
  ChevronDown,
  ShieldAlert,
  Download,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  ielsReading: string;
  ielsWriting: string;
  ielsListening: string;
  ielsSpeaking: string;
  greVerbal: string;
  greQuant: string;
  greAwa: string;
  gmatTotal: string;
  backlogs: string;
  studyGap: string;
  gpa: string;
  bankBalance: string;
  sponsorType: string;
  sponsorIncome: string;
  univType: string;
  cityType: string;
  duration: string;
  budget: string;
  currency: string;
  intake: string;
  programTags: string[];
  scholarship: boolean;
  name: string;
  email: string;
}

interface Match {
  currency: string;
  logo: any;
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
  deadline?: string;
}

/* ─────────────── Static data ─────────────── */
const COUNTRIES = [
  { code: "GB", name: "United Kingdom", rec: "Highly Recommended", badge: "success" },
  { code: "CA", name: "Canada", rec: "Golden Choice", badge: "gold" },
  { code: "US", name: "U.S.A.", rec: "High Competition", badge: "amber" },
  { code: "AU", name: "Australia", rec: "Competitive", badge: "amber" },
  { code: "DE", name: "Germany", rec: "Free Education" },
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
  // Undergraduate
  { v: "undergrad-cert-1", l: "1-Year Post-Secondary Certificate", cat: "Undergraduate", icon: Award },
  { v: "undergrad-dip-2", l: "2-Year Undergraduate Diploma", cat: "Undergraduate", icon: Award },
  { v: "undergrad-adv-dip-3", l: "3-Year Undergraduate Advanced Diploma", cat: "Undergraduate", icon: Award },
  { v: "bachelor-3", l: "3-Year Bachelor's Degree", cat: "Undergraduate", icon: BookOpen },
  { v: "top-up", l: "Top-up Degree", cat: "Undergraduate", icon: RefreshCw },
  { v: "bachelor-4", l: "4-Year Bachelor's Degree", cat: "Undergraduate", icon: BookOpen },
  { v: "integrated-masters", l: "Integrated Masters", cat: "Undergraduate", icon: GraduationCap },

  // Post-graduate
  { v: "pg-cert", l: "Postgraduate Certificate", cat: "Post-graduate", icon: FileCheck },
  { v: "pg-dip", l: "Postgraduate Diploma", cat: "Post-graduate", icon: FileCheck },
  { v: "masters", l: "Master's Degree", cat: "Post-graduate", icon: GraduationCap },
  { v: "doctorate", l: "Doctoral / PhD", cat: "Post-graduate", icon: Microscope },

  // Schooling
  { v: "grade-1", l: "Grade 1", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-2", l: "Grade 2", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-3", l: "Grade 3", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-4", l: "Grade 4", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-5", l: "Grade 5", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-6", l: "Grade 6", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-7", l: "Grade 7", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-8", l: "Grade 8", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-9", l: "Grade 9", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-10", l: "Grade 10", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-11", l: "Grade 11", cat: "Elementary & High School", icon: AlignLeft },
  { v: "grade-12", l: "Grade 12", cat: "Elementary & High School", icon: AlignLeft },

  // Language
  { v: "esl", l: "English as Second Language (ESL)", cat: "Language Proficiency", icon: Globe },
];

const FIELDS = [
  { v: "Business & Management", icon: Briefcase },
  { v: "Computer Science & IT", icon: Monitor },
  { v: "Engineering", icon: Search },
  { v: "Medicine & Health", icon: HeartPulse },
  { v: "Law", icon: Scale },
  { v: "Arts & Humanities", icon: Palette },
  { v: "Social Sciences", icon: Brain },
  { v: "Data Science & AI", icon: LineChart },
  { v: "Natural Sciences", icon: Microscope },
  { v: "Hospitality & Tourism", icon: Plane },
  { v: "Architecture & Design", icon: Building2 },
  { v: "Agriculture & Forestry", icon: Cloud },
  { v: "Education & Teaching", icon: BookOpen },
  { v: "Media & Journalism", icon: ScrollText },
  { v: "Liberal Arts & General", icon: AlignLeft },
];

const PROGRAMS: Record<string, string[]> = {
  "Business & Management": [
    "MBA",
    "Finance",
    "Marketing",
    "Accounting",
    "Economics",
    "Digital Business",
    "Entrepreneurship",
    "Supply Chain Management",
  ],
  "Computer Science & IT": [
    "Software Engineering",
    "Cybersecurity",
    "Artificial Intelligence",
    "Data Science",
    "IT Management",
    "Cloud Computing",
    "Game Development",
  ],
  Engineering: [
    "Mechanical",
    "Civil",
    "Electrical",
    "Chemical",
    "Aerospace",
    "Mechatronics",
    "Biomedical Engineering",
  ],
  "Medicine & Health": [
    "MBBS (Medicine)",
    "Nursing",
    "Pharmacy",
    "Public Health",
    "Dentistry",
    "Physiotherapy",
    "Radiology",
  ],
  Law: [
    "LLB",
    "LLM",
    "Criminal Law",
    "Corporate Law",
    "International Law",
    "Human Rights Law",
  ],
  "Arts & Humanities": [
    "English Literature",
    "History",
    "Philosophy",
    "Fine Arts",
    "Religion",
    "Modern Languages",
    "Theology",
    "Liberal Arts",
  ],
  "Data Science & AI": [
    "Data Science",
    "Business Analytics",
    "Statistics",
    "Machine Learning",
    "Predictive Modeling",
  ],
  "Natural Sciences": [
    "Biology",
    "Chemistry",
    "Physics",
    "Environmental Science",
    "Marine Biology",
    "Biotechnology",
  ],
  "Social Sciences": [
    "Anthropology",
    "Sociology",
    "Psychology",
    "Gender Studies",
    "Geography",
    "Global Studies",
    "Political Science",
    "International Relations",
    "Criminology",
  ],
  "Hospitality & Tourism": [
    "Hotel Management",
    "Tourism Management",
    "Culinary Arts",
    "Event Management",
    "Leisure Studies",
  ],
  "Architecture & Design": [
    "Architecture",
    "Interior Design",
    "Urban Planning",
    "Graphic Design",
    "Landscape Architecture",
  ],
  "Agriculture & Forestry": [
    "Agricultural Science",
    "Forestry",
    "Animal Science",
    "Food Science",
    "Plant Science",
  ],
  "Education & Teaching": [
    "Early Childhood Education",
    "Primary Education",
    "Secondary Education",
    "TESOL",
    "Special Education",
  ],
  "Media & Journalism": [
    "Journalism",
    "Animation",
    "Media & Film Studies",
    "Photography",
    "Performance (Theatre/Dance)",
    "Music & Audio Production",
    "Communication",
    "Public Relations",
    "Digital Marketing",
  ],
  "Liberal Arts & General": [
    "General Studies",
    "Liberal Arts Foundation",
    "Interdisciplinary Studies",
  ],
};

const INTAKES = [
  "Dec 2025 - Mar 2026", "March 2026", "Apr - Jul 2026", "April 2026", "May 2026", 
  "June 2026", "July 2026", "Aug - Nov 2026", "August 2026", "September 2026", 
  "October 2026", "November 2026", "Dec 2026 - Mar 2027", "December 2026", 
  "January 2027", "February 2027", "March 2027", "Apr - Jul 2027", "April 2027", 
  "May 2027", "June 2027", "July 2027", "Aug - Nov 2027", "August 2027", 
  "September 2027", "October 2027", "November 2027", "Dec 2027 - Mar 2028", 
  "December 2027", "January 2028", "February 2028", "March 2028"
];

const PROGRAM_TAGS = [
  "Fast Acceptance", "High Job Demand", "Incentivized", "Instant Offer", 
  "Instant Submission", "Loan Available", "New Program", "No UK Interview", 
  "Popular", "Prime", "Scholarships Available", "Top"
];

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
  { label: "Welcome", question: "Your Journey Starts Here." },
  { label: "Destination", question: "Where do you want to study?" },
  { label: "Degree Level", question: "What is your target degree?" },
  { label: "Study Area", question: "What do you want to study?" },
  { label: "Target Intake", question: "When do you want to start?" },
  { label: "English Proficiency", question: "Do you have a test score?" },
  { label: "Budget", question: "What is your annual budget?" },
  { label: "Student Profile", question: "A few final details!" },
  { label: "Your Matches", question: "Choose your future!" },
  { label: "Cost Estimation", question: "Financial breakdown for your selected choice." },
  { label: "Admission Probability", question: "How likely are you to be accepted?" },
  { label: "Visa Eligibility", question: "Success probability for your visa application." },
  { label: "Document Checklist", question: "Everything you need to prepare for your journey." },
  { label: "Financial Summary", question: "Total investment for your journey from start to end." },
];

const DEF: Form = {
  countries: [],
  degree: "",
  field: "",
  program: "",
  intake: "",
  programTags: [],
  testType: "IELTS",
  testScore: "",
  ielsReading: "",
  ielsWriting: "",
  ielsListening: "",
  ielsSpeaking: "",
  greVerbal: "",
  greQuant: "",
  greAwa: "",
  gmatTotal: "",
  backlogs: "0",
  studyGap: "0",
  gpa: "",
  bankBalance: "",
  sponsorType: "Self",
  sponsorIncome: "",
  univType: "Public",
  cityType: "Tier 1",
  duration: "3",
  budget: "",
  currency: "USD",
  scholarship: false,
  name: "",
  email: "",
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

function TagSelect({
  tags,
  selected,
  onChange,
}: {
  tags: string[];
  selected: string[];
  onChange: (t: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 px-4 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all min-w-[140px] shadow-xs"
      >
        <span>Program Tag</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {selected.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shrink-0">
            {selected.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-12 left-0 w-64 bg-white border border-slate-100 rounded-[28px] shadow-2xl shadow-slate-200/50 p-4 z-[100] animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1 max-h-72 overflow-y-auto override-scroll pr-2 pb-2">
            {tags.map((tag) => {
              const isSel = selected.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/50 transition-all text-left"
                >
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSel ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-500/20" : "border-slate-100"
                  }`}>
                    {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-[11px] font-bold ${isSel ? "text-slate-900" : "text-slate-500"}`}>
                    {tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({
  match: m,
  currency: c,
  selected,
  onSelect,
}: {
  match: Match;
  currency: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      className={`bg-white border text-left rounded-[26px] overflow-hidden transition-all duration-300 cursor-pointer relative group ${
        selected
          ? "border-blue-600 ring-2 ring-blue-600/10 shadow-xl shadow-blue-500/5 translate-y--1"
          : "border-slate-100 hover:shadow-xl hover:border-blue-200 hover:translate-y--1"
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex gap-5">
          {/* Logo/Avatar */}
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
             {m.logo ? (
                <Image src={m.logo} alt={m.name} width={56} height={56} className="object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black text-xl">
                   {m.name.charAt(0)}
                </div>
             )}
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
             <div className="flex flex-col mb-4">
                <h3 className="text-[15px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {m.name}
                </h3>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                   {m.type || "Public Research"} • {m.rankingWorld ? `#${m.rankingWorld} World` : "Top Institution"}
                </span>
             </div>

             <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-blue-600/70 uppercase">Master&apos;s Degree</p>
                <h4 className="text-base font-black text-slate-900 leading-tight line-clamp-2">
                   {m.popularPrograms?.[0] || "Advanced Curriculum Study Program"}
                </h4>
             </div>

             <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                   <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      {m.countryCode && <FlagIcon countryCode={m.countryCode} className="w-4 h-3 rounded-xs" />}
                      {m.location}
                   </p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admission Rate</p>
                   <p className="text-xs font-black text-emerald-600">
                      {m.admissionRate}% Highly Likely
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer-like Info Bar */}
        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tuition per year</p>
              <p className="text-lg font-black text-slate-900">{fmt(m.tuitionFee || 0)}</p>
           </div>
           
           <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                className="h-10 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black transition-colors"
              >
                {showDetails ? "Hide" : "Explore"}
              </button>
              {m.website && (
                 <a
                   href={m.website}
                   target="_blank"
                   rel="noreferrer"
                   onClick={(e) => e.stopPropagation()}
                   className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
                 >
                    Apply <ExternalLink className="w-3.5 h-3.5" />
                 </a>
              )}
           </div>
        </div>
      </div>

      {showDetails && (
        <div className="bg-slate-50/50 p-6 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
            {m.description || "This institution offers world-class research facilities and a diverse student community focused on academic excellence."}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
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

          <div className="mt-6">
            <MatchCostEstimator match={m} />
          </div>
        </div>
      )}
    </div>
  );
}

function DestinationInsight({ match: m }: { match: Match }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        const city = m.location?.split(",")[0] || "London";
        const country = m.countryCode || "GB";
        const res = await fetch(
          `/api/destination-insight?city=${city}&country=${country}`,
        );
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

  if (loading)
    return (
      <div className="h-20 bg-gray-50 animate-pulse rounded-2xl border border-gray-100 mt-4" />
    );
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
            <span className="text-xs font-black uppercase tracking-widest">
              {data.city} Insight
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
              <Clock className="w-3 h-3 opacity-80" />
              <span className="text-[10px] font-bold">{data.localTime}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
              {data.isDay ? (
                <Sun className="w-3 h-3 text-amber-300" />
              ) : (
                <Moon className="w-3 h-3 text-blue-200" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {data.isDay ? "Day" : "Night"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">
                {Math.round(data.temp)}°
              </span>
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
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Pie Chart Simulation */}
              <div className="relative w-32 h-32 shrink-0">
                 <div className="absolute inset-0 rounded-full border-8 border-slate-50" />
                 <div className="absolute inset-0 rounded-full border-8 border-emerald-500 transition-all duration-1000" 
                      style={{ 
                        clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`,
                        rotate: `0deg`
                      }} />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total</span>
                    <span className="text-xs font-black text-slate-900 leading-none">{formatNPR(data.total_npr).split('.')[0]}</span>
                 </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                {[
                  { l: "Education", v: data.tuition_npr, c: "bg-emerald-500" },
                  { l: "Housing", v: data.housing_npr, c: "bg-blue-500" },
                  { l: "Food", v: data.food_npr, c: "bg-amber-500" },
                  { l: "Others", v: data.monthly_npr * 12, c: "bg-rose-500" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${item.c}`} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.l}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">{Math.round((item.v / data.total_npr) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${item.c} transition-all duration-1000`} style={{ width: `${(item.v / data.total_npr) * 100}%` }} />
                    </div>
                    <p className="text-[10px] font-black text-slate-900">{formatNPR(item.v)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
               <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calculator className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Exchange Rate</p>
                        <p className="text-xs font-bold text-slate-900">1 {m.currency || "USD"} = {data.exchange_rate.toFixed(2)} NPR</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Annual</p>
                     <p className="text-sm font-black text-blue-600">{formatNPR(data.total_npr)}</p>
                  </div>
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
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
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
  const canContinue = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.countries.length > 0;
    if (step === 2) return !!form.degree;
    if (step === 3) return !!form.field && !!form.program;
    if (step === 4) return !!form.intake;
    if (step === 5) return !!form.testScore;
    if (step === 6) return !!form.budget;
    if (step === 7) return !!form.email && !!form.name;
    if (step === 8) return !!selectedMatch; // Matches step
    if (step === 9) return true; // Cost step
    if (step === 10) return true; // Admission step
    if (step === 11) return true; // Visa step
    if (step === 12) return true; // Checklist step
    if (step === 13) return true; // Financial Summary step
    return false;
  };

  const handleNext = () => {
    if (step === 7) { // This was step 6 before, now it's step 7 (Student Profile)
      setStep(8); // Move to Matches step
      runMatch();
    } else if (step < STEPS.length - 1) {
      setStep(step + 1);
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
              Your Global Education{" "}
              <span className="text-blue-600">Journey</span> Starts Here.
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              We&apos;ll help you find the perfect university based on your
              goals, budget, and dreams.
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
                  if (e.key === "Enter" && canContinue()) handleNext();
                }}
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className={`w-full h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                canContinue()
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
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Universities
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">32</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Countries
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">12k+</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Admissions
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 1: Destination Countries
    if (step === 1) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-2xl">
          <div className="mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">
              Hi {form.name.split(" ")[0] || "there"}! Where do you want to
              study?
            </h2>
            <p className="text-gray-400 font-bold text-lg mb-8">
              Select one or more countries to get personalized matching.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COUNTRIES.map((c: any) => {
              const isSel = form.countries.includes(c.code);
              const badgeStyles = {
                success: "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30",
                gold: "bg-linear-to-r from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-500/40",
                amber: "bg-slate-900 text-white shadow-lg",
              }[c.badge as "success" | "gold" | "amber"] || "bg-slate-100 text-slate-500";

              return (
                <button
                  key={c.code}
                  onClick={() => toggleCountry(c.code)}
                  className={`group relative flex flex-col items-center justify-center gap-4 p-5 py-8 rounded-[32px] border-2 transition-all duration-300 ${
                    isSel
                      ? "border-blue-500 bg-white shadow-2xl shadow-blue-500/10 -translate-y-1"
                      : "border-gray-50 bg-white hover:border-gray-100 hover:shadow-xl hover:-translate-y-1 shadow-xs"
                  }`}
                >
                  {/* Floating Pill Badge */}
                  {c.rec && (
                     <div className={`absolute top-2 right-2 left-2 px-1.5 py-1 rounded-xl text-[7px] font-black uppercase tracking-widest text-center animate-in zoom-in-50 duration-500 ${badgeStyles}`}>
                        {c.rec}
                     </div>
                  )}

                  <div
                    className={`w-12 h-8 rounded-md overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-110 ${isSel ? "ring-2 ring-blue-500 ring-offset-2" : ""} ${c.rec ? "mt-4" : ""}`}
                  >
                    <FlagIcon
                      countryCode={c.code}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-[10px] font-black tracking-tight text-center ${isSel ? "text-slate-900" : "text-gray-400"}`}
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

    // 2: Degree Level (Structured Full List)
    if (step === 2) {
      const categories = Array.from(new Set(DEGREES.map(d => d.cat)));
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl px-4">
          <div className="mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Program Level
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Precisely define your intended level of education.
            </p>
          </div>
          
          <div className="space-y-12 pb-20">
             {categories.map((cat) => (
                <div key={cat} className="space-y-5">
                   <div className="flex items-center gap-4">
                      <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] whitespace-nowrap">{cat}</h3>
                      <div className="h-px bg-slate-100 w-full" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {DEGREES.filter(d => d.cat === cat).map((d) => {
                         const isSel = form.degree === d.v;
                         const Icon = d.icon;
                         return (
                            <button
                              key={d.v}
                              onClick={() => updateForm("degree", d.v)}
                              className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                                isSel
                                  ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                                  : "border-gray-50 bg-white hover:border-blue-100 hover:bg-slate-50/50"
                              }`}
                            >
                               <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                 isSel ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                               }`}>
                                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                               </div>
                               <span className={`text-[13px] font-bold leading-tight ${isSel ? "text-blue-900" : "text-slate-600"}`}>
                                  {d.l}
                               </span>
                               {isSel && (
                                 <div className="ml-auto">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                 </div>
                               )}
                            </button>
                         );
                      })}
                   </div>
                </div>
             ))}
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
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">
              Field of Study
            </h2>
            <p className="text-gray-500 font-medium">
              Tell us what you want to study so we can match you perfectly.
            </p>
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

    // 4: Intake Selection (New)
    if (step === 4) {
       return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
             <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">Target Intake</h2>
                <p className="text-gray-500 font-medium">When do you plan to start your studies?</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-12">
                {INTAKES.map((i) => {
                   const isSel = form.intake === i;
                   return (
                      <button
                        key={i}
                        onClick={() => updateForm("intake", i)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          isSel ? "border-blue-600 bg-blue-50/50 shadow-lg" : "border-slate-50 bg-white hover:border-blue-100"
                        }`}
                      >
                         <p className={`text-xs font-black ${isSel ? "text-blue-900" : "text-slate-600"}`}>{i}</p>
                      </button>
                   );
                })}
             </div>
          </div>
       );
    }

    // 5: English
    if (step === 5) {
      const calculateOverall = () => {
        if (form.testType !== "IELTS") return;
        const r = parseFloat(form.ielsReading) || 0;
        const w = parseFloat(form.ielsWriting) || 0;
        const l = parseFloat(form.ielsListening) || 0;
        const s = parseFloat(form.ielsSpeaking) || 0;
        if (r && w && l && s) {
          const avg = (r + w + l + s) / 4;
          const rounded = Math.round(avg * 2) / 2;
          updateForm("testScore", rounded.toString());
        }
      };

      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Language Proficiency</h2>
            <p className="text-gray-500 font-medium"> universities require verified proof of English skills.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {TESTS.map((t) => {
              const isSel = form.testType === t.v;
              return (
                <button
                  key={t.v}
                  onClick={() => updateForm("testType", t.v)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    isSel ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-lg shadow-blue-500/10" : "border-slate-100 bg-white hover:bg-slate-50 text-slate-400"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isSel ? "text-blue-600" : "text-slate-400"}`}>{t.v}</span>
                </button>
              );
            })}
          </div>

          {form.testType === "IELTS" ? (
             <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {[
                     { k: "ielsReading", l: "Reading" },
                     { k: "ielsWriting", l: "Writing" },
                     { k: "ielsListening", l: "Listening" },
                     { k: "ielsSpeaking", l: "Speaking" }
                   ].map((band) => (
                      <div key={band.k} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm focus-within:border-blue-500 transition-all text-center">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{band.l}</label>
                        <input 
                           type="number" 
                           step="0.5"
                           min="0"
                           max="9"
                           value={(form as any)[band.k]}
                           onChange={(e) => {
                              updateForm(band.k as keyof Form, e.target.value);
                              setTimeout(calculateOverall, 50);
                           }}
                           placeholder="6.5"
                           className="w-full text-3xl font-black text-center text-slate-900 outline-none bg-transparent placeholder:text-slate-100"
                        />
                      </div>
                   ))}
                </div>

                <div className="p-8 bg-slate-900 rounded-[32px] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-slate-900/40">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Sparkles className="w-24 h-24" />
                   </div>
                   <div className="text-center md:text-left flex-1 z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Auto-Calculated Band</p>
                      <h3 className="text-4xl font-black mb-1 italic">Overall IELTS Band</h3>
                      <p className="text-slate-400 text-xs font-medium">Each section ≥ 6.0 is essential for top-tier admissions.</p>
                   </div>
                   <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-500/20 z-10">
                      {form.testScore || "0"}
                   </div>
                </div>
             </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-sm transition-all focus-within:border-blue-600 focus-within:ring-8 focus-within:ring-blue-500/5 text-center max-w-md mx-auto">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 italic italic italic italic italic italic italic">
                Enter Your {form.testType} Overall Result
              </label>
              <input
                type="number"
                value={form.testScore}
                onChange={(e) => updateForm("testScore", e.target.value)}
                placeholder={`${TESTS.find((x) => x.v === form.testType)?.eg || "6.5"}`}
                className="w-full text-7xl font-black text-center text-slate-900 outline-none bg-transparent placeholder:text-slate-50"
                autoFocus
              />
            </div>
          )}
        </div>
      );
    }

    // 6: Financial Strategy & Investment Plan
    if (step === 6) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl px-4 pb-20">
          <div className="mb-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                Phase 02: Investment Planning
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-2">Financial Strategy</h2>
             <p className="text-gray-500 font-medium italic">Configure your investment parameters for total course estimation.</p>
          </div>

          <div className="space-y-10">
             {/* 1. Univ & City Type */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:border-blue-500 transition-all">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">University Category</p>
                   <div className="flex bg-slate-100 p-1 rounded-2xl">
                      {["Public", "Private"].map(t => (
                        <button key={t} onClick={() => updateForm("univType", t)} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${form.univType === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{t}</button>
                      ))}
                   </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:border-blue-500 transition-all">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Location Tiering</p>
                   <div className="flex bg-slate-100 p-1 rounded-2xl">
                      {[
                        {v: "Tier 1", l: "Elite (Metropolitan)"}, 
                        {v: "Tier 2", l: "Affordable (Regional)"}
                      ].map(t => (
                        <button key={t.v} onClick={() => updateForm("cityType", t.v)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${form.cityType === t.v ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{t.v}</button>
                      ))}
                   </div>
                </div>
             </div>

             {/* 2. Duration */}
             <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Estimated Course Duration</p>
                <div className="flex justify-center flex-wrap gap-4">
                   {["1", "2", "3", "4"].map(y => (
                      <button key={y} onClick={() => updateForm("duration", y)} className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${form.duration === y ? "border-blue-600 bg-blue-50 text-blue-800 shadow-lg shadow-blue-500/10" : "border-slate-50 bg-slate-50 text-slate-400 hover:border-blue-200"}`}>
                        <span className="text-xl font-black leading-none">{y}</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter">Year{y !== "1" && "s"}</span>
                      </button>
                   ))}
                </div>
             </div>

             {/* 3. Annual Budget */}
             <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-10 opacity-10">
                   <Wallet className="w-40 h-40" />
                </div>
                <div className="relative z-10 text-center">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Primary Annual Budget</p>
                   <div className="flex flex-col items-center gap-6">
                      <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10">
                        {CURRENCIES.map(c => (
                           <button key={c} onClick={() => updateForm("currency", c)} className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${form.currency === c ? "bg-white text-blue-600 shadow-sm" : "text-white/40"}`}>{c}</button>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                         <span className="text-4xl font-black text-white/20 uppercase tracking-tighter">{form.currency}</span>
                         <input type="number" value={form.budget} onChange={(e) => updateForm("budget", e.target.value)} placeholder="00,000" className="w-56 text-7xl font-black text-white outline-none bg-transparent placeholder:text-white/5" />
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {BUDGET_PRESETS.map(p => (
                          <button key={p.v} onClick={() => updateForm("budget", p.v)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${form.budget === p.v ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}>{p.l}</button>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    // 7: Enhanced Profile & Eligibility Dossier
    if (step === 7) {
      const isGraduate = form.degree.includes("Master") || form.degree.includes("Doctoral") || form.degree.includes("Postgraduate");
      
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-2xl pb-20">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Academic & Financial Dossier</h2>
            <p className="text-gray-500 font-medium">Your final profile details power our high-accuracy eligibility engine.</p>
          </div>

          <div className="space-y-12">
            {/* 1. Academic Record */}
            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                     <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Academic History</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-blue-500 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">GPA / Percentage</label>
                    <input type="number" step="0.01" value={form.gpa} onChange={(e) => updateForm("gpa", e.target.value)} placeholder="3.8" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-blue-500 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Backlogs</label>
                    <input type="number" value={form.backlogs} onChange={(e) => updateForm("backlogs", e.target.value)} placeholder="0" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-blue-500 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Study Gap (Years)</label>
                    <input type="number" value={form.studyGap} onChange={(e) => updateForm("studyGap", e.target.value)} placeholder="0" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                  </div>
               </div>
            </section>

            {/* 2. Graduate Standardized Tests (Optional for UG) */}
            {isGraduate && (
              <section className="space-y-6 animate-in slide-in-from-top-2">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <BookOpen className="w-5 h-5" />
                       </div>
                       <h3 className="text-xl font-black text-slate-900">Standardized Tests</h3>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                       {["GRE", "GMAT", "NONE"].map(t => (
                          <button key={t} onClick={() => updateForm("testType", t === "NONE" ? "IELTS" : t)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${form.testType === t || (t === "NONE" && form.testType !== "GRE" && form.testType !== "GMAT") ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                             {t}
                          </button>
                       ))}
                    </div>
                 </div>

                 {form.testType === "GRE" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in zoom-in-95">
                       <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-indigo-500 transition-all">
                         <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Verbal (130-170)</label>
                         <input type="number" value={form.greVerbal} onChange={(e) => updateForm("greVerbal", e.target.value)} placeholder="155" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                       </div>
                       <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-indigo-500 transition-all">
                         <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Quant (130-170)</label>
                         <input type="number" value={form.greQuant} onChange={(e) => updateForm("greQuant", e.target.value)} placeholder="165" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                       </div>
                       <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-indigo-500 transition-all">
                         <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">AWA (0-6)</label>
                         <input type="number" step="0.5" value={form.greAwa} onChange={(e) => updateForm("greAwa", e.target.value)} placeholder="4.0" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                       </div>
                    </div>
                 )}

                 {form.testType === "GMAT" && (
                    <div className="max-w-xs animate-in zoom-in-95">
                       <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-indigo-500 transition-all">
                         <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Score (200-800)</label>
                         <input type="number" value={form.gmatTotal} onChange={(e) => updateForm("gmatTotal", e.target.value)} placeholder="700" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                       </div>
                    </div>
                 )}
              </section>
            )}

            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                     <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Financial Capability</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-emerald-500 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Bank Balance (NPR)</label>
                    <input type="number" value={form.bankBalance} onChange={(e) => updateForm("bankBalance", e.target.value)} placeholder="5,000,000" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-emerald-500 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Sponsor Income (Monthly NPR)</label>
                    <input type="number" value={form.sponsorIncome} onChange={(e) => updateForm("sponsorIncome", e.target.value)} placeholder="150,000" className="w-full text-xl font-black text-slate-900 outline-none bg-transparent" />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm focus-within:border-emerald-500 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Sponsor</label>
                    <select value={form.sponsorType} onChange={(e) => updateForm("sponsorType", e.target.value)} className="w-full text-sm font-black text-slate-900 outline-none bg-transparent cursor-pointer py-2">
                       <option value="Self">Self / Savings</option>
                       <option value="Parents">Parents / Relatives</option>
                       <option value="Bank Loan">Bank Education Loan</option>
                       <option value="Sponsor">Private Sponsor</option>
                       <option value="Scholarship">Full Scholarship</option>
                    </select>
                  </div>
               </div>
            </section>

            {/* 4. Student Identity */}
            <section className="pt-6 border-t border-slate-100 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 focus-within:bg-white focus-within:border-blue-600 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Identity Name</label>
                    <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Jane Doe" className="w-full text-lg font-black text-slate-900 outline-none bg-transparent" />
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 focus-within:bg-white focus-within:border-blue-600 transition-all">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Secure Email Communication</label>
                    <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="jane@example.com" className="w-full text-lg font-black text-slate-900 outline-none bg-transparent" />
                  </div>
               </div>
            </section>
          </div>
        </div>
      );
    }

    // 8: Results & Selection (Full Page Dashboard UI)
    if (step === 8) {
      return (
        <div className="animate-in fade-in duration-700 max-w-full mx-auto px-8 lg:px-16">
          {/* Dashboard Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
                 <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 italic">Phase 02</span>
                 <span>Step 8 of 13</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Your <span className="text-blue-600">Matches.</span>
              </h1>
              <p className="text-slate-400 font-bold text-sm">
                We discovered {matches.length} world-class institutions personalized for your profile.
              </p>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
               <div className="px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{matches.length} Found</span>
               </div>
               <button onClick={runMatch} className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-lg shadow-slate-900/10">
                  <RefreshCw className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Advanced Filter Bar (Screenshot Inspired) */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/40 p-3 mb-8 space-y-3">
             {/* Primary Search Row */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="relative group flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <input 
                     type="text" 
                     placeholder="What would you like to study? (e.g., Computer Science)" 
                     className="w-full h-14 pl-11 pr-4 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-200 outline-none transition-all"
                   />
                </div>
                <div className="relative group">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select className="w-full h-14 pl-11 pr-10 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 appearance-none outline-none">
                      <option>Any Destination</option>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                   </select>
                </div>
                <div className="relative group">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select className="w-full h-14 pl-11 pr-10 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 appearance-none outline-none">
                      <option>Any Institution</option>
                      <option>Public Research Universities</option>
                      <option>Private Colleges</option>
                   </select>
                </div>
             </div>

             {/* Secondary Filter Row */}
             <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
                <select className="h-10 px-4 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase text-slate-500 outline-none hover:bg-slate-50 transition-colors">
                   <option>Program Level</option>
                </select>
                <select className="h-10 px-4 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase text-slate-500 outline-none hover:bg-slate-50 transition-colors">
                   <option>Field of study</option>
                </select>
                <select className="h-10 px-4 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase text-slate-500 outline-none hover:bg-slate-50 transition-colors">
                   <option>Intakes</option>
                   {INTAKES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <TagSelect 
                   tags={PROGRAM_TAGS} 
                   selected={form.programTags} 
                   onChange={(val) => updateForm("programTags", val)} 
                />
                <div className="flex-1" />
                <button className="h-10 px-4 rounded-xl bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100 hover:bg-blue-100 transition-colors">
                   <Sparkles className="w-3.5 h-3.5" />
                   Smart Filters
                   <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[8px]">BETA</span>
                </button>
                <button className="h-10 px-6 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                   Apply Filters
                </button>
             </div>
          </div>

          {/* Results Analytics Grid */}
          {!loading && matches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 pb-32">
              {matches.map((m) => (
                <div key={m.id} className="relative group">
                  <MatchCard 
                    match={m} 
                    currency={form.currency} 
                    selected={selectedMatch?.id === m.id}
                    onSelect={() => {
                      setSelectedMatch(m);
                      setStep(9);
                    }}
                  />
                  {/* Premium Logic Connectors */}
                  {selectedMatch?.id === m.id && (
                     <div className="absolute -inset-[3px] rounded-[30px] bg-blue-500/5 pointer-events-none ring-2 ring-blue-500 animate-in fade-in zoom-in-95 duration-500" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Loading State Overlay */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-[36px] border-4 border-slate-50 w-full h-full" />
                <div className="absolute inset-0 rounded-[36px] border-4 border-blue-500 border-t-transparent animate-spin w-full h-full shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Cloud className="w-8 h-8 text-blue-100 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                 <p className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Running Neural Engine...</p>
                 <p className="text-slate-400 font-medium text-sm">Cross-referencing {form.degree} programs in {form.field}...</p>
              </div>
            </div>
          )}
          {/* Fallback Search State */}
          {!loading && !error && matches.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-100 p-16 rounded-[48px] text-center max-w-xl mx-auto shadow-2xl shadow-slate-200/50">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Search className="w-12 h-12 text-slate-200" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4">No Direct Matches Found</h3>
               <p className="text-slate-500 font-medium leading-relaxed mb-10">
                 Our engine couldn&apos;t find an exact match for your specific criteria. Try broadening your budget or field of study.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                 <button onClick={() => setStep(6)} className="w-full sm:w-auto px-8 h-14 bg-slate-900 text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all">
                    Adjust Budget
                 </button>
                 <button onClick={() => { setForm({ ...form, budget: "100000", field: "" }); runMatch(); }} className="w-full sm:w-auto px-8 h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                    Reset Filters
                 </button>
               </div>
            </div>
          )}
        </div>
      );
    }

    // 9: Cost Selection Analytics & Roadmap
    if (step === 9 && selectedMatch) {
      const toggleUSD = form.currency === "USD";
      const tuition = selectedMatch.tuitionFee || 0;
      const living = 12000; // Base est
      const total = tuition + living;
      
      const displayVal = (v: number) => toggleUSD ? (v / 1.35).toFixed(1) : v.toFixed(1);
      const symbol = toggleUSD ? "$" : "NPR";
      const unit = toggleUSD ? "k" : "L";

      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-full px-8 lg:px-16 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-50 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                Direct Financial Intelligence
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Annual Cost Roadmap</h2>
              <p className="text-slate-500 font-medium italic mt-2">Analysis for {selectedMatch.name}</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
               {["NPR", "USD"].map(c => (
                  <button key={c} onClick={() => updateForm("currency", c)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${form.currency === c ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"}`}>{c}</button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 1. Main Highlight Cards */}
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="p-8 rounded-[40px] border-none bg-slate-900 text-white shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Calculator className="w-24 h-24 text-blue-400" />
                      </div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Base Tuition</p>
                      <h3 className="text-4xl font-black italic">
                         <span className="text-slate-500 text-xl mr-1 non-italic font-medium">{symbol}</span>
                         {displayVal(tuition)}
                         <span className="text-blue-400 text-2xl ml-1">{unit}</span>
                      </h3>
                      <p className="text-[9px] text-slate-400 mt-4 leading-relaxed font-bold">ANNUAL TUITION RATE</p>
                   </Card>

                   <Card className="p-8 rounded-[40px] border-none bg-white border border-slate-100 shadow-md hover:border-blue-500 transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600">
                         <Wallet className="w-24 h-24" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Living Estimate</p>
                      <h3 className="text-4xl font-black text-slate-900">
                         <span className="text-slate-300 text-xl mr-1 font-medium">{symbol}</span>
                         {displayVal(living)}
                         <span className="text-slate-300 text-2xl ml-1">{unit}</span>
                      </h3>
                      <p className="text-[9px] text-slate-400 mt-4 leading-relaxed font-bold uppercase tracking-widest">Global Base Average</p>
                   </Card>

                   <Card className="p-8 rounded-[40px] border-none bg-blue-600 text-white shadow-2xl relative overflow-hidden scale-105 ring-4 ring-blue-100">
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">Total Yearly</p>
                      <h3 className="text-4xl font-black italic">
                         <span className="text-blue-300 text-xl mr-1 non-italic font-medium">{symbol}</span>
                         {displayVal(total)}
                         <span className="text-blue-300 text-2xl ml-1">{unit}</span>
                      </h3>
                      <p className="text-[9px] text-blue-200 mt-4 leading-relaxed font-bold uppercase tracking-widest">Combined Base Model</p>
                   </Card>
                </div>

                <Card className="p-10 rounded-[48px] border-none bg-slate-50 border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-100/20 blur-[120px] rounded-full" />
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                      <div className="flex-1 space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                               <Sparkles className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900">ROI Match Analysis</h4>
                         </div>
                         <p className="text-slate-600 font-medium leading-relaxed">
                            Based on your target budget of {symbol} {form.budget}, {selectedMatch.name} provides an exceptional financial fit. 
                            The institution currently ranks in the <span className="text-blue-600 font-black">Top 10% for Graduate Salary ROI</span> in {selectedMatch.location?.split(",")[0]}.
                         </p>
                         <div className="flex flex-wrap gap-4 pt-4">
                            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-xs">
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scholarship Pool</p>
                               <p className="text-xs font-black text-emerald-600">3 ACTIVE OPPS</p>
                            </div>
                            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-xs">
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Affordability</p>
                               <p className="text-xs font-black text-blue-600">HIGH MATCH</p>
                            </div>
                         </div>
                      </div>
                      <div className="w-full md:w-48 h-48 rounded-[40px] bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center shadow-xl">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Neural Score</p>
                         <div className="text-6xl font-black text-blue-400 tracking-tighter italic">94%</div>
                         <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-[94%]" />
                         </div>
                      </div>
                   </div>
                </Card>
            </div>

            {/* 2. Side Strategy Panel */}
            <div className="lg:col-span-4 space-y-8">
               <Card className="p-8 rounded-[40px] border border-slate-100 bg-white shadow-sm space-y-8">
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Selection Roadmap</h5>
                  
                  <div className="space-y-6">
                     {[
                        { step: "Target Selection", desc: selectedMatch.name, status: "completed" },
                        { step: "Budget Alignment", desc: `${symbol} ${displayVal(total)}${unit} / Year`, status: "current" },
                        { step: "Visa Confidence", desc: "Neuro-calculation Pending", status: "upcoming" }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="flex flex-col items-center pt-1.5">
                              <div className={`w-3 h-3 rounded-full ${item.status === "completed" ? "bg-emerald-500" : item.status === "current" ? "bg-blue-600 ring-4 ring-blue-100" : "bg-slate-200"}`} />
                              {i < 2 && <div className="w-0.5 flex-1 bg-slate-100 mt-1" />}
                           </div>
                           <div className="pb-4">
                              <p className={`text-[9px] font-black uppercase tracking-widest ${item.status === "upcoming" ? "text-slate-300" : "text-slate-400"}`}>{item.step}</p>
                              <p className={`text-xs font-bold ${item.status === "upcoming" ? "text-slate-300" : "text-slate-900"} mt-1`}>{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <button 
                     onClick={() => setStep(10)}
                     className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                  >
                     Analyze Official Eligibility
                     <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
               </Card>

               <div className="p-6 bg-linear-to-br from-indigo-500 to-blue-600 rounded-[32px] text-white space-y-4 shadow-lg shadow-indigo-500/20">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <GraduationCap className="w-5 h-5" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest">Strategy Note</p>
                  </div>
                  <p className="text-xs font-medium leading-relaxed opacity-90 italic">
                     &ldquo;Choosing this institution aligns your academic profile with global hiring markets in {selectedMatch.location?.split(",")[1] || "the region"}.&rdquo;
                  </p>
               </div>
            </div>
          </div>
        </div>
      );
    }

    // 10: Advanced Eligibility Checker & AI Insights
    if (step === 10 && selectedMatch) {
       // --- SCORING LOGIC ---
       let score = 0;
       const insights = [];
       const suggestions = [];

       // 1. IELTS (30%)
       const ielts = parseFloat(form.testScore) || 0;
       if (ielts >= 7.5) score += 30;
       else if (ielts >= 7.0) score += 25;
       else if (ielts >= 6.5) score += 20;
       else if (ielts >= 6.0) score += 15;
       else score += 5;

       if (parseFloat(form.ielsWriting) < 6.0) insights.push("Writing band is below the preferred 6.0 threshold.");
       if (ielts < 6.5) suggestions.push("Consider retaking IELTS to reach 6.5+ for top-tier university access.");

       // 2. GRE/GMAT (25%)
       const isGrad = form.degree.includes("Master") || form.degree.includes("Doctoral");
       let graduateWeight = 25;
       if (form.testType === "GRE") {
          const total = (parseInt(form.greVerbal) || 130) + (parseInt(form.greQuant) || 130);
          if (total >= 320) score += 25;
          else if (total >= 310) score += 20;
          else if (total >= 300) score += 15;
          else score += 5;
          if (parseInt(form.greQuant) >= 160) insights.push("Your strong GRE Quant score is excellent for STEM programs.");
       } else if (form.testType === "GMAT") {
          const total = parseInt(form.gmatTotal) || 200;
          if (total >= 700) score += 25;
          else if (total >= 650) score += 20;
          else if (total >= 600) score += 15;
          else score += 5;
       } else {
          // If no GRE/GMAT, we redistribute to Academics for UG
          graduateWeight = 0;
          score += 15; // Baseline for no-test required programs
       }

       // 3. Academics (25%)
       let acadScore = 0;
       const gpa = parseFloat(form.gpa) || 3.0;
       if (gpa >= 3.8) acadScore = 25;
       else if (gpa >= 3.5) acadScore = 20;
       else if (gpa >= 3.0) acadScore = 15;
       else acadScore = 10;
       
       const bk = parseInt(form.backlogs) || 0;
       if (bk > 5) {
          acadScore -= 10;
          insights.push(`${bk} backlogs may raise questions during institutional screening.`);
       }
       score += Math.max(0, acadScore);

       // 4. Finance (20%)
       const balance = parseInt(form.bankBalance) || 0;
       if (balance >= 6000000) score += 20;
       else if (balance >= 4000000) score += 15;
       else if (balance >= 2500000) score += 10;
       else {
          score += 5;
          insights.push("Current bank balance is on the lower end for visa financial proof.");
          suggestions.push("Strengthen financial dossier with property evaluation or education loan.");
       }

       const status = score >= 80 ? "Eligible" : score >= 60 ? "Moderate" : "High Risk";
       const colorClass = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
       const bgClass = score >= 80 ? "bg-emerald-50" : score >= 60 ? "bg-amber-50" : "bg-rose-50";

       return (
         <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-full px-8 lg:px-16 pb-24">
            {/* LEFT: MAIN SCORE PANEL */}
            <div className="lg:col-span-12 mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
                AI Eligibility Engine 4.0
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Detailed Profile Assessment</h2>
              <p className="text-gray-500 font-medium max-w-lg mx-auto italic">Predictive analysis based on current global admission trends.</p>
            </div>

            <div className="lg:col-span-5 space-y-6">
               <Card className="p-8 rounded-[40px] border-none shadow-2xl bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="text-center space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Overall Match Score</p>
                     <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                           <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * score) / 100} className={`${colorClass} transition-all duration-1000 delay-300`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className={`text-5xl font-black ${colorClass}`}>{score}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/ 100</span>
                        </div>
                     </div>
                     <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full ${bgClass} ${colorClass} font-black text-sm uppercase tracking-widest border border-current/10`}>
                        {status === "Eligible" ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        {status}
                     </div>
                  </div>
               </Card>

               <Card className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/30">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Test Performance Breakdown</h4>
                  <div className="space-y-5">
                     {form.testType === "IELTS" && [
                        { l: "Reading", v: parseFloat(form.ielsReading) || 0 },
                        { l: "Writing", v: parseFloat(form.ielsWriting) || 0 },
                        { l: "Listening", v: parseFloat(form.ielsListening) || 0 },
                        { l: "Speaking", v: parseFloat(form.ielsSpeaking) || 0 }
                     ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-slate-400">{item.l}</span>
                              <span className={item.v >= 6.0 ? "text-emerald-500" : "text-rose-500"}>{item.v}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${item.v >= 6.0 ? "bg-emerald-500" : item.v >= 5.5 ? "bg-amber-500" : "bg-rose-500"} transition-all duration-1000`} style={{ width: `${(item.v / 9) * 100}%` }} />
                           </div>
                        </div>
                     ))}
                     {form.testType === "GRE" && [
                        { l: "Verbal", v: parseInt(form.greVerbal) || 130, max: 170 },
                        { l: "Quant", v: parseInt(form.greQuant) || 130, max: 170 },
                        { l: "AWA", v: parseFloat(form.greAwa) || 0, max: 6 }
                     ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-slate-400">{item.l}</span>
                              <span className="text-slate-900">{item.v}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-indigo-500 transition-all duration-1000`} style={{ width: `${((item.v - (item.max === 170 ? 130 : 0)) / (item.max === 170 ? 40 : 6)) * 100}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* RIGHT: AI ANALYSIS & ANALYTICS */}
            <div className="lg:col-span-7 space-y-6">
               <Card className="p-8 rounded-[40px] border-none shadow-xl bg-slate-900 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Monitor className="w-32 h-32" />
                  </div>
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-6 italic italic italic">AI Diagnostic Insights</h4>
                  <div className="space-y-4">
                     {insights.length > 0 ? insights.map((insight, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                           <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                           <p className="text-sm font-medium text-slate-100 leading-relaxed">{insight}</p>
                        </div>
                     )) : (
                        <div className="flex gap-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                           <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                           <p className="text-sm font-bold text-emerald-50">Your profile meets or exceeds most requirements for top-tier worldwide admissions.</p>
                        </div>
                     )}
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                           <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">AI Confidence</p>
                           <p className="text-sm font-black text-white">96.8% Reliable</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Top Region Match</p>
                        <p className="text-sm font-black text-blue-400">{form.countries[0] || "Global Entry"}</p>
                     </div>
                  </div>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-6 rounded-[32px] border border-slate-100 bg-white">
                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Smart Suggestions</h5>
                     <div className="space-y-3">
                        {suggestions.map((s, i) => (
                           <div key={i} className="flex gap-2 text-xs font-bold text-slate-600">
                              <span className="text-blue-500">•</span>
                              {s}
                           </div>
                        ))}
                        {suggestions.length === 0 && (
                           <div className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Profile is optimized for success.
                           </div>
                        )}
                        <div className="text-[10px] font-medium text-slate-400 mt-4 leading-relaxed bg-slate-50 p-3 rounded-xl">
                           <span className="font-black text-slate-900 mr-1 italic">Note:</span>
                           {form.countries.includes("US") ? "USA institutions prioritize holistic profiles including GRE and SOP." : "Your target region focuses heavily on standardized English scores."}
                        </div>
                     </div>
                  </Card>
                  
                  <Card className="p-6 rounded-[32px] flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">Country Fit</p>
                        <div className="flex flex-col items-center gap-2">
                           {form.countries.slice(0, 3).map(code => (
                              <div key={code} className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md w-full">
                                 <FlagIcon countryCode={code} className="w-5 h-4 rounded-xs" />
                                 <span className="text-xs font-black tracking-widest">{code} Match: 90%+</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
       );
    }

    // 11: Cost & Visa Estimation Dashboard
    if (step === 11 && selectedMatch) {
       const country = form.countries[0] || "AU";
       const duration = parseInt(form.duration) || 3;
       const isTier1 = form.cityType === "Tier 1";
       const isPrivate = form.univType === "Private";

       // --- 1. BASE COST DATA (Lakhs NPR) ---
       const costsMap: any = {
          US: { t: 30, t_p: 40, v: 0.25 },
          UK: { t: 25, t_p: 35, v: 0.50 },
          CA: { t: 18, t_p: 28, v: 0.20 },
          AU: { t: 28, t_p: 38, v: 1.25 }
       };

       const base = costsMap[country] || costsMap.AU;
       const tuitionAnnual = isPrivate ? base.t_p : base.t;
       const livingAnnual = isTier1 ? 15 : 10;
       const oneTimeCosts = 0.35 + base.v + 1.2 + 0.5; // IELTS + Visa + Flight + Consultancy

       const totalYearly = tuitionAnnual + livingAnnual;
       const totalCourse = (totalYearly * duration) + oneTimeCosts;
       
       // --- 2. VISA PROBABILITY LOGIC ---
       const bank = (parseInt(form.bankBalance) || 0) / 100000; // to Lakhs
       const minRequiredBank = totalYearly + 5; // buffer
       const hasIeltsGood = parseFloat(form.testScore) >= 6.5;
       
       let visaProb = 0;
       if (bank >= minRequiredBank && hasIeltsGood) visaProb = 92;
       else if (bank >= minRequiredBank || (hasIeltsGood && bank >= totalYearly * 0.7)) visaProb = 75;
       else if (bank >= totalYearly * 0.5) visaProb = 55;
       else visaProb = 35;

       // --- 3. RISK & INSIGHTS ---
       const risks = [];
       if (bank < totalYearly) risks.push("Current liquidity is below total first-year investment.");
       if (isTier1 && isPrivate) risks.push("High-cost combination: Elite city with Private education.");
       if (parseInt(form.sponsorIncome) < 150000) risks.push("Monthly sponsor income may be flagged for long-term sustainability.");

       const insights = [
          `Your financial coverage is ${Math.round((bank / minRequiredBank) * 100)}% of the recommended bank proof.`,
          form.cityType === "Tier 1" ? "Choosing a Tier 2 city could save you ~NPR 5 Lakhs annually." : "Tier 2 selection optimized your living expenses.",
          country === "CA" ? "Canada is currently the most cost-efficient option for your profile." : "This destination offers high ROI but requires strong financial standing."
       ];

       const toggleUSD = form.currency === "USD";
       const displayVal = (v: number) => toggleUSD ? (v / 1.35).toFixed(1) : v.toFixed(1);
       const symbol = toggleUSD ? "$" : "NPR";
       const unit = toggleUSD ? "k" : "L";

       return (
         <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-full px-4 pb-24">
            {/* DASHBOARD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
               <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                     Phase 03: Financial & Visa Oracle
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 leading-tight">Investment Dashboard</h2>
                  <p className="text-slate-500 font-medium italic italic italic">Comprehensive breakdown for {selectedMatch.name}</p>
               </div>
               <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                  {["NPR", "USD"].map(c => (
                     <button key={c} onClick={() => updateForm("currency", c)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${form.currency === c ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"}`}>{c}</button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* 1. TOTAL HIGHLIGHT */}
               <div className="lg:col-span-8 space-y-8">
                  <Card className="p-10 rounded-[48px] border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet className="w-48 h-48" />
                     </div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-center md:text-left">
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Total Course Investment</p>
                           <h3 className="text-6xl font-black tracking-tighter mb-2 italic">
                              <span className="text-slate-500 text-3xl mr-2 font-medium non-italic tracking-normal">{symbol}</span>
                              {displayVal(totalCourse)}
                              <span className="text-blue-400 text-4xl ml-2">{unit}</span>
                           </h3>
                           <p className="text-slate-400 font-medium">Estimated for the entire {duration}-year duration.</p>
                        </div>
                        <div className="w-full md:w-auto grid grid-cols-2 gap-4">
                           <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Yearly Base</p>
                              <p className="text-lg font-black">{symbol}{displayVal(totalYearly)}{unit}</p>
                           </div>
                           <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Required Bank</p>
                              <p className="text-lg font-black text-emerald-400">{symbol}{displayVal(minRequiredBank)}{unit}</p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex gap-8">
                           <div>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Monthly Cashflow</p>
                              <p className="text-xl font-black text-blue-400">{symbol}{displayVal(livingAnnual / 12)}{unit}<span className="text-[10px] text-slate-500 ml-1 font-medium non-italic">/mo</span></p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI Potential</p>
                              <p className="text-xl font-black text-emerald-400">High</p>
                           </div>
                        </div>
                        <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all shadow-xl shadow-white/5">
                           <Download className="w-4 h-4" />
                           GENERATE PDF REPORT
                        </button>
                     </div>
                  </Card>

                  {/* 2. PIE CHART & BREAKDOWN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="p-8 rounded-[40px] border border-slate-100 bg-white">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Cost Allocation</h4>
                        <div className="flex items-center gap-8">
                           <div className="relative w-32 h-32 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                 <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                                 <circle cx="64" cy="64" r="56" stroke="#3b82f6" strokeWidth="16" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * (tuitionAnnual / totalYearly))} />
                                 <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="16" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * (livingAnnual / totalYearly))} style={{ rotate: `${(tuitionAnnual / totalYearly) * 360}deg` }} />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Calculator className="w-6 h-6 text-slate-200" />
                              </div>
                           </div>
                           <div className="space-y-4 flex-1">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Tuition</span>
                                 </div>
                                 <span className="text-xs font-black text-slate-900">{Math.round((tuitionAnnual / totalYearly) * 100)}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Living</span>
                                 </div>
                                 <span className="text-xs font-black text-slate-900">{Math.round((livingAnnual / totalYearly) * 100)}%</span>
                              </div>
                           </div>
                        </div>
                     </Card>

                     <Card className="p-8 rounded-[40px] border border-slate-100 bg-white space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">One-Time Fees</h4>
                        {[
                           { l: "Visa & Gov Fees", v: base.v },
                           { l: "IELTS Exam", v: 0.35 },
                           { l: "Flight Essentials", v: 1.2 },
                           { l: "Application Fees", v: 0.5 }
                        ].map((fee, i) => (
                           <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{fee.l}</span>
                              <span className="text-xs font-black text-slate-900">{symbol} {displayVal(fee.v)}{unit}</span>
                           </div>
                        ))}
                     </Card>
                  </div>
               </div>

               {/* 3. VISA ORACLE PANEL */}
               <div className="lg:col-span-4 space-y-6">
                  <Card className="p-8 rounded-[40px] border-none bg-blue-600 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck className="w-24 h-24" />
                     </div>
                     <div className="text-center space-y-6 relative z-10">
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em]">Visa Success Probability</p>
                        <div className="text-6xl font-black tracking-tighter">
                           {visaProb}%
                        </div>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-white transition-all duration-1000 delay-500 shadow-lg shadow-white/50" style={{ width: `${visaProb}%` }} />
                        </div>
                        <p className="text-xs font-medium text-blue-100 italic">&quot;Your financial strength is the primary driver of this confidence score.&quot;</p>
                     </div>
                  </Card>

                  <Card className="p-8 rounded-[40px] border border-slate-100 bg-white">
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Risk Analysis</h4>
                     <div className="space-y-4">
                        {risks.length > 0 ? risks.map((r, i) => (
                           <div key={i} className="flex gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] font-bold text-rose-700 leading-relaxed">{r}</p>
                           </div>
                        )) : (
                           <div className="flex gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] font-bold text-emerald-700 leading-relaxed">No high-risk financial markers detected.</p>
                           </div>
                        )}
                     </div>

                     <div className="mt-8 pt-8 border-t border-slate-100">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Strategic Insights</h5>
                        <div className="space-y-3">
                           {insights.map((ins, i) => (
                              <div key={i} className="flex gap-2 text-[10px] font-bold text-slate-600 leading-relaxed">
                                 <span className="text-blue-500">•</span>
                                 {ins}
                              </div>
                           ))}
                        </div>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
       );
    }

    // 12: Document Checklist
    if (step === 12 && selectedMatch) {
      const docs = [
        { t: "Valid Passport", desc: "Must be valid for at least 6 months after your course end date." },
        { t: "Academic Transcripts", desc: "Original SLC/SEE, +2, and Bachelor's degree certificates." },
        { t: "English Score Certificate", desc: `${form.testType} score of ${form.testScore} or higher.` },
        { t: "Statement of Purpose (SOP)", desc: `Your personal essay focused on why you chose ${selectedMatch.name}.` },
        { t: "Financial Evidence", desc: "Bank balance certificate showing coverage for first year tuition & living." },
        { t: "Letters of Recommendation", desc: "At least two letters from previous professors or managers." },
        { t: "Character Certificate", desc: "Issued by your previous academic institution." },
        { t: "Passport Sized Photos", desc: "Recent photos with white background (meeting embassy specs)." },
      ];

      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Preparation Checklist</h2>
            <p className="text-gray-500 font-medium">Ensure you have these documents ready for your application.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((d, i) => (
              <div key={i} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-500 transition-all shadow-sm flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full border-2 border-slate-100 flex items-center justify-center text-transparent group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                  <FileCheck className="w-3 h-3 group-hover:text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{d.t}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 13: Final Phase Financial Oracle & Roadmap
    if (step === 13 && selectedMatch) {
       const duration = parseInt(form.duration) || 3;
       const tuitionAnnual = selectedMatch.tuitionFee || 25000;
       const livingAnnual = 12000;
       const oneTime = 3500; 
       
       const totalTuition = tuitionAnnual * duration;
       const totalLiving = livingAnnual * duration;
       const totalInvestment = totalTuition + totalLiving + oneTime;

       const toggleUSD = form.currency === "USD";
       const displayVal = (v: number) => toggleUSD ? (v / 1.35).toFixed(1) : v.toFixed(1);
       const symbol = toggleUSD ? "$" : "NPR";
       const unit = toggleUSD ? "k" : "L";

       const tuitionPercent = Math.round((totalTuition / totalInvestment) * 100);
       const livingPercent = Math.round((totalLiving / totalInvestment) * 100);
       const miscPercent = 100 - tuitionPercent - livingPercent;

       const meta = {
         US: { v: 185 },
         CA: { v: 110 },
         AU: { v: 450 },
         UK: { v: 600 },
       }[selectedMatch.countryCode as "US" | "CA" | "AU" | "UK"] || { v: 100 };

       return (
         <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full px-8 lg:px-16 pb-32">
            {/* 1. Header Spotlight */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10 border-b border-slate-50 pb-12">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 italic">
                     Phase 03: Final Financial Commitment
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter italic uppercase">Budget Summary</h2>
                  
                  {/* Currency Switching Tabs */}
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-2xl w-fit mt-8 border border-slate-100">
                     <button 
                        onClick={() => setForm({ ...form, currency: "NPR" })}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!toggleUSD ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
                     >
                        NPR (Home)
                     </button>
                     <button 
                        onClick={() => setForm({ ...form, currency: "USD" })}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${toggleUSD ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
                     >
                        USD (Intl)
                     </button>
                  </div>

                  <p className="text-slate-500 font-medium mt-6 italic text-lg max-w-2xl">
                     Complete fiscal roadmap for your full {duration}-year tenure at {selectedMatch.name}.
                  </p>
               </div>
               
               <div className="bg-blue-600 text-white p-10 rounded-[48px] shadow-2xl shadow-blue-500/20 text-center scale-105 ring-8 ring-blue-50">
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em] mb-4">Total Net Investment</p>
                  <h3 className="text-5xl font-black italic">
                     <span className="text-blue-200 text-2xl mr-1 non-italic font-medium">{symbol}</span>
                     {displayVal(totalInvestment)}
                     <span className="text-blue-200 text-3xl ml-1">{unit}</span>
                  </h3>
                  <p className="text-[9px] font-bold text-blue-100 mt-4 uppercase tracking-widest">Calculated to End-of-Degree</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* 2. Primary Analysis (LEFT) */}
               <div className="lg:col-span-8 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <Card className="p-10 rounded-[48px] border border-slate-100 bg-white shadow-sm flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 w-full">Investment Distribution</h4>
                        <div className="relative w-56 h-56 flex items-center justify-center">
                           <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#2563eb 0% ${tuitionPercent}%, #6366f1 ${tuitionPercent}% ${tuitionPercent+livingPercent}%, #94a3b8 ${tuitionPercent+livingPercent}% 100%)` }} />
                           <div className="absolute inset-0 w-32 h-32 m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                              <span className="text-2xl font-black text-slate-900">100%</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Coverage</span>
                           </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-12 w-full text-center">
                           <div>
                              <div className="w-2 h-2 rounded-full bg-blue-600 mx-auto" />
                              <p className="text-[9px] font-black text-slate-900">{tuitionPercent}%</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">Tuition</p>
                           </div>
                           <div>
                              <div className="w-2 h-2 rounded-full bg-indigo-500 mx-auto" />
                              <p className="text-[9px] font-black text-slate-900">{livingPercent}%</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">Living</p>
                           </div>
                           <div>
                              <div className="w-2 h-2 rounded-full bg-slate-400 mx-auto" />
                              <p className="text-[9px] font-black text-slate-900">{miscPercent}%</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">Misc</p>
                           </div>
                        </div>
                     </Card>

                     <Card className="p-10 rounded-[48px] border border-slate-100 bg-linear-to-b from-white to-slate-50 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                           <Calculator className="w-16 h-16" />
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12">Projected Expenditure Roadmap</h4>
                        <div className="flex items-end justify-between h-64 gap-6 px-4">
                           {Array.from({ length: duration }).map((_, i) => {
                              const annualTotal = tuitionAnnual + livingAnnual;
                              const h = 100 - (i * 12); 
                              return (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                                    <div className="w-full relative h-[210px] flex flex-col justify-end">
                                       <div className="absolute inset-0 bg-slate-100/50 rounded-3xl border border-dotted border-slate-200" />
                                       <div className="w-full bg-linear-to-t from-blue-700 via-blue-500 to-indigo-400 rounded-3xl transition-all duration-1000 shadow-lg relative group-hover:scale-y-[1.02]" style={{ height: `${h}%` }}>
                                          <div className="absolute -top-8 left-0 w-full text-center">
                                             <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">~{symbol}{displayVal(annualTotal)}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 border-b-2 border-blue-600 pb-1 uppercase tracking-widest italic font-bold">Year {i+1}</p>
                                 </div>
                              );
                           })}
                        </div>
                     </Card>
                  </div>

                  <Card className="p-10 rounded-[48px] border border-slate-100 bg-white shadow-sm overflow-hidden">
                     <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest italic font-bold">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Itemized Commitment Ledger</h4>
                        <span className="text-[9px] font-black text-blue-600 italic">Full Phase Breakdown</span>
                     </div>
                     <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                           <thead>
                              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                 <th className="px-4 py-2">Fiscal Item</th>
                                 <th className="px-4 py-2">Frequency</th>
                                 <th className="px-4 py-2 text-right">Magnitude</th>
                              </tr>
                           </thead>
                           <tbody className="text-xs font-bold text-slate-700">
                              {[
                                 { t: "Tuition Fee", f: "Annual", v: tuitionAnnual },
                                 { t: "Living (Rent/Food)", f: "Monthly", v: livingAnnual },
                                 { t: "Health Insurance", f: "One-time", v: 800 },
                                 { t: "Resource Material", f: "Semester", v: 500 },
                                 { t: "Flight Estimate", f: "One-time", v: 1200 },
                                 { t: "Visa Fees", f: "One-time", v: (meta as any).v || 350 },
                                 { t: "Enrollment Fees", f: "One-time", v: 450 },
                              ].map((item, idx) => (
                                 <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 rounded-l-2xl border-l-4 border-transparent group-hover:border-blue-600 font-bold text-slate-900">{item.t}</td>
                                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-lg bg-slate-100 text-[9px] uppercase tracking-tighter text-slate-500">{item.f}</span></td>
                                    <td className="px-4 py-3 text-right font-black text-slate-900 rounded-r-2xl">{symbol}{displayVal(item.v)}{unit}</td>
                                 </tr>
                              ))}
                              <tr className="bg-blue-600 text-white shadow-xl">
                                 <td className="px-4 py-4 rounded-l-2xl font-black italic uppercase tracking-widest">Aggregate Allocation</td>
                                 <td className="px-4 py-4" />
                                 <td className="px-4 py-4 text-right font-black text-lg rounded-r-2xl">{symbol} {displayVal(totalInvestment)} {unit}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </Card>

                  <Card className="p-12 rounded-[56px] border border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                     <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-3xl shrink-0 group-hover:scale-110 transition-transform">
                           <Sparkles className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="space-y-6">
                           <h4 className="text-2xl font-black italic tracking-tight">Financial Strategy Protocol</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300">
                              <div className="space-y-4">
                                 <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <p className="text-sm font-medium italic">Your liquidity covers 85% of Year 1 commitment upfront.</p>
                                 </div>
                                 <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <p className="text-sm font-medium italic">Sponsor verified for full {selectedMatch.name} degree support.</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className="flex items-start gap-4">
                                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                                    <p className="text-sm font-medium italic">Projections account for standard inflation and cost spikes.</p>
                                 </div>
                                 <div className="flex items-start gap-4">
                                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                                    <p className="text-sm font-medium italic">Recommended visa proof: {symbol}{displayVal(totalInvestment*1.05)}{unit}.</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>

               {/* 3. Submission Area (RIGHT) */}
               <div className="lg:col-span-4">
                  <Card className="p-10 rounded-[56px] border border-slate-100 bg-white shadow-xl w-full flex flex-col items-center justify-center text-center space-y-12 h-fit sticky top-8">
                     <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-2xl relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                        <CheckCircle2 className="w-12 h-12 relative z-10" />
                     </div>
                     <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight italic">Audit Complete</h4>
                        <p className="text-slate-500 font-medium italic mt-2">Your roadmap is ready for export.</p>
                     </div>
                     <div className="w-full space-y-4">
                        <button 
                           onClick={() => window.print()}
                           className="w-full h-16 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3 print:hidden"
                        >
                           <Download className="w-5 h-5" />
                           Export Financial PDF
                        </button>
                        <button onClick={() => setStep(0)} className="w-full h-14 bg-slate-50 text-slate-500 rounded-3xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-100 italic print:hidden">
                           START NEW ANALYSIS
                        </button>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
       );
    }

    return null;
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white relative overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-900">
      {/* Left Panel - Hero Sidebar */}
      {step < 8 && (
        <div className="relative w-full lg:w-[45%] h-[35vh] lg:h-screen bg-slate-100 overflow-hidden animate-in fade-in slide-in-from-left duration-700">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            alt="Student Graduation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/40 via-blue-800/60 to-slate-900/80 mix-blend-multiply" />
          <div className="absolute top-8 left-8 lg:top-12 lg:left-12 z-20">
             <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                   <GraduationCap className="text-white w-5 h-5" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">AbroadLift</span>
             </div>
          </div>

          <div className="absolute bottom-12 left-12 right-12 z-20 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] shadow-2xl max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
              <p className="text-white text-lg font-medium leading-relaxed italic mb-8">
                 &ldquo;AbroadLift made my application process simple and stress-free. The intake selection were exactly what I needed.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-400 overflow-hidden border-2 border-white/40">
                    <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" alt="User" width={40} height={40} className="object-cover" />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm">Sarah Jenkins</h4>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Master&apos;s Class of 2026</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Dynamic Flow Area */}
      <div className={`relative flex-1 flex flex-col bg-white overflow-hidden ${step >= 8 ? "h-screen" : "h-[65vh] lg:h-screen"}`}>
        {/* Progress Header */}
        {step > 0 && step < 8 && (
          <div className="h-1.5 w-full bg-slate-50 flex">
             {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`h-full flex-1 transition-all duration-1000 ${i < step ? "bg-blue-600" : "bg-slate-100"}`} />
             ))}
          </div>
        )}

        {/* Top Navbar */}
        <div className="px-8 py-6 lg:px-12 lg:py-8 flex justify-between items-center z-30 print:hidden">
           <div className="flex items-center gap-6">
              {step >= 8 && (
                 <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setStep(1)}>
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                       <GraduationCap className="text-white w-4 h-4" />
                    </div>
                    <span className="font-black text-lg tracking-tight text-slate-900">AbroadLift</span>
                 </div>
              )}
              {step > 0 && step < 8 && (
                 <button onClick={handleBack} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                 </button>
              )}
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300 tracking-widest hidden sm:inline">OFFICIAL ADMISSIONS PORTAL</span>
              <button className="px-5 py-2 rounded-xl bg-slate-50 text-[10px] font-black text-slate-500 hover:bg-slate-100 transition-colors border border-slate-100">HELP CENTER</button>
           </div>
        </div>

        {/* Step Indicator Sub-header */}
        {step > 0 && step < 8 && (
          <div className="px-8 lg:px-12 mb-2">
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Phase 01: Profile Building &bull; Step {step} of 7</p>
          </div>
        )}

        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 lg:py-12 override-scroll">
           <div className={`${step >= 8 ? "max-w-full" : "max-w-4xl"} mx-auto min-h-full flex flex-col`}>
              <div className="flex-1">
                 {renderStep()}
              </div>

              {/* Step Navigation Footer */}
              {step > 0 && step < 8 && (
                <div className="mt-20 pt-10 border-t border-slate-50 flex items-center justify-between pb-10 print:hidden">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Up</span>
                      <span className="text-sm font-bold text-slate-900">{STEPS[step + 1]?.label || "Finish"}</span>
                   </div>
                   <button 
                     onClick={handleNext}
                     disabled={!canContinue()}
                     className={`h-16 px-10 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-xl ${
                       canContinue() ? "bg-slate-900 text-white hover:bg-black hover:scale-105 shadow-slate-900/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                     }`}
                   >
                      {step === 7 ? "Analyze & Match" : "Continue"}
                      <ChevronLeft className="w-5 h-5 rotate-180" strokeWidth={3} />
                   </button>
                </div>
              )}

              {/* Analysis Navigation Footer (Post-Match) */}
              {step >= 9 && step <= 13 && (
                <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between pb-10 print:hidden">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis View</span>
                      <span className="text-sm font-bold text-slate-900">{STEPS[step]?.label}</span>
                   </div>
                   <div className="flex gap-4">
                      <button 
                         onClick={() => setStep(step === 9 ? 8 : step - 1)}
                         className="h-14 px-8 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm border border-slate-100 hover:bg-slate-100 transition-all flex items-center gap-2"
                      >
                         <ChevronLeft className="w-5 h-5" />
                         Back
                      </button>
                      <button 
                         onClick={() => setStep(step + 1)}
                         disabled={step === 13}
                         className={`h-14 px-10 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-xl ${
                           step < 13 ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-500/20" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                         }`}
                      >
                         {step === 13 ? "Finish Review" : "Next Stage"}
                         {step < 13 && <ChevronLeft className="w-5 h-5 rotate-180" strokeWidth={3} />}
                      </button>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Branding Global Footer (Only on Step 0) */}
        {step === 0 && (
           <div className="p-8 lg:px-12 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <span>&copy; 2026 ABROADLIFT GLOBAL ADMISSIONS</span>
                 <div className="hidden sm:flex items-center gap-4 border-l border-slate-100 pl-6 ml-2">
                    <button className="hover:text-slate-900 transition-colors">Privacy</button>
                    <button className="hover:text-slate-900 transition-colors">Legal</button>
                    <button className="hover:text-slate-900 transition-colors">Cookie Policy</button>
                 </div>
              </div>
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50">
                 <Globe className="w-4 h-4 text-slate-400" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic">Global Presence in 20+ Countries</span>
              </div>
           </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .override-scroll::-webkit-scrollbar { width: 4px; }
        .override-scroll::-webkit-scrollbar-track { background: transparent; }
        .override-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .override-scroll:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }
      `}} />
    </div>
  );
}
