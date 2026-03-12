/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  BookOpen,
  Sparkles,
  AlertCircle,
  Briefcase,
  Monitor,
  HeartPulse,
  Scale,
  Palette,
  LineChart,
  Microscope,
  Brain,
  AlignLeft,
  Award,
} from "lucide-react";

/* ─── Constants ─── */
const COUNTRIES_LIST = [
  "Nepal", "India", "Bangladesh", "Pakistan", "Sri Lanka", "China",
  "Vietnam", "Philippines", "Nigeria", "Ghana", "Kenya", "Ethiopia",
  "Brazil", "Colombia", "Mexico", "Indonesia", "Malaysia", "Thailand",
  "Egypt", "Morocco", "UAE", "Saudi Arabia", "Turkey", "Ukraine",
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore",
];

const PREFERRED_COUNTRIES = [
  { code: "CA", name: "Canada", emoji: "🇨🇦" },
  { code: "US", name: "USA", emoji: "🇺🇸" },
  { code: "AU", name: "Australia", emoji: "🇦🇺" },
  { code: "GB", name: "UK", emoji: "🇬🇧" },
  { code: "DE", name: "Germany", emoji: "🇩🇪" },
  { code: "IE", name: "Ireland", emoji: "🇮🇪" },
  { code: "NL", name: "Netherlands", emoji: "🇳🇱" },
  { code: "NZ", name: "New Zealand", emoji: "🇳🇿" },
  { code: "MY", name: "Malaysia", emoji: "🇲🇾" },
  { code: "SG", name: "Singapore", emoji: "🇸🇬" },
  { code: "FR", name: "France", emoji: "🇫🇷" },
  { code: "ES", name: "Spain", emoji: "🇪🇸" },
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
  { v: "Engineering", icon: Sparkles },
  { v: "Medicine & Health", icon: HeartPulse },
  { v: "Law", icon: Scale },
  { v: "Arts & Humanities", icon: Palette },
  { v: "Data Science", icon: LineChart },
  { v: "Natural Sciences", icon: Microscope },
  { v: "Social Sciences", icon: Brain },
];

const TESTS = ["IELTS", "TOEFL", "PTE", "Duolingo", "None"];

const INTAKES = ["January 2025", "May 2025", "September 2025", "January 2026", "May 2026", "September 2026"];

/* ─── Step Definitions ─── */
const STEPS = [
  { title: "Account Setup", subtitle: "Create your login credentials", icon: User },
  { title: "Your Background", subtitle: "Tell us where you're from", icon: Globe },
  { title: "Study Goals", subtitle: "What do you want to study?", icon: BookOpen },
  { title: "English & Budget", subtitle: "Your scores and finances", icon: GraduationCap },
];

/* ─── Input field component ─── */
function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

/* ─── Glass Input ─── */
function GlassInput({
  type = "text",
  placeholder,
  value,
  onChange,
  suffix,
  disabled,
  autoComplete,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="w-full h-[52px] bg-white/5 border border-white/10 rounded-2xl px-4 text-white placeholder:text-slate-500 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}

/* ─── Select ─── */
function GlassSelect({
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
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[52px] bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer text-white [&>option]:bg-[#0f0f1a] [&>option]:text-white"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form data
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Background
    nationality: "",
    currentCountry: "",
    // Study goals
    preferredCountry: "",
    degreeLevel: "",
    fieldOfStudy: "",
    intake: "",
    // Scores & budget
    englishTestType: "",
    englishScore: "",
    yearlyBudget: "",
    currency: "USD",
    gpa: "",
    scholarshipNeeded: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  /* ─── Validation per step ─── */
  const validateStep = () => {
    const e: Record<string, string> = {};

    if (step === 0) {
      if (!form.name.trim()) e.name = "Full name is required.";
      if (!form.username.trim()) e.username = "Username is required.";
      if (form.username.length < 3) e.username = "Username must be at least 3 characters.";
      if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = "Only letters, numbers, and underscores.";
      if (!form.email) e.email = "Email is required.";
      if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format.";
      if (!form.password) e.password = "Password is required.";
      if (form.password.length < 8) e.password = "At least 8 characters.";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    }

    if (step === 1) {
      if (!form.nationality) e.nationality = "Please select your nationality.";
      if (!form.currentCountry) e.currentCountry = "Please select your current country.";
    }

    if (step === 2) {
      if (!form.preferredCountry) e.preferredCountry = "Please choose a preferred country.";
      if (!form.degreeLevel) e.degreeLevel = "Please select a degree level.";
      if (!form.fieldOfStudy) e.fieldOfStudy = "Please select a field of study.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username.toLowerCase(),
          email: form.email.toLowerCase(),
          password: form.password,
          nationality: form.nationality,
          currentCountry: form.currentCountry,
          preferredCountry: form.preferredCountry,
          degreeLevel: form.degreeLevel,
          fieldOfStudy: form.fieldOfStudy,
          gpa: form.gpa,
          englishTestType: form.englishTestType,
          englishScore: form.englishScore,
          yearlyBudget: form.yearlyBudget,
          currency: form.currency,
          scholarshipNeeded: form.scholarshipNeeded,
          intake: form.intake,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Registration failed. Please try again.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login?registered=1"), 2000);
    } catch {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Success screen ─── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6">
        <div className="text-center fade-up">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Account Created! 🎉</h2>
          <p className="text-slate-400 text-sm mb-1">Welcome to NextDegree, {form.name}!</p>
          <p className="text-slate-500 text-xs">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-5">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">NextDegree</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 leading-tight">
            Start Your Journey
          </h1>
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 px-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${i <= step ? "bg-indigo-500" : "bg-white/10"}`} />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 backdrop-blur-sm shadow-2xl fade-up">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-500/15 border border-indigo-500/25 rounded-2xl flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="text-base font-black text-white leading-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs text-slate-500">{currentStep.subtitle}</p>
            </div>
          </div>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{serverError}</p>
            </div>
          )}

          {/* ─── STEP 0: Account Setup ─── */}
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Full Name" error={errors.name}>
                <GlassInput
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  autoComplete="name"
                />
              </Field>
              <Field label="Username" error={errors.username}>
                <GlassInput
                  placeholder="janedoe123"
                  value={form.username}
                  onChange={(v) => set("username", v.toLowerCase().replace(/\s/g, ""))}
                  autoComplete="username"
                  suffix={
                    form.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(form.username) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : null
                  }
                />
              </Field>
              <Field label="Email Address" error={errors.email}>
                <GlassInput
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Password" error={errors.password}>
                <GlassInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(v) => set("password", v)}
                  autoComplete="new-password"
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {form.password && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          form.password.length >= i * 3
                            ? form.password.length < 8
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword}>
                <GlassInput
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(v) => set("confirmPassword", v)}
                  autoComplete="new-password"
                  suffix={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400 hover:text-white transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </Field>
            </div>
          )}

          {/* ─── STEP 1: Background ─── */}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Your Nationality" error={errors.nationality}>
                <GlassSelect
                  placeholder="Select your nationality"
                  options={COUNTRIES_LIST}
                  value={form.nationality}
                  onChange={(v) => set("nationality", v)}
                />
              </Field>
              <Field label="Current Country of Residence" error={errors.currentCountry}>
                <GlassSelect
                  placeholder="Where do you currently live?"
                  options={COUNTRIES_LIST}
                  value={form.currentCountry}
                  onChange={(v) => set("currentCountry", v)}
                />
              </Field>
              <Field label="GPA (Optional)">
                <GlassInput
                  type="number"
                  placeholder="e.g. 3.7 (out of 4.0)"
                  value={form.gpa}
                  onChange={(v) => set("gpa", v)}
                />
              </Field>
            </div>
          )}

          {/* ─── STEP 2: Study Goals ─── */}
          {step === 2 && (
            <div className="space-y-5">
              <Field label="Preferred Study Destination" error={errors.preferredCountry}>
                <div className="grid grid-cols-3 gap-2">
                  {PREFERRED_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => set("preferredCountry", c.code)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all duration-200 ${
                        form.preferredCountry === c.code
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <span className="text-[10px]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Degree Level" error={errors.degreeLevel}>
                <div className="grid grid-cols-3 gap-2">
                  {DEGREES.map((d) => {
                    const Icon = d.icon;
                    return (
                      <button
                        key={d.v}
                        type="button"
                        onClick={() => set("degreeLevel", d.v)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all duration-200 ${
                          form.degreeLevel === d.v
                            ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-[10px]">{d.l}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Field of Study" error={errors.fieldOfStudy}>
                <div className="grid grid-cols-2 gap-2">
                  {FIELDS.map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.v}
                        type="button"
                        onClick={() => set("fieldOfStudy", f.v)}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-left ${
                          form.fieldOfStudy === f.v
                            ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-[10px] leading-tight">{f.v}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Target Intake (Optional)">
                <GlassSelect
                  placeholder="When do you plan to start?"
                  options={INTAKES}
                  value={form.intake}
                  onChange={(v) => set("intake", v)}
                />
              </Field>
            </div>
          )}

          {/* ─── STEP 3: English & Budget ─── */}
          {step === 3 && (
            <div className="space-y-4">
              <Field label="English Test">
                <div className="grid grid-cols-3 gap-2">
                  {TESTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("englishTestType", t)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        form.englishTestType === t
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              {form.englishTestType && form.englishTestType !== "None" && (
                <Field label={`Your ${form.englishTestType} Score`}>
                  <GlassInput
                    type="number"
                    placeholder={form.englishTestType === "IELTS" ? "e.g. 6.5" : form.englishTestType === "TOEFL" ? "e.g. 90" : "e.g. 65"}
                    value={form.englishScore}
                    onChange={(v) => set("englishScore", v)}
                  />
                </Field>
              )}

              <Field label="Annual Budget (USD)">
                <div className="flex gap-2">
                  <select
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                    className="h-[52px] bg-white/5 border border-white/10 rounded-2xl px-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer [&>option]:bg-[#0f0f1a] w-24 flex-shrink-0"
                  >
                    {["USD", "GBP", "AUD", "CAD", "EUR", "NPR"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <GlassInput
                    type="number"
                    placeholder="e.g. 25000"
                    value={form.yearlyBudget}
                    onChange={(v) => set("yearlyBudget", v)}
                  />
                </div>
              </Field>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => set("scholarshipNeeded", !form.scholarshipNeeded)}
                  className={`relative w-11 h-6 rounded-full border transition-all duration-300 flex-shrink-0 ${
                    form.scholarshipNeeded
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-white/5 border-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                      form.scholarshipNeeded ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                  I need a scholarship
                </span>
              </label>

              {/* Summary preview */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Profile Summary</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name</span>
                    <span className="text-white font-semibold">{form.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Username</span>
                    <span className="text-white font-semibold">@{form.username || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">From</span>
                    <span className="text-white font-semibold">{form.nationality || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination</span>
                    <span className="text-white font-semibold">{form.preferredCountry || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Degree</span>
                    <span className="text-white font-semibold capitalize">{form.degreeLevel || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Field</span>
                    <span className="text-white font-semibold">{form.fieldOfStudy || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="h-[52px] px-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="flex-1 h-[52px] rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Account
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          By registering you agree to our{" "}
          <span className="text-slate-400 cursor-pointer hover:text-white transition-colors">Terms</span> and{" "}
          <span className="text-slate-400 cursor-pointer hover:text-white transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
