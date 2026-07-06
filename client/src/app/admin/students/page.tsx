"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  ShieldAlert,
  Loader2,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  acceptedTerms: boolean;
  createdAt: string;
  profile: {
    nationality: string | null;
    currentCountry: string | null;
    gpa: number | null;
  } | null;
  _count: {
    applications: number;
    visaChecks: number;
  };
}

export default function StudentsManagement() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStudents();
  }, [page, debouncedSearch, statusFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/students?page=${page}&limit=10&search=${encodeURIComponent(
          debouncedSearch
        )}&status=${statusFilter}`
      );
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToStudent = (id: string) => {
    router.push(`/admin/students/${id}`);
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Student Registry
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Manage student accounts, profiles, and activities.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 font-bold transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 rounded-[24px] border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-slate-50 rounded-xl p-1 shrink-0">
            {["ALL", "ACTIVE", "SUSPENDED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${
                  statusFilter === status
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors shrink-0">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No students found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Origin</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Terms</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Activity</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{student.name}</p>
                          <p className="text-xs font-bold text-slate-400 mt-0.5">@{student.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-medium text-slate-600">{student.email}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        Joined {format(new Date(student.createdAt), "MMM d, yyyy")}
                      </p>
                    </td>
                    <td className="px-8 py-4">
                      <span className="font-bold text-slate-700 text-sm">
                        {student.profile?.nationality || "Not set"}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      {student.acceptedTerms ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-blue-50 text-blue-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-100 text-slate-500">
                          ✗ Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase">
                          {student._count.applications} Apps
                        </span>
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest uppercase">
                          {student._count.visaChecks} Visas
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      {student.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-rose-50 text-rose-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => navigateToStudent(student.id)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400">
            Page {page} of {totalPages === 0 ? 1 : totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center text-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
