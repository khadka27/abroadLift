"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, MapPin, Award, Users, Calendar, Coins, Globe, ArrowLeft, 
  ExternalLink, GraduationCap, Loader2, AlertCircle, CheckCircle, FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNPRDevanagari, getRateToNpr } from "@/lib/currency";

interface School {
  _id: string;
  school_id: number;
  name: string;
  about?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  country_code?: string;
  founded_in?: number;
  institution_type?: string;
  logo?: {
    url?: string;
    url_thumbnail?: string;
  };
  banner?: {
    url?: string;
    url_thumbnail?: string;
  };
  total_number_of_students?: number;
  number_of_international_students?: number;
  school_rank?: number;
  cost_of_living?: string | number;
  website?: string;
  email?: string;
  phone?: string;
  conditional_acceptance?: boolean;
  conditional_acceptance_text?: string;
  photos?: Array<{
    id: number;
    url: string;
    url_thumbnail: string;
    url_optimized: string;
    url_optimized_small: string;
  }>;
}

interface Program {
  _id: string;
  program_id: number;
  school_id: number;
  name: string;
  description?: string;
  level?: string;
  level_text?: string;
  length_breakdown?: string;
  delivery_method?: string;
  tuition?: string | number;
  application_fee?: string | number;
  requirements?: {
    min_gpa?: string | number;
    min_ielts_average?: string | number;
    min_toefl_total?: string | number;
    min_duolingo_score?: string | number;
    other_requirements?: string[];
  };
}

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params?.id as string;

  const [school, setSchool] = useState<School | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Program filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  useEffect(() => {
    if (!schoolId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [schoolRes, programsRes] = await Promise.all([
          fetch(`/api/schools/${schoolId}`),
          fetch(`/api/programs/school/${schoolId}`)
        ]);

        if (!schoolRes.ok) throw new Error("Failed to load school details.");
        if (!programsRes.ok) throw new Error("Failed to load school programs.");

        const schoolData = await schoolRes.json();
        const programsData = await programsRes.json();

        if (schoolData.success && schoolData.data) {
          setSchool(schoolData.data);
        } else {
          throw new Error("School not found.");
        }

        if (programsData.success && programsData.data) {
          setPrograms(programsData.data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [schoolId]);

  // Filter programs
  const filteredPrograms = programs.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (selectedLevel !== "All Levels") {
      if (!p.level_text?.toLowerCase().includes(selectedLevel.toLowerCase()) && 
          !p.level?.toLowerCase().includes(selectedLevel.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#3686FF] animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[12px]">Analyzing Campus Profile...</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <p className="text-rose-500 font-bold text-[18px] mb-4">{error || "School not found"}</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const intlPercentage = school.number_of_international_students && school.total_number_of_students
    ? Math.round((school.number_of_international_students / school.total_number_of_students) * 100)
    : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#3686FF]/20 selection:text-[#3686FF] overflow-x-hidden pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative h-[320px] md:h-[450px] w-full overflow-hidden shrink-0">
        <Image
          src={school.banner?.url || "/uni-default.webp"}
          alt={school.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/35 to-transparent" />
        
        {/* Navigation & Actions */}
        <div className="absolute top-8 left-6 md:left-12 right-6 md:right-12 flex justify-between items-center z-20">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900 flex items-center justify-center transition-all shadow-md hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {school.website && (
            <a 
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 h-12 rounded-full bg-[#3686FF] hover:bg-[#2970E6] text-white font-extrabold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_8px_20px_rgba(54,134,255,0.3)]"
            >
              Visit Website <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* School Name & Rank Title */}
        <div className="absolute left-6 md:left-12 bottom-8 md:bottom-12 right-6 md:right-12 text-white z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {school.school_rank && (
              <span className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-[11px] font-black text-[#3686FF] uppercase tracking-widest">
                <Award className="w-3.5 h-3.5" /> #{school.school_rank} Global Rank
              </span>
            )}
            <span className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black text-white uppercase tracking-widest border border-white/25">
              {school.institution_type || "Public Institution"}
            </span>
          </div>
          <h1 className="text-[32px] md:text-[56px] font-black leading-tight tracking-tight drop-shadow-md max-w-4xl text-white">
            {school.name}
          </h1>
          <p className="text-[14px] md:text-[18px] font-medium opacity-90 mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            {school.address ? `${school.address}, ` : ""}{school.city}, {school.province}, {school.country}
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-[1280px] mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Info Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-[32px] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col items-center text-center p-2">
              <Calendar className="w-6 h-6 text-[#3686FF] mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Founded</span>
              <span className="text-[16px] font-black text-slate-800">{school.founded_in || "N/A"}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-l border-slate-100">
              <Users className="w-6 h-6 text-[#3686FF] mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Student Body</span>
              <span className="text-[16px] font-black text-slate-800">
                {school.total_number_of_students ? `${school.total_number_of_students.toLocaleString()}+` : "N/A"}
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-l border-slate-100">
              <Globe className="w-6 h-6 text-[#3686FF] mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">International</span>
              <span className="text-[16px] font-black text-slate-800">{intlPercentage ? `${intlPercentage}%` : "N/A"}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-l border-slate-100">
              <Coins className="w-6 h-6 text-[#3686FF] mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Living Cost/Yr</span>
              <span className="text-[16px] font-black text-slate-800">
                {school.cost_of_living ? formatNPRDevanagari(parseFloat(String(school.cost_of_living)) * getRateToNpr(school.country || "")) : "N/A"}
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="rounded-[32px] bg-white p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <h2 className="text-[24px] font-black text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
              <Building2 className="w-6 h-6 text-[#3686FF]" /> About Campus
            </h2>
            {school.about ? (
              <div 
                className="prose prose-slate max-w-none text-slate-600 text-[15px] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: school.about }}
              />
            ) : (
              <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
                Explore a premium learning environment. This campus provides high-quality infrastructure, state-of-the-art labs, and hands-on career development paths for both domestic and global candidates.
              </p>
            )}
          </div>

          {/* Programs Search & List */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Available Programs</h2>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter courses..."
                  className="px-4 py-2 border border-slate-100 bg-white rounded-xl text-[14px] outline-none focus:ring-2 ring-blue-500/5 focus:border-blue-300 w-full md:w-[200px] shadow-sm"
                />
                
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border border-slate-100 bg-white rounded-xl text-[13px] font-bold text-slate-700 outline-none cursor-pointer shadow-sm"
                >
                  <option>All Levels</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                  <option>Diploma</option>
                  <option>Certificate</option>
                </select>
              </div>
            </div>

            {/* Programs List */}
            {filteredPrograms.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100 text-slate-400 font-semibold shadow-sm">
                No courses matches "{searchQuery || selectedLevel}"
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrograms.map((p) => {
                  const tuition = p.tuition ? formatNPRDevanagari(parseFloat(String(p.tuition)) * getRateToNpr(school.country || "")) : "Varies";
                  const gpaVal = p.requirements?.min_gpa;
                  const gpaDisplay = gpaVal
                    ? parseFloat(String(gpaVal)) > 4.0
                      ? `${parseFloat(String(gpaVal))}%`
                      : `${gpaVal} / 4.0`
                    : "3.0 / 4.0";
                  
                  return (
                    <div 
                      key={p._id}
                      className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(54,134,255,0.05)] transition-all duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <div>
                          <span className="inline-block bg-blue-50 text-[#3686FF] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
                            {p.level_text || p.level || "Academic Program"}
                          </span>
                          <h4 className="text-[18px] md:text-[20px] font-extrabold text-slate-900 group-hover:text-[#3686FF] transition-colors leading-tight">
                            {p.name}
                          </h4>
                        </div>
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Annual Tuition</span>
                          <span className="text-[17px] font-black text-slate-800">{tuition}</span>
                        </div>
                      </div>

                      {p.description && (
                        <div 
                          className="text-slate-500 text-[14px] leading-relaxed mb-6 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: p.description }}
                        />
                      )}

                      {/* Course specific Requirements */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#3686FF] transition-colors shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Min GPA</span>
                            <span className="text-[13px] font-black text-slate-700">{gpaDisplay}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#3686FF] transition-colors shrink-0">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">English Scores</span>
                            <span className="text-[13px] font-black text-slate-700">IELTS {p.requirements?.min_ielts_average || "6.5"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#3686FF] transition-colors shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Duration</span>
                            <span className="text-[13px] font-black text-slate-700">{p.length_breakdown || "Varies"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Details/Guidelines Sidebar */}
        <div className="space-y-6">
          
          {/* Quick admissions details */}
          <div className="rounded-[32px] bg-slate-900 text-white p-8 relative overflow-hidden shadow-xl shadow-slate-900/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <h3 className="text-[20px] font-black mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Intake Information
            </h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Applying Countries</span>
                <span className="text-[15px] font-black text-white">{school.country || "Canada"} ({school.country_code || "CA"})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Admission Status</span>
                <span className="text-[15px] font-black text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> 
                  Accepting Applications
                </span>
              </div>
              {school.conditional_acceptance && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Conditional Offer</span>
                  <p className="text-[12px] text-slate-300 leading-relaxed font-medium">
                    {school.conditional_acceptance_text || "Accepts students on condition of completing prerequisite English language courses."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-[32px] bg-white p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3686FF]" /> Campus Contact
            </h3>
            <div className="space-y-4 text-[14px] text-slate-600 font-medium">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Address</span>
                <span className="text-slate-800">{school.address || "Doon Valley, Kitchener, Ontario, Canada"}</span>
              </div>
              {school.email && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email</span>
                  <a href={`mailto:${school.email}`} className="text-[#3686FF] hover:underline">{school.email}</a>
                </div>
              )}
              {school.phone && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Phone</span>
                  <span className="text-slate-800">{school.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
