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
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 selection:bg-[#3366FF]/10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Student Registry
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
            Manage student directories, profile records, and admissions checks.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-slate-100 hover:border-blue-100 hover:shadow-md text-slate-600 hover:text-blue-600 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-xs">
            <Download className="w-4 h-4 text-slate-450" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 rounded-[28px] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50/50 border border-slate-200/60 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-semibold text-sm text-slate-750 placeholder:text-slate-350"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 select-none">
          <div className="flex bg-slate-100/75 rounded-2xl p-1 shrink-0 border border-slate-200/20">
            {["ALL", "ACTIVE", "SUSPENDED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-[12px] text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-slate-50/50 hover:bg-slate-100/70 border border-slate-200/60 rounded-xl text-slate-450 transition-colors shrink-0 cursor-pointer shadow-xs">
            <Filter className="w-4.5 h-4.5" />
          </button>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="rounded-[32px] border border-slate-100/80 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 select-none">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No students found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Origin</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Terms</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Activity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-8 py-5 text-right pr-14"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/60 flex items-center justify-center font-extrabold text-blue-600 text-sm transition-transform group-hover:scale-105">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{student.name}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1.5">@{student.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-semibold text-slate-500 leading-none mb-1.5">{student.email}</p>
                      <p className="text-[10px] font-bold text-slate-400 leading-none uppercase">
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 border border-blue-200/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 border border-slate-200/40">
                          ✗ Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex gap-2 select-none">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black tracking-widest uppercase border border-blue-200/30">
                          {student._count.applications} Apps
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black tracking-widest uppercase border border-emerald-200/30">
                          {student._count.visaChecks} Visas
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      {student.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-rose-50 text-rose-600 border border-rose-200/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex justify-end pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => navigateToStudent(student.id)}
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-400 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 bg-[#fafbfc]/50 flex items-center justify-between select-none">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Page {page} of {totalPages === 0 ? 1 : totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl bg-white border border-slate-150 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-10 h-10 rounded-xl bg-white border border-slate-150 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
