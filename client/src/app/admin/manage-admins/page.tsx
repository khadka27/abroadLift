"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldAlert,
  Crown,
} from "lucide-react";
import { format } from "date-fns";

interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
}

type ModalMode = "add" | "edit" | "delete" | "resetPassword" | null;

const inputCls =
  "w-full h-12 bg-slate-50/50 border border-slate-200/80 rounded-2xl px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-300";

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
  });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      } else {
        showToast("error", "Failed to load admins.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const openAdd = () => {
    setForm({ name: "", email: "", username: "", phoneNumber: "", password: "" });
    setShowPassword(false);
    setModalMode("add");
  };

  const openEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setForm({
      name: admin.name,
      email: admin.email,
      username: admin.username,
      phoneNumber: admin.phoneNumber || "",
      password: "",
    });
    setShowPassword(false);
    setModalMode("edit");
  };

  const openDelete = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode("delete");
  };

  const openResetPassword = (admin: Admin) => {
    setSelectedAdmin(admin);
    setForm((f) => ({ ...f, password: "" }));
    setShowPassword(false);
    setModalMode("resetPassword");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAdmin(null);
  };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.username || !form.password) {
      showToast("error", "All fields except phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Admin account created successfully.");
        closeModal();
        fetchAdmins();
      } else {
        showToast("error", data.error || "Failed to create admin.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedAdmin || !form.name || !form.email) {
      showToast("error", "Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/admins/${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Admin details updated.");
        closeModal();
        fetchAdmins();
      } else {
        showToast("error", data.error || "Failed to update admin.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedAdmin || !form.password || form.password.length < 8) {
      showToast("error", "Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/admins/${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedAdmin.name,
          email: selectedAdmin.email,
          phoneNumber: selectedAdmin.phoneNumber,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Password reset successfully.");
        closeModal();
      } else {
        showToast("error", data.error || "Failed to reset password.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/admins/${selectedAdmin.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Admin account removed.");
        closeModal();
        fetchAdmins();
      } else {
        showToast("error", data.error || "Failed to delete admin.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-8 selection:bg-[#3366FF]/10 font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-xs font-bold transition-all animate-in slide-in-from-top-2 duration-300 ${
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10">
              <Crown className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <span className="text-[9px] font-black tracking-widest uppercase text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Super Admin Override
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Admin Management
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
            Provision dashboard permissions, audit access levels, reset credentials, and remove admin accounts.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Admin
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
        {[
          { label: "Total Admins", value: admins.length, bg: "bg-blue-50/50 border border-blue-100/30 text-blue-600" },
          { label: "Active", value: admins.filter((a) => a.isActive).length, bg: "bg-emerald-50/50 border border-emerald-100/30 text-emerald-600" },
          { label: "Suspended", value: admins.filter((a) => !a.isActive).length, bg: "bg-rose-50/50 border border-rose-100/30 text-rose-600" },
          { label: "This Month", value: admins.filter((a) => new Date(a.createdAt).getMonth() === new Date().getMonth()).length, bg: "bg-amber-50/50 border border-amber-100/30 text-amber-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-3xl p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-2 relative overflow-hidden group hover:border-blue-500/10 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/3 to-transparent rounded-bl-full pointer-events-none" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
            <p className="text-3xl font-extrabold text-slate-900 leading-none mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100/80">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#3366FF] animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <UserCog className="w-12 h-12 opacity-20" />
            <p className="font-bold">No admin accounts found.</p>
            <button
              onClick={openAdd}
              className="text-[#3366FF] font-bold text-sm hover:underline"
            >
              Create the first admin →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {["Admin", "Email", "Phone", "Status", "Joined", ""].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/60 flex items-center justify-center font-extrabold text-blue-600 text-sm">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none group-hover:text-blue-600 transition-colors">{admin.name}</p>
                          <p className="text-xs text-slate-400 font-semibold mt-1.5">@{admin.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-semibold text-slate-500">{admin.email}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">
                      {admin.phoneNumber || <span className="text-slate-300 italic font-semibold">—</span>}
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                          admin.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                            : "bg-rose-50 text-rose-600 border-rose-200/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        {admin.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-400">
                      {format(new Date(admin.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button
                          onClick={() => openEdit(admin)}
                          title="Edit details"
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openResetPassword(admin)}
                          title="Reset password"
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 hover:bg-amber-500 hover:text-white hover:border-amber-500 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDelete(admin)}
                          title="Remove admin"
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div
              className={`p-8 flex items-center justify-between relative overflow-hidden ${
                modalMode === "delete"
                  ? "bg-rose-600"
                  : modalMode === "resetPassword"
                  ? "bg-amber-500"
                  : "bg-slate-950"
              }`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white">
                  {modalMode === "add" && "Add New Admin"}
                  {modalMode === "edit" && "Edit Admin Details"}
                  {modalMode === "delete" && "Remove Admin"}
                  {modalMode === "resetPassword" && "Reset Password"}
                </h2>
                <p className="text-white/60 text-sm font-semibold mt-1">
                  {modalMode === "add" && "Create a new admin account"}
                  {modalMode === "edit" && `Editing @${selectedAdmin?.username}`}
                  {modalMode === "delete" && `This will permanently delete ${selectedAdmin?.name}`}
                  {modalMode === "resetPassword" && `Set a new password for ${selectedAdmin?.name}`}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="relative z-10 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-8 space-y-4 bg-white">
              {/* ADD form */}
              {modalMode === "add" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input className={inputCls} placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                      <input className={inputCls} placeholder="janedoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                    <input type="email" className={inputCls} placeholder="jane@abroadlift.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone (optional)</label>
                    <input type="tel" className={inputCls} placeholder="+1 234 567 890" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className={inputCls + " pr-12"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button disabled={submitting} onClick={handleAdd} className="w-full h-12 mt-2 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-sm uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Admin Account"}
                  </button>
                </>
              )}

              {/* EDIT form */}
              {modalMode === "edit" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                      <input className={inputCls} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                    <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <button disabled={submitting} onClick={handleEdit} className="w-full h-12 mt-2 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-sm uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
                  </button>
                </>
              )}

              {/* RESET PASSWORD */}
              {modalMode === "resetPassword" && (
                <>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-amber-700">
                      The admin will need to use this new password to log in. Make sure to share it securely.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className={inputCls + " pr-12"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button disabled={submitting} onClick={handleResetPassword} className="w-full h-12 mt-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black tracking-widest text-sm uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Reset Password"}
                  </button>
                </>
              )}

              {/* DELETE confirm */}
              {modalMode === "delete" && (
                <>
                  <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-rose-700 mb-1">This action cannot be undone.</p>
                      <p className="text-sm font-semibold text-rose-600">
                        Admin <span className="font-black">{selectedAdmin?.name}</span> ({selectedAdmin?.email}) and all their data will be permanently removed.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 h-12 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                      Cancel
                    </button>
                    <button disabled={submitting} onClick={handleDelete} className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Yes, Remove Admin"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
