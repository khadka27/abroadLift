import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Match, Form } from '@/types/matches';
import { Bell, Edit3, ChevronRight, FileText, Search, Target, Bookmark, Sparkles, MapPin, CheckCircle2, AlertTriangle, IndianRupee, ShieldCheck } from 'lucide-react';

interface StudyOverviewDashboardProps {
  form: Form;
  selectedMatch: Match;
  matches: Match[];
  session: any;
  USD_TO_NPR: number;
  totalYear1Npr: number;
  admissionPct: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  costBand: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admissionBand: any;
  onAdvanceToCost: () => void;
  onAdvanceToAdmission: () => void;
  onAdvanceToVisa: () => void;
  onGoToMatches: () => void;
}

export function StudyOverviewDashboard({
  form,
  selectedMatch,
  matches,
  session,
  USD_TO_NPR,
  totalYear1Npr,
  admissionPct,
  costBand,
  admissionBand,
  onAdvanceToCost,
  onAdvanceToAdmission,
  onAdvanceToVisa,
  onGoToMatches
}: StudyOverviewDashboardProps) {
  const userName = session?.user?.name?.split(' ')[0] || form.name || 'Student';

  // Visa Chance Logic
  const isHighRiskCountry = ["AU", "UK"].includes(selectedMatch.countryCode || "");
  const hasFunds = parseFloat(form.bankBalance) > 0 || parseFloat(form.sponsorIncome) > 0;
  let visaBase = 75;
  if (!hasFunds) visaBase -= 20;
  if (parseInt(form.backlogs) > 3) visaBase -= 10;
  if (parseInt(form.studyGap) > 2) visaBase -= 5;
  if (isHighRiskCountry) visaBase -= 10;
  const visaChance = Math.max(30, Math.min(98, visaBase));
  const visaLabel = visaChance >= 80 ? "Excellent" : visaChance >= 60 ? "Moderate" : "Needs Work";

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 pb-20">
      {/* Top Header */}
      <div className="pt-10 px-5 pb-6 bg-white shadow-sm rounded-b-[32px]">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Hi, {userName} 👋</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Here&apos;s your abroad study overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm bg-white hover:bg-slate-50 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
              <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" width={40} height={40} alt="User" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 mt-8 space-y-10">
        {/* Study Plan Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
              {selectedMatch.countryCode === 'USA' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="w-full h-full object-cover">
                  <rect width="7410" height="3900" fill="#b22234" />
                  <path d="M0,450H7410m0,600H0m0,600H7410m0,600H0m0,600H7410m0,600H0" stroke="#fff" strokeWidth="300" />
                  <rect width="2964" height="2100" fill="#3c3b6e" />
                </svg>
              ) : selectedMatch.countryCode === 'GBR' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-full h-full object-cover">
                  <clipPath id="s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
                  <clipPath id="t"><path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z" /></clipPath>
                  <g clipPath="url(#s)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                  </g>
                </svg>
              ) : selectedMatch.countryCode === 'CAN' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" className="w-full h-full object-cover">
                  <rect width="600" height="300" fill="#d80027" />
                  <rect x="150" width="300" height="300" fill="#fff" />
                </svg>
              ) : selectedMatch.countryCode === 'AUS' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25200 12600" className="w-full h-full object-cover">
                  <rect width="25200" height="12600" fill="#012169" />
                </svg>
              ) : (
                <div className="w-full h-full bg-slate-200"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Study Plan <span className="text-blue-500">{selectedMatch.countryCode}</span></h3>
            </div>
          </div>
          <button onClick={onGoToMatches} className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Engine Metric Cards (Responsive Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible pb-4 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 snap-x">
          {/* Cost Card */}
          <div className="min-w-[260px] bg-white border border-slate-200 rounded-3xl p-5 shadow-md snap-center flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                  <Image src="/npr-symbol.png" width={24} height={24} alt="NPR" className="object-contain" />
                </div>
                <h3 className="font-medium text-slate-800 text-[16px]">Estimated Cost</h3>
              </div>
              <div className="mt-4">
                <span className="text-[24px] font-semibold tracking-tight text-slate-900">
                  NPR {(totalYear1Npr / 100000).toFixed(1)}L
                </span>
                <span className="text-slate-500 font-regular text-[16px] ml-1">/ year</span>
              </div>
              <div className="mt-3">
                <span className={`inline-block bg-[#419203] px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${costBand.badgeClass}`}>
                  • {costBand.label}
                </span>
              </div>    
              <p className="text-[14px] font-regular text-slate-500 mt-3">Tuition + Living</p>
            </div>
            <button onClick={onAdvanceToCost} className="mt-6 w-full py-3 bg-[#449D00] text-white font-medium text-[16px] rounded-xl transition-colors shadow-md shadow-[#63b931]/20">
              View Breakdown
            </button>
          </div>

          {/* Admission Card */}
          <div className="min-w-[260px] bg-white border border-slate-200 rounded-3xl p-5 shadow-md snap-center flex flex-col justify-between ">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center border border-red-200">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Admission Chance</h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[24px] font-black tracking-tight text-slate-900">
                  {admissionPct}%
                </span>
                <span className={`font-black text-sm ${admissionBand.badgeClass.split(' ')[1] || 'text-slate-600'}`}>
                  - {admissionBand.label}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${admissionBand.badgeClass.split(' ')[0].replace('bg-', 'bg-') || 'bg-blue-500'}`} style={{ width: `${admissionPct}%` }}></div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Good GPA Match
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Improve English bounds
                </div>
              </div>
            </div>
            <button onClick={onAdvanceToAdmission} className="mt-4 w-full py-3 bg-[#ff9f43] hover:bg-[#e88a30] text-white font-black text-sm rounded-xl transition-colors shadow-md shadow-[#ff9f43]/20">
              See Details
            </button>
          </div>

          {/* Visa Readiness Card */}
          <div className="min-w-[260px] bg-white border border-slate-200 rounded-3xl p-5 shadow-md snap-center flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                   <Image src="/visa-logo.png" width={24} height={24} alt="Visa" className="object-cover" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Visa Readiness</h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[24px] font-black tracking-tight text-slate-900">
                  {visaChance}%
                </span>
                <span className="font-black text-sm text-blue-500">
                  - {visaLabel}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${visaChance}%` }}></div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strong Academics
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Financial Proof Req.
                </div>
              </div>
            </div>
            <button onClick={onAdvanceToVisa} className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20">
              Improve Chance
            </button>
          </div>
        </div>

        {/* Improve Chances Banner */}
        <div className="relative bg-gradient-to-br from-[#fdfbf6] to-[#f4ead9] border border-[#e8dcc4] rounded-3xl p-6 overflow-hidden shadow-sm flex items-center">
          <div className="relative z-10 w-3/5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Improve Your Chances
            </h3>
            <p className="text-[11px] font-semibold text-slate-600 mt-2 mb-3">
              Follow these steps to boost your success rate.
            </p>
            <ul className="text-[11px] font-bold text-slate-800 space-y-1.5 mb-4 ml-1">
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-900 rounded-full" /> Increase IELTS target</li>
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-900 rounded-full" /> Apply for safer Unis</li>
            </ul>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-black text-[12px] px-6 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition-all">
              View Plan
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-48 opacity-100 pointer-events-none translate-x-[5%] translate-y-[5%]">
            <Image src="/group.png" alt="Improve" fill className="object-contain object-right-bottom" />
          </div>
        </div>

        {/* Recommended Universities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-slate-900">Recommended Universities</h2>
              <p className="text-[10px] font-semibold text-slate-400">Based on your profile & budget</p>
            </div>
            <Link href="/matches" className="text-blue-500 text-xs font-bold hover:underline">See All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible pb-4 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 snap-x">
            {matches.slice(0, 4).map((uni, idx) => {
              const costUsd = Math.round(uni.currency === "NPR" ? (uni.tuitionFee || 22000) / USD_TO_NPR : (uni.tuitionFee || 22000));
              const costNpr = Math.round(costUsd * USD_TO_NPR);
              const matchScore = Math.max(70, Math.round((uni.admissionRate || 65) + (Math.random() * 10)));

              return (
                <div key={idx} className="min-w-[240px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col snap-center">
                  <div className="h-28 relative bg-slate-200">
                    <Image src={uni.banner || uni.logo || "/uni-default.webp"} alt={uni.name} fill className="object-cover" />
                    <div className="absolute inset-0 border-b border-black/10" />
                    <div className="absolute top-2 right-2 bg-emerald-100/90 backdrop-blur-sm text-emerald-800 text-[10px] font-black px-2 py-1 rounded-full shadow-sm border border-emerald-200">
                      {matchScore}% Match
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-black text-[13px] text-slate-900 leading-tight mb-1">{uni.name}</h3>
                    <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" /> {uni.location}
                    </p>

                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="font-black text-[12px] text-slate-900">
                        NPR {(costNpr / 100000).toFixed(1)}L<span className="text-[9px] text-slate-400">/year</span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100">
                        • Safe
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-[#ff9f43] hover:bg-[#e88a30] text-white font-black text-[11px] py-2 rounded-lg shadow-sm">Save</button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-black text-[11px] py-2 rounded-lg shadow-sm">Compare</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-black text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 flex-1 text-left leading-tight">Compare Universities</span>
            </button>

            <button className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 flex-1 text-left leading-tight">View Requirements</span>
            </button>

            <button className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#63b931]/10 text-[#63b931] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 flex-1 text-left leading-tight">Improve My Chances</span>
            </button>

            <button className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#ff9f43]/10 text-[#ff9f43] flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 flex-1 text-left leading-tight">Saved Programs</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
