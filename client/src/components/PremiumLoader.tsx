"use client";

import React from "react";
import { Plane } from "lucide-react";

export default function PremiumLoader({ message = "Initializing Portal..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#1e40af] text-white overflow-hidden">
      {/* CSS Animations */}
      <style>{`
        @keyframes globe-scroll {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(-150px);
          }
        }
        @keyframes orbit-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.02);
          }
        }
        .animate-globe-scroll {
          animation: globe-scroll 16s linear infinite;
        }
        .animate-orbit-spin {
          animation: orbit-spin 4s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative flex items-center justify-center w-full max-w-4xl px-4 select-none">
        {/* Large semi-transparent background letters like SFO and JFK */}
        <div className="absolute left-10 md:left-20 text-6xl md:text-[120px] font-black text-white/5 tracking-wider font-poppins pointer-events-none uppercase">
          Abroad
        </div>
        <div className="absolute right-10 md:right-20 text-6xl md:text-[120px] font-black text-white/5 tracking-wider font-poppins pointer-events-none uppercase">
          Lift
        </div>

        {/* Center Globe & Plane Orbit Area */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          {/* Outer Orbit Path Line */}
          <div className="absolute w-[200px] h-[200px] rounded-full border border-white/10" />

          {/* Plane Orbiting Group */}
          <div className="absolute w-[200px] h-[200px] animate-orbit-spin">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45">
              <Plane className="w-6 h-6 text-white fill-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
            </div>
            {/* Orbit trail */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="50"
                fill="none"
                stroke="url(#trail-grad)"
                strokeWidth="1.5"
                strokeDasharray="180 180"
              />
              <defs>
                <linearGradient id="trail-grad" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 3D Earth Globe SVG */}
          <div className="w-36 h-36 relative flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-48 h-48 absolute z-20 overflow-visible animate-pulse-glow" style={{ animationDuration: '6s' }}>
              <defs>
                {/* Dot pattern for continents */}
                <pattern id="dot-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.3" fill="#60a5fa" />
                </pattern>

                {/* Clip path to keep scrolling continents within the sphere */}
                <clipPath id="globe-clip">
                  <circle cx="80" cy="80" r="60" />
                </clipPath>

                {/* Flat map of continents, filled with dot pattern */}
                <g id="dotted-continents" fill="url(#dot-pattern)">
                  {/* North America */}
                  <path d="M12,42 C15,37 29,34 35,40 C39,44 42,37 45,47 C47,57 39,67 35,72 C31,77 22,67 17,64 C12,62 9,52 12,42 Z" />
                  {/* South America */}
                  <path d="M35,72 C39,77 42,87 42,97 C42,107 37,117 35,127 C33,122 27,107 25,97 C23,87 29,77 35,72 Z" />
                  {/* Greenland */}
                  <path d="M39,22 C43,20 49,24 47,28 C45,32 37,30 39,22 Z" />
                  {/* Europe & Asia */}
                  <path d="M72,32 C82,27 92,22 107,27 C122,32 132,42 127,57 C122,72 107,77 97,72 C87,67 77,70 72,62 C67,54 62,50 67,40 C72,30 67,34 72,32 Z" />
                  {/* Africa */}
                  <path d="M72,62 C77,70 85,74 85,87 C85,100 77,107 72,112 C67,107 57,97 55,87 C53,77 65,70 72,62 Z" />
                  {/* Australia */}
                  <path d="M112,97 C117,94 125,97 127,102 C129,107 122,114 117,114 C112,114 109,107 112,97 Z" />
                </g>
              </defs>

              {/* Sea/Ocean sphere background */}
              <circle cx="80" cy="80" r="60" fill="url(#ocean-gradient)" stroke="rgba(96, 165, 250, 0.2)" strokeWidth="1" />
              <radialGradient id="ocean-gradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              {/* Scrolling Dotted Continents */}
              <g clipPath="url(#globe-clip)">
                <g className="animate-globe-scroll">
                  <use href="#dotted-continents" x="0" />
                  <use href="#dotted-continents" x="150" />
                </g>
              </g>

              {/* 3D Sphere shadow overlay */}
              <circle cx="80" cy="80" r="60" fill="url(#sphere-shadow)" pointerEvents="none" />
              <radialGradient id="sphere-shadow" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(2, 6, 23, 0.15)" />
                <stop offset="100%" stopColor="rgba(2, 6, 23, 0.75)" />
              </radialGradient>

              {/* Orbiting connection arcs wrapping around the globe */}
              <g fill="none" strokeWidth="1.2" opacity="0.8" className="overflow-visible">
                {/* Path 1: Front-top arc */}
                <path d="M 32,55 Q 80,10 128,55" stroke="#93c5fd" />
                <circle cx="32" cy="55" r="2.5" fill="#93c5fd" />
                <circle cx="128" cy="55" r="2.5" fill="#93c5fd" />

                {/* Path 2: Bottom-front arc */}
                <path d="M 28,105 Q 80,150 132,105" stroke="#60a5fa" />
                <circle cx="28" cy="105" r="2.5" fill="#60a5fa" />
                <circle cx="132" cy="105" r="2.5" fill="#60a5fa" />

                {/* Path 3: Left-vertical arc */}
                <path d="M 45,30 Q 15,80 45,130" stroke="#3b82f6" />
                <circle cx="45" cy="30" r="2.5" fill="#3b82f6" />
                <circle cx="45" cy="130" r="2.5" fill="#3b82f6" />
                
                {/* Path 4: Right-vertical arc */}
                <path d="M 115,30 Q 145,80 115,130" stroke="#2563eb" />
                <circle cx="115" cy="30" r="2.5" fill="#2563eb" />
                <circle cx="115" cy="130" r="2.5" fill="#2563eb" />

                {/* Path 5: Tilted center loop (like in the image) */}
                <path d="M 20,80 C 40,30 120,40 140,80 C 120,130 40,120 20,80 Z" stroke="#3b82f6" strokeDasharray="3,3" opacity="0.5" />
              </g>

              {/* Dotted Grid lines overlay */}
              <g opacity="0.15" fill="none" stroke="#93c5fd" strokeWidth="0.8">
                {/* Latitudes */}
                <ellipse cx="80" cy="80" rx="60" ry="20" strokeDasharray="1, 5" strokeLinecap="round" />
                <ellipse cx="80" cy="80" rx="60" ry="40" strokeDasharray="1, 5" strokeLinecap="round" />
                
                {/* Longitudes */}
                <ellipse cx="80" cy="80" rx="20" ry="60" strokeDasharray="1, 5" strokeLinecap="round" />
                <ellipse cx="80" cy="80" rx="40" ry="60" strokeDasharray="1, 5" strokeLinecap="round" />
              </g>

              {/* Outer Ring Glow */}
              <circle cx="80" cy="80" r="60.5" fill="none" stroke="rgba(147, 197, 253, 0.4)" strokeWidth="1" />
            </svg>
          </div>

        </div>
      </div>

      {/* Brand logo & tagline */}
      <div className="mt-8 flex flex-col items-center gap-2 relative z-20">
        <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent font-poppins">
          AbroadLift
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-blue-300/80 font-bold uppercase tracking-widest">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
