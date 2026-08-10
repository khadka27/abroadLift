/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  FileText,
  MessageSquare,
  CheckSquare,
  Award,
  Bookmark,
  Globe,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Upload,
  Send,
  Download,
  BookOpen,
  Heart,
  MapPin,
  Sparkles,
  Bell,
  HelpCircle,
  Pencil,
  Phone,
  Mail,
  Calendar,
  Shield,
  Loader2,
  ChevronLeft,
  Circle,
  Check,
  X,
  FileUp,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  GraduationCap,
  Lightbulb,
  Rocket,
  Paperclip,
  Menu,
  ArrowLeftRight,
  Scale,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { formatNPRDevanagari } from "@/lib/currency";
import PremiumLoader from "@/components/PremiumLoader";
import { FlagIcon } from "@/components/matches/FlagIcon";

const formatDegree = (deg: string) => {
  if (!deg) return "Bachelor's";
  const mapping: Record<string, string> = {
    masters_degree: "Master's Degree",
    doctoral_phd: "Doctoral / PhD",
    bachelors: "Bachelor's",
    "3_year_bachelors": "3-Yr Bachelor's",
    post_graduate_diploma: "Postgrad Diploma",
    post_graduate_certificate: "Postgrad Certificate",
    diploma: "Diploma",
    advanced_diploma: "Advanced Diploma",
    integrated_masters: "Integrated Master's",
    certificate: "Certificate",
    english: "ESL Language"
  };
  const key = deg.toLowerCase();
  return mapping[key] || deg.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

const formatTestType = (t: string) => {
  if (!t) return "";
  const upper = t.toUpperCase();
  if (upper.includes("PTE")) return "PTE";
  if (upper.includes("IELTS")) return "IELTS";
  if (upper.includes("TOEFL")) return "TOEFL";
  if (upper.includes("DUOLINGO")) return "DET";
  return t;
};

/* ─── Types ─────────────────────────────────────────────────── */

type TabKey =
  | "dashboard"
  | "matches"
  | "compare"
  | "applications"
  | "documents"
  | "messages"
  | "tasks"
  | "scholarships"
  | "saved-universities"
  | "visa-assistance"
  | "profile"
  | "settings";

type ApplicationStage = "Draft" | "Submitted" | "Under Review" | "Offer Received" | "Rejected" | "Accepted";

interface Application {
  id: string;
  universityName: string;
  country: string;
  programName: string;
  stage: ApplicationStage;
  appliedDate: string;
  logoUrl?: string;
}

interface DocumentSlot {
  id: string;
  name: string;
  category: string;
  status: "Pending" | "Uploaded" | "Draft";
  fileName?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

interface Message {
  id: string;
  sender: "student" | "counselor";
  text: string;
  timestamp: string;
}

interface Scholarship {
  id: string;
  name: string;
  awardAmount: string;
  eligibility: string;
  deadline: string;
  country: string;
}

interface ProfileState {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  currentCountry: string;
  dateOfBirth: string;
  firstLanguage: string;
  maritalStatus: string;
  gender: string;
  passportNumber: string;
  passportReady: boolean;
  highestEducation: string;
  passingYear: string;
  gpa: string;
  backlogs: string;
  studyGap: string;
  preferredCountry: string;
  degreeLevel: string;
  field: string;
  program: string;
  intake: string;
  hasEnglishTest: boolean | null;
  testType: string;
  englishScore: string;
  yearlyBudget: string;
  currency: string;
  docsReady: boolean;
  admissionProb: number | null;
  visaSuccessProb: number | null;
  // New fields
  middleName: string;
  passportExpiryDate: string;
  addressLine: string;
  cityTown: string;
  provinceState: string;
  postalZipCode: string;
  countryOfEducation: string;
  graduatedInstitution: boolean;
  workStatus: string;
  companyName: string;
  jobTitle: string;
  workExperience: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyEmail: string;
  prefersEmail: boolean;
  prefersSMS: boolean;
  // Financial synchronization
  bankBalance: string;
  sponsorType: string;
  sponsorIncome: string;
  scholarshipNeeded: boolean;
}

const DEFAULT_PROFILE: ProfileState = {
  name: "",
  username: "",
  email: "",
  phoneNumber: "",
  nationality: "",
  currentCountry: "",
  dateOfBirth: "",
  firstLanguage: "",
  maritalStatus: "",
  gender: "",
  passportNumber: "",
  passportReady: false,
  highestEducation: "",
  passingYear: "",
  gpa: "",
  backlogs: "0",
  studyGap: "0",
  preferredCountry: "",
  degreeLevel: "",
  field: "",
  program: "",
  intake: "",
  hasEnglishTest: null,
  testType: "IELTS",
  englishScore: "",
  yearlyBudget: "",
  currency: "USD",
  docsReady: false,
  admissionProb: null,
  visaSuccessProb: null,
  // New fields
  middleName: "",
  passportExpiryDate: "",
  addressLine: "",
  cityTown: "",
  provinceState: "",
  postalZipCode: "",
  countryOfEducation: "",
  graduatedInstitution: false,
  workStatus: "",
  companyName: "",
  jobTitle: "",
  workExperience: "0",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
  emergencyEmail: "",
  prefersEmail: true,
  prefersSMS: false,
  // Financial synchronization
  bankBalance: "",
  sponsorType: "",
  sponsorIncome: "",
  scholarshipNeeded: false,
};

function DashboardInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as TabKey);
    }
  }, [tabParam]);
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotify, setSavedNotify] = useState(false);
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE);
  const [errorMsg, setErrorMsg] = useState("");

  const isNegativeVal = (val: string | number | undefined | null): boolean => {
    if (val === undefined || val === null || val === "") return false;
    const num = typeof val === "number" ? val : parseFloat(val.toString());
    return !isNaN(num) && num < 0;
  };
  
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-1",
      universityName: "Conestoga College",
      country: "Canada",
      programName: "Bachelor of Applied Health Information Science",
      stage: "Under Review",
      appliedDate: "2026-05-15",
    },
    {
      id: "app-2",
      universityName: "Seneca College",
      country: "Canada",
      programName: "Advanced Diploma in Computer Programming & Analysis",
      stage: "Offer Received",
      appliedDate: "2026-06-01",
    }
  ]);

  const [documents, setDocuments] = useState<DocumentSlot[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [dragOverDocId, setDragOverDocId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "task-1", title: "Complete Personal Profile details", completed: true, dueDate: "2026-06-20" },
    { id: "task-2", title: "Upload Passport scan", completed: true, dueDate: "2026-06-25" },
    { id: "task-3", title: "Finalize Statement of Purpose (SOP)", completed: false, dueDate: "2026-07-05" },
    { id: "task-4", title: "Pay Conestoga application fee", completed: false, dueDate: "2026-07-10" },
    { id: "task-5", title: "Schedule mock visa interview with counselor", completed: false, dueDate: "2026-07-15" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", sender: "counselor", text: "Hello! Welcome to AbroadLift. I am your study-abroad counselor.", timestamp: "10:30 AM" },
    { id: "msg-2", sender: "student", text: "Hi! Thanks. I am interested in computer and health informatics programs in Canada.", timestamp: "10:32 AM" },
    { id: "msg-3", sender: "counselor", text: "Awesome choice. I have reviewed your GPA and IELTS scores; your profile is very strong. I suggest shortlisting Conestoga and Seneca College. Let's work on finalizing your SOP this week.", timestamp: "10:35 AM" },
  ]);
  
  const [typedMessage, setTypedMessage] = useState("");
  const [savedMatches, setSavedMatches] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<ProfileState>(DEFAULT_PROFILE);
  const [profileSubTab, setProfileSubTab] = useState<number>(0);

  const [matches, setMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [filterCountry, setFilterCountry] = useState("");
  const [filterDegree, setFilterDegree] = useState("");
  const [launchingId, setLaunchingId] = useState<string | number | null>(null);

  // Redesigned Support & Settings State Variables
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState<"account" | "notifications" | "security" | "system">("account");
  const [avatarTheme, setAvatarTheme] = useState<string>("ocean");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [show2faModal, setShow2faModal] = useState<boolean>(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState<boolean>(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false);
  const [darkModeSimulated, setDarkModeSimulated] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const triggerLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      await signOut({ redirect: false });
      router.replace("/login");
    }, 850);
  };
  const [chatSearch, setChatSearch] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("general");
  const [whatsappNotifications, setWhatsappNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);
  const [weeklyReportNotifications, setWeeklyReportNotifications] = useState<boolean>(true);
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // ─── Compare Tool State & Presets ─────────────────────────────
  const [compareSubTab, setCompareSubTab] = useState<"profiles" | "universities">("profiles");
  const [selectedProfile1Id, setSelectedProfile1Id] = useState<string>("current");
  const [selectedProfile2Id, setSelectedProfile2Id] = useState<string>("preset_ivy");
  const [selectedUni1Id, setSelectedUni1Id] = useState<string>("uni_conestoga");
  const [selectedUni2Id, setSelectedUni2Id] = useState<string>("uni_seneca");

  const allCompareProfiles = useMemo(() => {
    const defaultCurrent = {
      id: "current",
      name: profile.name ? `${profile.name} (Active Profile)` : "Active Profile",
      gpa: profile.gpa || "3.50",
      highestEducation: profile.highestEducation || "Bachelor's",
      testType: profile.testType || "IELTS",
      englishScore: profile.englishScore || "7.0",
      yearlyBudget: profile.yearlyBudget || "30000",
      bankBalance: profile.bankBalance || "3500000",
      backlogs: profile.backlogs || "0",
      studyGap: profile.studyGap || "0",
      sponsorType: profile.sponsorType || "Self & Family",
      sponsorIncome: profile.sponsorIncome || "1500000",
      admissionProb: profile.admissionProb || 86,
      visaSuccessProb: profile.visaSuccessProb || 92,
      degreeLevel: profile.degreeLevel || "Master's",
      preferredCountry: profile.preferredCountry || "Canada",
    };

    const presets = [
      defaultCurrent,
      {
        id: "preset_ivy",
        name: "Benchmark: Tier-1 Ivy / Research Applicant",
        gpa: "3.88",
        highestEducation: "4-Yr Honors Bachelor",
        testType: "IELTS",
        englishScore: "8.0",
        yearlyBudget: "48000",
        bankBalance: "6500000",
        backlogs: "0",
        studyGap: "0",
        sponsorType: "Parental Business Account",
        sponsorIncome: "3500000",
        admissionProb: 88,
        visaSuccessProb: 94,
        degreeLevel: "Master's",
        preferredCountry: "USA",
      },
      {
        id: "preset_polytechnic",
        name: "Benchmark: Canada College Applicant",
        gpa: "3.20",
        highestEducation: "3-Yr Bachelor",
        testType: "PTE",
        englishScore: "65",
        yearlyBudget: "22000",
        bankBalance: "3800000",
        backlogs: "1",
        studyGap: "1",
        sponsorType: "Self & Property Equity",
        sponsorIncome: "1800000",
        admissionProb: 94,
        visaSuccessProb: 89,
        degreeLevel: "Postgrad Diploma",
        preferredCountry: "Canada",
      },
      {
        id: "preset_scholarship",
        name: "Benchmark: Presidential Merit Scholar",
        gpa: "3.95",
        highestEducation: "B.Sc Engineering",
        testType: "TOEFL",
        englishScore: "108",
        yearlyBudget: "18000",
        bankBalance: "2800000",
        backlogs: "0",
        studyGap: "0",
        sponsorType: "Merit Fellowship & Self",
        sponsorIncome: "1200000",
        admissionProb: 91,
        visaSuccessProb: 86,
        degreeLevel: "Master's",
        preferredCountry: "Germany / Europe",
      },
    ];

    savedMatches.forEach((item) => {
      presets.push({
        id: `saved_profile_${item.id}`,
        name: `Saved Match: ${item.matchData?.name || "University Match"}`,
        gpa: item.formData?.gpa || "3.5",
        highestEducation: item.formData?.highestEducation || "Bachelor's",
        testType: item.formData?.testType && item.formData?.testType !== "NONE" ? item.formData.testType : "IELTS",
        englishScore: item.formData?.testScore || "7.0",
        yearlyBudget: item.formData?.budget || "30000",
        bankBalance: item.formData?.bankBalance || "3500000",
        backlogs: item.formData?.backlogs || "0",
        studyGap: item.formData?.studyGap || "0",
        sponsorType: item.formData?.sponsorType || "Self",
        sponsorIncome: item.formData?.sponsorIncome || "1500000",
        admissionProb: item.admissionChance || 85,
        visaSuccessProb: item.visaSuccess || 90,
        degreeLevel: item.formData?.degree || "Master's",
        preferredCountry: item.formData?.countries?.[0] || "Canada",
      });
    });

    return presets;
  }, [profile, savedMatches]);

  const allCompareUniversities = useMemo(() => {
    const presets = [
      {
        id: "uni_conestoga",
        name: "Conestoga College",
        location: "Kitchener-Waterloo, Ontario",
        countryCode: "CA",
        tuitionFeeUsd: 17500,
        livingFeeUsd: 11000,
        durationYears: 2,
        acceptanceRate: "85%",
        admissionMatchScore: 92,
        visaConfidence: 91,
        ranking: "#1 Ontario College for Graduate Employment",
        popularProgram: "Applied Health & Information Technology",
        scholarshipStatus: "Up to $3,000 Entrance Award",
        weather: "16°C Clear",
        safetyScore: 8.5,
      },
      {
        id: "uni_seneca",
        name: "Seneca Polytechnic",
        location: "Toronto, Ontario",
        countryCode: "CA",
        tuitionFeeUsd: 18200,
        livingFeeUsd: 13500,
        durationYears: 2,
        acceptanceRate: "82%",
        admissionMatchScore: 88,
        visaConfidence: 89,
        ranking: "Top-Rated Tech & Innovation Campus in Toronto",
        popularProgram: "Computer Programming & Software Engineering",
        scholarshipStatus: "$2,000 Global Entrance Award",
        weather: "18°C Mild",
        safetyScore: 8.2,
      },
      {
        id: "uni_duluth",
        name: "University of Minnesota Duluth",
        location: "Duluth, Minnesota",
        countryCode: "US",
        tuitionFeeUsd: 21400,
        livingFeeUsd: 10500,
        durationYears: 4,
        acceptanceRate: "79%",
        admissionMatchScore: 84,
        visaConfidence: 86,
        ranking: "#17 Regional University Midwest (US News)",
        popularProgram: "B.S. Computer Science / Data Analytics",
        scholarshipStatus: "Non-Resident Tuition Discount",
        weather: "12°C Crisp",
        safetyScore: 9.0,
      },
      {
        id: "uni_northeastern",
        name: "Northeastern University",
        location: "Boston, Massachusetts",
        countryCode: "US",
        tuitionFeeUsd: 36800,
        livingFeeUsd: 16000,
        durationYears: 2,
        acceptanceRate: "68%",
        admissionMatchScore: 78,
        visaConfidence: 94,
        ranking: "#44 National Universities (R1 Research)",
        popularProgram: "M.S. Information Systems & Co-Op Program",
        scholarshipStatus: "Dean's Merit Scholarship Available",
        weather: "20°C Pleasant",
        safetyScore: 8.7,
      },
    ];

    savedMatches.forEach((item) => {
      if (item.matchData) {
        presets.push({
          id: `saved_uni_${item.id}`,
          name: item.matchData.name || item.matchData.schoolName || "Saved University",
          location: item.matchData.location || item.matchData.city || "Canada",
          countryCode: item.matchData.countryCode || item.formData?.countries?.[0] || "CA",
          tuitionFeeUsd: item.matchData.tuitionFeeUsd || item.matchData.tuitionFee || 18000,
          livingFeeUsd: 12000,
          durationYears: item.matchData.durationYears || 2,
          acceptanceRate: item.matchData.acceptanceRate || "80%",
          admissionMatchScore: item.admissionChance || 85,
          visaConfidence: item.visaSuccess || 90,
          ranking: item.matchData.ranking || "Accredited University Match",
          popularProgram: item.formData?.program || "Undergraduate / Graduate Program",
          scholarshipStatus: "Institutional Entrance Aid Available",
          weather: "17°C Moderate",
          safetyScore: 8.4,
        });
      }
    });

    return presets;
  }, [savedMatches]);
  
  // Custom styled gradient mapping for User Avatars
  const avatarThemeClasses: Record<string, string> = {
    sunset: "from-amber-500 to-rose-500 shadow-rose-500/20",
    ocean: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    emerald: "from-emerald-400 to-teal-600 shadow-teal-500/20",
    grape: "from-purple-500 to-indigo-700 shadow-indigo-500/20",
    crimson: "from-rose-500 to-red-700 shadow-red-500/20",
    slate: "from-slate-600 to-slate-800 shadow-slate-500/20"
  };
  
  const currentAvatarGradient = avatarThemeClasses[avatarTheme] || avatarThemeClasses.ocean;

  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, text: "None", color: "bg-slate-200", textColor: "text-slate-400" };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) return { score, text: "Weak", color: "bg-rose-500", textColor: "text-rose-500" };
    if (score <= 4) return { score, text: "Medium", color: "bg-amber-500", textColor: "text-amber-500" };
    return { score, text: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500" };
  }, [newPassword]);


  const filteredShortlists = useMemo(() => {
    return savedMatches.filter((m) => {
      const mCountry = m.formData?.countries?.[0] || m.matchData?.countryCode || "";
      const countryCodeMap: Record<string, string> = {
        canada: "CA",
        usa: "US",
        "united kingdom": "GB",
        uk: "GB",
        australia: "AU",
        germany: "DE",
        ireland: "IE",
        malta: "MT"
      };

      let passCountry = true;
      if (filterCountry) {
        const targetCode = filterCountry.toUpperCase();
        const matchCode = (mCountry.length === 2 ? mCountry : (countryCodeMap[mCountry.toLowerCase()] || "")).toUpperCase();
        passCountry = matchCode === targetCode;
      }

      let passDegree = true;
      if (filterDegree) {
        const rawDegree = m.formData?.degree || "bachelors";
        const degreeLower = rawDegree.toLowerCase();
        if (filterDegree === "master") {
          passDegree = degreeLower.includes("master");
        } else if (filterDegree === "bachelor") {
          passDegree = degreeLower.includes("bachelor");
        } else if (filterDegree === "diploma") {
          passDegree = degreeLower.includes("diploma");
        }
      }

      return passCountry && passDegree;
    });
  }, [savedMatches, filterCountry, filterDegree]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      void fetchProfileData();
      void fetchRecommendedMatches();
      void fetchDocuments();
    }
  }, [status]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const p = data.profile || {};
        const stateData: ProfileState = {
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phoneNumber: data.phoneE164 || data.phoneNumber || "",
          nationality: p.nationality || "",
          currentCountry: p.currentCountry || "",
          dateOfBirth: p.dob ? new Date(p.dob).toISOString().slice(0, 10) : "",
          firstLanguage: p.firstLanguage || "",
          maritalStatus: p.maritalStatus || "",
          gender: p.gender || "",
          passportNumber: p.passportNumber || "",
          passportReady: p.passportReady ?? false,
          highestEducation: p.highestEducation || "",
          passingYear: p.passingYear?.toString() || "",
          gpa: p.gpa?.toString() || "",
          backlogs: p.backlogs?.toString() || "0",
          studyGap: p.studyGap?.toString() || "0",
          preferredCountry: p.preferredCountry || "",
          degreeLevel: p.degreeLevel || "",
          field: p.field || "",
          program: p.program || "",
          intake: p.intake || "",
          hasEnglishTest: typeof p.hasEnglishTest === "boolean" ? p.hasEnglishTest : null,
          testType: p.testType || "IELTS",
          englishScore: p.englishScore?.toString() || "",
          yearlyBudget: p.yearlyBudget?.toString() || "",
          currency: p.currency || "USD",
          docsReady: p.docsReady ?? false,
          admissionProb: p.admissionProb || null,
          visaSuccessProb: p.visaSuccessProb || null,
          // New fields
          middleName: p.middleName || "",
          passportExpiryDate: p.passportExpiryDate || "",
          addressLine: p.addressLine || "",
          cityTown: p.cityTown || "",
          provinceState: p.provinceState || "",
          postalZipCode: p.postalZipCode || "",
          countryOfEducation: p.countryOfEducation || "",
          graduatedInstitution: p.graduatedInstitution ?? false,
          workStatus: p.workStatus || "",
          companyName: p.companyName || "",
          jobTitle: p.jobTitle || "",
          workExperience: p.workExperience?.toString() || "0",
          emergencyName: p.emergencyName || "",
          emergencyRelation: p.emergencyRelation || "",
          emergencyPhone: p.emergencyPhone || "",
          emergencyEmail: p.emergencyEmail || "",
          prefersEmail: p.prefersEmail ?? true,
          prefersSMS: p.prefersSMS ?? false,
          bankBalance: p.bankBalance?.toString() || "",
          sponsorType: p.sponsorType || "",
          sponsorIncome: p.sponsorIncome?.toString() || "",
          scholarshipNeeded: p.scholarshipNeeded ?? false,
        };
        setProfile(stateData);
        setEditForm(stateData);
        setSettingsForm({
          name: data.name || stateData.name || "",
          email: data.email || stateData.email || "",
          phone: data.phoneE164 || data.phoneNumber || stateData.phoneNumber || "",
        });
        setSavedMatches(Array.isArray(data.matchingRecords) ? data.matchingRecords : []);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedMatches = async () => {
    setMatchesLoading(true);
    try {
      const res = await fetch("/api/matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMatchesLoading(false);
    }
  };

  const profileCompleteness = useMemo(() => {
    const fields = [
      profile.name,
      profile.email,
      profile.phoneNumber,
      profile.nationality,
      profile.currentCountry,
      profile.dateOfBirth,
      profile.highestEducation,
      profile.gpa,
      profile.preferredCountry,
      profile.degreeLevel,
      profile.yearlyBudget,
      profile.passportNumber,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const firstName = useMemo(() => {
    return profile.name.split(" ")[0] || "Student";
  }, [profile.name]);

  const taskCompletion = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const nextRecommendedStep = useMemo(() => {
    if (profileCompleteness < 65) {
      return {
        title: "Step 1: Complete Your Academic Profile",
        description: `Your profile is only ${profileCompleteness}% complete. Fill out your GPA, test scores, and preferred countries so we can find accurate university matches.`,
        cta: "Fill Profile Details",
        tab: "profile" as TabKey,
        icon: User,
        color: "from-blue-500/10 to-indigo-500/5 border-blue-100",
        btnColor: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
        iconColor: "text-blue-600 bg-blue-50"
      };
    }
    const uploadedDocs = documents.filter((d) => d.status === "Uploaded").length;
    if (uploadedDocs < 3) {
      return {
        title: "Step 2: Upload Required Documents",
        description: `You've uploaded ${uploadedDocs} of ${documents.length} essential files. Securely upload your Passport and Academic Transcripts to qualify for applications.`,
        cta: "Go to Document Locker",
        tab: "documents" as TabKey,
        icon: FileText,
        color: "from-violet-500/10 to-purple-500/5 border-violet-100",
        btnColor: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20",
        iconColor: "text-violet-600 bg-violet-50"
      };
    }
    if (savedMatches.length === 0) {
      return {
        title: "Step 3: Discover Your University Matches",
        description: "You haven't saved any university match evaluations yet. Run our smart evaluation wizard to check your admissibility odds and save targets.",
        cta: "Find Matches Now",
        tab: "matches" as TabKey,
        icon: Compass,
        color: "from-emerald-500/10 to-teal-500/5 border-emerald-100",
        btnColor: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
        iconColor: "text-emerald-600 bg-emerald-50"
      };
    }
    if (applications.length === 0) {
      return {
        title: "Step 4: Start College Applications",
        description: "Your matches look strong! Draft and submit your application folder to your shortlisted universities to initiate the enrollment process.",
        cta: "Start Application Form",
        tab: "applications" as TabKey,
        icon: Briefcase,
        color: "from-amber-500/10 to-orange-500/5 border-amber-100",
        btnColor: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
        iconColor: "text-amber-600 bg-amber-50"
      };
    }
    return {
      title: "Step 5: Prepare Visa Guidelines",
      description: "You are on track with your admissions! Review the visa roadmap, open your GIC escrow account, and start preparing supporting documents.",
      cta: "View Visa Roadmap",
      tab: "visa-assistance" as TabKey,
      icon: Globe,
      color: "from-slate-500/10 to-slate-600/5 border-slate-200",
      btnColor: "bg-slate-800 hover:bg-slate-900 shadow-slate-800/20",
      iconColor: "text-slate-800 bg-slate-100"
    };
  }, [profileCompleteness, documents, savedMatches, applications]);

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || typedMessage;
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    if (!customText) setTypedMessage("");

    // Context-aware replies for suggestion chips
    let replyText = "Thanks for checking in! I am reviewing your request and will follow up with the admissions team. I'll get back to you shortly.";
    const lowerText = textToSend.toLowerCase();
    if (lowerText.includes("sop") || lowerText.includes("purpose")) {
      replyText = "Certainly! Please upload your draft in the 'Documents' tab. I will review your structure, grammar, and/or template with Canadian university requirements. Let's aim to finalize it by Friday.";
    } else if (lowerText.includes("visa")) {
      replyText = "I've checked your roadmap. Since you're targeting Canada, we need to set up your GIC and pay the tuition fee first. Have you prepared your sponsor's source of funds documentation? I can schedule a mock visa interview for you when you're ready.";
    } else if (lowerText.includes("scholarship")) {
      replyText = `Based on your GPA of ${profile?.gpa || "3.5"}, you qualify for several entrance scholarships. Let's look at the 'Scholarships' tab to apply for the Ontario Graduate Scholarship or college-specific merit awards.`;
    } else if (lowerText.includes("document") || lowerText.includes("upload")) {
      replyText = "I see you've uploaded your Transcripts. We still need your English Test Report and Statement of Purpose. Once those are ready, we can submit your applications!";
    }

    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "counselor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleSaveSettings = () => {
    setProfile((prev) => ({
      ...prev,
      name: settingsForm.name,
    }));
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
    }, 3000);
  };

  const fetchDocuments = async () => {
    setDocsLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.documents)) {
          setDocuments(
            data.documents.map((d: any) => ({
              id: d.id,
              name: d.name,
              category: d.category,
              status: d.status as "Pending" | "Uploaded" | "Draft",
              fileName: d.fileName || undefined,
              fileUrl: d.fileUrl || undefined,
              uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toISOString().slice(0, 10) : undefined,
            }))
          );
        }
      }
    } catch (e) {
      console.error("Failed to fetch documents", e);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleUploadFile = async (docId: string, file: File) => {
    setUploadingDocId(docId);
    try {
      const fd = new FormData();
      fd.append("docId", docId);
      fd.append("file", file);
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        const d = data.document;
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  status: "Uploaded" as const,
                  fileName: d.fileName,
                  fileUrl: d.fileUrl || undefined,
                  uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toISOString().slice(0, 10) : undefined,
                }
              : doc
          )
        );
        const currentUploaded = documents.filter((d) => d.status === "Uploaded").length + 1;
        if (currentUploaded >= 4) {
          setTasks((prev) => prev.map((t) => (t.id === "task-2" ? { ...t, completed: true } : t)));
        }
      }
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleRemoveFile = async (docId: string) => {
    try {
      await fetch(`/api/documents?id=${docId}`, { method: "DELETE" });
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "Pending" as const, fileName: undefined, uploadedAt: undefined }
            : doc
        )
      );
    } catch (e) {
      console.error("Remove failed", e);
    }
  };

  const handleMockUpload = (docId: string) => {
    const fileNames = ["passport_scanned_v3.pdf", "official_transcript_stamp.pdf", "recommendation_prof.pdf", "sop_statement_v2.docx", "cv_academic_professional.pdf"];
    const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    setDocuments(
      documents.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "Uploaded",
              fileName: randomFile,
              uploadedAt: new Date().toISOString().slice(0, 10),
            }
          : doc
      )
    );

    const currentUploaded = documents.filter(d => d.status === "Uploaded").length + 1;
    if (currentUploaded >= 4) {
      setTasks(tasks.map(t => t.id === "task-2" ? { ...t, completed: true } : t));
    }
  };

  const handleApplyMatch = (matchItem: any) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      universityName: matchItem.name,
      country: matchItem.countryCode || "Canada",
      programName: matchItem.popularPrograms?.[0] || profile.program || "Bachelor Program",
      stage: "Draft",
      appliedDate: new Date().toISOString().slice(0, 10),
    };
    setApplications([newApp, ...applications]);
    setActiveTab("applications");
  };

  const handleLoadSavedProfile = (record: any) => {
    router.push(`/matches?profileId=${record.id}`);
  };

  const handleDeleteSavedProfile = async (recordId: string) => {
    try {
      const res = await fetch(`/api/matches/save?id=${recordId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedMatches((prev) => prev.filter((item) => item.id !== recordId));
      }
    } catch (e) {
      console.error("Failed to delete saved match profile:", e);
    }
  };

  // Dynamic launch helper: saves directly to database, then redirects to step 8
  const handleLaunchRecommendedUniversity = async (uniItem: any) => {
    setLaunchingId(uniItem.id);
    try {
      const targetCountries = profile.preferredCountry ? [profile.preferredCountry] : (uniItem.countryCode ? [uniItem.countryCode] : ["CA"]);
      
      const matchesForm = {
        name: profile.name || "Student",
        email: profile.email || "",
        nationality: profile.nationality || "Nepal",
        currentCountry: profile.currentCountry || "Nepal",
        highestEducation: profile.highestEducation || "bachelor",
        passingYear: profile.passingYear || "2024",
        gpa: profile.gpa || "3.5",
        backlogs: profile.backlogs || "0",
        studyGap: profile.studyGap || "0",
        testType: profile.testType || "IELTS",
        testScore: profile.englishScore || "7.0",
        aptitudeTest: "NONE",
        greVerbal: "",
        greQuant: "",
        greAwa: "",
        gmatTotal: "",
        degree: profile.degreeLevel || "master",
        field: profile.field || "computer",
        program: profile.program || "Information Technology",
        intake: profile.intake || "Fall 2026",
        budget: profile.yearlyBudget || "30000",
        bankBalance: "3500000",
        sponsorType: "Self",
        sponsorIncome: "1500000",
        duration: "2",
        scholarship: false,
        testDone: true,
        docsReady: profile.docsReady,
        countries: targetCountries,
        hasEnglishTest: profile.hasEnglishTest ?? true,
      };

      // Save directly to the database first
      const response = await fetch("/api/matches/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: matchesForm, matchData: uniItem }),
      });

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && resJson.id) {
          // Saved successfully, redirect to matches with database profile record ID
          router.push(`/matches?profileId=${resJson.id}`);
          return;
        }
      }
      
      // LocalStorage fallback only if API fails
      const dataToStore = {
        form: matchesForm,
        selectedMatch: uniItem,
        matches: [uniItem],
        step: 8,
      };
      localStorage.setItem("abroadlift_match_data", JSON.stringify(dataToStore));
      localStorage.setItem("abroadlift_return_step", "8");
      router.push("/matches");
    } catch (e) {
      console.error("Failed to save and launch matches profile:", e);
    } finally {
      setLaunchingId(null);
    }
  };

  const handleSaveProfile = async (exitEditMode = false) => {
    setSaving(true);
    setErrorMsg("");

    // Validate non-negative numbers
    const budgetVal = editForm.yearlyBudget ? parseFloat(editForm.yearlyBudget) : NaN;
    const bankVal = editForm.bankBalance ? parseFloat(editForm.bankBalance) : NaN;
    const incomeVal = editForm.sponsorIncome ? parseFloat(editForm.sponsorIncome) : NaN;
    const gpaVal = editForm.gpa ? parseFloat(editForm.gpa) : NaN;
    const engVal = editForm.englishScore ? parseFloat(editForm.englishScore) : NaN;
    const backlogsVal = editForm.backlogs ? parseInt(editForm.backlogs, 10) : NaN;
    const gapVal = editForm.studyGap ? parseInt(editForm.studyGap, 10) : NaN;
    const workExpVal = editForm.workExperience ? parseInt(editForm.workExperience, 10) : NaN;

    // Validate DOB (non-future and age 16+)
    const todayStr = new Date().toISOString().slice(0, 10);
    if (editForm.dateOfBirth) {
      if (editForm.dateOfBirth > todayStr) {
        setErrorMsg("Date of birth cannot be in the future.");
        setSaving(false);
        return;
      }
      const dobDate = new Date(editForm.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (isNaN(dobDate.getTime()) || age < 16) {
        setErrorMsg("Date of birth is invalid. Applicants must be at least 16 years old (Age 16+).");
        setSaving(false);
        return;
      }
    }

    if (
      (!isNaN(budgetVal) && budgetVal < 0) ||
      (!isNaN(bankVal) && bankVal < 0) ||
      (!isNaN(incomeVal) && incomeVal < 0) ||
      (!isNaN(gpaVal) && gpaVal < 0) ||
      (!isNaN(engVal) && engVal < 0) ||
      (!isNaN(backlogsVal) && backlogsVal < 0) ||
      (!isNaN(gapVal) && gapVal < 0) ||
      (!isNaN(workExpVal) && workExpVal < 0)
    ) {
      setErrorMsg("Amount, budget, bank balance, GPA, scores, and experience values cannot be negative numbers.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          countries: editForm.preferredCountry ? [editForm.preferredCountry] : [],
          degree: editForm.degreeLevel,
          budget: editForm.yearlyBudget,
          dob: editForm.dateOfBirth || null,
        }),
      });
      if (res.ok) {
        setProfile(editForm);
        if (exitEditMode) {
          setIsEditingProfile(false);
        }
        setSavedNotify(true);
        setTimeout(() => setSavedNotify(false), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to save profile.");
      }
    } catch (err) {
      setErrorMsg("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const scholarships = useMemo<Scholarship[]>(() => {
    return [
      {
        id: "sch-1",
        name: "Academic Excellence Scholarship",
        awardAmount: "$3,000 CAD",
        eligibility: "GPA 3.5+ & IELTS 7.0+",
        deadline: "July 31, 2026",
        country: "Canada",
      },
      {
        id: "sch-2",
        name: "Global Student Entrance Award",
        awardAmount: "$2,000 CAD",
        eligibility: "First-year international students",
        deadline: "August 15, 2026",
        country: "Canada",
      },
      {
        id: "sch-3",
        name: "STEM Pathway Grant",
        awardAmount: "$5,000 CAD",
        eligibility: "Enrolled in Technology/Engineering programs",
        deadline: "August 30, 2026",
        country: "Canada",
      },
    ];
  }, []);

  const NAVIGATION_GROUPS = [
    {
      title: "Plan & Match",
      items: [
        { key: "dashboard" as TabKey, label: "Dashboard", icon: LayoutDashboard },
        { key: "matches" as TabKey, label: "My Matches", icon: Compass },
        { key: "compare" as TabKey, label: "Compare Tool", icon: ArrowLeftRight },
        { key: "scholarships" as TabKey, label: "Scholarships", icon: Award },
        { key: "saved-universities" as TabKey, label: "Saved Universities", icon: Bookmark },
      ]
    },
    {
      title: "Apply & Track",
      items: [
        { key: "applications" as TabKey, label: "Applications", icon: Briefcase },
        { key: "documents" as TabKey, label: "Documents", icon: FileText },
        { key: "tasks" as TabKey, label: "Tasks", icon: CheckSquare },
        { key: "visa-assistance" as TabKey, label: "Visa Assistance", icon: Globe },
      ]
    },
    {
      title: "Support & Settings",
      items: [
        { key: "messages" as TabKey, label: "Messages", icon: MessageSquare },
        { key: "profile" as TabKey, label: "Profile", icon: User },
        { key: "settings" as TabKey, label: "Settings", icon: Settings },
      ]
    }
  ];

  if (status === "loading" || loading) {
    return <PremiumLoader message="Initializing Premium Portal. Please Wait..." />;
  }

  return (
    <div className={`transition-all duration-700 ${isLoggingOut ? "bg-slate-955 fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center" : ""}`}>
      {isLoggingOut && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_30px_15px_rgba(255,255,255,1)] animate-tv-dot pointer-events-none z-[100000]" />
      )}
      <div className={`w-full h-screen flex flex-col bg-slate-50/50 text-slate-900 ${isLoggingOut ? "animate-tv-off" : ""}`}>
      {/* Ambient Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-400/15 blur-[100px]" />
      </div>

      {/* Mobile Top Header Bar */}
      <div className="max-w-[1580px] mx-auto px-4 md:hidden">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/60 p-4 rounded-3xl mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl transition-all shadow-xs flex items-center justify-center shrink-0 border border-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-slate-800 text-sm tracking-tight capitalize">
            {activeTab.replace("-", " ")}
          </span>
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${currentAvatarGradient} flex items-center justify-center font-black text-white shadow-sm text-xs`}>
            {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "S"}
          </div>
        </div>
      </div>

      {/* Scrollable dashboard body */}
      <div className="flex flex-1 overflow-hidden pt-24 md:pt-28">

      {/* Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-[300px] max-w-[85%] bg-white/90 backdrop-blur-xl border-r border-slate-100 p-6 z-[160] flex flex-col justify-between md:hidden shadow-[20px_0_40px_rgba(0,0,0,0.05)] overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentAvatarGradient} flex items-center justify-center font-black text-white shadow-md text-xs`}>
                      {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "S"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-800 text-xs leading-none truncate max-w-[130px]">{profile.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Student Portal</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sidebar menu inside drawer */}
                <nav className="space-y-5">
                  {NAVIGATION_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] px-3 mb-2">
                        {group.title}
                      </h4>
                      <div className="space-y-0.5">
                        {group.items.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.key;
                          return (
                            <button
                              key={tab.key}
                              onClick={() => {
                                setActiveTab(tab.key);
                                setIsEditingProfile(false);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-xs font-extrabold transition-all duration-200 relative overflow-hidden group ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/15"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                              }`}
                            >
                              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                              <span className="truncate">{tab.label}</span>
                              {tab.key === "saved-universities" && savedMatches.length > 0 && (
                                <span className={`ml-auto px-2 py-0.5 text-[9px] font-black rounded-full ${isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}`}>
                                  {savedMatches.length}
                                </span>
                              )}
                              {tab.key === "applications" && applications.length > 0 && (
                                <span className={`ml-auto px-2 py-0.5 text-[9px] font-black rounded-full ${isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                                  {applications.length}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="h-px bg-slate-100 my-2" />
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      triggerLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-extrabold text-rose-500 hover:bg-rose-50 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 text-rose-400" />
                    Logout
                  </button>
                </nav>
              </div>

              {/* Completeness bar at bottom of mobile drawer */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mb-1">
                  <span>PROFILE</span>
                  <span className="text-[#3686FF]">{profileCompleteness}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

        <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1580px] mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-start">
          
          {/* ══════════ SIDEBAR (NAVIGATION) ══════════ */}
          <aside className="hidden md:flex md:flex-col" style={{ height: 'calc(100vh - 7rem)', position: 'sticky', top: 0, overflowY: 'auto' }}>
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div
                onClick={() => {
                  setActiveTab("profile");
                  setIsEditingProfile(false);
                }}
                className="cursor-pointer rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${currentAvatarGradient} font-black text-white shadow-lg text-lg`}>
                    {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "S"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-800 leading-tight truncate max-w-[160px]">{profile.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Student Account</p>
                  </div>
                </div>
                
                <div className="mt-5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                    <span>PROFILE COMPLETENESS</span>
                    <span className="text-[#3686FF]">{profileCompleteness}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-[#3686FF] to-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${profileCompleteness}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar Menu */}
              <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
                <nav className="space-y-5">
                  {NAVIGATION_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2.5">
                        {group.title}
                      </h4>
                      <div className="space-y-0.5">
                        {group.items.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.key;
                          return (
                            <button
                              key={tab.key}
                              onClick={() => {
                                setActiveTab(tab.key);
                                setIsEditingProfile(false);
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[13px] font-extrabold transition-all duration-200 relative overflow-hidden group ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/15"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 hover:translate-x-1"
                              }`}
                            >
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />
                              )}
                              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 transition-colors"}`} />
                              <span className="truncate">{tab.label}</span>
                              {tab.key === "saved-universities" && savedMatches.length > 0 && (
                                <span className={`ml-auto px-2 py-0.5 text-[9px] font-black rounded-full transition-colors ${isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}`}>
                                  {savedMatches.length}
                                </span>
                              )}
                              {tab.key === "applications" && applications.length > 0 && (
                                <span className={`ml-auto px-2 py-0.5 text-[9px] font-black rounded-full transition-colors ${isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                                  {applications.length}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="h-px bg-slate-100 my-2 px-2" />
                  <button
                    onClick={() => {
                      triggerLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[13px] font-extrabold text-rose-500 hover:bg-rose-50 hover:translate-x-1 transition-all duration-200"
                  >
                    <LogOut className="h-4.5 w-4.5 text-rose-400" />
                    Logout
                  </button>
                </nav>
              </div>

            </div>
          </aside>

          {/* ══════════ MAIN CONTENT AREA ══════════ */}
          <main className="min-w-0 space-y-6 pb-16">
            
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h1 className="text-[28px] sm:text-[36px] font-black text-slate-900 tracking-tight leading-none">
                  {NAVIGATION_GROUPS.flatMap((g) => g.items).find((t) => t.key === activeTab)?.label}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-2.5">
                  {activeTab === "dashboard" && "Your centralized study-abroad planning and application tracker."}
                  {activeTab === "matches" && "Review colleges where you qualify and fit best."}
                  {activeTab === "compare" && "Side-by-side evaluation of 2 student profiles or 2 target universities."}
                  {activeTab === "applications" && "Track and submit your university applications."}
                  {activeTab === "documents" && "Securely manage and upload your required academic files."}
                  {activeTab === "messages" && "Chat directly with your dedicated study-abroad counselor."}
                  {activeTab === "tasks" && "Track and complete your visa and admission roadmap."}
                  {activeTab === "scholarships" && "Browse institutional and country awards matched to your profile."}
                  {activeTab === "saved-universities" && "Shortlisted universities you've saved for application."}
                  {activeTab === "visa-assistance" && "Check visa success guidelines and track documentation."}
                  {activeTab === "profile" && "Manage your academic and financial credentials."}
                  {activeTab === "settings" && "Manage your login credentials and notification preferences."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {activeTab === "profile" && !isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditForm(profile);
                      setIsEditingProfile(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Edit Profile
                  </button>
                )}
                {isEditingProfile && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="border border-slate-200 bg-white text-slate-600 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-sm hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveProfile(true)}
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notification messages */}
            {savedNotify && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-semibold text-sm shadow-sm"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Your profile has been successfully saved and synced!
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 font-semibold text-sm shadow-sm"
              >
                <XCircle className="w-5 h-5 text-rose-500" />
                {errorMsg}
              </motion.div>
            )}

            {/* ────────── SUB VIEWS ────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* 1. DASHBOARD OVERVIEW TAB (Clean, Minimal & User-Friendly) */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8">

                    {/* Hero Banner Card */}
                    <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#3686FF] text-[11px] font-bold tracking-wide uppercase rounded-full border border-blue-100">
                            <Compass className="w-3.5 h-3.5 text-[#3686FF]" />
                            <span>Target: {profile.preferredCountry || "Canada"} · {profile.intake || "Fall 2026"}</span>
                          </div>
                          <div className="flex gap-2">
                            {profile.gpa && (
                              <span className="px-3 py-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200/60">GPA {profile.gpa}</span>
                            )}
                            {profile.englishScore && (
                              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-100">{profile.testType || "IELTS"} {profile.englishScore}</span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Welcome back, {firstName}!</h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xl font-medium leading-relaxed">
                          Your academic credentials match <strong className="text-[#3686FF] font-bold">{matches.length || "12"} global institutions</strong>. {profileCompleteness < 80 ? "Complete your profile to unlock personalized recommendations." : "Your visa success probability is strong. Let's finish your SOP this week!"}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 mt-6">
                          <button
                            onClick={() => setActiveTab("matches")}
                            className="bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                          >
                            <Compass className="w-4 h-4" /> Explore Matches
                          </button>
                          <button
                            onClick={() => setActiveTab("profile")}
                            className="bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-bold px-5 py-3 rounded-2xl text-xs border border-slate-200 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-slate-400" /> Refine Profile
                          </button>
                          <button
                            onClick={() => router.push("/costing")}
                            className="bg-amber-50 hover:bg-amber-100/80 text-amber-700 font-bold px-5 py-3 rounded-2xl text-xs border border-amber-100 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                          >
                            <DollarSign className="w-4 h-4 text-amber-600" /> Cost Estimator
                          </button>
                          <button
                            onClick={() => router.push("/matches?new=true")}
                            className="bg-purple-50 hover:bg-purple-100/80 text-purple-700 font-bold px-5 py-3 rounded-2xl text-xs border border-purple-100 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-purple-600" /> New Search
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* KPI Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Profile Completion",
                          value: `${profileCompleteness}%`,
                          sub: profileCompleteness >= 80 ? "Strong profile" : "Needs attention",
                          bg: "bg-blue-50",
                          textColor: "text-[#3686FF]",
                          icon: User,
                        },
                        {
                          label: "Admission Odds",
                          value: profile.admissionProb ? `${profile.admissionProb}%` : "78%",
                          sub: "Based on GPA & score",
                          bg: "bg-emerald-50",
                          textColor: "text-emerald-600",
                          icon: GraduationCap,
                        },
                        {
                          label: "Visa Readiness",
                          value: profile.visaSuccessProb ? `${profile.visaSuccessProb}%` : "85%",
                          sub: "Financial strength score",
                          bg: "bg-purple-50",
                          textColor: "text-purple-600",
                          icon: Shield,
                        },
                        {
                          label: "Tasks Completed",
                          value: `${tasks.filter(t => t.completed).length}/${tasks.length}`,
                          sub: `${taskCompletion}% done`,
                          bg: "bg-amber-50",
                          textColor: "text-amber-600",
                          icon: CheckSquare,
                        },
                      ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <div
                            key={i}
                            className="rounded-2xl bg-white border border-slate-150 p-4 shadow-xs flex items-center gap-3.5"
                          >
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${stat.textColor}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{stat.label}</p>
                              <p className={`text-xl font-extrabold leading-none mt-0.5 ${stat.textColor}`}>{stat.value}</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{stat.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recommended Next Step Banner */}
                    {(() => {
                      const StepIcon = nextRecommendedStep.icon;
                      return (
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row gap-5 items-start justify-between">
                          <div className="flex gap-4 items-start">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                              <StepIcon className="w-5 h-5 text-[#3686FF]" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#3686FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                                Next Recommended Step
                              </span>
                              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1">
                                {nextRecommendedStep.title}
                              </h3>
                              <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-xl">
                                {nextRecommendedStep.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab(nextRecommendedStep.tab);
                              setIsEditingProfile(nextRecommendedStep.tab === "profile");
                            }}
                            className="w-full sm:w-auto shrink-0 font-extrabold text-white bg-[#3686FF] hover:bg-blue-600 px-5 py-3 rounded-2xl text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
                          >
                            {nextRecommendedStep.cta}
                          </button>
                        </div>
                      );
                    })()}

                    {/* Recent Matches Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                          Recent Matches
                        </h3>
                        {savedMatches.length > 0 && (
                          <button
                            onClick={() => setActiveTab("matches")}
                            className="text-xs font-bold text-[#3686FF] hover:underline"
                          >
                            View All Matches →
                          </button>
                        )}
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                        {loading ? (
                          <div className="flex py-10 justify-center items-center">
                            <Loader2 className="w-6 h-6 text-[#3686FF] animate-spin mr-3" />
                            <span className="font-bold text-slate-500 animate-pulse text-xs">Loading saved matches...</span>
                          </div>
                        ) : savedMatches.length === 0 ? (
                          <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-3">
                            <span className="font-semibold text-xs">No saved matches yet. Use the Matching Wizard to find and save your evaluations!</span>
                            <button
                              onClick={() => router.push("/matches")}
                              className="rounded-xl bg-[#3686FF] hover:bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              Start Matching Wizard
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {savedMatches.slice(0, 3).map((m) => {
                              const rawDegree = m.formData?.degree || "bachelors";
                              const degree = formatDegree(rawDegree);
                              const gpa = m.formData?.gpa || "—";
                              const testType = m.formData?.testType && m.formData?.testType !== "NONE" ? m.formData.testType : null;
                              const testScore = m.formData?.testScore || "";
                              const univName = m.matchData?.name || "University Match";
                              const countryCode = m.formData?.countries?.[0] || m.matchData?.countryCode || "CA";
                              const city = m.matchData?.city || "";
                              const tuitionFee = m.matchData?.tuitionFee || 18000;
                              const admissionChance = m.admissionChance;

                              return (
                                <div
                                  key={m.id}
                                  onClick={() => handleLoadSavedProfile(m)}
                                  className="rounded-2xl p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group cursor-pointer"
                                >
                                  <div>
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-[#3686FF] truncate max-w-[120px]" title={degree}>
                                        {degree}
                                      </span>
                                      <span className="text-xs font-extrabold text-emerald-600">
                                        {admissionChance ?? "78"}% Match
                                      </span>
                                    </div>
                                    <h4 className="font-extrabold text-slate-900 text-sm tracking-tight group-hover:text-[#3686FF] transition-colors leading-snug truncate" title={univName}>
                                      {univName}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      {city ? `${city}, ` : ""}{countryCode}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-3 mt-4 text-xs font-semibold text-slate-600">
                                      <div>
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase">GPA & Score</span>
                                        <span className="block font-bold text-slate-900 mt-0.5 truncate">
                                          GPA {gpa}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Tuition</span>
                                        <span className="block font-bold text-slate-900 mt-0.5">
                                          ${Number(tuitionFee).toLocaleString()}/yr
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pt-4 mt-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLoadSavedProfile(m);
                                      }}
                                      className="w-full bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                                    >
                                      <span>Check Evaluation</span>
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MY MATCHES TAB (Clean, Minimal & User-Friendly Design) */}
                {activeTab === "matches" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Header & Academic Profile Summary Banner (Clean Solid Light Theme) */}
                    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold text-[#3686FF]">
                            <Sparkles className="w-3.5 h-3.5 text-[#3686FF]" />
                            <span>Smart College Matching Profile</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {profile.degreeLevel ? `${formatDegree(profile.degreeLevel)} in ${profile.field || "General Field"}` : "Study Abroad Recommendations"}
                          </h2>
                          {/* Active Credentials Pills */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 flex items-center gap-1.5 text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-[#3686FF]" />
                              {profile.preferredCountry || "Canada"}
                            </span>
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700">
                              GPA {profile.gpa || "3.5"}
                            </span>
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700">
                              {profile.testType || "IELTS"} {profile.englishScore || "7.0"}
                            </span>
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700">
                              Budget: ${parseInt(profile.yearlyBudget || "30000").toLocaleString()}/yr
                            </span>
                            {profile.intake && (
                              <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700">
                                {profile.intake}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                          <button
                            onClick={() => setActiveTab("profile")}
                            className="bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-bold px-5 py-3 rounded-2xl text-xs border border-slate-200 transition-all active:scale-95 cursor-pointer"
                          >
                            Edit Profile
                          </button>
                          <button
                            onClick={() => router.push("/matches?new=true")}
                            className="bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>New Search</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <Filter className="w-4 h-4 text-[#3686FF]" />
                        <span>Filter Institutions</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <select
                          value={filterCountry}
                          onChange={(e) => setFilterCountry(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none hover:border-[#3686FF] transition-all cursor-pointer shadow-xs"
                        >
                          <option value="">All Countries</option>
                          <option value="CA">Canada</option>
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="IE">Ireland</option>
                          <option value="MT">Malta</option>
                        </select>
                        <select
                          value={filterDegree}
                          onChange={(e) => setFilterDegree(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none hover:border-[#3686FF] transition-all cursor-pointer shadow-xs"
                        >
                          <option value="">All Degrees</option>
                          <option value="bachelor">Bachelor</option>
                          <option value="master">Master / Graduate</option>
                          <option value="diploma">Diploma</option>
                        </select>
                        {(filterCountry || filterDegree) && (
                          <button
                            onClick={() => {
                              setFilterCountry("");
                              setFilterDegree("");
                            }}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-all cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section 1: User's Shortlisted Saved Matches */}
                    {savedMatches.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Your Shortlisted Matches</h3>
                          <span className="text-xs font-bold text-[#3686FF]">{filteredShortlists.length} Saved</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {filteredShortlists.length === 0 ? (
                            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 font-semibold text-xs">
                              No match profiles found matching selected filters.
                            </div>
                          ) : (
                            filteredShortlists.map((item) => {
                              const degree = item.formData?.degree || "Bachelor";
                              const gpa = item.formData?.gpa || "—";
                              const testType = item.formData?.testType && item.formData?.testType !== "NONE" ? item.formData.testType : null;
                              const testScore = item.formData?.testScore || "";
                              const univName = item.matchData?.name || "University Match";
                              const countryCode = item.formData?.countries?.[0] || item.matchData?.countryCode || "CA";
                              const admissionChance = item.admissionChance;
                              const isExpanded = expandedProfileId === item.id;

                              return (
                                <Card key={item.id} className="rounded-3xl p-6 border border-slate-150/80 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <FlagIcon countryCode={countryCode} className="w-5 h-3.5 rounded object-cover shadow-2xs" />
                                        <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#3686FF] rounded-full">
                                          {formatDegree(degree)}
                                        </span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteProfileId(item.id);
                                        }}
                                        className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                                        title="Delete saved match"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>

                                    <h4 className="font-extrabold text-slate-900 text-base leading-snug hover:text-[#3686FF] transition-colors truncate mt-2" title={univName}>
                                      {univName}
                                    </h4>

                                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-600">
                                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">GPA / Test</span>
                                        <span className="text-slate-900 font-extrabold truncate block">
                                          GPA {gpa} {testType ? `· ${formatTestType(testType)} ${testScore}` : ""}
                                        </span>
                                      </div>
                                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Admit Odds</span>
                                        <span className="text-emerald-600 font-extrabold block">
                                          {admissionChance ?? "78"}% High Match
                                        </span>
                                      </div>
                                    </div>

                                    {/* Collapsible Expander Button */}
                                    <button
                                      onClick={() => setExpandedProfileId(isExpanded ? null : item.id)}
                                      className="flex items-center gap-1 text-xs font-bold text-[#3686FF] hover:underline mt-4 cursor-pointer"
                                    >
                                      {isExpanded ? (
                                        <>Hide Full Evaluation <ChevronUp className="w-4 h-4" /></>
                                      ) : (
                                        <>View Detailed Criteria <ChevronDown className="w-4 h-4" /></>
                                      )}
                                    </button>

                                    {/* Collapsible Details */}
                                    <AnimatePresence>
                                      {isExpanded && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5 text-xs">
                                            <div className="bg-slate-50 p-2.5 rounded-xl">
                                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Target Intake</span>
                                              <span className="font-bold text-slate-800">{item.formData?.intake || "Fall 2026"}</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-xl">
                                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Budget Limit</span>
                                              <span className="font-bold text-slate-800">${parseInt(item.formData?.budget || "30000").toLocaleString()} USD/yr</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-xl">
                                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Backlogs & Gap</span>
                                              <span className="font-bold text-slate-800">{item.formData?.backlogs || "0"} backlogs · {item.formData?.studyGap || "0"} yr gap</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-xl">
                                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Sponsor Source</span>
                                              <span className="font-bold text-slate-800 truncate block">{item.formData?.sponsorType || "Self"}</span>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                                    <button
                                      onClick={() => handleLoadSavedProfile(item)}
                                      className="w-full bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                      <span>Open Full Analytics</span>
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </Card>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Recommended Universities Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recommended Institutions for You</h3>
                        <span className="text-xs font-bold text-slate-400">{matches.length} Total Options</span>
                      </div>

                      {matchesLoading ? (
                        <div className="flex py-16 justify-center items-center">
                          <Loader2 className="w-8 h-8 text-[#3686FF] animate-spin mr-3" />
                          <span className="font-bold text-slate-500 animate-pulse text-xs">Matching universities against your GPA and test scores...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {matches
                            .filter((m) => !filterCountry || m.countryCode === filterCountry)
                            .map((m) => {
                              const isLaunching = launchingId === m.id;
                              return (
                                <motion.div
                                  key={m.id || m.name}
                                  whileHover={{ y: -4 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card className="rounded-3xl p-6 border border-slate-150 bg-white shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full group">
                                    <div>
                                      <div className="flex justify-between items-start mb-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                          {m.admissionRate || 78}% Match
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.institution_type || "Public"}</span>
                                      </div>

                                      <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-1 group-hover:text-[#3686FF] transition-colors">{m.name}</h3>
                                      <p className="text-slate-500 font-medium text-xs flex items-center gap-1 mt-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {m.city ? `${m.city}, ` : ""}{m.countryCode || "Canada"}
                                      </p>

                                      <div className="h-px bg-slate-100 my-4" />

                                      <div className="space-y-2 mb-4 text-xs font-semibold">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Tuition:</span>
                                          <span className="text-slate-800 font-extrabold">${(m.tuitionFee || 18000).toLocaleString()}/yr</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Scholarship:</span>
                                          <span className="text-emerald-600 font-extrabold">Up to $3,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Requirements:</span>
                                          <span className="text-slate-800 font-extrabold">IELTS {m.englishReq || "6.5"} / GPA {(m.gpaRequirement ? (m.gpaRequirement > 4.0 ? Math.round(((m.gpaRequirement / 100) * 4.0) * 10) / 10 : m.gpaRequirement) : 3.0).toFixed(1)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-2">
                                      <button
                                        onClick={() => handleApplyMatch(m)}
                                        className="bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                                      >
                                        Apply Now
                                      </button>
                                      <button
                                        onClick={() => handleLaunchRecommendedUniversity(m)}
                                        disabled={isLaunching}
                                        className="border border-slate-200 hover:border-[#3686FF] hover:text-[#3686FF] bg-white text-slate-700 font-extrabold py-3 rounded-2xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                                      >
                                        {isLaunching ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3686FF]" />
                                        ) : (
                                          "View Analysis"
                                        )}
                                      </button>
                                    </div>
                                  </Card>
                                </motion.div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 3. APPLICATIONS TAB - Enhanced with Kanban pipeline */}
                {activeTab === "applications" && (
                  <div className="space-y-6">
                    {/* Pipeline stage bar */}
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                      {([
                        { stage: "Draft", color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
                        { stage: "Submitted", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
                        { stage: "Under Review", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
                        { stage: "Offer Received", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
                        { stage: "Rejected", color: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
                        { stage: "Accepted", color: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
                      ] as { stage: ApplicationStage; color: string; dot: string }[]).map(({ stage, color, dot }) => {
                        const count = applications.filter((a) => a.stage === stage).length;
                        return (
                          <div key={stage} className={`rounded-2xl p-3.5 ${color} flex flex-col gap-1`}>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                              <span className="text-[9px] font-black uppercase tracking-wider truncate">{stage}</span>
                            </div>
                            <p className="text-2xl font-black leading-none">{count}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Applications List */}
                    <div className="space-y-4">
                      {applications.map((app) => {
                        const stageConfig: Record<ApplicationStage, { border: string; badge: string; dot: string }> = {
                          Draft:          { border: "border-l-slate-400",  badge: "bg-slate-100 text-slate-600",  dot: "bg-slate-400" },
                          Submitted:      { border: "border-l-blue-500",   badge: "bg-blue-50 text-blue-700",    dot: "bg-blue-500" },
                          "Under Review": { border: "border-l-amber-500",  badge: "bg-amber-50 text-amber-700",  dot: "bg-amber-500" },
                          "Offer Received":{ border: "border-l-emerald-500",badge: "bg-emerald-50 text-emerald-700",dot: "bg-emerald-500" },
                          Rejected:       { border: "border-l-rose-500",   badge: "bg-rose-50 text-rose-700",    dot: "bg-rose-500" },
                          Accepted:       { border: "border-l-violet-500", badge: "bg-violet-50 text-violet-700",dot: "bg-violet-500" },
                        };
                        const cfg = stageConfig[app.stage];
                        return (
                          <Card key={app.id} className={`rounded-3xl p-5 border-l-4 ${cfg.border} shadow-lg shadow-slate-200/40 bg-white flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-xl transition-all`}>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center font-black text-blue-700 text-xl shrink-0 border border-blue-100">
                                {app.universityName[0]}
                              </div>
                              <div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase ${cfg.badge} rounded-full mb-1.5`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${app.stage === "Under Review" ? "animate-pulse" : ""}`} />
                                  {app.stage}
                                </span>
                                <h3 className="font-extrabold text-slate-800 text-base leading-snug">{app.universityName}</h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">{app.programName} · {app.country}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 md:gap-6 justify-between md:justify-end">
                              <div className="text-left md:text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Initiated</p>
                                <p className="text-xs font-bold text-slate-700 mt-0.5">{app.appliedDate}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {app.stage === "Draft" && (
                                  <button
                                    onClick={() => {
                                      setApplications(applications.map(a => a.id === app.id ? { ...a, stage: "Submitted" as ApplicationStage } : a));
                                      setTasks(tasks.map(t => t.id === "task-4" ? { ...t, completed: true } : t));
                                    }}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
                                  >
                                    Submit Now
                                  </button>
                                )}
                                <button
                                  onClick={() => setActiveTab("documents")}
                                  className="border border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-white text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5"
                                >
                                  <Paperclip className="w-3.5 h-3.5" /> Documents
                                </button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. DOCUMENTS TAB - Enhanced with progress ring & category groups */}
                {activeTab === "documents" && (
                  <div className="space-y-6">
                    {/* ── Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Document Vault</h2>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">All documents are saved securely to the database</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-black text-emerald-700">
                            {documents.filter(d => d.status === "Uploaded").length} / {documents.length} Uploaded
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-xs font-black text-amber-700">
                            {documents.filter(d => d.status !== "Uploaded").length} Pending
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Progress bar ── */}
                    <Card className="rounded-[24px] border border-slate-100 shadow-sm shadow-slate-100 bg-white p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Overall Completion</span>
                        <span className="text-sm font-black text-[#3366FF]">
                          {documents.length > 0 ? Math.round(documents.filter(d => d.status === "Uploaded").length / documents.length * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${documents.length > 0 ? Math.round(documents.filter(d => d.status === "Uploaded").length / documents.length * 100) : 0}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-[#3366FF] rounded-full"
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mt-2">
                        Upload all required documents to unlock full application access
                      </p>
                    </Card>

                    {/* ── Loading skeleton ── */}
                    {docsLoading && (
                      <div className="space-y-4">
                        {[1,2,3].map(i => (
                          <Card key={i} className="rounded-[24px] border border-slate-100 shadow-sm bg-white p-5">
                            <div className="animate-pulse space-y-3">
                              <div className="h-3 w-24 bg-slate-100 rounded-full" />
                              <div className="h-12 bg-slate-50 rounded-2xl" />
                              <div className="h-12 bg-slate-50 rounded-2xl" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* ── Grouped by category ── */}
                    {!docsLoading && Array.from(new Set(documents.map(d => d.category))).map((category) => {
                      const categoryDocs = documents.filter(d => d.category === category);
                      const allDone = categoryDocs.every(d => d.status === "Uploaded");
                      const donePct = Math.round(categoryDocs.filter(d => d.status === "Uploaded").length / categoryDocs.length * 100);

                      const categoryAccent: Record<string, string> = {
                        "Identification": "border-l-[#3366FF] bg-[#3366FF]/5",
                        "Education": "border-l-emerald-500 bg-emerald-500/5",
                        "Career": "border-l-violet-500 bg-violet-500/5",
                        "Admissions": "border-l-amber-500 bg-amber-500/5",
                        "Language": "border-l-rose-500 bg-rose-500/5",
                      };
                      const accent = categoryAccent[category] || "border-l-slate-400 bg-slate-50";

                      return (
                        <Card key={category} className="rounded-[24px] border border-slate-100 shadow-sm shadow-slate-100 bg-white overflow-hidden">
                          {/* Category header */}
                          <div className={`px-5 py-3.5 border-l-4 flex items-center justify-between ${accent}`}>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-slate-700 uppercase tracking-[0.15em]">{category}</span>
                              {allDone && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="w-2.5 h-2.5" /> Complete
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-black text-slate-400">{donePct}%</span>
                          </div>

                          {/* Document rows */}
                          <div className="divide-y divide-slate-50/80 px-5">
                            {categoryDocs.map((doc) => {
                              const isUploading = uploadingDocId === doc.id;
                              const isDragOver = dragOverDocId === doc.id;
                              return (
                                <div
                                  key={doc.id}
                                  className={`py-4 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl transition-all duration-200 px-3 -mx-3 ${
                                    isDragOver
                                      ? "bg-[#3366FF]/8 border-2 border-dashed border-[#3366FF] scale-[1.01]"
                                      : "border-2 border-transparent"
                                  }`}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragOverDocId(doc.id);
                                  }}
                                  onDragEnter={(e) => {
                                    e.preventDefault();
                                    setDragOverDocId(doc.id);
                                  }}
                                  onDragLeave={(e) => {
                                    e.stopPropagation();
                                    setDragOverDocId(null);
                                  }}
                                  onDrop={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragOverDocId(null);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) await handleUploadFile(doc.id, file);
                                  }}
                                >
                                  {/* Left: icon + info */}
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                      isDragOver ? "bg-[#3366FF] text-white scale-110" :
                                      doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                      doc.status === "Draft" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                      "bg-slate-50 text-slate-400 border border-slate-100"
                                    }`}>
                                      {isUploading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : isDragOver
                                        ? <Upload className="w-4 h-4" />
                                        : <FileText className="w-4 h-4" />
                                      }
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                                      {isDragOver ? (
                                        <p className="text-[10px] text-[#3366FF] font-bold mt-1 animate-pulse">Drop to upload</p>
                                      ) : doc.fileName ? (
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                          {doc.fileUrl ? (
                                            <a
                                              href={doc.fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[10px] text-[#3366FF] font-semibold truncate hover:underline"
                                            >
                                              {doc.fileName}
                                            </a>
                                          ) : (
                                            <span className="text-[10px] text-slate-500 font-semibold truncate">{doc.fileName}</span>
                                          )}
                                          {doc.uploadedAt && (
                                            <span className="text-[9px] text-slate-400 font-semibold shrink-0">· {doc.uploadedAt}</span>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Drag & drop or click Upload</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right: status badge + actions */}
                                  <div className="flex items-center gap-2.5 shrink-0">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                                      doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                      doc.status === "Draft" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                      "bg-slate-100 text-slate-500"
                                    }`}>
                                      {doc.status}
                                    </span>

                                    {/* File input (click) */}
                                    <label htmlFor={`file-input-${doc.id}`} className="cursor-pointer">
                                      <input
                                        id={`file-input-${doc.id}`}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) await handleUploadFile(doc.id, file);
                                          e.target.value = "";
                                        }}
                                      />
                                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                        isUploading
                                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                          : "bg-[#3366FF] text-white hover:bg-[#254bdb] shadow-sm hover:shadow-[0_4px_12px_rgba(51,102,255,0.3)] active:scale-95"
                                      }`}>
                                        {isUploading ? (
                                          <><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</>
                                        ) : (
                                          <><Upload className="w-3 h-3" />{doc.status === "Uploaded" ? "Replace" : "Upload"}</>
                                        )}
                                      </span>
                                    </label>

                                    {/* Remove button */}
                                    {doc.status === "Uploaded" && (
                                      <button
                                        onClick={() => handleRemoveFile(doc.id)}
                                        className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all border border-rose-100 active:scale-95"
                                        title="Remove file"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </Card>
                      );
                    })}

                    {/* ── Empty state ── */}
                    {!docsLoading && documents.length === 0 && (
                      <Card className="rounded-[24px] border border-slate-100 shadow-sm bg-white p-12 text-center">
                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <h3 className="font-black text-slate-700 text-sm">No documents found</h3>
                        <p className="text-xs text-slate-400 mt-1">Reload the page to set up your document vault.</p>
                      </Card>
                    )}
                  </div>
                )}

                {/* 5. MESSAGES TAB */}
                {activeTab === "messages" && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column: Counselor Hub & Contact Centre */}
                    <div className="space-y-6 xl:col-span-1 animate-in fade-in duration-300">
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="text-center pb-6 border-b border-slate-150">
                          <div className="relative w-20 h-20 mx-auto shadow-lg rounded-[28px] overflow-hidden p-0.5 bg-gradient-to-tr from-blue-500 via-[#3686FF] to-indigo-600">
                            <div className="w-full h-full bg-white rounded-[26px] p-1 overflow-hidden">
                              <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-white text-2xl flex items-center justify-center">
                                AC
                              </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full">
                              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                            </div>
                          </div>
                          
                          <h3 className="font-black text-slate-800 text-xl mt-4">Abby Carter</h3>
                          <p className="text-xs font-extrabold text-blue-600 tracking-wide uppercase mt-1">Dedicated Counselor</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Admissions & Visa Specialist</p>
                        </div>
                        
                        <div className="py-5 space-y-3 text-xs font-semibold text-slate-600">
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Working Hours</span>
                            <span className="text-slate-800 font-extrabold">9:00 AM - 6:00 PM EST</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Response Time</span>
                            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Under 1 hour
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Email Support</span>
                            <a href="mailto:counselor@abroadlift.com" className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors">
                              counselor@abroadlift.com
                            </a>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText("+1 (800) 555-0199");
                              alert("Advisor phone number (+1 800 555 0199) copied to clipboard!");
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Advisor
                          </button>
                          <a
                            href="mailto:counselor@abroadlift.com"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-black py-3 rounded-2xl text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          >
                            <Mail className="w-3.5 h-3.5" /> Email Direct
                          </a>
                        </div>
                      </Card>

                      {/* Quick FAQ / Helper Resources */}
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
                        <div className="flex items-center gap-2 mb-4">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Support FAQ</h3>
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { q: "How long does a GIC account setup take?", a: "Setting up a Canadian GIC with CIBC or Simplii usually takes 3 to 5 business days after transfer verification." },
                            { q: "When should I submit my English scores?", a: "Ideally, upload your IELTS/PTE reports at least 2 weeks before the college application deadline to ensure smooth processing." },
                            { q: "Can I add more universities to my matches?", a: "Yes! Use the 'My Matches' tab to match with more institutions or run a new search in the search bar." }
                          ].map((item, i) => (
                            <details key={i} className="group bg-slate-50 border border-slate-100/50 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                              <summary className="flex justify-between items-center p-3 text-xs font-bold text-slate-700 cursor-pointer select-none group-hover:bg-slate-100/50 list-none">
                                <span className="pr-3 leading-snug">{item.q}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform duration-200" />
                              </summary>
                              <div className="p-3 pt-0 text-[11px] font-medium leading-relaxed text-slate-500 border-t border-slate-100/50">
                                {item.a}
                              </div>
                            </details>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* Right Column: Chat Interface */}
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white xl:col-span-2 flex flex-col h-[600px] justify-between overflow-hidden relative animate-in fade-in duration-300">
                      {/* Chat Header */}
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                            AC
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 text-sm">Abby Carter</h4>
                            <p className="text-[10px] font-bold text-emerald-605 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              Online · Admissions Advisor
                            </p>
                          </div>
                        </div>
                        
                        {/* Chat Search Box */}
                        <div className="relative w-full sm:w-48">
                          <input
                            type="text"
                            value={chatSearch}
                            onChange={(e) => setChatSearch(e.target.value)}
                            placeholder="Search messages..."
                            className="w-full rounded-full border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400"
                          />
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>

                      {/* Chat Messages Zone */}
                      <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide bg-slate-50/20" ref={chatContainerRef}>
                        {messages.filter(m => m.text.toLowerCase().includes(chatSearch.toLowerCase())).length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
                            <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                            <p className="text-xs font-bold">No messages found matching your search</p>
                          </div>
                        ) : (
                          messages.filter(m => m.text.toLowerCase().includes(chatSearch.toLowerCase())).map((m) => {
                            const isStudent = m.sender === "student";
                            return (
                              <div key={m.id} className={`flex flex-col ${isStudent ? "items-end" : "items-start"} max-w-full animate-in slide-in-from-bottom-2 duration-200`}>
                                <div className="flex items-end gap-2 max-w-[85%]">
                                  {!isStudent && (
                                    <div className="w-6 h-6 rounded-lg bg-blue-500 font-bold text-white text-[9px] flex items-center justify-center shrink-0 mb-1">
                                      AC
                                    </div>
                                  )}
                                  <div className={`p-4 rounded-[24px] leading-relaxed font-semibold text-xs shadow-sm ${
                                    isStudent 
                                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none" 
                                      : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                                  }`}>
                                    {m.text}
                                  </div>
                                </div>
                                <span className={`text-[9px] font-bold text-slate-400 mt-1 px-1 ${isStudent ? "mr-1" : "ml-9"}`}>{m.timestamp}</span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Chat Suggestions & Send Form */}
                      <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-3">
                        {/* Quick Suggestion Chips */}
                        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
                          {[
                            { label: "📝 SOP Review", query: "Can you please review my SOP draft?" },
                            { label: "✈️ Visa Help", query: "What are the next steps for my Canada visa assistance?" },
                            { label: "🎓 Scholarships", query: "Which scholarships am I eligible for?" },
                            { label: "📂 Document Check", query: "Can you verify if my uploaded documents are correct?" }
                          ].map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => handleSendMessage(undefined, chip.query)}
                              className="shrink-0 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-205 text-slate-650 hover:text-blue-700 font-extrabold px-3 py-1.5 rounded-full text-[10px] tracking-wide shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>

                        {/* Send Form */}
                        <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => alert("Select a document or image to attach and share with Abby.")}
                            className="bg-white border border-slate-200 text-slate-400 hover:text-slate-600 p-3 rounded-2xl shadow-sm transition-all hover:bg-slate-100 flex items-center justify-center cursor-pointer shrink-0"
                            title="Attach File"
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            placeholder="Message Abby Carter..."
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 shadow-inner"
                          />
                          <button
                            type="submit"
                            className="bg-[#3686FF] hover:bg-blue-600 text-white p-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                          >
                            <Send className="w-4.5 h-4.5" />
                          </button>
                        </form>
                      </div>
                    </Card>
                  </div>
                )}

                {/* 6. TASKS TAB - Enhanced with urgency colors & two sections */}
                {activeTab === "tasks" && (
                  <div className="space-y-6">
                    {/* Header stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Total", value: tasks.length, color: "text-slate-800", bg: "bg-white" },
                        { label: "Completed", value: tasks.filter(t => t.completed).length, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Pending", value: tasks.filter(t => !t.completed).length, color: "text-amber-600", bg: "bg-amber-50" },
                      ].map((s) => (
                        <Card key={s.label} className={`rounded-2xl p-4 border-none shadow-md ${s.bg} text-center`}>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                          <p className={`text-3xl font-black ${s.color} mt-1`}>{s.value}</p>
                        </Card>
                      ))}
                    </div>

                    {/* Pending Tasks */}
                    {tasks.filter(t => !t.completed).length > 0 && (
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Pending Actions</h3>
                        <div className="space-y-3">
                          {tasks.filter(t => !t.completed).map((task) => {
                            const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / 86400000);
                            const urgency = daysLeft <= 3 ? "high" : daysLeft <= 7 ? "medium" : "low";
                            return (
                              <motion.div
                                key={task.id}
                                layout
                                onClick={() => handleToggleTask(task.id)}
                                className={`flex gap-4 items-start p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 ${
                                  urgency === "high" ? "border-rose-200 bg-rose-50/60 hover:bg-rose-50" :
                                  urgency === "medium" ? "border-amber-200 bg-amber-50/40 hover:bg-amber-50" :
                                  "border-slate-100 bg-slate-50/40 hover:bg-slate-50"
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                  urgency === "high" ? "border-rose-400" : urgency === "medium" ? "border-amber-400" : "border-slate-300"
                                }`} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{task.title}</p>
                                  <div className="flex gap-3 mt-1.5 items-center">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                      urgency === "high" ? "bg-rose-100 text-rose-600" :
                                      urgency === "medium" ? "bg-amber-100 text-amber-600" :
                                      "bg-slate-100 text-slate-500"
                                    }`}>
                                      {daysLeft <= 0 ? "OVERDUE" : `${daysLeft}d left`}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-400">Due: {task.dueDate}</span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </Card>
                    )}

                    {/* Completed Tasks */}
                    {tasks.filter(t => t.completed).length > 0 && (
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-1.5">
                          Completed <Check className="w-3.5 h-3.5 text-slate-400" />
                        </h3>
                        <div className="space-y-2">
                          {tasks.filter(t => t.completed).map((task) => (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(task.id)}
                              className="flex gap-4 items-center p-3.5 rounded-xl bg-slate-50 opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <div className="w-5 h-5 rounded-md bg-emerald-500 border-emerald-500 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-sm font-semibold text-slate-500 line-through flex-1">{task.title}</p>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">DONE</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* 7. SCHOLARSHIPS TAB - Enhanced with deadline countdown & match badges */}
                {activeTab === "scholarships" && (
                  <div className="space-y-6">
                    {/* Tip banner */}
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border border-emerald-100 p-4 flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-emerald-800">Scholarship Tips</p>
                        <p className="text-xs font-semibold text-emerald-700/80 mt-0.5">Your GPA of <strong>{profile.gpa || "3.5+"}</strong> makes you eligible for merit-based awards. Apply before deadlines!</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {scholarships.map((s) => {
                        const deadlineDate = new Date(s.deadline);
                        const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000);
                        const urgencyColor = daysLeft <= 14 ? "text-rose-600 bg-rose-50 border-rose-200" : daysLeft <= 30 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";
                        const isEligible = !profile.gpa || parseFloat(profile.gpa) >= 3.5;
                        return (
                          <motion.div
                            key={s.id}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col justify-between h-full group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                              <div>
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                      <Award className="w-3.5 h-3.5 text-emerald-700" /> {s.awardAmount}
                                    </span>
                                  </div>
                                  {isEligible && (
                                    <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                                      <Check className="w-3 h-3 text-blue-700 shrink-0" /> ELIGIBLE
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-black text-slate-800 text-base leading-snug mb-4 group-hover:text-emerald-600 transition-colors">{s.name}</h3>

                                <div className="space-y-2.5 text-xs font-semibold">
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Eligibility:</span>
                                    <span className="text-slate-700 font-black text-right ml-2">{s.eligibility}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Country:</span>
                                    <span className="text-slate-700 font-black">{s.country}</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                    <span className="text-slate-400">Deadline:</span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${urgencyColor}`}>
                                      {daysLeft <= 0 ? "CLOSED" : `${daysLeft}d left`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => alert("Scholarship application initiated. Your counselor will coordinate document submissions.")}
                                className="mt-5 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                              >
                                Apply For Scholarship →
                              </button>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 8. SAVED UNIVERSITIES TAB */}
                {activeTab === "saved-universities" && (
                  <div className="space-y-4">
                    {savedMatches.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                          <Bookmark className="h-8 w-8 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-700">No saved universities yet</p>
                          <p className="mt-1 text-sm text-slate-400">Run a match to discover and save universities</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => router.push("/matches")}
                          className="mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/15 transition-all hover:scale-105"
                        >
                          Find Universities
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {savedMatches.map((item) => {
                          const degree = item.formData?.degree || "Bachelor";
                          const gpa = item.formData?.gpa || "—";
                          const testType = item.formData?.testType && item.formData?.testType !== "NONE" ? item.formData.testType : null;
                          const testScore = item.formData?.testScore || "";
                          const country = item.formData?.countries?.[0] || item.matchData?.countryCode || "CA";
                          const intake = item.formData?.intake || "Fall 2026";
                          const univName = item.matchData?.name || "University Match";
                          const admissionChance = item.admissionChance;
                          const visaSuccess = item.visaSuccess;
                          const isExpanded = expandedProfileId === item.id;

                          return (
                            <Card
                              key={item.id}
                              className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col justify-between gap-4 group hover:border-blue-100 hover:shadow-2xl transition-all duration-300"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="inline-flex px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 rounded-full">
                                      {degree}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-400">
                                      GPA: {gpa} • {testType ? `${testType} ${testScore}` : "No language test"}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-400">• Intake: {intake}</span>
                                  </div>
                                  <h3 className="font-extrabold text-slate-800 text-base truncate group-hover:text-[#3686FF] transition-colors">
                                    {univName}
                                  </h3>
                                  <p className="text-xs text-slate-500 mt-0.5">Target Destination: {country}</p>
                                </div>

                                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                                  <div className="flex gap-4">
                                    <div className="text-center">
                                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Admission</p>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-extrabold mt-0.5 ${
                                        admissionChance && admissionChance >= 80
                                          ? "bg-emerald-50 text-emerald-700"
                                          : admissionChance && admissionChance >= 50
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-rose-50 text-rose-700"
                                      }`}>
                                        {admissionChance ?? "—"}%
                                      </span>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Visa Odds</p>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-extrabold mt-0.5 ${
                                        visaSuccess && visaSuccess >= 80
                                          ? "bg-emerald-50 text-emerald-700"
                                          : visaSuccess && visaSuccess >= 50
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-rose-50 text-rose-700"
                                      }`}>
                                        {visaSuccess ?? "—"}%
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleLoadSavedProfile(item)}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                                  >
                                    Open Match Analytics
                                  </button>
                                </div>
                              </div>

                              {/* Expander Trigger Row */}
                              <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                                <button
                                  onClick={() => setExpandedProfileId(isExpanded ? null : item.id)}
                                  className="flex items-center gap-1 text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                  {isExpanded ? (
                                    <>Hide Step Details <ChevronUp className="w-3.5 h-3.5" /></>
                                  ) : (
                                    <>View Full Step Details <ChevronDown className="w-3.5 h-3.5" /></>
                                  )}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteProfileId(item.id);
                                  }}
                                  className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              </div>

                              {/* Collapsible Details Grid */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-[11px] font-medium text-slate-500">
                                      <div>
                                        <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Target Countries</span>
                                        <strong className="text-slate-700">{item.formData?.countries?.join(", ") || item.formData?.preferredCountry || "Canada"}</strong>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Course Preference</span>
                                        <strong className="text-slate-700 truncate block" title={item.formData?.program || item.formData?.field || "General"}>
                                          {item.formData?.program || item.formData?.field || "General"}
                                        </strong>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Target Intake</span>
                                        <strong className="text-slate-700">{item.formData?.intake || "Fall 2026"}</strong>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Yearly Budget</span>
                                        <strong className="text-slate-700">${parseInt(item.formData?.budget || "30000").toLocaleString()} USD/yr</strong>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Backlogs & Gap</span>
                                        <strong className="text-slate-700">{item.formData?.backlogs || "0"} backlogs · {item.formData?.studyGap || "0"} yr gap</strong>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Financial Sponsor</span>
                                        <strong className="text-slate-700">{item.formData?.sponsorType || "Self"} (${parseInt(item.formData?.sponsorIncome || "1500000").toLocaleString()} NPR)</strong>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. COMPARE TOOL TAB */}
                {activeTab === "compare" && (
                  <div className="space-y-6">
                    {/* Header Controls / Mode Switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCompareSubTab("profiles")}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            compareSubTab === "profiles"
                              ? "bg-[#3366FF] text-white shadow-md shadow-blue-500/20"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <User className="w-4 h-4" /> Compare 2 Profiles
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompareSubTab("universities")}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            compareSubTab === "universities"
                              ? "bg-[#3366FF] text-white shadow-md shadow-blue-500/20"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <GraduationCap className="w-4 h-4" /> Compare 2 Universities
                        </button>
                      </div>

                      <span className="text-[11px] font-extrabold text-slate-400 px-3">
                        {compareSubTab === "profiles"
                          ? "Head-to-Head Academic & Financial Profile Evaluation"
                          : "Side-by-Side Tuition, Living Cost & Visa Odds Comparison"}
                      </span>
                    </div>

                    {/* SUBTAB 1: COMPARE 2 PROFILES */}
                    {compareSubTab === "profiles" && (
                      <div className="space-y-6">
                        {/* Selector Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-5 rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                              Select Profile A (Baseline)
                            </label>
                            <select
                              value={selectedProfile1Id}
                              onChange={(e) => setSelectedProfile1Id(e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-[#3366FF]"
                            >
                              {allCompareProfiles.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </Card>

                          <Card className="p-5 rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                              Select Profile B (Comparison Target)
                            </label>
                            <select
                              value={selectedProfile2Id}
                              onChange={(e) => setSelectedProfile2Id(e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-[#3366FF]"
                            >
                              {allCompareProfiles.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </Card>
                        </div>

                        {/* Head-to-Head Metric Rows */}
                        {(() => {
                          const p1 = allCompareProfiles.find((p) => p.id === selectedProfile1Id) || allCompareProfiles[0];
                          const p2 = allCompareProfiles.find((p) => p.id === selectedProfile2Id) || allCompareProfiles[1] || allCompareProfiles[0];

                          const gpa1 = parseFloat(p1.gpa || "3.5");
                          const gpa2 = parseFloat(p2.gpa || "3.5");
                          const budget1 = parseFloat(p1.yearlyBudget || "30000");
                          const budget2 = parseFloat(p2.yearlyBudget || "30000");

                          return (
                            <div className="space-y-6">
                              {/* Overview Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="p-6 rounded-[32px] border border-blue-200 bg-blue-50/40 shadow-xs relative overflow-hidden">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                                      Profile A
                                    </span>
                                    <span className="text-xs font-black text-blue-700">
                                      {p1.degreeLevel} • {p1.preferredCountry}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-black text-slate-900 mb-1">{p1.name}</h3>
                                  <p className="text-xs text-slate-500 font-semibold">
                                    GPA: {p1.gpa} | {p1.testType} {p1.englishScore} | Budget: ${parseInt(p1.yearlyBudget).toLocaleString()}/yr
                                  </p>
                                </Card>

                                <Card className="p-6 rounded-[32px] border border-indigo-200 bg-indigo-50/40 shadow-xs relative overflow-hidden">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                                      Profile B
                                    </span>
                                    <span className="text-xs font-black text-indigo-700">
                                      {p2.degreeLevel} • {p2.preferredCountry}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-black text-slate-900 mb-1">{p2.name}</h3>
                                  <p className="text-xs text-slate-500 font-semibold">
                                    GPA: {p2.gpa} | {p2.testType} {p2.englishScore} | Budget: ${parseInt(p2.yearlyBudget).toLocaleString()}/yr
                                  </p>
                                </Card>
                              </div>

                              {/* Detailed Metrics Table */}
                              <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                                <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                                  <ArrowLeftRight className="w-5 h-5 text-[#3366FF]" /> Detailed Head-to-Head Comparison
                                </h3>

                                <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                                  <table className="w-full text-left border-collapse min-w-[540px]">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-3.5">Metric Category</th>
                                        <th className="p-3.5 text-blue-700 font-black">Profile A ({p1.name.slice(0, 18)})</th>
                                        <th className="p-3.5 text-indigo-700 font-black">Profile B ({p2.name.slice(0, 18)})</th>
                                        <th className="p-3.5 text-right">Advantage</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Academic GPA</td>
                                        <td className={`p-3.5 font-extrabold ${gpa1 >= gpa2 ? "text-emerald-700" : ""}`}>{p1.gpa} / 4.00</td>
                                        <td className={`p-3.5 font-extrabold ${gpa2 > gpa1 ? "text-emerald-700" : ""}`}>{p2.gpa} / 4.00</td>
                                        <td className="p-3.5 text-right">
                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${gpa1 >= gpa2 ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"}`}>
                                            {gpa1 >= gpa2 ? "Profile A +" + (gpa1 - gpa2).toFixed(2) : "Profile B +" + (gpa2 - gpa1).toFixed(2)}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">English Proficiency</td>
                                        <td className="p-3.5">{p1.testType} {p1.englishScore}</td>
                                        <td className="p-3.5">{p2.testType} {p2.englishScore}</td>
                                        <td className="p-3.5 text-right text-slate-400">Direct Entry Meets</td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Annual Tuition Budget</td>
                                        <td className="p-3.5 font-extrabold">${parseInt(p1.yearlyBudget).toLocaleString()} USD</td>
                                        <td className="p-3.5 font-extrabold">${parseInt(p2.yearlyBudget).toLocaleString()} USD</td>
                                        <td className="p-3.5 text-right">
                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${budget1 >= budget2 ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"}`}>
                                            {budget1 >= budget2 ? "Profile A Higher Budget" : "Profile B Higher Budget"}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Declared Bank Balance</td>
                                        <td className="p-3.5">{formatNPRDevanagari(parseFloat(p1.bankBalance || "3500000"))}</td>
                                        <td className="p-3.5">{formatNPRDevanagari(parseFloat(p2.bankBalance || "3500000"))}</td>
                                        <td className="p-3.5 text-right text-emerald-700 font-bold">Proof Solvency Verified</td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Backlogs & Study Gap</td>
                                        <td className="p-3.5">{p1.backlogs} backlogs · {p1.studyGap} yrs gap</td>
                                        <td className="p-3.5">{p2.backlogs} backlogs · {p2.studyGap} yrs gap</td>
                                        <td className="p-3.5 text-right">
                                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                                            Clean Record
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Projected Admission Chance</td>
                                        <td className="p-3.5 font-black text-blue-600">{p1.admissionProb}% Score</td>
                                        <td className="p-3.5 font-black text-indigo-600">{p2.admissionProb}% Score</td>
                                        <td className="p-3.5 text-right">
                                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">
                                            {p1.admissionProb >= p2.admissionProb ? "Profile A Lead" : "Profile B Lead"}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Visa Confidence Rate</td>
                                        <td className="p-3.5 font-black text-emerald-600">{p1.visaSuccessProb}% Rate</td>
                                        <td className="p-3.5 font-black text-emerald-600">{p2.visaSuccessProb}% Rate</td>
                                        <td className="p-3.5 text-right font-black text-emerald-700">Strong Approval Odds</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </Card>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* SUBTAB 2: COMPARE 2 UNIVERSITIES */}
                    {compareSubTab === "universities" && (
                      <div className="space-y-6">
                        {/* Selector Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-5 rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                              Select Target University A
                            </label>
                            <select
                              value={selectedUni1Id}
                              onChange={(e) => setSelectedUni1Id(e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-[#3366FF]"
                            >
                              {allCompareUniversities.map((u) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.location})</option>
                              ))}
                            </select>
                          </Card>

                          <Card className="p-5 rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                              Select Target University B
                            </label>
                            <select
                              value={selectedUni2Id}
                              onChange={(e) => setSelectedUni2Id(e.target.value)}
                              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-[#3366FF]"
                            >
                              {allCompareUniversities.map((u) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.location})</option>
                              ))}
                            </select>
                          </Card>
                        </div>

                        {/* Head-to-Head University Cards */}
                        {(() => {
                          const u1 = allCompareUniversities.find((u) => u.id === selectedUni1Id) || allCompareUniversities[0];
                          const u2 = allCompareUniversities.find((u) => u.id === selectedUni2Id) || allCompareUniversities[1] || allCompareUniversities[0];

                          const totalCost1Usd = (u1.tuitionFeeUsd + u1.livingFeeUsd) * u1.durationYears;
                          const totalCost2Usd = (u2.tuitionFeeUsd + u2.livingFeeUsd) * u2.durationYears;

                          return (
                            <div className="space-y-6">
                              {/* 2 Cards Banner */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="p-6 rounded-[32px] border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#3366FF] text-[10px] font-black uppercase">
                                        University A
                                      </span>
                                      <span className="text-xs font-extrabold text-slate-500">{u1.location}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{u1.name}</h3>
                                    <p className="text-xs font-semibold text-slate-500 mb-4">{u1.ranking}</p>
                                  </div>

                                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Annual Tuition:</span>
                                    <span className="text-base font-black text-[#3366FF]">
                                      ${u1.tuitionFeeUsd.toLocaleString()} USD
                                    </span>
                                  </div>
                                </Card>

                                <Card className="p-6 rounded-[32px] border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase">
                                        University B
                                      </span>
                                      <span className="text-xs font-extrabold text-slate-500">{u2.location}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{u2.name}</h3>
                                    <p className="text-xs font-semibold text-slate-500 mb-4">{u2.ranking}</p>
                                  </div>

                                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Annual Tuition:</span>
                                    <span className="text-base font-black text-indigo-600">
                                      ${u2.tuitionFeeUsd.toLocaleString()} USD
                                    </span>
                                  </div>
                                </Card>
                              </div>

                              {/* Comparison Matrix Table */}
                              <Card className="rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                                <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                                  <GraduationCap className="w-5 h-5 text-[#3366FF]" /> Institutional & Fiscal Matrix
                                </h3>

                                <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                                  <table className="w-full text-left border-collapse min-w-[540px]">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-3.5">Key Metric</th>
                                        <th className="p-3.5 text-blue-700 font-black">{u1.name}</th>
                                        <th className="p-3.5 text-indigo-700 font-black">{u2.name}</th>
                                        <th className="p-3.5 text-right">Cost Difference</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Annual Tuition Fee</td>
                                        <td className="p-3.5 font-extrabold text-slate-900">${u1.tuitionFeeUsd.toLocaleString()} USD ({formatNPRDevanagari(u1.tuitionFeeUsd * 135)})</td>
                                        <td className="p-3.5 font-extrabold text-slate-900">${u2.tuitionFeeUsd.toLocaleString()} USD ({formatNPRDevanagari(u2.tuitionFeeUsd * 135)})</td>
                                        <td className="p-3.5 text-right">
                                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                                            {u1.tuitionFeeUsd <= u2.tuitionFeeUsd ? `Uni A Save $${(u2.tuitionFeeUsd - u1.tuitionFeeUsd).toLocaleString()}` : `Uni B Save $${(u1.tuitionFeeUsd - u2.tuitionFeeUsd).toLocaleString()}`}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Est. Living Expenses</td>
                                        <td className="p-3.5">${u1.livingFeeUsd.toLocaleString()} USD/yr</td>
                                        <td className="p-3.5">${u2.livingFeeUsd.toLocaleString()} USD/yr</td>
                                        <td className="p-3.5 text-right text-slate-500">Location Dependent</td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Total Degree Investment ({u1.durationYears} Years)</td>
                                        <td className="p-3.5 font-black text-slate-900">${totalCost1Usd.toLocaleString()} USD</td>
                                        <td className="p-3.5 font-black text-slate-900">${totalCost2Usd.toLocaleString()} USD</td>
                                        <td className="p-3.5 text-right font-black text-[#3366FF]">
                                          {formatNPRDevanagari(totalCost1Usd * 135)}
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Profile Match Score</td>
                                        <td className="p-3.5 font-black text-blue-600">{u1.admissionMatchScore}% Score</td>
                                        <td className="p-3.5 font-black text-indigo-600">{u2.admissionMatchScore}% Score</td>
                                        <td className="p-3.5 text-right">
                                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">
                                            {u1.admissionMatchScore >= u2.admissionMatchScore ? "Uni A Better Match" : "Uni B Better Match"}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Visa Confidence Rate</td>
                                        <td className="p-3.5 font-black text-emerald-600">{u1.visaConfidence}% Confidence</td>
                                        <td className="p-3.5 font-black text-emerald-600">{u2.visaConfidence}% Confidence</td>
                                        <td className="p-3.5 text-right font-bold text-emerald-700">Verified Solvency Tier</td>
                                      </tr>

                                      <tr className="hover:bg-slate-50/80">
                                        <td className="p-3.5 font-extrabold text-slate-900">Scholarship Aid</td>
                                        <td className="p-3.5 text-emerald-700 font-bold">{u1.scholarshipStatus}</td>
                                        <td className="p-3.5 text-emerald-700 font-bold">{u2.scholarshipStatus}</td>
                                        <td className="p-3.5 text-right text-slate-400">Merit Awards Available</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </Card>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* 9. VISA ASSISTANCE TAB - Enhanced with animated steps */}
                {activeTab === "visa-assistance" && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Visa success odds card */}
                    <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white xl:col-span-1 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 relative z-10">Visa Success Odds</h3>
                      {/* Big animated ring */}
                      <div className="flex justify-center my-4 relative z-10">
                        <div className="relative w-32 h-32">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                            <circle
                              cx="64" cy="64" r="52" fill="none"
                              stroke="#10b981" strokeWidth="8"
                              strokeDasharray={2 * Math.PI * 52}
                              strokeDashoffset={2 * Math.PI * 52 * (1 - (profile.visaSuccessProb || 92) / 100)}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-emerald-400">{profile.visaSuccessProb || "92"}%</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Success</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 font-semibold space-y-3 relative z-10">
                        {[
                          { label: "Sponsor Income", value: "Sufficient", ok: true },
                          { label: "Study Gap", value: profile.studyGap ? `${profile.studyGap}yr gap` : "Clean Timeline", ok: true },
                          { label: "Financial Liquidity", value: "Strong Match", ok: true },
                          { label: "English Score", value: profile.englishScore ? `${profile.testType} ${profile.englishScore}` : "Pending", ok: !!profile.englishScore },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-slate-400">{item.label}:</span>
                            <span className={`font-bold flex items-center gap-1 ${item.ok ? "text-emerald-400" : "text-amber-400"}`}>
                              {item.ok ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                              <span>{item.value}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Enhanced step-by-step visa process */}
                    <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white xl:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Visa Process Roadmap</h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">1 / 5 Complete</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { title: "Receive Offer Letter (LOA/CAS/CoE)", desc: "Receive official acceptance certificate from your chosen institution.", done: applications.some(a => a.stage === "Offer Received" || a.stage === "Accepted"), emoji: "📄" },
                          { title: "Pay First-Semester Tuition Deposit", desc: "Pay deposit to secure your seat and receive confirmation receipt.", done: false, emoji: "💳" },
                          { title: "Open GIC Account / Financial Escrow", desc: "Transfer necessary funds for cost-of-living proof to the consulate.", done: false, emoji: "🏦" },
                          { title: "Undergo Medical Examination", desc: "Visit an approved panel clinic for visa-compliant physical exams.", done: false, emoji: "🏥" },
                          { title: "Complete Online Visa Application (IRCC/VFS)", desc: "Fill out official forms, upload transcripts, SOP, and passport scans.", done: false, emoji: "🌐" },
                        ].map((stepItem, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className={`flex gap-4 items-start p-4 rounded-2xl border transition-all ${
                              stepItem.done
                                ? "bg-emerald-50/60 border-emerald-200"
                                : "bg-slate-50/40 border-slate-100 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg border-2 ${
                              stepItem.done ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"
                            }`}>
                              {stepItem.done ? <Check className="w-5 h-5 text-white" /> : stepItem.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-sm font-bold ${stepItem.done ? "text-emerald-700" : "text-slate-800"}`}>{stepItem.title}</h4>
                                {stepItem.done && <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">DONE</span>}
                                {!stepItem.done && idx === 1 && <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">NEXT STEP</span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">{stepItem.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* 10. PROFILE EDITOR TAB */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    {/* Error & Success Notification Toasts */}
                    {errorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4.5 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚠️</span>
                          <span>{errorMsg}</span>
                        </div>
                        <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-800 font-extrabold text-sm ml-4 cursor-pointer">×</button>
                      </div>
                    )}
                    {savedNotify && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4.5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
                        <span className="text-base">✅</span>
                        <span>Profile details saved and synced to database successfully!</span>
                      </div>
                    )}

                    {/* Top Completeness Header (Clean Solid Light Theme) */}
                    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5 shrink-0">
                          {/* Circular Progress Indicator */}
                          <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                className="text-slate-100"
                                strokeWidth="6.5"
                                stroke="currentColor"
                                fill="transparent"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                className="text-[#3686FF] transition-all duration-1000 ease-out"
                                strokeWidth="6.5"
                                strokeDasharray={2 * Math.PI * 34}
                                strokeDashoffset={2 * Math.PI * 34 * (1 - profileCompleteness / 100)}
                                strokeLinecap="round"
                                stroke="#3686FF"
                                fill="transparent"
                              />
                            </svg>
                            <span className="absolute text-lg font-extrabold text-slate-900">{profileCompleteness}%</span>
                          </div>
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3686FF] text-[10px] font-bold uppercase tracking-wider mb-1 border border-blue-100">
                              <Sparkles className="w-3 h-3 text-[#3686FF]" />
                              <span>Database Synced Profile</span>
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Academic & Personal Profile</h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              Keep your credentials updated to get instant university admissibility evaluation.
                            </p>
                          </div>
                        </div>

                        {/* Top action buttons */}
                        <div className="flex flex-wrap gap-2.5 justify-end w-full md:w-auto">
                          {isEditingProfile ? (
                            <>
                              <button
                                onClick={() => handleSaveProfile(false)}
                                disabled={saving}
                                className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-xs border border-slate-200 transition-all active:scale-95 cursor-pointer"
                              >
                                {saving ? "Saving..." : "Save Draft"}
                              </button>
                              <button
                                onClick={() => handleSaveProfile(true)}
                                disabled={saving}
                                className="bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                              >
                                <Check className="w-4 h-4" />
                                {saving ? "Saving to Database..." : "Save Profile & Sync Database"}
                              </button>
                              <button
                                onClick={() => setIsEditingProfile(false)}
                                className="border border-slate-200 bg-white text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                              >
                                Preview Profile
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditForm(profile);
                                  setIsEditingProfile(true);
                                }}
                                className="bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit Profile
                              </button>
                              <button
                                onClick={() => setActiveTab("dashboard")}
                                className="border border-slate-200 bg-white text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                              >
                                Back to Dashboard
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Horizontal list of sections completion status */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 mt-6 pt-6 border-t border-slate-100">
                        {[
                          { idx: 0, label: "Personal", key: "personal", done: !!(profile.name && profile.email && profile.phoneNumber && profile.dateOfBirth) },
                          { idx: 1, label: "Academic", key: "academic", done: !!(profile.highestEducation && profile.gpa && profile.passingYear) },
                          { idx: 2, label: "Preferences", key: "preferences", done: !!(profile.preferredCountry && profile.degreeLevel && profile.program) },
                          { idx: 3, label: "English Test", key: "english", done: profile.hasEnglishTest !== null && (profile.hasEnglishTest === false || !!(profile.englishScore && profile.testType)) },
                          { idx: 4, label: "Work Exp", key: "work", done: !!profile.workStatus },
                          { idx: 5, label: "Financials", key: "financials", done: !!(profile.yearlyBudget && profile.bankBalance && profile.sponsorType) },
                          { idx: 6, label: "Documents", key: "documents", done: !!profile.docsReady || documents.some(d => d.status === "Uploaded") },
                          { idx: 7, label: "Emergency", key: "emergency", done: !!(profile.emergencyName && profile.emergencyPhone) },
                          { idx: 8, label: "Settings", key: "communication", done: true },
                        ].map((sec) => (
                          <button
                            key={sec.idx}
                            onClick={() => setProfileSubTab(sec.idx)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                              profileSubTab === sec.idx
                                ? "border-[#3686FF] bg-blue-50 text-[#3686FF] font-bold"
                                : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/60"
                            }`}
                          >
                            <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">{sec.label}</span>
                            <div className="mt-1 flex items-center justify-center">
                              {sec.done ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Main Workspace Grid (Left Menu / Right Content) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                      
                      {/* Left Sidebar Menu for Desktop / Horizontal menu for Mobile */}
                      <aside className="lg:block">
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs">
                          {[
                            { idx: 0, label: "Personal Information", icon: User },
                            { idx: 1, label: "Academic Credentials", icon: GraduationCap },
                            { idx: 2, label: "Study Preferences", icon: Globe },
                            { idx: 3, label: "English Language Test", icon: Award },
                            { idx: 4, label: "Work Experience", icon: Briefcase },
                            { idx: 5, label: "Financial Details", icon: DollarSign },
                            { idx: 6, label: "Required Documents", icon: FileText },
                            { idx: 7, label: "Emergency Contact", icon: Phone },
                            { idx: 8, label: "Communication Prefs", icon: Mail },
                          ].map((sec) => {
                            const Icon = sec.icon;
                            const isActive = profileSubTab === sec.idx;
                            return (
                              <button
                                key={sec.idx}
                                onClick={() => setProfileSubTab(sec.idx)}
                                className={`flex items-center gap-3 w-full shrink-0 lg:shrink px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                  isActive
                                    ? "bg-[#3686FF] text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                                <span>{sec.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </aside>

                      {/* Right Panel (Active Form or Viewer) */}
                      <div className="rounded-[28px] p-6 md:p-8 border border-slate-200/80 bg-white shadow-xs">
                        
                        {isEditingProfile ? (
                          /* ═══════════ EDITING FORM MODE ═══════════ */
                          <div className="space-y-6">
                            
                            {/* Section 0: Personal Info */}
                            {profileSubTab === 0 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <User className="w-4.5 h-4.5 text-blue-500" />
                                  Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Full Name</span>
                                    <input
                                      type="text"
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Email Address</span>
                                    <input
                                      type="email"
                                      value={editForm.email}
                                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Phone Number</span>
                                    <input
                                      type="text"
                                      value={editForm.phoneNumber}
                                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">
                                      Date of Birth (Must be 16+)
                                    </span>
                                    {(() => {
                                      const maxDob16Str = (() => {
                                        const d = new Date();
                                        d.setFullYear(d.getFullYear() - 16);
                                        return d.toISOString().slice(0, 10);
                                      })();

                                      const isFuture = editForm.dateOfBirth && editForm.dateOfBirth > new Date().toISOString().slice(0, 10);
                                      
                                      const isUnder16 = (() => {
                                        if (!editForm.dateOfBirth) return false;
                                        const dobDate = new Date(editForm.dateOfBirth);
                                        if (isNaN(dobDate.getTime())) return true;
                                        const today = new Date();
                                        let age = today.getFullYear() - dobDate.getFullYear();
                                        const monthDiff = today.getMonth() - dobDate.getMonth();
                                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                                          age--;
                                        }
                                        return age < 16;
                                      })();

                                      const isInvalid = isFuture || isUnder16;

                                      return (
                                        <>
                                          <input
                                            type="date"
                                            max={maxDob16Str}
                                            value={editForm.dateOfBirth}
                                            onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                              isInvalid
                                                ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                                : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                            }`}
                                          />
                                          {isFuture && (
                                            <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                              <span>⚠️ Date of birth cannot be in the future</span>
                                            </p>
                                          )}
                                          {!isFuture && isUnder16 && (
                                            <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                              <span>⚠️ Invalid DOB: You must be at least 16 years old (Age 16+)</span>
                                            </p>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Gender</span>
                                    <select
                                      value={editForm.gender}
                                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Gender</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Other">Other</option>
                                      <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Nationality</span>
                                    <input
                                      type="text"
                                      value={editForm.nationality}
                                      onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Current Country</span>
                                    <input
                                      type="text"
                                      value={editForm.currentCountry}
                                      onChange={(e) => setEditForm({ ...editForm, currentCountry: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Passport Number</span>
                                    <input
                                      type="text"
                                      value={editForm.passportNumber}
                                      onChange={(e) => setEditForm({ ...editForm, passportNumber: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Passport Expiry Date</span>
                                    <input
                                      type="date"
                                      value={editForm.passportExpiryDate}
                                      onChange={(e) => setEditForm({ ...editForm, passportExpiryDate: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Marital Status</span>
                                    <select
                                      value={editForm.maritalStatus}
                                      onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Status</option>
                                      <option value="Single">Single</option>
                                      <option value="Married">Married</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </label>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                  <h4 className="text-xs font-bold text-slate-650">Residential Address</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <label className="sm:col-span-2 block">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Address Line</span>
                                      <input
                                        type="text"
                                        value={editForm.addressLine}
                                        onChange={(e) => setEditForm({ ...editForm, addressLine: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                      />
                                    </label>
                                    <label className="block">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">City / Town</span>
                                      <input
                                        type="text"
                                        value={editForm.cityTown}
                                        onChange={(e) => setEditForm({ ...editForm, cityTown: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                      />
                                    </label>
                                    <label className="block">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Province / State</span>
                                      <input
                                        type="text"
                                        value={editForm.provinceState}
                                        onChange={(e) => setEditForm({ ...editForm, provinceState: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                      />
                                    </label>
                                    <label className="block">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Postal / ZIP Code</span>
                                      <input
                                        type="text"
                                        value={editForm.postalZipCode}
                                        onChange={(e) => setEditForm({ ...editForm, postalZipCode: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Section 1: Academic Credentials */}
                            {profileSubTab === 1 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <GraduationCap className="w-4.5 h-4.5 text-blue-500" />
                                  Academic Credentials
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Highest Education Level</span>
                                    <select
                                      value={editForm.highestEducation}
                                      onChange={(e) => setEditForm({ ...editForm, highestEducation: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Level</option>
                                      <option value="High School">High School (Grade 12)</option>
                                      <option value="Diploma">Diploma / Vocational</option>
                                      <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                                      <option value="Master's Degree">Master&apos;s Degree</option>
                                      <option value="Doctorate">Doctorate / PhD</option>
                                    </select>
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Country of Education</span>
                                    <input
                                      type="text"
                                      value={editForm.countryOfEducation}
                                      onChange={(e) => setEditForm({ ...editForm, countryOfEducation: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Graduation Status</span>
                                    <select
                                      value={editForm.graduatedInstitution ? "true" : "false"}
                                      onChange={(e) => setEditForm({ ...editForm, graduatedInstitution: e.target.value === "true" })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="true">Graduated (Degree Awarded)</option>
                                      <option value="false">Currently Studying / Incomplete</option>
                                    </select>
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Passing / Graduation Year</span>
                                    <input
                                      type="text"
                                      value={editForm.passingYear}
                                      onChange={(e) => setEditForm({ ...editForm, passingYear: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Academic GPA / Percentage</span>
                                    <input
                                      type="text"
                                      value={editForm.gpa}
                                      onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })}
                                      placeholder="e.g. 3.75 or 85%"
                                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                        isNegativeVal(editForm.gpa)
                                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                      }`}
                                    />
                                    {isNegativeVal(editForm.gpa) && (
                                      <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                        <span>⚠️ GPA / percentage cannot be negative</span>
                                      </p>
                                    )}
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Number of Backlogs</span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={editForm.backlogs}
                                      onChange={(e) => setEditForm({ ...editForm, backlogs: e.target.value })}
                                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                        isNegativeVal(editForm.backlogs)
                                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                      }`}
                                    />
                                    {isNegativeVal(editForm.backlogs) && (
                                      <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                        <span>⚠️ Backlogs count cannot be negative</span>
                                      </p>
                                    )}
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Study Gap (Years)</span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={editForm.studyGap}
                                      onChange={(e) => setEditForm({ ...editForm, studyGap: e.target.value })}
                                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                        isNegativeVal(editForm.studyGap)
                                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                      }`}
                                    />
                                    {isNegativeVal(editForm.studyGap) && (
                                      <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                        <span>⚠️ Study gap cannot be negative</span>
                                      </p>
                                    )}
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Section 2: Study Preferences */}
                            {profileSubTab === 2 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Globe className="w-4.5 h-4.5 text-blue-500" />
                                  Study Preferences
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Preferred Destination Country</span>
                                    <input
                                      type="text"
                                      value={editForm.preferredCountry}
                                      onChange={(e) => setEditForm({ ...editForm, preferredCountry: e.target.value })}
                                      placeholder="e.g. Canada, USA, UK"
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Preferred Degree Level</span>
                                    <select
                                      value={editForm.degreeLevel}
                                      onChange={(e) => setEditForm({ ...editForm, degreeLevel: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Degree</option>
                                      <option value="Bachelor's">Bachelor's Degree</option>
                                      <option value="Master's">Master's Degree</option>
                                      <option value="Doctorate">Doctorate / PhD</option>
                                      <option value="Diploma">Post-Graduate Diploma</option>
                                      <option value="Certificate">Certificate / Foundation</option>
                                    </select>
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Preferred Field of Study</span>
                                    <input
                                      type="text"
                                      value={editForm.field}
                                      onChange={(e) => setEditForm({ ...editForm, field: e.target.value })}
                                      placeholder="e.g. Computer Science, Business"
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Preferred Program / Course</span>
                                    <input
                                      type="text"
                                      value={editForm.program}
                                      onChange={(e) => setEditForm({ ...editForm, program: e.target.value })}
                                      placeholder="e.g. MSc in Data Science"
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Target Intake</span>
                                    {(() => {
                                      const currentYear = new Date().getFullYear();
                                      const currentMonth = new Date().getMonth() + 1;

                                      const allIntakeOptions = [
                                        { val: `Spring ${currentYear}`, month: 1, year: currentYear },
                                        { val: `Summer ${currentYear}`, month: 5, year: currentYear },
                                        { val: `Fall ${currentYear}`, month: 9, year: currentYear },
                                        { val: `Spring ${currentYear + 1}`, month: 1, year: currentYear + 1 },
                                        { val: `Summer ${currentYear + 1}`, month: 5, year: currentYear + 1 },
                                        { val: `Fall ${currentYear + 1}`, month: 9, year: currentYear + 1 },
                                        { val: `Spring ${currentYear + 2}`, month: 1, year: currentYear + 2 },
                                        { val: `Fall ${currentYear + 2}`, month: 9, year: currentYear + 2 },
                                      ];

                                      const validIntakeOptions = allIntakeOptions.filter((opt) => {
                                        if (opt.year > currentYear) return true;
                                        return opt.month >= currentMonth;
                                      });

                                      return (
                                        <select
                                          value={editForm.intake}
                                          onChange={(e) => setEditForm({ ...editForm, intake: e.target.value })}
                                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                        >
                                          <option value="">Select Intake</option>
                                          {validIntakeOptions.map((opt) => (
                                            <option key={opt.val} value={opt.val}>
                                              {opt.val}
                                            </option>
                                          ))}
                                        </select>
                                      );
                                    })()}
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Section 3: English Language Test */}
                            {profileSubTab === 3 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Award className="w-4.5 h-4.5 text-blue-500" />
                                  English Language Proficiency
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Taken English Test?</span>
                                    <select
                                      value={editForm.hasEnglishTest === null ? "" : editForm.hasEnglishTest ? "true" : "false"}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setEditForm({
                                          ...editForm,
                                          hasEnglishTest: val === "" ? null : val === "true",
                                        });
                                      }}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Option</option>
                                      <option value="true">Yes, I have taken a test</option>
                                      <option value="false">No, I have not taken a test / plan to take</option>
                                    </select>
                                  </label>
                                  
                                  {editForm.hasEnglishTest && (
                                    <>
                                      <label className="block">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Test Type</span>
                                        <select
                                          value={editForm.testType}
                                          onChange={(e) => setEditForm({ ...editForm, testType: e.target.value })}
                                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                        >
                                          <option value="IELTS">IELTS Academic</option>
                                          <option value="TOEFL">TOEFL iBT</option>
                                          <option value="PTE">PTE Academic</option>
                                          <option value="Duolingo">Duolingo English Test</option>
                                        </select>
                                      </label>
                                      <label className="block">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Overall Band / Score</span>
                                        {(() => {
                                          const getScoreError = () => {
                                            if (!editForm.englishScore) return "";
                                            const score = parseFloat(editForm.englishScore);
                                            if (isNaN(score)) return "Please enter a valid numeric score.";
                                            if (score < 0) return "Test score cannot be negative.";

                                            const type = (editForm.testType || "IELTS").toUpperCase();
                                            if (type.includes("IELTS")) {
                                              if (score < 1 || score > 9) return "IELTS band score must be between 1.0 and 9.0.";
                                              if ((score * 10) % 5 !== 0) return "IELTS score must be in half-band increments (e.g. 6.5, 7.0).";
                                            } else if (type.includes("PTE")) {
                                              if (score < 10 || score > 90) return "PTE score must be between 10 and 90.";
                                            } else if (type.includes("TOEFL")) {
                                              if (score < 0 || score > 120) return "TOEFL score must be between 0 and 120.";
                                            } else if (type.includes("DUOLINGO")) {
                                              if (score < 10 || score > 160) return "Duolingo score must be between 10 and 160.";
                                              if (score % 5 !== 0) return "Duolingo score must be in increments of 5 (e.g. 105, 115).";
                                            }
                                            return "";
                                          };
                                          const engError = getScoreError();

                                          return (
                                            <>
                                              <input
                                                type="text"
                                                value={editForm.englishScore}
                                                onChange={(e) => setEditForm({ ...editForm, englishScore: e.target.value })}
                                                placeholder="e.g. 7.5 or 115"
                                                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                                  engError
                                                    ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                                    : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                                }`}
                                              />
                                              {engError && (
                                                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                                  <span>⚠️ {engError}</span>
                                                </p>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </label>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Section 4: Work Experience */}
                            {profileSubTab === 4 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                                  Work Experience (Optional)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Employment Status</span>
                                    <select
                                      value={editForm.workStatus}
                                      onChange={(e) => setEditForm({ ...editForm, workStatus: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Status</option>
                                      <option value="Employed">Employed (Full-time)</option>
                                      <option value="Self-Employed">Self-Employed / Business</option>
                                      <option value="Intern">Intern / Part-time</option>
                                      <option value="Unemployed">Unemployed</option>
                                      <option value="Student">Student</option>
                                    </select>
                                  </label>
                                  
                                  {["Employed", "Self-Employed", "Intern"].includes(editForm.workStatus) && (
                                    <>
                                      <label className="block">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Company Name</span>
                                        <input
                                          type="text"
                                          value={editForm.companyName}
                                          onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                        />
                                      </label>
                                      <label className="block">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Job Title</span>
                                        <input
                                          type="text"
                                          value={editForm.jobTitle}
                                          onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                        />
                                      </label>
                                      <label className="block">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Years of Experience</span>
                                        <input
                                          type="number"
                                          min="0"
                                          value={editForm.workExperience}
                                          onChange={(e) => setEditForm({ ...editForm, workExperience: e.target.value })}
                                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                        />
                                      </label>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Section 5: Financial Details */}
                            {profileSubTab === 5 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <DollarSign className="w-4.5 h-4.5 text-blue-500" />
                                  Financial Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Preferred Currency</span>
                                    <select
                                      value={editForm.currency}
                                      onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="USD">USD ($)</option>
                                      <option value="CAD">CAD (C$)</option>
                                      <option value="GBP">GBP (£)</option>
                                      <option value="AUD">AUD (A$)</option>
                                      <option value="EUR">EUR (€)</option>
                                      <option value="INR">INR (₹)</option>
                                      <option value="NPR">NPR (Rs)</option>
                                    </select>
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Annual Study Budget ({editForm.currency})</span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={editForm.yearlyBudget}
                                      onChange={(e) => setEditForm({ ...editForm, yearlyBudget: e.target.value })}
                                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                        isNegativeVal(editForm.yearlyBudget)
                                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                      }`}
                                    />
                                    {isNegativeVal(editForm.yearlyBudget) && (
                                      <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                        <span>⚠️ Annual budget cannot be negative</span>
                                      </p>
                                    )}
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Available Bank Balance ({editForm.currency})</span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={editForm.bankBalance}
                                      onChange={(e) => setEditForm({ ...editForm, bankBalance: e.target.value })}
                                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                        isNegativeVal(editForm.bankBalance)
                                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                      }`}
                                    />
                                    {isNegativeVal(editForm.bankBalance) && (
                                      <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                        <span>⚠️ Bank balance cannot be negative</span>
                                      </p>
                                    )}
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Sponsor Type</span>
                                    <select
                                      value={editForm.sponsorType}
                                      onChange={(e) => setEditForm({ ...editForm, sponsorType: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Sponsor</option>
                                      <option value="Self">Self-Funded</option>
                                      <option value="Parents">Parents / Immediate Family</option>
                                      <option value="Relative">Other Relative</option>
                                      <option value="Government">Government / Company Scholarship</option>
                                      <option value="Loan">Bank Educational Loan</option>
                                    </select>
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Sponsor's Annual Income ({editForm.currency})</span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={editForm.sponsorIncome}
                                      onChange={(e) => setEditForm({ ...editForm, sponsorIncome: e.target.value })}
                                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                                        isNegativeVal(editForm.sponsorIncome)
                                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500"
                                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white"
                                      }`}
                                    />
                                    {isNegativeVal(editForm.sponsorIncome) && (
                                      <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                        <span>⚠️ Sponsor income cannot be negative</span>
                                      </p>
                                    )}
                                  </label>
                                  <div className="flex items-center gap-3 pt-5">
                                    <input
                                      type="checkbox"
                                      id="scholarshipNeeded"
                                      checked={editForm.scholarshipNeeded}
                                      onChange={(e) => setEditForm({ ...editForm, scholarshipNeeded: e.target.checked })}
                                      className="h-4.5 w-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="scholarshipNeeded" className="text-xs font-bold text-slate-700 select-none cursor-pointer">
                                      I require scholarship / financial aid support
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Section 6: Required Documents */}
                            {profileSubTab === 6 && (
                              <div className="space-y-5">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <FileText className="w-4.5 h-4.5 text-blue-500" />
                                    Required Documents Status
                                  </h3>
                                  <button
                                    onClick={() => setActiveTab("documents")}
                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    Go to Document Locker <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                                  These are the mandatory academic and identity documents required to submit applications. You can manage and upload them in the Document Locker tab.
                                </p>
                                <div className="divide-y divide-slate-50">
                                  {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between py-3.5">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600" : doc.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"}`}>
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{doc.category}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600" : doc.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                                          {doc.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section 7: Emergency Contact */}
                            {profileSubTab === 7 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Phone className="w-4.5 h-4.5 text-blue-500" />
                                  Emergency Contact Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Contact Full Name</span>
                                    <input
                                      type="text"
                                      value={editForm.emergencyName}
                                      onChange={(e) => setEditForm({ ...editForm, emergencyName: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Relationship</span>
                                    <input
                                      type="text"
                                      value={editForm.emergencyRelation}
                                      onChange={(e) => setEditForm({ ...editForm, emergencyRelation: e.target.value })}
                                      placeholder="e.g. Parent, Sibling"
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Phone Number</span>
                                    <input
                                      type="text"
                                      value={editForm.emergencyPhone}
                                      onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Email Address</span>
                                    <input
                                      type="email"
                                      value={editForm.emergencyEmail}
                                      onChange={(e) => setEditForm({ ...editForm, emergencyEmail: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Section 8: Communication Preferences */}
                            {profileSubTab === 8 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Mail className="w-4.5 h-4.5 text-blue-500" />
                                  Communication Preferences
                                </h3>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between py-2">
                                    <div>
                                      <p className="text-xs font-bold text-slate-700">Email Newsletters</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">Receive monthly scholarship roundups and study guides.</p>
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={editForm.prefersEmail}
                                      onChange={(e) => setEditForm({ ...editForm, prefersEmail: e.target.checked })}
                                      className="h-4.5 w-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between py-2">
                                    <div>
                                      <p className="text-xs font-bold text-slate-700">WhatsApp & SMS alerts</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">Receive real-time application and visa status alerts on your phone.</p>
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={editForm.prefersSMS}
                                      onChange={(e) => setEditForm({ ...editForm, prefersSMS: e.target.checked })}
                                      className="h-4.5 w-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Bottom inline action buttons */}
                            {profileSubTab !== 6 && (
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
                                <span className="text-slate-400 font-medium text-xs flex items-center gap-1.5">
                                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                  Changes are automatically encrypted & saved to database.
                                </span>
                                <div className="flex gap-2.5">
                                  <button
                                    onClick={() => handleSaveProfile(false)}
                                    disabled={saving}
                                    className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-xs border border-slate-200 transition-all active:scale-95 cursor-pointer"
                                  >
                                    {saving ? "Saving..." : "Save Draft"}
                                  </button>
                                  <button
                                    onClick={() => handleSaveProfile(true)}
                                    disabled={saving}
                                    className="bg-[#3686FF] hover:bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Check className="w-4 h-4" />
                                    {saving ? "Saving to Database..." : "Save & Sync Profile to Database"}
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        ) : (
                          /* ═══════════ READ-ONLY PREVIEW MODE ═══════════ */
                          <div className="space-y-6">
                            
                            {/* Section 0: Personal Info Preview */}
                            {profileSubTab === 0 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <User className="w-4.5 h-4.5 text-blue-500" />
                                  Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.name}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.email}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.phoneNumber || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.dateOfBirth || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.gender || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nationality</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.nationality || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Country</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.currentCountry || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passport Number</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.passportNumber || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passport Expiry</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.passportExpiryDate || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marital Status</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.maritalStatus || "Not set"}</span>
                                  </div>
                                </div>
                                
                                <div className="p-4.5 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors mt-4">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Residential Address</span>
                                  <p className="text-sm font-bold text-slate-800 mt-1">
                                    {profile.addressLine ? (
                                      <>
                                        {profile.addressLine}, {profile.cityTown}, {profile.provinceState} {profile.postalZipCode}
                                      </>
                                    ) : (
                                      "Not set"
                                    )}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Section 1: Academic Credentials Preview */}
                            {profileSubTab === 1 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <GraduationCap className="w-4.5 h-4.5 text-blue-500" />
                                  Academic Credentials
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Highest Education Level</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.highestEducation || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country of Education</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.countryOfEducation || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Graduation Status</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">
                                      {profile.graduatedInstitution ? "Graduated (Degree Awarded)" : "Currently Studying / Incomplete"}
                                    </span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passing Year</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.passingYear || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GPA / Academic Score</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.gpa || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Backlogs</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.backlogs || "0"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Study Gap</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.studyGap || "0"} years</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Section 2: Study Preferences Preview */}
                            {profileSubTab === 2 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Globe className="w-4.5 h-4.5 text-blue-500" />
                                  Study Preferences
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Destination</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.preferredCountry || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Degree Level</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.degreeLevel || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Field of Study</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.field || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Program</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.program || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Intake</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.intake || "Not set"}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Section 3: English Language Preview */}
                            {profileSubTab === 3 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Award className="w-4.5 h-4.5 text-blue-500" />
                                  English Language Proficiency
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Has Taken English Test?</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">
                                      {profile.hasEnglishTest === true ? "Yes" : profile.hasEnglishTest === false ? "No" : "Not specified"}
                                    </span>
                                  </div>
                                  {profile.hasEnglishTest && (
                                    <>
                                      <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Type</span>
                                        <span className="text-sm font-bold text-slate-800 mt-1">{profile.testType}</span>
                                      </div>
                                      <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</span>
                                        <span className="text-sm font-bold text-slate-800 mt-1">{profile.englishScore || "Not set"}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Section 4: Work Experience Preview */}
                            {profileSubTab === 4 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                                  Work Experience
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employment Status</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.workStatus || "Not set"}</span>
                                  </div>
                                  {["Employed", "Self-Employed", "Intern"].includes(profile.workStatus) && (
                                    <>
                                      <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</span>
                                        <span className="text-sm font-bold text-slate-800 mt-1">{profile.companyName || "N/A"}</span>
                                      </div>
                                      <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title</span>
                                        <span className="text-sm font-bold text-slate-800 mt-1">{profile.jobTitle || "N/A"}</span>
                                      </div>
                                      <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years of Experience</span>
                                        <span className="text-sm font-bold text-slate-800 mt-1">{profile.workExperience || "0"} years</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Section 5: Financial Details Preview */}
                            {profileSubTab === 5 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <DollarSign className="w-4.5 h-4.5 text-blue-500" />
                                  Financial Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Budget</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">
                                      {profile.yearlyBudget ? formatNPRDevanagari((profile.currency === "USD" || !profile.currency) ? parseFloat(profile.yearlyBudget) * 134.5 : parseFloat(profile.yearlyBudget)) : "Not set"}
                                    </span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Bank Balance</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">
                                      {profile.bankBalance ? formatNPRDevanagari((profile.currency === "USD" || !profile.currency) ? parseFloat(profile.bankBalance) * 134.5 : parseFloat(profile.bankBalance)) : "Not set"}
                                    </span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sponsor Type</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.sponsorType || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sponsor&apos;s Annual Income</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">
                                      {profile.sponsorIncome ? formatNPRDevanagari((profile.currency === "USD" || !profile.currency) ? parseFloat(profile.sponsorIncome) * 134.5 : parseFloat(profile.sponsorIncome)) : "Not set"}
                                    </span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scholarship Needed</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.scholarshipNeeded ? "Yes" : "No"}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Section 6: Required Documents Preview */}
                            {profileSubTab === 6 && (
                              <div className="space-y-5">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <FileText className="w-4.5 h-4.5 text-blue-500" />
                                    Required Documents Status
                                  </h3>
                                  <button
                                    onClick={() => setActiveTab("documents")}
                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    Go to Document Locker <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                  {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between py-3.5">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600" : doc.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"}`}>
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                                          {doc.fileName && (
                                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{doc.fileName}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600" : doc.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                                          {doc.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section 7: Emergency Contact Preview */}
                            {profileSubTab === 7 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Phone className="w-4.5 h-4.5 text-blue-500" />
                                  Emergency Contact Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Name</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.emergencyName || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relationship</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.emergencyRelation || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.emergencyPhone || "Not set"}</span>
                                  </div>
                                  <div className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.emergencyEmail || "Not set"}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Section 8: Communication Preferences Preview */}
                            {profileSubTab === 8 && (
                              <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
                                  <Mail className="w-4.5 h-4.5 text-blue-500" />
                                  Communication Preferences
                                </h3>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                    <div>
                                      <p className="text-xs font-bold text-slate-700">Email Newsletters</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">Receive monthly scholarship roundups and study guides.</p>
                                    </div>
                                    <span className={`text-xs font-black ${profile.prefersEmail ? "text-emerald-600" : "text-slate-400"}`}>
                                      {profile.prefersEmail ? "ENABLED" : "DISABLED"}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between py-2">
                                    <div>
                                      <p className="text-xs font-bold text-slate-700">WhatsApp & SMS alerts</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">Receive real-time application and visa status alerts on your phone.</p>
                                    </div>
                                    <span className={`text-xs font-black ${profile.prefersSMS ? "text-emerald-600" : "text-slate-400"}`}>
                                      {profile.prefersSMS ? "ENABLED" : "DISABLED"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. SETTINGS TAB */}
                {activeTab === "settings" && (
                  <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300`}>
                    
                    {/* Left Column: Sub-tabs Navigator */}
                    <div className="lg:col-span-1 space-y-2">
                      {[
                        { id: "account" as const, label: "Account Info", desc: "Avatar & profile details", icon: User },
                        { id: "notifications" as const, label: "Notifications", desc: "WhatsApp & email alerts", icon: Bell },
                        { id: "security" as const, label: "Security & Privacy", desc: "Password & 2FA setup", icon: Shield },
                        { id: "system" as const, label: "System Preferences", desc: "Language & theme settings", icon: Settings }
                      ].map((subTab) => {
                        const SubIcon = subTab.icon;
                        const isSubActive = activeSettingsSubTab === subTab.id;
                        return (
                          <button
                            key={subTab.id}
                            type="button"
                            onClick={() => setActiveSettingsSubTab(subTab.id)}
                            className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                              isSubActive 
                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15" 
                                : `${darkModeSimulated ? "bg-slate-800/50 border-slate-800 text-slate-350 hover:bg-slate-800" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"}`
                            }`}
                          >
                            <SubIcon className={`w-5 h-5 shrink-0 ${isSubActive ? "text-white" : "text-slate-400"}`} />
                            <div className="min-w-0">
                              <p className="text-xs font-black leading-none">{subTab.label}</p>
                              <p className={`text-[9px] font-semibold mt-1 truncate ${isSubActive ? "text-blue-100" : "text-slate-400"}`}>{subTab.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Settings Panel Pane */}
                    <div className="lg:col-span-3">
                      <Card className={`rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 transition-all duration-300 ${
                        darkModeSimulated 
                          ? "bg-slate-900 text-slate-100 border border-slate-800 shadow-none" 
                          : "bg-white text-slate-900"
                      }`}>
                        
                        {/* Sub-tab 1: ACCOUNT & AVATAR */}
                        {activeSettingsSubTab === "account" && (
                          <div className="space-y-6">
                            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2 border-slate-100">
                              <User className="w-4 h-4 text-blue-500" /> Account Details & Customize Avatar
                            </h3>

                            {/* Dynamic Avatar Customize Section */}
                            <div className={`flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl border ${darkModeSimulated ? "bg-slate-800/40 border-slate-800" : "bg-slate-50/50 border-slate-100/50"}`}>
                              {/* Avatar Preview */}
                              <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br ${currentAvatarGradient} flex items-center justify-center font-black text-white text-3xl shadow-lg transition-all duration-500`}>
                                {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "S"}
                              </div>
                              <div className="space-y-3 flex-1 text-center sm:text-left">
                                <p className="text-xs font-black text-slate-700">Choose Avatar Theme</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                  {Object.keys(avatarThemeClasses).map((themeName) => {
                                    const gradient = avatarThemeClasses[themeName];
                                    return (
                                      <button
                                        key={themeName}
                                        type="button"
                                        onClick={() => setAvatarTheme(themeName)}
                                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} border-2 transition-all ${
                                          avatarTheme === themeName 
                                            ? "border-blue-500 scale-110 shadow-sm" 
                                            : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                                        }`}
                                        title={themeName}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Account Form */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                  <input
                                    type="text"
                                    value={settingsForm.name}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors ${darkModeSimulated ? "bg-slate-800 border-slate-750 text-white focus:border-blue-550" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500"}`}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    Email Address
                                    <span className="inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6a3 3 0 100-6 3 3 0 000 6zm6 6a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      Locked
                                    </span>
                                  </label>
                                  <div className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2 select-all cursor-default ${darkModeSimulated ? "bg-slate-800/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                    <span className="truncate">{settingsForm.email}</span>
                                  </div>
                                  <p className="text-[9px] text-slate-400 font-medium pl-1">Contact support to change your email.</p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  Phone Number
                                  <span className="inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6a3 3 0 100-6 3 3 0 000 6zm6 6a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Locked
                                  </span>
                                </label>
                                <div className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2 select-all cursor-default ${darkModeSimulated ? "bg-slate-800/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                  <span>{settingsForm.phone || "Not set"}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium pl-1">Phone is used for OTP login and cannot be changed here.</p>
                              </div>
                              
                              <div className="pt-2 flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={handleSaveSettings}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
                                >
                                  Save Changes
                                </button>
                                {settingsSavedToast && (
                                  <span className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Settings updated successfully!
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sub-tab 2: NOTIFICATIONS */}
                        {activeSettingsSubTab === "notifications" && (
                          <div className="space-y-6">
                            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2 border-slate-100">
                              <Bell className="w-4 h-4 text-blue-500" /> Notification Preferences
                            </h3>

                            <div className="space-y-4 divide-y divide-slate-100">
                              {/* Toggle Row 1: WhatsApp */}
                              <div className="flex items-center justify-between py-3">
                                <div>
                                  <p className="text-xs font-black text-slate-700">WhatsApp Alerts</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive real-time matches and counselor messages directly on WhatsApp.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setWhatsappNotifications(!whatsappNotifications)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${whatsappNotifications ? "bg-blue-600" : "bg-slate-250"}`}
                                >
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${whatsappNotifications ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                              </div>

                              {/* Toggle Row 2: Email Newsletters */}
                              <div className="flex items-center justify-between py-3 pt-4 border-slate-100">
                                <div>
                                  <p className="text-xs font-black text-slate-700">Email Newsletters & digests</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive monthly scholarship roundups and admissions guidelines.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEmailNotifications(!emailNotifications)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailNotifications ? "bg-blue-600" : "bg-slate-250"}`}
                                >
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifications ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                              </div>

                              {/* Toggle Row 3: Push Notifications */}
                              <div className="flex items-center justify-between py-3 pt-4 border-slate-100">
                                <div>
                                  <p className="text-xs font-black text-slate-700">Browser Push Alerts</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive live notifications when counselor replies or document state changes.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPushNotifications(!pushNotifications)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushNotifications ? "bg-blue-600" : "bg-slate-255"}`}
                                >
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushNotifications ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                              </div>

                              {/* Toggle Row 4: Weekly Report */}
                              <div className="flex items-center justify-between py-3 pt-4 border-slate-100">
                                <div>
                                  <p className="text-xs font-black text-slate-700">Weekly Progress Report</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">A comprehensive digest of your application pipeline and tasks status.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setWeeklyReportNotifications(!weeklyReportNotifications)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weeklyReportNotifications ? "bg-blue-600" : "bg-slate-250"}`}
                                >
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${weeklyReportNotifications ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sub-tab 3: SECURITY & 2FA */}
                        {activeSettingsSubTab === "security" && (
                          <div className="space-y-6">
                            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2 border-slate-100">
                              <Shield className="w-4 h-4 text-blue-500" /> Account Security & Credentials
                            </h3>

                            {/* Password Fields */}
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                                <input
                                  type="password"
                                  value={oldPassword}
                                  onChange={(e) => setOldPassword(e.target.value)}
                                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors ${darkModeSimulated ? "bg-slate-800 border-slate-750 text-white focus:border-blue-550" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500"}`}
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors ${darkModeSimulated ? "bg-slate-800 border-slate-750 text-white focus:border-blue-550" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500"}`}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Password</label>
                                  <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors ${darkModeSimulated ? "bg-slate-800 border-slate-750 text-white focus:border-blue-550" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500"}`}
                                  />
                                </div>
                              </div>

                              {/* Password Strength Meter */}
                              {newPassword && (
                                <div className={`space-y-1.5 p-3.5 rounded-2xl border ${darkModeSimulated ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-slate-400 uppercase tracking-wide">Password Strength</span>
                                    <span className={`font-black ${passwordStrength.textColor}`}>{passwordStrength.text}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    />
                                  </div>
                                  <p className="text-[9px] text-slate-400 leading-snug font-semibold">Include length, capital letters, digits, and special characters for a strong password.</p>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  if (!oldPassword || !newPassword) {
                                    alert("Please fill in current and new password fields.");
                                    return;
                                  }
                                  if (newPassword !== confirmPassword) {
                                    alert("New password and confirmation password do not match.");
                                    return;
                                  }
                                  alert("Password updated successfully!");
                                  setOldPassword("");
                                  setNewPassword("");
                                  setConfirmPassword("");
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                              >
                                Update Password
                              </button>
                            </div>

                            {/* Two-Factor Authentication Section */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-black text-slate-700">Two-Factor Authentication (2FA)</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Secure your student credentials with Google Authenticator verification codes.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (twoFactorEnabled) {
                                    setTwoFactorEnabled(false);
                                  } else {
                                    setShow2faModal(true);
                                  }
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                  twoFactorEnabled 
                                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                }`}
                              >
                                {twoFactorEnabled ? "Disable 2FA" : "Configure 2FA"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Sub-tab 4: SYSTEM PREFERENCES & SIMULATED DARK MODE */}
                        {activeSettingsSubTab === "system" && (
                          <div className="space-y-6">
                            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2 border-slate-100">
                              <Settings className="w-4 h-4 text-blue-500" /> System Preferences
                            </h3>

                            <div className="space-y-4">
                              {/* Language dropdown */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Language</label>
                                <select
                                  value={selectedLanguage}
                                  onChange={(e) => setSelectedLanguage(e.target.value)}
                                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors ${darkModeSimulated ? "bg-slate-800 border-slate-750 text-white focus:border-blue-550" : "bg-white border-slate-200 text-slate-850 focus:border-blue-500"}`}
                                >
                                  <option value="English">English (United States)</option>
                                  <option value="French">Français (French)</option>
                                  <option value="Spanish">Español (Spanish)</option>
                                  <option value="Nepali">नेपाली (Nepali)</option>
                                </select>
                              </div>

                              {/* Currency dropdown */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Display Currency</label>
                                <select
                                  value={selectedCurrency}
                                  onChange={(e) => setSelectedCurrency(e.target.value)}
                                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors ${darkModeSimulated ? "bg-slate-800 border-slate-750 text-white focus:border-blue-550" : "bg-white border-slate-200 text-slate-850 focus:border-blue-500"}`}
                                >
                                  <option value="USD">USD ($) - US Dollar</option>
                                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                                  <option value="NPR">NPR (Rs.) - Nepalese Rupee</option>
                                  <option value="INR">INR (₹) - Indian Rupee</option>
                                </select>
                              </div>

                              {/* Dark Mode Simulator Toggle */}
                              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-black text-slate-700">Simulated Dark Theme</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Toggle a simulated dark slate theme for this settings card.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setDarkModeSimulated(!darkModeSimulated)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkModeSimulated ? "bg-blue-600" : "bg-slate-200"}`}
                                >
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkModeSimulated ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Common Danger Zone - Rendered inside right panel below active sub-tabs */}
                        <div className="mt-8 pt-6 border-t border-rose-100">
                          <Card className={`rounded-2xl border border-rose-200 bg-rose-50/40 p-5 space-y-4`}>
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider">Danger Zone</h4>
                                <p className="text-xs font-semibold text-rose-800 mt-1">Once you deactivate or request account deletion, your applications and matching records will be frozen.</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              <button
                                type="button"
                                onClick={() => setShowDeactivateModal(true)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
                              >
                                Deactivate Account
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Are you sure you want to permanently delete your AbroadLift account? This action is irreversible.")) {
                                    alert("Account deletion request submitted.");
                                    triggerLogout();
                                  }
                                }}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all active:scale-95 cursor-pointer shadow-md shadow-rose-500/10"
                              >
                                Permanently Delete
                              </button>
                            </div>
                          </Card>
                        </div>
                        
                      </Card>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </main>

        </div>
      </div>

      {deleteProfileId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 max-w-md w-full shadow-[0_30px_70px_rgba(15,23,42,0.15)] space-y-6 text-center transform scale-100 transition-transform duration-300 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-500 mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Remove Saved Shortlist?
              </h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Are you sure you want to remove this saved match profile from your shortlist?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteProfileId(null)}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm rounded-2xl transition-all shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteSavedProfile(deleteProfileId);
                  setDeleteProfileId(null);
                }}
                className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-rose-500/10"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {show2faModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <Card className="bg-white border border-slate-100 rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-4 text-center transform animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900">Configure Two-Factor Auth</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">Scan this QR code with Google Authenticator or Duo to enable 2FA alerts.</p>
            <div className="w-40 h-40 bg-slate-100 mx-auto rounded-2xl flex items-center justify-center border border-slate-200">
              <div className="grid grid-cols-5 gap-1 p-4 bg-white rounded-xl">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded-[2px] ${Math.random() > 0.4 ? "bg-slate-900" : "bg-white"}`} />
                ))}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 bg-slate-50 py-1.5 rounded-lg border border-slate-100">KEY: AB12 CD34 EF56 GH78</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTwoFactorEnabled(true);
                  setShow2faModal(false);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Verify & Enable
              </button>
              <button
                onClick={() => setShow2faModal(false)}
                className="flex-1 py-3 bg-slate-150 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

      {showDeactivateModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <Card className="bg-white border border-slate-100 rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-4 text-center transform animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Deactivate Account?</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">This will pause your dashboard access. You can reactivate your account at any time by logging back in.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  triggerLogout();
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Yes, Deactivate
              </button>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 py-3 bg-slate-150 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}
      </div>
      </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-slate-400">Loading dashboard…</p>
        </div>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
