/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";

interface VisaEligibilityProps {
  form: Form;
  selectedMatch: Match;
  onBack: () => void;
  onComplete: () => void;
}

export interface VisaGuidanceItem {
  title?: string;
  t?: string;
  description?: string;
  d?: string;
  status?: string;
  s?: string;
}

export function VisaEligibility({
  form,
  selectedMatch,
  onBack,
  onComplete
}: VisaEligibilityProps) {

  const [visaGuidance, setVisaGuidance] = React.useState<VisaGuidanceItem[]>([]);
  const hasFunds = parseFloat(form.bankBalance) > 0 || parseFloat(form.sponsorIncome) > 0;
  const isHighRiskCountry = ["AU", "UK"].includes(selectedMatch.countryCode || "");
  
  // Dynamic Success Chance
  let successBase = 75;
  if (!hasFunds) successBase -= 20;
  if (parseInt(form.backlogs) > 3) successBase -= 10;
  if (parseInt(form.studyGap) > 2) successBase -= 5;
  if (isHighRiskCountry) successBase -= 10;
  
  const successChance = Math.max(30, Math.min(98, successBase));
  const successLabel = successChance >= 80 ? "Excellent" : successChance >= 60 ? "Moderate" : "High Vigilance";
  const successColor = successChance >= 80 ? "text-emerald-400" : successChance >= 60 ? "text-blue-400" : "text-amber-400";

  React.useEffect(() => {
    const code = selectedMatch.countryCode?.toLowerCase() || form.countries[0]?.toLowerCase() || "usa";
    fetch(`/api/visa-guidance?countryCode=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.steps || data.requirements)) {
           setVisaGuidance(data.steps || data.requirements);
        } else {
           setVisaGuidance([
             { title: "Proof of Funds Mapping", description: `Show ${selectedMatch.countryCode === "AU" ? "AUD 30,000+" : "$25,000+"} in liquid assets`, status: hasFunds ? "VERIFIED" : "REQUIRED" },
             { title: "GTE / SOP Statement", description: "Draft strong purpose that matches academic history", status: "REQUIRED" },
             { title: "Health Insurance (OSHC/IHS)", description: "Mandatory for student visa duration", status: "PENDING" }
           ]);
        }
      })
      .catch(console.error);
  }, [form.countries, selectedMatch, hasFunds]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full px-4 pb-16 space-y-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 italic uppercase tracking-tighter">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-slate-900" /></button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Visa Success</h1>
         </div>
         <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
            <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" width={44} height={44} alt="U" />
         </div>
      </div>

      <Card className="p-6 md:p-9 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden bg-slate-900 text-white">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3 md:space-y-4">
               <p className="text-[11px] md:text-[13px] font-bold text-blue-300/60 leading-none tracking-[0.2em] uppercase">Embassy Prediction</p>
               <h2 className="text-2xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter italic">{successLabel} <span className={successColor}>Success</span></h2>
               <div className={`inline-flex px-4 py-2 md:px-5 md:py-2.5 bg-white/5 backdrop-blur-md ${successColor} text-[10px] md:text-[11px] font-black rounded-full uppercase tracking-widest shadow-inner border border-white/10`}>
                 {successChance}% Success Chance
               </div>
            </div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 -rotate-12 bg-white/5 rounded-[24px] md:rounded-[32px] border border-white/10 flex items-center justify-center p-5 md:p-6 shadow-2xl"><ShieldCheck className={`w-full h-full ${successColor}`} /></div>
         </div>
      </Card>

      <div className="space-y-4 py-2">
         <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm bg-white hover:border-blue-100 transition-colors">
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 md:mb-4"><TrendingUp className="w-4 h-4 md:w-5 md:h-5" /></div>
               <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 md:mb-2">Academics</p>
               <h5 className="font-black text-slate-900 text-sm md:text-base tracking-tight leading-none">{parseInt(form.backlogs) < 2 ? "High Trust" : "Moderate"}</h5>
            </Card>
            <Card className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm bg-white hover:border-blue-100 transition-colors">
               <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${hasFunds ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"} flex items-center justify-center mb-3 md:mb-4`}>
                 {hasFunds ? <TrendingUp className="w-4 h-4 md:w-5 md:h-5" /> : <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />}
               </div>
               <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 md:mb-2">Financials</p>
               <h5 className={`font-black text-sm md:text-base tracking-tight leading-none uppercase ${hasFunds ? "text-slate-900" : "text-rose-600 italic"}`}>
                 {hasFunds ? "Verified" : "Gap"}
               </h5>
            </Card>
         </div>
      </div>

      <div className="space-y-5 pt-4 border-t border-slate-50 mt-2">
         <div className="flex items-center gap-4 md:gap-5">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-500/30">
               <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="space-y-0.5 md:space-y-1">
               <h4 className="font-black text-slate-900 leading-none text-base md:text-lg">Visa Roadmap</h4>
               <p className="text-[12px] md:text-sm font-bold text-slate-500 italic">Critical steps for {selectedMatch.countryCode} visa</p>
            </div>
         </div>

         <div className="space-y-3 md:space-y-4">
            {visaGuidance.map((st: VisaGuidanceItem, i: number) => (
              <div key={i} className="flex items-center justify-between p-5 md:p-7 bg-slate-50/50 rounded-[28px] md:rounded-[36px] border border-slate-100 group hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 cursor-pointer">
                 <div className="flex-1 pr-3 md:pr-4">
                    <h5 className="font-black text-slate-900 text-[14px] md:text-[15px] italic tracking-tight">{st.title || st.t}</h5>
                    <p className="text-[11px] md:text-xs font-bold text-slate-400 leading-tight mt-1 md:mt-1.5">{st.description || st.d}</p>
                 </div>
                 <div className="flex items-center gap-2 md:gap-3">
                    <span className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase ${st.status === "VERIFIED" ? "text-emerald-500" : "text-slate-400"}`}>
                       {st.status || st.s || "PENDING"}
                    </span>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <button onClick={onComplete} className="w-full h-16 md:h-18 bg-[#3686FF] text-white rounded-[24px] md:rounded-[32px] font-black text-[13px] md:text-sm uppercase tracking-widest shadow-[0_20px_40px_-5px_rgba(54,134,255,0.3)] flex items-center justify-center gap-3 mt-8 md:mt-12 group hover:bg-blue-600 transition-all active:scale-95 duration-300 italic">Generate Final Roadmap <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" /></button>
    </div>
  );
}
