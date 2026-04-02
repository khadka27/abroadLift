"use client";

import React from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  ChevronDown, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";

interface AdmissionDetailsProps {
  form: Form;
  selectedMatch: Match;
  admissionPct: number;
  admissionBand: any;
  onBack: () => void;
  onAdvanceToVisa: () => void;
}

export function AdmissionDetails({
  form,
  admissionPct,
  admissionBand,
  onBack,
  onAdvanceToVisa
}: AdmissionDetailsProps) {

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full px-4 pb-32 space-y-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 italic uppercase tracking-tighter">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-slate-900" /></button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Admission Chance</h1>
         </div>
         <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
            <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" width={44} height={44} alt="U" />
         </div>
      </div>

      <Card className="p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-slate-600 leading-none tracking-tight">Admission Percentage</p>
               <h2 className="text-2xl font-black text-slate-900 leading-tight">{admissionPct}% - {admissionBand.label}</h2>
               <div className="inline-flex px-4 py-2 bg-amber-100/90 text-amber-800 text-[11px] font-black rounded-full uppercase tracking-widest shadow-sm">● Average Cost</div>
            </div>
            <div className="relative w-24 h-24 shrink-0">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 scale-110">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#B2E7E5" strokeWidth="5" />
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#FD644F" strokeWidth="5" strokeDasharray={`40 100`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#14B2AD" strokeWidth="5" strokeDasharray={`60 100`} strokeDashoffset={`-40`} strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 bg-white rounded-full shadow-inner" /></div>
            </div>
         </div>
      </Card>

      <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
         <div className="p-5 flex items-center justify-between border-b border-slate-50">
            <span className="font-bold text-slate-800">Your Profile Analysis</span>
            <ChevronDown className="w-5 h-5 text-slate-300" />
         </div>
         <div className="px-5 py-5 space-y-5">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-4.5 h-4.5" /></div>
               <span className="text-[14px] font-bold text-slate-700">CGPA: Strong ({form.gpa}/4.0)</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800"><ShieldAlert className="w-4.5 h-4.5" /></div>
               <span className="text-[14px] font-bold text-slate-700">IELTS: Need improvement ({form.testScore})</span>
            </div>
         </div>
      </div>

      {/* Suggested University Cards */}
      <div className="pt-6 space-y-6">
         <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight italic">Recommended By Risk</h3>
         <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
            {[1, 2].map((i) => (
              <Card key={i} className="min-w-[280px] rounded-[32px] border border-slate-100 overflow-hidden shadow-md snap-start bg-white">
                 <div className="h-40 bg-slate-200 relative overflow-hidden">
                    <Image src="/uni-default.webp" layout="fill" objectFit="cover" alt="U" className="transition-transform hover:scale-105" />
                    <div className="absolute top-4 right-4 bg-emerald-50/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black text-emerald-700">75% Match</div>
                 </div>
                 <div className="p-6 space-y-5">
                    <h4 className="font-black text-slate-900 leading-snug">Global University of Excellence</h4>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                       <p className="font-black text-slate-900 text-[14px]">NPR 22 Lakhs<span className="text-slate-400 font-medium text-[11px] ml-1">/ year</span></p>
                       <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">SAFE</span>
                    </div>
                 </div>
              </Card>
            ))}
         </div>
      </div>
      <button onClick={onAdvanceToVisa} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 mt-8 group">Check Visa Outlook <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /></button>
    </div>
  );
}
