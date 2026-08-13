"use client";

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import OTPInput from "@/components/ui/OTPInput";

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

  const performVerification = async (otpValue: string) => {
    if (!phoneE164 || !otpValue) {
      setError("Enter the OTP sent to your phone.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn("credentials", {
        phone: phoneE164,
        otp: otpValue.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "OTP verification failed.");
        return;
      }

      setSuccess("Phone verified. Redirecting to matching portal...");
      setTimeout(() => {
        router.replace("/matches");
      }, 700);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await performVerification(otp);
  };

  useEffect(() => {
    if (otp.trim().length === 6) {
      performVerification(otp);
    }
  }, [otp]);

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
            <OTPInput
              value={otp}
              onChange={(v) => {
                setOtp(v);
                setError("");
              }}
              isError={Boolean(error)}
            />
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
          Already have an account?{" "}
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFF]" />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
