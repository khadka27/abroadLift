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
  LayoutDashboard,
  Home,
  Search,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/matches", label: "Start Matching" },
  { href: "/search", label: "University Search" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

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
                  className={`text-[16px] font-bold tracking-tight transition-all flex items-center gap-1.5 hover:text-[#3366FF] ${
                    scrolled ? "text-gray-900" : "text-gray-900"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}

            {isAdmin && (
              <li className="relative group py-4">
                <Link
                  href="/admin"
                  className={`text-[16px] font-black transition-all flex items-center gap-1.5 hover:text-blue-600! ${
                    scrolled ? "text-blue-600!" : "text-blue-700!"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Right actions (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4 sm:gap-6">
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 bg-[#3366FF] text-white font-bold px-[20px] py-[10px] rounded-2xl text-[15px] shadow-xl shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 hover:bg-[#254bdb]"
              >
                {session?.user?.image ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20">
                    <Image src={session.user.image} alt={session?.user?.name || "User"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="max-w-[120px] truncate">
                  {session?.user?.name || "My Profile"}
                </span>
              </Link>
            ) : (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-2 bg-[#3366FF] text-white font-bold px-[28px] py-[12px] rounded-2xl text-[15px] shadow-xl shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 hover:bg-[#254bdb]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
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

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full border-b border-gray-100 bg-white px-6 py-10 flex flex-col gap-6 shadow-2xl animate-fade-in-nav">
            {NAV_LINKS.map((l) => (
              <div key={l.label} className="flex flex-col gap-4">
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xl font-extrabold text-blue-700 hover:text-blue-600 transition-colors"
                >
                  {l.label}
                </Link>
              </div>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-3 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
              >
                {session?.user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <Image src={session.user.image} alt={session?.user?.name || "User"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span>{session?.user?.name || "My Profile"}</span>
              </Link>
            ) : (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
