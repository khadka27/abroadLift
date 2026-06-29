/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useCallback, useEffect, useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  normalizeDialCode,
  normalizePhoneNumber,
  toE164,
} from "@/lib/phoneVerification";

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
    if (status !== "authenticated") {
      return;
    }

    if (session?.user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    if (safeCallbackUrl) {
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

  const performLogin = useCallback(async (otpValue: string) => {
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
  }, [phoneNumber, countryDialCode]);

  useEffect(() => {
    if (otp.trim().length === 6) {
      performLogin(otp);
    }
  }, [otp, performLogin]);

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  const handleSendOtp = async () => {
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await performLogin(otp);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF] overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/abroad.jpg"
          alt="Abroad Background"
          fill
          priority
          className="object-cover"
        />
        {/* Dark blur overlay */}
        <div className="absolute inset-0 bg-[#0A192F]/65 backdrop-blur-[12px]" />
        {/* Animated subtle ambient glow shapes */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#3686FF]/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Floating Centered Card */}
      <div className="relative z-10 w-full max-w-[460px] bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[32px] p-6 sm:p-10 flex flex-col">
        {/* Header with Logo Capsule */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-6 hover:scale-105 active:scale-95 transition-all duration-300">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center">
              <div className="relative w-[130px] h-[36px]">
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
          <h1 className="text-[30px] font-black text-slate-900 mb-2 tracking-tight">
            Login
          </h1>
          <p className="text-slate-505 font-medium text-[14px] text-center max-w-[320px]">
            Sign in with your phone number to access your account.
          </p>
        </div>

        {justRegistered && (
          <div className="w-full mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-[20px] flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-[13px]">Account Created!</p>
              <p className="text-[12px] opacity-90 mt-0.5 font-medium">Please verify your OTP to sign in.</p>
            </div>
          </div>
        )}

        {existingAccountOtp && (
          <div className="w-full mb-6 bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-[20px] flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-[13px]">Account Found</p>
              <p className="text-[12px] opacity-90 mt-0.5 font-medium">Use the OTP sent to your phone to login.</p>
            </div>
          </div>
        )}

        {otpSent && !justRegistered && !existingAccountOtp && (
          <div className="w-full mb-6 bg-indigo-50 border border-indigo-100 text-indigo-700 p-4 rounded-[20px] flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-bold text-[13px] mt-0.5">OTP sent via SMS successfully.</p>
          </div>
        )}

        {error && (
          <div className="w-full mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-[20px] flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-bold text-[13px] mt-0.5">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {!otpSent && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Phone Number</label>
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={countryDialCode}
                      onChange={(e) => setCountryDialCode(e.target.value)}
                      disabled={otpSent}
                      className="h-[60px] w-[110px] rounded-[20px] border border-slate-200 bg-white pl-4 pr-8 text-[15px] font-bold text-slate-900 outline-none transition-all focus:border-[#3686FF] focus:ring-4 focus:ring-[#3686FF]/10 shadow-sm disabled:opacity-50 appearance-none cursor-pointer"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={country.dialCode} value={country.dialCode}>
                          {country.dialCode}
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
                      value={phoneNumber}
                      onChange={(v) => setPhoneNumber(v)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || !phoneNumber.trim()}
                className="w-full h-[60px] bg-[#3686FF] text-white font-extrabold rounded-[20px] text-[14px] shadow-[0_8px_20px_rgba(54,134,255,0.2)] hover:shadow-[0_12px_25px_rgba(54,134,255,0.3)] hover:-translate-y-0.5 hover:bg-[#2970E6] transition-all disabled:opacity-50 disabled:hover:translate-y-0 active:translate-y-0 uppercase tracking-widest"
              >
                {sendingOtp ? "Sending OTP..." : "Continue"}
              </button>
            </div>
          )}

          {otpSent && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2 flex justify-between">
                  <span>Enter 6-Digit Code</span>
                </label>
                <OTPInput value={otp} onChange={(v) => setOtp(v)} />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[60px] bg-[#3686FF] text-white font-extrabold rounded-[20px] text-[14px] shadow-[0_8px_20px_rgba(54,134,255,0.2)] hover:shadow-[0_12px_25px_rgba(54,134,255,0.3)] hover:-translate-y-0.5 hover:bg-[#2970E6] transition-all disabled:opacity-50 active:translate-y-0 uppercase tracking-widest"
                >
                  {loading ? "Authenticating..." : "Login Now"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                  }}
                  className="w-full h-[60px] bg-white border border-slate-200 text-slate-600 font-bold rounded-[20px] text-[13px] hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-[13px] font-semibold text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href={
              safeCallbackUrl
                ? `/register?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
                : "/register"
            }
            className="text-[#3686FF] font-black hover:underline ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
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
          className="w-full h-[60px] bg-white border border-slate-200 rounded-[20px] px-5 text-[15px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium outline-none focus:border-[#3686FF] focus:ring-4 focus:ring-[#3686FF]/10 transition-all shadow-sm"
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

function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize value to 6 digits
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
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (index > 0) {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    const clipboard = e.clipboardData;
    if (!clipboard) return;

    const pastedData = clipboard.getData("text").slice(0, 6).split("");
    if (pastedData.some((char) => !/^\d$/.test(char))) return;

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
          className="w-full aspect-square text-center text-[22px] sm:text-[24px] font-black border border-slate-200 rounded-[16px] bg-white text-slate-900 shadow-sm outline-none transition-all focus:border-[#3686FF] focus:ring-4 focus:ring-[#3686FF]/10 focus:-translate-y-0.5"
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-12 h-12 border-[4px] border-[#3686FF]/20 border-t-[#3686FF] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
