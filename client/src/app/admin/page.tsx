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
      bg: "bg-blue-50",
    },
    {
      label: "Active Applications",
      value: metrics.totalApplications,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Pending Reviews",
      value: metrics.pendingReviews,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Avg Visa Success",
      value: `${metrics.avgVisaSuccess}%`,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Real-time insights and administrative metrics
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-bold text-slate-600">
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
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="p-6 rounded-[24px] border-none shadow-xl shadow-slate-200/50 bg-white hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 mt-2">
                    {stat.value}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts & Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900">Application & Visa Trends</h3>
            <p className="text-sm font-medium text-slate-500">Last 6 months activity</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="visas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Application Outcomes */}
        <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px]" />
          <h3 className="text-xl font-black mb-8 relative z-10">Application Outcomes</h3>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-300">Accepted Offers</span>
              </div>
              <span className="text-2xl font-black text-white">{metrics.acceptedOffers}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <XCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-300">Rejected</span>
              </div>
              <span className="text-2xl font-black text-white">{metrics.rejectedApplications}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-300">Pending</span>
              </div>
              <span className="text-2xl font-black text-white">{metrics.pendingReviews}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-bold">Total Processed</span>
              <span className="font-black">{metrics.acceptedOffers + metrics.rejectedApplications}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900">Recent Registrations</h3>
            <p className="text-sm font-medium text-slate-500">Newly joined students</p>
          </div>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500">{student.email}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">
                      {format(new Date(student.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold">
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
