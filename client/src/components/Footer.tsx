"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // Hide footer on admin routes or full-screen wizard pages if required
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-slate-50 relative overflow-hidden pt-6">
      {/* 1. Organic Multi-Layer Top Wave Curve SVG */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mb-1 select-none pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto min-h-[45px] object-cover"
          preserveAspectRatio="none"
        >
          {/* Subtle translucent back wave */}
          <path
            d="M0,35 C320,85 640,-5 960,45 C1280,95 1380,15 1440,25 L1440,100 L0,100 Z"
            fill="#5B6CF9"
            opacity="0.3"
          />
          {/* Main solid periwinkle wave */}
          <path
            d="M0,55 C280,10 560,75 840,35 C1120,-5 1320,55 1440,45 L1440,100 L0,100 Z"
            fill="#5B6CF9"
          />
        </svg>
      </div>

      {/* 2. Main Periwinkle Blue Banner Container */}
      <div className="w-full bg-[#5B6CF9] text-white py-14 px-6 md:px-12 lg:px-20 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
          {/* Brand Logo & Description */}
          <div className="space-y-4 max-w-xs shrink-0">
            <Link href="/" className="inline-block group">
              <div className="relative w-[180px] h-[45px] bg-white/95 px-3 py-1.5 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="AbroadLift Logo"
                  width={160}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-xs font-medium text-white/80 leading-relaxed">
              AI-driven study-abroad guidance, college matching, financial estimators, and visa roadmaps built for ambitious global students.
            </p>
          </div>

          {/* 3 Navigation Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 w-full lg:w-auto">
            {/* Column 1: Create free account / Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm sm:text-[15px] tracking-wide">
                Create free account
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-medium text-white/80">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="hover:text-white transition-colors">
                    Find Universities
                  </Link>
                </li>
                <li>
                  <Link href="/costing" className="hover:text-white transition-colors">
                    Pricing & Budget
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    Search Programs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm sm:text-[15px] tracking-wide">
                Resources
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-medium text-white/80">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Student Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="hover:text-white transition-colors">
                    AI Match Engine
                  </Link>
                </li>
                <li>
                  <Link href="/costing" className="hover:text-white transition-colors">
                    Our Technology
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm sm:text-[15px] tracking-wide">
                Support
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-medium text-white/80">
                <li>
                  <Link href="/dashboard?tab=visa-assistance" className="hover:text-white transition-colors">
                    Visa Assistance
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Off-White Bar */}
      <div className="w-full bg-[#E5E8F3] py-4 px-6 md:px-12 lg:px-20 border-t border-slate-300/40 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <p className="tracking-tight">
            © {year} AbroadLift. All Rights Reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-slate-600">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 fill-current stroke-none" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 fill-current stroke-none" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 fill-current stroke-none" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
