"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  GraduationCap, 
  Search, 
  ChevronRight, 
  Globe, 
  X,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
  profile: {
    nationality: string | null;
    currentCountry: string | null;
    gpa: number | null;
  } | null;
  applications: Array<{
    id: string;
    status: string;
    university: {
      name: string;
      country: string;
    };
  }>;
  visaChecks: Array<{
    id: string;
    destination: string;
    successRate: number;
    createdAt: string;
  }>;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
      } else {
        fetchStudents();
      }
    }
  }, [status, session, router]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalApps = students.reduce((acc, s) => acc + s.applications.length, 0);
    const avgVisaRate = totalStudents > 0 
      ? Math.round(students.reduce((acc, s) => acc + (s.visaChecks[0]?.successRate || 0), 0) / totalStudents)
      : 0;

    return [
      { label: "Total Students", value: totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Applications", value: totalApps, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Avg. Success Rate", value: `${avgVisaRate}%`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];
  }, [students]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Initializing Administrative Secure Environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <Badge className="bg-blue-600 text-white border-none px-4 py-1 rounded-full font-black text-[10px] tracking-widest uppercase">
              Management Portal
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Student <span className="text-blue-600">Central.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Monitor candidate progression, admission applications, and visa probability metrics in real-time.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Table Container */}
          <div className="flex-1 w-full bg-white rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student / User</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Origin</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Process Status</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Visa Success</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedStudent?.id === student.id ? "bg-blue-50/30" : ""}`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1">{student.name}</p>
                            <p className="text-xs font-bold text-slate-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                           <Globe className="w-4 h-4 text-slate-300" />
                           <span className="font-bold text-slate-700 text-sm">{student.profile?.nationality || "Not set"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex flex-wrap gap-2">
                          {student.applications.length > 0 ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-bold">
                              {student.applications.length} Active App{student.applications.length > 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-400 border-none shadow-none font-bold">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        {student.visaChecks.length > 0 ? (
                           <div className="flex items-center gap-2">
                              <div className="text-sm font-black text-slate-900">{student.visaChecks[0].successRate}%</div>
                              <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full ${student.visaChecks[0].successRate >= 70 ? 'bg-emerald-500' : student.visaChecks[0].successRate >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                    style={{ width: `${student.visaChecks[0].successRate}%` }}
                                 />
                              </div>
                           </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-300">No data</span>
                        )}
                      </td>
                      <td className="px-8 py-4">
                         <span className="text-xs font-bold text-slate-500">{new Date(student.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold">No students found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Sidebar / Panel */}
          {selectedStudent ? (
            <div className="w-full xl:w-[450px] sticky top-28 animate-in slide-in-from-right-8 duration-500">
               <Card className="bg-slate-900 text-white rounded-[40px] border-none shadow-2xl overflow-hidden p-8 lg:p-10 space-y-10">
                  <div className="flex items-start justify-between">
                     <div className="space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-blue-500/20">
                          {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-3xl font-black">{selectedStudent.name}</h3>
                           <p className="text-blue-400 font-bold mb-4">@{selectedStudent.username}</p>
                           <Badge className="bg-white/10 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                             Student Entity
                           </Badge>
                        </div>
                     </div>
                     <button 
                        onClick={() => setSelectedStudent(null)}
                        className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                     >
                        <X className="w-5 h-5 text-slate-400" />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 rounded-3xl p-5 space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Origin</p>
                        <p className="font-bold text-lg">{selectedStudent.profile?.nationality || "N/A"}</p>
                     </div>
                     <div className="bg-white/5 rounded-3xl p-5 space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Current GPA</p>
                        <p className="font-bold text-lg">{selectedStudent.profile?.gpa || "N/A"}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white/50">University Applications</h4>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <GraduationCap className="w-4 h-4" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        {selectedStudent.applications.map((app) => (
                           <div key={app.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/5 transition-colors">
                              <div>
                                 <p className="font-bold text-sm leading-tight group-hover:text-blue-400 transition-colors">{app.university.name}</p>
                                 <p className="text-[10px] text-white/40 font-bold mt-1 uppercase">{app.university.country}</p>
                              </div>
                              <Badge className={`border-none ${app.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'} font-black text-[9px] px-2.5`}>
                                 {app.status}
                              </Badge>
                           </div>
                        ))}
                        {selectedStudent.applications.length === 0 && (
                           <p className="text-center text-white/30 text-xs font-bold py-4 italic border-2 border-dashed border-white/5 rounded-3xl">No admission processes initiated.</p>
                        )}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white/50">Visa Eligibility History</h4>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                           <ShieldCheck className="w-4 h-4" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        {selectedStudent.visaChecks.map((check) => (
                           <div key={check.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${check.successRate >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {check.successRate}%
                                 </div>
                                 <div>
                                    <p className="font-bold text-sm">{check.destination}</p>
                                    <p className="text-[10px] text-white/40 font-bold">{new Date(check.createdAt).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              <TrendingUp className="w-4 h-4 text-white/20" />
                           </div>
                        ))}
                        {selectedStudent.visaChecks.length === 0 && (
                           <p className="text-center text-white/30 text-xs font-bold py-4 italic border-2 border-dashed border-white/5 rounded-3xl">No visa assessments performed.</p>
                        )}
                     </div>
                  </div>

                  <div className="pt-6">
                     <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-xl shadow-blue-500/20">
                        Process Complete Report
                     </Button>
                  </div>
               </Card>
            </div>
          ) : (
             <div className="hidden xl:flex w-[450px] h-[700px] border-2 border-dashed border-slate-200 rounded-[40px] flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                   <Users className="w-10 h-10 opacity-20" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">No Entity Selected</h4>
                <p className="text-sm font-medium leading-relaxed">Select a student from the active registry to view their comprehensive academic and immigration profile.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
