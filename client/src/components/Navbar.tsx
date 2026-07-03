"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
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
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 pt-4 px-4 sm:px-6 lg:px-12`}
      >
        <div 
          className={`max-w-[1400px] mx-auto flex items-center justify-between px-5 py-3 lg:px-8 transition-all duration-500 rounded-full ${
            scrolled
              ? "bg-white/85 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
              : "bg-transparent py-4"
          }`}
        >
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
          <ul className="hidden lg:flex items-center gap-10 list-none m-0 p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.label} className="relative group">
                <Link
                  href={l.href}
                  className={`text-[15px] font-bold tracking-tight transition-all flex items-center gap-1.5 hover:text-[#3366FF] ${
                    pathname === l.href ? "text-[#3366FF]" : "text-gray-800"
                  }`}
                >
                  {l.label}
                </Link>
                {/* Active indicator */}
                {pathname === l.href && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3366FF]" />
                )}
              </li>
            ))}

            {isAdmin && (
              <li className="relative group">
                <Link
                  href="/admin"
                  className={`text-[15px] font-black transition-all flex items-center gap-1.5 hover:text-[#3366FF] ${
                    pathname === "/admin" ? "text-[#3366FF]" : "text-gray-800"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
                {pathname === "/admin" && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3366FF]" />
                )}
              </li>
            )}
          </ul>

          {/* Right actions (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4 sm:gap-5">
            {isAuthenticated ? (
              <Link
                href="/dashboard?tab=profile"
                className="flex items-center gap-3 bg-white border border-gray-100 text-gray-800 font-bold px-[20px] py-[10px] rounded-full text-[14px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group hover:border-blue-100"
              >
                {session?.user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 group-hover:border-blue-200 transition-colors">
                    <Image src={session.user.image} alt={session?.user?.name || "User"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                    <User className="w-4 h-4 text-[#3366FF]" />
                  </div>
                )}
                <span className="max-w-[120px] truncate group-hover:text-[#3366FF] transition-colors">
                  {session?.user?.name || "My Profile"}
                </span>
              </Link>
            ) : (
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-2 bg-[#3366FF] text-white font-bold px-[30px] py-[12px] rounded-full text-[15px] shadow-[0_8px_20px_rgb(51,102,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 hover:bg-[#254bdb]"
              >
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden w-12 h-12 flex justify-center items-center rounded-full border transition-all ${
              scrolled ? "bg-white border-gray-100 shadow-sm" : "bg-white/80 backdrop-blur-md border-white/50 shadow-sm"
            } text-gray-900`}
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
          <div className="lg:hidden absolute top-[110%] left-4 right-4 rounded-3xl border border-white/50 bg-white/95 backdrop-blur-2xl px-6 py-8 flex flex-col gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in slide-in-from-top-4 fade-in duration-300">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`text-xl font-extrabold transition-colors ${
                  pathname === l.href ? "text-[#3366FF]" : "text-gray-800 hover:text-[#3366FF]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
               <Link
               href="/admin"
               onClick={() => setMobileOpen(false)}
               className={`text-xl font-extrabold transition-colors flex items-center gap-2 ${
                 pathname === "/admin" ? "text-[#3366FF]" : "text-gray-800 hover:text-[#3366FF]"
               }`}
             >
               <LayoutDashboard className="w-5 h-5" />
               Admin
             </Link>
            )}
            
            <div className="h-px bg-gray-100/80 my-2" />
            
            {isAuthenticated ? (
              <Link
                href="/dashboard?tab=profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-100 text-gray-900 font-bold px-6 py-4 rounded-full"
              >
                {session?.user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <Image src={session.user.image} alt={session?.user?.name || "User"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <User className="w-4 h-4 text-[#3366FF]" />
                  </div>
                )}
                <span>{session?.user?.name || "My Profile"}</span>
              </Link>
            ) : (
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(pathname)}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-full shadow-[0_10px_30px_rgb(51,102,255,0.3)]"
              >
                Sign Up
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
