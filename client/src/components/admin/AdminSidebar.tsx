/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  PieChart,
  Globe,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
  Award,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  UserCog,
  Crown
} from "lucide-react";
import Link from "next/link";

export default function AdminSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    if (session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN") {
      setProfileData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
    router.refresh();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileSuccess("Profile updated successfully!");
        setProfileData((prev) => ({ ...prev, password: "" })); // Clear password
      } else {
        setProfileError(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      setProfileError("Network error. Please try again.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <>
      <aside className="w-[285px] bg-[#fafbfc] hidden md:flex flex-col text-slate-500 shrink-0 border-r border-slate-100 h-screen sticky top-0 overflow-y-auto selection:bg-[#3366FF]/10 select-none">
        {/* Branding header */}
        <div className="p-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/25">
              <LayoutDashboard className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-wider text-sm leading-none">
                ABROADLIFT
              </span>
              <span className="text-[9px] font-black tracking-widest leading-none mt-1.5 uppercase shrink-0">
                {isSuperAdmin ? (
                  <span className="text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md shadow-xs shadow-amber-500/5">
                    ⚡ Super Admin
                  </span>
                ) : (
                  <span className="text-slate-400 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md">
                    Enterprise Admin
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Core Modules */}
        <div className="px-5 mb-6 mt-4">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-400/80 mb-3.5 px-4.5">
            Core Modules
          </p>
          <nav className="space-y-1">
            {[
              { href: "/admin", label: "Dashboard Overview", icon: PieChart, activeMatch: (p: string) => p === "/admin" },
              { href: "/admin/dashboard", label: "User Management", icon: LayoutDashboard, activeMatch: (p: string) => p === "/admin/dashboard" },
              { href: "/admin/students", label: "Student Registry", icon: Users, activeMatch: (p: string) => p.startsWith("/admin/students") },
              { href: "/admin/applications", label: "Applications", icon: GraduationCap, activeMatch: (p: string) => p.startsWith("/admin/applications") },
              { href: "/admin/visa", label: "Visa Assessments", icon: ShieldCheck, activeMatch: (p: string) => p.startsWith("/admin/visa") },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = link.activeMatch(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full h-12 flex items-center gap-3.5 px-4.5 rounded-2xl font-bold text-[13px] border transition-all duration-200 group overflow-hidden relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/5 text-[#3366FF] border-blue-500/10 shadow-xs"
                      : "hover:bg-slate-50/70 border-transparent text-slate-500 hover:text-slate-900 hover:translate-x-1"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                  )}
                  <Icon
                    className={`w-[17px] h-[17px] transition-all duration-300 ${
                      isActive ? "text-blue-600 scale-105" : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System & Tools */}
        <div className="px-5 mb-6 mt-2">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-400/80 mb-3.5 px-4.5">
            System & Tools
          </p>
          
          {isSuperAdmin && (
            <nav className="space-y-1 mb-3.5">
              <Link
                href="/admin/manage-admins"
                className={`w-full h-12 flex items-center gap-3.5 px-4.5 rounded-2xl font-bold text-[13px] border transition-all duration-200 group overflow-hidden relative ${
                  pathname.startsWith("/admin/manage-admins")
                    ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/5 text-[#3366FF] border-blue-500/10 shadow-xs"
                    : "hover:bg-slate-50/70 border-transparent text-slate-500 hover:text-slate-900 hover:translate-x-1"
                }`}
              >
                {pathname.startsWith("/admin/manage-admins") && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                )}
                <UserCog
                  className={`w-[17px] h-[17px] transition-all duration-300 ${
                    pathname.startsWith("/admin/manage-admins")
                      ? "text-blue-600 scale-105"
                      : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                  }`}
                />
                Manage Admins
                <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/10 tracking-wider">
                  SA
                </span>
              </Link>
            </nav>
          )}

          <nav className="space-y-1">
            {[
              { href: "/admin/reports", label: "Reports & Exports", icon: FileSpreadsheet, activeMatch: (p: string) => p.startsWith("/admin/reports") },
              { href: "/admin/settings", label: "Platform Settings", icon: Settings, activeMatch: (p: string) => p.startsWith("/admin/settings") },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = link.activeMatch(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full h-12 flex items-center gap-3.5 px-4.5 rounded-2xl font-bold text-[13px] border transition-all duration-200 group overflow-hidden relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/5 text-[#3366FF] border-blue-500/10 shadow-xs"
                      : "hover:bg-slate-50/70 border-transparent text-slate-500 hover:text-slate-900 hover:translate-x-1"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                  )}
                  <Icon
                    className={`w-[17px] h-[17px] transition-all duration-300 ${
                      isActive ? "text-blue-600 scale-105" : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/"
              className="w-full h-12 flex items-center gap-3.5 px-4.5 hover:bg-slate-50/70 border border-transparent hover:text-slate-900 text-slate-500 rounded-2xl font-bold text-[13px] transition-all group hover:translate-x-1"
            >
              <Globe className="w-[17px] h-[17px] text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
              View Live Site
            </Link>
          </nav>
        </div>

        {/* User profile actions */}
        <div className="px-5 mt-auto mb-8">
          <div className="h-px w-full bg-slate-100/70 mb-5" />
          <nav className="space-y-1">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full h-12 flex items-center gap-3.5 px-4.5 hover:bg-slate-50/70 text-slate-500 hover:text-slate-900 rounded-2xl font-bold text-[13px] transition-all group hover:translate-x-1 cursor-pointer"
            >
              <Settings className="w-[17px] h-[17px] text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full h-12 flex items-center gap-3.5 px-4.5 group hover:bg-rose-50/50 text-slate-500 hover:text-rose-600 rounded-2xl font-bold text-[13px] transition-all hover:translate-x-1 cursor-pointer"
            >
              <LogOut className="w-[17px] h-[17px] text-slate-400 group-hover:text-rose-500 group-hover:scale-110 transition-all duration-300" />
              Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Settings Modal - Kept for My Profile */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
          <div
            onClick={() => setShowSettingsModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <div className="relative w-full max-w-xl bg-white rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-[26px] font-black text-white tracking-tightest leading-tight">
                  Admin Profile
                </h2>
                <p className="text-slate-400 text-sm font-bold mt-1">
                  Manage your personal credentials
                </p>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProfile} className="p-10 space-y-6 bg-white">
              {profileError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500">
                    {profileError}
                  </span>
                </div>
              )}
              {profileSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">
                    {profileSuccess}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Admin Name"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Phone String
                  </label>
                  <input
                    type="text"
                    placeholder="+1 234 567 890"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Digital Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  New Secure Password <span className="text-slate-300 normal-case tracking-normal font-medium">(Leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                  value={profileData.password}
                  onChange={(e) =>
                    setProfileData({ ...profileData, password: e.target.value })
                  }
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full h-14 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                  {updatingProfile ? "Updating Profile..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
