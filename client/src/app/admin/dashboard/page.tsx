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
  EyeOff,
  Pencil,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  role: "STUDENT" | "ADMIN" | "SUPERADMIN";
  isActive: boolean;
  createdAt: string;
  profile: any;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [stats, setStats] = useState({ total: 0, student: 0, admin: 0 });
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Edit / Reset password / Delete state
  const [actionUser, setActionUser] = useState<UserData | null>(null);
  const [actionMode, setActionMode] = useState<"edit" | "delete" | "resetPassword" | null>(null);
  const [actionForm, setActionForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [submittingAction, setSubmittingAction] = useState(false);
  const [showActionPassword, setShowActionPassword] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const triggerToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

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
    if (session?.user && session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
      router.push("/");
      return;
    }
    if (session?.user && (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN")) {
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

  const handleEditAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionUser) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/users/${actionUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: actionForm.name,
          email: actionForm.email,
          phoneNumber: actionForm.phoneNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast("success", "User details updated successfully.");
        setActionMode(null);
        setActionUser(null);
        fetchUsers();
      } else {
        triggerToast("error", data.error || "Failed to update details.");
      }
    } catch {
      triggerToast("error", "Network error.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleResetPasswordAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionUser) return;
    if (!actionForm.password || actionForm.password.length < 8) {
      triggerToast("error", "Password must be at least 8 characters.");
      return;
    }
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/users/${actionUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: actionUser.name,
          email: actionUser.email,
          password: actionForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast("success", "Password reset successfully.");
        setActionMode(null);
        setActionUser(null);
      } else {
        triggerToast("error", data.error || "Failed to reset password.");
      }
    } catch {
      triggerToast("error", "Network error.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDeleteAction = async () => {
    if (!actionUser) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/users/${actionUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast("success", "User account removed.");
        setActionMode(null);
        setActionUser(null);
        fetchUsers();
      } else {
        triggerToast("error", data.error || "Failed to delete user.");
      }
    } catch {
      triggerToast("error", "Network error.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const toggleUserStatus = async (user: UserData) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          isActive: !user.isActive,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast("success", `User status updated to ${!user.isActive ? "Active" : "Suspended"}.`);
        fetchUsers();
      } else {
        triggerToast("error", data.error || "Failed to toggle status.");
      }
    } catch {
      triggerToast("error", "Network error.");
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
        <header className="h-[90px] bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 shadow-xs selection:bg-[#3366FF]/10 select-none">
          <div className="flex items-center gap-3.5 bg-slate-50/50 rounded-2xl px-5 h-[48px] border border-slate-200/50 w-full max-w-md focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all shadow-inner">
            <Search className="w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user records..."
              className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800 placeholder:text-slate-400/80"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 hover:border-blue-100/50 transition-all shadow-xs cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <div className="w-px h-5 bg-slate-100 mx-1.5" />
            </div>
            <div className="flex items-center gap-3.5">
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-900 leading-none mb-1.5">
                  {session?.user.name}
                </p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">
                    {session?.user.role === "SUPERADMIN" ? "Super Admin" : "System Admin"}
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[12px] flex items-center justify-center font-extrabold text-white text-md shadow-md shadow-blue-500/20 border border-blue-400/25">
                {session?.user.name?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 select-none">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                Global Users
              </h1>
              <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
                Platform directory, account provisioning, and administration controls.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToExcel}
                className="h-[48px] px-6 rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-[#3366FF] hover:border-blue-100 hover:shadow-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="h-[48px] px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
            {[
              {
                label: "Total Students",
                value: stats.student,
                sub: "+12.5% this month",
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-50/80 border border-blue-100/30",
              },
              {
                label: "System Admins",
                value: stats.admin,
                sub: "High integrity keys",
                icon: Award,
                color: "text-indigo-600",
                bg: "bg-indigo-50/80 border border-indigo-100/30",
              },
              {
                label: "Total Records",
                value: stats.total,
                sub: "Synced with server",
                icon: Globe,
                color: "text-emerald-600",
                bg: "bg-emerald-50/80 border border-emerald-100/30",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className="relative bg-white p-7 rounded-[28px] border border-slate-100/80 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.03)] group hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-5px_rgba(51,102,255,0.07)] hover:border-blue-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/3 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100/60 flex items-center gap-2 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100/70 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fafbfc]/50 select-none">
              <div className="flex items-center gap-3.5">
                <h2 className="font-extrabold text-slate-900 tracking-tight text-xl leading-none">
                  User Directory
                </h2>
                <span className="px-2.5 py-1 bg-blue-50 border border-blue-100/50 text-blue-600 rounded-lg text-[9px] font-black tracking-widest uppercase leading-none mt-0.5">
                  {filteredUsers.length} Records
                </span>
              </div>
              <button className="flex items-center gap-2 px-4.5 h-10 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-xs cursor-pointer">
                <Filter className="w-4 h-4 text-slate-400" />
                Filters
              </button>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              {filteredUsers.length === 0 ? (
                <div className="p-16 text-center select-none animate-in fade-in duration-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-[22px] flex items-center justify-center mx-auto mb-5 border border-slate-100 shadow-inner">
                    <UserCircle className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 mb-1.5">
                    No users found
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    Try adjusting your search filters.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Role</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Origin</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap pr-14">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/60 rounded-xl flex items-center justify-center font-extrabold text-blue-600 text-sm transition-transform group-hover:scale-105">
                              {user.name?.[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-none mb-1.5 group-hover:text-blue-600 transition-colors">
                                {user.name}
                              </p>
                              <p className="text-xs font-bold text-slate-400 leading-none">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                              <Mail className="w-4 h-4 text-slate-350 shrink-0" />
                              {user.email}
                            </div>
                            {user.phoneNumber && (
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Phone className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                                {user.phoneNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                              user.role === "SUPERADMIN"
                                ? "bg-amber-50 text-amber-600 border-amber-200/50"
                                : user.role === "ADMIN"
                                ? "bg-blue-50 text-[#3366FF] border-blue-200/30"
                                : "bg-slate-150 text-slate-600 border-slate-200/40"
                            }`}
                          >
                            {user.role === "SUPERADMIN" ? "SUPER ADMIN" : user.role}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-350" />
                            <span className="text-sm font-bold text-slate-700">
                              {user.profile?.nationality || "Global"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span
                            onClick={() => {
                              const canManage = isSuperAdmin || user.role === "STUDENT";
                              const isSelf = user.id === session?.user?.id;
                              if (canManage && !isSelf) {
                                toggleUserStatus(user);
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                              (isSuperAdmin || user.role === "STUDENT") && user.id !== session?.user?.id
                                ? "cursor-pointer hover:opacity-85"
                                : "opacity-75"
                            } ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                                : "bg-rose-50 text-rose-600 border-rose-200/50"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                            {user.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center justify-end gap-1.5 pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              title="View details"
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-400 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {(isSuperAdmin || user.role === "STUDENT") && user.id !== session?.user?.id && (
                              <>
                                <button
                                  onClick={() => {
                                    setActionUser(user);
                                    setActionForm({
                                      name: user.name,
                                      email: user.email,
                                      phoneNumber: user.phoneNumber || "",
                                      password: "",
                                    });
                                    setShowActionPassword(false);
                                    setActionMode("edit");
                                  }}
                                  title="Edit details"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-400 transition-all cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setActionUser(user);
                                    setActionForm((f) => ({ ...f, password: "" }));
                                    setShowActionPassword(false);
                                    setActionMode("resetPassword");
                                  }}
                                  title="Reset password"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 hover:bg-amber-500 hover:text-white hover:border-amber-500 text-slate-400 transition-all cursor-pointer"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setActionUser(user);
                                    setActionMode("delete");
                                  }}
                                  title="Delete user"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-slate-400 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-[#fafbfc]/50 flex items-center justify-between select-none text-[10px] font-black uppercase tracking-widest text-slate-400">
              <p>
                Showing {filteredUsers.length} records
              </p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
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
                  {isSuperAdmin ? (
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
                  ) : (
                    <div className="w-full h-12 bg-slate-100 border border-slate-200 rounded-xl px-4 flex items-center text-sm font-bold text-slate-500">
                      Student (Standard User Only)
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
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

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold transition-all animate-in slide-in-from-top-2 duration-300 ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {toast.msg}
          </div>
        )}

        {/* Action Modals (Edit User) */}
        {actionMode === "edit" && actionUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setActionMode(null); setActionUser(null); }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
                <h3 className="text-xl font-black">Edit User Details</h3>
                <p className="text-blue-100 text-xs mt-1">Editing account details for @{actionUser.username}</p>
                <button
                  onClick={() => { setActionMode(null); setActionUser(null); }}
                  className="absolute top-6 right-6 text-blue-100 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditAction} className="p-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={actionForm.name}
                    onChange={(e) => setActionForm({ ...actionForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={actionForm.email}
                    onChange={(e) => setActionForm({ ...actionForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="text"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={actionForm.phoneNumber}
                    onChange={(e) => setActionForm({ ...actionForm, phoneNumber: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {submittingAction ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Action Modals (Reset Password) */}
        {actionMode === "resetPassword" && actionUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setActionMode(null); setActionUser(null); }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 bg-amber-500 text-white relative">
                <h3 className="text-xl font-black">Reset password</h3>
                <p className="text-amber-100 text-xs mt-1">Set a secure password for @{actionUser.username}</p>
                <button
                  onClick={() => { setActionMode(null); setActionUser(null); }}
                  className="absolute top-6 right-6 text-amber-100 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleResetPasswordAction} className="p-8 space-y-4">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-amber-700">
                    The user will need to log in with this new password. Keep it secure and share it safely.
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <input
                      type={showActionPassword ? "text" : "password"}
                      required
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                      placeholder="Min. 8 characters"
                      value={actionForm.password}
                      onChange={(e) => setActionForm({ ...actionForm, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowActionPassword(!showActionPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showActionPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="w-full h-12 mt-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {submittingAction ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Reset Password"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Action Modals (Delete User) */}
        {actionMode === "delete" && actionUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setActionMode(null); setActionUser(null); }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 bg-rose-600 text-white relative">
                <h3 className="text-xl font-black">Remove User Account</h3>
                <p className="text-rose-100 text-xs mt-1">Permanently remove @{actionUser.username}</p>
                <button
                  onClick={() => { setActionMode(null); setActionUser(null); }}
                  className="absolute top-6 right-6 text-rose-100 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-rose-700 mb-1">Warning: Destructive action</p>
                    <p className="text-xs font-semibold text-rose-600">
                      User <span className="font-bold">{actionUser.name}</span> ({actionUser.email}) and all their profile matches, documents, and logs will be permanently deleted.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setActionMode(null); setActionUser(null); }}
                    className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAction}
                    disabled={submittingAction}
                    className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {submittingAction ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete User"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
