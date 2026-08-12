"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, User, Mail, Phone, Lock, Check } from "lucide-react";
import { sections } from "@/lib/terms-data";
import { validatePhoneByCountry, getPhonePlaceholder } from "@/lib/phone-validation";

type CountryCodeOption = {
  code: string;
  label: string;
  dialCode: string;
};

const FALLBACK_COUNTRY_CODES: CountryCodeOption[] = [
  { code: "NP", label: "Nepal", dialCode: "+977" },
  { code: "US", label: "United States", dialCode: "+1" },
  { code: "GB", label: "United Kingdom", dialCode: "+44" },
  { code: "CA", label: "Canada", dialCode: "+1" },
  { code: "IN", label: "India", dialCode: "+91" },
  { code: "AU", label: "Australia", dialCode: "+61" },
  { code: "BD", label: "Bangladesh", dialCode: "+880" },
  { code: "PK", label: "Pakistan", dialCode: "+92" },
  { code: "NG", label: "Nigeria", dialCode: "+234" },
  { code: "AE", label: "United Arab Emirates", dialCode: "+971" },
];

function buildCountryCodeOptions(data: unknown): CountryCodeOption[] {
  if (!Array.isArray(data)) return [];
  const options: CountryCodeOption[] = [];
  for (const item of data) {
    const country = item as {
      name?: { common?: string };
      idd?: { root?: string; suffixes?: string[] };
      cca2?: string;
    };
    const name = country.name?.common;
    const code = country.cca2;
    const root = country.idd?.root;
    const suffixes = country.idd?.suffixes;
    if (!name || !code || !root || !Array.isArray(suffixes)) continue;
    for (const suffix of suffixes) {
      const dialCode = `${root}${suffix}`;
      if (!/^\+\d+$/.test(dialCode)) continue;
      options.push({ code, label: name, dialCode });
    }
  }
  return options.sort((a, b) => a.label.localeCompare(b.label));
}

type DbStatus = "idle" | "checking" | "available" | "taken" | "error";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);
  const [countryCodes, setCountryCodes] = useState<CountryCodeOption[]>(
    FALLBACK_COUNTRY_CODES
  );

  const [emailDbStatus, setEmailDbStatus] = useState<DbStatus>("idle");
  const [phoneDbStatus, setPhoneDbStatus] = useState<DbStatus>("idle");
  const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryDialCode: "+977",
    phone: "",
    prefersWhatsApp: true,
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    if (callbackUrl) {
      router.replace(callbackUrl);
      return;
    }
    if (session?.user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }
    router.replace("/matches");
  }, [status, session, callbackUrl, router]);

  useEffect(() => {
    const controller = new AbortController();
    const loadCountryCodes = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2",
          { signal: controller.signal }
        );
        if (!response.ok) return;
        const data = await response.json();
        const options = buildCountryCodeOptions(data);
        if (options.length > 0) setCountryCodes(options);
      } catch {}
    };
    loadCountryCodes();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    const email = form.email.trim().toLowerCase();
    const validFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !validFormat) {
      setEmailDbStatus("idle");
      return;
    }
    setEmailDbStatus("checking");
    emailDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-availability?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (data.reason === "taken") {
          setEmailDbStatus("taken");
          setErrors((p) => ({
            ...p,
            email: "An account with this email already exists. Please login instead.",
          }));
        } else if (data.available) {
          setEmailDbStatus("available");
          setErrors((p) => ({ ...p, email: "" }));
        } else {
          setEmailDbStatus("error");
        }
      } catch {
        setEmailDbStatus("error");
      }
    }, 600);
    return () => {
      if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    };
  }, [form.email]);

  useEffect(() => {
    if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    const valid = validatePhoneByCountry(form.phone, form.countryDialCode);
    if (!form.phone.trim() || !valid.isValid) {
      setPhoneDbStatus("idle");
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    setPhoneDbStatus("checking");
    phoneDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-availability?dialCode=${encodeURIComponent(
            form.countryDialCode
          )}&phone=${encodeURIComponent(digits)}`
        );
        const data = await res.json();
        if (data.reason === "taken") {
          setPhoneDbStatus("taken");
          setErrors((p) => ({
            ...p,
            phone:
              "An account with this phone number already exists. Please login instead.",
          }));
        } else if (data.available) {
          setPhoneDbStatus("available");
          setErrors((p) => ({ ...p, phone: "" }));
        } else {
          setPhoneDbStatus("error");
        }
      } catch {
        setPhoneDbStatus("error");
      }
    }, 600);
    return () => {
      if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    };
  }, [form.phone, form.countryDialCode]);

  if (status === "loading" || status === "authenticated") return null;

  const validateField = (k: string, v: string): string => {
    if (k === "fullName") {
      if (!v.trim()) return "Full name is required.";
      if (!/^[a-zA-Z\s\-\.\'\u00C0-\u024F]+$/.test(v.trim()))
        return "Full name must contain letters and spaces only (numbers and special characters are not allowed).";
      if (v.trim().length < 2) return "Full name must be at least 2 characters.";
    }
    if (k === "email") {
      if (!v.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
    }
    if (k === "phone") {
      const res = validatePhoneByCountry(v, form.countryDialCode);
      if (!res.isValid) return res.errorMsg;
    }
    return "";
  };

  const handleChange = (k: string, v: string) => {
    if (k === "countryDialCode") {
      setForm((p) => ({ ...p, countryDialCode: v }));
      if (form.phone.trim()) {
        const phoneErr = validatePhoneByCountry(form.phone, v).errorMsg;
        setErrors((p) => ({ ...p, phone: phoneErr }));
      }
      setServerError("");
      return;
    }

    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: validateField(k, v) }));
    setServerError("");
  };

  const hasErrors = Object.values(errors).some((e) => e !== "");
  const isFormEmpty =
    !form.fullName.trim() || !form.email.trim() || !form.phone.trim();
  const isDbChecking =
    emailDbStatus === "checking" || phoneDbStatus === "checking";
  const isSubmitDisabled = submitting || hasErrors || isFormEmpty || isDbChecking;

  const validate = () => {
    const e: Record<string, string> = {};
    e.fullName = validateField("fullName", form.fullName);
    e.email = validateField("email", form.email);
    e.phone = validateField("phone", form.phone);
    if (!form.countryDialCode.trim()) e.countryDialCode = "Country code required.";
    Object.keys(e).forEach((key) => {
      if (!e[key]) delete e[key];
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceedToTerms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setShowTerms(true);
  };

  const handleRegisterSubmit = async () => {
    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phoneNumber: form.phone,
          name: form.fullName,
          email: form.email.toLowerCase(),
          acceptedTerms: true,
          nationality: "",
          currentCountry: "",
          gpa: "",
          preferredCountry: "",
          degreeLevel: "",
          fieldOfStudy: "",
          englishTestType: "None",
          englishScore: "0",
          yearlyBudget: "0",
          currency: "NPR",
          scholarshipNeeded: false,
          intake: "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Registration failed.");
        setShowTerms(false);
        return;
      }

      if (data?.existingUser) {
        const loginDial = data?.user?.countryDialCode || form.countryDialCode;
        const loginPhone = data?.user?.phoneNumber || form.phone;
        const callbackParam = callbackUrl
          ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "";

        router.push(
          `/login?existing=1&otp=1&countryDialCode=${encodeURIComponent(
            loginDial
          )}&phoneNumber=${encodeURIComponent(loginPhone)}${callbackParam}`
        );
        return;
      }

      const phoneE164 = data?.user?.phoneE164 || data?.otp?.phoneE164;

      if (!phoneE164) {
        setServerError(
          "Signup succeeded, but we could not start OTP verification."
        );
        setShowTerms(false);
        return;
      }

      const callbackParam = callbackUrl
        ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : `&callbackUrl=${encodeURIComponent("/matches")}`;
      router.push(
        `/verify-otp?phoneE164=${encodeURIComponent(phoneE164)}${callbackParam}`
      );
    } catch {
      setServerError("Something went wrong.");
      setShowTerms(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#3366FF]/20 selection:text-[#3366FF] overflow-hidden">
      {/* Blurred Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/abroad.jpg"
          alt="Background"
          fill
          priority
          className="object-cover scale-105 filter blur-lg brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
      </div>

      {/* Outer Card Container */}
      <div className="w-full max-w-[980px] bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] flex flex-col md:flex-row overflow-hidden border border-slate-100 relative min-h-[580px] z-10">
        
        {/* ── LEFT PANEL (BRAND HERO WITH SCALLOPED CLOUD CURVE) ── */}
        <div className="w-full md:w-[44%] lg:w-[42%] bg-gradient-to-br from-[#1E40AF] via-[#3366FF] to-[#2563EB] relative flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden shrink-0 min-h-[300px] md:min-h-full">
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Welcome Text */}
          <div className="relative z-20">
            <h2 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
              Welcome to
            </h2>
          </div>

          {/* Lifted Brand Identity Badge */}
          <div className="relative z-20 mt-4 sm:mt-6 mb-auto flex flex-col items-center text-center py-2">
            <div className="bg-white/95 px-7 py-4 rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.25)] border-4 border-white/20 hover:scale-105 transition-transform duration-300 mb-4 flex items-center justify-center">
              <div className="relative w-[160px] sm:w-[180px] h-[45px] sm:h-[50px]">
                <Image
                  src="/logo.png"
                  alt="AbroadLift Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-[13px] text-blue-100 font-medium leading-relaxed max-w-[260px] opacity-90">
              Discover top global universities, compare programs, and apply with confidence.
            </p>
          </div>

          {/* Bottom Footer Links */}
          <div className="relative z-20 flex items-center justify-center gap-3 text-[11px] font-bold text-white/70 tracking-widest uppercase">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>

          {/* ── SCALLOPED / BUBBLE CLOUD CURVE TRANSITION (RIGHT EDGE) ── */}
          <div className="hidden md:block absolute top-0 bottom-0 right-[-1px] w-[50px] lg:w-[65px] pointer-events-none z-20 h-full">
            <svg
              className="h-full w-full fill-white drop-shadow-[-6px_0_12px_rgba(0,0,0,0.06)]"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
            >
              <path d="M 100,0 L 100,800 L 0,800 C 45,750 45,700 0,650 C 45,600 45,550 0,500 C 45,450 45,400 0,350 C 45,300 45,250 0,200 C 45,150 45,100 0,50 C 45,20 25,0 0,0 Z" />
            </svg>
          </div>

          {/* Secondary Translucent Cloud Layer for Depth */}
          <div className="hidden md:block absolute top-0 bottom-0 right-[20px] w-[45px] pointer-events-none z-10 h-full opacity-30">
            <svg
              className="h-full w-full fill-[#93C5FD]"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
            >
              <path d="M 100,0 L 100,800 L 0,800 C 50,740 50,680 0,630 C 50,580 50,520 0,470 C 50,420 50,360 0,310 C 50,260 50,200 0,150 C 50,100 50,40 0,0 Z" />
            </svg>
          </div>
        </div>

        {/* ── RIGHT PANEL (FORM CONTAINER) ── */}
        <div className="flex-1 bg-white p-8 sm:p-12 flex flex-col justify-center relative z-10">
          <div className="max-w-[420px] w-full mx-auto">
            
            {/* Header */}
            <div className="mb-8 text-left">
              <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight">
                Create your account
              </h1>
              <p className="text-slate-500 font-medium text-[14px] mt-1">
                Join thousands of students studying abroad.
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="w-full mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 text-[13px] font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{serverError}</p>
              </div>
            )}

            {!showTerms ? (
              <form onSubmit={handleProceedToTerms} className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-slate-700 block">Full Name</label>
                  <div className={`relative flex items-center border-b-2 transition-colors pb-1 ${
                    errors.fullName ? "border-rose-500" : "border-slate-200 focus-within:border-[#3366FF]"
                  }`}>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none pr-8 py-2"
                    />
                    <User className={`w-5 h-5 absolute right-1 pointer-events-none ${
                      errors.fullName ? "text-rose-500" : "text-slate-400"
                    }`} />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                      <span>⚠️ {errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address Field */}
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-slate-700 block">E-mail Address</label>
                  <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#3366FF] transition-colors pb-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none pr-8 py-2"
                    />
                    <div className="absolute right-1">
                      {emailDbStatus === "checking" ? (
                        <svg className="w-5 h-5 animate-spin text-[#3366FF]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      ) : emailDbStatus === "available" ? (
                        <Check className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                      ) : (
                        <Mail className="w-5 h-5 text-slate-400 pointer-events-none" />
                      )}
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-slate-700 block">Phone Number</label>
                  <div className="flex gap-3 border-b-2 border-slate-200 focus-within:border-[#3366FF] transition-colors pb-1">
                    <select
                      value={form.countryDialCode}
                      onChange={(e) => handleChange("countryDialCode", e.target.value)}
                      className="bg-transparent text-[14px] font-bold text-slate-800 outline-none cursor-pointer pr-1"
                    >
                      {countryCodes.map((country) => (
                        <option key={`${country.code}-${country.dialCode}`} value={country.dialCode}>
                          {country.dialCode} ({country.code})
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1 flex items-center">
                      <input
                        type="tel"
                        placeholder={getPhonePlaceholder(form.countryDialCode)}
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none pr-8 py-2"
                      />
                      <div className="absolute right-1">
                        {phoneDbStatus === "checking" ? (
                          <svg className="w-5 h-5 animate-spin text-[#3366FF]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                        ) : phoneDbStatus === "available" ? (
                          <Check className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <Phone className="w-5 h-5 text-slate-400 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.prefersWhatsApp}
                      onChange={() =>
                        setForm((p) => ({ ...p, prefersWhatsApp: !p.prefersWhatsApp }))
                      }
                      className="w-4 h-4 text-[#3366FF] border-slate-300 rounded focus:ring-[#3366FF] cursor-pointer"
                    />
                    <span className="text-[12px] font-medium text-slate-600">
                      By Signing Up, I agree with <button type="button" onClick={() => setShowTerms(true)} className="text-[#3366FF] font-bold underline hover:text-[#254bdb]">Terms & Conditions</button>
                    </span>
                  </label>
                </div>

                {/* Sign Up Action Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full bg-[#3366FF] hover:bg-[#254bdb] text-white font-extrabold py-3.5 rounded-full text-[15px] shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Already Have Account Text Link */}
                <p className="mt-5 text-center text-[13px] font-medium text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href={
                      callbackUrl
                        ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                        : "/login"
                    }
                    className="text-[#3366FF] font-bold hover:underline ml-1"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            ) : (
              /* Terms Modal/View */
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-left">
                  <h2 className="text-[20px] font-bold text-slate-900">Terms & Conditions</h2>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">Please review before completing registration.</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-2xl p-4 bg-slate-50 text-[12px] text-slate-600 leading-relaxed space-y-4">
                  {sections.map((sec) => (
                    <div key={sec.heading} className="space-y-1">
                      <h3 className="font-bold text-slate-800">{sec.heading}</h3>
                      {sec.body.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={submitting}
                    className="bg-[#3366FF] hover:bg-[#254bdb] text-white font-bold px-7 py-3 rounded-full text-[13px] shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Accept & Register"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTerms(false)}
                    disabled={submitting}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-7 py-3 rounded-full text-[13px] transition-all"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#3366FF]/20 border-t-[#3366FF] rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
