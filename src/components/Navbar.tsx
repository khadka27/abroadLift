"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
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

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'translate-y-0' : 'translate-y-0'} ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group no-underline"
          >
            <div className="relative w-[160px] h-[45px] group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="AbroadLift Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.label} className="relative group py-4">
                <Link
                  href={l.href}
                  className={`text-[15px] font-bold transition-all flex items-center gap-1.5 hover:text-[#009dff]! ${
                    scrolled ? "text-blue-600!" : "text-blue-700!"
                  }`}
                >
                  {l.label}
                  {l.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform group-hover:rotate-180 ${scrolled ? "text-blue-400!" : "text-blue-500!"}`}
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

          {/* Right actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/profile"
              className={`p-2 transition-colors ${scrolled ? "text-blue-600! hover:text-blue-700!" : "text-blue-700! hover:text-blue-600!"}`}
            >
              <User className="w-6 h-6" strokeWidth={2} />
            </Link>

            <Link
              href="/register"
              className="hidden md:flex items-center gap-2 bg-[#3366FF] text-white font-bold px-7 py-3 rounded-2xl text-[15px] shadow-xl shadow-blue-500/25 hover:bg-[#2952CC] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile burger */}
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
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full border-b border-gray-100 bg-white px-6 py-10 flex flex-col gap-6 shadow-2xl animate-fade-in">
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
                        className="text-base font-bold text-blue-800/50 hover:text-[#009dff]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-xl font-extrabold text-blue-700! hover:text-blue-600! transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                Admin Panel
              </Link>
            )}
            <div className="h-px bg-gray-100 my-2" />
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
