"use client";

import React from "react";
import Image from "next/image";
import { 
  Bell, 
  ChevronRight, 
  Wallet, 
  TrendingUp, 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";
import { FlagIcon } from "./FlagIcon";

interface FinancialDashboardProps {
  form: Form;
  selectedMatch: Match;
  dynamicLivingCost: any;
  USD_TO_NPR: number;
  admissionPct: number;
  admissionBand: any;
  costBand: any;
  totalYear1Npr: number;
  onAdvanceToAdmission: () => void;
  onAdvanceToVisa: () => void;
  onGoToMatches: () => void;
}

export function FinancialDashboard({
  form,
  selectedMatch,
  dynamicLivingCost,
  USD_TO_NPR,
  admissionPct,
  admissionBand,
  costBand,
  totalYear1Npr,
  onAdvanceToAdmission,
  onAdvanceToVisa,
  onGoToMatches
}: FinancialDashboardProps) {
  const tuitionUsd = Math.round(selectedMatch.currency === "NPR" ? (selectedMatch.tuitionFee || 22000) / USD_TO_NPR : selectedMatch.tuitionFee || 22000);
  const livingCostUsd = Object.values((dynamicLivingCost || { rent: 3800, food: 1300, transport: 500, insurance: 320, other: 700 }) as Record<string, number>).reduce((sum: number, val: number) => sum + val, 0);

  const fmtNpr = (v: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full px-2 md:px-4 lg:px-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm ring-1 ring-slate-200">
            <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" width={48} height={48} alt="U" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">Hi, {form.name.split(' ')[0] || "Student"} <span>👋</span></h1>
            <p className="text-[13px] font-medium text-slate-500">Here’s your study abroad overview</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm"><Bell className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Selection Card */}
        <Card className="p-5 rounded-[28px] border-none bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] col-span-1 md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-14 h-10 rounded-lg overflow-hidden shadow-sm border border-slate-50">
                  <FlagIcon countryCode={selectedMatch.countryCode || form.countries[0]} className="w-full h-full object-cover" />
               </div>
               <div>
                  <h2 className="text-[16px] font-black text-slate-900 tracking-tight">{selectedMatch.name}</h2>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{selectedMatch.location || "UNITED KINGDOM"}</p>
               </div>
            </div>
            <button onClick={onGoToMatches} className="px-5 h-10 bg-slate-50 text-slate-500 text-[11px] font-black rounded-full uppercase tracking-widest hover:bg-slate-100 transition-colors">Change</button>
          </div>
        </Card>

        {/* Cost Estimation Card */}
        <Card className="p-6 rounded-[32px] border-none bg-[#3686FF] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Wallet className="w-24 h-24 rotate-12" /></div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2.5">
                 <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
                 <h4 className="text-[14px] font-bold uppercase tracking-[0.2em] italic opacity-80">Year 1 Estimate</h4>
              </div>
              <div className="space-y-1">
                 <h2 className="text-4xl font-black italic tracking-tighter">{fmtNpr(totalYear1Npr)}</h2>
                 <p className="text-sm font-bold text-blue-100/80">Inclusive of tuition & living</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{costBand.label}</span>
              </div>
           </div>
        </Card>

        {/* Admission Card */}
        <Card className="p-6 rounded-[32px] border-none bg-white shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shadow-sm">GPA</div>
                    <h4 className="text-[14px] font-black text-slate-900 tracking-tight">Admission Chance</h4>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full ${admissionBand.badgeClass} text-[10px] font-black tracking-widest uppercase`}>{admissionBand.label}</span>
              </div>
              <div className="flex items-center gap-6">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{admissionPct}%</h2>
                 <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${admissionPct}%` }} />
                 </div>
              </div>
           </div>
           <button onClick={onAdvanceToAdmission} className="w-full h-12 bg-slate-900 text-white rounded-2xl font-bold text-sm mt-8 flex items-center justify-center gap-2 group shadow-xl">Complete Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
        </Card>

        {/* Visa Readiness Card */}
        <Card className="p-6 rounded-[32px] border-none bg-white shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px] shadow-sm">VISA</div>
                 <h4 className="text-[14px] font-black text-slate-900 tracking-tight">Visa Readiness</h4>
              </div>
              <div className="mb-6"><h2 className="text-2xl font-black text-slate-900">60% <span className="text-rose-500 font-bold uppercase text-xs ml-1">-Needs Work</span></h2></div>
              <div className="space-y-3">
                 <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-emerald-500" /><span className="text-[12px] font-bold text-slate-600">Strong Academics</span></div>
                 <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-amber-500" /><span className="text-[12px] font-bold text-slate-600">Financial Proof Weak</span></div>
              </div>
           </div>
           <button onClick={onAdvanceToVisa} className="w-full h-12 bg-[#3686FF] text-white rounded-2xl font-bold text-sm mt-8 shadow-xl">Improve Success</button>
        </Card>
      </div>
    </div>
  );
}
