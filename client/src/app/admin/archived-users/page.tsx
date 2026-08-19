/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  UserX,
  Search,
  Calendar,
  Mail,
  Phone,
  User as UserIcon,
  X,
  FileText,
  GraduationCap,
  Sparkles,
  Info,
  ShieldAlert,
} from "lucide-react";
import Loading from "@/components/ui/Loading";

interface ArchivedUserRecord {
  id: string;
  originalUserId: string;
  name: string;
  username: string;
  email: string;
  countryDialCode?: string;
  phoneNumber?: string;
  phoneE164?: string;
  role: string;
  profileData?: any;
  applicationsData?: any;
  matchesData?: any;
  visaChecksData?: any;
  documentsData?: any;
  deletedReason?: string;
  deletedAt: string;
}

export default function AdminArchivedUsersPage() {
  const [archivedUsers, setArchivedUsers] = useState<ArchivedUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ArchivedUserRecord | null>(null);

  useEffect(() => {
    fetchArchivedUsers();
  }, []);

  const fetchArchivedUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/archived-users");
      const json = await res.json();
      if (res.ok && json.success) {
        setArchivedUsers(json.data || []);
      } else {
        setError(json.error || "Failed to load archived user accounts");
      }
    } catch (err: any) {
      setError("Network error loading archived accounts.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = archivedUsers.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      (u.phoneNumber && u.phoneNumber.includes(query))
    );
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <UserX className="w-3.5 h-3.5" />
            <span>Archive Storage</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Deleted User Archives
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Historical records and data snapshots of accounts deleted by users.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading size="lg" text="Loading archived accounts..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <UserX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Archived Users Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? "No deleted accounts match your search query."
              : "No user accounts have been deleted yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Deletion Date</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0 border border-rose-100">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">@{user.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                      {(user.phoneE164 || user.phoneNumber) && (
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{user.phoneE164 || user.phoneNumber}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(user.deletedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(user.deletedAt).toLocaleTimeString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {user.deletedReason || "Self-service deletion"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3686FF] font-extrabold text-xs transition-all cursor-pointer"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Inspector Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={() => setSelectedUser(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-lg text-white leading-tight">
                    {selectedUser.name} (Archived Snapshot)
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {selectedUser.originalUserId} • Deleted:{" "}
                    {new Date(selectedUser.deletedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Account Credentials */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-600" /> Account Identifiers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Username</span>
                    <p className="font-extrabold text-slate-800">@{selectedUser.username}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    <p className="font-extrabold text-slate-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                    <p className="font-extrabold text-slate-800">
                      {selectedUser.phoneE164 || selectedUser.phoneNumber || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Saved Student Profile Data */}
              {selectedUser.profileData && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" /> Saved Academic Profile
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Degree</span>
                      <p className="font-extrabold">{selectedUser.profileData.degreeLevel || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Field</span>
                      <p className="font-extrabold">{selectedUser.profileData.field || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">GPA</span>
                      <p className="font-extrabold">{selectedUser.profileData.gpa || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                      <p className="font-extrabold">${selectedUser.profileData.yearlyBudget || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Applications */}
              {Array.isArray(selectedUser.applicationsData) &&
                selectedUser.applicationsData.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Saved Applications (
                      {selectedUser.applicationsData.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.applicationsData.map((app: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-emerald-200/60 flex items-center justify-between"
                        >
                          <span className="font-bold text-slate-800">
                            {app.university?.name || `University ID: ${app.universityId}`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Saved Documents */}
              {Array.isArray(selectedUser.documentsData) &&
                selectedUser.documentsData.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" /> Uploaded Documents (
                      {selectedUser.documentsData.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.documentsData.map((doc: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">{doc.category}</p>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{doc.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Raw JSON Data Viewer */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Full Json Record Snapshot
                </p>
                <pre className="text-[11px] font-mono overflow-x-auto max-h-48 p-3 rounded-xl bg-slate-950 text-slate-300">
                  {JSON.stringify(selectedUser, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
