/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Search,
  ClipboardList,
  Rocket,
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
  Info,
  Calendar,
  Check,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CreditCard,
  SlidersHorizontal,
  Bell,
  Pencil,
  Star,
  Target,
  AlertTriangle,
  FileText,
  Banknote,
  MessageCircle,
  ChevronRight,
  Bookmark,
  Shield,
  Heart,
  Trophy,
  User,
  Loader2,
  Square,
  Info as InfoIcon,
  CheckCircle,
  Save,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Form, Match, ChecklistItem, DataIndicator } from "@/types/matches";
import { FlagIcon } from "@/components/matches/FlagIcon";
import { UniversitySelection } from "@/components/matches/UniversitySelection";
import { FinancialDashboard } from "@/components/matches/FinancialDashboard";
import { AdmissionDetails } from "@/components/matches/AdmissionDetails";
import { VisaEligibility } from "@/components/matches/VisaEligibility";
import { formatNPRDevanagari, formatNPRDevanagariRange } from "@/lib/currency";
import { StudyOverviewDashboard } from "@/components/matches/StudyOverviewDashboard";

/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ Static data ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
const COUNTRIES = [
  { code: "USA", name: "USA" },
  { code: "UK", name: "UK" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "IE", name: "Ireland" },
  { code: "MT", name: "Malta" },
];

const DEGREES = [
  // Undergraduate
  {
    v: "undergrad-cert-1",
    l: "1-Year Post-Secondary Certificate",
    cat: "Undergraduate",
    icon: Award,
  },
  {
    v: "undergrad-dip-2",
    l: "2-Year Undergraduate Diploma",
    cat: "Undergraduate",
    icon: Award,
  },
  {
    v: "undergrad-adv-dip-3",
    l: "3-Year Undergraduate Advanced Diploma",
    cat: "Undergraduate",
    icon: Award,
  },
  {
    v: "bachelor-3",
    l: "3-Year Bachelor's Degree",
    cat: "Undergraduate",
    icon: BookOpen,
  },
  { v: "top-up", l: "Top-up Degree", cat: "Undergraduate", icon: RefreshCw },
  {
    v: "bachelor-4",
    l: "4-Year Bachelor's Degree",
    cat: "Undergraduate",
    icon: BookOpen,
  },
  {
    v: "integrated-masters",
    l: "Integrated Masters",
    cat: "Undergraduate",
    icon: GraduationCap,
  },

  // Post-graduate
  {
    v: "pg-cert",
    l: "Postgraduate Certificate",
    cat: "Post-graduate",
    icon: FileCheck,
  },
  {
    v: "pg-dip",
    l: "Postgraduate Diploma",
    cat: "Post-graduate",
    icon: FileCheck,
  },
  {
    v: "masters",
    l: "Master's Degree",
    cat: "Post-graduate",
    icon: GraduationCap,
  },
  {
    v: "doctorate",
    l: "Doctoral / PhD",
    cat: "Post-graduate",
    icon: Microscope,
  },

  // Schooling
  {
    v: "grade-1",
    l: "Grade 1",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-2",
    l: "Grade 2",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-3",
    l: "Grade 3",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-4",
    l: "Grade 4",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-5",
    l: "Grade 5",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-6",
    l: "Grade 6",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-7",
    l: "Grade 7",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-8",
    l: "Grade 8",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-9",
    l: "Grade 9",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-10",
    l: "Grade 10",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-11",
    l: "Grade 11",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },
  {
    v: "grade-12",
    l: "Grade 12",
    cat: "Elementary & High School",
    icon: AlignLeft,
  },

  // Language
  {
    v: "esl",
    l: "English as Second Language (ESL)",
    cat: "Language Proficiency",
    icon: Globe,
  },
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

const LEVEL_PROGRAMS: Record<string, Record<string, string[]>> = {
  "associate-foundation": {
    "Business & Management": [
      "Foundation in Business",
      "Associate of Arts (AA)",
      "Associate of Science (AS)",
      "Business Administration",
      "Accounting",
      "Hospitality Management",
    ],
    "Computer Science & IT": [
      "Foundation in Computer Science / IT",
      "Associate of Applied Science (AAS)",
      "IT Support / Networking",
      "Computer Systems",
      "Web Foundations",
    ],
    Engineering: [
      "Foundation in Engineering",
      "Engineering Fundamentals",
      "Mechanical Technology",
      "Civil Technology",
      "Electrical Technology",
    ],
    "Medicine & Health": [
      "Foundation in Health & Medicine",
      "Nursing Assistant",
      "Health Sciences",
      "Public Health Foundation",
    ],
    "Arts & Humanities": [
      "Foundation in Arts & Design",
      "Associate of Arts (AA)",
      "Media & Communication",
      "Design Foundations",
    ],
  },
  "bachelor-4": {
    "Computer Science & IT": [
      "BSc Computer Science",
      "Software Engineering",
      "Data Science / AI",
      "Cybersecurity",
      "IT",
    ],
    Engineering: [
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Robotics",
      "Computer Engineering",
    ],
    "Business & Management": [
      "BBA (Business Administration)",
      "BCom (Commerce)",
      "Finance",
      "Accounting",
      "Marketing",
      "International Business",
      "Human Resource Management",
    ],
    "Medicine & Health": [
      "Biology / Biotechnology",
      "Nursing",
      "Pharmacy",
      "Public Health",
      "MBBS (Medicine)",
    ],
    "Arts & Humanities": [
      "Psychology",
      "Sociology",
      "Political Science",
      "Journalism / Media",
      "English Literature",
      "International Relations",
      "Fine Arts / Design",
    ],
  },
  masters: {
    "Business & Management": [
      "MBA (Master of Business Administration)",
      "MSc Finance",
      "MSc Marketing",
      "MSc International Business",
      "MSc HR Management",
    ],
    "Computer Science & IT": [
      "MSc Computer Science",
      "MSc Data Science / AI",
      "MSc Cybersecurity",
      "MSc Software Engineering",
    ],
    Law: [
      "LLM (Law)",
      "International Relations",
      "Public Policy",
      "Development Studies",
    ],
    Engineering: [
      "MEng (Engineering)",
      "MSc Physics / Chemistry",
      "MSc Biotechnology",
      "MSc Environmental Science",
    ],
    "Arts & Humanities": [
      "MA Psychology",
      "MA Journalism",
      "MA Design / Fashion",
    ],
  },
  doctorate: {
    "Computer Science & IT": [
      "PhD in Computer Science / AI",
      "PhD in Data Science",
    ],
    Engineering: ["PhD in Engineering", "PhD in Robotics", "PhD in Energy"],
    "Medicine & Health": [
      "PhD in Medicine / Healthcare",
      "PhD in Public Health",
    ],
    "Business & Management": [
      "PhD in Business / Management",
      "PhD in Economics / Finance",
    ],
    "Arts & Humanities": [
      "PhD in Psychology",
      "PhD in Sociology",
      "PhD in International Relations",
    ],
    "Natural Sciences": [
      "PhD in Physics",
      "PhD in Chemistry",
      "PhD in Biotechnology",
    ],
  },
  "undergrad-dip-2": {
    "Business & Management": [
      "Diploma in Business Management",
      "Diploma in Accounting",
      "Diploma in Digital Marketing",
      "Diploma in Hospitality & Hotel Management",
    ],
    "Computer Science & IT": [
      "Diploma in Web Development",
      "Diploma in IT Support",
      "Diploma in Networking",
    ],
    "Arts & Humanities": [
      "Diploma in Graphic Design",
      "Diploma in Animation / Film",
      "Diploma in Media & Communication",
    ],
    "Medicine & Health": [
      "Diploma in Nursing / Healthcare",
      "Diploma in Public Health Assistance",
    ],
  },
};

const INTAKES = [
  "Dec 2025 - Mar 2026",
  "March 2026",
  "Apr - Jul 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "Aug - Nov 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "Dec 2026 - Mar 2027",
  "December 2026",
  "January 2027",
  "February 2027",
  "March 2027",
  "Apr - Jul 2027",
  "April 2027",
  "May 2027",
  "June 2027",
  "July 2027",
  "Aug - Nov 2027",
  "August 2027",
  "September 2027",
  "October 2027",
  "November 2027",
  "Dec 2027 - Mar 2028",
  "December 2027",
  "January 2028",
  "February 2028",
  "March 2028",
];

const COUNTRY_INTAKE_GUIDE: Record<
  string,
  {
    countryName: string;
    intakes: Array<{
      label: string;
      months: string;
      applyWindow: string;
      isMain?: boolean;
      isLimited?: boolean;
    }>;
  }
> = {
  USA: {
    countryName: "USA",
    intakes: [
      {
        label: "Fall",
        months: "Aug-Sep",
        applyWindow: "Nov-Jan",
        isMain: true,
      },
      { label: "Spring", months: "Jan", applyWindow: "Jul-Sep" },
      {
        label: "Summer",
        months: "May",
        applyWindow: "Varies",
        isLimited: true,
      },
    ],
  },
  UK: {
    countryName: "UK",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Dec-Jun",
        isMain: true,
      },
      {
        label: "January",
        months: "Jan",
        applyWindow: "Sep-Nov",
        isLimited: true,
      },
    ],
  },
  CA: {
    countryName: "Canada",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Nov-Mar",
        isMain: true,
      },
      { label: "January", months: "Jan", applyWindow: "Jul-Oct" },
      { label: "May", months: "May", applyWindow: "Varies", isLimited: true },
    ],
  },
  AU: {
    countryName: "Australia",
    intakes: [
      {
        label: "February",
        months: "Feb",
        applyWindow: "Oct-Dec",
        isMain: true,
      },
      { label: "July", months: "Jul", applyWindow: "Mar-May" },
      {
        label: "November",
        months: "Nov",
        applyWindow: "Varies",
        isLimited: true,
      },
    ],
  },
  DE: {
    countryName: "Germany",
    intakes: [
      { label: "Winter", months: "Oct", applyWindow: "May-Jul", isMain: true },
      { label: "Summer", months: "Apr", applyWindow: "Dec-Jan" },
    ],
  },
  JP: {
    countryName: "Japan",
    intakes: [
      { label: "April", months: "Apr", applyWindow: "Oct-Jan", isMain: true },
      { label: "October", months: "Oct", applyWindow: "Apr-Jun" },
    ],
  },
  KR: {
    countryName: "South Korea",
    intakes: [
      { label: "March", months: "Mar", applyWindow: "Sep-Nov" },
      { label: "September", months: "Sep", applyWindow: "May-Jun" },
    ],
  },
  IE: {
    countryName: "Ireland",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Nov-May",
        isMain: true,
      },
      { label: "January", months: "Jan", applyWindow: "Jul-Oct" },
    ],
  },
  NL: {
    countryName: "Netherlands",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Dec-Apr",
        isMain: true,
      },
      {
        label: "February",
        months: "Feb",
        applyWindow: "Sep-Nov",
        isLimited: true,
      },
    ],
  },
  FR: {
    countryName: "France",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Jan-Apr",
        isMain: true,
      },
      {
        label: "January",
        months: "Jan",
        applyWindow: "Varies",
        isLimited: true,
      },
    ],
  },
  IT: {
    countryName: "Italy",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Jan-May",
        isMain: true,
      },
      {
        label: "February",
        months: "Feb",
        applyWindow: "Varies",
        isLimited: true,
      },
    ],
  },
  ES: {
    countryName: "Spain",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Jan-May",
        isMain: true,
      },
      { label: "January", months: "Jan", applyWindow: "Varies" },
    ],
  },
  SE: {
    countryName: "Sweden",
    intakes: [
      {
        label: "August/September",
        months: "Aug-Sep",
        applyWindow: "Oct-Jan (strict)",
        isMain: true,
      },
      { label: "January", months: "Jan", applyWindow: "Varies" },
    ],
  },
  CH: {
    countryName: "Switzerland",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Dec-Apr",
        isMain: true,
      },
      { label: "February", months: "Feb", applyWindow: "Varies" },
    ],
  },
  NZ: {
    countryName: "New Zealand",
    intakes: [
      {
        label: "February",
        months: "Feb",
        applyWindow: "Oct-Nov",
        isMain: true,
      },
      { label: "July", months: "Jul", applyWindow: "Apr-May" },
    ],
  },
  SG: {
    countryName: "Singapore",
    intakes: [
      { label: "August", months: "Aug", applyWindow: "Oct-Mar", isMain: true },
      {
        label: "January",
        months: "Jan",
        applyWindow: "Varies",
        isLimited: true,
      },
    ],
  },
  AE: {
    countryName: "UAE",
    intakes: [
      {
        label: "September",
        months: "Sep",
        applyWindow: "Apr-Aug",
        isMain: true,
      },
      { label: "January", months: "Jan", applyWindow: "Oct-Dec" },
      { label: "May", months: "May", applyWindow: "Varies" },
    ],
  },
  MT: {
    countryName: "Malta",
    intakes: [
      {
        label: "October",
        months: "Oct",
        applyWindow: "Jun-Aug",
        isMain: true,
      },
      { label: "February", months: "Feb", applyWindow: "Oct-Nov" },
    ],
  },
};

const PROGRAM_TAGS = [
  "Fast Acceptance",
  "High Job Demand",
  "Incentivized",
  "Instant Offer",
  "Instant Submission",
  "Loan Available",
  "New Program",
  "No UK Interview",
  "Popular",
  "Prime",
  "Scholarships Available",
  "Top",
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
  { label: "Country", question: "Where do you want to study?" },
  { label: "Study Level", question: "What level of study are you planning?" },
  { label: "Field Of Study", question: "What do you want to study?" },
  { label: "Academics", question: "Tell us about your background" },
  { label: "English", question: "Do you have an English test score?" },
  { label: "Target Intake", question: "When do you want to start?" },
  { label: "Your Matches", question: "Choose your future!" },
  {
    label: "Cost Estimation",
    question: "Financial breakdown for your selected choice.",
  },
  {
    label: "Admission Probability",
    question: "How likely are you to be accepted?",
  },
  {
    label: "Visa Eligibility",
    question: "Success probability for your visa application.",
  },
  {
    label: "Document Checklist",
    question: "Everything you need to prepare for your journey.",
  },
  {
    label: "Financial Summary",
    question: "Total investment for your journey from start to end.",
  },
  {
    label: "Final Recommendation",
    question: "Your counselor-style decision summary and action plan.",
  },
];

const DEF: Form = {
  countries: [],
  nationality: "",
  currentCountry: "",
  degree: "",
  field: "",
  program: "",
  intake: "",
  intakeYear: "",
  aptitudeTest: "NONE",
  programTags: [],
  testType: "IELTS",
  testScore: "",
  ielsReading: "",
  ielsWriting: "",
  ielsListening: "",
  ielsSpeaking: "",
  toeflReading: "",
  toeflWriting: "",
  toeflListening: "",
  toeflSpeaking: "",
  pteReading: "",
  pteWriting: "",
  pteListening: "",
  pteSpeaking: "",
  duoLiteracy: "",
  duoComprehension: "",
  duoConversation: "",
  duoProduction: "",
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
  currency: "NPR",
  scholarship: false,
  name: "",
  email: "",
  highestEducation: "",
  passingYear: "",
  hasEnglishTest: null,
  plannedTestType: "",
  plannedTestScore: "",
  passportReady: false,
  testDone: false,
  docsReady: false,
  educationStatus: "",
};

/* ─────────────── UI Components ─────────────── */

const PLANNED_TEST_OPTIONS = [
  { value: "", label: "Select a test" },
  { value: "IELTS", label: "IELTS" },
  { value: "PTE", label: "PTE" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "Duolingo", label: "Duolingo" },
];

function PlannedTestDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    PLANNED_TEST_OPTIONS.find((o) => o.value === value)?.label || "Select a test";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between bg-[#F4F7FF] text-[15px] font-bold rounded-xl px-4 py-3 outline-none border transition-all ${
          open
            ? "border-[#3686FF] ring-2 ring-[#3686FF]/20 bg-white shadow-md"
            : "border-transparent hover:border-blue-200"
        } ${value ? "text-slate-800" : "text-slate-400"}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            open ? "rotate-180 text-[#3686FF]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-100 shadow-xl rounded-2xl z-[200] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1.5">
            {PLANNED_TEST_OPTIONS.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className={`relative w-full ${open ? "z-[200]" : ""}`}>
      <button
        onClick={() => {
          setOpen(!open);
          setQuery("");
        }}
        className={`w-full relative flex items-center pl-10 pr-4 h-[50px] md:h-[60px] bg-[#f8fafc] border rounded-[18px] md:rounded-[22px] text-left transition-all ${
          open
            ? "border-blue-500 ring-4 ring-blue-500/5 bg-white shadow-lg"
            : "border-slate-200 hover:border-blue-200 shadow-sm"
        }`}
      >
        <Search
          className={`w-[20px] h-[20px] absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            open ? "text-blue-500" : "text-slate-400"
          }`}
          strokeWidth={2}
        />
        <span
          className={`text-[15px] font-semibold truncate ${
            value ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`ml-auto w-5 h-5 text-slate-400 transition-transform ${
            open ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white border border-slate-100 shadow-xl rounded-[24px] z-50 overflow-hidden flex flex-col max-h-[220px] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
              <Search
                className="w-5 h-5 text-blue-500 ml-2"
                strokeWidth={2.5}
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-transparent p-2 text-[15px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:italic"
              />
            </div>
            <div className="overflow-y-auto overscroll-contain flex-1 p-2 space-y-1">
              {filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-5 min-h-[50px] flex items-center rounded-[16px] text-[15px] font-semibold transition-all ${
                    value === opt
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-slate-400 text-sm font-medium italic">
                    No results found
                  </p>
                </div>
              )}
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
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
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isSel
                        ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-500/20"
                        : "border-slate-100"
                    }`}
                  >
                    {isSel && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold ${isSel ? "text-slate-900" : "text-slate-500"}`}
                  >
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

  const acceptanceRate =
    typeof m.admissionRate === "number"
      ? Math.max(0, Math.min(100, m.admissionRate))
      : null;
  const matchBadgeLabel =
    m.matchType === "exact"
      ? "Best Match"
      : m.matchType === "similar"
        ? "Similar"
        : "Recommended";
  const matchBadgeClass =
    m.matchType === "exact"
      ? "bg-emerald-500"
      : m.matchType === "similar"
        ? "bg-violet-500"
        : "bg-[#ff9f43]";

  return (
    <div
      className={`bg-white border text-left rounded-[36px] overflow-hidden transition-all duration-500 cursor-pointer relative group flex flex-col h-full ${
        selected
          ? "border-blue-500 ring-1 ring-blue-500/20 shadow-2xl translate-y-[-6px]"
          : "border-slate-100 hover:shadow-2xl hover:border-blue-200 hover:translate-y-[-4px]"
      }`}
      onClick={onSelect}
    >
      {/* Banner Image */}
      <div className="relative w-full h-[180px] sm:h-[230px] overflow-hidden">
        <Image
          src={m.banner || "/uni-default.webp"}
          alt={m.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        {/* Global Rank Badge - Frosted White with Blue Text as per mockup */}
        <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white flex items-center gap-2 shadow-lg">
          <Trophy className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-[11px] font-[800] text-[#3b82f6] uppercase tracking-wider">
            {m.rankingWorld ? `#${m.rankingWorld} Global` : "Ranking N/A"}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        {/* Row 1: Location & Recommended Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-400 min-w-0">
            <MapPin className="w-4 h-4 shrink-0" />
            <FlagIcon
              countryCode={m.countryCode || "US"}
              className="w-6 h-4 shrink-0 rounded-[3px]"
            />
            <span className="text-[11px] font-bold uppercase tracking-widest truncate max-w-[140px] text-slate-500">
              {m.location || "Location Unavailable"}
            </span>
          </div>
          <div
            className={`px-5 py-1.5 rounded-full text-white text-[9px] font-bold uppercase tracking-widest shadow-sm ${matchBadgeClass}`}
          >
            {matchBadgeLabel}
          </div>
        </div>

        {/* Row 2: Identity (Logo and Name) */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative p-3">
            {m.logo ? (
              <Image
                src={m.logo}
                alt={m.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="text-blue-600 font-semibold text-[22px]">
                {m.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-[22px] font-bold text-[#111827] leading-tight mb-1">
              {m.name}
            </h3>
            <p className="text-[#4F46E5] font-semibold text-[16px] tracking-tight">
              {m.popularPrograms?.[0] || "Program details available"}
            </p>
          </div>
        </div>

        {/* Row 3: Key Stats */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
              <Calendar className="w-5 h-5" />
              <span className="text-[13px] font-semibold text-black">
                Duration
              </span>
            </div>
            <span className="text-[13px] font-semibold text-[#111827] ">
              {m.durationYears
                ? `${m.durationYears} Year${m.durationYears > 1 ? "s" : ""}`
                : "Varies by Program"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
              <Wallet className="w-5 h-5" />
              <span className="text-[13px] font-semibold text-black">
                Tuition
              </span>
            </div>
            <span className="text-[13px] font-semibold text-[#111827]">
              {m.tuitionFee ? `${fmt(m.tuitionFee)} / yr` : "TBD"}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                <span className="text-[13px] font-semibold text-black ">
                  Acceptance Rate
                </span>
              </div>
              <span className="text-[14px] font-extrabold text-[#10b981] uppercase">
                {acceptanceRate !== null ? `${acceptanceRate}%` : "N/A"}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div
                className="h-full bg-[#10b981] rounded-full transition-all duration-1000"
                style={{ width: `${acceptanceRate ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Actions Buttons */}
        <div className="mt-auto space-y-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="w-full h-16 rounded-[30px] bg-[#3686FF] text-white font-bold text-[16px] shadow-[0_8px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group"
          >
            Select University
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="w-full py-2 text-slate-400 font-bold text-[14px] hover:text-slate-600 transition-colors text-center"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
        </div>
      </div>

      {/* Expanded Details - Rich Data Feed */}
      {showDetails && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-500">
          <div className="border-t border-slate-50 pt-5 space-y-6">
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">
              {m.description ||
                "World-class research facilities and a diverse student community focused on academic excellence."}
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              {/* Ranking & Type */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Award className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    National Rank
                  </span>
                </div>
                <p className="text-[14px] font-bold text-slate-900">
                  {m.rankingNational ? `#${m.rankingNational}` : "N/A"}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Type & Founded
                  </span>
                </div>
                <p className="text-[14px] font-bold text-slate-900 capitalize">
                  {m.type || "Public"}{" "}
                  <span className="text-slate-500 font-medium">
                    {m.founded ? `(${m.founded})` : ""}
                  </span>
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Min. GPA
                  </span>
                </div>
                <p className="text-[14px] font-bold text-slate-900">
                  {typeof m.gpaRequirement === "number" ? (
                    <>
                      {m.gpaRequirement}
                      <span className="text-slate-400 text-[11px] font-bold">
                        /4.0
                      </span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    English Req.
                  </span>
                </div>
                <p className="text-[14px] font-bold text-slate-900">
                  {typeof m.englishReq === "number"
                    ? `IELTS ${m.englishReq}`
                    : "N/A"}
                </p>
              </div>

              {/* Demographics & Salary */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Intl. Students
                  </span>
                </div>
                <p className="text-[14px] font-bold text-slate-900">
                  {typeof m.internationalPercentage === "number"
                    ? `${m.internationalPercentage}%`
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Grad Salary
                  </span>
                </div>
                <p className="text-[14px] font-bold text-emerald-600">
                  {m.salaryMedian ? fmt(m.salaryMedian) : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Deadline
                </span>
                <span className="text-[13px] font-bold text-rose-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {m.applicationDeadline || "Check university portal"}
                </span>
              </div>

              {m.website && (
                <a
                  href={m.website}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 group/link px-5 py-2.5 bg-[#f8fafc] hover:bg-blue-50 transition-all rounded-[14px] text-blue-600 text-[12px] font-bold shadow-sm ring-1 ring-slate-100 hover:ring-blue-100"
                >
                  Website
                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
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
                {Math.round(data.temp)}┬░
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
                <div
                  className="absolute inset-0 rounded-full border-8 border-emerald-500 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`,
                    rotate: `0deg`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    Total
                  </span>
                  <span className="text-xs font-black text-slate-900 leading-none">
                    {formatNPR(data.total_npr).split(".")[0]}
                  </span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                {[
                  { l: "Education", v: data.tuition_npr, c: "bg-emerald-500" },
                  { l: "Housing", v: data.housing_npr, c: "bg-blue-500" },
                  { l: "Food", v: data.food_npr, c: "bg-amber-500" },
                  { l: "Others", v: data.monthly_npr * 12, c: "bg-rose-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${item.c}`} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {item.l}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">
                        {Math.round((item.v / data.total_npr) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.c} transition-all duration-1000`}
                        style={{ width: `${(item.v / data.total_npr) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-black text-slate-900">
                      {formatNPR(item.v)}
                    </p>
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Exchange Rate
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      1 {m.currency || "USD"} = {data.exchange_rate.toFixed(2)}{" "}
                      NPR
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Total Annual
                  </p>
                  <p className="text-sm font-black text-blue-600">
                    {formatNPR(data.total_npr)}
                  </p>
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

/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ Generic Engine Screen Component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
interface EngineConfig {
  title: string;
  titles: string[];
  checklist: {
    id: number;
    text: string;
    status: "complete" | "loading" | "pending";
  }[];
  indicators: { text: string; count: number; active: boolean }[];
  icon: any;
  gradient: string;
  glow: string;
  accent: string;
  statusText: string;
}

function GenericEngineScreen({
  config,
  onFinish,
}: {
  config: EngineConfig;
  onFinish?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [checklist, setChecklist] = useState(config.checklist);
  const [dataIndicators, setDataIndicators] = useState(config.indicators);

  // Animate progress with non-linear speed
  useEffect(() => {
    const duration = 4000; // 4 seconds total for these sub-engines
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const newProgress = eased * 100;
      setProgress(newProgress);

      if (newProgress > 30) {
        setChecklist((prev) => {
          const next = [...prev];
          if (next[0].status === "loading") {
            next[0] = { ...next[0], status: "complete" };
            if (next[1]) next[1] = { ...next[1], status: "loading" };
          }
          return next;
        });
      }
      if (newProgress > 60) {
        setChecklist((prev) => {
          const next = [...prev];
          if (next[1] && next[1].status === "loading") {
            next[1] = { ...next[1], status: "complete" };
            if (next[2]) next[2] = { ...next[2], status: "loading" };
          }
          return next;
        });
      }
      if (newProgress > 90) {
        setChecklist((prev) => {
          const next = [...prev];
          if (next[next.length - 1].status === "loading") {
            next[next.length - 1] = {
              ...next[next.length - 1],
              status: "complete",
            };
          }
          return next;
        });
      }

      if (t >= 1) {
        clearInterval(interval);
        if (onFinish) onFinish();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish, config.checklist]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % config.titles.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [config.titles.length]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataIndicators((prev) =>
        prev.map((indicator) => ({
          ...indicator,
          count: indicator.active
            ? Math.floor(Math.random() * 5000) + 8000
            : indicator.count,
        })),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <Check className="w-5 h-5 text-emerald-400" />;
      case "loading":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className={`w-5 h-5 ${config.accent}`} />
          </motion.div>
        );
      case "pending":
        return <Square className="w-5 h-5 text-gray-800" />;
      default:
        return null;
    }
  };

  const activeTask =
    checklist.find((c) => c.status === "loading") ||
    checklist[checklist.length - 1];
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-50/70 backdrop-blur-xl overflow-hidden">
      {/* Background Animated Blobs for Glassmorphism */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }} />

      <Card className="relative z-10 w-full max-w-[500px] p-10 md:p-14 flex flex-col items-center rounded-[40px] border border-white/60 bg-white/80 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        
        {/* Unique Circular Progress & Icon Container */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-10">
          {/* Breathing Radial Glow */}
          <motion.div
            className={`absolute inset-0 rounded-full blur-[40px] opacity-30 ${config.glow}`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm">
            {/* Background Track */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              strokeWidth="4"
              stroke="#f1f5f9"
              fill="transparent"
            />
            {/* Animated Progress */}
            <motion.circle
              cx="96"
              cy="96"
              r={radius}
              strokeWidth="4.5"
              stroke="currentColor"
              fill="transparent"
              strokeLinecap="round"
              className={config.accent}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ ease: "linear", duration: 0.1 }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>

          {/* Central Animated Content */}
          <div className="relative flex flex-col items-center justify-center gap-1 mt-1">
            <config.icon
              className={`w-10 h-10 ${config.accent} drop-shadow-sm`}
              strokeWidth={2.5}
            />
            <span
              className={`text-[26px] font-black ${config.accent} tabular-nums tracking-tighter drop-shadow-sm`}
            >
              {Math.round(progress)}%
            </span>
          </div>

          {/* Orbiting Satellite Dot */}
          <motion.div
            className={`absolute w-3 h-3 rounded-full ${config.accent.replace("text", "bg")} shadow-lg`}
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-6px",
              marginLeft: "-6px",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full translate-x-[70px]" />
          </motion.div>
        </div>

        {/* Typographical Title Header */}
        <div className="h-10 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={titleIndex}
              initial={{ opacity: 0, scale: 0.98, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -5 }}
              transition={{ duration: 0.5 }}
              className="text-[20px] md:text-[24px] font-extrabold text-slate-900 tracking-tight text-center"
            >
              {config.titles[titleIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Checklists and Indicators */}
        <div className="w-full flex justify-between items-end gap-6 border-t border-slate-100/80 pt-8 mt-2">
          {/* Active Logs (Left) */}
          <div className="space-y-4 flex-1">
            {checklist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: item.status === "pending" ? 0.4 : 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3.5"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                  {item.status === "complete" ? (
                    <Check
                      className="w-3.5 h-3.5 text-emerald-500"
                      strokeWidth={3}
                    />
                  ) : item.status === "loading" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className={`w-3.5 h-3.5 ${config.accent}`} />
                    </motion.div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  )}
                </div>
                <span
                  className={`text-[12px] md:text-[13px] font-bold tracking-wide ${item.status === "complete" ? "text-slate-400 line-through" : "text-slate-700"}`}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Rapid Data Counters (Right) */}
          <div className="flex flex-col items-end text-right gap-6">
            {dataIndicators.map((ind, idx) => (
              <div key={idx} className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-2">
                  {ind.text}
                </span>
                <span
                  className={`text-[22px] md:text-[26px] font-black tabular-nums tracking-tighter leading-none ${ind.active ? config.accent : "text-slate-300 drop-shadow-sm"}`}
                >
                  {ind.active ? ind.count.toLocaleString() : "---"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ Specialized Engine Wrappers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */

function MatchingEngineScreen({ onFinish }: { onFinish?: () => void }) {
  const config: EngineConfig = {
    title: "Global Matchmaker",
    titles: [
      "Scoping Universities...",
      "Mapping Eligibility...",
      "Optimizing Success...",
    ],
    checklist: [
      { id: 1, text: "Course Req Mapped", status: "loading" },
      { id: 2, text: "Budget Alignment Check", status: "pending" },
      { id: 3, text: "Profile Weights Sync", status: "pending" },
    ],
    indicators: [
      { text: "Index Scanned", count: 124500, active: true },
      { text: "Models Active", count: 12, active: false },
    ],
    icon: Search,
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-500",
    glow: "bg-blue-500/20",
    accent: "text-blue-500",
    statusText: "AbroadLift Neural Core Online",
  };
  return <GenericEngineScreen config={config} onFinish={onFinish} />;
}

function FinancialEngineScreen({ onFinish }: { onFinish?: () => void }) {
  const config: EngineConfig = {
    title: "Fiscal Projection Oracle",
    titles: [
      "Fetching Live FX...",
      "Modeling Inflation...",
      "Scaling Living Costs...",
    ],
    checklist: [
      { id: 1, text: "Live NPR conversion", status: "loading" },
      { id: 2, text: "3-Year tuition matrix", status: "pending" },
      { id: 3, text: "Rent database indexing", status: "pending" },
    ],
    indicators: [
      { text: "Rate Scanned", count: 138.45, active: true },
      { text: "Categories", count: 42, active: false },
    ],
    icon: Calculator,
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
    glow: "bg-emerald-500/20",
    accent: "text-emerald-400",
    statusText: "Geo-Financial Engine Processing",
  };
  return <GenericEngineScreen config={config} onFinish={onFinish} />;
}

function AdmissionEngineScreen({ onFinish }: { onFinish?: () => void }) {
  const config: EngineConfig = {
    title: "Admission Probability engine",
    titles: [
      "Analyzing GPA Signals...",
      " intake Trending...",
      "Scoring profile...",
    ],
    checklist: [
      { id: 1, text: "CGPA verification", status: "loading" },
      { id: 2, text: "History Benchmark", status: "pending" },
      { id: 3, text: "Risk Assessment", status: "pending" },
    ],
    indicators: [
      { text: "Profiles Scanned", count: 85200, active: true },
      { text: "Signals Weighing", count: 140, active: false },
    ],
    icon: Target,
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
    glow: "bg-indigo-500/20",
    accent: "text-indigo-400",
    statusText: "Eligibility Neural Matrix Active",
  };
  return <GenericEngineScreen config={config} onFinish={onFinish} />;
}

function VisaEngineScreen({ onFinish }: { onFinish?: () => void }) {
  const config: EngineConfig = {
    title: "Visa Oracle engine",
    titles: [
      "Scanning GTE Rules...",
      "Evaluating Solvency...",
      "Interview Simulator...",
    ],
    checklist: [
      { id: 1, text: "Embassy Trends Scanned", status: "loading" },
      { id: 2, text: "Proof of Funds Scale", status: "pending" },
      { id: 3, text: "Success Probability", status: "pending" },
    ],
    indicators: [
      { text: "Approvals Scanned", count: 3200, active: true },
      { text: "Policies Indexed", count: 18, active: false },
    ],
    icon: Shield,
    gradient: "bg-gradient-to-r from-amber-500 to-rose-600",
    glow: "bg-amber-500/20",
    accent: "text-amber-400",
    statusText: "Global Visa Success Modeling",
  };
  return <GenericEngineScreen config={config} onFinish={onFinish} />;
}

function AnalyzingScreen({ onFinish }: { onFinish?: () => void }) {
  return <MatchingEngineScreen onFinish={onFinish} />;
}

/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ Main Component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
export default function AbroadLiftMatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const USD_TO_NPR = 134.5;
  const MATCH_STORAGE_KEY = "abroadlift_match_data";
  const MATCH_PENDING_KEY = "abroadlift_match_pending";
  const RETURN_STEP_KEY = "abroadlift_return_step";
  const [step, setStep] = useState(1);
  const [costPeriod, setCostPeriod] = useState<string>("First Year");
  const [form, setForm] = useState<Form>(DEF);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [transitionType, setTransitionType] = useState<
    "matching" | "finance" | "admission" | "visa" | "roadmap" | "summary" | null
  >(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For Step 3 (Field of Study)
  const [dynamicLivingCost, setDynamicLivingCost] = useState<any>(null);
  const [relocationStats, setRelocationStats] = useState<any>(null);
  const [apiCostEstimate, setApiCostEstimate] = useState<any>(null);
  const liveUsdToNpr = apiCostEstimate?.exchange_rate || USD_TO_NPR;
  const [destinationInsight, setDestinationInsight] = useState<any>(null);
  const [admissionAnalysis, setAdmissionAnalysis] = useState<any>(null);
  const [visaAnalysis, setVisaAnalysis] = useState<any>(null);

  const [availableCountries, setAvailableCountries] = useState<{ code: string; name: string }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
  const [availableLevels, setAvailableLevels] = useState<{ v: string; l: string }[]>([]);
  const [loadingLevels, setLoadingLevels] = useState<boolean>(true);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [availableProgramsByField, setAvailableProgramsByField] = useState<Record<string, string[]>>({});
  const [loadingFields, setLoadingFields] = useState<boolean>(true);
  
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const [hasRestored, setHasRestored] = useState(false);

  // ── Browser history sync: make browser back button go to previous step ──
  const isPopstateNav = useRef(false);

  // Push browser history whenever step changes (skip if change came from popstate)
  useEffect(() => {
    if (isPopstateNav.current) {
      isPopstateNav.current = false;
      return;
    }
    window.history.pushState({ matchStep: step }, "");
  }, [step]);

  // Listen for browser back/forward button
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.matchStep === "number") {
        isPopstateNav.current = true;
        setStep(e.state.matchStep);
      } else {
        // No match step in history — go back one step in the form, or let browser navigate away
        if (step > 1) {
          isPopstateNav.current = true;
          setStep((prev) => Math.max(1, prev - 1));
          // Push current state so further back presses keep working
          window.history.pushState({ matchStep: Math.max(1, step - 1) }, "");
        }
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [step]);

  const saveSelectionState = (match?: Match | null) => {
    const nextMatch = match ?? selectedMatch;
    const nextStep = 8; // Move to Cost Estimation after selection
    localStorage.setItem(
      MATCH_STORAGE_KEY,
      JSON.stringify({
        form,
        step: nextStep,
        selectedMatch: nextMatch,
        matches,
      }),
    );
    localStorage.setItem(RETURN_STEP_KEY, String(nextStep));
    if (nextMatch) {
      localStorage.setItem(MATCH_PENDING_KEY, JSON.stringify(nextMatch));
    }
  };

  const redirectToSignupForMatches = (match?: Match | null) => {
    saveSelectionState(match);
    router.replace(`/register?callbackUrl=${encodeURIComponent("/matches")}`);
  };

  /* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ Shared State / Calc ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
  const financialMetrics = useMemo(() => {
    if (!selectedMatch) return null;

    const usdToNpr = liveUsdToNpr;
    const tuitionUsd = Math.round(
      selectedMatch.currency === "NPR"
        ? (selectedMatch.tuitionFee || 22000) / usdToNpr
        : selectedMatch.tuitionFee || 22000,
    );
    const livingBreakdownUsd = dynamicLivingCost || {
      rent: Math.round(Math.max(tuitionUsd * 0.38, 4200)),
      food: Math.round(Math.max(tuitionUsd * 0.12, 1200)),
      transport: Math.round(Math.max(tuitionUsd * 0.05, 450)),
      insurance: Math.round(Math.max(tuitionUsd * 0.04, 300)),
      other: Math.round(Math.max(tuitionUsd * 0.09, 650)),
    };

    const yearlyLivingUsd = Object.values(
      livingBreakdownUsd as Record<string, number>,
    ).reduce((s, v) => s + v, 0);
    const setupCostsUsd = 1500;
    const graduationDuration =
      selectedMatch.durationYears ||
      parseInt(form.duration) ||
      (form.degree === "Postgraduate" ? 2 : 4);

    const totalYear1Usd = tuitionUsd + yearlyLivingUsd + setupCostsUsd;
    const totalYear1Npr =
      apiCostEstimate?.total_npr || Math.round(totalYear1Usd * usdToNpr);

    const totalTuitionNpr = tuitionUsd * usdToNpr * graduationDuration;
    const totalLivingNpr = yearlyLivingUsd * usdToNpr * graduationDuration;
    const totalDegreeCostNpr =
      totalYear1Npr +
      (tuitionUsd + yearlyLivingUsd) * usdToNpr * (graduationDuration - 1);

    const itemizedMonthly = apiCostEstimate
      ? {
          Education: Math.round(apiCostEstimate.education_npr),
          Rent: Math.round(apiCostEstimate.housing_npr / 12),
          Food: Math.round(apiCostEstimate.food_npr / 12),
          Transport: Math.round(apiCostEstimate.transport_npr / 12),
          Healthcare: Math.round(apiCostEstimate.healthcare_npr / 12),
        }
      : {
          Education: Math.round(tuitionUsd * usdToNpr),
          Rent: Math.round(((livingBreakdownUsd as any).rent * usdToNpr) / 12),
          Food: Math.round(((livingBreakdownUsd as any).food * usdToNpr) / 12),
          Transport: Math.round(
            ((livingBreakdownUsd as any).transport * usdToNpr) / 12,
          ),
          Other: Math.round(
            ((livingBreakdownUsd as any).other * usdToNpr) / 12,
          ),
        };

    const fmtNpr = (v: number) =>
      new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 0,
      }).format(v);
    const fmtLakhs = (v: number) => `NPR ${(v / 100000).toFixed(1)} Lakhs`;

    return {
      tuitionUsd,
      yearlyLivingUsd,
      setupCostsUsd,
      graduationDuration,
      totalYear1Npr,
      totalDegreeCostNpr,
      totalTuitionNpr,
      totalLivingNpr,
      itemizedMonthly,
      fmtNpr,
      fmtLakhs,
      usdToNpr,
    };
  }, [
    selectedMatch,
    form.duration,
    form.degree,
    dynamicLivingCost,
    apiCostEstimate,
  ]);

  const decisionSignals = useMemo(() => {
    if (!selectedMatch || !financialMetrics) return null;

    const budgetRaw = Number.parseFloat(form.budget) || 0;
    const budgetNpr =
      form.currency === "USD"
        ? Math.round(budgetRaw * financialMetrics.usdToNpr)
        : Math.round(budgetRaw);

    const yearOneNeedNpr = financialMetrics.totalYear1Npr;
    const profileScore = getEligibilityScore(form);
    const backlogPenalty = Math.min(18, (Number(form.backlogs) || 0) * 3);
    const gapPenalty = Math.min(12, (Number(form.studyGap) || 0) * 2);

    const parsedTest = Number.parseFloat(form.testScore || "0");
    const englishScoreNorm =
      form.hasEnglishTest === false
        ? 58
        : form.hasEnglishTest === true
          ? (() => {
              if (!Number.isFinite(parsedTest)) return 45;
              switch (form.testType) {
                case "IELTS":
                  return Math.round((parsedTest / 9) * 100);
                case "TOEFL":
                  return Math.round((parsedTest / 120) * 100);
                case "PTE Academic":
                  return Math.round((parsedTest / 90) * 100);
                case "Duolingo":
                  return Math.round((parsedTest / 160) * 100);
                case "GRE":
                  return Math.round((parsedTest / 340) * 100);
                case "SAT":
                  return Math.round((parsedTest / 1600) * 100);
                case "GMAT":
                  return Math.round((parsedTest / 800) * 100);
                default:
                  return 50;
              }
            })()
          : 45;

    const sponsorIncome = Number.parseFloat(form.sponsorIncome || "0");
    const sponsorBoost =
      form.sponsorType === "Family" && sponsorIncome >= 30000
        ? 5
        : form.sponsorType === "Self" && budgetRaw >= 20000
          ? 4
          : 1;

    const academicReadiness = Math.max(
      20,
      Math.min(
        98,
        Math.round(
          profileScore * 0.62 +
            englishScoreNorm * 0.26 +
            sponsorBoost -
            backlogPenalty -
            gapPenalty,
        ),
      ),
    );

    const baselineAdmission = selectedMatch.admissionRate || 60;
    const admissionConfidence =
      admissionAnalysis?.admissionPct ??
      Math.max(
        30,
        Math.min(
          96,
          Math.round(baselineAdmission * 0.55 + academicReadiness * 0.45),
        ),
      );

    const budgetCoverage = Math.max(
      20,
      Math.min(
        190,
        Math.round((budgetNpr / Math.max(1, yearOneNeedNpr)) * 100),
      ),
    );

    const docsReadyCount = [
      !!form.passportReady,
      !!form.docsReady,
      !!form.testDone,
      !!form.passingYear,
    ].filter(Boolean).length;
    const docReadiness = Math.round((docsReadyCount / 4) * 100);

    const qualityOfLifeIndex = Number(
      relocationStats?.quality_of_life_index ??
        relocationStats?.quality_index ??
        relocationStats?.quality_of_life ??
        relocationStats?.qualityOfLifeIndex ??
        NaN,
    );
    const safetyIndex = Number(
      relocationStats?.safety_index ?? relocationStats?.safety ?? NaN,
    );
    const healthcareIndex = Number(
      relocationStats?.healthcare_index ?? relocationStats?.healthcare ?? NaN,
    );
    const climateIndex = Number(
      relocationStats?.climate_index ?? relocationStats?.climate ?? NaN,
    );

    const qualitySignals = [
      qualityOfLifeIndex,
      safetyIndex,
      healthcareIndex,
      climateIndex,
    ].filter((value) => Number.isFinite(value));

    const destinationFit = Math.round(
      qualitySignals.length > 0
        ? qualitySignals.reduce((sum, value) => sum + value, 0) /
            qualitySignals.length
        : 62,
    );

    const visaConfidence =
      visaAnalysis?.successChance ??
      Math.max(
        25,
        Math.min(
          97,
          Math.round(
            academicReadiness * 0.34 +
              admissionConfidence * 0.24 +
              Math.min(100, budgetCoverage) * 0.32 +
              docReadiness * 0.1,
          ),
        ),
      );

    const overallConfidence = Math.max(
      25,
      Math.min(
        97,
        Math.round(
          admissionConfidence * 0.35 +
            visaConfidence * 0.35 +
            Math.min(100, budgetCoverage) * 0.2 +
            destinationFit * 0.1,
        ),
      ),
    );

    const budgetStressBand =
      budgetCoverage >= 115
        ? "low"
        : budgetCoverage >= 85
          ? "moderate"
          : "high";
    const counselorVerdict =
      admissionAnalysis?.summary ||
      (overallConfidence >= 78 && budgetStressBand !== "high"
        ? "Strong Proceed"
        : overallConfidence >= 62
          ? "Proceed With Conditions"
          : "Refine Profile First");

    return {
      admissionConfidence,
      visaConfidence,
      overallConfidence,
      academicReadiness,
      budgetCoverage,
      budgetStressBand,
      destinationFit,
      counselorVerdict,
      docReadiness,
      yearOneNeedNpr,
      budgetNpr,
    };
  }, [
    form,
    selectedMatch,
    financialMetrics,
    relocationStats,
    admissionAnalysis,
    visaAnalysis,
  ]);

  const handleSavePlan = async () => {
    if (!selectedMatch) return;
    setSaving(true);
    try {
      const response = await fetch("/api/matches/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: form, matchData: selectedMatch }),
      });
      if (response.ok) {
        // Redirect to dashboard or show success
        window.location.href = "/dashboard";
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save plan");
      }
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Persistence logic
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isNewSearch = searchParams.get("new") === "true";

    if (isNewSearch) {
      localStorage.removeItem(MATCH_STORAGE_KEY);
      localStorage.removeItem(RETURN_STEP_KEY);
      localStorage.removeItem(MATCH_PENDING_KEY);
      setForm(DEF);
      setSelectedMatch(null);
      setStep(1);
      setHasRestored(true);
      return;
    }

    const pendingStep = localStorage.getItem(RETURN_STEP_KEY);
    const saved = localStorage.getItem(MATCH_STORAGE_KEY);
    let restoredStep = 1;
    let restoredMatch = null;
    let restoredMatches = [];

    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.form) setForm(data.form);
        if (data.selectedMatch) restoredMatch = data.selectedMatch;
        if (data.matches) restoredMatches = data.matches;
        if (data.step) restoredStep = data.step;
      } catch (e) {
        console.error("Failed to load match data", e);
      }
    }

    if (restoredMatch) {
      setSelectedMatch(restoredMatch);
      setMatches(restoredMatches);
      setStep(8);
    } else {
      if (pendingStep) {
        const fallbackStep = Number.parseInt(pendingStep, 10);
        setStep(Number.isNaN(fallbackStep) ? 8 : fallbackStep);
      } else {
        setStep(restoredStep);
      }
      if (restoredMatch) setSelectedMatch(restoredMatch);
      if (restoredMatches.length > 0) setMatches(restoredMatches);
    }
    setHasRestored(true);
  }, []);

  // Fetch unique countries dynamically from /api/schools for Step 1
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await fetch("/api/schools?allCountries=true");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setAvailableCountries(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load countries from /api/schools:", err);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch unique study levels dynamically from /api/programs for Step 2
  useEffect(() => {
    const fetchLevels = async () => {
      setLoadingLevels(true);
      try {
        const res = await fetch("/api/programs?allLevels=true");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setAvailableLevels(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load levels from /api/programs:", err);
      } finally {
        setLoadingLevels(false);
      }
    };

    fetchLevels();
  }, []);

  // Fetch unique study fields & programs dynamically from /api/programs for Step 3
  useEffect(() => {
    const fetchFieldsAndPrograms = async () => {
      setLoadingFields(true);
      try {
        const url = form.degree
          ? `/api/programs?allFieldsAndPrograms=true&level=${form.degree}`
          : "/api/programs?allFieldsAndPrograms=true";
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (Array.isArray(json.data.fields)) {
              setAvailableFields(json.data.fields);
            } else {
              setAvailableFields([]);
            }
            if (json.data.programsByField) {
              setAvailableProgramsByField(json.data.programsByField);
            } else {
              setAvailableProgramsByField({});
            }
          }
        }
      } catch (err) {
        console.error("Failed to load fields and programs from /api/programs:", err);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFieldsAndPrograms();
  }, [form.degree]);

  // Resume saved step after login/signup if flag is set
  useEffect(() => {
    if (status === "authenticated") {
      const pendingStep = localStorage.getItem(RETURN_STEP_KEY);
      if (!pendingStep) {
        return;
      }

      const resumeToStep = async (targetStep: number) => {
        if (targetStep === 8) {
          setTransitionType("finance");
        }
        setStep(targetStep);

        // Auto-save the selected match if resuming to step 8
        if (targetStep === 8) {
          const saved = localStorage.getItem(MATCH_STORAGE_KEY);
          if (saved) {
            try {
              const data = JSON.parse(saved);
              if (data.form && data.selectedMatch) {
                await fetch("/api/matches/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ formData: data.form, matchData: data.selectedMatch }),
                });
              }
            } catch (e) {
              console.error("Failed to auto-save match on resume", e);
            }
          }
        }
      };

      localStorage.removeItem(RETURN_STEP_KEY);

      const saved = localStorage.getItem(MATCH_STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (typeof data.step === "number") {
            resumeToStep(data.step);
            return;
          }
        } catch {
          // Ignore malformed data and fall back to pending step.
        }
      }

      const fallbackStep = Number.parseInt(pendingStep, 10);
      resumeToStep(Number.isNaN(fallbackStep) ? 8 : fallbackStep);
    }
  }, [status]);

  useEffect(() => {
    if (!hasRestored) return;
    const data = { form, step, selectedMatch, matches };
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(data));
  }, [form, step, selectedMatch, matches, hasRestored]);

  useEffect(() => {
    if (step >= 8 && !session && status !== "loading") {
      setStep(7);
    }
  }, [step, session, status]);

  useEffect(() => {
    if (step === 8 && selectedMatch) {
      setDynamicLivingCost(null);
      setRelocationStats(null);
      setDestinationInsight(null);
      const code = selectedMatch.countryCode || form.countries[0] || "AU";
      const city = selectedMatch.location?.split(",")[0] || "New York";

      // Cost of Living
      fetch(`/api/cost-of-living?countryCode=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.breakdown) {
            setDynamicLivingCost(data.breakdown);
          }
        })
        .catch(console.error);

      // Relocation Index
      fetch(`/api/relocation-index?countryCode=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setRelocationStats(data);
          }
        })
        .catch(console.error);

      // Destination Insight (weather + timezone + distance)
      fetch(
        `/api/destination-insight?country=${code}&city=${encodeURIComponent(city)}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setDestinationInsight(data);
          }
        })
        .catch(console.error);

      // Full Cost Estimate API call
      const tuitionUsdRaw =
        selectedMatch.currency === "NPR"
          ? (selectedMatch.tuitionFee || 22000) / liveUsdToNpr
          : selectedMatch.tuitionFee || 22000;
      fetch(
        `/api/cost-estimate?country=${code}&city=${encodeURIComponent(city)}&tuition_usd=${Math.round(tuitionUsdRaw)}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setApiCostEstimate(data);
        })
        .catch(console.error);
    }
  }, [step, selectedMatch, form.countries]);

  useEffect(() => {
    if (!selectedMatch || step < 7) {
      setAdmissionAnalysis(null);
      setVisaAnalysis(null);
      return;
    }

    let active = true;

    const loadAnalyses = async () => {
      try {
        const [admissionRes, visaRes] = await Promise.all([
          fetch("/api/admission-chance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ form, match: selectedMatch }),
          }),
          fetch("/api/visa-prediction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ form, match: selectedMatch }),
          }),
        ]);

        const [admissionData, visaData] = await Promise.all([
          admissionRes.json(),
          visaRes.json(),
        ]);

        if (!active) return;

        if (!admissionData?.error) setAdmissionAnalysis(admissionData);
        if (!visaData?.error) setVisaAnalysis(visaData);
      } catch (error) {
        console.error("Failed to load match analyses", error);
      }
    };

    loadAnalyses();

    return () => {
      active = false;
    };
  }, [form, selectedMatch, step]);

  const isFormCompleteForSteps1To6 = (f: any) => {
    if (!f.countries || f.countries.length === 0) return false;
    if (!f.degree) return false;
    if (!f.field || !f.program) return false;
    if (!f.highestEducation || !f.educationStatus || !f.gpa || !f.passingYear) return false;
    const gpa = parseFloat(f.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) return false;
    if (f.hasEnglishTest === null) return false;
    if (f.hasEnglishTest === true) {
      if (!f.testType || !f.testScore || f.testType === "NONE") return false;
      const score = parseFloat(f.testScore);
      if (isNaN(score)) return false;
    }
    if (!f.intake) return false;
    return true;
  };

  const getFirstIncompleteStep = (f: any) => {
    if (!f.countries || f.countries.length === 0) return 1;
    if (!f.degree) return 2;
    if (!f.field || !f.program) return 3;
    if (!f.highestEducation || !f.educationStatus || !f.gpa || !f.passingYear) return 4;
    const gpa = parseFloat(f.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) return 4;
    if (f.hasEnglishTest === null) return 5;
    if (f.hasEnglishTest === true) {
      if (!f.testType || !f.testScore || f.testType === "NONE") return 5;
      const score = parseFloat(f.testScore);
      if (isNaN(score)) return 5;
    }
    if (!f.intake) return 6;
    return 1;
  };

  useEffect(() => {
    if (step === 8 && !selectedMatch && hasRestored && status === "authenticated") {
      if (isFormCompleteForSteps1To6(form)) {
        setStep(7);
      } else {
        setStep(getFirstIncompleteStep(form));
      }
    }
  }, [step, selectedMatch, form, hasRestored, status]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchProfileData = async () => {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const data = await res.json();
            const p = data.profile || {};

            // Check if starting a new search
            const searchParams = new URLSearchParams(window.location.search);
            const isNewSearch = searchParams.get("new") === "true";

            if (isNewSearch) {
              setForm({
                ...DEF,
                name: data.name || "",
                email: data.email || "",
              });
              setSelectedMatch(null);
              setStep(1);
              return; // Bypass DB restoration completely
            }

            // Check if there is an explicit profileId in the URL
            const urlProfileId = searchParams.get("profileId");

            if (urlProfileId) {
              let matchedRecord = data.matchingRecords?.find((r: any) => r.id === urlProfileId);

              if (!matchedRecord) {
                try {
                  const recordRes = await fetch(`/api/matches/save?id=${urlProfileId}`);
                  if (recordRes.ok) {
                    matchedRecord = await recordRes.json();
                  }
                } catch (e) {
                  console.error("Failed to fetch specific profile from DB", e);
                }
              }

              if (matchedRecord) {
                const dbForm = matchedRecord.formData;
                const dbMatch = matchedRecord.matchData;
                if (dbForm) {
                  setForm((prev) => ({
                    ...prev,
                    name: data.name || prev.name,
                    email: data.email || prev.email,
                    ...dbForm,
                  }));
                }
                if (dbMatch) {
                  setSelectedMatch(dbMatch);
                  setStep(8);
                  if (dbForm) {
                    void runMatch(dbForm as any);
                  }
                  return; // Loaded specific saved profile, skip default loading
                }
              }
            }

            // Check if there is an active session in local storage first
            const saved = localStorage.getItem(MATCH_STORAGE_KEY);
            let hasRestoredMatch = false;
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (parsed.selectedMatch) {
                  hasRestoredMatch = true;
                }
              } catch (e) {}
            }

            if (hasRestoredMatch) {
              return; // Keep existing localStorage state, skip database sync
            }

            // Fall back to original behavior: check matching records in database first (latest record)
            if (data.matchingRecords && data.matchingRecords.length > 0) {
              const latestRecord = data.matchingRecords[0];
              const dbForm = latestRecord.formData;
              const dbMatch = latestRecord.matchData;
              
              if (dbForm) {
                setForm((prev) => ({
                  ...prev,
                  name: data.name || prev.name,
                  email: data.email || prev.email,
                  ...dbForm,
                }));
              }
              if (dbMatch) {
                setSelectedMatch(dbMatch);
                setStep(8);
                if (dbForm) {
                  void runMatch(dbForm as any);
                }
                return; // Direct display step 8
              }
            }

            const loadedForm = {
              name: data.name || "",
              email: data.email || "",
              nationality: p.nationality || "",
              currentCountry: p.currentCountry || "",
              highestEducation: p.highestEducation || "",
              passingYear: p.passingYear || "",
              gpa: p.gpa?.toString() || "",
              backlogs: p.backlogs?.toString() || "0",
              studyGap: p.studyGap?.toString() || "0",
              testType: p.testType || "IELTS",
              testScore: p.englishScore?.toString() || "",
              aptitudeTest: p.aptitudeTest || "NONE",
              greVerbal: p.greVerbal?.toString() || "",
              greQuant: p.greQuant?.toString() || "",
              greAwa: p.greAwa?.toString() || "",
              gmatTotal: p.gmatTotal?.toString() || "",
              degree: p.degreeLevel || "",
              field: p.field || "",
              program: p.program || "",
              intake: p.intake || "",
              budget: p.yearlyBudget?.toString() || "",
              bankBalance: p.bankBalance?.toString() || "",
              sponsorType: p.sponsorType || "Self",
              sponsorIncome: p.sponsorIncome?.toString() || "",
              duration: p.duration?.toString() || "3",
              scholarship: !!p.scholarshipNeeded,
              testDone: !!p.testDone,
              docsReady: !!p.docsReady,
              countries: p.preferredCountry ? [p.preferredCountry] : [],
              hasEnglishTest: p.hasEnglishTest ?? null,
            };

            setForm((prev) => ({
              ...prev,
              ...loadedForm,
            }));

            // Direct access step 8 (Cost Calculation) or first incomplete step if already partially filled
            if (isFormCompleteForSteps1To6(loadedForm)) {
              runMatch(loadedForm as any).then((generatedMatches) => {
                if (generatedMatches && generatedMatches.length > 0) {
                  // Auto-select the top match and proceed to Cost Calculation
                  setSelectedMatch(generatedMatches[0]);
                  setStep(8);
                } else {
                  setStep(7);
                }
              });
            } else {
              const resumeStep = getFirstIncompleteStep(loadedForm);
              setStep(resumeStep);
            }
          }
        } catch (e) {
          console.error("Failed to load profile", e);
        }
      };
      fetchProfileData();
    }
  }, [status]);

  const updateForm = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "passingYear" && typeof v === "string") {
        const passingVal = parseInt(v);
        const intakeVal = parseInt(prev.intakeYear);
        if (!isNaN(passingVal) && !isNaN(intakeVal) && intakeVal < passingVal) {
          next.intakeYear = "";
        }
      }
      return next;
    });

  const toggleCountry = (code: string) => {
    setForm((prev) => ({
      ...prev,
      countries: prev.countries.includes(code) ? [] : [code],
    }));
  };

  const canContinue = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.countries.length > 0;
    if (step === 2) return !!form.degree;
    if (step === 3) return !!form.field && !!form.program;
    if (step === 4) {
      if (!form.highestEducation || !form.educationStatus || !form.gpa || !form.passingYear)
        return false;
      const gpa = parseFloat(form.gpa);
      return !isNaN(gpa) && gpa >= 0 && gpa <= 4.0;
    }
    if (step === 5) {
      if (form.hasEnglishTest === false) {
        if (!form.plannedTestType) return true;
        if (!form.plannedTestScore) return false;
        const pScore = parseFloat(form.plannedTestScore);
        if (isNaN(pScore)) return false;
        switch (form.plannedTestType) {
          case "IELTS":
            return pScore >= 1 && pScore <= 9;
          case "PTE":
            return pScore >= 10 && pScore <= 90;
          case "TOEFL":
            return pScore >= 0 && pScore <= 120;
          case "Duolingo":
            return pScore >= 10 && pScore <= 160;
          default:
            return true;
        }
      }
      if (form.hasEnglishTest === true) {
        if (!form.testType || !form.testScore || form.testType === "NONE")
          return false;
        const score = parseFloat(form.testScore);
        if (isNaN(score)) return false;
        switch (form.testType) {
          case "IELTS":
            return score >= 1 && score <= 9;
          case "SAT":
            return score >= 400 && score <= 1600;
          case "GRE":
            return score >= 260 && score <= 340;
          case "Duolingo":
            return score >= 10 && score <= 160;
          case "PTE Academic":
            return score >= 10 && score <= 90;
          case "TOEFL":
            return score >= 0 && score <= 120;
          case "GMAT":
            return score >= 200 && score <= 800;
          default:
            return true;
        }
      }
      return false;
    }
    if (step === 6) return !!form.intake;
    if (step === 7) return !!selectedMatch;
    if (step === 8) return true;
    if (step === 9) return true;
    if (step === 10) return true;
    if (step === 11) return true;
    if (step === 12) return true;
    if (step === 13) return true;
    if (step === 14) return true;
    return false;
  };

  const handleNext = async () => {
    // Save progress to profile database on every step transition if authenticated
    if (status === "authenticated" && step < 7) {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(console.error);
    }

    if (step === 8) {
      setStep(9);
      return;
    }
    if (step === 9) {
      setTransitionType("admission");
      setStep(10);
      return;
    }
    if (step === 10) {
      setTransitionType("visa");
      setStep(11);
      return;
    }
    if (step === 11) {
      setTransitionType("roadmap");
      setStep(12);
      return;
    }
    if (step === 12) {
      setTransitionType("summary");
      setStep(13);
      return;
    }
    if (step === 13) {
      setStep(14);
      return;
    }
    if (step === 14) {
      return;
    }
    if (step === 6) {
      setTransitionType("matching");
      setStep(7);
      await runMatch();
      setTransitionType(null);

      if (status === "authenticated") {
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }).catch(console.error);
      }
    } else if (step === 7) {
      if (!session) {
        redirectToSignupForMatches(selectedMatch);
        return;
      }
      setTransitionType("finance");
      setStep(8);
    } else if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const runMatch = async (formParam?: Form) => {
    const activeForm = formParam || form;
    setLoading(true);
    setError("");
    setMatches([]);
    try {
      const query = new URLSearchParams({
        countries: activeForm.countries.join(","),
        budget: activeForm.budget || "0",
        englishScore: activeForm.testScore || "0",
        degreeLevel: activeForm.degree,
        field: activeForm.field || "",
        program: activeForm.program || "",
      });
      const res = await fetch(`/api/matches?${query}`);
      if (!res.ok)
        throw new Error("Our matching engine is temporarily overloaded.");
      const data = await res.json();

      const nextMatches = data.matches || [];
      setMatches(nextMatches);
      return nextMatches;
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching matches.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  function getEligibilityScore(f: Form) {
    let score = 0;

    const eng = parseFloat(f.testScore) || 0;
    if (f.testType === "IELTS") {
      if (eng >= 7.5) score += 30;
      else if (eng >= 7.0) score += 25;
      else if (eng >= 6.5) score += 20;
      else if (eng >= 6.0) score += 15;
      else score += 5;
    } else if (f.testType === "TOEFL") {
      if (eng >= 100) score += 30;
      else if (eng >= 90) score += 25;
      else if (eng >= 80) score += 20;
      else score += 10;
    } else {
      if (eng >= 70) score += 30;
      else if (eng >= 60) score += 20;
      else score += 10;
    }

    if (f.aptitudeTest === "GRE") {
      const total =
        (parseInt(f.greVerbal) || 130) + (parseInt(f.greQuant) || 130);
      if (total >= 320) score += 25;
      else if (total >= 310) score += 20;
      else if (total >= 300) score += 15;
      else score += 5;
    } else if (f.aptitudeTest === "GMAT") {
      const total = parseInt(f.gmatTotal) || 200;
      if (total >= 700) score += 25;
      else if (total >= 650) score += 20;
      else if (total >= 600) score += 15;
      else score += 5;
    } else {
      score += 15;
    }

    let acad = 0;
    const gpa = parseFloat(f.gpa) || 3.0;
    if (gpa >= 3.8) acad = 25;
    else if (gpa >= 3.5) acad = 20;
    else if (gpa >= 3.0) acad = 15;
    else acad = 10;

    const bk = parseInt(f.backlogs) || 0;
    if (bk > 0) acad = Math.max(0, acad - bk * 2);
    score += acad;

    const bal = parseInt(f.bankBalance) || 0;
    if (bal >= 6000000) score += 20;
    else if (bal >= 4000000) score += 15;
    else if (bal >= 2000000) score += 10;
    else score += 5;

    return Math.min(100, score);
  }

  const getRateBand = (value: number) => {
    if (value >= 80) {
      return {
        label: "High Chance",
        colorName: "Green",
        badgeClass: "bg-emerald-50 text-emerald-700",
      };
    }
    if (value >= 50) {
      return {
        label: "Moderate Chance",
        colorName: "Yellow",
        badgeClass: "bg-amber-50 text-amber-700",
      };
    }
    return {
      label: "Low Chance",
      colorName: "Red",
      badgeClass: "bg-rose-50 text-rose-700",
    };
  };

  const getCostBand = (year1Usd: number, budgetUsd: number) => {
    if (budgetUsd > 0) {
      const ratio = year1Usd / budgetUsd;
      if (ratio <= 0.9) {
        return {
          label: "Low Cost",
          colorName: "Green",
          badgeClass: "bg-emerald-50 text-emerald-700",
        };
      }
      if (ratio <= 1.2) {
        return {
          label: "Moderate Cost",
          colorName: "Yellow",
          badgeClass: "bg-amber-50 text-amber-700",
        };
      }
      return {
        label: "High Cost",
        colorName: "Red",
        badgeClass: "bg-rose-50 text-rose-700",
      };
    }

    if (year1Usd <= 18000) {
      return {
        label: "Low Cost",
        colorName: "Green",
        badgeClass: "bg-emerald-50 text-emerald-700",
      };
    }
    if (year1Usd <= 28000) {
      return {
        label: "Moderate Cost",
        colorName: "Yellow",
        badgeClass: "bg-amber-50 text-amber-700",
      };
    }
    return {
      label: "High Cost",
      colorName: "Red",
      badgeClass: "bg-rose-50 text-rose-700",
    };
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 w-full max-w-2xl mx-auto pb-4">
          <div className="mb-4 text-center px-4">
            <h2 className="text-[20px] font-bold text-[#111827] mb-1.5 tracking-tight">
              Where do you want to study?
            </h2>
            <p className="text-[#64748b] text-[13px] leading-snug font-medium max-w-sm mx-auto">
              We&apos;ll match universities and estimate your cost &amp; visa
              chances
            </p>
          </div>

          {/* Hero image — small on mobile, taller on desktop */}
          <div className="w-full mb-6 overflow-hidden rounded-[24px] shadow-sm border border-slate-50 lg:hidden">
            <Image
              src="/country.png"
              alt="Destinations"
              width={800}
              height={400}
              className="w-full h-[140px] md:h-[180px] lg:h-[200px] object-cover"
              priority
            />
          </div>

          <div className="w-full px-2 sm:px-4 overflow-visible">
            {loadingCountries && availableCountries.length === 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-2 sm:gap-x-4 w-full">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col items-center gap-2 animate-pulse w-full">
                    <div className="w-[58px] h-[42px] sm:w-[80px] sm:h-[58px] rounded-[14px] sm:rounded-[20px] bg-slate-100 border border-slate-50" />
                    <div className="h-3 w-12 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-2 sm:gap-x-4 w-full">
                {(availableCountries.length > 0 ? availableCountries : COUNTRIES).map((c: any) => {
                  const isSel = form.countries.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, countries: [c.code] }));
                      }}
                      className="group flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 w-full"
                    >
                      <div
                        className={`relative w-[58px] h-[42px] sm:w-[80px] sm:h-[58px] rounded-[14px] sm:rounded-[20px] overflow-hidden bg-white flex items-center justify-center p-[2px] transition-all ${
                          isSel
                            ? "ring-[2.5px] ring-blue-500 shadow-lg transform scale-[1.05]"
                            : "shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-50 hover:border-blue-200"
                        }`}
                      >
                        <div className="w-full h-full rounded-[12px] sm:rounded-[18px] overflow-hidden">
                          <FlagIcon
                            countryCode={c.code}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <span
                        className={`text-[11px] sm:text-[13px] font-[600] text-center tracking-tight transition-colors ${
                          isSel ? "text-blue-600" : "text-[#475569]"
                        }`}
                      >
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (step === 2) {
      const DISPLAY_DEGREES = [
        { v: "bachelor-4", l: "Bachelor's Degree", icon: GraduationCap },
        {
          v: "associate-foundation",
          l: "Associate Degree (or equivalent foundation program)",
          icon: Award,
        },
        { v: "masters", l: "Master's Degree", icon: BookOpen },
        { v: "doctorate", l: "PHD Degree", icon: BookOpen },
        { v: "undergrad-dip-2", l: "Diploma", icon: Award },
      ];

      const getDegreeIcon = (value: string) => {
        const v = value.toLowerCase();
        if (v.includes("master")) return BookOpen;
        if (v.includes("bachelor")) return GraduationCap;
        if (v.includes("doctor") || v.includes("phd")) return Microscope;
        if (v.includes("diploma")) return Award;
        if (v.includes("cert")) return FileCheck;
        if (v.includes("english") || v.includes("esl")) return Globe;
        if (v.includes("grade")) return AlignLeft;
        return Award;
      };

      const getLevelCategory = (value: string) => {
        const v = value.toLowerCase();
        if (v.includes("master") || v.includes("doctor") || v.includes("phd") || v.includes("pg") || v.includes("post_graduate")) {
          return "Postgraduate & Higher Education";
        }
        if (v.includes("bachelor") || v.includes("diploma") || v.includes("undergrad") || v.includes("certificate") || v.includes("associate")) {
          return "Undergraduate & Diplomas";
        }
        if (v.includes("english") || v.includes("esl")) {
          return "Language & Preparation";
        }
        if (v.includes("grade")) {
          return "Schooling & Secondary Education";
        }
        return "Other Programs";
      };

      const levelsToDisplay = (availableLevels.length > 0 ? availableLevels : DISPLAY_DEGREES)
        .filter((d: any) => getLevelCategory(d.v) !== "Schooling & Secondary Education");

      const categoryOrder = [
        "Postgraduate & Higher Education",
        "Undergraduate & Diplomas",
        "Language & Preparation",
        "Other Programs"
      ];

      // Group levels by category
      const groups: Record<string, any[]> = {};
      levelsToDisplay.forEach((d: any) => {
        const cat = d.cat || getLevelCategory(d.v);
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(d);
      });

      const activeCategories = categoryOrder.filter((cat) => groups[cat] && groups[cat].length > 0);

      return (
        <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-5xl mx-auto pb-2 px-4">
          <div className="mb-3 md:mb-6 text-center">
            <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#111827] tracking-tight">
              What level of study are you planning?
            </h2>
          </div>

          <div className="w-full mb-6 md:mb-8 overflow-hidden rounded-[24px] shadow-sm border border-slate-50 lg:hidden">
            <Image
              src="/abrd.png"
              alt="Study Level"
              width={800}
              height={400}
              className="w-full h-[140px] md:h-[180px] object-cover"
              priority
            />
          </div>

          {loadingLevels && availableLevels.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4 lg:gap-5 w-full">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex items-center gap-4 md:gap-6 px-5 md:px-8 py-3.5 md:py-5 rounded-[18px] md:rounded-[22px] bg-slate-50 border border-slate-100 animate-pulse h-[76px] md:h-[94px] w-full"
                >
                  <div className="shrink-0 w-[40px] h-[40px] md:w-[52px] md:h-[52px] rounded-xl bg-slate-100 border border-slate-100" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8 w-full">
              {activeCategories.map((categoryName) => (
                <div key={categoryName} className="space-y-4">
                  <div className="flex items-center gap-3 pt-2">
                    <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {categoryName}
                    </h3>
                    <div className="h-px bg-slate-100 flex-grow" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4 lg:gap-5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {groups[categoryName].map((d: any) => {
                      const isSel = form.degree === d.v;
                      const Icon = d.icon || getDegreeIcon(d.v);
                      return (
                        <button
                          key={d.v}
                          onClick={() => updateForm("degree", d.v)}
                          className={`group relative flex items-center gap-4 md:gap-6 px-5 md:px-8 py-3.5 md:py-5 rounded-[18px] md:rounded-[22px] border transition-all duration-300 ${
                            isSel
                              ? "border-blue-500 bg-white shadow-lg shadow-blue-500/5 -translate-y-0.5"
                              : "border-slate-100 bg-white shadow-sm hover:border-blue-200"
                          }`}
                        >
                          <div
                            className={`shrink-0 w-[40px] h-[40px] md:w-[52px] md:h-[52px] rounded-xl flex items-center justify-center transition-all border ${
                              isSel
                                ? "bg-white text-slate-900 border-blue-500 shadow-sm"
                                : "bg-slate-50 text-slate-400 border-slate-100"
                            }`}
                          >
                            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                          </div>
                          <span
                            className={`text-[15px] md:text-[17px] font-semibold text-left ${
                              isSel ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {d.l}
                          </span>
                          {isSel && (
                            <div className="ml-auto w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (step === 3) {
      const fieldsToDisplay = availableFields.length > 0 ? availableFields : FIELDS.map((f) => f.v);
      const programsMapToUse = Object.keys(availableProgramsByField).length > 0 ? availableProgramsByField : PROGRAMS;

      const filteredFields = fieldsToDisplay.filter((f) => {
        const matchesField = f.toLowerCase().includes(searchQuery.toLowerCase());
        const programs = programsMapToUse[f] || [];
        const matchesProgram = programs.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesField || matchesProgram;
      });

      return (
        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-700 w-full max-w-5xl mx-auto pb-2 px-4">
          <div className="mb-3 md:mb-6 text-center">
            <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#111827] tracking-tight">
              What do you want to study?
            </h2>
          </div>

          <div className="w-full mb-6 md:mb-8 overflow-hidden rounded-[24px] shadow-sm border border-slate-50 lg:hidden">
            <Image
              src="/studies.png"
              alt="Field of Study"
              width={800}
              height={400}
              className="w-full h-[140px] md:h-[180px] object-cover"
              priority
            />
          </div>

          <div className="sticky top-[60px] md:top-[70px] z-20 bg-white/95 backdrop-blur-sm pb-3 md:pb-0 md:relative md:top-auto md:z-auto md:bg-transparent md:backdrop-blur-none mb-3 md:mb-8 max-w-2xl mx-auto w-full">
            <div className="relative">
              <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <input
                type="text"
                placeholder={"“Search study courses”"}
                className="w-full h-[48px] md:h-[60px] pl-11 md:pl-14 pr-4 bg-[#f8fafc] border border-slate-200 rounded-[16px] md:rounded-[20px] text-[14px] md:text-[16px] font-medium text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loadingFields && availableFields.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4 w-full animate-in fade-in duration-300">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="w-full h-[50px] md:h-[64px] px-5 md:px-8 flex items-center justify-between rounded-[16px] md:rounded-[22px] bg-slate-50 border border-slate-100 animate-pulse"
                >
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4 w-full">
              {filteredFields.map((f) => {
                const isSel = form.field === f;
                return (
                  <div
                    key={f}
                    className={`transition-all duration-500 ${isSel ? "md:col-span-2" : ""}`}
                  >
                    <button
                      onClick={() => {
                        updateForm("field", isSel ? "" : f);
                        updateForm("program", "");
                      }}
                      className={`w-full h-[50px] md:h-[64px] px-5 md:px-8 flex items-center justify-between rounded-[16px] md:rounded-[22px] border transition-all duration-300 ${
                        isSel
                          ? "border-blue-500 bg-white shadow-lg shadow-blue-500/5 -translate-y-0.5"
                          : "border-slate-100 bg-white shadow-sm hover:border-blue-200"
                      }`}
                    >
                      <span
                        className={`text-[14px] md:text-[16px] font-semibold ${isSel ? "text-slate-900" : "text-slate-700"}`}
                      >
                        {f}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 md:w-5 md:h-5 text-slate-400 transition-transform duration-300 ${isSel ? "rotate-180 text-blue-500" : ""}`}
                      />
                    </button>

                    {isSel && (
                      <div className="mt-2 md:mt-3 p-2 md:p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-50/50 rounded-[18px] md:rounded-[24px] border border-slate-100">
                        {(
                          (programsMapToUse[f] || []) as string[]
                        ).map((p) => (
                          <button
                            key={p}
                            onClick={() => updateForm("program", p)}
                            className={`w-full text-left px-4 md:px-5 py-2.5 md:py-3.5 rounded-[12px] md:rounded-[16px] text-[13px] md:text-[14px] font-semibold transition-all ${
                              form.program === p
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-600 hover:bg-white hover:shadow-sm"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    if (step === 4) {
      const isPostGrad = [
        "masters_degree",
        "doctoral_phd",
        "post_graduate_diploma",
        "post_graduate_certificate",
        "integrated_masters",
      ].includes(form.degree);

      const EDUCATION_LEVELS = isPostGrad
        ? ["Bachelor's Degree", "Master's Degree", "Integrated Master's"]
        : [
            "10th Grade / SLC",
            "12th Grade / +2 / HSEB",
            "3-Year Diploma",
            "Bachelor's Degree",
          ];

      const currentYear = new Date().getFullYear();
      const YEARS = form.educationStatus === "Pursuing"
        ? Array.from({ length: 5 }, (_, i) => (currentYear + i).toString())
        : Array.from({ length: 15 }, (_, i) => (currentYear - i).toString());

      return (
        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-700 w-full max-w-5xl mx-auto pb-2 px-4 mt-1">
          <div className="mb-3 md:mb-6 text-center">
            <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#111827] tracking-tight">
              Tell us about your background
            </h2>
          </div>

          <div className="w-full mb-4 md:mb-8 overflow-hidden rounded-[24px] shadow-sm border border-slate-50 lg:hidden">
            <Image
              src="/graduation.png"
              alt="Academics"
              width={800}
              height={400}
              className="w-full h-[85px] md:h-[180px] object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6 w-full max-w-[500px] mx-auto md:max-w-4xl md:grid md:grid-cols-2 lg:gap-10">
            <div className="md:col-span-2 space-y-3">
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Highest Education Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EDUCATION_LEVELS.map((level) => {
                  const isSelected = form.highestEducation === level;
                  const iconMap: Record<string, any> = {
                    "10th Grade / SLC": BookOpen,
                    "12th Grade / +2 / HSEB": GraduationCap,
                    "3-Year Diploma": FileText,
                    "Bachelor's Degree": Award,
                    "Master's Degree": Award,
                    "Integrated Master's": Sparkles,
                  };
                  const LevelIcon = iconMap[level] || GraduationCap;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateForm("highestEducation", level)}
                      className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-start h-full ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/20 shadow-md scale-[1.02]"
                          : "border-slate-100 bg-[#f8fafc] shadow-sm hover:border-blue-200"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <LevelIcon className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-500" : "text-slate-400"}`} />
                      <span className={`text-[11px] font-black uppercase block tracking-wider leading-tight ${isSelected ? "text-blue-600" : "text-slate-500"}`}>
                        {level}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Education Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "Pursuing", icon: Clock, desc: "Currently enrolled" },
                  { value: "Completed", icon: CheckCircle, desc: "Already graduated" },
                ] as const).map((opt) => {
                  const isSelected = form.educationStatus === opt.value;
                  const StatusIcon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateForm("educationStatus", opt.value)}
                      className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-start ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/20 shadow-md scale-[1.02]"
                          : "border-slate-100 bg-[#f8fafc] shadow-sm hover:border-blue-200"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <StatusIcon className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-500" : "text-slate-400"}`} />
                      <span className={`text-[11px] font-black uppercase block tracking-wider leading-none mb-0.5 ${isSelected ? "text-blue-600" : "text-slate-500"}`}>
                        {opt.value}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 block leading-tight">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                {form.educationStatus === "Pursuing" ? "Expected Academics Score" : "Academics Score"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="4.0"
                  step="0.01"
                  placeholder={form.educationStatus === "Pursuing" ? "Expected Academics Score (eg: 3.8)" : "Academics Score (eg: 3.8)"}
                  className={`w-full h-[50px] md:h-[60px] px-6 bg-[#f8fafc] border rounded-[22px] text-[16px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm ${form.gpa && (parseFloat(form.gpa) < 0 || parseFloat(form.gpa) > 4.0) ? "border-red-400 ring-2 ring-red-500/20" : "border-slate-200"}`}
                  value={form.gpa}
                  onChange={(e) => updateForm("gpa", e.target.value)}
                />
              </div>
              {form.gpa &&
                (parseFloat(form.gpa) < 0 || parseFloat(form.gpa) > 4.0) && (
                  <p className="text-red-500 text-[11px] font-bold ml-2">
                    Score must be between 0.0 and 4.0
                  </p>
                )}
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                {form.educationStatus === "Pursuing" ? "Expected Year of Passing" : "Year of Completion"}
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className={`flex items-center justify-between w-full h-[50px] md:h-[60px] px-6 bg-[#f8fafc] border rounded-[22px] text-[16px] font-semibold transition-all shadow-sm ${
                    !form.passingYear ? "border-slate-200 text-slate-400" : "border-slate-200 text-slate-900 hover:border-blue-200"
                  }`}
                >
                  <span>{form.passingYear || "Select Year"}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isYearDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsYearDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 z-50 w-full bg-white border border-slate-100 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden"
                      >
                        <div className="max-h-[250px] overflow-y-auto p-2 scrollbar-hide">
                          {YEARS.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => {
                                updateForm("passingYear", year);
                                setIsYearDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-[16px] text-[15px] font-medium transition-colors ${
                                form.passingYear === year
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="h-32 md:hidden" />
        </div>
      );
    }

    if (step === 5) {
      const TEST_OPTIONS = [
        { id: "IELTS", name: "IELTS", min: 1, max: 9, min50: 4.5, placeholder: "e.g., 6.5", step: "0.5", icon: GraduationCap, desc: "Overall Band Score (1-9)" },
        { id: "PTE Academic", name: "PTE Academic", min: 10, max: 90, min50: 50, placeholder: "e.g., 65", step: "1", icon: ScrollText, desc: "Global Score (10-90)" },
        { id: "TOEFL", name: "TOEFL iBT", min: 0, max: 120, min50: 60, placeholder: "e.g., 90", step: "1", icon: Globe, desc: "Internet test (0-120)" },
        { id: "Duolingo", name: "Duolingo", min: 10, max: 160, min50: 85, placeholder: "e.g., 115", step: "5", icon: Award, desc: "DET English Test (10-160)" },
        { id: "Cambridge", name: "Cambridge English", min: 120, max: 230, min50: 160, placeholder: "e.g., 180", step: "1", icon: FileCheck, desc: "Cambridge English Scale (120-230)" },
        { id: "SAT", name: "SAT", min: 400, max: 1600, min50: 1000, placeholder: "e.g., 1200", step: "10", icon: Brain, desc: "SAT General (400-1600)" },
        { id: "GRE", name: "GRE", min: 260, max: 340, min50: 300, placeholder: "e.g., 310", step: "1", icon: Microscope, desc: "GRE Graduate (260-340)" },
        { id: "GMAT", name: "GMAT", min: 200, max: 800, min50: 500, placeholder: "e.g., 600", step: "10", icon: LineChart, desc: "GMAT Management (200-800)" },
        { id: "NONE", name: "No Test / None", min: 0, max: 0, min50: 0, placeholder: "", step: "1", icon: XCircle, desc: "No test taken yet" }
      ];

      const COUNTRY_CODE_TO_NAME: Record<string, string> = {
        USA: "United States",
        UK: "United Kingdom",
        CA: "Canada",
        AU: "Australia",
        DE: "Germany",
        IE: "Ireland",
        MT: "Malta"
      };

      const TEST_SUPPORT_MATRIX: Record<string, Record<string, { status: "supported" | "limited" | "not_supported" | "some_unis" | "many_unis"; message: string }>> = {
        "Canada": {
          IELTS: { status: "supported", message: "Fully accepted by all universities and SDS visa stream." },
          "PTE Academic": { status: "supported", message: "Fully accepted by all universities and SDS visa stream." },
          TOEFL: { status: "supported", message: "Fully accepted by all universities and SDS visa stream." },
          Duolingo: { status: "many_unis", message: "Accepted by many universities for admission." },
          Cambridge: { status: "some_unis", message: "Accepted by some universities for admission." }
        },
        "United States": {
          IELTS: { status: "supported", message: "Fully accepted by all universities." },
          "PTE Academic": { status: "supported", message: "Fully accepted by all universities." },
          TOEFL: { status: "supported", message: "Fully accepted by all universities." },
          Duolingo: { status: "many_unis", message: "Accepted by many universities for admission." },
          Cambridge: { status: "some_unis", message: "Accepted by some universities for admission." }
        },
        "Australia": {
          IELTS: { status: "supported", message: "Fully accepted for admission and student visa." },
          "PTE Academic": { status: "supported", message: "Fully accepted for admission and student visa." },
          TOEFL: { status: "supported", message: "Fully accepted for admission and student visa." },
          Duolingo: { status: "not_supported", message: "This language is not supported in this country" },
          Cambridge: { status: "supported", message: "Accepted for admission and student visa." }
        },
        "United Kingdom": {
          IELTS: { status: "supported", message: "Fully accepted. IELTS Academic/UKVI is standard." },
          "PTE Academic": { status: "supported", message: "Fully accepted by all universities." },
          TOEFL: { status: "supported", message: "Fully accepted by all universities." },
          Duolingo: { status: "some_unis", message: "Accepted by some universities only. Check university specific requirements." },
          Cambridge: { status: "supported", message: "Fully accepted by all universities." }
        },
        "Ireland": {
          IELTS: { status: "supported", message: "Fully accepted by all universities." },
          "PTE Academic": { status: "supported", message: "Fully accepted by all universities." },
          TOEFL: { status: "supported", message: "Fully accepted by all universities." },
          Duolingo: { status: "some_unis", message: "Accepted by some universities. Check university specific requirements." },
          Cambridge: { status: "supported", message: "Fully accepted by all universities." }
        },
        "Germany": {
          IELTS: { status: "supported", message: "Fully accepted by all universities." },
          "PTE Academic": { status: "supported", message: "Fully accepted by all universities." },
          TOEFL: { status: "supported", message: "Fully accepted by all universities." },
          Duolingo: { status: "some_unis", message: "Accepted by some universities. Check university specific requirements." },
          Cambridge: { status: "supported", message: "Fully accepted by all universities." }
        },
        "Malta": {
          IELTS: { status: "supported", message: "Fully accepted by all universities." },
          "PTE Academic": { status: "supported", message: "Fully accepted by all universities." },
          TOEFL: { status: "supported", message: "Fully accepted by all universities." },
          Duolingo: { status: "some_unis", message: "Accepted by some universities. Check university specific requirements." },
          Cambridge: { status: "supported", message: "Fully accepted by all universities." }
        }
      };

      const selectedCountryCode = form.countries[0] || "USA";
      const countryName = COUNTRY_CODE_TO_NAME[selectedCountryCode] || "Canada";

      const getTestSupportInfo = (testId: string, countryCode: string) => {
        const name = COUNTRY_CODE_TO_NAME[countryCode] || "Canada";
        const matrix = TEST_SUPPORT_MATRIX[name];
        if (!matrix) return null;
        return matrix[testId] || null;
      };

      const handleTestSelect = (testId: string) => {
        if (testId === "NONE") {
          updateForm("hasEnglishTest", false);
          updateForm("testType", "NONE");
          updateForm("testScore", "0");
        } else {
          updateForm("hasEnglishTest", true);
          updateForm("testType", testId);
          // Auto-fill recommended default score above 50% threshold if not set
          const score = parseFloat(form.testScore);
          const defaultScores: Record<string, string> = {
            IELTS: "6.5",
            "PTE Academic": "65",
            TOEFL: "90",
            Duolingo: "115",
            Cambridge: "180",
            SAT: "1100",
            GRE: "310",
            GMAT: "580"
          };
          const test = TEST_OPTIONS.find(t => t.id === testId);
          if (test && (isNaN(score) || score === 0 || score < test.min || score > test.max)) {
            updateForm("testScore", defaultScores[testId]);
          }
        }
      };

      const selectedTest = TEST_OPTIONS.find(t => t.id === form.testType && form.hasEnglishTest === true);
      const scoreVal = parseFloat(form.testScore);
      const isAbove50 = selectedTest && !isNaN(scoreVal) && scoreVal >= selectedTest.min50;
      const percentOfMax = selectedTest && !isNaN(scoreVal) && selectedTest.max > 0
        ? Math.round(((scoreVal - selectedTest.min) / (selectedTest.max - selectedTest.min)) * 100)
        : 0;

      // Planned Test Score Validation
      let plannedScoreError = "";
      if (form.plannedTestType && form.plannedTestScore) {
        const pScore = parseFloat(form.plannedTestScore);
        if (isNaN(pScore)) {
          plannedScoreError = "Please enter a valid number";
        } else if (form.plannedTestType === "IELTS" && (pScore < 1 || pScore > 9)) {
          plannedScoreError = "IELTS score must be between 1 and 9";
        } else if (form.plannedTestType === "PTE" && (pScore < 10 || pScore > 90)) {
          plannedScoreError = "PTE score must be between 10 and 90";
        } else if (form.plannedTestType === "TOEFL" && (pScore < 0 || pScore > 120)) {
          plannedScoreError = "TOEFL score must be between 0 and 120";
        } else if (form.plannedTestType === "Duolingo" && (pScore < 10 || pScore > 160)) {
          plannedScoreError = "Duolingo score must be between 10 and 160";
        }
      }

      return (
        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-700 w-full max-w-5xl mx-auto pb-2 px-4">
          <div className="mb-3 text-center">
            <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#111827] tracking-tight">
              Select Your Language Proficiency Test
            </h2>
            <p className="text-[13px] md:text-[14px] text-slate-500 font-medium mt-1">
              Choose the test you have taken or select &quot;No Test / None&quot;
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full mb-8">
            {TEST_OPTIONS.filter((test) => {
              const support = getTestSupportInfo(test.id, selectedCountryCode);
              return !support || support.status !== "not_supported";
            }).map((test) => {
              const isSelected = (test.id === "NONE" && form.hasEnglishTest === false) ||
                                 (test.id !== "NONE" && form.hasEnglishTest === true && form.testType === test.id);
              
              const support = getTestSupportInfo(test.id, selectedCountryCode);
              const supportBadge = support ? (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase mt-2.5 ${
                  support.status === "supported" || support.status === "many_unis"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : support.status === "not_supported"
                    ? "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {support.status === "supported" ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-700" /> Accepted
                    </span>
                  ) : support.status === "many_unis" ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-700" /> Many Unis
                    </span>
                  ) : support.status === "not_supported" ? (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-2.5 h-2.5 text-rose-700" /> Not Accepted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-700" /> Some Unis
                    </span>
                  )}
                </span>
              ) : null;

              return (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => handleTestSelect(test.id)}
                  className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between items-start h-full ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/20 shadow-md scale-[1.02]"
                      : "border-slate-100 bg-white shadow-sm hover:border-blue-200"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  <div>
                    {(() => {
                      const TestIcon = test.icon;
                      return <TestIcon className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-500" : "text-slate-400"}`} />;
                    })()}
                    <span className={`text-[11px] font-black uppercase block tracking-wider leading-none mb-1 ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                      {test.name}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                      {test.desc}
                    </span>
                  </div>
                  {supportBadge}
                </button>
              );
            })}
          </div>

          {selectedTest && (
            <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white border border-slate-100 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <selectedTest.icon className="w-5 h-5 text-[#3686FF]" />
                    <span>{selectedTest.name} Score Details</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Score range: {selectedTest.min} – {selectedTest.max} (Threshold for 50%: {selectedTest.min50})
                  </p>
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Your Score
                  </label>
                  <input
                    type="number"
                    min={selectedTest.min}
                    max={selectedTest.max}
                    step={selectedTest.step}
                    placeholder={selectedTest.placeholder}
                    className="w-full h-[50px] px-5 bg-white border border-slate-200 rounded-2xl text-[16px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                    value={form.testScore === "0" ? "" : form.testScore}
                    onChange={(e) => updateForm("testScore", e.target.value)}
                  />
                </div>
              </div>

              {/* Country Specific English Test Acceptance Warning/Info */}
              {(() => {
                const supportInfo = getTestSupportInfo(selectedTest.id, selectedCountryCode);
                if (!supportInfo) return null;
                return (
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 animate-in fade-in ${
                    supportInfo.status === "supported" || supportInfo.status === "many_unis"
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                      : supportInfo.status === "not_supported"
                      ? "bg-rose-50/70 border-rose-100 text-rose-800"
                      : "bg-amber-50/70 border-amber-100 text-amber-800"
                  }`}>
                    <span className="shrink-0 mt-0.5">
                      {supportInfo.status === "supported" || supportInfo.status === "many_unis" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : supportInfo.status === "not_supported" ? (
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                    </span>
                    <div className="space-y-1">
                      <p className="font-extrabold text-[14px] leading-tight">
                        {countryName} Acceptance Status
                      </p>
                      <p className="text-[12px] opacity-90 leading-relaxed font-semibold">
                        {supportInfo.message}
                      </p>
                    </div>
                  </div>
                );
              })()}


            </div>
          )}

          {form.hasEnglishTest === false && (
            <div className="text-center p-6 bg-blue-50/40 rounded-[28px] border border-blue-100/50 w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-500 space-y-6">
              <div>
                <p className="text-blue-800 font-extrabold mb-1 text-[16px]">
                  No problem!
                </p>
                <p className="text-blue-600/80 text-[13px] font-semibold leading-relaxed">
                  You can continue to search matches without a score. Many universities offer pathway programs or English waivers, though we recommend preparing for a test later.
                </p>
              </div>
              <div className="bg-white/80 rounded-2xl p-5 text-left border border-blue-100 space-y-5">
                <p className="font-bold text-slate-800 text-[14px]">
                  Which test do you plan to take? (Optional)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "IELTS", label: "IELTS", icon: GraduationCap, desc: "Band Score (1-9)" },
                    { value: "PTE", label: "PTE", icon: ScrollText, desc: "Global Score (10-90)" },
                    { value: "TOEFL", label: "TOEFL", icon: Globe, desc: "iBT Score (0-120)" },
                    { value: "Duolingo", label: "Duolingo", icon: Award, desc: "DET Score (10-160)" },
                  ].filter((opt) => {
                    const testIdMap: Record<string, string> = {
                      IELTS: "IELTS",
                      PTE: "PTE Academic",
                      TOEFL: "TOEFL",
                      Duolingo: "Duolingo",
                    };
                    const support = getTestSupportInfo(testIdMap[opt.value] || opt.value, selectedCountryCode);
                    return !support || support.status !== "not_supported";
                  }).map((opt) => {
                    const isSelected = form.plannedTestType === opt.value;
                    const TestIcon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, plannedTestType: isSelected ? "" : opt.value, plannedTestScore: isSelected ? "" : form.plannedTestScore })}
                        className={`group relative text-left p-3.5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-start ${
                          isSelected
                            ? "border-blue-500 bg-blue-50/30 shadow-md scale-[1.02]"
                            : "border-slate-100 bg-white shadow-sm hover:border-blue-200"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                        <TestIcon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-blue-500" : "text-slate-400"}`} />
                        <span className={`text-[11px] font-black uppercase block tracking-wider leading-none mb-0.5 ${isSelected ? "text-blue-600" : "text-slate-500"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 block leading-tight">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {form.plannedTestType && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Target Score</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.5, 65, 90"
                      value={form.plannedTestScore}
                      onChange={(e) => setForm({ ...form, plannedTestScore: e.target.value })}
                      className={`w-full bg-[#F4F7FF] text-slate-800 text-[15px] font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#3686FF]/50 border transition-all placeholder:font-medium placeholder:text-slate-400 ${plannedScoreError ? 'border-red-400 ring-2 ring-red-400/20' : 'border-transparent'}`}
                    />
                    {plannedScoreError && (
                      <p className="text-red-500 text-[11px] font-bold mt-1.5">{plannedScoreError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="h-4 md:hidden" />
        </div>
      );
    }

    if (step === 6) {
      const selectedCountryCode = form.countries[0] || "USA";
      const countryGuide =
        COUNTRY_INTAKE_GUIDE[selectedCountryCode] || COUNTRY_INTAKE_GUIDE.USA;
      const INTAKE_OPTIONS = [
        ...countryGuide.intakes.map((item) => ({
          main: `${item.label} Intake`,
          sub: `${item.months} | Apply: ${item.applyWindow}`,
          meta: item.isMain ? "Main" : item.isLimited ? "Limited" : "Regular",
        })),
        {
          main: "Not Sure",
          sub: "We will suggest based on your profile",
          meta: "Recommended",
        },
      ];

      const currentYear = new Date().getFullYear();
      const baseYear = form.passingYear ? parseInt(form.passingYear) : currentYear;
      const startYear = Math.max(currentYear, baseYear);
      const YEARS = [
        startYear.toString(),
        (startYear + 1).toString(),
        (startYear + 2).toString(),
        (startYear + 3).toString(),
      ];
      
      const INTAKE_LABELS = INTAKE_OPTIONS.map(opt => `${opt.main} (${opt.meta}) - ${opt.sub}`);

      return (
        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-700 w-full max-w-5xl mx-auto pb-4 px-4">
          <div className="mb-2 text-center">
            <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#111827] tracking-tight">
              When do you want to start your studies?
            </h2>
            <p className="text-[13px] md:text-[14px] text-slate-500 font-medium mt-1">
              Select your target year and study intake for {countryGuide.countryName}
            </p>
          </div>

          <div className="w-full mb-4 md:mb-8 overflow-hidden rounded-[24px] shadow-sm border border-slate-50 lg:hidden">
            <Image
              src="/intake.png"
              alt="World Map"
              width={800}
              height={400}
              className="w-full h-[85px] md:h-[180px] object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6 w-full max-w-[500px] mx-auto md:max-w-2xl md:grid md:grid-cols-2 lg:gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Target Year
              </label>
              <SearchSelect
                placeholder="Select Target Year"
                options={YEARS}
                value={form.intakeYear}
                onChange={(v) => updateForm("intakeYear", v)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Intake Season
              </label>
              <SearchSelect
                placeholder="Select Intake Season"
                options={INTAKE_LABELS}
                value={form.intake}
                onChange={(v) => updateForm("intake", v)}
              />
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-10 rounded-[18px] border border-slate-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-[12px] md:text-[13px] font-semibold text-slate-700 mb-2">
              Simple intake summary
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] md:text-[12px] text-slate-600">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                Sep/Fall: USA, UK, Canada, Europe
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                Jan: UK, Canada, Ireland
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                Feb/Mar: Australia, NZ, Korea
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                Oct: Germany, Japan
              </div>
            </div>
          </div>

          <div className="h-2 md:hidden" />

          <div className="h-20 md:hidden" />
        </div>
      );
    }

    if (transitionType === "matching")
      return <MatchingEngineScreen onFinish={() => setTransitionType(null)} />;
    if (transitionType === "finance")
      return <FinancialEngineScreen onFinish={() => setTransitionType(null)} />;
    if (transitionType === "admission")
      return <AdmissionEngineScreen onFinish={() => setTransitionType(null)} />;
    if (transitionType === "visa")
      return <VisaEngineScreen onFinish={() => setTransitionType(null)} />;

    if (step === 7) {
      return (
        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-700 w-full max-w-7xl mx-auto px-4 pb-4">
          <div className="w-full flex justify-start pt-4">
            <button
              onClick={() => setStep(6)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-[#3686FF] font-medium text-[14px] transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Preferences
            </button>
          </div>
          <div className="mb-10 text-center pt-4 flex flex-col items-center">
            <span className="text-[12px] md:text-[14px] font-semibold text-blue-500 uppercase tracking-widest mb-3">
              Discover Your Future
            </span>
            <h2 className="text-[32px] md:text-[52px] font-bold text-[#111827] leading-tight mb-4 tracking-tight">
              Find Universities That <br className="hidden md:block" />
              <span className="text-blue-500">Match Your Profile</span>
            </h2>
            <p className="text-slate-500 text-[15px] md:text-[16px] font-medium max-w-xl mx-auto">
              Compare costs, admission chances, and visa success - all in one
              place.
            </p>
          </div>

          <UniversitySelection
            matches={matches}
            loading={loading}
            error={error}
            selectedMatch={selectedMatch}
            form={form}
            session={session}
            usdToNpr={liveUsdToNpr}
            onSelect={async (m: Match) => {
              if (!session) {
                redirectToSignupForMatches(m);
                return;
              }
              setSelectedMatch(m);
              setTransitionType("finance");
              setStep(8);

              // Auto-save the selected match immediately to the database for authenticated users
              try {
                await fetch("/api/matches/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ formData: form, matchData: m }),
                });
              } catch (e) {
                console.error("Failed to save selected match on selection", e);
              }
            }}
            onAdjustPreferences={() => setStep(6)}
            onClearFilters={() => {
              setForm({ ...form, budget: "100000", field: "" });
              runMatch();
            }}
            runMatch={runMatch}
          />

          {/* How it Works Section with Full Width Blue Background via Negative Margins */}
          <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-[#f0f9ff]/50 py-16 md:py-16 border-t border-slate-100">
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4">
              <span className="text-[12px] md:text-[14px] font-semibold text-blue-500 uppercase tracking-widest mb-1">
                How it Works
              </span>
              <h2 className="text-[32px] md:text-[36px] font-semibold text-[#111827] leading-tight mb-2 tracking-tight text-center">
                Our Proven <span className="text-blue-500">Work Process</span>
              </h2>
              <p className="text-slate-600 text-[15px] md:text-[16px] font-regular max-w-xl mx-auto text-center mb-16 md:mb-14">
                Three simple steps to your global education journey.
              </p>

              <div className="flex flex-col md:flex-row w-full justify-between relative gap-12 md:gap-0">
                {/* Connecting Lines (Desktop only) */}
                <div className="hidden md:block absolute top-[38px] left-[20%] w-[20%] h-[3px] bg-[#0f172a] rounded-full z-0" />
                <div className="hidden md:block absolute top-[38px] right-[20%] w-[20%] h-[3px] bg-[#0f172a] rounded-full z-0" />

                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1 z-10 relative px-4">
                  <div className="relative mb-6">
                    <div className="w-[80px] h-[80px] rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Search className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-3 w-9 h-9 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-[13px] font-bold border-[3px] border-white">
                      01
                    </div>
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#111827] mb-3">
                    Discover
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-slate-500 text-center leading-relaxed font-regular px-2">
                    Search and filter universities by subject, country, budget,
                    and ranking to find your perfect match.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1 z-10 relative px-4">
                  <div className="relative mb-6">
                    <div className="w-[80px] h-[80px] rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <ClipboardList className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-3 w-9 h-9 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-[13px] font-bold border-[3px] border-white">
                      02
                    </div>
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#111827] mb-3">
                    Compare
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-slate-500 text-center leading-relaxed font-regular px-2">
                    Side-by-side comparison of tuition, requirements,
                    scholarships, and campus life across institutions.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1 z-10 relative px-4">
                  <div className="relative mb-6">
                    <div className="w-[80px] h-[80px] rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-3 w-9 h-9 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-[13px] font-bold border-[3px] border-white">
                      03
                    </div>
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#111827] mb-3">
                    Apply
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-slate-500 text-center leading-relaxed font-regular px-2">
                    Submit applications directly through our platform with
                    guided support at every step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 8+: Universal Analytical Context
    if (step >= 8 && selectedMatch) {
      const profileScore = getEligibilityScore(form);
      const admissionPct =
        admissionAnalysis !== null
          ? admissionAnalysis.admissionPct
          : (decisionSignals?.admissionConfidence ||
            Math.max(
              35,
              Math.min(
                95,
                Math.round(
                  (selectedMatch.admissionRate || 60) * 0.5 + profileScore * 0.5,
                ),
              ),
            ));
      const admissionBand =
        admissionAnalysis !== null
          ? admissionAnalysis.band
          : getRateBand(admissionPct);
      const budgetRaw = Number.parseFloat(form.budget) || 0;
      const budgetUsd =
        form.currency === "NPR" ? budgetRaw / liveUsdToNpr : budgetRaw;
      const tuitionUsd = Math.round(
        selectedMatch.currency === "NPR"
          ? (selectedMatch.tuitionFee || 22000) / liveUsdToNpr
          : selectedMatch.tuitionFee || 22000,
      );
      const livingBreakdown = dynamicLivingCost || {
        rent: Math.round(Math.max(tuitionUsd * 0.38, 4200)),
        food: Math.round(Math.max(tuitionUsd * 0.12, 1200)),
        transport: Math.round(Math.max(tuitionUsd * 0.05, 450)),
        insurance: Math.round(Math.max(tuitionUsd * 0.04, 300)),
        other: Math.round(Math.max(tuitionUsd * 0.09, 650)),
      };
      const livingCostUsd = Object.values(
        livingBreakdown as Record<string, number>,
      ).reduce((s: number, v: number) => s + v, 0);
      const beforeDepartureDefaultUsd = 75 + 300 + 110 + 425 + 685 + Math.round(tuitionUsd * 0.5) + 1200;
      const first6MonthsDefaultUsd = Math.round(100000 / liveUsdToNpr) + 1500 + Math.round((livingBreakdown.rent + livingBreakdown.food) * 6) + 300 + Math.round(livingBreakdown.transport * 6) + 600 + 900 + 300;
      const totalYear1Usd = beforeDepartureDefaultUsd + first6MonthsDefaultUsd;
      const totalYear1Npr = Math.round(totalYear1Usd * liveUsdToNpr);
      const costBand = getCostBand(totalYear1Usd, budgetUsd);
      const nprRangeLakhs = (valueNpr: number, _spread = 0.12) => {
        return formatNPRDevanagari(valueNpr);
      };

      const signalCards = [
        {
          label: "Admission Confidence",
          value: `${admissionPct}%`,
          tone:
            admissionPct >= 75
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : admissionPct >= 60
                ? "text-amber-700 bg-amber-50 border-amber-100"
                : "text-rose-700 bg-rose-50 border-rose-100",
        },
        {
          label: "Visa Readiness",
          value: `${decisionSignals?.visaConfidence || 58}%`,
          tone:
            (decisionSignals?.visaConfidence || 0) >= 72
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : (decisionSignals?.visaConfidence || 0) >= 58
                ? "text-amber-700 bg-amber-50 border-amber-100"
                : "text-rose-700 bg-rose-50 border-rose-100",
        },
        {
          label: "Year-1 Budget Coverage",
          value: `${decisionSignals?.budgetCoverage || 65}%`,
          tone:
            (decisionSignals?.budgetCoverage || 0) >= 100
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : (decisionSignals?.budgetCoverage || 0) >= 85
                ? "text-amber-700 bg-amber-50 border-amber-100"
                : "text-rose-700 bg-rose-50 border-rose-100",
        },
      ];

      const insightsPanel = (
        <Card className="mx-4 md:mx-6 lg:mx-8 mt-4 p-4 md:p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              Dynamic Counselor Signals
            </h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              {decisionSignals?.counselorVerdict || "Evaluating"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {signalCards.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border px-3 py-2.5 ${item.tone}`}
              >
                <p className="text-[9px] font-black uppercase tracking-widest opacity-75">
                  {item.label}
                </p>
                <p className="text-base font-black tracking-tight mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      );

      if (step === 8) {
        return (
          <>
            <StudyOverviewDashboard
              form={form}
              selectedMatch={selectedMatch}
              matches={matches}
              session={session}
              USD_TO_NPR={liveUsdToNpr}
              totalYear1Npr={totalYear1Npr}
              admissionPct={admissionPct}
              visaChance={visaAnalysis?.successChance}
              visaLabel={visaAnalysis?.label}
              costBand={costBand}
              admissionBand={admissionBand}
              onAdvanceToCost={() => setStep(9)}
              onAdvanceToAdmission={() => {
                setTransitionType("admission");
                setStep(10);
              }}
              onAdvanceToVisa={() => {
                setTransitionType("visa");
                setStep(11);
              }}
              onGoToMatches={() => setStep(7)}
            />
            {insightsPanel}
          </>
        );
      }

      if (step === 9 && financialMetrics) {
        return (
          <>
            <FinancialDashboard
              form={form}
              selectedMatch={selectedMatch}
              financialMetrics={financialMetrics}
              dynamicLivingCost={dynamicLivingCost}
              costBand={costBand}
              onBack={() => setStep(8)}
            />
            {insightsPanel}
          </>
        );
      }

      if (step === 10) {
        return (
          <>
            <AdmissionDetails
              form={form}
              selectedMatch={selectedMatch}
              admissionPct={admissionPct}
              admissionBand={admissionBand}
              admissionAnalysis={admissionAnalysis}
              onBack={() => setStep(8)}
              onAdvanceToVisa={() => {
                setTransitionType("visa");
                setStep(11);
              }}
            />
            {insightsPanel}
          </>
        );
      }

      if (step === 11) {
        return (
          <>
            <VisaEligibility
              form={form}
              selectedMatch={selectedMatch}
              onBack={() => setStep(8)}
              onComplete={() => {
                setTransitionType("roadmap");
                setStep(12);
              }}
            />
            {insightsPanel}
          </>
        );
      }

      if (step === 12 && financialMetrics) {
        const roadmapCards = [
          {
            key: "cost",
            label: "Cost",
            value: nprRangeLakhs(financialMetrics.totalTuitionNpr),
            helper: `${financialMetrics.graduationDuration} year tuition outlook`,
            accent: "from-[#3366FF] to-[#6FA8FF]",
            onClick: () => setStep(9),
          },
          {
            key: "admission",
            label: "Admission",
            value: `${admissionPct}%`,
            helper: "Acceptance momentum and profile fit",
            accent: "from-[#1D4ED8] to-[#60A5FA]",
            onClick: () => setStep(10),
          },
          {
            key: "visa",
            label: "Visa",
            value: `${decisionSignals?.visaConfidence || 58}%`,
            helper: "Document and funds readiness",
            accent: "from-[#0EA5E9] to-[#A5D8FF]",
            onClick: () => setStep(11),
          },
        ];

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen bg-[#F7F9FF] px-4 pb-20 md:px-8 lg:px-12 text-[#0f172a]">
            {insightsPanel}
            <div className="mx-auto max-w-7xl space-y-5 pt-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(11)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8E4FF] bg-white px-4 py-2 text-[13px] font-semibold text-[#475569] shadow-sm transition-colors hover:border-[#BFD0FF] hover:text-[#3366FF]"
                >
                  <ChevronLeft className="w-4 h-4 text-[#3366FF]" />
                  Back to Visa
                </button>
                <div className="rounded-full border border-[#D8E4FF] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#64748B] shadow-sm">
                  Step 12 of 15
                </div>
              </div>

              <Card className="relative overflow-hidden rounded-4xl border border-[#D8E4FF] bg-white p-6 shadow-[0_24px_70px_rgba(51,102,255,0.08)] md:p-10">
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#3366FF]/10 -mr-36 -mt-36 blur-[100px] opacity-80" />
                <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#A5D8FF]/18 -ml-28 -mb-28 blur-[90px] opacity-70" />

                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#D8E4FF] bg-[#F7F9FF] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#3366FF]">
                      Total Investment Projection
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#64748B] italic">
                        Projected Degree ROI
                      </p>
                      <h2 className="text-4xl font-black italic uppercase tracking-tight leading-[0.92] text-[#111827] md:text-6xl">
                        {nprRangeLakhs(financialMetrics.totalDegreeCostNpr)}
                      </h2>
                      <p className="max-w-2xl text-[14px] leading-relaxed text-[#475569] md:text-[16px]">
                        A final counselor-style roadmap for your study plan:
                        review the cost, tighten the admission strategy, and
                        verify visa readiness before moving forward.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <span className="rounded-full border border-[#D8E4FF] bg-[#F7F9FF] px-3 py-1.5 text-[11px] font-bold text-[#0f172a]">
                        Tuition:{" "}
                        {nprRangeLakhs(financialMetrics.totalTuitionNpr, 0.1)}
                      </span>
                      <span className="rounded-full border border-[#D8E4FF] bg-[#F7F9FF] px-3 py-1.5 text-[11px] font-bold text-[#0f172a]">
                        Living:{" "}
                        {nprRangeLakhs(financialMetrics.totalLivingNpr, 0.1)}
                      </span>
                      <span className="rounded-full border border-[#D8E4FF] bg-[#EAF2FF] px-3 py-1.5 text-[11px] font-bold text-[#3366FF]">
                        {decisionSignals?.counselorVerdict ||
                          "Review In Progress"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      {
                        label: "Budget coverage",
                        value: `${decisionSignals?.budgetCoverage || 0}%`,
                      },
                      {
                        label: "Admission confidence",
                        value: `${admissionPct}%`,
                      },
                      {
                        label: "Visa readiness",
                        value: `${decisionSignals?.visaConfidence || 58}%`,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-3xl border border-[#D8E4FF] bg-[#F7F9FF] p-4 backdrop-blur-sm"
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#64748B]">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {roadmapCards.map((card) => (
                  <button
                    key={card.key}
                    onClick={card.onClick}
                    className="group rounded-3xl border border-[#D8E4FF] bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:border-[#BFD0FF] hover:shadow-[0_16px_40px_rgba(51,102,255,0.08)]"
                  >
                    <div
                      className={`h-1.5 w-16 rounded-full bg-linear-to-r ${card.accent}`}
                    />
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#64748B]">
                          Step
                        </p>
                        <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">
                          {card.label}
                        </h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3366FF]" />
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#475569]">
                      {card.helper}
                    </p>
                    <div className="mt-4 text-[15px] font-black tracking-tight text-[#3366FF]">
                      {card.value}
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                <button
                  onClick={() => {
                    setTransitionType("summary");
                    setStep(13);
                  }}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-3xl bg-[#3366FF] px-5 text-[13px] font-black uppercase tracking-[0.2em] text-white shadow-[0_20px_40px_-5px_rgba(51,102,255,0.28)] transition-transform hover:scale-[1.01] active:scale-95"
                >
                  Continue to Summary
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setStep(8)}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-3xl border border-[#D8E4FF] bg-white px-5 text-[12px] font-black uppercase tracking-[0.2em] text-[#475569] shadow-sm transition-colors hover:border-[#BFD0FF] hover:text-[#3366FF]"
                >
                  Review Full Analysis
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    // 13: Final Phase Financial Oracle & Roadmap
    if (step === 13 && selectedMatch && financialMetrics) {
      const {
        graduationDuration: duration,
        tuitionUsd,
        yearlyLivingUsd,
        usdToNpr,
        setupCostsUsd,
        totalDegreeCostNpr,
      } = financialMetrics;

      const eligScore = getEligibilityScore(form);
      const scholPercent = eligScore >= 90 ? 50 : eligScore >= 80 ? 20 : 0;

      const baseTuitionAnnualNpr = tuitionUsd * usdToNpr;
      const totalScholSavingsNpr =
        baseTuitionAnnualNpr * (scholPercent / 100) * duration;

      const tuitionAnnualNpr = baseTuitionAnnualNpr * (1 - scholPercent / 100);
      const livingAnnualNpr = yearlyLivingUsd * usdToNpr;
      const oneTimeNpr = setupCostsUsd * usdToNpr;

      const totalTuitionNpr = tuitionAnnualNpr * duration;
      const totalLivingNpr = livingAnnualNpr * duration;
      const totalInvestmentNpr = totalTuitionNpr + totalLivingNpr + oneTimeNpr;

      const toggleUSD = form.currency === "USD";
      const displayVal = (v: number) => {
        const low = Math.max(0, Math.round(v * 0.88));
        const high = Math.round(v * 1.12);
        if (toggleUSD) {
          return `${(low / usdToNpr / 1000).toFixed(1)} - ${(high / usdToNpr / 1000).toFixed(1)}`;
        }
        return `${(low / 100000).toFixed(1)} - ${(high / 100000).toFixed(1)}`;
      };
      const symbol = toggleUSD ? "$" : "NPR";
      const unit = toggleUSD ? "k" : "L";

      const tuitionPercent = Math.round(
        (totalTuitionNpr / totalInvestmentNpr) * 100,
      );
      const livingPercent = Math.round(
        (totalLivingNpr / totalInvestmentNpr) * 100,
      );
      const miscPercent = 100 - tuitionPercent - livingPercent;

      const weatherCodeMap: Record<number, string> = {
        0: "Clear",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing Rime Fog",
        51: "Light Drizzle",
        53: "Drizzle",
        55: "Dense Drizzle",
        61: "Light Rain",
        63: "Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Snow",
        75: "Heavy Snow",
        80: "Rain Showers",
        81: "Rain Showers",
        82: "Violent Rain Showers",
        95: "Thunderstorm",
      };

      const qualityOfLifeIndex = Number(
        relocationStats?.quality_of_life_index ??
          relocationStats?.quality_index ??
          relocationStats?.quality_of_life ??
          relocationStats?.qualityOfLifeIndex ??
          NaN,
      );
      const safetyIndex = Number(
        relocationStats?.safety_index ?? relocationStats?.safety ?? NaN,
      );
      const healthcareIndex = Number(
        relocationStats?.healthcare_index ?? relocationStats?.healthcare ?? NaN,
      );
      const climateIndex = Number(
        relocationStats?.climate_index ?? relocationStats?.climate ?? NaN,
      );

      const weatherLabel =
        destinationInsight && Number.isFinite(destinationInsight?.condition)
          ? weatherCodeMap[destinationInsight.condition] || "Moderate"
          : "Unavailable";

      const monthlyBuckets = [
        {
          label: "Housing",
          value: apiCostEstimate?.housing_npr
            ? Math.round(apiCostEstimate.housing_npr / 12)
            : Math.round((livingAnnualNpr / 12) * 0.45),
          color: "bg-blue-600",
        },
        {
          label: "Food",
          value: apiCostEstimate?.food_npr
            ? Math.round(apiCostEstimate.food_npr / 12)
            : Math.round((livingAnnualNpr / 12) * 0.25),
          color: "bg-indigo-500",
        },
        {
          label: "Transport",
          value: apiCostEstimate?.transport_npr
            ? Math.round(apiCostEstimate.transport_npr / 12)
            : Math.round((livingAnnualNpr / 12) * 0.15),
          color: "bg-emerald-500",
        },
        {
          label: "Healthcare",
          value: apiCostEstimate?.healthcare_npr
            ? Math.round(apiCostEstimate.healthcare_npr / 12)
            : Math.round((livingAnnualNpr / 12) * 0.15),
          color: "bg-amber-500",
        },
      ];

      const annualProjectionNpr = financialMetrics.totalDegreeCostNpr;
      const finalEstimateBands = [
        {
          key: "efficient",
          label: "Efficient Projection",
          minLakh: Math.max(
            0,
            Math.round((annualProjectionNpr * 0.88) / 100000),
          ),
          maxLakh: Math.max(
            0,
            Math.round((annualProjectionNpr * 0.98) / 100000),
          ),
        },
        {
          key: "expected",
          label: "Expected Projection",
          minLakh: Math.max(
            0,
            Math.round((annualProjectionNpr * 0.98) / 100000),
          ),
          maxLakh: Math.max(
            0,
            Math.round((annualProjectionNpr * 1.08) / 100000),
          ),
        },
        {
          key: "stretch",
          label: "Stretch Projection",
          minLakh: Math.max(
            0,
            Math.round((annualProjectionNpr * 1.08) / 100000),
          ),
          maxLakh: Math.max(
            0,
            Math.round((annualProjectionNpr * 1.22) / 100000),
          ),
        },
      ] as const;

      const budgetCoverageForBand = decisionSignals?.budgetCoverage || 0;
      const selectedBandKey =
        budgetCoverageForBand >= 115
          ? "efficient"
          : budgetCoverageForBand >= 90
            ? "expected"
            : "stretch";

      const selectedFinalBand =
        finalEstimateBands.find((band) => band.key === selectedBandKey) ||
        finalEstimateBands[1];

      const lakhToNpr = (lakh: number) => lakh * 100000;
      const formatUsd = (npr: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(npr / liveUsdToNpr);

      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full px-4 md:px-8 lg:px-16 pb-20">
          {/* 1. Header Spotlight */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10 border-b border-slate-50 pb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 italic">
                Phase 03: Final Financial Commitment
              </div>
              <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter italic uppercase">
                Budget Summary
              </h2>

              <p className="text-slate-500 font-medium mt-6 italic text-lg max-w-2xl">
                Complete fiscal roadmap for your full {duration}-year tenure at{" "}
                {selectedMatch.name}.
              </p>
            </div>

            <div className="relative group w-full md:w-auto">
              <div
                className={`bg-${scholPercent > 0 ? "emerald-600 shadow-emerald-500/20" : "blue-600 shadow-blue-500/20"} text-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-2xl text-center scale-100 md:scale-105 ring-4 md:ring-8 ring-blue-50 transition-all`}
              >
                <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.3em] mb-4">
                  {scholPercent > 0
                    ? "Scholarship Applied"
                    : "Total Net Investment"}
                </p>
                <h3 className="text-4xl md:text-5xl font-black italic">
                  {formatNPRDevanagariRange(Math.max(0, Math.round(totalInvestmentNpr * 0.88)), Math.round(totalInvestmentNpr * 1.12))}
                </h3>
                {scholPercent > 0 && (
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                    <Award className="w-3 h-3" />
                    Saved {formatNPRDevanagari(totalScholSavingsNpr)} via Merit
                  </div>
                )}
                <p className="text-[9px] font-bold opacity-60 mt-4 uppercase tracking-widest">
                  Calculated to End-of-Degree
                </p>
              </div>

              {/* Scholarship Eligibility Card */}
              <div className="mt-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-lg animate-in slide-in-from-top-4 duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Merit Eligibility
                  </h4>
                  <span
                    className={`text-xs font-black ${eligScore >= 80 ? "text-emerald-500" : "text-slate-400"}`}
                  >
                    {eligScore}% Score
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">
                      Scholarship Status
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase ${scholPercent > 0 ? "text-emerald-600" : "text-rose-500"}`}
                    >
                      {scholPercent > 0
                        ? `GRANTED (${scholPercent}%)`
                        : "NOT ELIGIBLE"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${eligScore >= 80 ? "bg-emerald-500" : "bg-slate-200"}`}
                      style={{ width: `${eligScore}%` }}
                    />
                  </div>
                  <p className="text-[8px] font-medium text-slate-400 leading-tight">
                    {eligScore >= 90
                      ? "Extraordinary profile. 50% President's Merit Scholarship deducted."
                      : eligScore >= 80
                        ? "Strong profile. 20% Excellence Scholarship deducted."
                        : "Score 80%+ to unlock merit-based tuition reductions."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 2. Primary Analysis (LEFT) */}
            <div className="lg:col-span-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 rounded-[48px] border border-slate-100 bg-white shadow-sm flex flex-col items-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 w-full">
                    Investment Distribution
                  </h4>
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: `conic-gradient(#2563eb 0% ${tuitionPercent}%, #6366f1 ${tuitionPercent}% ${tuitionPercent + livingPercent}%, #94a3b8 ${tuitionPercent + livingPercent}% 100%)`,
                      }}
                    />
                    <div className="absolute inset-0 w-32 h-32 m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                      <span className="text-2xl font-black text-slate-900">
                        100%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        Coverage
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-12 w-full text-center">
                    <div>
                      <div className="w-2 h-2 rounded-full bg-blue-600 mx-auto" />
                      <p className="text-[9px] font-black text-slate-900">
                        {tuitionPercent}%
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Tuition
                      </p>
                    </div>
                    <div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mx-auto" />
                      <p className="text-[9px] font-black text-slate-900">
                        {livingPercent}%
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Living
                      </p>
                    </div>
                    <div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 mx-auto" />
                      <p className="text-[9px] font-black text-slate-900">
                        {miscPercent}%
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Misc
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-10 rounded-[48px] border border-slate-100 bg-linear-to-b from-white to-slate-50 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Calculator className="w-16 h-16" />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12">
                    Projected Expenditure Roadmap
                  </h4>
                  <div className="flex items-end justify-between h-64 gap-6 px-4">
                    {Array.from({ length: duration }).map((_, i) => {
                      const annualTotal =
                        tuitionAnnualNpr + livingAnnualNpr / duration;
                      const h = 100 - i * 12;
                      return (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-6 group"
                        >
                          <div className="w-full relative h-[210px] flex flex-col justify-end">
                            <div className="absolute inset-0 bg-slate-100/50 rounded-3xl border border-dotted border-slate-200" />
                            <div
                              className="w-full bg-linear-to-t from-blue-700 via-blue-500 to-indigo-400 rounded-3xl transition-all duration-1000 shadow-lg relative group-hover:scale-y-[1.02]"
                              style={{ height: `${h}%` }}
                            >
                              <div className="absolute -top-8 left-0 w-full text-center">
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                  ~{formatNPRDevanagariRange(Math.max(0, Math.round(annualTotal * 0.88)), Math.round(annualTotal * 1.12))}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] font-black text-slate-900 border-b-2 border-blue-600 pb-1 uppercase tracking-widest italic">
                            Year {i + 1}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <Card className="p-8 md:p-10 rounded-[40px] md:rounded-[48px] border border-slate-100 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-50 pb-5 mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Live Destination & Quality Snapshot
                  </h4>
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    Real-time API Signals
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">
                        Weather
                      </p>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {destinationInsight?.city ||
                          selectedMatch.location?.split(",")[0] ||
                          "Destination"}
                      </span>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-slate-900">
                        {Number.isFinite(destinationInsight?.temp)
                          ? `${Math.round(destinationInsight.temp)}┬░C`
                          : "--"}
                      </span>
                      <span className="text-sm font-bold text-slate-500 pb-1">
                        {weatherLabel}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-medium text-slate-600">
                      <div className="p-3 rounded-xl bg-white border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Local Time
                        </p>
                        {destinationInsight?.localTime || "--"}
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Distance
                        </p>
                        {destinationInsight?.distance
                          ? `${destinationInsight.distance.toLocaleString()} km`
                          : "--"}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      Quality Of Life Indexes
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      {[
                        { label: "Quality", value: qualityOfLifeIndex },
                        { label: "Safety", value: safetyIndex },
                        { label: "Healthcare", value: healthcareIndex },
                        { label: "Climate", value: climateIndex },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="p-3 rounded-xl bg-white border border-slate-100"
                        >
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            {metric.label}
                          </p>
                          <p className="text-lg font-black text-slate-900">
                            {Number.isFinite(metric.value)
                              ? metric.value.toFixed(1)
                              : "--"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Source: relocation index and destination weather APIs.
                      Values update dynamically for the selected country and
                      city.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-10 rounded-[48px] border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest italic font-bold">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Itemized Commitment Ledger
                  </h4>
                  <span className="text-[9px] font-black text-blue-600 italic">
                    Full Phase Breakdown
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                  {monthlyBuckets.map((bucket) => (
                    <div
                      key={bucket.label}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {bucket.label}
                        </p>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${bucket.color}`}
                        />
                      </div>
                      <p className="text-lg font-black text-slate-900">
                        {symbol}
                        {displayVal(bucket.value)}
                        {unit}
                      </p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                        Monthly Dynamic
                      </p>
                    </div>
                  ))}
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
                        { t: "Tuition Fee", f: "Annual", v: tuitionAnnualNpr },
                        {
                          t: "Living (Rent/Food)",
                          f: "Monthly",
                          v: livingAnnualNpr / 12,
                        },
                        {
                          t: "Health Insurance",
                          f: "One-time",
                          v: 800 * usdToNpr,
                        },
                        {
                          t: "Resource Material",
                          f: "Semester",
                          v: 500 * usdToNpr,
                        },
                        {
                          t: "Flight Estimate",
                          f: "One-time",
                          v: 1200 * usdToNpr,
                        },
                        {
                          t: "Visa Fees",
                          f: "One-time",
                          v: Math.round(
                            Math.max(
                              (apiCostEstimate?.monthly_npr ||
                                livingAnnualNpr / 12) * 1.15,
                              28000,
                            ),
                          ),
                        },
                        {
                          t: "Enrollment Fees",
                          f: "One-time",
                          v: 450 * usdToNpr,
                        },
                      ].map((item, idx) => (
                        <tr
                          key={idx}
                          className="group hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 rounded-l-2xl border-l-4 border-transparent group-hover:border-blue-600 font-bold text-slate-900">
                            {item.t}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-[9px] uppercase tracking-tighter text-slate-500">
                              {item.f}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-black text-slate-900 rounded-r-2xl">
                            {symbol}
                            {displayVal(item.v)}
                            {unit}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-600 text-white shadow-xl">
                        <td className="px-4 py-4 rounded-l-2xl font-black italic uppercase tracking-widest">
                          Aggregate Allocation
                        </td>
                        <td className="px-4 py-4" />
                        <td className="px-4 py-4 text-right font-black text-lg rounded-r-2xl">
                          {symbol} {displayVal(totalInvestmentNpr)} {unit}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="p-12 rounded-[56px] border border-blue-100 bg-[#3686FF]/5 text-slate-900 shadow-md relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                  <div className="w-28 h-28 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Trophy className="w-12 h-12 text-[#3686FF]" />
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-2xl font-black italic tracking-tight text-slate-950">
                      Financial Strategy Protocol
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                          <p className="text-sm font-medium italic">
                            Your liquidity covers 85% of Year 1 commitment
                            upfront.
                          </p>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                          <p className="text-sm font-medium italic">
                            Sponsor verified for full {selectedMatch.name}{" "}
                            degree support.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                          <p className="text-sm font-medium italic">
                            Projections account for standard inflation and cost
                            spikes.
                          </p>
                        </div>
                        <div className="flex items-start gap-4">
                          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                          <p className="text-sm font-medium italic">
                            Recommended visa proof: {symbol}
                            {displayVal(totalInvestmentNpr * 1.05)}
                            {unit}.
                          </p>
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
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight italic">
                    Audit Complete
                  </h4>
                  <p className="text-slate-500 font-medium italic mt-2">
                    Your roadmap is ready for export.
                  </p>
                </div>

                <div className="w-full p-6 rounded-3xl border border-slate-100 bg-slate-50 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Total Cost (Final Estimate)
                  </p>

                  <div className="space-y-2">
                    {finalEstimateBands.map((band) => {
                      const isSelected = band.key === selectedBandKey;
                      const minNpr = lakhToNpr(band.minLakh);
                      const maxNpr = lakhToNpr(band.maxLakh);
                      return (
                        <div
                          key={band.key}
                          className={`p-3 rounded-2xl border transition-all ${
                            isSelected
                              ? "bg-white border-blue-300 shadow-sm"
                              : "bg-transparent border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-black ${
                                isSelected ? "text-blue-700" : "text-slate-700"
                              }`}
                            >
                              {band.label}
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              {band.minLakh} - {band.maxLakh} lakh NPR
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-1">
                            {formatUsd(minNpr)} - {formatUsd(maxNpr)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-3 rounded-2xl bg-blue-600 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                      Selected Destination Band
                    </p>
                    <p className="text-sm font-black">
                      {selectedFinalBand.label}: {selectedFinalBand.minLakh} -{" "}
                      {selectedFinalBand.maxLakh} lakh NPR
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <button
                    onClick={handleSavePlan}
                    disabled={saving}
                    className={`w-full h-16 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3 italic ${saving ? "opacity-70" : ""}`}
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        SAVE PLAN & FINISH
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full h-14 bg-white text-blue-600 border-2 border-blue-600 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-3 print:hidden"
                  >
                    <Download className="w-5 h-5" />
                    Export Financial PDF
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-14 bg-slate-50 text-slate-500 rounded-3xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-100 italic print:hidden"
                  >
                    START NEW ANALYSIS
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (step === 14 && selectedMatch && financialMetrics && decisionSignals) {
      const nprRangeLakhs = (valueNpr: number, _spread = 0.12) => {
        return formatNPRDevanagari(valueNpr);
      };

      const riskFlags = [
        {
          label: "Financial Cushion",
          value:
            decisionSignals.budgetCoverage >= 115
              ? "Healthy"
              : decisionSignals.budgetCoverage >= 85
                ? "Tight"
                : "At Risk",
          score: Math.min(100, decisionSignals.budgetCoverage),
        },
        {
          label: "Admission Outlook",
          value:
            decisionSignals.admissionConfidence >= 75
              ? "Strong"
              : decisionSignals.admissionConfidence >= 60
                ? "Balanced"
                : "Competitive",
          score: decisionSignals.admissionConfidence,
        },
        {
          label: "Visa Readiness",
          value:
            decisionSignals.visaConfidence >= 72
              ? "Ready"
              : decisionSignals.visaConfidence >= 58
                ? "Needs Proof"
                : "Improve Profile",
          score: decisionSignals.visaConfidence,
        },
      ];

      const strengths = [
        decisionSignals.academicReadiness >= 70
          ? "Academic profile is in a competitive range for this destination."
          : "Academic profile is workable, but needs stronger positioning.",
        decisionSignals.destinationFit >= 65
          ? "Destination quality-of-life indicators are favorable."
          : "Destination indicators are mixed; shortlist backup cities.",
        decisionSignals.docReadiness >= 75
          ? "Core paperwork readiness is strong for filing timeline."
          : "Document readiness is partial, complete critical missing items.",
      ];

      const nextActions = [
        decisionSignals.budgetCoverage < 90
          ? "Strengthen proof-of-funds with sponsor letters or an education loan sanction."
          : "Keep 10-15% reserve above Year-1 projection for visa confidence.",
        decisionSignals.visaConfidence < 70
          ? "Improve visa narrative with clearer intent, ties to home country, and source-of-funds clarity."
          : "Prepare a structured visa file with dated financial statements and document index.",
        decisionSignals.admissionConfidence < 70
          ? "Add 1-2 safer universities in the same country to reduce outcome variance."
          : "Prioritize early application windows to maximize scholarship probability.",
      ];

      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto px-4 md:px-6 pb-32 space-y-5">
          <Card className="p-6 md:p-8 rounded-[28px] md:rounded-[36px] border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Step 14 ΓÇó Final Counselor Verdict
                </p>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-2">
                  {decisionSignals.counselorVerdict}
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Decision confidence for {selectedMatch.name} in{" "}
                  {selectedMatch.countryCode}
                </p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-blue-600 text-white text-center min-w-[170px]">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
                  Overall Confidence
                </p>
                <p className="text-4xl font-black leading-none mt-1">
                  {decisionSignals.overallConfidence}%
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {riskFlags.map((item) => (
              <Card
                key={item.label}
                className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {item.label}
                </p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <p className="text-2xl font-black text-slate-900">
                    {item.score}%
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {item.value}
                  </p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, item.score)}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40">
              <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest">
                Strengths
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                {strengths.map((text) => (
                  <li key={text} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 rounded-2xl border border-amber-100 bg-amber-50/40">
              <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest">
                Recommended Actions
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {nextActions.map((text) => (
                  <li key={text} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Year-1 Need
                </p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {nprRangeLakhs(decisionSignals.yearOneNeedNpr)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Declared Budget
                </p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {nprRangeLakhs(decisionSignals.budgetNpr)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Program Duration
                </p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {financialMetrics.graduationDuration} Years
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Destination Fit
                </p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {decisionSignals.destinationFit}%
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return null;
  };

  /* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ RENDER ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white relative font-sans selection:bg-blue-500/30 selection:text-blue-900">
      {/* Left Panel - Hero Sidebar */}
      {step < 7 && (
        <div className="relative hidden lg:flex lg:w-[45%] lg:h-[calc(100vh-112px)] lg:sticky lg:top-0 bg-white p-4 lg:p-6 lg:pr-2 animate-in fade-in slide-in-from-left duration-700">
          <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-sm group">
            <Image
              src={
                step === 1
                  ? "/country.png"
                  : step === 2
                    ? "/abrd.png"
                    : step === 3
                      ? "/studies.png"
                      : step === 4
                        ? "/graduation.png"
                        : step === 5
                          ? "/ielts.png"
                          : step === 6
                            ? "/intake.png"
                            : "/abroad.jpg"
              }
              alt={
                step === 1
                  ? "Study Destinations"
                  : step === 2
                    ? "Study Level"
                    : step === 3
                      ? "Program Selection"
                      : step === 4
                        ? "Academic History"
                        : step === 5
                          ? "English proficiency"
                          : step === 6
                            ? "Target Intake"
                            : "Global Destinations"
              }
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              priority
            />
            
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10 pointer-events-none" />

            <div className="absolute bottom-10 left-10 right-10 z-20 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[28px] shadow-2xl max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
              <p className="text-white text-lg font-medium leading-relaxed italic mb-8">
                &ldquo;AbroadLift made my application process simple and
                stress-free. The intake selection were exactly what I
                needed.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-400 overflow-hidden border-2 border-white/40">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Sarah Jenkins
                  </h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    Master&apos;s Class of 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Right Panel - Dynamic Flow Area */}
      <div
        className={`relative flex-1 flex flex-col bg-white min-h-0 overflow-x-hidden`}
      >
        {/* Simple Top Navigation Navbar matching the minimalist screenshot */}
        {step > 0 &&
          step !== 7 &&
          step !== 8 &&
          step !== 9 &&
          step !== 10 &&
          step !== 11 &&
          step !== 12 && (
            <div className="px-6 py-4 mt-3 lg:px-12 flex flex-col items-center justify-center gap-3 z-30 print:hidden relative bg-white">
              <div className="w-full flex justify-between items-center">
                <div className="w-12 h-10 flex items-center">
                  {step > 0 && step < 7 && (
                    <button
                      onClick={handleBack}
                      className="text-slate-900 transition-colors hover:text-blue-500 flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                    </button>
                  )}
                  {step > 7 && step !== 9 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="text-slate-900 transition-colors hover:text-blue-500 flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                    </button>
                  )}
                </div>
                <div className="flex-1 flex justify-center text-center">
                  {step > 0 && step < 7 && (
                    <span className="text-[20px] font-extrabold text-[#111827] tracking-tight">
                      {STEPS[step]?.label}
                    </span>
                  )}
                </div>
                <div className="w-12"></div>
              </div>
              
              {/* Progress Header - Now clearly centered below title */}
              {step > 0 && step < 7 && (
                <div className="flex items-center gap-1.5 mt-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-[4px] rounded-full transition-all duration-500 ease-out ${
                        i + 1 === step
                          ? "w-8 bg-blue-600"
                          : i + 1 < step
                            ? "w-8 bg-blue-600/30"
                            : "w-8 bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Step Content Area */}
        <div
          className={`flex-1 overflow-y-auto ${step >= 7 ? "px-0 lg:px-0 pt-0 pb-[100px] md:pb-[120px]" : "px-6 lg:px-12 pt-3 pb-[160px] md:pb-[200px]"} overflow-x-hidden min-h-0 hide-scrollbar`}
        >
          <div
            className={`${step >= 7 ? "max-w-full" : "max-w-4xl"} mx-auto min-h-full flex flex-col`}
          >
            <div className="flex-1">{renderStep()}</div>
          </div>
        </div>

        {/* Step Navigation Footer - Absolute positioned inside Right Panel on desktop */}
        {step > 0 && step < 7 && (
          <div
            className={`fixed lg:left-[45%] lg:w-[55%] bottom-0 left-0 right-0 w-full pb-8 px-6 md:pb-12 bg-white/95 backdrop-blur-md pt-4 z-[70] border-t border-slate-100 flex justify-center shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]`}
          >
            <div className="w-full max-w-[340px] flex justify-center pt-0">
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`w-full h-14 rounded-[30px] font-bold text-[16px] transition-all flex items-center justify-center tracking-wide ${
                  canContinue()
                    ? "bg-[#3686FF] text-white shadow-[0_8px_20px_-6px_rgba(59,130,246,0.35)]"
                    : "bg-[#eff5fd] text-[#9ca3af] cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step >= 8 && step <= 14 && (
          <div className="fixed lg:absolute bottom-0 left-0 right-0 w-full pb-6 px-4 md:pb-8 md:px-6 bg-white/90 backdrop-blur-md pt-3 z-[70] border-t border-slate-100 flex justify-center shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="w-full max-w-[520px] flex justify-center">
              <button
                onClick={handleNext}
                disabled={step === 14}
                className={`w-full h-14 rounded-[24px] font-bold text-[15px] transition-all flex items-center justify-center tracking-wide ${
                  step === 14
                    ? "bg-[#eff5fd] text-[#9ca3af] cursor-not-allowed"
                    : "bg-[#3686FF] text-white shadow-[0_8px_20px_-6px_rgba(59,130,246,0.35)]"
                }`}
              >
                {step === 14 ? "Final Step Reached" : "Next Step"}
              </button>
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
}
