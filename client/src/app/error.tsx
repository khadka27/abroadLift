"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronRight, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to the console or error tracking service
    console.error("[CRITICAL_SERVER_ERROR]", error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center p-6 md:p-12 overflow-hidden bg-gradient-to-br from-slate-50 via-rose-50/10 to-indigo-50/20 font-sans selection:bg-rose-500/20 selection:text-rose-600">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[15%] left-[10%] w-[320px] h-[320px] bg-rose-200/15 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] bg-indigo-200/15 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        {/* Animated Error Icon Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-indigo-500 rounded-full blur-2xl opacity-25 scale-125 animate-pulse" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-rose-100 bg-white/70 shadow-2xl shadow-rose-100/50 backdrop-blur-xl">
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="text-rose-500"
            >
              <AlertTriangle className="h-16 w-16" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-black uppercase tracking-widest text-rose-500 mb-4 shadow-sm">
            Server Error
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Unexpected <span className="bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">Turbulence</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Our system encountered an unexpected issue while planning your study abroad journey. Don&apos;t worry, your progress is safe.
          </p>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <button
            onClick={() => reset()}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#3686FF] px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2970E6] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Try Resetting
          </button>

          <Link
            href="/"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-[#3686FF] hover:shadow-md active:scale-98"
          >
            <Home className="h-4 w-4" />
            Go Back Home
          </Link>
        </motion.div>

        {/* Collapsible Diagnostics Accordion for Developers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 w-full text-left max-w-lg border border-slate-100 rounded-2xl bg-white/50 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50/50 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-slate-400" />
              Technical Diagnostics
            </span>
            {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-slate-100 bg-slate-900/5 text-slate-600 font-mono text-[11px] leading-relaxed break-all space-y-2 max-h-48 overflow-y-auto">
                  <p>
                    <span className="font-bold text-rose-500">Error:</span> {error.message || "Unknown error occurred"}
                  </p>
                  {error.digest && (
                    <p>
                      <span className="font-bold text-indigo-500">Digest ID:</span> {error.digest}
                    </p>
                  )}
                  <p>
                    <span className="font-bold text-slate-500">Time:</span> {new Date().toISOString()}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
