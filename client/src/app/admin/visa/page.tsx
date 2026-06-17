"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Globe
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

export default function VisaManagement() {
  const [visaChecks, setVisaChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchVisaChecks();
  }, [page, debouncedSearch]);

  const fetchVisaChecks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/visa?page=${page}&limit=10&search=${encodeURIComponent(
          debouncedSearch
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setVisaChecks(data.visaChecks);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching visa checks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Visa Assessments
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Monitor AI-driven visa success probability checks.
          </p>
        </div>
      </div>

      <Card className="p-4 rounded-[24px] border-none shadow-xl shadow-slate-200/50 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or destination country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500/20 font-medium text-slate-700"
          />
        </div>
      </Card>

      <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : visaChecks.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
              <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No visa assessments found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nationality</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Destination</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Academic & Funds</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Success Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visaChecks.map((check) => (
                  <tr key={check.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-900 leading-tight">{check.user.name}</p>
                      <p className="text-xs font-bold text-slate-400">{check.user.email}</p>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Globe className="w-4 h-4 text-slate-400" />
                        {check.nationality}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-black text-sky-600">{check.destination}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{check.degreeLevel}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-bold text-slate-600">Funds: ${check.fundsAvailable.toLocaleString()}</p>
                      <p className="text-xs font-bold text-slate-600">IELTS: {check.ieltsScore || "N/A"}</p>
                      {check.pastRejections > 0 && (
                        <p className="text-[10px] font-black text-rose-500 uppercase mt-1">
                          {check.pastRejections} Past Rejection(s)
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${
                          check.successRate >= 70 ? 'bg-emerald-100 text-emerald-600' :
                          check.successRate >= 40 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {check.successRate}%
                        </div>
                        <div className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${check.successRate >= 70 ? 'bg-emerald-500' : check.successRate >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${check.successRate}%` }}
                          />
                        </div>
                      </div>
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
    </div>
  );
}
