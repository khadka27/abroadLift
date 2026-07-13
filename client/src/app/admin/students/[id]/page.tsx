/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Send,
  Briefcase,
  DollarSign,
  User,
  Heart,
  Settings,
  Activity,
  Award,
  BookOpen,
  Info,
  Clock,
  ExternalLink,
  MessageSquare,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "finances" | "history">("overview");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "SUSPEND" | "DELETE" | null;
  }>({ isOpen: false, type: null });

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

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const triggerToggleStatus = () => setConfirmModal({ isOpen: true, type: "SUSPEND" });

  const executeToggleStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_STATUS", isActive: !student.isActive }),
      });
      if (res.ok) {
        setStudent({ ...student, isActive: !student.isActive });
        setConfirmModal({ isOpen: false, type: null });
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

  const triggerDeleteAccount = () => setConfirmModal({ isOpen: true, type: "DELETE" });

  const executeDeleteAccount = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConfirmModal({ isOpen: false, type: null });
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

  const p = student.profile || {};

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 selection:bg-[#3366FF]/10 font-sans">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center select-none">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-4.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Registry
          </button>
          
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              {student.name}
            </h1>
            <Badge className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase border ${student.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200/50" : "bg-rose-50 text-rose-600 border-rose-200/50"}`}>
              {student.isActive ? "ACTIVE" : "SUSPENDED"}
            </Badge>
          </div>
          <p className="text-slate-400 font-semibold text-xs mt-2.5">
            @{student.username} • Account Created {format(new Date(student.createdAt), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerToggleStatus}
            disabled={updating}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-xs uppercase tracking-wider border shadow-xs cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              student.isActive 
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100/50 border-rose-250/20"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100/50 border-emerald-250/20"
            }`}
          >
            {student.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {student.isActive ? "Suspend Account" : "Reactivate Account"}
          </button>
          
          <button
            onClick={triggerDeleteAccount}
            disabled={updating}
            className="h-10 px-4 flex items-center justify-center rounded-xl bg-red-50 text-red-650 hover:bg-red-500 hover:text-white border border-red-200/50 shadow-xs cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-xs uppercase tracking-wider"
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Calculated Success Odds & Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        <Card className="p-6 rounded-[28px] border border-white/5 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-650 text-white relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-200/80 tracking-widest leading-none">Admission Chance</p>
              <h4 className="text-3xl font-extrabold mt-3.5 leading-none">
                {p.admissionProb ? `${Math.round(p.admissionProb)}%` : "N/A"}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <Award className="w-5.5 h-5.5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-[28px] border border-white/5 shadow-xl bg-gradient-to-br from-emerald-650 to-teal-600 text-white relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-250/80 tracking-widest leading-none">Visa Success Odds</p>
              <h4 className="text-3xl font-extrabold mt-3.5 leading-none">
                {p.visaSuccessProb ? `${Math.round(p.visaSuccessProb)}%` : "N/A"}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <ShieldCheck className="w-5.5 h-5.5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-[28px] border border-white/5 shadow-xl bg-gradient-to-br from-slate-900 to-[#1e293b] text-white relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-350/80 tracking-widest leading-none">Est. Annual Cost</p>
              <h4 className="text-3xl font-extrabold mt-3.5 leading-none">
                {p.estimatedAnnualCost ? `$${p.estimatedAnnualCost.toLocaleString()}` : "N/A"}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <DollarSign className="w-5.5 h-5.5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex border-b border-slate-200 pb-px overflow-x-auto gap-2">
        {[
          { id: "overview", label: "Overview", icon: User },
          { id: "academics", label: "Academics & Tests", icon: GraduationCap },
          { id: "finances", label: "Preferences & Finance", icon: DollarSign },
          { id: "history", label: "Applications & History", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm tracking-wide transition-all whitespace-nowrap -mb-px ${
                isActive 
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/20 rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tabbed Grid Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Left/Middle: Tab Content (Takes 2 Cols on large screens) */}
        <div className="xl:col-span-2 space-y-8">
          
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Profile Bio / User Info */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <p className="font-bold text-slate-700 mt-1">{student.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Middle Name</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.middleName || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <p className="font-semibold text-slate-700 mt-1 break-all">{student.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <p className="font-semibold text-slate-700 mt-1">{student.phoneE164 || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.dob || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.gender || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Marital Status</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.maritalStatus || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nationality</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.nationality || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Citizenship Country</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.citizenshipCountry || "—"}</p>
                  </div>
                </div>
              </Card>

              {/* Address / Contact Origin */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  Address & Locations
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Residence</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.currentCountry || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address Line</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.addressLine || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">City / Town</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.cityTown || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Province / State</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.provinceState || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Postal / ZIP Code</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.postalZipCode || "—"}</p>
                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Emergency Contact
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Name</label>
                    <p className="font-bold text-slate-700 mt-1">{p.emergencyName || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relation</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.emergencyRelation || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.emergencyPhone || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.emergencyEmail || "—"}</p>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {activeTab === "academics" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Academic Details */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  Academic History
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Highest Education</label>
                    <p className="font-bold text-slate-700 mt-1">{p.highestEducation || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passing Year</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.passingYear || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">GPA / Percentage</label>
                    <p className="font-bold text-slate-800 mt-1 text-lg">{p.gpa || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Backlogs</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.backlogs ?? 0}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Study Gap (Years)</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.studyGap ?? 0}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Graduated from Country</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.countryOfEducation || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Graduated Status</label>
                    <p className="mt-1">
                      {p.graduatedInstitution ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold">Graduated</Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-600 border-amber-200 font-bold">In Progress</Badge>
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Language & Aptitude Exams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* English test */}
                <Card className="p-6 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                  <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    English Proficiency
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Has English Test</span>
                      <span className="text-sm font-bold text-slate-700">{p.hasEnglishTest ? "Yes" : "No"}</span>
                    </div>
                    {p.hasEnglishTest && (
                      <>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">Test Type</span>
                          <span className="text-sm font-bold text-slate-700">{p.testType || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">Overall Score</span>
                          <span className="text-sm font-extrabold text-indigo-600">{p.englishScore || "—"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Aptitude test */}
                <Card className="p-6 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                  <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    Aptitude Tests
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Aptitude Test</span>
                      <span className="text-sm font-bold text-slate-700">{p.aptitudeTest || "NONE"}</span>
                    </div>
                    
                    {p.aptitudeTest === "GRE" && (
                      <>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">GRE Verbal</span>
                          <span className="text-sm font-bold text-slate-700">{p.greVerbal || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">GRE Quantitative</span>
                          <span className="text-sm font-bold text-slate-700">{p.greQuant || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">GRE AWA</span>
                          <span className="text-sm font-bold text-slate-700">{p.greAwa || "—"}</span>
                        </div>
                      </>
                    )}

                    {p.aptitudeTest === "GMAT" && (
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">GMAT Total Score</span>
                        <span className="text-sm font-bold text-slate-700">{p.gmatTotal || "—"}</span>
                      </div>
                    )}
                  </div>
                </Card>

              </div>

              {/* Work Experience */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  Work Experience
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Status</label>
                    <p className="font-bold text-slate-700 mt-1">{p.workStatus || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.companyName || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.jobTitle || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience (Years)</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.workExperience ?? 0} Years</p>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {activeTab === "finances" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Financial Status */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Financial Snapshot
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred Budget Currency</label>
                    <p className="font-bold text-slate-700 mt-1">{p.currency || "USD"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yearly Budget limit</label>
                    <p className="font-extrabold text-slate-800 mt-1 text-lg">
                      {p.yearlyBudget ? `${p.yearlyBudget.toLocaleString()} ${p.currency || "USD"}` : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Bank Balance</label>
                    <p className="font-extrabold text-slate-800 mt-1 text-lg">
                      {p.bankBalance ? `${p.bankBalance.toLocaleString()} ${p.currency || "USD"}` : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sponsor Source / Type</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.sponsorType || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sponsor Annual Income</label>
                    <p className="font-semibold text-slate-700 mt-1">
                      {p.sponsorIncome ? `${p.sponsorIncome.toLocaleString()} ${p.currency || "USD"}` : "—"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  Study Preferences
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred Country</label>
                    <p className="font-bold text-slate-700 mt-1">{p.preferredCountry || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred Degree Level</label>
                    <p className="font-bold text-slate-700 mt-1">{p.degreeLevel || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Field of Study</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.field || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Program</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.program || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Study Intake</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.intake || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred Institution Type</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.univType || "Any"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred City Type</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.cityType || "Any"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Course Duration Pref.</label>
                    <p className="font-semibold text-slate-700 mt-1">{p.duration ? `${p.duration} Years` : "Any"}</p>
                  </div>
                </div>
              </Card>

              {/* Requirement Checklist Checklist */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-500" />
                  Document & Readiness Checklist
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.passportReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.passportReady ? "✓" : "—"}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Passport</p>
                      <p className="text-xs font-bold text-slate-700">{p.passportReady ? "Ready" : "Not Ready"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.docsReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.docsReady ? "✓" : "—"}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Documents</p>
                      <p className="text-xs font-bold text-slate-700">{p.docsReady ? "All Uploaded" : "Pending"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.testDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.testDone ? "✓" : "—"}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">English Test</p>
                      <p className="text-xs font-bold text-slate-700">{p.testDone ? "Completed" : "Not Taken"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.scholarshipNeeded ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.scholarshipNeeded ? "✓" : "—"}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Scholarship</p>
                      <p className="text-xs font-bold text-slate-700">{p.scholarshipNeeded ? "Required" : "No request"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.loanWilling ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.loanWilling ? "✓" : "—"}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Education Loan</p>
                      <p className="text-xs font-bold text-slate-700">{p.loanWilling ? "Willing" : "Not needed"}</p>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Applications List */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    University Applications
                  </h3>
                  <Badge className="bg-slate-100 text-slate-600 border-none font-bold">
                    {student.applications.length} Total
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {student.applications.map((app: any) => (
                    <div key={app.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-slate-900">{app.university.name}</p>
                          <p className="text-xs font-bold text-slate-500 mt-1">{app.university.city}, {app.university.country}</p>
                        </div>
                        <Badge className={
                          app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 border-none font-bold' :
                          app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border-none font-bold' :
                          'bg-indigo-100 text-indigo-700 border-none font-bold'
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

              {/* Visa Checks */}
              <Card className="p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    Visa Assessments
                  </h3>
                  <Badge className="bg-slate-100 text-slate-600 border-none font-bold">
                    {student.visaChecks.length} Check(s)
                  </Badge>
                </div>

                <div className="space-y-4">
                  {student.visaChecks.map((check: any) => (
                    <div key={check.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
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
                        {format(new Date(check.createdAt), "MMM d, yyyy")}
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
          )}

        </div>

        {/* Right Column: Sticky Administrative Info & Notes */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Audit & Settings QuickCard */}
          <Card className="p-6 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Registry Info
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase">Student ID</span>
                <code className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{student.id.substring(0, 8)}...</code>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase">Account Status</span>
                <span className={`text-xs font-extrabold ${student.isActive ? "text-emerald-500" : "text-rose-500"}`}>
                  {student.isActive ? "Active / Allowed" : "Suspended"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase">Last Logged In</span>
                <span className="text-xs font-semibold text-slate-700">
                  {student.lastLoginAt ? format(new Date(student.lastLoginAt), "MMM d, yyyy HH:mm") : "Never"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase">WhatsApp Ready</span>
                <span className="text-xs font-bold text-slate-700">{student.prefersWhatsApp ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Terms Accepted</span>
                <span className={`text-xs font-extrabold ${student.acceptedTerms ? "text-blue-600" : "text-slate-500"}`}>
                  {student.acceptedTerms ? "Yes (Agreed)" : "No"}
                </span>
              </div>
            </div>
          </Card>

          {/* Internal Notes */}
          <Card className="p-6 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-amber-50 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Internal Notes</h3>
            </div>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {student.adminNotes.map((note: any) => (
                <div key={note.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 animate-in slide-in-from-bottom-2 duration-300">
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

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === "DELETE" ? "Permanently Delete Student?" : `${student?.isActive ? "Suspend" : "Reactivate"} Account?`}
        description={
          confirmModal.type === "DELETE"
            ? "CRITICAL WARNING: Are you absolutely sure you want to permanently delete this student account? This action cannot be undone and will erase all applications, profiles, and associated data."
            : `Are you sure you want to ${student?.isActive ? "suspend" : "reactivate"} this student's account? ${student?.isActive ? "They will lose access to the platform." : "They will regain access to the platform."}`
        }
        confirmText={confirmModal.type === "DELETE" ? "Delete Permanently" : student?.isActive ? "Suspend Account" : "Reactivate"}
        isDestructive={confirmModal.type === "DELETE" || (confirmModal.type === "SUSPEND" && student?.isActive)}
        onConfirm={() => {
          if (confirmModal.type === "DELETE") executeDeleteAccount();
          if (confirmModal.type === "SUSPEND") executeToggleStatus();
        }}
        onCancel={() => setConfirmModal({ isOpen: false, type: null })}
        isLoading={updating}
      />
    </div>
  );
}
