"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  ArrowRight,
  Globe2,
  CheckCircle2,
  Headphones,
  Users,
  Building2,
  Quote,
  ChevronLeft,
  ChevronRight,
  Trophy,
  MapPin,
  Calendar,
  BookOpen,
  Sparkles,
  Briefcase,
  Handshake,
  Plus,
  Minus,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Star,
  CheckCircle,
  PlayCircle
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full bg-white text-[#0f172a] font-sans selection:bg-[#3366FF]/20 selection:text-[#3366FF] overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-[120px] pb-[80px] px-6 lg:px-12 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Light blue abstract shapes */}
          <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
          
          {/* Wavy lines placeholder */}
          <svg className="absolute left-[-5%] top-[15%] opacity-20" width="300" height="400" viewBox="0 0 300 400" fill="none">
            <path d="M-50 100 Q 50 150 150 100 T 350 100" stroke="#3366FF" strokeWidth="2" fill="none" className="animate-float" />
            <path d="M-50 150 Q 50 200 150 150 T 350 150" stroke="#3366FF" strokeWidth="2" fill="none" className="animate-float-slow" />
          </svg>

          {/* Concentric circles around student */}
          <div className="absolute right-[5%] top-[10%] w-[600px] h-[600px] border border-blue-100 rounded-full flex items-center justify-center opacity-40">
            <div className="w-[80%] h-[80%] border border-blue-200 rounded-full flex items-center justify-center">
              <div className="w-[80%] h-[80%] border-2 border-[#3366FF] rounded-full" />
            </div>
          </div>

          {/* Dots pattern at bottom left */}
          <div className="absolute left-[15%] bottom-[10%] opacity-30">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="10" cy="10" r="4" fill="#3366FF" />
              <circle cx="35" cy="10" r="4" fill="#3366FF" />
              <circle cx="60" cy="10" r="4" fill="#3366FF" />
              <circle cx="10" cy="35" r="4" fill="#3366FF" />
              <circle cx="35" cy="35" r="4" fill="#3366FF" />
              <circle cx="60" cy="35" r="4" fill="#3366FF" />
              <circle cx="10" cy="60" r="4" fill="#3366FF" />
              <circle cx="35" cy="60" r="4" fill="#3366FF" />
              <circle cx="60" cy="60" r="4" fill="#3366FF" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-[1280px] mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="fade-up">
            <h1 className="text-[56px] lg:text-[72px] font-extrabold leading-[1.1] mb-6 tracking-tight">
              Your Path to <br /> Studying Abroad <br />
              <span className="text-[#3366FF]">Begins Here</span>
            </h1>
            <p className="text-[18px] text-gray-500 mb-8 max-w-[500px] leading-relaxed">
              Discover research programs, academic excellence, and global opportunities tailored for your specific career path.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-[15px] font-semibold text-gray-700">160+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-500" />
                <span className="text-[15px] font-semibold text-gray-700">1000+ Universities</span>
              </div>
            </div>

            <Link
              href="/matches"
              className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-8 py-4 rounded-xl text-[17px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Content - Student Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] aspect-square mx-auto lg:mx-0">
              <div className="absolute inset-x-0 bottom-0 top-[10%] bg-blue-50 rounded-full -z-10 blur-2xl" />
              <Image
                src="/hero-student.png"
                alt="Student Abroad"
                width={600}
                height={600}
                className="relative z-10 object-contain drop-shadow-2xl"
                priority
              />

              {/* Floating Cards */}
              <div className="hidden sm:flex absolute left-[-20px] bottom-[20%] z-20 bg-white p-3 rounded-2xl shadow-2xl items-center gap-3 border border-gray-100 animate-float">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[15px] font-black leading-none">1600+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Active Students</div>
                </div>
              </div>

              <div className="hidden sm:flex absolute right-[-10px] top-[40%] z-20 bg-white p-3 rounded-2xl shadow-2xl items-center gap-3 border border-gray-100 animate-float-slow">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[15px] font-black leading-none">1000+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Partner Universities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-12 bg-white border-t border-gray-50 drop-shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-wrap justify-center lg:justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-[#3366FF]" />
            </div>
            <div>
              <div className="text-[20px] font-black">160+ Countries</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#3366FF]" />
            </div>
            <div>
              <div className="text-[20px] font-black">1000+ Universities</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#3366FF]" />
            </div>
            <div>
              <div className="text-[20px] font-black">5000+ Students Helped</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-[#3366FF]" />
            </div>
            <div>
              <div className="text-[20px] font-black">24/7 Student Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IDEAL DESTINATION SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Overlapping Images */}
          <div className="relative">
            <div className="relative w-full aspect-4/3 rounded-[32px] overflow-hidden shadow-2xl z-10">
              <Image
                src="/students-laptop.png"
                alt="Students using laptop"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Overlapping Image 2 */}
            <div className="absolute -bottom-12 -right-12 w-[60%] aspect-4/3 rounded-[24px] overflow-hidden shadow-2xl z-20 border-8 border-white">
              <Image
                src="/students-reading.png"
                alt="Students reading"
                fill
                className="object-cover"
              />
            </div>

            {/* Acceptance Badge */}
            <div className="absolute top-[10%] -right-8 z-30 w-32 h-32 lg:w-40 lg:h-40 bg-[#3366FF] rounded-full flex flex-col items-center justify-center text-white border-[6px] border-white shadow-xl animate-float">
              <span className="text-2xl lg:text-3xl font-black">95%</span>
              <span className="text-[10px] lg:text-[12px] font-bold uppercase tracking-wider text-center px-2">Acceptance Rate</span>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10" />
          </div>

          {/* Right: Content */}
          <div className="fade-up relative">
            <h2 className="text-[40px] lg:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-tight text-[#0f172a]">
              Find Your Ideal Study Destination
            </h2>
            <p className="text-[18px] text-gray-500 mb-10 leading-relaxed font-medium">
              We&apos;ve simplified the process of exploring universities and applying for your study program. Discover top universities, scholarship opportunities, and more in just a few clicks.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                "Easily Explore Top Universities",
                "Access Programs in 160+ Countries",
                "Find Scholarships & Financial Aid",
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 text-[17px] font-bold text-gray-700">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-100 flex items-center justify-center text-[#3366FF] bg-blue-50 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[18px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.05]"
            >
              Create an Student Account
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Book outline svg decoration */}
            <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none text-[#0f172a]">
              <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS GRID SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-[#F4F7FF] relative overflow-hidden">
        {/* Soft background blobs for the wavy look */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-white pointer-events-none" style={{ clipPath: "ellipse(80% 50% at 50% 0%)" }} />
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-white pointer-events-none" style={{ clipPath: "ellipse(80% 50% at 50% 100%)" }} />
        
        <div className="max-w-[1280px] mx-auto relative z-10 text-center text-sans">
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-[40px] lg:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-tight text-[#0f172a]">
              Find Every Solution, From Applications to <span className="text-[#3366FF]">Accommodations</span>
            </h2>
            <p className="text-[18px] text-gray-500 leading-relaxed font-medium max-w-3xl mx-auto">
              Access our full 360 Solutions, covering everything from application to arrival. Get instant language test vouchers, explore financial services, and invest in your future with flexible student loans. It&apos;s all here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                title: "GIC Program",
                desc: "Guaranteed Investment Certificate for international students in Canada.",
              },
              {
                title: "Foreign Exchange",
                desc: "Get competitive rates for currency exchange and international transfers.",
              },
              {
                title: "Banking",
                desc: "Open international student bank accounts with ease and convenience.",
              },
              {
                title: "Visa Services",
                desc: "Complete visa assistance and documentation support for your journey.",
              },
              {
                title: "Accommodations",
                desc: "Find safe and affordable housing near your chosen university.",
              },
              {
                title: "Program Search",
                desc: "Discover programs that match your interests and career goals.",
              },
              {
                title: "Instant Applications",
                desc: "Submit applications to multiple universities with one streamlined process.",
              },
              {
                title: "Language Tests",
                desc: "Access IELTS, TOEFL, and other language test vouchers instantly.",
              },
            ].map((sol, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl transition-all group text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3366FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <h4 className="text-[19px] font-bold text-gray-900 mb-3">{sol.title}</h4>
                <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                  {sol.desc}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[17px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.05]"
          >
            Register as a Student
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="py-32 px-6 lg:px-12 bg-[#F8FAFF] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] uppercase tracking-widest border border-blue-100 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              Student Success Stories
            </div>
            <h2 className="text-[44px] lg:text-[64px] font-black text-[#0f172a] leading-tight tracking-tight">
              What Our Students <br className="hidden md:block" /> 
              Have to <span className="text-[#3366FF]">Say.</span>
            </h2>
            <p className="text-gray-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Join 5,000+ students who achieved their international education dreams through NextDegree.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-blue-500/5 border border-white hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
               <Quote className="absolute -right-2 -top-2 w-24 h-24 text-blue-50/50 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
               <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
               </div>
               <p className="text-lg text-slate-700 font-medium leading-relaxed mb-10 relative z-10">
                 &quot;NextDegree didn&apos;t just find me a university; they found me a future. The AI matcher was scary accurate with my GPA and budget constraints.&quot;
               </p>
               <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/testimonial-1.png" alt="Maria" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 leading-none">Maria Smith</h4>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">Computer Science • UK</p>
                  </div>
               </div>
            </div>

            {/* Testimonial 2 (Video Styled) */}
            <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl shadow-slate-900/10 border border-slate-800 hover:-translate-y-2 transition-all duration-500 group relative">
               <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-transparent pointer-events-none" />
               <div className="relative aspect-square rounded-[32px] overflow-hidden mb-8 shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1544717297-fa154daaf762?auto=format&fit=crop&q=80&w=800" alt="Student Video" fill className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-125 transition-all duration-500">
                      <PlayCircle className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                    <p className="text-white font-black text-xs uppercase tracking-widest text-center">Video Testimonial</p>
                  </div>
               </div>
               <h4 className="text-white text-xl font-black mb-1 text-center">Chen Wei</h4>
               <p className="text-blue-400 font-bold text-[10px] uppercase text-center tracking-widest">Masters in Finance • Canada</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-blue-500/5 border border-white hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
               <Quote className="absolute -right-2 -top-2 w-24 h-24 text-blue-50/50 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
               <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
               </div>
               <p className="text-lg text-slate-700 font-medium leading-relaxed mb-10 relative z-10">
                 &quot;The scholarship database saved me $15k per year! I was lost in the paperwork until NextDegree streamlined everything into one simple dashboard.&quot;
               </p>
               <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/testimonial-2.png" alt="Student" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 leading-none">Arjun Mehta</h4>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">MBA • Australia</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center gap-8">
             <div className="flex -space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <Image src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="Student" width={48} height={48} />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                  +2k
                </div>
             </div>
             <p className="text-slate-400 font-bold text-sm">Join the successful alumni at <span className="text-slate-900">Oxford, Harvard, and Toronto.</span></p>
             
             <button className="flex items-center gap-3 bg-white text-slate-900 border border-slate-100 font-black px-8 py-4 rounded-2xl text-[15px] shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                View All Success Stories
                <ArrowRight className="w-4 h-4 text-blue-600" />
             </button>
          </div>
        </div>
      </section>

      {/* ── TRUSTED UNIVERSITIES SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 fade-up">
            <h3 className="text-[#3366FF] font-black tracking-[0.2em] uppercase text-xs mb-4">
              Trusted Partners
            </h3>
            <h2 className="text-[40px] lg:text-[48px] font-extrabold text-[#0f172a] leading-tight max-w-4xl mx-auto">
              Trusted by 1,500+ Universities, Colleges and Schools Worldwide
            </h2>
          </div>

          {/* Country Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
            {[
              { label: "Canada", flag: "🇨🇦", active: true },
              { label: "United-States", flag: "🇺🇸" },
              { label: "United Kingdom", flag: "🇬🇧" },
              { label: "Australia", flag: "🇦🇺" },
              { label: "Germany", flag: "🇩🇪" },
              { label: "Ireland", flag: "🇮🇪" },
            ].map((country) => (
              <button
                key={country.label}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border ${
                  country.active
                    ? "bg-blue-50 border-[#3366FF] text-[#3366FF] shadow-sm"
                    : "bg-[#F8FAFF] border-transparent text-gray-500 hover:bg-blue-50/50"
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                {country.label}
              </button>
            ))}
          </div>

          {/* Universities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "University of Oxford",
                location: "Oxford, United Kingdom",
                rank: "#1 Global",
                tuition: "$39,000",
                intake: "Sep 2026",
                image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "University of Melbourne",
                location: "Melbourne, Australia",
                rank: "#7 Global",
                tuition: "$32,000",
                intake: "Sep 2026",
                image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "University of Singapore",
                location: "Singapore",
                rank: "#23 Global",
                tuition: "$17,000",
                intake: "Sep 2026",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
              },
            ].map((uni) => (
              <div 
                key={uni.name} 
                className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-blue-500/5 group overflow-hidden hover:-translate-y-2 transition-all"
              >
                <div className="relative h-[240px] w-full">
                  <Image
                    src={uni.image}
                    alt={uni.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white">
                      <Trophy className="w-3.5 h-3.5 text-[#3366FF]" />
                      <span className="text-[11px] font-black text-[#3366FF]">{uni.rank}</span>
                    </div>
                    <div className="bg-[#3366FF] px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-[11px] font-bold text-white">Scholarship Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-[22px] font-black text-gray-900 mb-2 leading-tight">{uni.name}</h4>
                  <div className="flex items-center gap-2 text-gray-400 mb-8">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[14px] font-medium">{uni.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <p className="text-[12px] text-gray-400 font-bold uppercase mb-1">Tuition/Year</p>
                      <p className="text-[18px] font-black text-gray-900">{uni.tuition}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-400 font-bold uppercase mb-1">Next Intake</p>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-[16px] font-black">{uni.intake}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full h-[54px] bg-[#3366FF] text-white font-bold rounded-2xl hover:bg-[#2952cc] transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/matches"
              className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[17px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.05]"
            >
              Explore More Canadian Institutions
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── RECRUITMENT PARTNERS SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-[#F4F7FF] relative overflow-hidden">
        {/* Soft background blobs */}
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[60%] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[60%] bg-white rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-16 fade-up">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-50 text-[#3366FF] font-black tracking-wider text-[11px] uppercase mb-6 shadow-sm border border-blue-100/50">
              Recruitment Partners
            </div>
            <h2 className="text-[40px] lg:text-[52px] font-extrabold text-[#0f172a] leading-tight max-w-4xl mx-auto">
              How We Help Recruitment Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Cards & CTA */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "150,000+ Programs",
                    desc: "Access programs at 1,500+ academic institutions globally",
                    icon: BookOpen,
                  },
                  {
                    title: "AI-Powered Tools",
                    desc: "Benefit from 95% application success rate technology",
                    icon: Sparkles,
                  },
                  {
                    title: "Complete Support",
                    desc: "From language tests to student loans and accommodations",
                    icon: Briefcase,
                  },
                  {
                    title: "Dedicated Team",
                    desc: "Expert support and resources to grow your agency",
                    icon: Handshake,
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3366FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-[20px] font-black text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-[14px] text-gray-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/register?partner=1"
                className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[17px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.05]"
              >
                Join Our Network
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Side: Bento Grid Images */}
            <div className="grid grid-cols-2 lg:grid-cols-[1fr_1.2fr] gap-6 h-[500px] lg:h-[600px]">
              <div className="flex flex-col gap-6 h-full">
                {/* Horizontal Image */}
                <div className="flex-1 relative rounded-[32px] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                    alt="Team working"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Stats Card */}
                <div className="h-[200px] bg-[#3366FF] rounded-[32px] p-8 flex flex-col justify-end text-white shadow-xl shadow-blue-500/30 relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <GraduationCap className="w-10 h-10 mb-4 opacity-50" />
                  <div className="text-[36px] font-black leading-none mb-1">1.3M+</div>
                  <div className="text-blue-100 font-bold text-sm tracking-wide">Students Helped</div>
                </div>
              </div>

              {/* Large Vertical Image */}
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                  alt="Professional Partner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto bg-[#3366FF] rounded-[48px] h-auto lg:h-[350px] flex flex-col lg:flex-row items-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
          {/* Decorative Circles */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border-40 border-white/10 rounded-full" />
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[350px] h-[350px] border-20 border-white/5 rounded-full" />
          
          {/* Mortarboard Icon Overlay */}
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
             <GraduationCap className="w-[300px] h-[300px] text-white" />
          </div>

          <div className="flex-1 p-10 lg:p-20 relative z-10 text-center lg:text-left">
            <h2 className="text-[32px] lg:text-[44px] font-extrabold text-white mb-4 leading-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-blue-100 text-[18px] mb-10 max-w-xl font-medium">
              Create a free account and get personalized university recommendations based on your profile.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#3366FF] font-bold px-10 py-5 rounded-2xl text-[17px] hover:bg-gray-50 transition-all hover:scale-105 shadow-xl shadow-black/5"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="hidden lg:block relative w-[450px] h-full shrink-0 self-end">
             <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                alt="Graduated Student"
                fill
                className="object-cover object-top"
             />
          </div>
        </div>
      </section>


      {/* ── FEATURES ── */}
      <section className="py-32 px-6 lg:px-12 bg-[#FAFBFF]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[#3366FF] font-black tracking-[0.2em] uppercase text-xs mb-4">
              Our Core Features
            </h2>
            <h3 className="font-extrabold text-[42px] leading-[1.1] mb-6 tracking-tight">
              Smarter matching for your future.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group font-sans">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 bg-linear-to-br from-blue-50 to-blue-100">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h4 className="text-[24px] font-bold mb-4">AI Scorecard Analysis</h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                Our proprietary AI engine analyzes your exact academic profile against thousands of program requirements.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group font-sans">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-8 bg-linear-to-br from-teal-50 to-teal-100">
                <Globe2 className="w-8 h-8" />
              </div>
              <h4 className="text-[24px] font-bold mb-4">Global Reach</h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                Access universities across 160+ countries, with real-time updates on tuition and deadlines.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group font-sans">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-8 bg-linear-to-br from-red-50 to-red-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-[24px] font-bold mb-4">Verified Data</h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                Every program and scholarship in our database is verified through official government and university APIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
          {/* Left: Content */}
          <div className="fade-up">
            <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[#3366FF] text-[12px] font-black tracking-widest uppercase mb-8">
              FAQ
            </div>
            <h2 className="text-[40px] lg:text-[56px] font-extrabold text-[#0f172a] leading-tight mb-8">
              Frequently Asked Questions
            </h2>
            <p className="text-[18px] text-gray-500 font-medium leading-relaxed max-w-md">
              Still wondering about studying abroad, and how NextDegree can get you there? Read these answers to our most commonly asked questions.
            </p>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-4">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR PATH SECTION ── */}
      <section className="py-24 px-6 lg:px-12 bg-[#F8FAFF]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 fade-up">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-white text-gray-900 font-bold tracking-wider text-[11px] uppercase mb-6 shadow-sm border border-gray-100">
              Choose Your Path
            </div>
            <h2 className="text-[40px] lg:text-[52px] font-extrabold text-[#0f172a] mb-6">
              Get Started With NextDegree
            </h2>
            <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
              Join thousands of students, partners, and institutions transforming international education worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Student",
                badge: "Most Popular",
                desc: "Are you ready to pursue your international education dreams? Join our platform and access opportunities worldwide.",
                features: ["Free university search & comparison", "Expert counseling & guidance", "Application & visa assistance"],
                btn: "Sign Up For Free",
                img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
                link: "/register"
              },
              {
                title: "Recruitment Partner",
                badge: "For Agents",
                desc: "Expand your reach and streamline student recruitment with our comprehensive partner network.",
                features: ["Access to global institutions", "Advanced management tools", "Commission tracking system"],
                btn: "Become a Recruitment Partner",
                img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
                link: "/register?partner=1"
              },
              {
                title: "Partner Institution",
                badge: "For Institutions",
                desc: "Connect with quality students globally and grow your international enrollment effectively.",
                features: ["1,500+ partner institutions", "Qualified student applications", "Dedicated support team"],
                btn: "Become a Partner Institution",
                img: "https://images.unsplash.com/photo-1491333078588-55b6733c7de6?auto=format&fit=crop&q=80&w=800",
                link: "/register?institution=1"
              }
            ].map((path, i) => (
              <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl shadow-blue-500/5 hover:-translate-y-2 transition-all group flex flex-col h-full">
                <div className="relative h-[240px] w-full">
                  <Image
                    src={path.img}
                    alt={path.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white">
                      <Trophy className="w-3.5 h-3.5 text-[#3366FF]" />
                      <span className="text-[11px] font-black text-[#3366FF]">{path.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-[28px] font-black text-gray-900 mb-4">{path.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                    {path.desc}
                  </p>

                  <ul className="space-y-4 mb-10">
                    {path.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-[15px] font-bold text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-blue-50 text-[#3366FF] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={path.link}
                    className="w-full h-[60px] bg-[#3366FF] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2952cc] transition-all shadow-lg shadow-blue-500/20"
                  >
                    {path.btn}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto bg-[#3366FF] rounded-[48px] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-[40px] lg:text-[56px] font-extrabold mb-6 leading-none">
            Find your dream <br />university today.
          </h2>
          <p className="text-blue-100 text-[20px] mb-12 max-w-xl mx-auto font-medium">
            Join thousands of students who have already started their global journey with NextDegree.
          </p>
          <Link
            href="/matches"
            className="inline-flex items-center gap-3 bg-white text-[#3366FF] font-bold px-10 py-5 rounded-2xl text-[18px] hover:bg-gray-50 transition-all hover:scale-105 shadow-xl"
          >
            Start Matching Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER SECTION ── */}
      <footer className="bg-[#F0F4FF] pt-24 pb-12 px-6 lg:px-12 border-t border-blue-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
            {/* Brand & Address */}
            <div className="lg:col-span-1">
              <Link href="/" className="text-[24px] font-black text-[#0f172a] mb-8 block">
                NextDegree
              </Link>
              <div className="text-gray-500 font-medium leading-relaxed mb-8">
                <p>101 Frederick St,</p>
                <p>Kitchener, ON</p>
                <p>N2H 6R2</p>
              </div>
              <div className="flex items-center gap-5">
                <Link href="#" className="text-[#3366FF] hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-[#3366FF] hover:scale-110 transition-transform">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-[#3366FF] hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-[#3366FF] hover:scale-110 transition-transform">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-[#3366FF] hover:scale-110 transition-transform">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-[17px] font-black text-[#0f172a] mb-8 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Features</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Case studies</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Reviews</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Updates</Link></li>
              </ul>
            </div>

            {/* Destinations Column */}
            <div>
              <h4 className="text-[17px] font-black text-[#0f172a] mb-8 uppercase tracking-wider">Destinations</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Australia</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Canada</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Germany</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Ireland</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">United Kingdom</Link></li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h4 className="text-[17px] font-black text-[#0f172a] mb-8 uppercase tracking-wider">About</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Our Story</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Press and Media</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-[17px] font-black text-[#0f172a] mb-8 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Webinar</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">NextDegree Insights</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-[#3366FF] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-blue-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 font-medium text-[15px]">
              Copyright © 2022 NextDegree Inc
            </p>
            <div className="flex items-center gap-8 text-[15px] font-medium text-gray-400">
              <p>All Rights Reserved</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-[#3366FF] underline underline-offset-4 hover:text-[#2952cc]">Terms and Conditions</Link>
                <div className="w-px h-4 bg-gray-300" />
                <Link href="#" className="text-[#3366FF] underline underline-offset-4 hover:text-[#2952cc]">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does NextDegree help students?",
      a: "NextDegree simplifies the entire study abroad journey. We use AI to match your profile with over 150,000 programs worldwide, handle your applications, and even assist with visa and accommodation services.",
    },
    {
      q: "Does NextDegree charge students any fees?",
      a: "Using NextDegree to search and apply to many of our partner institutions is completely free for students. We provide transparent information about any specific processing fees if they apply to certain programs.",
    },
    {
      q: "Which countries can I study in through NextDegree?",
      a: "We have partners in over 160 countries, including popular destinations like Canada, the USA, the UK, Australia, Germany, and Ireland, as well as many emerging education hubs.",
    },
    {
      q: "How do I know if I am eligible for a program?",
      a: "Our platform features an AI-driven eligibility checker. Once you complete your profile, we'll automatically show you which programs you're likely to be accepted into based on your GPA and test scores.",
    },
    {
      q: "Can I apply for scholarships on the platform?",
      a: "Yes! We list thousands of scholarships. Our matching engine specifically highlights financial aid opportunities that you are eligible for, helping you reduce the cost of your education.",
    },
  ];

  return (
    <>
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className={`rounded-[24px] overflow-hidden transition-all duration-300 ${openIndex === i ? "bg-[#F1F6FF]" : "bg-[#F8FAFF] hover:bg-blue-50/50"}`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-8 py-7 flex items-center justify-between text-left group"
          >
            <span className={`text-[18px] font-bold transition-colors ${openIndex === i ? "text-[#3366FF]" : "text-gray-900"}`}>
              {faq.q}
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${openIndex === i ? "bg-[#3366FF] text-white rotate-180" : "bg-white text-gray-400 border border-gray-100"}`}>
              {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>
          
          <div 
            className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? "max-h-[300px] pb-8 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="text-gray-500 font-medium leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
