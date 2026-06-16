/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  PieChart,
  TrendingUp,
  Globe,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
  Award
} from "lucide-react";
import Link from "next/link";

export default function AdminSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
    if (session?.user?.role === "ADMIN") {
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
      <aside className="w-[280px] bg-slate-950 hidden md:flex flex-col text-slate-400 shrink-0 border-r border-slate-900 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white tracking-widest text-[13px]">
                ABROADLIFT
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest leading-none mt-0.5 uppercase italic">
                Admin Engine
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 mb-6 mt-4">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-600 mb-4 px-4">
            Core Modules
          </p>
          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className={`w-full h-12 flex items-center gap-4 px-5 rounded-2xl font-bold text-[13px] transition-all group overflow-hidden relative ${
                pathname === "/admin/dashboard"
                  ? "bg-indigo-500/10 text-white"
                  : "hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              {pathname === "/admin/dashboard" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgb(99,102,241)]" />
              )}
              <Users className={`w-4 h-4 ${pathname === "/admin/dashboard" ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"}`} />
              User Directory
            </Link>

            <Link
              href="/admin"
              className={`w-full h-12 flex items-center gap-4 px-5 rounded-2xl font-bold text-[13px] transition-all group overflow-hidden relative ${
                pathname === "/admin"
                  ? "bg-emerald-500/10 text-white"
                  : "hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              {pathname === "/admin" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgb(16,185,129)]" />
              )}
              <PieChart className={`w-4 h-4 ${pathname === "/admin" ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400"}`} />
              Student Central
            </Link>

            <button className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-900 hover:text-slate-200 rounded-2xl font-bold text-[13px] transition-all group">
              <TrendingUp className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              Market Trends
            </button>
            <Link
              href="/"
              className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-900 hover:text-slate-200 rounded-2xl font-bold text-[13px] transition-all group"
            >
              <Globe className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              View Site
            </Link>
          </nav>
        </div>

        <div className="px-6 mt-auto mb-8">
          <div className="h-px w-full bg-slate-900 mb-6" />
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-600 mb-4 px-4">
            System
          </p>
          <nav className="space-y-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-900 hover:text-slate-200 rounded-2xl font-bold text-[13px] transition-all group"
            >
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              System Setup
            </button>
            <button
              onClick={handleLogout}
              className="w-full h-12 flex items-center gap-4 px-5 group hover:bg-red-500/10 hover:text-red-400 rounded-2xl font-bold text-[13px] transition-all"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
              Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
          <div
            onClick={() => setShowSettingsModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <div className="relative w-full max-w-xl bg-white rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-slate-950 p-10 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h2 className="text-[26px] font-black text-white tracking-tightest leading-tight">
                  System Setup
                </h2>
                <p className="text-slate-400 text-sm font-bold mt-1">
                  Manage your administrative credentials
                </p>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all"
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
