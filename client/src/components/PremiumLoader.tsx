/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import Image from "next/image";

export default function PremiumLoader({ message = "Initializing Portal..." }: { message?: string }) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-[99999] bg-white" suppressHydrationWarning={true} />;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white overflow-hidden" suppressHydrationWarning={true}>
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-400/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-400/10 blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-[80px]" />
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-4 select-none z-10">
        {/* Animated SVG Loading Graphic */}
        <Image
          src="/loading (1).svg"
          alt="AbroadLift Loading..."
          width={260}
          height={260}
          className="object-contain w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]"
          unoptimized
          priority
        />

        {/* Brand logo & tagline */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-[#3686FF] via-[#3366FF] to-indigo-600 bg-clip-text text-transparent">
            AbroadLift
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
