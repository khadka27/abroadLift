"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  X
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [reviewerComments, setReviewerComments] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchApplications();
  }, [page, debouncedSearch, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/applications?page=${page}&limit=10&search=${encodeURIComponent(
          debouncedSearch
        )}&status=${statusFilter}`
      );
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: updateStatus,
          reviewerComments,
        }),
      });
      if (res.ok) {
        fetchApplications();
        setSelectedApp(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const openReviewModal = (app: any) => {
    setSelectedApp(app);
    setUpdateStatus(app.status);
    setReviewerComments(app.reviewerComments || "");
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Applications
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Review and process university admission applications.
          </p>
        </div>
      </div>

      <Card className="p-4 rounded-[24px] border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-amber-500/20 font-medium text-slate-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-slate-50 rounded-xl p-1 shrink-0">
            {["ALL", "SAVED", "APPLIED", "ACCEPTED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${
                  statusFilter === status
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No applications found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">University</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Submitted</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-900 leading-tight">{app.user.name}</p>
                      <p className="text-xs font-bold text-slate-400">{app.user.email}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-bold text-slate-700">{app.university.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.university.country}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-medium text-slate-500">
                        {format(new Date(app.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <Badge className={
                        app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-none' :
                        app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-none' :
                        app.status === 'APPLIED' ? 'bg-amber-50 text-amber-600 border-none' :
                        'bg-slate-100 text-slate-500 border-none'
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => openReviewModal(app)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-amber-500 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400">
            Page {page} of {totalPages === 0 ? 1 : totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center text-slate-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <Card className="relative w-full max-w-2xl bg-white rounded-[32px] border-none shadow-2xl p-8 z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-slate-900 mb-6">Review Application</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</p>
                <p className="font-bold text-slate-700">{selectedApp.user.name}</p>
                <p className="text-sm text-slate-500">{selectedApp.user.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">University</p>
                <p className="font-bold text-slate-700">{selectedApp.university.name}</p>
                <p className="text-sm text-slate-500">{selectedApp.university.country}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Update Status</label>
                <div className="grid grid-cols-4 gap-3">
                  {["SAVED", "APPLIED", "ACCEPTED", "REJECTED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setUpdateStatus(s)}
                      className={`py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                        updateStatus === s
                          ? s === 'ACCEPTED' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : s === 'REJECTED' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                            : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Reviewer Comments</label>
                <textarea
                  value={reviewerComments}
                  onChange={(e) => setReviewerComments(e.target.value)}
                  placeholder="Add notes or requirements for this application..."
                  className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-500/10 resize-none"
                />
              </div>

              <button
                onClick={handleUpdateApplication}
                disabled={updating}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-amber-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
              >
                {updating ? "Saving Changes..." : "Save Assessment"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
