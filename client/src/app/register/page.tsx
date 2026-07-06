"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { sections } from "@/lib/terms-data";

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
  if (!Array.isArray(data)) {
    return [];
  }

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

    if (!name || !code || !root || !Array.isArray(suffixes)) {
      continue;
    }

    for (const suffix of suffixes) {
      const dialCode = `${root}${suffix}`;
      if (!/^\+\d+$/.test(dialCode)) {
        continue;
      }

      options.push({
        code,
        label: name,
        dialCode,
      });
    }
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

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
    FALLBACK_COUNTRY_CODES,
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryDialCode: "+977",
    phone: "",
    prefersWhatsApp: true,
  });

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (callbackUrl) {
      router.replace(callbackUrl);
      return;
    }

    if (session?.user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    router.replace("/dashboard");
  }, [status, session, callbackUrl, router]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCountryCodes = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2",
          { signal: controller.signal },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const options = buildCountryCodeOptions(data);

        if (options.length > 0) {
          setCountryCodes(options);
        }
      } catch {
        // Keep fallback list when the API is unavailable.
      }
    };

    loadCountryCodes();

    return () => controller.abort();
  }, []);

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name required.";
    if (!form.email.trim()) e.email = "Email required.";
    if (!form.countryDialCode.trim())
      e.countryDialCode = "Country code required.";
    if (!form.phone.trim()) e.phone = "Phone number required.";
    if (!/^\d{6,15}$/.test(form.phone.replaceAll(/\D/g, ""))) {
      e.phone = "Enter a valid phone number.";
    }

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
          `/login?existing=1&otp=1&countryDialCode=${encodeURIComponent(loginDial)}&phoneNumber=${encodeURIComponent(loginPhone)}${callbackParam}`,
        );
        return;
      }

      const phoneE164 = data?.user?.phoneE164 || data?.otp?.phoneE164;

      if (!phoneE164) {
        setServerError(
          "Signup succeeded, but we could not start OTP verification.",
        );
        setShowTerms(false);
        return;
      }

      const callbackParam = callbackUrl
        ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : `&callbackUrl=${encodeURIComponent("/matches")}`;
      router.push(
        `/verify-otp?phoneE164=${encodeURIComponent(phoneE164)}${callbackParam}`,
      );
    } catch {
      setServerError("Something went wrong.");
      setShowTerms(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF]">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Pane: Visual Sidebar */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
          <div className="absolute inset-0 z-0">
            <Image
              src="/signup-bg.png"
              alt="Register Background"
              fill
              priority
              className="object-cover animate-pulse"
              style={{ animationDuration: '8s' }}
            />
            <div className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-md" />
            {/* Extra ambient glow circles */}
            <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-[#3686FF]/15 rounded-full blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-50/15 rounded-full blur-[100px]" />
          </div>

          {/* Logo Capsule in Sidebar */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300">
              <div className="bg-white px-5 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center">
                <div className="relative w-[110px] h-[30px]">
                  <Image
                    src="/logo.png"
                    alt="AbroadLift Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Headline and messaging */}
          <div className="relative z-10 max-w-md my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3686FF] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Join AbroadLift</span>
            </div>
            <h2 className="text-[38px] xl:text-[46px] font-black leading-[1.15] mb-4 tracking-tighter text-white">
              Start Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3686FF] to-indigo-350">Global Journey</span>
            </h2>
            <p className="text-[14px] text-white/60 font-medium leading-relaxed max-w-sm">
              Connect with top-tier universities, compare admissions criteria, plan your finances, and track your global study pathway in one unified platform.
            </p>
          </div>

          {/* Platform statistics */}
          <div className="relative z-10 flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[20px] p-5 flex-1">
              <p className="text-[28px] font-black leading-none mb-1 text-white">15k+</p>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Programs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[20px] p-5 flex-1">
              <p className="text-[28px] font-black leading-none mb-1 text-white">80+</p>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Countries</p>
            </div>
          </div>
        </div>

        {/* Right Pane: Form Container */}
        <div className="flex-1 relative flex items-center justify-center p-6 sm:p-12 lg:bg-transparent overflow-y-auto z-10">
          <div className="w-full max-w-[440px] flex flex-col py-4 relative z-10">
            {/* Title & Mobile-only Logo */}
            <div className="mb-8 text-center lg:text-left">
              {/* Mobile-only logo display */}
              <div className="lg:hidden flex justify-center mb-6">
                <Link href="/" className="hover:scale-105 active:scale-95 transition-all">
                  <div className="bg-white px-5 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200/60 flex items-center justify-center">
                    <div className="relative w-[110px] h-[30px]">
                      <Image
                        src="/logo.png"
                        alt="AbroadLift Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <h1 className="text-[30px] md:text-[36px] font-black text-slate-900 mb-2 tracking-tight">
                Create Account
              </h1>
              <p className="text-slate-500 font-medium text-[14px]">
                Join thousands of students studying abroad.
              </p>
            </div>

            {/* Error Notification */}
            {serverError && (
              <div className="w-full mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-[20px] flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-bold text-[13px] mt-0.5">{serverError}</p>
              </div>
            )}

            {!showTerms ? (
            <form onSubmit={handleProceedToTerms} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                <InputField
                  placeholder="Your Name"
                  value={form.fullName}
                  error={errors.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
                <InputField
                  placeholder="Your Email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(v) => handleChange("email", v)}
                />
              </div>

              <div className="w-full space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Phone Number</label>
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={form.countryDialCode}
                      onChange={(e) => handleChange("countryDialCode", e.target.value)}
                      className="h-[60px] w-[110px] rounded-[20px] border border-slate-200 bg-white pl-4 pr-8 text-[15px] font-bold text-slate-900 outline-none transition-all focus:border-[#3686FF] focus:ring-4 focus:ring-[#3686FF]/10 shadow-sm appearance-none cursor-pointer"
                    >
                      {countryCodes.map((country) => (
                        <option key={`${country.code}-${country.dialCode}`} value={country.dialCode}>
                          {country.dialCode} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <InputField
                      placeholder="9812345678"
                      type="tel"
                      value={form.phone}
                      error={errors.phone}
                      onChange={(v) => handleChange("phone", v)}
                    />
                  </div>
                </div>
                {errors.countryDialCode && (
                  <p className="mt-2 text-[11px] text-rose-500 font-bold px-4">{errors.countryDialCode}</p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.prefersWhatsApp}
                      onChange={() => setForm((p) => ({ ...p, prefersWhatsApp: !p.prefersWhatsApp }))}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[6px] checked:bg-[#3686FF] checked:border-[#3686FF] cursor-pointer transition-all hover:border-[#3686FF]"
                    />
                    <svg className="absolute left-[2.5px] w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold text-slate-600 select-none">
                    Send OTP via SMS for verification
                  </span>
                </label>
              </div>

              <div className="w-full rounded-[20px] border border-blue-100 bg-blue-50/70 px-5 py-4 text-[12px] font-bold text-blue-700 shadow-sm leading-relaxed">
                No password needed. We&apos;ll send an SMS OTP to verify your account when you login.
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[60px] bg-[#3686FF] text-white font-extrabold rounded-[20px] text-[14px] shadow-[0_8px_20px_rgba(54,134,255,0.2)] hover:shadow-[0_12px_25px_rgba(54,134,255,0.3)] hover:-translate-y-0.5 hover:bg-[#2970E6] transition-all disabled:opacity-50 disabled:hover:translate-y-0 active:translate-y-0 uppercase tracking-widest mt-4"
              >
                Create Account
              </button>
            </form>
            ) : (
            <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Terms & Conditions</h2>
                <p className="text-[13px] font-medium text-slate-500 mt-1">Please read and accept our terms to complete your registration.</p>
              </div>

              <div className="max-h-[340px] overflow-y-auto border border-slate-200 rounded-[20px] p-5 bg-slate-50 text-[12px] text-slate-600 leading-relaxed space-y-5 shadow-inner">
                {sections.map((sec) => (
                  <div key={sec.heading} className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-800 text-[13px]">{sec.heading}</h3>
                    {sec.body.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  disabled={submitting}
                  className="w-full h-[60px] bg-[#3686FF] text-white font-extrabold rounded-[20px] text-[14px] shadow-[0_8px_20px_rgba(54,134,255,0.2)] hover:shadow-[0_12px_25px_rgba(54,134,255,0.3)] hover:-translate-y-0.5 hover:bg-[#2970E6] transition-all disabled:opacity-50 active:translate-y-0 uppercase tracking-widest"
                >
                  {submitting ? "Creating Account..." : "Accept & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTerms(false)}
                  disabled={submitting}
                  className="w-full h-[60px] bg-white border border-slate-200 text-slate-600 font-bold rounded-[20px] text-[13px] hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
                >
                  Go Back
                </button>
              </div>
            </div>
            )}



            {/* Footer */}
            <p className="text-[13px] font-semibold text-slate-500 text-center">
              Already have an account?{" "}
              <Link
                href={
                  callbackUrl
                    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : "/login"
                }
                className="text-[#3686FF] font-black hover:underline ml-1"
              >
                Login
              </Link>
            </p>
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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-12 h-12 border-[4px] border-[#3686FF]/20 border-t-[#3686FF] rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function InputField({
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  suffix,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[60px] bg-white border border-slate-200 rounded-[20px] px-5 text-[15px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium outline-none focus:border-[#3686FF] focus:ring-4 focus:ring-[#3686FF]/10 transition-all shadow-sm ${error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/20" : ""}`}
        />
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-[11px] text-rose-500 font-bold px-4">{error}</p>
      )}
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-all active:scale-95">
      {icon}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 8h2V5h-2c-2.21 0-4 1.79-4 4v2H8v3h2v5h3v-5h2.5l.5-3H13V9c0-.55.45-1 1-1z"
        fill="#1877F2"
      />
    </svg>
  );
}
