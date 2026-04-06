"use client";

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneE164 = searchParams.get("phoneE164") || "";
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const maskedPhone = useMemo(() => {
    if (!phoneE164) {
      return "your phone";
    }

    if (phoneE164.length <= 6) {
      return phoneE164;
    }

    return `${phoneE164.slice(0, 4)}••••${phoneE164.slice(-2)}`;
  }, [phoneE164]);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!phoneE164) {
      router.replace("/register");
    }
  }, [phoneE164, router]);

  const handleVerify = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!phoneE164 || !otp) {
      setError("Enter the OTP sent to your phone.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/verify-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneE164, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "OTP verification failed.");
        return;
      }

      setSuccess("Phone verified successfully. Redirecting to login...");
      setTimeout(() => {
        const callbackParam = callbackUrl
          ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "";
        const loginUrl = `/login?registered=1${callbackParam}`;
        router.replace(loginUrl);
      }, 900);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneE164) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneE164 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to resend OTP.");
        return;
      }

      setSuccess(`OTP resent successfully via ${data.channel || "SMS"}.`);
    } catch {
      setError("Unable to resend OTP right now.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[480px] rounded-[32px] bg-white border border-slate-200 shadow-2xl shadow-blue-500/10 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3366FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Verify OTP</h1>
            <p className="text-sm text-slate-500">
              We sent a code to {maskedPhone}.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label
              htmlFor="otp-code"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              OTP Code
            </label>
            <OTPInput value={otp} onChange={(v) => setOtp(v)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#3366FF] text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-[#2952cc] transition-all disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify and Continue"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full h-14 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-70"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-bold text-[#3366FF] hover:underline"
          >
            Go to login
          </Link>
        </p>
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFF]" />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
