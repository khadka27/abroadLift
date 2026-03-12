"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Rocket, GraduationCap, User, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/matches", label: "University Finder" },
  { href: "/eligibility", label: "Eligibility Hub" },
  { href: "/costing", label: "Cost Estimator" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group no-underline"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#17a38b] to-[#128a7e] flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <span className="font-black text-xl tracking-tight text-gray-900 group-hover:text-teal-700 transition-colors">
                NextDegree
              </span>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden lg:flex items-center gap-2 list-none m-0 p-0">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`text-[14px] font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                      pathname === l.href
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse hidden sm:block" />
            ) : session ? (
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 text-[14px] font-bold text-gray-700 px-4 py-2.5 rounded-2xl bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
                  {session.user?.name?.[0].toUpperCase() || "U"}
                </div>
                <span>Profile</span>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-[14px] font-bold text-gray-600 hover:text-gray-900 px-4 py-2.5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-[14px] font-bold text-white px-5 py-2.5 rounded-2xl bg-gray-900 hover:bg-black hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                >
                  Join NextDegree
                </Link>
              </div>
            )}

            <Link
              href="/matches"
              className="hidden md:flex items-center gap-2 text-[14px] font-bold text-white px-5 py-2.5 rounded-2xl bg-[#3366FF] hover:bg-[#2952CC] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 shadow-sm"
            >
              <Rocket className="w-4 h-4" /> Go to Finder
            </Link>

            {/* Mobile burger */}
            <button
              className="lg:hidden w-10 h-10 flex justify-center items-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-2 shadow-xl">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold text-gray-600 hover:text-gray-900 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            
            {session ? (
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-sm font-bold text-gray-700 px-4 py-3.5 rounded-xl bg-gray-100"
              >
                <User className="w-4 h-4" /> My Profile
              </Link>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-gray-600 px-4 py-3.5 border border-gray-200 rounded-xl"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-white px-4 py-3.5 rounded-xl bg-gray-900"
                >
                  Create Account
                </Link>
              </div>
            )}

            <Link
              href="/matches"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-bold text-white px-5 py-3.5 rounded-xl bg-[#3366FF] hover:bg-[#2952CC] mt-2 shadow-md"
            >
              <GraduationCap className="w-5 h-5" /> Find Universities
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
