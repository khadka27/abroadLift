"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Users,
  GraduationCap,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ReportsAndExports() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const res = await fetch(`/api/admin/export?type=${type}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_export_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert("Failed to export data.");
    } finally {
      setExporting(null);
    }
  };

  const exportModules = [
    {
      id: "students",
      title: "Student Registry",
      description: "Export full student profiles including demographics, GPAs, and contact details.",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/80 border border-blue-100/30",
    },
    {
      id: "applications",
      title: "University Applications",
      description: "Download all application records, statuses, and associated universities.",
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50/80 border border-indigo-100/30",
    },
    {
      id: "visas",
      title: "Visa Assessments",
      description: "Generate a report of all AI-driven visa success probability checks.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50/80 border border-emerald-100/30",
    }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 selection:bg-[#3366FF]/10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Reports & Exports
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
            Generate, compile, and download comma-separated value (CSV) reports of current platform data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exportModules.map((module) => (
          <Card key={module.id} className="p-8 rounded-[28px] border border-slate-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.03)] bg-white hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-5px_rgba(51,102,255,0.07)] hover:border-blue-500/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className={`w-14 h-14 rounded-2xl ${module.bg} ${module.color} flex items-center justify-center mb-6 shadow-inner`}>
                <module.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2.5">{module.title}</h3>
              <p className="text-xs font-semibold text-slate-450 mb-8 min-h-[40px] leading-relaxed">
                {module.description}
              </p>
            </div>
            
            <button
              onClick={() => handleExport(module.id)}
              disabled={exporting === module.id}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/15 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {exporting === module.id ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting === module.id ? "Generating..." : "Download CSV"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
