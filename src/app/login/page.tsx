"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  AtSign,
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
        router.push("/matches");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Brand mark */}
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-5">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">NextDegree</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Just registered banner */}
        {justRegistered && (
          <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 fade-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-300">Account created!</p>
              <p className="text-xs text-emerald-500/80">Sign in to start matching universities.</p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl fade-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Identifier input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Email or Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError("");
                  }}
                  placeholder="jane@example.com or janedoe123"
                  autoComplete="username"
                  className="w-full h-[54px] bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 text-white placeholder:text-slate-600 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="w-full h-[54px] bg-white/5 border border-white/10 rounded-2xl pl-10 pr-12 text-white placeholder:text-slate-600 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#07070f] px-3 text-xs text-slate-600 font-medium">
                Secure login powered by NextAuth
              </span>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-2">
            {[
              "Access your saved university matches",
              "Track your application journey",
              "Get personalized recommendations",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-xs text-slate-500">
                <div className="w-4 h-4 bg-indigo-500/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          © {new Date().getFullYear()} NextDegree. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
