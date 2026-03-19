"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setJustRegistered(true);
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
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Side: Image */}
        <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
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
              transform: "translateX(-2px)"
            }}
          />

          <div className="w-full max-w-[480px] relative z-10 fade-up">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-[24px] font-bold text-gray-800 mb-1">Welcome Back To!</h2>
              <h1 className="text-[52px] font-black text-[#3366FF] leading-none mb-12">AbroadLift</h1>
            </div>

            {/* Just registered banner */}
            {justRegistered && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">Account created!</p>
                  <p className="text-xs opacity-80">Sign in to start matching universities.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identifier */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-[60px] bg-white border border-gray-100 rounded-xl px-6 text-[15px] font-medium text-gray-700 outline-none focus:border-[#3366FF]/30 focus:ring-4 focus:ring-[#3366FF]/5 transition-all placeholder:text-gray-300"
                />
                {identifier && (
                  <button 
                    type="button" 
                    onClick={() => setIdentifier("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[60px] bg-white border border-gray-100 rounded-xl px-6 text-[15px] font-medium text-gray-700 outline-none focus:border-[#3366FF]/30 focus:ring-4 focus:ring-[#3366FF]/5 transition-all placeholder:text-gray-300"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link href="#" className="text-[13px] font-bold text-gray-400 hover:text-gray-600">
                  Forget Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[60px] bg-[#3366FF] text-white font-bold rounded-xl text-[17px] shadow-lg shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 mt-2"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[13px] font-medium text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Logins */}
            <div className="flex justify-center gap-4 mb-12">
              <button className="w-[80px] h-[54px] bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm hover:border-gray-200 transition-all">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} className="grayscale hover:grayscale-0 transition-all" />
              </button>
              <button className="w-[80px] h-[54px] bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm hover:border-gray-200 transition-all">
                <Image src="https://www.apple.com/favicon.ico" alt="Apple" width={20} height={20} className="opacity-60 hover:opacity-100 transition-all" />
              </button>
              <button className="w-[80px] h-[54px] bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm hover:border-gray-200 transition-all">
                <Image src="https://www.facebook.com/favicon.ico" alt="Facebook" width={20} height={20} className="grayscale hover:grayscale-0 transition-all" />
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-[14px] font-semibold text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-gray-600 font-bold hover:text-gray-800 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3366FF]/30 border-t-[#3366FF] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
