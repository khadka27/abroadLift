/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Mail,
  Phone,
  Loader2,
  UserCircle,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Award,
  Globe,
  Download,
  Plus,
  X,
  PieChart,
  Bell,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
  profile: any;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [stats, setStats] = useState({ total: 0, student: 0, admin: 0 });
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Registration Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    role: "STUDENT",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login?callbackUrl=/admin/dashboard");
      return;
    }
    if (session?.user && session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    if (session?.user.role === "ADMIN") {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        const totals = {
          total: data.length,
          student: data.filter((u: UserData) => u.role === "STUDENT").length,
          admin: data.filter((u: UserData) => u.role === "ADMIN").length,
        };
        setStats(totals);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          phoneNumber: "",
          role: "STUDENT",
        });
        fetchUsers();
      } else {
        setErrorMsg(data.error || "Failed to register user");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const exportToExcel = () => {
    const headers = [
      "Name,Email,Username,Phone,Role,Nationality,CurrentCountry,RegisteredDate",
    ];
    const rows = users.map((u) => {
      return [
        u.name,
        u.email,
        u.username,
        u.phoneNumber || "N/A",
        u.role,
        u.profile?.nationality || "N/A",
        u.profile?.currentCountry || "N/A",
        new Date(u.createdAt).toLocaleDateString(),
      ]
        .map((val) => `"${val}"`)
        .join(",");
    });

    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `abroadlift_users_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading && status === "authenticated") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
        <header className="h-[90px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 h-[50px] border border-slate-200/50 w-full max-w-md focus-within:border-indigo-400 focus-within:bg-white transition-all shadow-sm">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Query user records..."
              className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">
                  {session?.user.name}
                </p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">
                    System Admin
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-[14px] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20 border border-indigo-400">
                {session?.user.name?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Global Users
              </h1>
              <p className="text-lg font-medium text-slate-500 mt-2">
                Management overview for all registered accounts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToExcel}
                className="h-[48px] px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm flex items-center gap-2.5 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="h-[48px] px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center gap-2.5 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Total Students",
                value: stats.student,
                sub: "+12.5% this month",
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                label: "System Admins",
                value: stats.admin,
                sub: "High integrity keys",
                icon: Award,
                color: "text-indigo-600",
                bg: "bg-indigo-100",
              },
              {
                label: "Total Records",
                value: stats.total,
                sub: "Synced with server",
                icon: Globe,
                color: "text-emerald-600",
                bg: "bg-emerald-100",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="relative bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="pt-5 border-t border-slate-50 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    {stat.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="font-black text-slate-900 tracking-tight text-xl">
                  User Directory
                </h2>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black tracking-widest uppercase">
                  {filteredUsers.length} Records
                </span>
              </div>
              <button className="flex items-center gap-2 px-4 h-10 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              {filteredUsers.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                    <UserCircle className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mb-2">
                    No users found
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    Try adjusting your search filters.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Role</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Origin</th>
                      <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 transition-transform group-hover:scale-105 group-hover:bg-indigo-100">
                              {user.name?.[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-tight mb-1">
                                {user.name}
                              </p>
                              <p className="text-xs font-bold text-slate-400">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <Mail className="w-4 h-4 text-slate-400" />
                              {user.email}
                            </div>
                            {user.phoneNumber && (
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {user.phoneNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                              user.role === "ADMIN"
                                ? "bg-indigo-50 text-indigo-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">
                              {user.profile?.nationality || "Global"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Showing {filteredUsers.length} records
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Live Sync Active
                </span>
              </div>
            </div>
          </motion.div>
        </div>


      {/* Modals using AnimatePresence for smooth mounting/unmounting */}
      <AnimatePresence>
        {/* Register Modal */}
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
          >
            <div
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 pb-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Add New User
                  </h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    Manually provision a student or admin account.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-500 transition-colors shadow-sm border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegister} className="p-8 space-y-6 bg-white">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-red-600">
                      {errorMsg}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Username"
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+1 234 567 890"
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Account Role
                  </label>
                  <select
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "STUDENT" | "ADMIN",
                      })
                    }
                  >
                    <option value="STUDENT">Student (Standard User)</option>
                    <option value="ADMIN">Admin (Dashboard Access)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                  >
                    {registering ? "Processing..." : "Create User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
          >
            <div
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-50 rounded-[32px] shadow-2xl border border-white"
            >
              <div className="bg-white p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-600">
                    {selectedUser.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedUser.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-black tracking-widest uppercase">
                        {selectedUser.role}
                      </span>
                      <p className="text-slate-500 text-sm font-bold">
                        @{selectedUser.username}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core Details */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <UserCircle className="w-4 h-4" /> Core Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Email</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Phone</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.phoneNumber || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Joined</span>
                        <span className="text-sm font-bold text-slate-800">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">ID</span>
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{selectedUser.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Demographics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Nationality</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.nationality || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Current Residence</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.currentCountry || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Date of Birth</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.dob || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">First Language</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.firstLanguage || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic History */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <PieChart className="w-4 h-4" /> Academic Background
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Highest Education</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.highestEducation || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">GPA</span>
                        <span className="text-sm font-black text-indigo-600">{selectedUser.profile?.gpa || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Passing Year</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.passingYear || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Study Gap / Backlogs</span>
                        <span className="text-sm font-bold text-slate-800">
                          {selectedUser.profile?.studyGap || 0} yrs / {selectedUser.profile?.backlogs || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Test Scores */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Award className="w-4 h-4" /> Test Scores
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">English Test</span>
                        <span className="text-sm font-bold text-slate-800">
                          {selectedUser.profile?.hasEnglishTest ? `${selectedUser.profile?.testType} (${selectedUser.profile?.englishScore})` : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-sm font-medium text-slate-500">Aptitude Test</span>
                        <span className="text-sm font-bold text-slate-800">{selectedUser.profile?.aptitudeTest || "NONE"}</span>
                      </div>
                      {selectedUser.profile?.aptitudeTest === "GRE" && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">GRE Score</span>
                          <span className="text-sm font-bold text-slate-800">
                            V: {selectedUser.profile.greVerbal} | Q: {selectedUser.profile.greQuant} | AWA: {selectedUser.profile.greAwa}
                          </span>
                        </div>
                      )}
                      {selectedUser.profile?.aptitudeTest === "GMAT" && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">GMAT Total</span>
                          <span className="text-sm font-bold text-slate-800">{selectedUser.profile.gmatTotal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
