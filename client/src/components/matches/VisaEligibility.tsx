"use client";

import React from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  MapPin, 
  RefreshCw, 
  LayoutGrid, 
  ArrowRight, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  ChevronRight, 
  Bell, 
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

export function VisaEligibility({
  form,
  selectedMatch,
  onBack,
  onComplete
}: VisaEligibilityProps) {

  const [visaGuidance, setVisaGuidance] = React.useState<any[]>([]);

  React.useEffect(() => {
    const code = selectedMatch.countryCode?.toLowerCase() || form.countries[0]?.toLowerCase() || "usa";
    fetch(`/api/visa-guidance?countryCode=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.steps || data.requirements)) {
           setVisaGuidance(data.steps || data.requirements);
        } else {
           // Fallback steps if data is not structured as expected
           setVisaGuidance([
             { title: "Proof of Funds Mapping", description: "Show source of income for 2 years", status: "PENDING" },
             { title: "GTE Statement Forge", description: "Draft strong purpose that matches profile", status: "REQUIRED" }
           ]);
        }
      })
      .catch(console.error);
  }, [form.countries, selectedMatch]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full px-4 pb-32 space-y-5 bg-white min-h-screen">
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

      <Card className="p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden bg-slate-900 text-white">
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-blue-300 leading-none tracking-tight">Embassy Prediction</p>
               <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">Moderate <span className="text-blue-400">Success</span></h2>
               <div className="inline-flex px-4 py-2 bg-blue-500/10 text-blue-400 text-[11px] font-black rounded-full uppercase tracking-widest shadow-inner border border-blue-500/20">60% Success Chance</div>
            </div>
            <div className="relative w-24 h-24 shrink-0 -rotate-12 bg-white/5 rounded-[24px] border border-white/10 flex items-center justify-center p-6"><ShieldCheck className="w-full h-full text-blue-400" /></div>
         </div>
      </Card>

      <div className="flex-1 space-y-4 py-4">
         <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 rounded-[28px] border border-slate-100 shadow-sm bg-white">
               <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><TrendingUp className="w-4 h-4" /></div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Academics</p>
               <h5 className="font-black text-slate-900 tracking-tight leading-none">High Trust</h5>
            </Card>
            <Card className="p-5 rounded-[28px] border border-slate-100 shadow-sm bg-white">
               <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4"><TrendingDown className="w-4 h-4" /></div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Financials</p>
               <h5 className="font-black text-slate-900 tracking-tight leading-none italic uppercase">Gap In Funding</h5>
            </Card>
         </div>
      </div>

      <div className="space-y-6 pt-4">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20"><RefreshCw className="w-6 h-6 animate-spin-slow" /></div>
            <div className="space-y-1">
               <h4 className="font-black text-slate-900 leading-none">Complete Roadmap</h4>
               <p className="text-sm font-bold text-slate-500 italic max-w-[200px]">Follow these for 95% + success</p>
            </div>
         </div>

         <div className="space-y-4">
            {visaGuidance.map((st: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[30px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                 <div className="flex-1">
                    <h5 className="font-black text-slate-900 text-[14px] italic">{st.title || st.t}</h5>
                    <p className="text-xs font-bold text-slate-500 leading-none mt-1">{st.description || st.d}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{st.status || st.s || "PENDING"}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1" />
                 </div>
              </div>
            ))}
         </div>
      </div>

      <button onClick={onComplete} className="w-full h-16 bg-[#3686FF] text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 mt-12 group hover:scale-[1.02] active:scale-95 transition-all">Download Full Roadmap <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /></button>
    </div>
  );
}
