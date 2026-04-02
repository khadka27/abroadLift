/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Globe,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Clock,
  MapPin,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

const COUNTRIES_LIST = [
  "Nepal", "India", "Bangladesh", "Pakistan", "Sri Lanka", "China",
  "Vietnam", "Philippines", "Nigeria", "Ghana", "Kenya", "Ethiopia",
  "Brazil", "Colombia", "Mexico", "Indonesia", "Malaysia", "Thailand",
  "Egypt", "Morocco", "UAE", "Saudi Arabia", "Turkey", "Ukraine",
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore",
];

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "background", label: "Background", icon: Globe },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "financials", label: "Financials", icon: Banknote },
  { id: "history", label: "My Saved Plans", icon: Clock },
];

function GlassInput({ label, type = "text", placeholder, value, onChange }: { 
  label: string; 
  type?: string; 
  placeholder: string; 
  value: any; 
  onChange: (v: string) => void 
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
      />
    </div>
  );
}

function GlassToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/3 border border-white/8 rounded-xl">
      <span className="text-xs font-bold text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-all relative ${value ? "bg-indigo-600" : "bg-slate-800"}`}
      >
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${value ? "right-1" : "left-1"}`} />
      </button>
    </div>
  );
}

function GlassSelect({ label, placeholder, options, value, onChange }: { 
  label: string; 
  placeholder: string; 
  options: string[]; 
  value: string; 
  onChange: (v: string) => void 
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled className="bg-[#0f0f1a]">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#0f0f1a] text-white">
              {o}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <ChevronRight className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>({
    name: "",
    username: "",
    email: "",
    nationality: "",
    currentCountry: "",
    highestEducation: "",
    passingYear: "",
    gpa: "",
    backlogs: "0",
    studyGap: "0",
    testType: "",
    englishScore: "",
    aptitudeTest: "NONE",
    greVerbal: "",
    greQuant: "",
    greAwa: "",
    gmatTotal: "",
    degreeLevel: "",
    field: "",
    program: "",
    intake: "",
    yearlyBudget: "",
    currency: "USD",
    bankBalance: "",
    sponsorType: "",
    sponsorIncome: "",
    univType: "",
    cityType: "",
    duration: "",
    scholarshipNeeded: false,
    passportReady: false,
    testDone: false,
    docsReady: false,
  });
  const [matchingRecords, setMatchingRecords] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile((p: any) => ({
          ...p,
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          nationality: data.profile?.nationality || "",
          currentCountry: data.profile?.currentCountry || "",
          gpa: data.profile?.gpa?.toString() || "",
          highestEducation: data.profile?.highestEducation || "",
          passingYear: data.profile?.passingYear || "",
          backlogs: data.profile?.backlogs?.toString() || "0",
          studyGap: data.profile?.studyGap?.toString() || "0",
          testType: data.profile?.testType || "",
          englishScore: data.profile?.englishScore?.toString() || "",
          aptitudeTest: data.profile?.aptitudeTest || "NONE",
          greVerbal: data.profile?.greVerbal?.toString() || "",
          greQuant: data.profile?.greQuant?.toString() || "",
          greAwa: data.profile?.greAwa?.toString() || "",
          gmatTotal: data.profile?.gmatTotal?.toString() || "",
          degreeLevel: data.profile?.degreeLevel || "",
          field: data.profile?.field || "",
          program: data.profile?.program || "",
          intake: data.profile?.intake || "",
          yearlyBudget: data.profile?.yearlyBudget?.toString() || "",
          currency: data.profile?.currency || "USD",
          bankBalance: data.profile?.bankBalance?.toString() || "",
          sponsorType: data.profile?.sponsorType || "",
          sponsorIncome: data.profile?.sponsorIncome?.toString() || "",
          univType: data.profile?.univType || "",
          cityType: data.profile?.cityType || "",
          duration: data.profile?.duration?.toString() || "",
          scholarshipNeeded: !!data.profile?.scholarshipNeeded,
          passportReady: !!data.profile?.passportReady,
          testDone: !!data.profile?.testDone,
          docsReady: !!data.profile?.docsReady,
        }));
        setMatchingRecords(data.matchingRecords || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-[#07070f] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-700/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-700/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Nav */}
      <nav className="bg-white/3 border-b border-white/8 px-4 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/matches" className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-black text-white text-sm">AbroadLift</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved!
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md shadow-indigo-500/20"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* User card */}
        <div className="bg-white/3 border border-white/10 rounded-3xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-300">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{profile.name || "Your Name"}</h2>
              <p className="text-sm text-slate-400">@{profile.username || "username"}</p>
              <p className="text-xs text-slate-600">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Section content */}
        <div className="bg-white/3 border border-white/10 rounded-3xl p-6">
          {activeSection === "personal" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white mb-5">Personal Information</h3>
              <GlassInput label="Full Name" placeholder="Jane Doe" value={profile.name} onChange={(v) => set("name", v)} />
              <GlassInput label="Username" placeholder="janedoe123" value={profile.username} onChange={(v) => set("username", v)} />
              <GlassInput label="Email Address" type="email" placeholder="jane@example.com" value={profile.email} onChange={(v) => set("email", v)} />
            </div>
          )}

          {activeSection === "background" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white mb-5">Your Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassSelect
                  label="Nationality"
                  placeholder="Select"
                  options={COUNTRIES_LIST}
                  value={profile.nationality}
                  onChange={(v) => set("nationality", v)}
                />
                <GlassSelect
                  label="Current Residence"
                  placeholder="Where do you live?"
                  options={COUNTRIES_LIST}
                  value={profile.currentCountry}
                  onChange={(v) => set("currentCountry", v)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput label="Highest Education" placeholder="e.g. Bachelors" value={profile.highestEducation} onChange={(v) => set("highestEducation", v)} />
                <GlassInput label="Passing Year" placeholder="e.g. 2023" value={profile.passingYear} onChange={(v) => set("passingYear", v)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <GlassSelect
                  label="Target Intake"
                  placeholder="Select"
                  options={["Jan/Feb 2025", "May/June 2025", "Sep/Oct 2025"]}
                  value={profile.intake}
                  onChange={(v) => set("intake", v)}
                />
                <GlassInput label="Field of Study" placeholder="e.g. Data Science" value={profile.field} onChange={(v) => set("field", v)} />
              </div>
            </div>
          )}

          {activeSection === "academics" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white mb-5">Academic Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput label="GPA / Percentage" type="number" placeholder="e.g. 3.7" value={profile.gpa} onChange={(v) => set("gpa", v)} />
                <GlassInput label="Backlogs" type="number" placeholder="0" value={profile.backlogs} onChange={(v) => set("backlogs", v)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput label="Study Gap (Years)" type="number" placeholder="0" value={profile.studyGap} onChange={(v) => set("studyGap", v)} />
                <GlassSelect
                  label="Language Test"
                  placeholder="Select Test"
                  options={["IELTS", "PTE", "TOEFL", "DUOLINGO", "MOI", "NONE"]}
                  value={profile.testType}
                  onChange={(v) => set("testType", v)}
                />
              </div>
              {profile.testType !== "NONE" && profile.testType !== "" && (
                <GlassInput label="Test Score" type="number" placeholder="e.g. 7.5" value={profile.englishScore} onChange={(v) => set("englishScore", v)} />
              )}
              
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Aptitude Tests</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <GlassSelect
                    label="Entrance Test"
                    placeholder="Select"
                    options={["GRE", "GMAT", "NONE"]}
                    value={profile.aptitudeTest}
                    onChange={(v) => set("aptitudeTest", v)}
                  />
                  {profile.aptitudeTest === "GRE" && (
                    <div className="space-y-4">
                      <GlassInput label="GRE Verbal" type="number" placeholder="Verbal Score" value={profile.greVerbal} onChange={(v) => set("greVerbal", v)} />
                      <GlassInput label="GRE Quant" type="number" placeholder="Quant Score" value={profile.greQuant} onChange={(v) => set("greQuant", v)} />
                    </div>
                  )}
                  {profile.aptitudeTest === "GMAT" && (
                    <GlassInput label="GMAT Total" type="number" placeholder="Total Score" value={profile.gmatTotal} onChange={(v) => set("gmatTotal", v)} />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "financials" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white mb-5">Financial Capability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput label="Bank Balance (Home Currency)" type="number" placeholder="e.g. 5000000" value={profile.bankBalance} onChange={(v) => set("bankBalance", v)} />
                <GlassSelect
                  label="Primary Sponsor"
                  placeholder="Select"
                  options={["Parents", "Self", "Relative", "Education Loan", "Scholarship"]}
                  value={profile.sponsorType}
                  onChange={(v) => set("sponsorType", v)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput label="Sponsor Monthly Income" type="number" placeholder="e.g. 150000" value={profile.sponsorIncome} onChange={(v) => set("sponsorIncome", v)} />
                <GlassInput label="Yearly Budget (USD)" type="number" placeholder="e.g. 25000" value={profile.yearlyBudget} onChange={(v) => set("yearlyBudget", v)} />
              </div>
              
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <GlassToggle label="Passport Ready" value={profile.passportReady} onChange={(v) => set("passportReady", v)} />
                <GlassToggle label="Documents Prepared" value={profile.docsReady} onChange={(v) => set("docsReady", v)} />
              </div>
            </div>
          )}

          {activeSection === "history" && (
            <div className="space-y-6">
              <h3 className="text-sm font-black mb-5 text-indigo-400">Your Recent Activity</h3>
              {matchingRecords.length === 0 ? (
                <div className="text-center py-10 bg-white/3 border border-white/8 rounded-2xl">
                  <Clock className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm italic">You haven&apos;t saved any matching profiles yet.</p>
                  <Link href="/matches" className="text-indigo-400 text-xs font-bold mt-4 inline-block hover:underline">Start Matching Engine</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {matchingRecords.map((record: any) => {
                    const match = record.matchData;
                    const date = new Date(record.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    
                    return (
                      <div key={record.id} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-white/10 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center font-black text-indigo-400 border border-indigo-500/10">
                              {match.name?.[0] || 'U'}
                            </div>
                            <div>
                               <h4 className="text-white font-black text-[14px] leading-tight truncate max-w-[200px]">{match.name}</h4>
                               <p className="text-xs text-slate-500 flex items-center gap-1">
                                 <MapPin className="w-3 h-3" /> {match.location || 'Global destination'}
                               </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{date}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                           <div className="bg-white/3 p-3 rounded-xl border border-white/5 text-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Tuition</p>
                              <p className="text-[11px] font-black text-white shrink-0 truncate">${match.tuitionFee?.toLocaleString()}</p>
                           </div>
                           <div className="bg-white/3 p-3 rounded-xl border border-white/5 text-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Success</p>
                              <p className="text-[11px] font-black text-emerald-400">{match.admissionRate || 75}%</p>
                           </div>
                           <div className="bg-white/3 p-3 rounded-xl border border-white/5 text-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Ranking</p>
                              <p className="text-[11px] font-black text-amber-400">#{match.rankingWorld || 'N/A'}</p>
                           </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-black text-slate-400 border border-white/5">
                                  {record.formData?.degree || 'N/A'}
                               </div>
                            </div>
                            <Link href="/matches" className="text-indigo-400 text-[10px] font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                                VIEW AGAIN <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bottom actions */}
          <div className="mt-8 pt-6 border-t border-white/8 flex items-center justify-between">
            <Link href="/matches" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2">
               <ArrowLeft className="w-3 h-3" />
               Return to Explorer
            </Link>
            <div className="flex gap-3">
              {saved && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Successfully Saved
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                {saving ? "Processing..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
