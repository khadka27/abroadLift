"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Globe,
} from "lucide-react";

const COUNTRIES_LIST = [
  "Nepal", "India", "Bangladesh", "Pakistan", "Sri Lanka", "China",
  "Vietnam", "Philippines", "Nigeria", "Ghana", "Kenya", "Ethiopia",
  "Brazil", "Colombia", "Mexico", "Indonesia", "Malaysia", "Thailand",
  "Egypt", "Morocco", "UAE", "Saudi Arabia", "Turkey", "Ukraine",
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore",
];

const STEPS = [
  { title: "Account Setup", subtitle: "Login credentials", icon: User },
  { title: "Your Background", subtitle: "Tell us where you're from", icon: Globe },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    currentCountry: "",
    gpa: "",
  });

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setServerError("");
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Full name is required.";
      if (!form.username.trim()) e.username = "Username is required.";
      if (form.username.length < 3) e.username = "At least 3 characters.";
      if (!form.email) e.email = "Email is required.";
      if (!form.password) e.password = "Password is required.";
      if (form.password.length < 8) e.password = "Min. 8 characters.";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match.";
    } else {
      if (!form.nationality) e.nationality = "Required.";
      if (!form.currentCountry) e.currentCountry = "Required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < STEPS.length - 1) setStep(step + 1);
      else handleSubmit();
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
          ...form,
          username: form.username.toLowerCase(),
          email: form.email.toLowerCase(),
          // Default extra fields for matching API
          preferredCountry: "",
          degreeLevel: "",
          fieldOfStudy: "",
          englishTestType: "None",
          englishScore: "0",
          yearlyBudget: "0",
          currency: "USD",
          scholarshipNeeded: false,
          intake: "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Registration failed.");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Side: Image */}
        <div className="hidden lg:block lg:w-[40%] relative overflow-hidden">
          <Image
            src="/signup-bg.png"
            alt="Library"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-white/10" />
        </div>

        {/* Right Side: Form Container */}
        <div className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-[#F4F7FF]">
          {/* Slanted background decoration */}
          <div 
            className="absolute left-[-150px] top-0 bottom-0 w-[300px] bg-white hidden lg:block"
            style={{ 
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              transform: "translateX(-1px)"
            }}
          />

          <div className="w-full max-w-[520px] relative z-10 fade-up">
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-[20px] font-bold text-gray-400 mb-1">Welcome To!</h2>
              <h1 className="text-[42px] lg:text-[52px] font-black text-[#3366FF] leading-none mb-6">AbroadLift</h1>
              
              {/* Step indicator */}
              <div className="flex items-center gap-3">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                    <div 
                      className={`h-full bg-[#3366FF] transition-all duration-500 ${i <= step ? "w-full" : "w-0"}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {serverError}
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-blue-500/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3366FF]">
                  {step === 0 ? <User className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{STEPS[step].title}</h3>
                  <p className="text-sm text-gray-400 font-medium">{STEPS[step].subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                {step === 0 && (
                  <>
                    <InputField
                      label="Full Name"
                      placeholder="Jane Doe"
                      value={form.name}
                      error={errors.name}
                      onChange={(v: string) => handleChange("name", v)}
                    />
                    <InputField
                      label="Username"
                      placeholder="janedoe123"
                      value={form.username}
                      error={errors.username}
                      onChange={(v: string) => handleChange("username", v.replace(/\s/g, ""))}
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      error={errors.email}
                      onChange={(v: string) => handleChange("email", v)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        error={errors.password}
                        onChange={(v: string) => handleChange("password", v)}
                        suffix={
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-300 hover:text-gray-500"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                      <InputField
                        label="Confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        error={errors.confirmPassword}
                        onChange={(v: string) => handleChange("confirmPassword", v)}
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <SelectField
                      label="Nationality"
                      placeholder="Select country"
                      options={COUNTRIES_LIST}
                      value={form.nationality}
                      error={errors.nationality}
                      onChange={(v: string) => handleChange("nationality", v)}
                    />
                    <SelectField
                      label="Current Residence"
                      placeholder="Where do you live?"
                      options={COUNTRIES_LIST}
                      value={form.currentCountry}
                      error={errors.currentCountry}
                      onChange={(v: string) => handleChange("currentCountry", v)}
                    />
                    <InputField
                      label="GPA (optional)"
                      type="number"
                      placeholder="e.g. 3.8"
                      value={form.gpa}
                      onChange={(v: string) => handleChange("gpa", v)}
                    />
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mt-10">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="h-[60px] px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-500 font-bold hover:bg-gray-100 transition-all flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="flex-1 h-[60px] bg-[#3366FF] text-white font-bold rounded-2xl text-[17px] shadow-lg shadow-blue-500/20 hover:bg-[#2952cc] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  {submitting ? "Processing..." : step === 0 ? (
                    <>Next Step <ChevronRight className="w-5 h-5" /></>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Create Account</>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center mt-8 text-[14px] font-semibold text-gray-400">
              Already has an account?{" "}
              <Link href="/login" className="text-[#3366FF] font-bold hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text", 
  error, 
  suffix 
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[54px] bg-gray-50/50 border ${error ? "border-red-200" : "border-gray-100"} rounded-xl px-4 text-[15px] font-medium text-gray-700 outline-none focus:border-[#3366FF]/30 focus:bg-white transition-all`}
        />
        {suffix && <div className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && <p className="text-[11px] text-red-500 font-bold px-1">{error}</p>}
    </div>
  );
}

function SelectField({ 
  label, 
  placeholder, 
  options, 
  value, 
  onChange, 
  error 
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-[54px] bg-gray-50/50 border ${error ? "border-red-200" : "border-gray-100"} rounded-xl px-4 text-[15px] font-medium text-gray-700 outline-none focus:border-[#3366FF]/30 focus:bg-white transition-all appearance-none cursor-pointer`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-[11px] text-red-500 font-bold px-1">{error}</p>}
    </div>
  );
}
