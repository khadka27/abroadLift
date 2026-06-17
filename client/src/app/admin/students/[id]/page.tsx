"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Globe,
  MapPin,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Ban,
  CheckCircle,
  FileText,
  AlertTriangle,
  Trash2,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!confirm(`Are you sure you want to ${student.isActive ? 'suspend' : 'reactivate'} this account?`)) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_STATUS", isActive: !student.isActive }),
      });
      if (res.ok) {
        setStudent({ ...student, isActive: !student.isActive });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async () => {
    if (!noteContent.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_NOTE", content: noteContent }),
      });
      if (res.ok) {
        const data = await res.json();
        setStudent({
          ...student,
          adminNotes: [{ ...data.note, adminName: "You" }, ...student.adminNotes]
        });
        setNoteContent("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("CRITICAL WARNING: Are you absolutely sure you want to permanently delete this student account? This action cannot be undone and will erase all applications, profiles, and associated data.")) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/students");
      }
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {student.name}
            </h1>
            <Badge className={student.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}>
              {student.isActive ? "ACTIVE" : "SUSPENDED"}
            </Badge>
          </div>
          <p className="text-slate-500 font-medium text-lg mt-1">
            @{student.username} • Joined {format(new Date(student.createdAt), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStatus}
            disabled={updating}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              student.isActive 
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {student.isActive ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {student.isActive ? "Suspend Account" : "Reactivate Account"}
          </button>
          
          <button
            onClick={deleteAccount}
            disabled={updating}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Personal & Academic Info */}
        <div className="xl:col-span-1 space-y-8">
          
          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
            <h3 className="text-xl font-black text-slate-900 mb-6">Contact & Origin</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="font-medium text-slate-700">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="font-medium text-slate-700">{student.phoneE164 || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nationality</p>
                  <p className="font-medium text-slate-700">{student.profile?.nationality || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Residence</p>
                  <p className="font-medium text-slate-700">{student.profile?.currentCountry || "Unknown"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-indigo-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px]" />
            <h3 className="text-xl font-black mb-6 relative z-10">Academic Snapshot</h3>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">GPA</p>
                <p className="text-3xl font-black mt-1">{student.profile?.gpa || "N/A"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">English Score</p>
                <p className="text-3xl font-black mt-1">{student.profile?.englishScore || "N/A"}</p>
              </div>
              <div className="col-span-2 bg-white/5 p-4 rounded-2xl mt-2">
                <p className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">Highest Education</p>
                <p className="text-lg font-bold mt-1">{student.profile?.highestEducation || "Not specified"}</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Middle Column: Applications & Visas */}
        <div className="xl:col-span-1 space-y-8">
          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">University Applications</h3>
              <Badge className="bg-slate-100 text-slate-600 border-none">{student.applications.length}</Badge>
            </div>
            
            <div className="space-y-4">
              {student.applications.map((app: any) => (
                <div key={app.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{app.university.name}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">{app.university.country}</p>
                    </div>
                    <Badge className={
                      app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 border-none' :
                      app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border-none' :
                      'bg-indigo-100 text-indigo-700 border-none'
                    }>
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-widest">
                    Applied on {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
              {student.applications.length === 0 && (
                <div className="py-8 text-center text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                  No applications submitted yet.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Visa Assessments</h3>
              <Badge className="bg-slate-100 text-slate-600 border-none">{student.visaChecks.length}</Badge>
            </div>

            <div className="space-y-4">
              {student.visaChecks.map((check: any) => (
                <div key={check.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${
                      check.successRate >= 70 ? 'bg-emerald-100 text-emerald-600' :
                      check.successRate >= 40 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {check.successRate}%
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{check.destination}</p>
                      <p className="text-xs font-bold text-slate-500">{check.degreeLevel}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {format(new Date(check.createdAt), "MMM d")}
                  </p>
                </div>
              ))}
              {student.visaChecks.length === 0 && (
                <div className="py-8 text-center text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                  No visa checks performed.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Admin Notes & Timeline */}
        <div className="xl:col-span-1 space-y-8">
          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-amber-50 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Internal Notes</h3>
            </div>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {student.adminNotes.map((note: any) => (
                <div key={note.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{note.content}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.adminName}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {format(new Date(note.createdAt), "MMM d, HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              {student.adminNotes.length === 0 && (
                <p className="text-center text-amber-600/50 font-medium py-4">No internal notes added yet.</p>
              )}
            </div>

            <div className="relative">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a private note about this student..."
                className="w-full h-24 bg-white border border-amber-200 rounded-2xl p-4 pr-12 text-sm font-medium outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 resize-none transition-all"
              />
              <button 
                onClick={addNote}
                disabled={!noteContent.trim() || updating}
                className="absolute right-3 bottom-3 w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
