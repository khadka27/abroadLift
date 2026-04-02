"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Facebook } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("123456"); // Pre-filled with static code for testing
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpChannel, setOtpChannel] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setJustRegistered(true);
    }

    if (searchParams.get("otp") === "1") {
      setOtpSent(true);
      setOtpChannel(searchParams.get("otpChannel") || "");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        otp,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        router.push(callbackUrl || "/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-poppins">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Side: Premium Image for Desktop */}
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

        {/* Right Side: Form Container */}
        <div className="flex-1 relative flex items-center justify-center p-6 lg:bg-[#F9FAFB] overflow-hidden">
          {/* Decorative element for desktop transition */}
          <div
            className="absolute left-[-100px] top-0 bottom-0 w-[200px] bg-[#F9FAFB] hidden lg:block"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            }}
          />

          <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center fade-up mt-[-40px] lg:mt-0">
            {/* Title */}
            <h1 className="text-[28px] font-semibold text-[#0f172a] mb-7 leading-[1.1] tracking-tight text-center">
              Login
            </h1>

            {/* Feedback Banners */}
            {justRegistered && (
              <div className="w-full mb-6 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Account created! Please sign in.</span>
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <InputField
                placeholder="example@gmail.com"
                value={identifier}
                onChange={(v) => setIdentifier(v)}
              />
              <InputField
                placeholder="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => setPassword(v)}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-300 hover:text-gray-500 pr-2 pt-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />

              {otpSent && (
                <div className="space-y-2 fade-in">
                  <div className="flex flex-col items-center">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Verify OTP Code</p>
                    <InputField
                      placeholder="6 digit code"
                      value={otp}
                      onChange={(v) => setOtp(v)}
                      type="text"
                    />
                  </div>
                </div>
              )}

              <div className="text-right pt-1">
                <Link href="#" className="text-[12px] font-medium text-black">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[60px] bg-[#3381FF] text-white font-bold rounded-[30px] text-[16px] shadow-sm hover:bg-[#2970E6] transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full mt-6 mb-5 flex items-center justify-center">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="px-4 text-[16px] font-regular text-black tracking-widest uppercase">
                OR
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Social Options */}
            <div className="flex gap-4 mb-3">
              <SocialButton icon={<GoogleIcon />} />
              <SocialButton icon={<AppleIcon />} />
              <SocialButton
                icon={
                  <Facebook className="w-6 h-6 text-blue-600 fill-blue-600" />
                }
              />
            </div>

            {/* Footer */}
            <p className="text-[12px] font-medium text-black">
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
          className={`w-full h-[56px] bg-[#F4F4F4] border-none rounded-[20px] px-6 text-[16px] font-regular text-[#1e293b] placeholder:text-[#666666] outline-none focus:ring-2 focus:ring-blue-500/10 transition-all`}
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

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95">
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
