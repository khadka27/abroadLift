"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Home,
  Search,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface SubLink {
  href: string;
  label: string;
  desc: string;
}

interface NavLink {
  href: string;
  label: string;
  hasDropdown?: boolean;
  sublinks?: SubLink[];
}

const NAV_LINKS: NavLink[] = [
  {
    href: "/search",
    label: "Find Programs",
    hasDropdown: true,
    sublinks: [
      {
        href: "/search",
        label: "University Search",
        desc: "Search over 15,000 global programs",
      },
      {
        href: "/matches",
        label: "AI Matcher",
        desc: "Get personalized university recommendations",
      },
    ],
  },
  {
    href: "#",
    label: "Tools & Resources",
    hasDropdown: true,
    sublinks: [
      {
        href: "/eligibility",
        label: "Eligibility Checker",
        desc: "Check your admission chances",
      },
      {
        href: "/costing",
        label: "Cost Estimator",
        desc: "Calculate your total study expenses",
      },
      {
        href: "/visa-rate",
        label: "Visa Success Rate",
        desc: "Check your visa approval chances",
      },
      {
        href: "/dashboard",
        label: "Student Dashboard",
        desc: "Manage your applications & profile",
      },
    ],
  },
  { href: "/scholarships", label: "Scholarships" },
];

const MOBILE_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/matches", label: "Matches", icon: Sparkles },
  { href: "/dashboard", label: "Stats", icon: LayoutGrid },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const mobileTabs = isAuthenticated
    ? MOBILE_TABS
    : MOBILE_TABS.map((tab) =>
        tab.href === "/profile"
          ? { ...tab, href: "/login", label: "Login" }
          : tab,
      );
  const activeMobileTabIndex = Math.max(
    mobileTabs.findIndex((tab) => tab.href === pathname),
    0,
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop & Mobile Top Bar (Logo Only on Mobile) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            : "bg-white py-5 border-b border-gray-50/50"
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group no-underline"
          >
            <div className="relative w-[140px] md:w-[160px] h-[40px] md:h-[45px] group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="AbroadLift Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Links (Hidden on Mobile) */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.label} className="relative group py-4">
                <Link
                  href={l.href}
                  className={`text-[15px] font-semibold tracking-tight transition-all flex items-center gap-1.5 hover:text-blue-600! ${
                    scrolled ? "text-blue-600!" : "text-blue-700!"
                  }`}
                >
                  {l.label}
                  {l.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
                        scrolled ? "text-blue-400!" : "text-blue-500!"
                      }`}
                    />
                  )}
                </Link>

                {l.hasDropdown && l.sublinks && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl p-4 min-w-[280px]">
                      {l.sublinks.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="flex flex-col p-4 rounded-2xl hover:bg-emerald-50/50 group/sub transition-all"
                        >
                          <span className="text-sm font-black text-gray-900 group-hover/sub:text-[#009dff] transition-colors">
                            {sub.label}
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {sub.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}

            {isAdmin && (
              <li className="relative group py-4">
                <Link
                  href="/admin"
                  className={`text-[15px] font-black transition-all flex items-center gap-1.5 hover:text-blue-600! ${
                    scrolled ? "text-blue-600!" : "text-blue-700!"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Right actions (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4 sm:gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`p-2 rounded-xl transition-all ${
                    scrolled
                      ? "text-blue-600! hover:bg-slate-50 hover:text-blue-700!"
                      : "text-blue-700! hover:bg-slate-50 hover:text-blue-600!"
                  }`}
                >
                  <User className="w-6 h-6 outline-none" strokeWidth={1.5} />
                </Link>

                <Link
                  href="/matches"
                  className="flex items-center gap-2 bg-[#3366FF] text-white font-bold px-7 py-3 rounded-2xl text-[15px] shadow-xl shadow-blue-500/25 hover:bg-[#2952CC] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-[#3366FF] text-white font-bold px-7 py-3 rounded-2xl text-[15px] shadow-xl shadow-blue-500/25 hover:bg-[#2952CC] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobileburger (Hidden by default, used for secondary menu if needed, but we'll focus on the bottom nav) */}
          <button
            className={`lg:hidden w-11 h-11 flex justify-center items-center rounded-2xl border transition-all shadow-sm bg-white border-gray-100 text-gray-900`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile drawer (Backup for deep links) */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full border-b border-gray-100 bg-white px-6 py-10 flex flex-col gap-6 shadow-2xl animate-fade-in-nav">
            {NAV_LINKS.map((l) => (
              <div key={l.label} className="flex flex-col gap-4">
                <Link
                  href={l.href}
                  onClick={() => !l.hasDropdown && setMobileOpen(false)}
                  className="text-xl font-extrabold text-blue-700! hover:text-blue-600! transition-colors"
                >
                  {l.label}
                </Link>
                {l.hasDropdown && l.sublinks && (
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-100">
                    {l.sublinks.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-base font-bold text-gray-700! hover:text-[#009dff]! transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {isAuthenticated ? (
              <Link
                href="/matches"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
      {/* Mobile Floating Bottom Nav */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[440px] z-50 h-20 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center justify-around px-2">
        {/* Animated Notch/Cutout (SVG for the smooth curve) */}
        <div
          className="absolute top-0 h-full transition-all duration-500 ease-out pointer-events-none"
          style={{
            left: `${activeMobileTabIndex * 20 + 10}%`,
            width: "20%",
            transform: "translateX(-50%)",
          }}
        >
          {/* The Notch SVG */}
          <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 w-[70px] h-[30px]">
            <svg
              viewBox="0 0 70 30"
              className="w-full h-full fill-white drop-shadow-[0_-5px_5px_rgba(0,0,0,0.02)]"
            >
              <path d="M0 30 C15 30 15 0 35 0 C55 0 55 30 70 30 L0 30 Z" />
            </svg>
            {/* The Indicator Dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(51,102,255,0.8)]" />
          </div>
        </div>

        {mobileTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="relative flex flex-col items-center justify-center w-1/5 h-full z-10"
            >
              <div
                className={`transition-all duration-500 ${
                  isActive
                    ? "text-[#3366FF] -translate-y-4 scale-110"
                    : "text-gray-400"
                }`}
              >
                <Icon
                  size={isActive ? 28 : 24}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>

              <span
                className={`text-[9px] font-bold absolute bottom-3 transition-all duration-300 ${
                  isActive
                    ? "text-[#3366FF] opacity-100 scale-100"
                    : "text-gray-400 opacity-0 scale-50"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
