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
];

function GlassInput({ label, type = "text", placeholder, value, onChange }: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[50px] bg-white/5 border border-white/10 rounded-2xl px-4 text-white placeholder:text-slate-600 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
      />
    </div>
  );
}

function GlassSelect({ label, options, value, onChange, placeholder }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[50px] bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer text-white [&>option]:bg-[#0f0f1a] [&>option]:text-white"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
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

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    // background
    nationality: "",
    currentCountry: "",
    gpa: "",
  });

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
        setProfile((p) => ({
          ...p,
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          nationality: data.profile?.nationality || "",
          currentCountry: data.profile?.currentCountry || "",
          gpa: data.profile?.gpa?.toString() || "",
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: any) => setProfile((p) => ({ ...p, [k]: v }));

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
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
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
          {/* ─── Personal ─── */}
          {activeSection === "personal" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white mb-5">Personal Information</h3>
              <GlassInput label="Full Name" placeholder="Jane Doe" value={profile.name} onChange={(v) => set("name", v)} />
              <GlassInput label="Username" placeholder="janedoe123" value={profile.username} onChange={(v) => set("username", v)} />
              <GlassInput label="Email Address" type="email" placeholder="jane@example.com" value={profile.email} onChange={(v) => set("email", v)} />
            </div>
          )}

          {/* ─── Background ─── */}
          {activeSection === "background" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white mb-5">Your Background</h3>
              <GlassSelect
                label="Nationality"
                placeholder="Select your nationality"
                options={COUNTRIES_LIST}
                value={profile.nationality}
                onChange={(v) => set("nationality", v)}
              />
              <GlassSelect
                label="Current Country of Residence"
                placeholder="Where do you live?"
                options={COUNTRIES_LIST}
                value={profile.currentCountry}
                onChange={(v) => set("currentCountry", v)}
              />
              <GlassInput label="GPA" type="number" placeholder="e.g. 3.7" value={profile.gpa} onChange={(v) => set("gpa", v)} />
            </div>
          )}

          {/* Save button (bottom of card) */}
          <div className="mt-6 pt-5 border-t border-white/8 flex justify-between items-center">
            <Link
              href="/matches"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white font-semibold transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              Back to Matches
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
