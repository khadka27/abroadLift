/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useCallback, useEffect, useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Phone, Lock } from "lucide-react";
import {
  normalizeDialCode,
  normalizePhoneNumber,
  toE164,
} from "@/lib/phoneVerification";
import { validatePhoneByCountry, getPhonePlaceholder } from "@/lib/phone-validation";

const COUNTRY_CODES = [
  { label: "Nepal", dialCode: "+977" },
  { label: "India", dialCode: "+91" },
  { label: "United States", dialCode: "+1" },
  { label: "United Kingdom", dialCode: "+44" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [countryDialCode, setCountryDialCode] = useState("+977");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [existingAccountOtp, setExistingAccountOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const safeCallbackUrl =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "";

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }
    if (safeCallbackUrl && safeCallbackUrl !== "/") {
      router.replace(safeCallbackUrl);
      return;
    }
    router.replace("/dashboard");
  }, [status, session, router, safeCallbackUrl]);

  useEffect(() => {
    setJustRegistered(searchParams.get("registered") === "1");
    setExistingAccountOtp(searchParams.get("existing") === "1");

    const dialCodeFromQuery = searchParams.get("countryDialCode") || "";
    const phoneFromQuery = searchParams.get("phoneNumber") || "";

    if (dialCodeFromQuery) {
      setCountryDialCode(normalizeDialCode(dialCodeFromQuery));
    }
    if (phoneFromQuery) {
      setPhoneNumber(normalizePhoneNumber(phoneFromQuery));
    }
    if (searchParams.get("otp") === "1") {
      setOtpSent(true);
    }
  }, [searchParams]);

  const performLogin = useCallback(
    async (otpValue: string) => {
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      const normalizedDialCode = normalizeDialCode(countryDialCode);
      const phoneE164 = toE164(normalizedDialCode, normalizedPhoneNumber);

      if (!phoneE164 || !otpValue.trim()) {
        setError("Please enter your phone number and OTP.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await signIn("credentials", {
          phone: phoneE164,
          otp: otpValue.trim(),
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          return;
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [phoneNumber, countryDialCode]
  );

  useEffect(() => {
    if (otp.trim().length === 6) {
      performLogin(otp);
    }
  }, [otp, performLogin]);

  if (status === "loading" || status === "authenticated") return null;

  const handleSendOtp = async () => {
    const phoneValid = validatePhoneByCountry(phoneNumber, countryDialCode);
    if (!phoneValid.isValid) {
      setError(phoneValid.errorMsg);
      return;
    }

    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    const normalizedDialCode = normalizeDialCode(countryDialCode);
    const phoneE164 = toE164(normalizedDialCode, normalizedPhoneNumber);

    if (!phoneE164) {
      setError("Please enter your phone number first.");
      return;
    }

    setSendingOtp(true);
    setError("");

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryDialCode: normalizedDialCode,
          phoneNumber: normalizedPhoneNumber,
          phoneE164,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
        return;
      }

      setOtpSent(true);
    } catch {
      setError("Unable to send OTP right now. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      await handleSendOtp();
    } else {
      await performLogin(otp);
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
            <p className="text-[18px] sm:text-[22px] font-semibold text-white/95 tracking-wide">
              Welcome to
            </p>
          </div>

          {/* Center Brand Identity Badge */}
          <div className="relative z-20 my-auto flex flex-col items-center text-center py-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.2)] mb-4 p-4 border-4 border-white/20 hover:scale-105 transition-transform duration-300">
              <div className="relative w-full h-full">
                <Image
                  src="/logo.png"
                  alt="AbroadLift Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-tight leading-tight">
              AbroadLift
            </h2>
            <p className="text-[13px] text-blue-100 font-medium leading-relaxed max-w-[250px] mt-2 opacity-90">
              Access your saved programs, admission insights, and application tracker.
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
                Welcome Back
              </h1>
              <p className="text-slate-500 font-medium text-[14px] mt-1">
                Sign in with your phone number to continue.
              </p>
            </div>

            {/* Success Notifications */}
            {justRegistered && (
              <div className="w-full mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 text-[13px] font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Account Created!</p>
                  <p className="text-[12px] opacity-90 mt-0.5">Please enter the 6-digit OTP sent to your phone to sign in.</p>
                </div>
              </div>
            )}

            {existingAccountOtp && (
              <div className="w-full mb-6 bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-2xl flex items-start gap-3 text-[13px] font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Account Found</p>
                  <p className="text-[12px] opacity-90 mt-0.5">Use the OTP sent to your phone to sign in.</p>
                </div>
              </div>
            )}

            {otpSent && !justRegistered && !existingAccountOtp && (
              <div className="w-full mb-6 bg-indigo-50 border border-indigo-100 text-indigo-700 p-4 rounded-2xl flex items-start gap-3 text-[13px] font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>OTP sent via SMS successfully.</p>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="w-full mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 text-[13px] font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!otpSent ? (
                <>
                  {/* Phone Number Field */}
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-slate-700 block">Phone Number</label>
                    <div className="flex gap-3 border-b-2 border-slate-200 focus-within:border-[#3366FF] transition-colors pb-1">
                      <select
                        value={countryDialCode}
                        onChange={(e) => setCountryDialCode(e.target.value)}
                        disabled={otpSent}
                        className="bg-transparent text-[14px] font-bold text-slate-800 outline-none cursor-pointer pr-1"
                      >
                        {COUNTRY_CODES.map((country) => (
                          <option key={country.dialCode} value={country.dialCode}>
                            {country.dialCode} ({country.label})
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1 flex items-center">
                        <input
                          type="tel"
                          placeholder={getPhonePlaceholder(countryDialCode)}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none pr-8 py-2"
                        />
                        <Phone className="w-5 h-5 text-slate-400 absolute right-1 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  {/* Action Pill Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || !phoneNumber.trim()}
                      className="w-full bg-[#3366FF] hover:bg-[#254bdb] text-white font-extrabold py-3.5 rounded-full text-[15px] shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {sendingOtp ? "Sending..." : "Continue"}
                    </button>
                  </div>

                  {/* Don't Have Account Text Link */}
                  <p className="mt-5 text-center text-[13px] font-medium text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link
                      href={
                        safeCallbackUrl
                          ? `/register?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
                          : "/register"
                      }
                      className="text-[#3366FF] font-bold hover:underline ml-1"
                    >
                      Sign Up
                    </Link>
                  </p>
                </>
              ) : (
                /* OTP Verification View */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 block">
                      Enter 6-Digit Verification Code
                    </label>
                    <OTPInput value={otp} onChange={(v) => setOtp(v)} />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading || otp.trim().length !== 6}
                      className="w-full bg-[#3366FF] hover:bg-[#254bdb] text-white font-extrabold py-3.5 rounded-full text-[15px] shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? "Authenticating..." : "Sign In"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setError("");
                      }}
                      className="w-full text-center text-[13px] font-bold text-slate-500 hover:text-[#3366FF] transition-colors py-1"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpArray = value.split("").slice(0, 6);
  while (otpArray.length < 6) otpArray.push("");

  const otpBoxes = [
    { id: "otp-digit-1", index: 0 },
    { id: "otp-digit-2", index: 1 },
    { id: "otp-digit-3", index: 2 },
    { id: "otp-digit-4", index: 3 },
    { id: "otp-digit-5", index: 4 },
    { id: "otp-digit-6", index: 5 },
  ];

  const handleChange = (index: number, newVal: string) => {
    const digit = newVal.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = digit;
    const finalOtp = newOtpArray.join("");
    onChange(finalOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otpArray[index]) {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
      } else if (index > 0) {
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = "";
        onChange(newOtpArray.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      const formEl = (e.target as HTMLElement).closest("form");
      if (formEl) {
        e.preventDefault();
        formEl.requestSubmit();
      }
    }
  };

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const clipboard = e.clipboardData;
    if (!clipboard) return;

    const pastedData = clipboard
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (pastedData.length === 0) return;
    e.preventDefault();

    const newOtpArray = [...otpArray];
    pastedData.forEach((char, i) => {
      if (index + i < 6) {
        newOtpArray[index + i] = char;
      }
    });

    onChange(newOtpArray.join(""));
    const lastFocusedIndex = Math.min(index + pastedData.length, 5);
    inputRefs.current[lastFocusedIndex]?.focus();
  };

  return (
    <div className="flex justify-between w-full gap-2">
      {otpBoxes.map(({ id, index }) => (
        <input
          key={id}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otpArray[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          className="w-full aspect-square text-center text-[20px] font-extrabold border-b-2 border-slate-300 focus:border-[#3366FF] bg-slate-50 text-slate-900 outline-none transition-all focus:bg-white rounded-xl shadow-sm"
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#3366FF]/20 border-t-[#3366FF] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
