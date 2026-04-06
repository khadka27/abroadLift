"use client";

import { Suspense, useEffect, useState, useRef } from "react";
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
  const [countryDialCode, setCountryDialCode] = useState("+977");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpChannel, setOtpChannel] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (session?.user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    router.replace("/");
  }, [status, session, searchParams, router]);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setJustRegistered(true);
    }
  }, [searchParams]);

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
      setOtpChannel((data.channel || "").toLowerCase());
    } catch {
      setError("Unable to send OTP right now. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    const normalizedDialCode = normalizeDialCode(countryDialCode);
    const phoneE164 = toE164(normalizedDialCode, normalizedPhoneNumber);

    if (!phoneE164 || !otp.trim()) {
      setError("Please enter your phone number and OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        phone: phoneE164,
        otp: otp.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Don't redirect here - let useEffect handle it when session updates
      // This ensures the session is fully established before redirecting
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-poppins">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <div className="hidden lg:block lg:w-[50%] xl:w-[55%] relative overflow-hidden">
          <Image
            src="/signup-bg.png"
            alt="Study Abroad Library"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10 text-white drop-shadow-lg">
            <h2 className="text-4xl font-bold mb-4">
              Your Journey, Our Mission.
            </h2>
            <p className="text-lg opacity-80 max-w-md">
              Unlock access to over 6,000+ world-class programs across 7
              countries. Start your global education today.
            </p>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center p-6 lg:bg-[#F9FAFB] overflow-hidden">
          <div
            className="absolute left-[-100px] top-0 bottom-0 w-[200px] bg-[#F9FAFB] hidden lg:block"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          />

          <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center fade-up mt-[-40px] lg:mt-0">
            <h1 className="text-[28px] font-semibold text-[#0f172a] mb-7 leading-[1.1] tracking-tight text-center">
              Login
            </h1>

            {justRegistered && (
              <div className="w-full mb-6 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Account created! Please verify OTP and sign in.</span>
              </div>
            )}

            {otpSent && (
              <div className="w-full mb-6 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  OTP sent on {otpChannel === "sms" ? "SMS" : "WhatsApp"}.
                </span>
              </div>
            )}

            {error && (
              <div className="w-full mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {!otpSent && (
                <>
                  <div className="grid grid-cols-[120px_1fr] gap-3">
                    <select
                      value={countryDialCode}
                      onChange={(e) => setCountryDialCode(e.target.value)}
                      disabled={otpSent}
                      className="h-[56px] w-full rounded-[20px] border-none bg-[#F4F4F4] px-3 text-[14px] font-medium text-[#1e293b] outline-none transition-all focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={country.dialCode} value={country.dialCode}>
                          {country.label} {country.dialCode}
                        </option>
                      ))}
                    </select>

                    <InputField
                      placeholder="9812345678"
                      value={phoneNumber}
                      onChange={(v) => setPhoneNumber(v)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !phoneNumber.trim()}
                    className="w-full h-[56px] bg-[#3381FF] text-white font-bold rounded-[20px] text-[14px] hover:bg-[#2970E6] transition-all disabled:opacity-70"
                  >
                    {sendingOtp ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {otpSent && (
                <div className="space-y-4 fade-in">
                  <div className="flex flex-col items-center">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                      Verify OTP Code
                    </p>
                    <OTPInput value={otp} onChange={(v) => setOtp(v)} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[60px] bg-[#3381FF] text-white font-bold rounded-[30px] text-[16px] shadow-sm hover:bg-[#2970E6] transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? "Logging In..." : "Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="w-full h-[56px] border border-[#D1D5DB] text-[#6B7280] font-bold rounded-[20px] text-[14px] hover:bg-gray-50 transition-all"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </form>

            <p className="mt-6 text-[12px] font-medium text-black">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#3381FF] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
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
          className="w-full h-[56px] bg-[#F4F4F4] border-none rounded-[20px] px-6 text-[16px] font-regular text-[#1e293b] placeholder:text-[#666666] outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-red-500 font-bold px-2">{error}</p>
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

  // Initialize value to 6 digits (empty or space filled if needed)
  const otpArray = value.split("").slice(0, 6);
  while (otpArray.length < 6) otpArray.push("");

  const handleChange = (index: number, newVal: string) => {
    // Only allow digits
    const digit = newVal.slice(-1); // Get the last typed character
    if (digit && !/^\d$/.test(digit)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = digit;
    const finalOtp = newOtpArray.join("");
    onChange(finalOtp);

    // Automatically focus next input if a digit was entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent double deletion since we're handling state manually
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

    // Focus the last filled box or the next one
    const lastFocusedIndex = Math.min(index + pastedData.length, 5);
    inputRefs.current[lastFocusedIndex]?.focus();
  };

  return (
    <div className="flex justify-between w-full">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otpArray[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => {
              handlePaste(index, e);
            }}
            className="w-12 h-12 text-center text-[20px] font-bold border-2 border-[#E5E7EB] rounded-[12px] bg-white text-[#0f172a] shadow-sm outline-none transition-all focus:border-gray-300"
          />
        ))}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#3381FF]/30 border-t-[#3381FF] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
