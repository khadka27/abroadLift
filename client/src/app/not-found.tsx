"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowLeft, Home, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center p-6 md:p-12 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF]">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-blue-300/15 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[380px] h-[380px] bg-indigo-300/15 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        {/* Animated Compass Icon Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-2xl opacity-20 scale-125 animate-pulse" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-indigo-100 backdrop-blur-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="text-[#3686FF]"
            >
              <Compass className="h-16 w-16" strokeWidth={1.5} />
            </motion.div>
            <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 shadow-lg text-white">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </motion.div>

        {/* 404 Headline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-black uppercase tracking-widest text-[#3686FF] mb-4 shadow-sm">
            404 Error
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Lost in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Transit?</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            The page you are looking for has taken a flight to another destination. Let's get you back on track for your study abroad journey.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <button
            onClick={() => router.back()}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-[#3686FF] hover:shadow-md active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#3686FF] px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2970E6] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>

          <Link
            href="/matches"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md active:scale-98"
          >
            <GraduationCap className="h-4 w-4" />
            Find Universities
          </Link>
        </motion.div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />
      </div>
    </div>
  );
}
