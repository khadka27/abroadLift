"use client";

import { signOut, useSession } from "next-auth/react";
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
  Settings,
  Bell,
} from "lucide-react";
interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
  profile: {
    nationality: string | null;
    currentCountry: string | null;
  } | null;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
    router.refresh();
  };
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, student: 0, admin: 0 });

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
      router.push("/login");
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
    setError("");
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
        setError(data.error || "Failed to register user");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const exportToExcel = () => {
    // Generate CSV content
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
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-slate-900 hidden md:flex flex-col text-slate-400">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
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

        <div className="px-6 mb-6">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-600 mb-4 px-4">
            Menu Section
          </p>
          <nav className="space-y-1.5">
            <button className="w-full h-12 flex items-center gap-4 px-5 bg-indigo-500/10 text-white rounded-[16px] font-bold text-[13px] transition-all group overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
              <Users className="w-4 h-4 text-indigo-400" />
              User Directory
            </button>
            <button className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-800/50 hover:text-slate-200 rounded-[16px] font-bold text-[13px] transition-all">
              <PieChart className="w-4 h-4 text-slate-500" />
              Analytics
            </button>
            <button className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-800/50 hover:text-slate-200 rounded-[16px] font-bold text-[13px] transition-all">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Market Trends
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-800/50 hover:text-slate-200 rounded-[16px] font-bold text-[13px] transition-all"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              View Site
            </button>
          </nav>
        </div>

        <div className="px-6 mt-auto mb-8">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-600 mb-4 px-4">
            Management
          </p>
          <nav className="space-y-1.5">
            <button className="w-full h-12 flex items-center gap-4 px-5 hover:bg-slate-800/50 hover:text-slate-200 rounded-[16px] font-bold text-[13px] transition-all">
              <Settings className="w-4 h-4 text-slate-500" />
              System Setup
            </button>
            <button
              onClick={handleLogout}
              className="w-full h-12 flex items-center gap-4 px-5 group hover:bg-red-500/10 hover:text-red-400 rounded-[16px] font-bold text-[13px] transition-all"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
              Sign out
            </button>
          </nav>
        </div>

        <div className="p-6 m-6 bg-slate-800/50 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] font-black text-white tracking-tight uppercase italic">
              Growth Pack
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-4">
            Optimize your data processing workflow with AI intelligence.
          </p>
          <button className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-black/20">
            UPGRADE PRO
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-[90px] bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 h-[50px] border border-slate-200/50 w-full max-w-md focus-within:border-indigo-400 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Query student records..."
              className="bg-transparent text-[13px] font-bold outline-none w-full text-slate-800 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-500 transition-all">
                <Bell className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[13px] font-black text-slate-900 tracking-tight leading-none">
                  {session?.user.name}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none">
                    System Admin
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20 border-2 border-white">
                {session?.user.name?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-[28px] font-black text-slate-900 tracking-tightest leading-tight">
                Infrastructure Control
              </h1>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Management overview for study abroad student ecosystem
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToExcel}
                className="h-[50px] px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-[13px] flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export Table
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="h-[50px] px-6 rounded-2xl bg-indigo-600 text-white font-black text-[13px] flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Register User
              </button>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "Total Students",
                value: stats.student,
                sub: "+12.5% vs last month",
                icon: Users,
                color: "text-blue-500",
                light: "bg-blue-500/10",
                border: "border-blue-200/50",
              },
              {
                label: "Admin Access",
                value: stats.admin,
                sub: "High integrity keys",
                icon: Award,
                color: "text-indigo-500",
                light: "bg-indigo-500/10",
                border: "border-indigo-200/50",
              },
              {
                label: "Data Records",
                value: stats.total,
                sub: "Synced with server",
                icon: Globe,
                color: "text-emerald-500",
                light: "bg-emerald-500/10",
                border: "border-emerald-200/50",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-white p-8 rounded-[40px] border ${stat.border} shadow-sm group hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 ${stat.light} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="pt-5 border-t border-slate-50 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-bold text-slate-500">
                    {stat.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[45px] border border-slate-200 overflow-hidden shadow-sm shadow-slate-200/50">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-6">
                <h2 className="font-black text-slate-900 tracking-tight text-xl">
                  Operational Directory
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                    {filteredUsers.length} Active Records
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2.5 px-5 h-[42px] border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm">
                  <Filter className="w-3.5 h-3.5" />
                  Engine Filters
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Identified Student
                    </th>
                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Digital Contact
                    </th>
                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Verification
                    </th>
                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Origin
                    </th>
                    <th className="px-10 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Control
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-all group"
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                            {user.name?.[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1.5">
                              {user.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[9px] font-bold text-slate-500 tracking-wide">
                                ID: {user.id.slice(0, 8)}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                @{user.username}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {user.phoneNumber || "Not provided"}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border shadow-sm ${
                            user.role === "ADMIN"
                              ? "bg-indigo-500 text-white border-indigo-400"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="text-[13px] font-bold text-slate-800">
                            {user.profile?.nationality || "Global User"}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center justify-center gap-2.5">
                          <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-slate-200 shadow-sm">
                            <Award className="w-[18px] h-[18px]" />
                          </button>
                          <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-slate-200 shadow-sm">
                            <Trash2 className="w-[18px] h-[18px]" />
                          </button>
                          <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
                            <MoreVertical className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-10 text-center bg-white">
                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                  <UserCircle className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-lg font-black text-slate-900 uppercase italic">
                  Missing Operational Records
                </p>
                <p className="text-sm font-bold text-slate-400 mt-2">
                  Adjust your query engine parameters to find specific student
                  entities.
                </p>
              </div>
            )}

            <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                AbroadLift Infrastructure Management v2.0
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">
                  SERVER LINK STABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-0">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <div className="relative w-full max-w-xl bg-white rounded-[50px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-slate-900 p-10 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h2 className="text-[26px] font-black text-white tracking-tightest leading-tight">
                  Register Entity
                </h2>
                <p className="text-slate-400 text-sm font-bold mt-1">
                  Manual system enrollment for students
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-12 h-12 flex items-center justify-center rounded-3xl bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRegister} className="p-10 space-y-6 bg-white">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500">
                    {error}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Full Identity
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Smith"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Assigned Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="johnny_s"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
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
                  placeholder="john@example.com"
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Infrastructure Role
                </label>
                <select
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-sm font-bold outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "STUDENT" | "ADMIN",
                    })
                  }
                >
                  <option value="STUDENT">STUDENT (Public User)</option>
                  <option value="ADMIN">ADMIN (System Controller)</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={registering}
                  className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-[24px] font-black text-[15px] uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                  {registering
                    ? "Initializing Record..."
                    : "Confirm Enrollment"}
                </button>
                <p className="text-center text-[11px] font-bold text-slate-400 mt-6 uppercase tracking-widest">
                  Global Audit Trail Applied to This Entry
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
