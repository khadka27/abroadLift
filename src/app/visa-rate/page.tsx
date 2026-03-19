"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import countryList from 'react-select-country-list';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  History,
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign } from "lucide-react";

interface VisaCheck {
  id: string;
  nationality: string;
  destination: string;
  degreeLevel: string;
  fundsAvailable: number;
  ieltsScore: number | null;
  pastRejections: number;
  successRate: number;
  createdAt: string;
}

const COUNTRIES = ["USA", "Canada", "UK", "Australia", "Germany", "Ireland", "Netherlands", "Switzerland"];
const DEGREES = ["Bachelors", "Masters", "PhD", "Diploma", "Other"];

export default function VisaRatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const options = useMemo(() => countryList().getData(), []);

  const [history, setHistory] = useState<VisaCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentCheck, setCurrentCheck] = useState<VisaCheck | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nationality: "",
    destination: "USA",
    degreeLevel: "Masters",
    fundsAvailable: 0,
    ieltsScore: 0,
    pastRejections: 0,
  });

  const fetchHistory = useCallback(async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/visa");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        if (data.length > 0 && !currentCheck) {
          setCurrentCheck(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [currentCheck]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/visa-rate");
    } else if (status === "authenticated" && session) {
      fetchHistory();
    }
  }, [status, session, router, fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch("/api/visa", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const result = await res.json();
        setCurrentCheck(result);
        setEditingId(null);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (check: VisaCheck) => {
    setEditingId(check.id);
    setFormData({
      nationality: check.nationality,
      destination: check.destination,
      degreeLevel: check.degreeLevel,
      fundsAvailable: check.fundsAvailable,
      ieltsScore: check.ieltsScore || 0,
      pastRejections: check.pastRejections,
    });
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "loading" || fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your visa history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Success Visualization */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
            <div className="w-40 h-10 relative mb-4">
              <NextImage src="/logo.png" alt="AbroadLift Logo" fill className="object-contain object-left" />
            </div>
            <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 rounded-full font-bold text-xs tracking-widest uppercase">
              Visa AI Predictor
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Check Your <span className="text-blue-600">Approval Rate.</span>
            </h1>
              <p className="text-slate-500 text-lg max-w-lg leading-relaxed font-medium">
                Our rule-based engine factors in funds, destination risk, and academic history to estimate your visa success chances.
              </p>
            </div>

            {currentCheck ? (
              <Card className="p-8 lg:p-12 bg-white rounded-[40px] border-none shadow-2xl shadow-blue-500/10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Estimated Probability</p>
                    <h2 className="text-3xl font-black text-slate-900">{currentCheck.destination} Student Visa</h2>
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <TrendingUp className="w-10 h-10" />
                  </div>
                </div>

                <div className="relative pt-4">
                  <div className="flex items-end justify-between mb-4">
                     <span className={`text-6xl font-black ${currentCheck.successRate >= 70 ? "text-emerald-500" : currentCheck.successRate >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                       {currentCheck.successRate}%
                     </span>
                     <div className="text-right">
                       <p className="text-xs font-bold text-slate-400 uppercase">Assessment</p>
                       <p className={`font-black uppercase tracking-wider ${currentCheck.successRate >= 70 ? "text-emerald-500" : currentCheck.successRate >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                         {currentCheck.successRate >= 70 ? "Strong Chance" : currentCheck.successRate >= 40 ? "Moderate Chance" : "High Risk"}
                       </p>
                     </div>
                  </div>
                  <Progress value={currentCheck.successRate} className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${currentCheck.successRate >= 70 ? "bg-emerald-500" : currentCheck.successRate >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${currentCheck.successRate}%` }}
                    />
                  </Progress>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Funds</p>
                    <p className="font-black text-slate-900">${currentCheck.fundsAvailable.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Eng. Proficiency</p>
                    <p className="font-black text-slate-900">{currentCheck.ieltsScore || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Level</p>
                    <p className="font-black text-slate-900 truncate">{currentCheck.degreeLevel}</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-8 mt-12! text-white flex items-center justify-between group">
                   <div>
                     <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Ready to apply?</p>
                     <p className="text-lg font-bold">Connect with an Expert</p>
                   </div>
                   <Link href="/contact" className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                     <ArrowRight className="w-6 h-6" />
                   </Link>
                </div>
              </Card>
            ) : (
              <div className="aspect-video bg-white rounded-[40px] flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200">
                <ShieldCheck className="w-20 h-20 text-blue-100 mb-6" />
                <h3 className="text-2xl font-black text-slate-900">No Check Performed Yet</h3>
                <p className="text-slate-500 max-w-xs mt-2 font-medium">Fill out the form to see your estimated visa approval rate instantly.</p>
              </div>
            )}
          </div>

          {/* Right Column - Form & History */}
          <div className="w-full lg:w-[450px] space-y-8">
            <Card className="p-8 bg-white rounded-[40px] border-none shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-black text-slate-900">{editingId ? "Update Details" : "New Visa Check"}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nationality</label>
                  <select 
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    required
                    className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                  >
                    <option value="" disabled>Select nationality</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                    <select 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Level</label>
                    <select 
                      value={formData.degreeLevel}
                      onChange={(e) => setFormData({...formData, degreeLevel: e.target.value})}
                      className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                    >
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Available Funds (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.fundsAvailable}
                      onChange={(e) => setFormData({...formData, fundsAvailable: parseFloat(e.target.value)})}
                      required
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">IELTS / English</label>
                    <Input 
                      type="number" 
                      step="0.5" 
                      placeholder="e.g. 6.5" 
                      value={formData.ieltsScore}
                      onChange={(e) => setFormData({...formData, ieltsScore: parseFloat(e.target.value)})}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Past Rejections</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.pastRejections}
                      onChange={(e) => setFormData({...formData, pastRejections: parseInt(e.target.value)})}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/25 active:scale-95 transition-all mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : editingId ? (
                    "Update & Re-calculate"
                  ) : (
                    "Calculate Success Rate"
                  )}
                </Button>
                
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({ nationality: "", destination: "USA", degreeLevel: "Masters", fundsAvailable: 0, ieltsScore: 0, pastRejections: 0 }); }}
                    className="w-full text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors"
                  >
                    Cancel Editing
                  </button>
                )}
              </form>
            </Card>

            {/* History Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Your History
                </h3>
              </div>

              <div className="space-y-4">
                {history.map((check) => (
                  <div 
                    key={check.id}
                    className={`group p-5 rounded-[32px] bg-white border-2 transition-all cursor-pointer ${currentCheck?.id === check.id ? "border-blue-600 shadow-lg shadow-blue-500/5 scale-[1.02]" : "border-slate-50 hover:border-slate-200"}`}
                    onClick={() => setCurrentCheck(check)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black ${check.successRate >= 70 ? "bg-emerald-50 text-emerald-600" : check.successRate >= 40 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
                          {check.successRate}%
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{check.destination}</p>
                          <p className="text-[10px] font-bold text-slate-400 capitalize">{check.degreeLevel} • {check.nationality}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(check); }}
                          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-center text-slate-400 font-bold py-10 text-sm">No checks recorded yet.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
