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
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 selection:bg-[#3366FF]/10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Visa Assessments
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
            Monitor AI-driven visa success probability evaluations and student records.
          </p>
        </div>
      </div>

      <Card className="p-4 rounded-[28px] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
          <input
            type="text"
            placeholder="Search student or destination country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50/50 border border-slate-200/60 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-semibold text-sm text-slate-750 placeholder:text-slate-350"
          />
        </div>
      </Card>

      <Card className="rounded-[32px] border border-slate-100/85 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-650 animate-spin" />
            </div>
          ) : visaChecks.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 select-none">
              <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No visa assessments found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Nationality</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Destination</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Academic & Funds</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Success Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visaChecks.map((check) => (
                  <tr key={check.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{check.user.name}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1.5">{check.user.email}</p>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-655">
                        <Globe className="w-4 h-4 text-slate-400" />
                        {check.nationality}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-extrabold text-[#3366FF] leading-none">{check.destination}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{check.degreeLevel}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-semibold text-slate-600">Funds: <span className="font-bold text-slate-800">${check.fundsAvailable.toLocaleString()}</span></p>
                      <p className="text-xs font-semibold text-slate-600 mt-1">IELTS: <span className="font-bold text-slate-850">{check.ieltsScore || "N/A"}</span></p>
                      {check.pastRejections > 0 && (
                        <p className="text-[9px] font-black text-rose-500 uppercase mt-2 bg-rose-50 border border-rose-200/30 px-2 py-0.5 rounded-md w-fit">
                          {check.pastRejections} Past Rejection(s)
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm border ${
                          check.successRate >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' :
                          check.successRate >= 40 ? 'bg-amber-50 text-amber-600 border-amber-200/50' : 'bg-rose-50 text-rose-600 border-rose-200/50'
                        }`}>
                          {check.successRate}%
                        </div>
                        <div className="flex-1 max-w-[120px] h-2 bg-slate-100/70 rounded-full overflow-hidden border border-slate-200/20 shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${check.successRate >= 70 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : check.successRate >= 40 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`}
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
