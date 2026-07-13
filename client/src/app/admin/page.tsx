"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { format } from "date-fns";

interface DashboardData {
  metrics: {
    totalStudents: number;
    totalApplications: number;
    acceptedOffers: number;
    rejectedApplications: number;
    pendingReviews: number;
    visaAssessments: number;
    avgVisaSuccess: number;
  };
  recentRegistrations: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  applicationTrend: Array<{
    name: string;
    applications: number;
    visas: number;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  const { metrics, recentRegistrations, applicationTrend } = data;
 
  const statCards = [
    {
      label: "Total Students",
      value: metrics.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/80 border border-blue-100/30",
    },
    {
      label: "Active Applications",
      value: metrics.totalApplications,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50/80 border border-indigo-100/30",
    },
    {
      label: "Pending Reviews",
      value: metrics.pendingReviews,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50/80 border border-amber-100/30",
    },
    {
      label: "Avg Visa Success",
      value: `${metrics.avgVisaSuccess}%`,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50/80 border border-emerald-100/30",
    },
  ];
 
  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10 selection:bg-[#3366FF]/10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
            Real-time analytics, administrative indicators, and active registrations.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 shrink-0">
          <Calendar className="w-[17px] h-[17px] text-slate-400" />
          <span className="text-xs font-black text-slate-700 tracking-wide">
            {format(new Date(), "MMMM d, yyyy")}
          </span>
        </div>
      </div>
 
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="p-6 rounded-[28px] border border-slate-100/80 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.03)] bg-white hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-5px_rgba(51,102,255,0.07)] hover:border-blue-500/10 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-[16px] ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className="w-5.5 h-5.5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
 
      {/* Charts & Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-8 rounded-[32px] border border-slate-100 shadow-[0_12px_35px_-5px_rgba(0,0,0,0.03)] bg-white">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Application & Visa Trends</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Platform interactions across the last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-500">Apps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Visas</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3366FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3366FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3366FF" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="visas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
 
        {/* Application Outcomes */}
        <Card className="p-8 rounded-[32px] border border-slate-100/80 shadow-[0_12px_35px_-5px_rgba(0,0,0,0.03)] bg-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/3 rounded-full blur-[50px] pointer-events-none" />
          <h3 className="text-lg font-extrabold text-slate-900 mb-7 relative z-10">Application Outcomes</h3>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100/85 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50/80 border border-emerald-100/30 flex items-center justify-center text-emerald-600 shadow-xs">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <span className="font-semibold text-slate-600 text-sm">Accepted Offers</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900">{metrics.acceptedOffers}</span>
            </div>
  
            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100/85 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50/80 border border-rose-100/30 flex items-center justify-center text-rose-600 shadow-xs">
                  <XCircle className="w-4.5 h-4.5" />
                </div>
                <span className="font-semibold text-slate-600 text-sm">Rejected</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900">{metrics.rejectedApplications}</span>
            </div>
  
            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100/85 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50/80 border border-amber-100/30 flex items-center justify-center text-amber-600 shadow-xs">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <span className="font-semibold text-slate-600 text-sm">Pending</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900">{metrics.pendingReviews}</span>
            </div>
          </div>
          
          <div className="mt-7 pt-5 border-t border-slate-100 relative z-10 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Total Processed</span>
            <span className="text-sm font-extrabold text-blue-600">{metrics.acceptedOffers + metrics.rejectedApplications}</span>
          </div>
        </Card>
      </div>
 
      {/* Recent Activity Table */}
      <Card className="rounded-[32px] border border-slate-100 shadow-[0_12px_35px_-5px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
        <div className="p-8 border-b border-slate-100/70 flex justify-between items-center bg-[#fafbfc]/50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Recent Registrations</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1">Newly joined student accounts</p>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/60 flex items-center justify-center font-extrabold text-blue-600">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-semibold text-slate-500">{student.email}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">
                      {format(new Date(student.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold text-sm">
                    No recent registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
