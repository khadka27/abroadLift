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
      bg: "bg-blue-100",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "applications",
      title: "University Applications",
      description: "Download all application records, statuses, and associated universities.",
      icon: GraduationCap,
      color: "text-amber-600",
      bg: "bg-amber-100",
      buttonColor: "bg-amber-600 hover:bg-amber-700"
    },
    {
      id: "visas",
      title: "Visa Assessments",
      description: "Generate a report of all AI-driven visa success probability checks.",
      icon: ShieldCheck,
      color: "text-sky-600",
      bg: "bg-sky-100",
      buttonColor: "bg-sky-600 hover:bg-sky-700"
    }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Reports & Exports
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Generate and download CSV reports of system data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exportModules.map((module) => (
          <Card key={module.id} className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white hover:-translate-y-1 transition-transform">
            <div className={`w-16 h-16 rounded-2xl ${module.bg} ${module.color} flex items-center justify-center mb-6`}>
              <module.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{module.title}</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 min-h-[40px]">
              {module.description}
            </p>
            
            <button
              onClick={() => handleExport(module.id)}
              disabled={exporting === module.id}
              className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-slate-200 disabled:opacity-50 ${module.buttonColor}`}
            >
              {exporting === module.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {exporting === module.id ? "Generating..." : "Download CSV"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
