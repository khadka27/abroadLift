/* eslint-disable react-hooks/immutability */
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { formatNPRDevanagari } from "@/lib/currency";
import PremiumLoader from "@/components/PremiumLoader";

/* ─── Types ─────────────────────────────────────────────────── */

type TabKey =
  | "dashboard"
  | "matches"
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

  const [documents, setDocuments] = useState<DocumentSlot[]>([
    { id: "doc-1", name: "Passport", category: "Identification", status: "Uploaded", fileName: "passport_scan_final.pdf", uploadedAt: "2026-06-10" },
    { id: "doc-2", name: "Academic Transcript", category: "Education", status: "Uploaded", fileName: "transcript_undergrad.pdf", uploadedAt: "2026-06-10" },
    { id: "doc-3", name: "Degree Certificate", category: "Education", status: "Uploaded", fileName: "degree_certificate.pdf", uploadedAt: "2026-06-11" },
    { id: "doc-4", name: "Curriculum Vitae (CV)", category: "Career", status: "Pending" },
    { id: "doc-5", name: "Statement of Purpose (SOP)", category: "Admissions", status: "Draft", fileName: "sop_draft_v2.docx", uploadedAt: "2026-06-20" },
    { id: "doc-6", name: "Recommendation Letters (LORs)", category: "Admissions", status: "Pending" },
    { id: "doc-7", name: "English Language Test Report", category: "Language", status: "Uploaded", fileName: "ielts_report_sheet.pdf", uploadedAt: "2026-06-12" },
  ]);

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

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      void fetchProfileData();
      void fetchRecommendedMatches();
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

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: typedMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setTypedMessage("");

    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "counselor",
        text: "Thanks for checking in! I am reviewing your request and will follow up with the admissions team. I'll get back to you shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-16 pt-24 md:pt-28">
      {/* Ambient Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-400/15 blur-[100px]" />
      </div>

      <div className="max-w-[1580px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
          
          {/* ══════════ SIDEBAR (NAVIGATION) ══════════ */}
          <aside className="md:block md:sticky md:top-[110px] md:h-fit self-start">
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3686FF] to-indigo-600 font-black text-white shadow-[0_4px_15px_rgba(54,134,255,0.25)] text-lg">
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
                    onClick={async () => {
                      await signOut({ redirect: false });
                      router.replace("/");
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
          <main className="min-w-0 space-y-6">
            
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h1 className="text-[28px] sm:text-[36px] font-black text-slate-900 tracking-tight leading-none">
                  {NAVIGATION_GROUPS.flatMap((g) => g.items).find((t) => t.key === activeTab)?.label}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-2.5">
                  {activeTab === "dashboard" && "Your centralized study-abroad planning and application tracker."}
                  {activeTab === "matches" && "Review colleges where you qualify and fit best."}
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
                
                {/* 1. DASHBOARD OVERVIEW TAB */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">

                    {/* ── KPI Stats Row ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Profile Complete",
                          value: `${profileCompleteness}%`,
                          sub: profileCompleteness >= 80 ? "Strong profile" : "Needs attention",
                          color: "from-blue-500 to-indigo-600",
                          bg: "bg-blue-50",
                          textColor: "text-blue-600",
                          icon: User,
                        },
                        {
                          label: "Admission Odds",
                          value: profile.admissionProb ? `${profile.admissionProb}%` : "—",
                          sub: "Based on your GPA & score",
                          color: "from-emerald-500 to-teal-600",
                          bg: "bg-emerald-50",
                          textColor: "text-emerald-600",
                          icon: GraduationCap,
                        },
                        {
                          label: "Visa Success",
                          value: profile.visaSuccessProb ? `${profile.visaSuccessProb}%` : "—",
                          sub: "Financial strength score",
                          color: "from-violet-500 to-purple-600",
                          bg: "bg-violet-50",
                          textColor: "text-violet-600",
                          icon: Shield,
                        },
                        {
                          label: "Tasks Done",
                          value: `${tasks.filter(t => t.completed).length}/${tasks.length}`,
                          sub: `${taskCompletion}% complete`,
                          color: "from-amber-500 to-orange-500",
                          bg: "bg-amber-50",
                          textColor: "text-amber-600",
                          icon: CheckSquare,
                        },
                      ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-2xl bg-white border border-slate-100 shadow-md shadow-slate-200/40 p-4 flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                              <Icon className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider truncate">{stat.label}</p>
                              <p className={`text-xl font-black leading-none mt-0.5 ${stat.textColor}`}>{stat.value}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">{stat.sub}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                      
                      {/* Enhanced Hero Banner */}
                      <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(30,41,59,0.15)] group">
                        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[70px] pointer-events-none" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-5 pointer-events-none" />
                        
                        <div className="relative z-10">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-sky-200 text-[11px] font-black tracking-wider uppercase rounded-full border border-white/10 shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                              Goal: {profile.preferredCountry || "Canada"} · {profile.intake || "Fall 2026"}
                            </div>
                            <div className="flex gap-2">
                              {profile.gpa && (
                                <span className="px-2.5 py-1 rounded-xl bg-white/10 text-[10px] font-black text-white border border-white/10">GPA {profile.gpa}</span>
                              )}
                              {profile.englishScore && (
                                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-[10px] font-black text-emerald-300 border border-emerald-400/20">{profile.testType || "IELTS"} {profile.englishScore}</span>
                              )}
                            </div>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">Welcome back, {firstName}!</h2>
                          <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-xl font-semibold leading-relaxed">
                            Your academic credentials match <strong className="text-white">{matches.length || "12"} global institutions</strong>. {profileCompleteness < 80 ? "Complete your profile to unlock personalized recommendations." : "Your visa success probability is strong. Let's finish your SOP this week!"}
                          </p>
                          
                          <div className="flex flex-wrap gap-3 mt-6">
                            <button
                              onClick={() => setActiveTab("matches")}
                              className="bg-[#3686FF] hover:bg-blue-500 text-white font-black px-5 py-3 rounded-2xl text-xs shadow-lg shadow-blue-500/30 transition-all active:scale-95 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center gap-1.5"
                            >
                              <Compass className="w-4 h-4" /> Explore Matches
                            </button>
                            <button
                              onClick={() => setActiveTab("profile")}
                              className="bg-white/10 hover:bg-white/20 text-white font-black px-5 py-3 rounded-2xl text-xs backdrop-blur-sm border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
                            >
                              <Pencil className="w-4 h-4" /> Refine Profile
                            </button>
                            <button
                              onClick={() => router.push("/costing")}
                              className="bg-amber-500/20 hover:bg-amber-400/30 text-amber-200 font-black px-5 py-3 rounded-2xl text-xs border border-amber-400/20 transition-all active:scale-95 flex items-center gap-1.5"
                            >
                              <DollarSign className="w-4 h-4" /> Cost Estimator
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Recent Matches Section */}
                      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                          Recent Matches
                        </h3>
                        <Card className="rounded-[32px] p-6 border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/40 relative overflow-hidden">
                          {loading ? (
                            <div className="flex py-10 justify-center items-center">
                              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" />
                              <span className="font-bold text-slate-500 animate-pulse text-xs">Loading saved matches...</span>
                            </div>
                          ) : savedMatches.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-3">
                              <span className="font-semibold text-xs">No saved matches yet. Use the Matching Wizard to find and save your evaluations!</span>
                              <button
                                onClick={() => router.push("/matches")}
                                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-[10px] font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer"
                              >
                                Start Matching Wizard
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              {savedMatches.slice(0, 3).map((m) => {
                                const degree = m.formData?.degree || "Bachelor";
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
                                    className="rounded-2xl p-4 border border-slate-100 bg-white/50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                                  >
                                    <div>
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-600">
                                          {degree}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600">
                                          Admit Odds: {admissionChance ?? "—"}%
                                        </span>
                                      </div>
                                      <h4 className="font-extrabold text-slate-800 text-sm truncate group-hover:text-[#3686FF] transition-colors" title={univName}>
                                        {univName}
                                      </h4>
                                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        {city ? `${city}, ` : ""}{countryCode}
                                      </p>
                                      
                                      <div className="space-y-1.5 mt-3 mb-2 text-[11px] font-semibold text-slate-500">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">GPA / Test:</span>
                                          <span className="text-slate-700 font-black">GPA {gpa} · {testType ? `${testType} ${testScore}` : "No Test"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Est. Tuition:</span>
                                          <span className="text-slate-850 font-black">${Number(tuitionFee).toLocaleString()}/yr</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-slate-100/60 mt-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLoadSavedProfile(m);
                                        }}
                                        className="w-full bg-[#3686FF] hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-[10px] shadow-sm transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                                      >
                                        Open Step 8 Analytics <ChevronRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </Card>
                      </div>

                      {/* Enhanced Application Progress Roadmap */}
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Application Progress Roadmap</h3>
                            <p className="text-[11px] text-slate-400 font-semibold mt-1">Your study-abroad journey at a glance</p>
                          </div>
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                            {[
                              profileCompleteness >= 65,
                              documents.filter(d => d.status === "Uploaded").length >= 3,
                              savedMatches.length > 0,
                              applications.some(a => a.stage === "Submitted" || a.stage === "Under Review"),
                              applications.some(a => a.stage === "Offer Received" || a.stage === "Accepted"),
                              false
                            ].filter(Boolean).length} / 6 Steps
                          </span>
                        </div>
                        
                        <div className="relative">
                          {/* Track line */}
                          <div className="absolute top-[20px] left-[8%] right-[8%] h-[3px] bg-slate-100 rounded-full z-0 hidden md:block" />
                          {/* Filled progress */}
                          <div
                            className="absolute top-[20px] left-[8%] h-[3px] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full z-0 hidden md:block transition-all duration-1000"
                            style={{
                              width: `${([
                                profileCompleteness >= 65,
                                documents.filter(d => d.status === "Uploaded").length >= 3,
                                savedMatches.length > 0,
                                applications.some(a => a.stage === "Submitted" || a.stage === "Under Review"),
                                applications.some(a => a.stage === "Offer Received" || a.stage === "Accepted"),
                                false
                              ].filter(Boolean).length / 6) * 84}%`
                            }}
                          />
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
                             {[
                               { label: "Profile", icon: User, done: profileCompleteness >= 65, tab: "profile" as TabKey },
                               { label: "Documents", icon: FileText, done: documents.filter(d => d.status === "Uploaded").length >= 3, tab: "documents" as TabKey },
                               { label: "Shortlisted", icon: Bookmark, done: savedMatches.length > 0, tab: "saved-universities" as TabKey },
                               { label: "Applied", icon: Send, done: applications.some(a => a.stage === "Submitted" || a.stage === "Under Review"), tab: "applications" as TabKey },
                               { label: "Offer", icon: Award, done: applications.some(a => a.stage === "Offer Received" || a.stage === "Accepted"), tab: "applications" as TabKey },
                               { label: "Visa", icon: Globe, done: false, tab: "visa-assistance" as TabKey },
                             ].map((stepItem, idx) => {
                               const prevsDone = [
                                 profileCompleteness >= 65,
                                 documents.filter(d => d.status === "Uploaded").length >= 3,
                                 savedMatches.length > 0,
                                 applications.some(a => a.stage === "Submitted" || a.stage === "Under Review"),
                                 applications.some(a => a.stage === "Offer Received" || a.stage === "Accepted")
                               ];
                               const isActiveStep = !stepItem.done && (idx === 0 || prevsDone.slice(0, idx).every(Boolean));
                               const StepIcon = stepItem.icon;

                               return (
                                 <button
                                   key={idx}
                                   onClick={() => setActiveTab(stepItem.tab)}
                                   className="flex flex-col items-center text-center group cursor-pointer"
                                 >
                                   <div className="relative mb-2.5">
                                     {isActiveStep && (
                                       <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping" />
                                     )}
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-md relative z-10 transition-all text-lg ${
                                       stepItem.done
                                         ? "bg-emerald-500 shadow-emerald-500/25"
                                         : isActiveStep
                                         ? "bg-[#3686FF] shadow-blue-500/25 text-white"
                                         : "bg-slate-100 text-slate-400"
                                     }`}>
                                       {stepItem.done ? (
                                         <Check className="w-4 h-4 stroke-[3] text-white" />
                                       ) : (
                                         <StepIcon className="w-4 h-4" />
                                       )}
                                     </div>
                                     {isActiveStep && (
                                       <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">NEXT</span>
                                     )}
                                   </div>
                                   <span className={`text-[10px] font-bold leading-tight ${
                                     stepItem.done ? "text-emerald-600" : isActiveStep ? "text-[#3686FF]" : "text-slate-400"
                                   }`}>
                                     {stepItem.label}
                                   </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </Card>

                      {/* Quick Action Buttons - Enhanced */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: "Complete Profile", tab: "profile" as TabKey, icon: User, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
                          { label: "Upload Documents", tab: "documents" as TabKey, icon: Paperclip, gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
                          { label: "Find Universities", tab: "matches" as TabKey, icon: Compass, gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20" },
                          { label: "Apply Now", tab: "applications" as TabKey, icon: Rocket, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
                        ].map((act, i) => {
                          const ActionIcon = act.icon;
                          return (
                            <motion.button
                              key={i}
                              whileHover={{ y: -4, scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setActiveTab(act.tab)}
                              className={`p-4 rounded-2xl bg-gradient-to-br ${act.gradient} text-white flex flex-col items-center justify-center text-center font-black text-xs shadow-lg ${act.shadow} transition-shadow cursor-pointer`}
                            >
                              <ActionIcon className="w-6 h-6 mb-2 text-white" />
                              {act.label}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Saved Matching Profiles Section */}
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Saved Matching Profiles</h3>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Your personalized study abroad search histories and analytical evaluations.</p>
                          </div>
                          {savedMatches.length > 0 && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                              {savedMatches.length} Profile{savedMatches.length === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>

                        {savedMatches.length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                              <Compass className="h-7 w-7" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">No saved profiles yet</p>
                              <p className="text-xs text-slate-400 max-w-md mx-auto">Run a university match query to build and save your study abroad evaluations.</p>
                            </div>
                            <button
                              onClick={() => router.push("/matches")}
                              className="mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95"
                            >
                              Start Matching Wizard
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
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

                              return (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-slate-100 bg-slate-50/35 p-4 hover:border-blue-100 hover:bg-blue-50/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                                >
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
                                    <h4 className="font-extrabold text-slate-800 text-sm truncate group-hover:text-[#3686FF] transition-colors">
                                      {univName}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Target Destination: {country}</p>
                                  </div>

                                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                                    <div className="flex gap-3">
                                      <div className="text-center">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Admission</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold mt-0.5 ${
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
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold mt-0.5 ${
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
                                      className="bg-white border border-slate-200 hover:border-[#3686FF] hover:bg-[#3686FF] hover:text-white text-slate-600 font-bold px-3.5 py-2 rounded-xl text-[11px] shadow-sm transition-all flex items-center gap-1 shrink-0 active:scale-95"
                                    >
                                      Launch Analytics (Step 8)
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Card>

                    </div>

                    {/* Enhanced right-column sidebar widgets */}
                    <div className="space-y-6">

                      {/* Task Tracker Widget with mini progress ring */}
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
                        <div className="flex justify-between items-center mb-5">
                          <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tasks</h3>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Visa & admission roadmap</p>
                          </div>
                          {/* Mini SVG progress ring */}
                          <div className="relative w-12 h-12 shrink-0">
                            <svg className="w-full h-full -rotate-90">
                              <circle cx="24" cy="24" r="18" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                              <circle
                                cx="24" cy="24" r="18" fill="none"
                                stroke="#3686FF" strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 18}
                                strokeDashoffset={2 * Math.PI * 18 * (1 - taskCompletion / 100)}
                                strokeLinecap="round"
                                className="transition-all duration-700"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-600">{taskCompletion}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {tasks.slice(0, 4).map((task) => {
                            const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / 86400000);
                            const isUrgent = !task.completed && daysUntilDue <= 5;
                            return (
                              <div
                                key={task.id}
                                onClick={() => handleToggleTask(task.id)}
                                className={`flex gap-3 items-start p-3 rounded-xl transition-all cursor-pointer ${
                                  task.completed ? "opacity-50" : isUrgent ? "bg-rose-50 hover:bg-rose-100/80" : "hover:bg-slate-50"
                                }`}
                              >
                                <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                  task.completed ? "bg-blue-500 border-blue-500 text-white" : isUrgent ? "border-rose-400" : "border-slate-300 bg-white"
                                }`}>
                                  {task.completed && <Check className="w-2.5 h-2.5" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-semibold leading-snug ${task.completed ? "line-through text-slate-400" : isUrgent ? "text-rose-700" : "text-slate-700"}`}>
                                    {task.title}
                                  </p>
                                  <div className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${isUrgent && !task.completed ? "text-rose-500" : "text-slate-400"}`}>
                                    {task.completed ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span>Done</span>
                                      </>
                                    ) : isUrgent ? (
                                      <>
                                        <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                                        <span>Due in {daysUntilDue}d</span>
                                      </>
                                    ) : (
                                      <span>Due: {task.dueDate}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setActiveTab("tasks")}
                          className="w-full text-center text-xs font-bold text-[#3686FF] hover:text-blue-700 mt-4 pt-3 border-t border-slate-100 transition-colors"
                        >
                          View All {tasks.length} Tasks →
                        </button>
                      </Card>

                      {/* Counselor Chat Widget */}
                      <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col overflow-hidden" style={{ height: 360 }}>
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                              AC
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full">
                              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">Abby Carter</h4>
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">● Online · Counselor</p>
                          </div>
                          <button onClick={() => setActiveTab("messages")} className="ml-auto text-[10px] font-bold text-blue-500 hover:text-blue-700">
                            Open Chat →
                          </button>
                        </div>

                        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 scrollbar-hide" ref={chatContainerRef}>
                          {messages.slice(-4).map((m) => (
                            <div key={m.id} className={`flex ${m.sender === "student" ? "justify-end" : "justify-start"}`}>
                              <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed font-semibold shadow-sm ${
                                m.sender === "student"
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-none"
                                  : "bg-slate-100 text-slate-700 rounded-tl-none"
                              }`}>
                                {m.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="px-4 py-3 border-t border-slate-100 flex gap-2 shrink-0">
                          <input
                            type="text"
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            placeholder="Message Abby..."
                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                          />
                          <button type="submit" className="bg-[#3686FF] hover:bg-blue-600 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </Card>

                    </div>
                    </div>
                  </div>
                )}

                {/* 2. MY MATCHES TAB (Polished Credentials Header, Saved shortlists, and DB-backed direct Step 8 launch!) */}
                {activeTab === "matches" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    
                    {/* Active Apply Country Profile Credentials Banner */}
                    <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-slate-50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                          <span className="inline-flex px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-[#3686FF] text-white shadow-sm mb-3">
                            Your Evaluation Profile (Steps 1-6)
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-lg leading-snug">
                            {profile.degreeLevel ? `${profile.degreeLevel.toUpperCase()} in ${profile.field || "your field"}` : "Study Abroad Matching Profile"}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-slate-300" /> Country: <strong className="text-slate-700">{profile.preferredCountry || "Canada"}</strong>
                            </span>
                            <span>•</span>
                            <span>GPA: <strong className="text-slate-700">{profile.gpa || "3.5"}</strong></span>
                            <span>•</span>
                            <span>Test: <strong className="text-slate-700">{profile.testType || "IELTS"}: {profile.englishScore || "7.0"}</strong></span>
                            <span>•</span>
                            <span>Budget: <strong className="text-slate-700">{formatNPRDevanagari((profile.currency === "USD" || !profile.currency) ? parseInt(profile.yearlyBudget || "30000") * 134.5 : parseInt(profile.yearlyBudget || "0"))}/yr</strong></span>
                            <span>•</span>
                            <span>Intake: <strong className="text-slate-700">{profile.intake || "Fall 2026"}</strong></span>
                          </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <button
                            onClick={() => setActiveTab("profile")}
                            className="bg-white border border-slate-200 hover:border-[#3686FF] hover:text-[#3686FF] text-slate-600 font-bold px-4 py-3 rounded-2xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            Adjust Qualifications
                          </button>
                          <button
                            onClick={() => router.push("/matches?new=true")}
                            className="bg-[#3686FF] hover:bg-blue-600 text-white font-bold px-4 py-3 rounded-2xl text-xs shadow-sm shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
                          >
                            Start New Search
                          </button>
                        </div>
                      </div>
                    </Card>

                    {/* Section 1: User's Saved Match Profiles (Direct Step 8) */}
                    {savedMatches.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Your Shortlisted Match Profiles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedMatches.map((item) => {
                            const degree = item.formData?.degree || "Bachelor";
                            const gpa = item.formData?.gpa || "—";
                            const testType = item.formData?.testType && item.formData?.testType !== "NONE" ? item.formData.testType : null;
                            const testScore = item.formData?.testScore || "";
                            const univName = item.matchData?.name || "University Match";
                            const admissionChance = item.admissionChance;
                            const isExpanded = expandedProfileId === item.id;

                            return (
                              <Card key={item.id} className="rounded-[28px] p-5 border border-slate-100 bg-white shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col justify-between gap-4">
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="inline-flex px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-650 rounded-full">
                                      {degree}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">Saved Shortlist</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteProfileId(item.id);
                                        }}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer"
                                        title="Delete saved profile"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <h4 className="font-extrabold text-slate-800 text-sm truncate">{univName}</h4>
                                  <p className="text-xs text-slate-400 font-medium mt-1">
                                    GPA {gpa} · {testType ? `${testType} ${testScore}` : "No Test"}
                                  </p>

                                  {/* Expander Button */}
                                  <button
                                    onClick={() => setExpandedProfileId(isExpanded ? null : item.id)}
                                    className="flex items-center gap-1 text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-colors mt-3 cursor-pointer"
                                  >
                                    {isExpanded ? (
                                      <>Hide Details <ChevronUp className="w-3.5 h-3.5" /></>
                                    ) : (
                                      <>View Step Details <ChevronDown className="w-3.5 h-3.5" /></>
                                    )}
                                  </button>

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
                                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-medium text-slate-500">
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
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
                                  <div className="text-left">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Admit Odds</p>
                                    <p className="text-sm font-extrabold text-blue-600 leading-none mt-1">{admissionChance ?? "—"}%</p>
                                  </div>
                                  <button
                                    onClick={() => handleLoadSavedProfile(item)}
                                    className="bg-slate-50 border border-slate-200 hover:border-[#3686FF] hover:bg-[#3686FF] hover:text-white text-slate-600 font-bold px-3 py-2 rounded-xl text-[10px] shadow-sm transition-all active:scale-95 cursor-pointer"
                                  >
                                    Open Analytics (Step 8)
                                  </button>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Recommended Universities */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">More Recommended Universities for You</h3>
                      
                      {/* Premium Filters bar inside tab */}
                      <Card className="rounded-2xl p-4 border-none shadow-md bg-white flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                          <Filter className="w-3.5 h-3.5" />
                          FILTERS:
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <select
                            value={filterCountry}
                            onChange={(e) => setFilterCountry(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none hover:border-blue-200"
                          >
                            <option value="">All Countries</option>
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                          <select
                            value={filterDegree}
                            onChange={(e) => setFilterDegree(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none hover:border-blue-200"
                          >
                            <option value="">All Degrees</option>
                            <option value="bachelor">Bachelor</option>
                            <option value="master">Master / Graduate</option>
                            <option value="diploma">Diploma</option>
                          </select>
                        </div>
                      </Card>

                      {matchesLoading ? (
                        <div className="flex py-16 justify-center items-center">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                          <span className="font-bold text-slate-500 animate-pulse">Matching universities...</span>
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
                                  whileHover={{ y: -6 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col justify-between h-full group hover:shadow-2xl hover:shadow-blue-500/5 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-full blur-2xl pointer-events-none" />
                                    <div>
                                      <div className="flex justify-between items-start mb-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600">
                                          Match Score: {m.admissionRate || 76}%
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.institution_type || "Public"}</span>
                                      </div>

                                      <h3 className="font-black text-slate-850 text-lg leading-snug mb-1 group-hover:text-[#3686FF] transition-colors">{m.name}</h3>
                                      <p className="text-slate-400 font-semibold text-xs flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        {m.city ? `${m.city}, ` : ""}{m.countryCode || "Canada"}
                                      </p>

                                      <div className="h-px bg-slate-50 my-4" />

                                      <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-xs font-semibold">
                                          <span className="text-slate-400">Est. Tuition:</span>
                                          <span className="text-slate-700 font-black">${(m.tuitionFee || 18000).toLocaleString()}/yr</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-semibold">
                                          <span className="text-slate-400">Scholarship:</span>
                                          <span className="text-emerald-600 font-black">Up to $3,000</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-semibold">
                                          <span className="text-slate-400">Min. Requirements:</span>
                                          <span className="text-slate-700 font-black">IELTS {m.englishReq || "6.5"} / GPA {m.gpaRequirement || "3.0"}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50">
                                      <button
                                        onClick={() => handleApplyMatch(m)}
                                        className="bg-[#3686FF] hover:bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                                      >
                                        Apply Now
                                      </button>
                                      <button
                                        onClick={() => handleLaunchRecommendedUniversity(m)}
                                        disabled={isLaunching}
                                        className="border border-slate-200 hover:border-blue-100 hover:text-[#3686FF] bg-white text-slate-650 font-bold py-3 rounded-2xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
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
                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 relative z-10">Document Progress</h3>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="relative w-16 h-16 shrink-0">
                            <svg className="w-full h-full -rotate-90">
                              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                              <circle
                                cx="32" cy="32" r="26" fill="none"
                                stroke="#10b981"
                                strokeWidth="5"
                                strokeDasharray={2 * Math.PI * 26}
                                strokeDashoffset={2 * Math.PI * 26 * (1 - documents.filter(d => d.status === "Uploaded").length / documents.length)}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                              {documents.filter(d => d.status === "Uploaded").length}/{documents.length}
                            </span>
                          </div>
                          <div>
                            <p className="text-2xl font-black text-emerald-400">{Math.round(documents.filter(d => d.status === "Uploaded").length / documents.length * 100)}%</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">Documents uploaded</p>
                          </div>
                        </div>
                      </Card>
                      {[
                        { label: "Uploaded", count: documents.filter(d => d.status === "Uploaded").length, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700" },
                        { label: "Pending / Draft", count: documents.filter(d => d.status !== "Uploaded").length, color: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
                      ].map((s) => (
                        <Card key={s.label} className={`rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 ${s.bg}`}>
                          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${s.text} mb-4`}>{s.label}</h3>
                          <p className={`text-5xl font-black ${s.text}`}>{s.count}</p>
                          <p className={`text-xs font-bold ${s.text} opacity-60 mt-1`}>documents</p>
                        </Card>
                      ))}
                    </div>

                    {/* Grouped Document List */}
                    {Array.from(new Set(documents.map(d => d.category))).map((category) => {
                      const categoryDocs = documents.filter(d => d.category === category);
                      const allDone = categoryDocs.every(d => d.status === "Uploaded");
                      return (
                        <Card key={category} className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${allDone ? "bg-emerald-500" : "bg-amber-400"}`} />
                              <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.15em]">{category}</h3>
                            </div>
                            <span className="text-[10px] font-black text-slate-400">
                              {categoryDocs.filter(d => d.status === "Uploaded").length}/{categoryDocs.length} uploaded
                            </span>
                          </div>
                          <div className="divide-y divide-slate-50">
                            {categoryDocs.map((doc) => (
                              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3 first:pt-0 last:pb-0">
                                <div className="flex items-start gap-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600" :
                                    doc.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                                  }`}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                                    {doc.fileName && (
                                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                        {doc.fileName}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2.5 justify-between sm:justify-end">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                                    doc.status === "Uploaded" ? "bg-emerald-50 text-emerald-600" :
                                    doc.status === "Draft" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                                  }`}>
                                    {doc.status}
                                  </span>
                                  <button
                                    onClick={() => handleMockUpload(doc.id)}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-3.5 py-2 rounded-xl text-[10px] shadow-sm transition-all active:scale-95 hover:shadow-md flex items-center gap-1.5"
                                  >
                                    <Upload className="w-3 h-3" />
                                    {doc.status === "Uploaded" ? "Replace" : "Upload"}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* 5. MESSAGES TAB */}
                {activeTab === "messages" && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white xl:col-span-1 h-fit">
                      <div className="text-center pb-6 border-b border-slate-50">
                        <div className="relative w-16 h-16 mx-auto shadow-md rounded-3xl overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-white text-xl flex items-center justify-center">
                            AC
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                          </div>
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-lg mt-3">Abby Carter</h3>
                        <p className="text-xs font-semibold text-slate-400">Dedicated Study-Abroad Counselor</p>
                      </div>
                      <div className="py-6 space-y-4 text-xs font-semibold text-slate-650">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Working Hours:</span>
                          <span className="text-slate-800">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Response Time:</span>
                          <span className="text-emerald-600">Under 1 hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="text-slate-800">counselor@abroadlift.com</span>
                        </div>
                      </div>
                    </Card>

                    {/* Chat Interface */}
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white xl:col-span-2 flex flex-col h-[520px] justify-between overflow-hidden">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xs">
                          AC
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">Abby Carter</h4>
                          <p className="text-[10px] font-bold text-slate-400">Admissions & Shortlist Advisor</p>
                        </div>
                      </div>

                      <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide" ref={chatContainerRef}>
                        {messages.map((m) => (
                          <div key={m.id} className={`flex flex-col ${m.sender === "student" ? "items-end" : "items-start"}`}>
                            <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed font-semibold text-xs ${m.sender === "student" ? "bg-blue-500 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"}`}>
                              {m.text}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{m.timestamp}</span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <input
                          type="text"
                          value={typedMessage}
                          onChange={(e) => setTypedMessage(e.target.value)}
                          placeholder="Type your message to Abby..."
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400"
                        />
                        <button
                          type="submit"
                          className="bg-[#3686FF] hover:bg-blue-600 text-white p-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
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
                    {/* Top Completeness Header */}
                    <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5 shrink-0">
                          {/* Premium Circular Progress Indicator */}
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
                                className="text-blue-500 transition-all duration-1000 ease-out"
                                strokeWidth="6.5"
                                strokeDasharray={2 * Math.PI * 34}
                                strokeDashoffset={2 * Math.PI * 34 * (1 - profileCompleteness / 100)}
                                strokeLinecap="round"
                                stroke="url(#blueGrad)"
                                fill="transparent"
                              />
                              <defs>
                                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="absolute text-lg font-black text-slate-800">{profileCompleteness}%</span>
                          </div>
                          <div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">Complete Profile</h2>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                              Provide details to get accurate university matches and fast track admissions.
                            </p>
                          </div>
                        </div>

                        {/* Top action buttons */}
                        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                          {isEditingProfile ? (
                            <>
                              <button
                                onClick={() => handleSaveProfile(false)}
                                disabled={saving}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-sm transition-all"
                              >
                                {saving ? "Saving..." : "Save Draft"}
                              </button>
                              <button
                                onClick={() => handleSaveProfile(true)}
                                disabled={saving}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all hover:shadow-lg"
                              >
                                {saving ? "Submitting..." : "Submit Profile"}
                              </button>
                              <button
                                onClick={() => setIsEditingProfile(false)}
                                className="border border-slate-200 bg-white text-slate-600 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-sm hover:bg-slate-50 transition-all"
                              >
                                Preview Profile
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditingProfile(false);
                                  setActiveTab("dashboard");
                                }}
                                className="text-slate-400 hover:text-slate-600 font-bold px-3 py-2 text-xs transition-colors"
                              >
                                Continue Later
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditForm(profile);
                                  setIsEditingProfile(true);
                                }}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-4.5 py-2.5 rounded-2xl text-xs shadow-md hover:shadow-lg hover:scale-102 transition-all"
                              >
                                Edit Profile
                              </button>
                              <button
                                onClick={() => setActiveTab("dashboard")}
                                className="border border-slate-200 bg-white text-slate-600 font-bold px-4.5 py-2.5 rounded-2xl text-xs shadow-sm hover:bg-slate-50 transition-all"
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
                            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                              profileSubTab === sec.idx
                                ? "border-blue-500 bg-blue-50/40 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.08)]"
                                : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                          >
                            <span className="text-[10px] font-extrabold tracking-tight truncate w-full text-center">{sec.label}</span>
                            <div className="mt-1 flex items-center justify-center">
                              {sec.done ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Main Workspace Grid (Left Menu / Right Content) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                      
                      {/* Left Sidebar Menu for Desktop / Horizontal menu for Mobile */}
                      <aside className="lg:block">
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none rounded-2xl border border-slate-100 bg-white p-2 shadow-md shadow-slate-100/50">
                          {[
                            { idx: 0, label: "Personal Information", icon: User },
                            { idx: 1, label: "Academic Credentials", icon: GraduationCap },
                            { idx: 2, label: "Study Preferences", icon: Globe },
                            { idx: 3, label: "English Language Test", icon: Award },
                            { idx: 4, label: "Work Experience (Opt)", icon: Briefcase },
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
                                className={`flex items-center gap-3 w-full shrink-0 lg:shrink px-4 py-3 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                                  isActive
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                              >
                                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                                <span>{sec.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </aside>

                      {/* Right Panel (Active Form or Viewer) */}
                      <Card className="rounded-[32px] p-6 md:p-8 border-none shadow-xl shadow-slate-200/50 bg-white">
                        
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Middle Name</span>
                                    <input
                                      type="text"
                                      value={editForm.middleName}
                                      onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })}
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Date of Birth</span>
                                    <input
                                      type="date"
                                      value={editForm.dateOfBirth}
                                      onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
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
                                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                                      <option value="Master's Degree">Master's Degree</option>
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
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Number of Backlogs</span>
                                    <input
                                      type="number"
                                      value={editForm.backlogs}
                                      onChange={(e) => setEditForm({ ...editForm, backlogs: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Study Gap (Years)</span>
                                    <input
                                      type="number"
                                      value={editForm.studyGap}
                                      onChange={(e) => setEditForm({ ...editForm, studyGap: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
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
                                    <select
                                      value={editForm.intake}
                                      onChange={(e) => setEditForm({ ...editForm, intake: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    >
                                      <option value="">Select Intake</option>
                                      <option value="Fall 2026">Fall 2026</option>
                                      <option value="Spring 2027">Spring 2027</option>
                                      <option value="Summer 2026">Summer 2026</option>
                                      <option value="Fall 2027">Fall 2027</option>
                                    </select>
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
                                        <input
                                          type="text"
                                          value={editForm.englishScore}
                                          onChange={(e) => setEditForm({ ...editForm, englishScore: e.target.value })}
                                          placeholder="e.g. 7.5 or 115"
                                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                        />
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
                                      value={editForm.yearlyBudget}
                                      onChange={(e) => setEditForm({ ...editForm, yearlyBudget: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Available Bank Balance ({editForm.currency})</span>
                                    <input
                                      type="number"
                                      value={editForm.bankBalance}
                                      onChange={(e) => setEditForm({ ...editForm, bankBalance: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
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
                                      value={editForm.sponsorIncome}
                                      onChange={(e) => setEditForm({ ...editForm, sponsorIncome: e.target.value })}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                    />
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
                              <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                                <button
                                  onClick={() => handleSaveProfile(false)}
                                  disabled={saving}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                                >
                                  {saving ? "Saving..." : "Save Draft"}
                                </button>
                                <button
                                  onClick={() => handleSaveProfile(true)}
                                  disabled={saving}
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                                >
                                  {saving ? "Submitting..." : "Submit Profile"}
                                </button>
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
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Middle Name</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">{profile.middleName || "Not set"}</span>
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
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sponsor's Annual Income</span>
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

                      </Card>

                    </div>
                  </div>
                )}

                {/* 11. SETTINGS TAB */}
                {activeTab === "settings" && (
                  <Card className="rounded-[32px] p-6 border-none shadow-xl shadow-slate-200/50 bg-white space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Notification Preferences</h3>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700">WhatsApp Updates</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Receive real-time application and visa status alerts on WhatsApp.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded outline-none" />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700">Email Newsletters</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Receive monthly scholarship roundups and study guides.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded outline-none" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <h3 className="text-sm font-bold text-slate-855 border-b border-slate-50 pb-2">Account Security</h3>
                      <button
                        onClick={() => alert("Password reset link has been sent to your registered email.")}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors"
                      >
                        Reset Password
                      </button>
                    </div>
                  </Card>
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
