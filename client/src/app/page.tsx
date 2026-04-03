"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Compass,
  Globe2,
  GraduationCap,
  MapPin,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
} from "lucide-react";

type Destination = {
  name: string;
  code: string;
  highlight: string;
  rank: string;
  tuition: string;
  intake: string;
  city: string;
  image: string;
};

const DESTINATIONS: Record<string, Destination[]> = {
  Canada: [
    {
      name: "University of Toronto",
      code: "CA",
      highlight: "Strong research + co-op options",
      rank: "#1 in Canada",
      tuition: "$45k / year",
      intake: "Sep 2026",
      city: "Toronto",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200",
    },
    {
      name: "University of British Columbia",
      code: "CA",
      highlight: "Global STEM reputation",
      rank: "#2 in Canada",
      tuition: "$40k / year",
      intake: "Sep 2026",
      city: "Vancouver",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
    },
  ],
  USA: [
    {
      name: "Stanford University",
      code: "US",
      highlight: "Innovation + startup ecosystem",
      rank: "#2 in USA",
      tuition: "$58k / year",
      intake: "Sep 2026",
      city: "Stanford",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200",
    },
    {
      name: "Harvard University",
      code: "US",
      highlight: "Elite academics + strong network",
      rank: "#1 in USA",
      tuition: "$55k / year",
      intake: "Sep 2026",
      city: "Cambridge",
      image:
        "https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&q=80&w=1200",
    },
  ],
  UK: [
    {
      name: "University of Oxford",
      code: "UK",
      highlight: "Historic excellence + global brand",
      rank: "#1 in UK",
      tuition: "$39k / year",
      intake: "Sep 2026",
      city: "Oxford",
      image:
        "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=1200",
    },
    {
      name: "University of Cambridge",
      code: "UK",
      highlight: "Top research in science and engineering",
      rank: "#2 in UK",
      tuition: "$42k / year",
      intake: "Sep 2026",
      city: "Cambridge",
      image:
        "https://images.unsplash.com/photo-1491333078588-55b6733c7de6?auto=format&fit=crop&q=80&w=1200",
    },
  ],
};

const FAQS = [
  {
    q: "Is AbroadLift free for students?",
    a: "Yes. Matching, profile scoring, and estimate tools are free for students.",
  },
  {
    q: "Can I use it before creating an account?",
    a: "Yes. You can explore and complete your profile flow first, then sign in when you are ready.",
  },
  {
    q: "How accurate are match recommendations?",
    a: "Matches are generated from your profile inputs, historical trends, and program-level constraints.",
  },
];

export default function HomePage() {
  const [activeCountry, setActiveCountry] =
    useState<keyof typeof DESTINATIONS>("Canada");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="overflow-hidden bg-[#f6f8ff] text-slate-900 selection:bg-blue-500/20 selection:text-blue-900">
      <section className="relative px-6 pb-16 pt-28 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#3b82f6]/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#22c55e]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-56 w-[680px] -translate-x-1/2 rounded-full bg-[#2563eb]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Admission Intelligence Platform
            </span>

            <h1 className="mt-6 text-[38px] font-black leading-[1.05] tracking-tight sm:text-[52px] lg:text-[68px]">
              <span className="block">Shape Your Global</span>
              <span className="block bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#14b8a6] bg-clip-text text-transparent">
                Study Trajectory
              </span>
            </h1>

            <p className="mt-6 max-w-[620px] text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
              Build your profile once, compare real universities instantly, and
              move from uncertainty to a confident shortlist with data-backed
              admission predictions.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2563eb] px-7 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
              >
                Start Matching
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/costing"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                Estimate Costs
              </Link>
            </div>

            <div className="mt-8 grid max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                "160+ destinations",
                "1,500+ institutions",
                "No lock-in to start",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-8 h-40 w-40 rounded-full bg-[#2563eb]/20 blur-3xl" />
            <div className="relative rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_80px_rgba(29,78,216,0.18)] backdrop-blur">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">
                    Profile Match Engine
                  </p>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    Live
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">92%</p>
                <p className="text-sm text-slate-200">Average fit accuracy</p>
              </div>

              <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Image
                  src="/hero-student.png"
                  alt="Student success"
                  width={560}
                  height={420}
                  className="mx-auto h-auto w-full max-w-[360px] object-contain"
                  priority
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: Globe2, label: "Countries", value: "160+" },
                  { icon: Building2, label: "Universities", value: "1500+" },
                  { icon: GraduationCap, label: "Programs", value: "120k+" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-100 bg-white p-3"
                  >
                    <item.icon className="h-4 w-4 text-blue-600" />
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {item.value}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Compass,
              title: "Destination Fit",
              text: "Personalized choices, not generic lists.",
            },
            {
              icon: Wallet,
              title: "Budget Clarity",
              text: "Compare tuition and living costs early.",
            },
            {
              icon: ShieldCheck,
              title: "Reliable Inputs",
              text: "Program-level constraints and trends.",
            },
            {
              icon: Trophy,
              title: "Decision Confidence",
              text: "Shortlist based on measurable signals.",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-[#dbe8ff] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <card.icon className="h-5 w-5 text-[#2563eb]" />
              <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1240px] rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 lg:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                Workflow
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
                Fast, deliberate, and data-driven
              </h2>
            </div>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"
            >
              Check your eligibility
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Build Your Profile",
                desc: "Academic history, tests, budget, and goals in one guided flow.",
              },
              {
                step: "02",
                title: "Compare Universities",
                desc: "Evaluate matches by fit score, tuition, acceptance trend, and visa risk.",
              },
              {
                step: "03",
                title: "Move To Action",
                desc: "Save your shortlist and continue with admission and visa planning.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                  Step {item.step}
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12 lg:py-20" id="countries">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                Destinations
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
                Browse high-fit universities by country
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              Find Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap gap-2.5">
            {(
              Object.keys(DESTINATIONS) as Array<keyof typeof DESTINATIONS>
            ).map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => setActiveCountry(country)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  activeCountry === country
                    ? "bg-[#2563eb] text-white shadow-lg shadow-blue-600/25"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {DESTINATIONS[activeCountry].map((uni) => (
              <article
                key={uni.name}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={uni.image}
                    alt={uni.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-blue-700">
                    {uni.rank}
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {uni.name}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {uni.code}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {uni.highlight}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {uni.city}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <Wallet className="h-4 w-4 text-slate-500" />
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {uni.tuition}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <CalendarClock className="h-4 w-4 text-slate-500" />
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {uni.intake}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/matches"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-bold text-white"
                  >
                    See Match Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12 lg:py-20" id="how-it-works">
        <div className="mx-auto grid max-w-[1240px] gap-8 rounded-[34px] bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f766e] p-8 text-white shadow-2xl lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
              Scholarship Assistant
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight lg:text-4xl">
              Discover funding paths before you apply
            </h2>
            <p className="mt-4 max-w-[700px] text-base font-medium text-slate-100/90">
              Filter scholarships by destination, eligibility profile, and
              field-of-study criteria. Prioritize opportunities with the highest
              chance of conversion.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-900"
          >
            Explore Scholarships
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12 lg:py-24" id="features">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
              Answers students usually need first
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-slate-600">
              Everything important before you decide your destination and start
              your application path.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, index) => (
              <article
                key={item.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() =>
                    setOpenFaq((prev) => (prev === index ? null : index))
                  }
                >
                  <span className="text-base font-bold text-slate-900">
                    {item.q}
                  </span>
                  <span className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
                    {openFaq === index ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-sm font-medium leading-relaxed text-slate-600">
                      {item.a}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-6 lg:px-12 lg:pb-28">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 lg:flex-row lg:px-10 lg:text-left">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 lg:text-3xl">
              Ready to build your shortlist?
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-600 lg:text-base">
              Start with your profile and get recommendations in minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-800"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
