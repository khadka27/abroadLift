// "use client";

// import { useState, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   GraduationCap,
//   ArrowRight,
//   Globe2,
//   CheckCircle2,
//   Headphones,
//   Users,
//   Building2,
//   Youtube,
//   Star,
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   Trophy,
//   MapPin,
//   Calendar,
//   BookOpen,
//   Sparkles,
//   Briefcase,
//   Handshake,
//   Plus,
//   Minus,
// } from "lucide-react";

// export default function HomePage() {
//   const [activeCountry, setActiveCountry] = useState("Canada");

//   const pathCards = [
//     {
//       title: "Student",
//       badge: "Most Popular",
//       desc: "Compare programs, check eligibility, and apply with one guided workflow.",
//       link: "/register",
//       cta: "Sign Up For Free",
//       bullets: [
//         "Live university comparison",
//         "AI match + admit insights",
//         "Scholarship and visa guidance",
//       ],
//       img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
//     },
//     {
//       title: "Recruitment Partner",
//       badge: "For Agents",
//       desc: "Scale admissions with automation, lead tracking, and institution-ready submissions.",
//       link: "/register?partner=1",
//       cta: "Become a Recruitment Partner",
//       bullets: [
//         "Access to global institutions",
//         "Advanced management tools",
//         "Commission tracking system",
//       ],
//       img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
//     },
//     {
//       title: "Partner Institution",
//       badge: "For Schools",
//       desc: "Connect with qualified students and streamline global enrollment operations.",
//       link: "/register?institution=1",
//       cta: "Become a Partner Institution",
//       bullets: [
//         "1,500+ verified partners",
//         "Qualified student applications",
//         "Dedicated support team",
//       ],
//       img: "https://images.unsplash.com/photo-1491333078588-55b6733c7de6?auto=format&fit=crop&q=80&w=800",
//     },
//   ];

//   return (
//     <div className="w-full bg-[#F7F9FF] text-[#0f172a] font-sans selection:bg-[#3366FF]/20 selection:text-[#3366FF] overflow-hidden">
//       {/* ── HERO SECTION ── */}
//       <section className="relative px-6 pt-[120px] pb-[92px] lg:px-12 overflow-hidden">
//         {/* Background Decorations */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
//           <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
//           <svg
//             className="absolute left-[-5%] top-[15%] opacity-20"
//             width="300"
//             height="400"
//             viewBox="0 0 300 400"
//             fill="none"
//           >
//             <path
//               d="M-50 100 Q 50 150 150 100 T 350 100"
//               stroke="#3366FF"
//               strokeWidth="2"
//               fill="none"
//               className="animate-float"
//             />
//             <path
//               d="M-50 150 Q 50 200 150 150 T 350 150"
//               stroke="#3366FF"
//               strokeWidth="2"
//               fill="none"
//               className="animate-float-slow"
//             />
//           </svg>
//           <div className="absolute right-[5%] top-[10%] w-[600px] h-[600px] border border-blue-100 rounded-full flex items-center justify-center opacity-40">
//             <div className="w-[80%] h-[80%] border border-blue-200 rounded-full flex items-center justify-center">
//               <div className="w-[80%] h-[80%] border-2 border-[#3366FF] rounded-full" />
//             </div>
//           </div>
//           <div className="absolute left-[15%] bottom-[10%] opacity-30">
//             <svg width="120" height="120" viewBox="0 0 120 120">
//               <circle cx="10" cy="10" r="4" fill="#3366FF" />
//               <circle cx="35" cy="10" r="4" fill="#3366FF" />
//               <circle cx="60" cy="10" r="4" fill="#3366FF" />
//               <circle cx="10" cy="35" r="4" fill="#3366FF" />
//               <circle cx="35" cy="35" r="4" fill="#3366FF" />
//               <circle cx="60" cy="35" r="4" fill="#3366FF" />
//               <circle cx="10" cy="60" r="4" fill="#3366FF" />
//               <circle cx="35" cy="60" r="4" fill="#3366FF" />
//               <circle cx="60" cy="60" r="4" fill="#3366FF" />
//             </svg>
//           </div>
//         </div>

//         <div className="relative max-w-[1280px] mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-5 lg:gap-y-0 items-center">
//           {/* ── TITLE ── */}
//           <div className="fade-up order-1 lg:col-start-1 lg:row-start-1">
//             <h1 className="text-[50px] lg:text-[72px] font-bold lg:font-extrabold leading-[1] mb-6 tracking-tight text-center lg:text-left">
//               Your Path to <br /> Studying Abroad <br />
//               <span className="text-[#3366FF]">Begins Here</span>
//             </h1>
//           </div>

//           {/* ── IMAGE ── */}
//           <div className="relative flex justify-center lg:justify-end order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3">
//             <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] aspect-square mx-auto lg:mx-0">
//               <div className="absolute inset-x-0 bottom-0 top-[10%] bg-blue-50 rounded-full -z-10 blur-2xl" />
//               <Image
//                 src="/hero-student.png"
//                 alt="Student Abroad"
//                 width={600}
//                 height={600}
//                 className="relative z-10 object-contain drop-shadow-2xl"
//                 priority
//               />
//               <div className="hidden sm:flex absolute left-[-20px] bottom-[20%] z-20 bg-white p-3 rounded-2xl shadow-2xl items-center gap-3 border border-gray-100 animate-float">
//                 <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
//                   <Users className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-[15px] font-black leading-none">
//                     1600+
//                   </div>
//                   <div className="text-[10px] text-gray-400 font-bold uppercase">
//                     Active Students
//                   </div>
//                 </div>
//               </div>
//               <div className="hidden sm:flex absolute right-[-10px] top-[40%] z-20 bg-white p-3 rounded-2xl shadow-2xl items-center gap-3 border border-gray-100 animate-float-slow">
//                 <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
//                   <Building2 className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-[15px] font-black leading-none">
//                     1000+
//                   </div>
//                   <div className="text-[10px] text-gray-400 font-bold uppercase">
//                     Partner Universities
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── DESCRIPTION ── */}
//           <div className="fade-up order-3 lg:col-start-1 lg:row-start-2 delay-100 flex justify-center lg:justify-start">
//             <p className="text-[18px] text-gray-500 mb-8 max-w-[500px] leading-relaxed text-center lg:text-left">
//               Discover research programs, academic excellence, and global
//               opportunities tailored for your specific career path.
//             </p>
//           </div>

//           {/* ── OTHER CONTENT (Features & Button) ── */}
//           <div className="fade-up order-4 lg:col-start-1 lg:row-start-3 delay-200 flex flex-col items-center lg:items-start">
//             <div className="flex flex-col sm:flex-row gap-6 mb-10">
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-5 h-5 text-green-500" />
//                 <span className="text-[15px] font-semibold text-gray-700">
//                   160+ Countries
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-5 h-5 text-red-500" />
//                 <span className="text-[15px] font-semibold text-gray-700">
//                   1000+ Universities
//                 </span>
//               </div>
//             </div>
//             <Link
//               href="/matches"
//               className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-8 py-4 rounded-xl text-[17px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.02]"
//             >
//               Get Started
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── TRUST BAR ── */}
//       <section className="py-12 bg-white/90 backdrop-blur border-y border-[#E8EEFF]">
//         <div className="max-w-[1280px] mx-auto px-6 lg:px-12 grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-between items-center gap-y-10 gap-x-2 sm:gap-x-4 lg:gap-8">
//           <div className="flex items-center gap-3 lg:gap-4">
//             <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
//               <Globe2 className="w-5 h-5 lg:w-6 lg:h-6 text-[#3366FF]" />
//             </div>
//             <div>
//               <div className="text-[15px] sm:text-[18px] lg:text-[20px] font-black leading-tight">
//                 160+ Countries
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 lg:gap-4">
//             <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
//               <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-[#3366FF]" />
//             </div>
//             <div>
//               <div className="text-[15px] sm:text-[18px] lg:text-[20px] font-black leading-tight">
//                 1000+ Universities
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 lg:gap-4">
//             <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
//               <Users className="w-5 h-5 lg:w-6 lg:h-6 text-[#3366FF]" />
//             </div>
//             <div>
//               <div className="text-[15px] sm:text-[18px] lg:text-[20px] font-black leading-tight">
//                 5000+ Students Helped
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 lg:gap-4">
//             <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
//               <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-[#3366FF]" />
//             </div>
//             <div>
//               <div className="text-[15px] sm:text-[18px] lg:text-[20px] font-black leading-tight">
//                 24/7 Student Support
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── IDEAL DESTINATION SECTION ── */}
//       <section className="py-16 lg:py-24 px-6 lg:px-12 bg-white overflow-hidden">
//         <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//           <div className="relative">
//             <div className="relative w-full aspect-4/3 rounded-[32px] overflow-hidden shadow-2xl z-10">
//               <Image
//                 src="/students-laptop.png"
//                 alt="Students using laptop"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="absolute -bottom-6 lg:-bottom-12 -right-4 lg:-right-12 w-[60%] aspect-4/3 rounded-[24px] overflow-hidden shadow-2xl z-20 border-4 lg:border-8 border-white">
//               <Image
//                 src="/students-reading.png"
//                 alt="Students reading"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="absolute top-[10%] -right-4 lg:-right-8 z-30 w-24 h-24 lg:w-40 lg:h-40 bg-[#3366FF] rounded-full flex flex-col items-center justify-center text-white border-4 lg:border-[6px] border-white shadow-xl animate-float">
//               <span className="text-2xl lg:text-3xl font-black">95%</span>
//               <span className="text-[10px] lg:text-[12px] font-bold uppercase tracking-wider text-center px-2">
//                 Acceptance Rate
//               </span>
//             </div>
//             <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10" />
//           </div>
//           <div className="fade-up relative mt-8 lg:mt-0">
//             <h2 className="text-[35px] sm:text-[42px] lg:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-tight text-[#0f172a]">
//               Find Your Ideal Study Destination
//             </h2>
//             <p className="text-[18px] text-gray-500 mb-10 leading-relaxed font-medium">
//               We&apos;ve simplified the process of exploring universities and
//               applying for your study program. Discover top universities,
//               scholarship opportunities, and more in just a few clicks.
//             </p>
//             <ul className="space-y-5 mb-12">
//               {[
//                 "Easily Explore Top Universities",
//                 "Access Programs in 160+ Countries",
//                 "Find Scholarships & Financial Aid",
//               ].map((item) => (
//                 <li
//                   key={item}
//                   className="flex items-center gap-4 text-[17px] font-bold text-gray-700"
//                 >
//                   <div className="w-6 h-6 rounded-full border-2 border-blue-100 flex items-center justify-center text-[#3366FF] bg-blue-50 shrink-0">
//                     <CheckCircle2 className="w-4 h-4" />
//                   </div>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               href="/register"
//               className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[18px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.05]"
//             >
//               Create an Student Account
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── SOLUTIONS GRID SECTION ── */}
//       <section className="py-10 px-6 lg:px-12 bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFF] relative overflow-hidden">
//         <div className="max-w-[1280px] mx-auto relative z-10 text-center">
//           <div className="max-w-4xl mx-auto mb-20">
//             <h2 className="text-[35px] lg:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-tight text-[#0f172a]">
//               Find Every Solution, From Applications to{" "}
//               <span className="text-[#3366FF]">Accommodations</span>
//             </h2>
//             <p className="text-[18px] text-gray-500 leading-relaxed font-medium max-w-3xl mx-auto">
//               Access our full 360 Solutions, covering everything from
//               application to arrival. Get instant language test vouchers,
//               explore financial services, and invest in your future with
//               flexible student loans. It&apos;s all here.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//             {[
//               {
//                 title: "GIC Program",
//                 desc: "Guaranteed Investment Certificate for international students in Canada.",
//               },
//               {
//                 title: "Foreign Exchange",
//                 desc: "Get competitive rates for currency exchange and international transfers.",
//               },
//               {
//                 title: "Banking",
//                 desc: "Open international student bank accounts with ease and convenience.",
//               },
//               {
//                 title: "Visa Services",
//                 desc: "Complete visa assistance and documentation support for your journey.",
//               },
//               {
//                 title: "Accommodations",
//                 desc: "Find safe and affordable housing near your chosen university.",
//               },
//               {
//                 title: "Program Search",
//                 desc: "Discover programs that match your interests and career goals.",
//               },
//               {
//                 title: "Instant Applications",
//                 desc: "Submit applications to multiple universities with one streamlined process.",
//               },
//               {
//                 title: "Language Tests",
//                 desc: "Access IELTS, TOEFL, and other language test vouchers instantly.",
//               },
//             ].map((sol, i) => (
//               <div
//                 key={i}
//                 className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl transition-all group text-center flex flex-col items-center"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3366FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//                     <polyline points="14 2 14 8 20 8" />
//                   </svg>
//                 </div>
//                 <h4 className="text-[19px] font-bold text-gray-900 mb-3">
//                   {sol.title}
//                 </h4>
//                 <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
//                   {sol.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <Link
//             href="/register"
//             className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[17px] shadow-xl shadow-blue-500/25 hover:bg-[#2952cc] transition-all hover:scale-[1.05]"
//           >
//             Register as a Student
//             <ArrowRight className="w-5 h-5" />
//           </Link>
//         </div>
//       </section>

//       {/* ── TESTIMONIALS SECTION ── */}
//       <TestimonialCarousel />

//       {/* ── TRUSTED UNIVERSITIES SECTION ── */}
//       <section className="py-24 px-6 lg:px-12 bg-white">
//         <div className="max-w-[1280px] mx-auto">
//           <div className="text-center mb-16 fade-up">
//             <h3 className="text-[#3366FF] font-black tracking-[0.2em] uppercase text-xs mb-4">
//               Trusted Partners
//             </h3>
//             <h2 className="text-[35px] lg:text-[48px] font-extrabold text-[#0f172a] leading-tight max-w-4xl mx-auto">
//              Trusted by 1,500+ institutions worldwide.
//             </h2>
//           </div>
//           <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 sm:gap-4 mb-16 px-4">
//             {[
//               { label: "Canada", code: "CA", flag: "🇨🇦" },
//               { label: "USA", code: "US", flag: "🇺🇸" },
//               { label: "UK", code: "GB", flag: "🇬🇧" },
//               { label: "Australia", code: "AU", flag: "🇦🇺" },
//               { label: "Germany", code: "DE", flag: "🇩🇪" },
//               { label: "Ireland", code: "IE", flag: "🇮🇪" },
//             ].map((country) => (
//               <button
//                 key={country.label}
//                 onClick={() => setActiveCountry(country.label)}
//                 className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-2xl font-bold transition-all border ${
//                   activeCountry === country.label
//                     ? "bg-blue-50 border-[#3366FF] text-[#3366FF] shadow-md scale-105"
//                     : "bg-[#F8FAFF] border-transparent text-gray-500 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <div
//                   className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
//                     activeCountry === country.label
//                       ? "bg-[#3366FF] text-white"
//                       : "bg-blue-100/50 text-blue-600"
//                   }`}
//                 >
//                   {country.code}
//                 </div>
//                 <span className="text-xl leading-none">{country.flag}</span>
//                 <span className="text-[15px]">{country.label}</span>
//               </button>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//             {[
//               {
//                 name: "University of Toronto",
//                 country: "Canada",
//                 location: "Toronto, CA",
//                 rank: "#1",
//                 tuition: "$45k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "Harvard University",
//                 country: "USA",
//                 location: "Cambridge, US",
//                 rank: "#1",
//                 tuition: "$55k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "University of Oxford",
//                 country: "UK",
//                 location: "Oxford, UK",
//                 rank: "#1",
//                 tuition: "$39k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "University of Melbourne",
//                 country: "Australia",
//                 location: "Melbourne, AU",
//                 rank: "#7",
//                 tuition: "$32k",
//                 intake: "Feb '26",
//                 img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "Technical University of Munich",
//                 country: "Germany",
//                 location: "Munich, DE",
//                 rank: "#37",
//                 tuition: "Free",
//                 intake: "Oct '26",
//                 img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "Trinity College Dublin",
//                 country: "Ireland",
//                 location: "Dublin, IE",
//                 rank: "#81",
//                 tuition: "$25k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "UBC",
//                 country: "Canada",
//                 location: "Vancouver, CA",
//                 rank: "#3",
//                 tuition: "$40k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "Stanford University",
//                 country: "USA",
//                 location: "Stanford, US",
//                 rank: "#2",
//                 tuition: "$58k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
//               },
//               {
//                 name: "Cambridge",
//                 country: "UK",
//                 location: "Cambridge, UK",
//                 rank: "#2",
//                 tuition: "$42k",
//                 intake: "Sep '26",
//                 img: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=800",
//               },
//             ]
//               .filter((u) => u.country === activeCountry)
//               .map((uni) => (
//                 <div
//                   key={uni.name}
//                   className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-blue-500/5 group overflow-hidden hover:-translate-y-2 transition-all duration-300"
//                 >
//                   <div className="relative h-[240px] w-full">
//                     <Image
//                       src={uni.img}
//                       alt={uni.name}
//                       fill
//                       className="object-cover group-hover:scale-105 transition-transform duration-700"
//                     />
//                     <div className="absolute top-4 left-4 flex gap-2">
//                       <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white">
//                         <Trophy className="w-3.5 h-3.5 text-[#3366FF]" />
//                         <span className="text-[11px] font-black text-[#3366FF]">
//                           {uni.rank} Global
//                         </span>
//                       </div>
//                       <div className="bg-[#3366FF] px-3 py-1.5 rounded-full shadow-sm">
//                         <span className="text-[11px] font-bold text-white">
//                           Scholarship Available
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-8">
//                     <h4 className="text-[22px] font-black text-gray-900 mb-2 leading-tight">
//                       {uni.name}
//                     </h4>
//                     <div className="flex items-center gap-2 text-gray-400 mb-8">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-[14px] font-medium">
//                         {uni.location}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 mb-8">
//                       <div>
//                         <p className="text-[12px] text-gray-400 font-bold uppercase mb-1">
//                           Tuition/Year
//                         </p>
//                         <p className="text-[18px] font-black text-gray-900">
//                           {uni.tuition}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[12px] text-gray-400 font-bold uppercase mb-1">
//                           Next Intake
//                         </p>
//                         <div className="flex items-center gap-2 text-gray-900">
//                           <Calendar className="w-4 h-4 text-gray-500" />
//                           <span className="text-[16px] font-black">
//                             {uni.intake}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <button className="w-full h-[54px] bg-[#3366FF] text-white font-bold rounded-2xl hover:bg-[#2952cc] transition-all shadow-lg shadow-blue-500/20 active:scale-95">
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//           </div>

//           <div className="text-center">
//             <Link
//               href="/search"
//               className="inline-flex items-center gap-3 rounded-2xl bg-[#3366FF] px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:translate-y-[-1px] hover:bg-[#2952cc]"
//             >
//               Explore More {activeCountry} Institutions
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── RECRUITMENT PARTNERS SECTION ── */}
//       <section className="py-24 px-6 lg:px-12 bg-[#F4F7FF] relative overflow-hidden">
//         <div className="max-w-[1280px] mx-auto relative z-10 text-center">
//           <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-50 text-[#3366FF] font-black tracking-wider text-[11px] uppercase mb-6 shadow-sm border border-blue-100/50">
//             Recruitment Partners
//           </div>
//           <h2 className="text-[32px] sm:text-[40px] lg:text-[52px] font-extrabold text-[#0f172a] leading-tight mb-10 lg:mb-16">
//             How We Help Recruitment Partners
//           </h2>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
//             <div className="space-y-12">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {[
//                   {
//                     title: "150,000+ Programs",
//                     desc: "Access programs at 1,500+ institutions",
//                     icon: BookOpen,
//                   },
//                   {
//                     title: "AI-Powered Tools",
//                     desc: "95% application success rate tech",
//                     icon: Sparkles,
//                   },
//                   {
//                     title: "Complete Support",
//                     desc: "From tests to student loans",
//                     icon: Briefcase,
//                   },
//                   {
//                     title: "Dedicated Team",
//                     desc: "Expert support and resources",
//                     icon: Handshake,
//                   },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl transition-all group"
//                   >
//                     <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3366FF] flex items-center justify-center mb-6 group-hover:scale-110">
//                       <item.icon className="w-6 h-6" />
//                     </div>
//                     <h4 className="text-[20px] font-black text-gray-900 mb-2">
//                       {item.title}
//                     </h4>
//                     <p className="text-[14px] text-gray-400 font-medium">
//                       {item.desc}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <Link
//                 href="/register?partner=1"
//                 className="inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-2xl text-[17px] shadow-xl hover:scale-105 transition-all"
//               >
//                 Join Our Network
//                 <ArrowRight className="w-5 h-5" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-2 gap-4 lg:gap-6 h-[320px] sm:h-[400px] lg:h-[500px]">
//               <div className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl transition-all">
//                 <Image
//                   src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
//                   alt="Team"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="relative rounded-[24px] lg:rounded-[40px] overflow-hidden shadow-2xl transition-all">
//                 <Image
//                   src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
//                   alt="Partner"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <section className="py-16 lg:py-24 px-6 lg:px-12 bg-white text-white">
//         <div className="max-w-[1280px] mx-auto bg-[#3366FF] rounded-[32px] lg:rounded-[48px] p-8 sm:p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
//           <div className="relative z-10 max-w-xl text-center lg:text-left">
//             <h2 className="text-[28px] lg:text-[44px] font-extrabold mb-4 leading-tight">
//               Ready to Start Your Journey?
//             </h2>
//             <p className="text-blue-100 text-[18px] mb-10 font-medium">
//               Create a free account and get personalized university
//               recommendations based on your profile.
//             </p>
//             <Link
//               href="/register"
//               className="inline-flex items-center gap-3 bg-white px-10 py-5 rounded-2xl text-[17px] hover:scale-105 transition-all shadow-xl"
//             >
//               <span
//                 className="font-bold text-[#3366FF]"
//                 style={{ color: "#3366FF" }}
//               >
//                 Get Started Free
//               </span>
//               <ArrowRight
//                 className="w-5 h-5 text-[#3366FF]"
//                 style={{ color: "#3366FF" }}
//               />
//             </Link>
//           </div>
//           <div className="hidden lg:block relative w-[400px] h-[300px] -mb-20 self-end">
//             <Image
//               src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
//               alt="Grad"
//               fill
//               className="object-cover rounded-t-[32px]"
//             />
//           </div>
//         </div>
//       </section>

//       {/* ── FEATURES ── */}
//       <section className="py-16 lg:py-32 px-6 lg:px-12 bg-[#FAFBFF]">
//         <div className="max-w-[1280px] mx-auto text-center">
//           <h2 className="text-[#3366FF] font-black tracking-widest uppercase text-xs mb-4">
//             Our Core Features
//           </h2>
//           <h3 className="font-extrabold text-[32px] sm:text-[40px] lg:text-[42px] mb-10 lg:mb-16 leading-tight">
//             Smarter matching for your future.
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
//             {[
//               {
//                 title: "AI Scorecard",
//                 desc: "AI-powered academic profile analysis",
//                 icon: GraduationCap,
//               },
//               {
//                 title: "Global Reach",
//                 desc: "Access to 160+ countries",
//                 icon: Globe2,
//               },
//               {
//                 title: "Verified Data",
//                 desc: "Every program verified through APIs",
//                 icon: CheckCircle2,
//               },
//             ].map((f, i) => (
//               <div
//                 key={i}
//                 className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
//               >
//                 <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8">
//                   <f.icon className="w-8 h-8" />
//                 </div>
//                 <h4 className="text-[24px] font-bold mb-4">{f.title}</h4>
//                 <p className="text-gray-500 font-medium">{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── FAQ ── */}
//       <section className="py-16 lg:py-24 px-6 lg:px-12 bg-white">
//         <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
//           <div>
//             <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[#3366FF] text-[12px] font-black tracking-widest uppercase mb-8">
//               FAQ
//             </div>
//             <h2 className="text-[32px] sm:text-[40px] lg:text-[56px] font-extrabold text-[#0f172a] leading-tight mb-8">
//               Frequently Asked Questions
//             </h2>
//             <p className="text-[18px] text-gray-500 font-medium leading-relaxed max-w-md">
//               Still wondering about studying abroad? Read these answers below.
//             </p>
//           </div>
//           <FAQAccordion />
//         </div>
//       </section>

//       {/* ── CHOOSE PATH ── */}
//       <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#F8FAFF]">
//         <div className="max-w-[1280px] mx-auto">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center px-6 py-2 rounded-full bg-white font-bold text-[11px] uppercase mb-6 shadow-sm border border-gray-100">
//               Choose Your Path
//             </div>
//             <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0f172a] mb-6 leading-tight">
//               Get Started With AbroadLift
//             </h2>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {pathCards.map((p, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl hover:-translate-y-2 transition-all flex flex-col h-full"
//               >
//                 <div className="relative h-[240px] w-full">
//                   <Image
//                     src={p.img}
//                     alt={p.title}
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute top-6 right-6 font-black text-[#3366FF] bg-white/90 px-4 py-1.5 rounded-full text-[11px] uppercase">
//                     {p.badge}
//                   </div>
//                 </div>
//                 <div className="p-10 flex flex-col flex-1">
//                   <h3 className="text-[28px] font-black text-gray-900 mb-4">
//                     {p.title}
//                   </h3>
//                   <p className="text-gray-500 font-medium mb-6">{p.desc}</p>

//                   <ul className="mb-8 space-y-3">
//                     {p.bullets.map((item) => (
//                       <li
//                         key={item}
//                         className="flex items-center gap-2 text-sm font-medium text-gray-600"
//                       >
//                         <span className="inline-block h-2 w-2 rounded-full bg-[#3366FF]" />
//                         {item}
//                       </li>
//                     ))}
//                   </ul>

//                   <Link
//                     href={p.link}
//                     className="w-full h-[60px] bg-[#3366FF] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2952cc] transition-all"
//                   >
//                     {p.cta}
//                     <ArrowRight className="w-5 h-5" />
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="py-24 px-6 lg:px-12 shadow-2xl bg-white">
//         <div className="max-w-[1200px] mx-auto bg-[#3366FF] rounded-[48px] p-12 lg:p-24 text-center text-white relative overflow-hidden">
//           <h2 className="text-[40px] lg:text-[56px] font-extrabold mb-6 leading-none">
//             Find your dream university today.
//           </h2>
//           <Link
//             href="/matches"
//             className="inline-flex items-center gap-3 bg-white px-10 py-5 rounded-2xl text-[18px] hover:scale-105 transition-all shadow-xl"
//           >
//             <span
//               className="font-bold text-[#3366FF]"
//               style={{ color: "#3366FF" }}
//             >
//               Start Matching Free
//             </span>
//             <ArrowRight
//               className="w-5 h-5 text-[#3366FF]"
//               style={{ color: "#3366FF" }}
//             />
//           </Link>
//         </div>
//       </section>

//       <style jsx global>{`
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         .animate-float-slow {
//           animation: float 8s ease-in-out infinite;
//         }

//         .fade-up {
//           animation: fadeUp 0.8s ease forwards;
//         }

//         .delay-100 {
//           animation-delay: 0.1s;
//         }

//         .delay-200 {
//           animation-delay: 0.2s;
//         }

//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }

//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-8px);
//           }
//         }

//         @keyframes fadeUp {
//           from {
//             opacity: 0;
//             transform: translateY(16px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function TestimonialCarousel() {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const testimonials = [
//     {
//       name: "Maria Smith",
//       degree: "Computer Science",
//       country: "UK",
//       avatar: "/testimonial-1.png",
//       text: "AbroadLift didn't just find me a university; they found me a future. The AI matcher was scary accurate with my GPA and budget constraints.",
//       stars: 5,
//       verified: true,
//     },
//     {
//       name: "Chen Wei",
//       degree: "Masters in Finance",
//       country: "Canada",
//       avatar:
//         "https://images.unsplash.com/photo-1544717297-fa154daaf762?auto=format&fit=crop&q=80&w=800",
//       text: "Coming from Asia, the application process seemed daunting. AbroadLift's platform was like having a personal counselor available 24/7. Highly recommend!",
//       stars: 5,
//       type: "video",
//     },
//     {
//       name: "Arjun Mehta",
//       degree: "MBA",
//       country: "Australia",
//       avatar: "/testimonial-2.png",
//       text: "The scholarship database saved me $15k per year! I was lost in the paperwork until AbroadLift streamlined everything into one simple dashboard.",
//       stars: 5,
//       verified: true,
//     },
//     {
//       name: "Elena Rodriguez",
//       degree: "Env Science",
//       country: "Germany",
//       avatar: "https://i.pravatar.cc/150?u=25",
//       text: "The visa support was incredible. I got my approval in record time thanks to the perfectly organized documentation.",
//       stars: 5,
//       verified: true,
//     },
//   ];

//   const scroll = (direction: "left" | "right") => {
//     if (scrollRef.current) {
//       const { scrollLeft, clientWidth } = scrollRef.current;
//       const scrollTo =
//         direction === "left"
//           ? scrollLeft - clientWidth
//           : scrollLeft + clientWidth;
//       scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
//     }
//   };

//   return (
//     <section className="py-10 px-6 lg:px-12 bg-[#F8FAFF] relative overflow-hidden">
//       <div className="max-w-[1280px] mx-auto relative z-10">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
//           <div className="text-center md:text-left">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] uppercase tracking-widest border border-blue-100 shadow-sm mb-4">
//               <Star className="w-3 h-3 fill-current" />
//               Student Success
//             </div>
//             <h2 className="text-[40px] lg:text-[64px] font-black text-[#0f172a] leading-tight tracking-tight">
//               Community <span className="text-[#3366FF]">Feedback.</span>
//             </h2>
//           </div>
//         </div>
//         <div
//           ref={scrollRef}
//           className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4"
//           style={{ scrollbarWidth: "none" }}
//         >
//           {testimonials.map((item, idx) => (
//             <div
//               key={idx}
//               className="min-w-[320px] md:min-w-[450px] lg:min-w-[500px] snap-center"
//             >
//               <div
//                 className={`h-full p-8 md:p-12 rounded-[48px] border transition-all duration-500 group relative overflow-hidden flex flex-col ${item.type === "video" ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-white shadow-2xl shadow-blue-500/5"}`}
//               >
//                 <div className="flex items-center gap-1 mb-6">
//                   {[...Array(item.stars)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="w-4 h-4 fill-amber-400 text-amber-400"
//                     />
//                   ))}
//                 </div>
//                 <p
//                   className={`text-lg md:text-xl font-medium leading-relaxed mb-auto relative z-10 ${item.type === "video" ? "text-slate-200" : "text-slate-700"}`}
//                 >
//                   &quot;{item.text}&quot;
//                 </p>
//                 <div
//                   className={`flex items-center gap-4 border-t pt-8 mt-10 ${item.type === "video" ? "border-slate-800" : "border-slate-50"}`}
//                 >
//                   <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shrink-0">
//                     <Image
//                       src={item.avatar}
//                       alt={item.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-black uppercase tracking-wider leading-none">
//                         {item.name}
//                       </h4>
//                       {item.verified && (
//                         <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
//                       )}
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">
//                       {item.degree} • {item.country}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Manual Navigation Buttons at the bottom */}
//         <div className="flex items-center justify-center gap-4 mt-12">
//           <button
//             onClick={() => scroll("left")}
//             className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-xl hover:bg-slate-50 transition-all active:scale-90 group"
//           >
//             <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
//           </button>
//           <button
//             onClick={() => scroll("right")}
//             className="w-14 h-14 rounded-full bg-[#3366FF] flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition-all active:scale-90 group"
//           >
//             <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// function FAQAccordion() {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);
//   const faqs = [
//     {
//       q: "How does AbroadLift help students?",
//       a: "AbroadLift simplifies the entire study abroad journey.",
//     },
//     {
//       q: "Does AbroadLift charge students any fees?",
//       a: "Using AbroadLift is completely free for students.",
//     },
//     {
//       q: "Which countries can I study in?",
//       a: "We have partners in over 160 countries.",
//     },
//     {
//       q: "Can I apply to multiple universities at once?",
//       a: "Yes. You can shortlist multiple institutions, compare fit, and submit applications through one dashboard.",
//     },
//     {
//       q: "Do you also support scholarships and visa readiness?",
//       a: "Yes. We provide scholarship discovery, profile scoring, and visa-readiness guidance based on your selected destination.",
//     },
//   ];
//   return (
//     <div className="space-y-4">
//       {faqs.map((faq, i) => (
//         <div
//           key={i}
//           className={`rounded-[24px] overflow-hidden transition-all ${openIndex === i ? "bg-[#F1F6FF]" : "bg-[#F8FAFF] hover:bg-blue-50/50"}`}
//         >
//           <button
//             onClick={() => setOpenIndex(openIndex === i ? null : i)}
//             className="w-full px-8 py-7 flex items-center justify-between text-left group"
//           >
//             <span
//               className={`text-[18px] font-bold ${openIndex === i ? "text-[#3366FF]" : "text-gray-900"}`}
//             >
//               {faq.q}
//             </span>
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? "bg-[#3366FF] text-white rotate-180" : "bg-white text-gray-400 border border-gray-100"}`}
//             >
//               {openIndex === i ? (
//                 <Minus className="w-4 h-4" />
//               ) : (
//                 <Plus className="w-4 h-4" />
//               )}
//             </div>
//           </button>
//           <div
//             className={`px-8 transition-all overflow-hidden ${openIndex === i ? "max-h-[300px] pb-8 opacity-100" : "max-h-0 opacity-0"}`}
//           >
//             <p className="text-gray-500 font-medium leading-relaxed">{faq.a}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import EverythingSection from "@/components/home/EverythingSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import TrustedPartnersSection from "@/components/home/TrustedPartnersSection";
import AdmissionSection from "@/components/home/AdmissionSection";
import ConfidenceSection from "@/components/home/ConfidenceSection";

import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTABanner from "@/components/home/CTABanner";

import EstimateSection from "@/components/home/EstimateSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import VisaReadinessSection from "@/components/home/VisaReadinessSection";

const HomePage = () => (
  <div className="min-h-screen  px-6 sm:px-8 lg:px-12">
    <HeroSection />
    <StatsBar />
    <EverythingSection />
    <SolutionsSection />
    <EstimateSection />
    <TestimonialsSection/>
    <TrustedPartnersSection />
    <AdmissionSection />
    <ConfidenceSection />
    <VisaReadinessSection />
  
    <HowItWorksSection />
    <CTABanner />

  </div>
);

export default HomePage;
