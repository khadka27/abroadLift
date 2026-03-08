import Link from "next/link";
import CountryCard from "@/components/CountryCard";
import {
  GraduationCap,
  ArrowRight,
  Globe2,
  Wallet,
  Zap,
  Brain,
  BadgeCheck,
  FileSearch,
  Sparkles,
  TrendingUp,
  Search,
  CheckCircle2,
  Calculator,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Static Data
───────────────────────────────────────────── */
const STATS = [
  { value: "65+", label: "API Endpoints", icon: Zap },
  { value: "7", label: "Countries", icon: Globe2 },
  { value: "6K+", label: "Universities", icon: BuildingIcon },
  { value: "Free", label: "Forever", icon: BadgeCheck },
];

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

const COUNTRIES = [
  {
    flag: "🇺🇸",
    name: "United States",
    universities: "4,000+",
    color: "#3b82f6",
  },
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    universities: "160+",
    color: "#8b5cf6",
  },
  { flag: "🇦🇺", name: "Australia", universities: "43+", color: "#10b981" },
  { flag: "🇨🇦", name: "Canada", universities: "100+", color: "#f59e0b" },
  { flag: "🇩🇪", name: "Germany", universities: "400+", color: "#ef4444" },
  { flag: "🇮🇪", name: "Ireland", universities: "30+", color: "#06b6d4" },
  { flag: "🇳🇱", name: "Netherlands", universities: "80+", color: "#ec4899" },
];

const TRUST_BADGES = [
  { icon: Globe2, label: "College Scorecard API" },
  { icon: FileSearch, label: "WorqNow Education API" },
  { icon: BadgeCheck, label: "Data.gov Verified" },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="w-full bg-[#f8f9fc] text-[#0f172a] font-sans selection:bg-[#3366FF]/20 selection:text-[#3366FF] overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-[140px] pb-[100px] px-6 lg:px-8">
        {/* Background Canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-[#ffffff] via-[#f8f9fc] to-[#f8f9fc]" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.3] mix-blend-multiply"
            style={{
              backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "linear-gradient(to bottom, black 30%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 30%, transparent 100%)",
            }}
          />

          {/* Glowing Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-linear-to-b from-[#3366FF]/[0.06] to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#17a38b]/[0.05] blur-[150px] animate-float" />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/[0.05] blur-[140px] animate-float-slow" />
        </div>

        <div className="relative max-w-[1240px] mx-auto text-center z-10">
          {/* Release Badge */}
          <Link
            href="/matches"
            className="fade-up inline-flex items-center gap-2.5 bg-white border border-[#3366FF]/20 rounded-full px-4 py-2 text-[13px] font-bold text-[#3366FF] mb-10 shadow-sm shadow-[#3366FF]/10 transition-all hover:shadow-[#3366FF]/20 hover:border-[#3366FF]/40 hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3366FF]/10">
              <Sparkles className="w-3 h-3 text-[#3366FF] animate-pulse" />
            </span>
            Meet the New V2 Matching Engine
            <ArrowRight className="w-3.5 h-3.5 opacity-70" />
          </Link>

          {/* Epic Headline */}
          <h1
            className="fade-up delay-100 font-extrabold leading-[1.05] tracking-tight mb-8 text-[#0f172a]"
            style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
          >
            Find universities <br className="hidden md:block" />
            that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-[#3366FF] to-[#17a38b] bg-clip-text text-transparent">
                actually fit you.
              </span>
              <svg
                className="absolute w-full h-4 -bottom-1 left-0 text-[#17a38b]/30 z-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="fade-up delay-200 mx-auto mb-12 text-[#64748b] font-medium"
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              maxWidth: "660px",
              lineHeight: 1.6,
            }}
          >
            Enter your English score, budget, and dream country. We instantly
            cross-match your credentials against 6,000+ programs worldwide. No
            bias, no fees.
          </p>

          {/* CTA Group */}
          <div className="fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/matches"
              className="relative inline-flex items-center gap-3 bg-[#3366FF] text-white font-bold px-10 py-5 rounded-[20px] text-[17px] shadow-lg shadow-[#3366FF]/25 hover:bg-[#2952cc] transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              <Search className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
              Start Matching Now
            </Link>
            <Link
              href="/costing"
              className="inline-flex items-center gap-3 bg-white text-[#475569] font-bold px-9 py-5 rounded-[20px] text-[17px] shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              <Calculator
                className="w-5 h-5 text-emerald-500 flex-shrink-0"
                strokeWidth={2.5}
              />
              Cost Estimator (NPR)
            </Link>
          </div>

          <p className="fade-up delay-400 mt-8 text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            100% Free. No Login Required.
          </p>
        </div>

        {/* ── HIGH FIDELITY MOCKUP PREVIEW ── */}
        <div className="fade-up focus-in delay-500 relative max-w-[1000px] mx-auto mt-20 z-20">
          <div className="absolute -inset-1.5 bg-linear-to-b from-[#3366FF]/20 to-transparent rounded-[32px] blur-xl opacity-70" />
          <div className="relative rounded-[28px] border border-white/50 bg-white/40 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Fake Browser Titlebar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white/60">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100/80 px-4 py-1.5 rounded-full text-[12px] font-medium text-gray-500">
                <Globe2 className="w-3 h-3" /> nextdegree.com/matches
              </div>
              <div className="w-12" /> {/* spacer for flex centering */}
            </div>

            {/* Fake Dashboard Content */}
            <div className="p-4 md:p-8 bg-gray-50/50 flex flex-col md:flex-row gap-6 items-center">
              {/* Fake form input stack */}
              <div className="flex-1 w-full space-y-4">
                <div className="h-4 w-32 bg-gray-200 rounded-full mb-6" />
                <div className="h-[52px] w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center px-4 gap-3">
                  <Search className="w-5 h-5 text-blue-500" />
                  <div className="h-2 w-48 bg-gray-100 rounded-full" />
                </div>
                <div className="h-[52px] w-full bg-white rounded-2xl border border-blue-400 ring-4 ring-blue-500/10 shadow-sm flex items-center px-4 gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#17a38b]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#17a38b]" />
                  </div>
                  <div className="font-bold text-gray-700 text-sm">
                    Computer Science
                  </div>
                </div>
              </div>

              {/* Fake result card */}
              <div className="flex-1 w-full bg-white rounded-3xl p-6 shadow-xl shadow-blue-500/5 relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#3366FF]/5 rounded-bl-[100px]" />
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-gray-800 rounded-lg mb-2" />
                    <div className="h-3 w-24 bg-gray-300 rounded-full flex gap-1 mb-6"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-500">
                    💰 $15,000/yr
                  </div>
                  <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-500">
                    📈 45% Accept
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRANDING LOGOS ── */}
      <section className="py-10 border-y border-gray-200/60 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 items-center flex-col md:flex-row">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
            Powered by live structured intelligence from
          </span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {TRUST_BADGES.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 group cursor-default"
                >
                  <Icon className="w-6 h-6 text-gray-300 group-hover:text-[#3366FF] transition-colors" />
                  <span className="text-[17px] font-black text-gray-400 group-hover:text-gray-900 transition-colors tracking-tight">
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section id="features" className="py-32 px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[#3366FF] font-black tracking-[0.2em] uppercase text-xs mb-4">
              The NextDegree Advantage
            </h2>
            <h3 className="font-extrabold text-[36px] md:text-[54px] text-[#0f172a] leading-[1.1] tracking-tight mb-6">
              Smarter matching. <br className="hidden md:block" /> No
              spreadsheets.
            </h3>
            <p className="text-[19px] text-[#64748b] font-medium leading-relaxed">
              We ditched the biased agency recommendations. Instead, we use live
              API data to score every program against your exact academic and
              financial profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[340px]">
            {/* BENTO CARD 1: Large Span */}
            <div className="md:col-span-2 rounded-[32px] bg-white border border-gray-200 p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_top_right,#3366FF15,transparent_50%)] opacity-0 group-hover:opacity-100 transition-duration-700 pointer-events-none" />
              <div className="relative z-10 w-16 h-16 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Brain className="w-8 h-8" />
              </div>
              <div className="relative z-10">
                <h4 className="text-[28px] font-black text-[#0f172a] mb-3 tracking-tight">
                  Algorithmic Match Scoring
                </h4>
                <p className="text-[17px] font-medium text-[#64748b] mb-0 max-w-md leading-relaxed">
                  Enter your exact budget, IELTS score, and degree timeline. We
                  run it against 6,000+ data nodes to return precisely what
                  you&apos;re eligible for.
                </p>
              </div>
              {/* Decor visual inside card */}
              <div className="absolute -bottom-10 -right-10 w-[60%] h-[70%] bg-gray-50 rounded-tl-3xl border-t border-l border-gray-200 p-6 flex flex-col gap-4 shadow-2xl skew-x-[-10deg] rotate-[-5deg] group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-500">
                <div className="w-full bg-white h-12 rounded-xl shadow-sm border border-gray-100 flex items-center px-4 gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <div className="w-24 h-2 bg-gray-200 rounded-full" />
                </div>
                <div className="w-full bg-white h-12 rounded-xl shadow-sm border border-gray-100 flex items-center px-4 gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <div className="w-32 h-2 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>

            {/* BENTO CARD 2: Vertical */}
            <div className="md:col-span-1 rounded-[32px] bg-[#0A2540] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group shadow-lg">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10 w-16 h-16 rounded-[20px] bg-white/10 text-emerald-400 flex items-center justify-center mb-6 backdrop-blur-md">
                <Wallet className="w-8 h-8" />
              </div>
              <div className="relative z-10">
                <h4 className="text-[28px] font-black text-white mb-3 tracking-tight leading-tight">
                  Strictly Budget-Aware
                </h4>
                <p className="text-[17px] font-medium text-blue-100/70 mb-0 leading-relaxed">
                  Filter out programs you can&apos;t afford. Zero hidden fees.
                  Know the exact tuition before you apply.
                </p>
              </div>
            </div>

            {/* BENTO CARD 3: Horizontal Half */}
            <div className="md:col-span-1 rounded-[32px] bg-white border border-gray-200 p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group hover:border-[#17a38b]/50 transition-colors">
              <div className="relative z-10 w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-6 border border-teal-100">
                <Globe2 className="w-7 h-7" />
              </div>
              <div className="relative z-10">
                <h4 className="text-[24px] font-black text-[#0f172a] mb-2 tracking-tight">
                  7 Countries Included
                </h4>
                <p className="text-[15px] font-medium text-[#64748b] leading-relaxed">
                  US, UK, Australia, Canada, Germany, Ireland, and Netherlands.
                  All unified in a single flow.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 rounded-[32px] bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between overflow-hidden relative group shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="relative z-10 flex-1 pr-6">
                <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                  <Calculator className="w-7 h-7" />
                </div>
                <h4 className="text-[28px] font-black text-[#0f172a] mb-3 tracking-tight">
                  Cost Estimator in NPR
                </h4>
                <p className="text-[17px] font-medium text-[#64748b] leading-relaxed max-w-sm">
                  Switch from USD to NPR instantly. Use our global living cost
                  index to calculate rent, food, and tuition in localized
                  currency.
                </p>
                <Link
                  href="/costing"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                >
                  Try Estimator <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Visual decor */}
              <div className="w-full sm:w-[300px] h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-12 h-2 bg-slate-100 rounded-full mb-4" />
                  <div className="text-2xl font-black text-slate-900 mb-1">
                    रू 15,40,000
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Total Annual Cost (NPR)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS (Clean Data Row) ── */}
      <section className="py-24 border-y border-gray-200 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-12 divide-x divide-gray-100">
          {STATS.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center px-4 text-center"
            >
              <div className="text-[44px] md:text-[56px] font-black text-[#0f172a] tracking-tighter mb-1">
                {s.value}
              </div>
              <div className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COUNTRIES ── */}
      <section id="countries" className="py-32 px-6 lg:px-8 bg-[#FAFBFF]">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[#17a38b] font-black tracking-[0.2em] uppercase text-xs mb-4">
                Destinations
              </h2>
              <h3 className="font-extrabold text-[36px] md:text-[54px] text-[#0f172a] leading-[1.1] tracking-tight">
                7 top countries.
                <br /> Unified in one seamless flow.
              </h3>
            </div>
            <p className="text-[18px] text-[#64748b] font-medium leading-relaxed max-w-sm pb-2">
              Access live structured data from world-class global ranking
              indices and scorecards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {COUNTRIES.map((c) => (
              <CountryCard
                key={c.name}
                flag={c.flag}
                name={c.name}
                universities={c.universities}
                color={c.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (Timeline Grid) ── */}
      <section
        id="how-it-works"
        className="py-32 px-6 relative overflow-hidden bg-white border-t border-gray-100"
      >
        <div className="relative max-w-[1240px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[#8b5cf6] font-black tracking-[0.2em] uppercase text-xs mb-4">
              The Process
            </h2>
            <h3 className="font-extrabold text-[36px] md:text-[54px] text-[#0f172a] leading-[1.1] tracking-tight mb-6">
              From zero to shortlist.
              <br /> Just 4 simple steps.
            </h3>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
            {/* Visual Line connector for desktop */}
            <div className="hidden md:block absolute top-[40px] left-0 w-full h-1 bg-gray-100 rounded-full z-0" />
            <div className="hidden md:block absolute top-[40px] left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500/50 to-transparent rounded-full z-0" />

            {[
              {
                step: "01",
                icon: GraduationCap,
                title: "Your Profile",
                desc: "Enter your degree level, GPA, and intended field of study.",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
              },
              {
                step: "02",
                icon: FileSearch,
                title: "Test Scores",
                desc: "Add your latest IELTS, TOEFL, or PTE scores for exact matching.",
                color: "text-teal-600",
                bg: "bg-teal-50",
                border: "border-teal-200",
              },
              {
                step: "03",
                icon: Wallet,
                title: "Strict Budget",
                desc: "Set your max yearly tuition limit across any currency.",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200",
              },
              {
                step: "04",
                icon: Sparkles,
                title: "View Matches",
                desc: "We scan the database and surface only the ones that fit you.",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative z-10 flex flex-col items-start md:items-center md:text-center group"
                >
                  <div
                    className={`w-[80px] h-[80px] rounded-2xl ${s.bg} border ${s.border} flex flex-col items-center justify-center mb-8 shadow-sm group-hover:-translate-y-2 transition-transform duration-300`}
                  >
                    <span className={`text-[12px] font-black ${s.color}`}>
                      {s.step}
                    </span>
                    <Icon
                      className={`w-6 h-6 ${s.color} mt-1`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h4 className="text-[22px] font-black text-[#0f172a] mb-3 tracking-tight">
                    {s.title}
                  </h4>
                  <p className="text-[16px] text-[#64748b] font-medium leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EPIC CTA SECTION ── */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden bg-[#fafbff]">
        {/* Soft Background Plate */}
        <div className="absolute inset-x-6 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-[1240px] inset-y-10 rounded-[48px] bg-linear-to-br from-[#0A2540] via-[#0A2540] to-[#1e3b8a] shadow-2xl overflow-hidden">
          {/* Abstract glows inside CTA */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />

          <div className="relative text-center py-24 px-6 sm:px-12 z-10 h-full flex flex-col justify-center items-center">
            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#3366FF] to-blue-400 p-[2px] mx-auto mb-10 shadow-2xl">
              <div className="w-full h-full bg-[#0A2540] rounded-[26px] flex items-center justify-center">
                <GraduationCap
                  className="w-10 h-10 text-white"
                  strokeWidth={2}
                />
              </div>
            </div>

            <h2
              className="font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-md"
              style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
            >
              Find your absolute <br />
              best match today.
            </h2>
            <p className="text-[20px] md:text-[24px] font-medium text-blue-100/70 mb-14 leading-relaxed max-w-2xl mx-auto">
              Skip the agency fees and Google stress. Take control of your
              academic future in less than 2 minutes.
            </p>

            <Link
              href="/matches"
              className="inline-flex items-center justify-center gap-3 bg-white text-[#0A2540] hover:bg-gray-50 font-black px-12 py-6 rounded-2xl text-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]"
            >
              <Zap className="w-6 h-6 fill-blue-600 text-blue-600" /> Start
              Matching Free
            </Link>

            <p className="mt-8 text-[14px] font-bold text-blue-300/50 uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" /> No Credit Card Required
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
