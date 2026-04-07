import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Match, Form } from '@/types/matches';
import { Bell, Edit3, ChevronLeft, ChevronRight, FileText, Search, Target, Bookmark, Sparkles, MapPin, CheckCircle2, AlertTriangle, IndianRupee, ShieldCheck } from 'lucide-react';
import { FlagIcon } from './FlagIcon';

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
    <div className="bg-white min-h-screen text-slate-900 py-5">


      <div className="max-w-7xl mx-auto px-5 mt-8 space-y-10">
        <div className="flex flex-col items-start px-2">
          {/* Back Button */}
          <button 
            onClick={onGoToMatches} 
            className="flex items-center gap-1.5 text-slate-500 hover:text-[#3686FF] font-medium text-[14px] transition-colors mb-4 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to matches
          </button>
          
          <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-100/50 text-[#3686FF] text-[12px] font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm">
            <Target className="w-4 h-4" />
            Generated from your profile
          </div>
          <h2 className="text-[28px] md:text-[36px] font-semibold text-[#111827] tracking-tight leading-tight">
            Your Preliminary Estimate
          </h2>
          <p className="text-[15px] md:text-[18px] text-slate-500 regular mt-2">
            Based on your academic profile and selected university details.
          </p>
        </div>

        {/* Selected University Details Bar */}
        <div className="flex items-center justify-between border border-slate-200 rounded-[8px] bg-white px-4 py-2.5 shadow-sm w-full mt-4">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[22px] rounded-[3px] overflow-hidden shadow-sm border border-black/10 flex-shrink-0">
              <FlagIcon countryCode={selectedMatch.countryCode || form.countries[0]} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-[15px] text-slate-900 leading-none">{selectedMatch.name}</span>
              <span className="text-[#3686FF] text-[13px] font-medium tracking-wide uppercase leading-none">{selectedMatch.countryCode || form.countries[0]}</span>
            </div>
          </div>
          <button onClick={onGoToMatches} className="flex items-center gap-1.5 text-[#3686FF] hover:text-blue-600 font-medium text-[13px] transition-colors ml-4 whitespace-nowrap">
            <Edit3 className="w-3.5 h-3.5" /> Edit Selection
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
            <button onClick={onAdvanceToCost} className="mt-6 w-full py-3 bg-[#449D00] text-white font-medium text-[16px] rounded-[16px] transition-colors shadow-md shadow-[#63b931]/20">
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
                <h3 className="font-medium  text-slate-800 text-[16px]">Admission Chance</h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[24px] font-semibold tracking-tight text-slate-900">
                  {admissionPct}%
                </span>
                <span className={`font-medium text-[16px] ${admissionBand.badgeClass.split(' ')[1] || 'text-slate-600'}`}>
                  - {admissionBand.label}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${admissionBand.badgeClass.split(' ')[0].replace('bg-', 'bg-') || 'bg-blue-500'}`} style={{ width: `${admissionPct}%` }}></div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Good GPA Match
                </div>
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Improve English bounds
                </div>
              </div>
            </div>
            <button onClick={onAdvanceToAdmission} className="mt-4 w-full py-3 bg-[#F89D35]  text-white font-medium text-[16px] rounded-[16px] transition-colors shadow-md shadow-[#ff9f43]/20">
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
                <h3 className="font-medium text-slate-800 text-[16px]">Visa Readiness</h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[24px] font-black tracking-tight text-slate-900">
                  {visaChance}%
                </span>
                <span className="font-medium text-sm text-blue-500">
                  - {visaLabel}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${visaChance}%` }}></div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strong Academics
                </div>
                <div className="flex items-center gap-2 text-[14px] font-regular text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Financial Proof Req.
                </div>
              </div>
            </div>
            <button onClick={onAdvanceToVisa} className="mt-4 w-full py-3 bg-[#3686FF] text-white font-medium text-[16px] rounded-[16px] transition-colors shadow-md shadow-blue-500/20">
              Improve Chance
            </button>
          </div>
        </div>

        {/* Improve Chances Banner */}
        <div className="relative bg-gradient-to-br from-[#fdfbf6] to-[#f4ead9] border border-[#e8dcc4] rounded-3xl p-6 overflow-hidden shadow-sm flex items-center">
          <div className="relative z-10 w-3/5">
            <h3 className="text-[32px] font-medium text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Improve Your Chances
            </h3>
            <p className="text-[16px] font-regular text-slate-600 mt-2 mb-3">             Follow these steps to boost your success rate.
            </p>
            <ul className="text-[16px] font-regular text-slate-800 space-y-1.5 mb-4 ml-1">
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-900 rounded-full" /> Increase IELTS target</li>
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-900 rounded-full" /> Apply for safer Unis</li>
            </ul>
            <button className="bg-[#3686FF]  text-white font-black text-[16px] px-6 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition-all">
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
              <h2 className="text-[20px] font-semibold text-slate-900">Recommended Universities</h2>
              <p className="text-[14px] font-regular text-slate-500">Based on your profile & budget</p>
            </div>
            <Link href="/matches" className="text-[#3686FF] text-[14px] font-regular hover:underline">See All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible pb-4 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 snap-x">
            {matches.slice(0, 3).map((uni, idx) => {
              const costUsd = Math.round(uni.currency === "NPR" ? (uni.tuitionFee || 22000) / USD_TO_NPR : (uni.tuitionFee || 22000));
              const costNpr = Math.round(costUsd * USD_TO_NPR);
              const matchScore = Math.max(70, Math.round((uni.admissionRate || 65) + (Math.random() * 10)));

              return (
                <div key={idx} className="min-w-[300px] bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm flex flex-col snap-center">
                  <div className="h-[140px] relative bg-slate-200">
                    <Image src={uni.banner || uni.logo || "/uni-default.webp"} alt={uni.name} fill className="object-cover" />
                    <div className="absolute inset-0 border-b border-black/10" />
                    <div className="absolute top-3 right-3 bg-white text-[#3686FF] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {matchScore}% Match
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-[46px] h-[46px] rounded-full border border-slate-100 overflow-hidden shadow-sm flex-shrink-0 bg-white flex items-center justify-center p-1.5">
                        <Image src={uni.logo || "/uni-default.webp"} width={40} height={40} alt="logo" className="object-contain w-full h-full" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[17px] text-slate-900 leading-tight mb-1 truncate max-w-[200px]">{uni.name}</h3>
                        <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5" /> {uni.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-5 mt-auto">
                      <div className="font-semibold text-[15px] text-slate-900">
                        NPR {(costNpr / 100000).toFixed(1)}L<span className="text-[12px] font-regular text-slate-500"> / year</span>
                      </div>
                      <span className={`text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm ${idx % 2 === 0 ? "bg-[#ff0000]" : "bg-[#4CAF50]"}`}>
                        {idx % 2 === 0 ? "Most Popular" : "Lowest Fees"}
                      </span>
                    </div>

                    <button className="w-full bg-[#3686FF] hover:bg-blue-600 text-white font-semibold text-[14px] py-3 rounded-[12px] shadow-sm mb-3 flex items-center justify-center gap-1.5 transition-all">
                      Select University <span>&rarr;</span>
                    </button>

                    <button className="w-full text-slate-400 hover:text-slate-600 font-semibold text-[13px] transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>



      </div>
    </div>
  );
}
