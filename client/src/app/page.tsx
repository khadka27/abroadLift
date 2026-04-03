"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Globe,
  Landmark,
  Minus,
  Plus,
  UserRound,
} from "lucide-react";

type UniversityCard = {
  name: string;
  location: string;
  tuition: string;
  intake: string;
  image: string;
  badge: string;
};

const countryTabs = [
  "Canada",
  "United-States",
  "United Kingdom",
  "Australia",
  "Germany",
  "Ireland",
];

const universities: UniversityCard[] = [
  {
    name: "University of Oxford",
    location: "Oxford, United Kingdom",
    tuition: "$39,000",
    intake: "Sep 2026",
    image: "/uni-default.webp",
    badge: "#1 global",
  },
  {
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    tuition: "$32,000",
    intake: "Sep 2026",
    image: "/uni-default.webp",
    badge: "#7 global",
  },
  {
    name: "University of Singapore",
    location: "Singapore",
    tuition: "$17,000",
    intake: "Sep 2026",
    image: "/uni-default.webp",
    badge: "#23 global",
  },
];

const faqItems = [
  {
    q: "What is NextDegree?",
    a: "NextDegree helps students discover programs, estimate costs, check admission fit, and shortlist universities with one guided workflow.",
  },
  {
    q: "Can I use NextDegree before creating an account?",
    a: "Yes. You can explore programs and compare options first, then create your account when you want to save your progress.",
  },
  {
    q: "How do you calculate admission chances?",
    a: "We combine your profile details, historical acceptance trends, and program-level factors to provide a realistic range.",
  },
  {
    q: "Does NextDegree help with scholarships too?",
    a: "Yes. You can discover scholarship opportunities by destination and profile eligibility.",
  },
  {
    q: "Can partners and institutions join the platform?",
    a: "Yes. We provide dedicated partner tools for recruitment agencies and institutions.",
  },
];

const serviceCards = [
  "GIC Program",
  "Foreign Exchange",
  "Banking",
  "Visa Services",
  "Accommodations",
  "Program Search",
  "Instant Applications",
  "Language Tests",
];

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <main className="bg-[#f7f9ff] text-[#0e1423]">
      <section className="relative overflow-hidden border-b border-[#dfe7ff] bg-[#edf3ff] px-6 pb-10 pt-20 lg:px-10 lg:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-32 w-32 border-r border-b border-[#c4d6ff]" />
          <div className="absolute right-8 top-16 h-28 w-28 rounded-full border border-[#c8d9ff]" />
        </div>

        <div className="mx-auto grid w-full max-w-[1260px] gap-8 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <h1 className="max-w-[520px] text-4xl font-black leading-[1.08] tracking-tight lg:text-5xl">
              Your Path to Studying Abroad{" "}
              <span className="block text-[#2973f6]">Begins Here</span>
            </h1>
            <p className="mt-4 max-w-[500px] text-sm text-[#3d4a66] lg:text-base">
              Discover research programs, academic excellence, and global
              opportunities tailored for your specific career path.
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold lg:text-sm">
              <span className="text-[#2fa84f]">160+ Countries</span>
              <span className="text-[#ef4444]">1000+ Universities</span>
            </div>

            <Link
              href="/matches"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2f7cf6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#246ae2]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <Image
              src="/study.png"
              alt="Graduate student"
              width={500}
              height={500}
              className="mx-auto h-auto w-full"
              priority
            />
            <div className="absolute right-2 top-1/2 rounded-2xl bg-white px-4 py-2 shadow-xl">
              <p className="text-lg font-black">1000+</p>
              <p className="text-xs text-[#52607d]">partner universities</p>
            </div>
            <div className="absolute left-2 top-[68%] rounded-2xl bg-white px-4 py-2 shadow-xl">
              <p className="text-lg font-black">1600+</p>
              <p className="text-xs text-[#52607d]">active students</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-[1260px] grid-cols-2 gap-4 rounded-2xl border border-[#d6e3ff] bg-white/85 p-4 sm:grid-cols-4">
          {[
            "160+ Countries",
            "1000+ Universities",
            "5000+ Students Helped",
            "24/7 Student Support",
          ].map((metric) => (
            <div
              key={metric}
              className="flex items-center gap-3 rounded-xl px-2 py-1"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e6efff] text-[#2f7cf6]">
                <Globe className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-[#13213c]">
                {metric}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-14 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1260px] gap-10 lg:grid-cols-[560px_1fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-[560px]">
            <Image
              src="/students-laptop.png"
              alt="Students on laptop"
              width={560}
              height={350}
              className="h-auto w-full rounded-2xl"
            />
            <div className="absolute -right-3 top-6 rounded-full border-4 border-white bg-[#2f7cf6] px-5 py-4 text-center text-white shadow-xl">
              <p className="text-3xl font-black">95%</p>
              <p className="text-xs font-semibold">Acceptance Rate</p>
            </div>
            <div className="absolute bottom-[-12px] right-6 w-[210px] overflow-hidden rounded-xl border-2 border-white shadow-lg">
              <Image
                src="/students-reading.png"
                alt="Counseling session"
                width={210}
                height={130}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight lg:text-5xl">
              Find Your Ideal Study Destination
            </h2>
            <p className="mt-4 max-w-[560px] text-sm text-[#4a5876] lg:text-base">
              We have simplified exploring universities and applying for your
              study program. Discover top universities, scholarship
              opportunities, and more in just a few clicks.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-[#2a3652]">
              {[
                "Easily explore top universities",
                "Access programs in 160+ countries",
                "Find scholarships and financial aid",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-[#2f7cf6]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2f7cf6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
            >
              Create an Student Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#dfe7ff] bg-[#edf3ff] px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1260px]">
          <h2 className="mx-auto max-w-[780px] text-center text-4xl font-black leading-tight lg:text-5xl">
            Find Every Solution, From Applications to{" "}
            <span className="text-[#2f7cf6]">Accomodations</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-center text-sm text-[#4f5f81] lg:text-base">
            Access our full 360 solutions, covering everything from application
            to arrival.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((service) => (
              <article
                key={service}
                className="rounded-2xl border border-[#dbe6ff] bg-white p-5 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f0ff] text-[#2f7cf6]">
                  <Landmark className="h-4 w-4" />
                </div>
                <h3 className="text-base font-extrabold">{service}</h3>
                <p className="mt-2 text-sm text-[#5c6b88]">
                  Built for students and partner teams to move faster.
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2f7cf6] px-6 py-3 text-sm font-bold text-white"
            >
              Register as a Student
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1260px]">
          <h2 className="text-center text-4xl font-black lg:text-5xl">
            What Our Students Have to Say
          </h2>
          <p className="mt-3 text-center text-sm text-[#5a6988] lg:text-base">
            Hear from real international students about their experience.
          </p>

          <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-[120px_1fr_120px] items-center gap-4 rounded-2xl bg-[#f8faff] p-4 lg:grid-cols-[220px_1fr_220px] lg:p-6">
            <Image
              src="/testimonial-1.png"
              alt="Student testimonial"
              width={220}
              height={240}
              className="h-[120px] w-[120px] rounded-xl object-cover lg:h-[220px] lg:w-[220px]"
            />
            <div>
              <p className="text-sm leading-relaxed text-[#33415f] lg:text-base">
                I tried applying to institutions and it took months. With
                NextDegree I got clarity quickly and found programs that
                actually fit my profile and budget.
              </p>
              <p className="mt-5 text-lg font-black">MARIA SMITH</p>
              <p className="text-sm text-[#5a6988]">
                Computer Science Student, University of Greenwich
              </p>
            </div>
            <Image
              src="/testimonial-2.png"
              alt="Student portrait"
              width={220}
              height={240}
              className="hidden h-[220px] w-[220px] rounded-xl object-cover lg:block"
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-[#2f7cf6]">
            <button
              type="button"
              className="rounded-full p-2 hover:bg-[#e8f0ff]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((dot) => (
                <span
                  key={dot}
                  className={`h-2 w-2 rounded-full ${dot === 1 ? "bg-[#2f7cf6]" : "bg-[#d2dcf6]"}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-[#e8f0ff]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe7ff] bg-white px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1260px]">
          <p className="text-center text-xs font-black uppercase tracking-[0.14em] text-[#2f7cf6]">
            Trusted Partners
          </p>
          <h2 className="mx-auto mt-4 max-w-[760px] text-center text-4xl font-black leading-tight lg:text-5xl">
            Trusted by 1,500+ Universities, Colleges and Schools Worldwide
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {countryTabs.map((tab) => (
              <span
                key={tab}
                className="rounded-full border border-[#d7e3ff] bg-[#f7faff] px-4 py-2 text-xs font-semibold text-[#23324f]"
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <article
                key={uni.name}
                className="overflow-hidden rounded-2xl border border-[#d8e3ff] bg-white shadow-sm"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={uni.image}
                    alt={uni.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#e6efff] px-2.5 py-1 text-[11px] font-bold text-[#2f7cf6]">
                    {uni.badge}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-[#e6efff] px-2.5 py-1 text-[11px] font-bold text-[#2f7cf6]">
                    Scholarship Available
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-black">{uni.name}</h3>
                  <p className="mt-1 text-sm text-[#5a6988]">{uni.location}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-[#5a6988]">Tuition/Year</p>
                      <p className="font-bold">{uni.tuition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#5a6988]">Next intake</p>
                      <p className="font-bold">{uni.intake}</p>
                    </div>
                  </div>
                  <Link
                    href="/matches"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#2f7cf6] px-4 py-3 text-sm font-bold text-white"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2f7cf6] px-5 py-3 text-sm font-bold text-white"
            >
              Explore More Canadian Institutions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#edf3ff] px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1260px]">
          <p className="text-center text-xs font-black uppercase tracking-[0.14em] text-[#2f7cf6]">
            Recruitment Partners
          </p>
          <h2 className="mt-4 text-center text-4xl font-black lg:text-5xl">
            How We Help Recruitment Partners
          </h2>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  "150,000+ Programs",
                  "Access programs at 1,500+ academic institutions globally",
                ],
                [
                  "AI-Powered Tools",
                  "Benefit from 95% application success-rate technology",
                ],
                [
                  "Complete Support",
                  "From language tests to student loans and accommodations",
                ],
                [
                  "Dedicated Team",
                  "Expert support and resources to grow your agency",
                ],
              ].map(([title, text]) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[#dbe6ff] bg-white p-5"
                >
                  <h3 className="text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm text-[#5a6988]">{text}</p>
                </article>
              ))}

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2f7cf6] px-6 py-3 text-sm font-bold text-white"
              >
                Join Our Network
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Image
                src="/group.png"
                alt="Partner operations"
                width={420}
                height={420}
                className="h-full min-h-[240px] w-full rounded-2xl object-cover"
              />
              <Image
                src="/students-reading.png"
                alt="Partner manager"
                width={420}
                height={420}
                className="h-full min-h-[240px] w-full rounded-2xl object-cover"
              />
              <div className="rounded-2xl bg-[#2f7cf6] p-5 text-white sm:col-span-2">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100">
                  <GraduationIcon />
                  Success metrics
                </p>
                <p className="mt-2 text-4xl font-black">1.3M+</p>
                <p className="text-sm">Students helped</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1260px] items-center justify-between overflow-hidden rounded-[26px] bg-gradient-to-r from-[#226ae6] to-[#3f86ff] px-8 py-10 text-white">
          <div>
            <h2 className="text-3xl font-black lg:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-2 max-w-[560px] text-sm text-blue-100 lg:text-base">
              Create a free account and get personalized university
              recommendations based on your profile.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#1f5fd9]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Image
            src="/hero-student.png"
            alt="Graduate"
            width={260}
            height={260}
            className="hidden h-[220px] w-auto lg:block"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1260px] gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] px-3 py-1 text-xs font-bold text-[#2f7cf6]">
              <CircleHelp className="h-3.5 w-3.5" />
              FAQ
            </p>
            <h2 className="mt-5 text-4xl font-black leading-tight lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-[460px] text-sm text-[#5a6988] lg:text-base">
              Still wondering about studying abroad and how we can get you
              there? Read these answers to our most common questions.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <article
                key={item.q}
                className="overflow-hidden rounded-xl border border-[#dde8ff] bg-[#f3f7ff]"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() =>
                    setActiveFaq((prev) => (prev === idx ? -1 : idx))
                  }
                >
                  <span className="font-bold">{item.q}</span>
                  {activeFaq === idx ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="border-t border-[#dde8ff] px-5 py-4 text-sm text-[#576788]">
                    {item.a}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#dfe7ff] bg-[#edf3ff] px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1260px]">
          <p className="mx-auto w-fit rounded-full border border-[#bcd4ff] bg-white px-4 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#2f7cf6]">
            Choose your path
          </p>
          <h2 className="mt-5 text-center text-4xl font-black lg:text-5xl">
            Get Started With NextDegree
          </h2>
          <p className="mx-auto mt-3 max-w-[760px] text-center text-sm text-[#5c6a89] lg:text-base">
            Join thousands of students, partners, and institutions transforming
            international education worldwide.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <PathCard
              title="Student"
              image="/students-reading.png"
              cta="Sign Up For Free"
              href="/register"
              bullets={[
                "Free university search & comparison",
                "Expert counseling & guidance",
                "Application & visa assistance",
              ]}
            />
            <PathCard
              title="Recruitment Partner"
              image="/group.png"
              cta="Become a Recruitment Partner"
              href="/register"
              bullets={[
                "Access to global institutions",
                "Advanced management tools",
                "Commission tracking system",
              ]}
            />
            <PathCard
              title="Partner Institution"
              image="/students-laptop.png"
              cta="Become a Partner Institution"
              href="/register"
              bullets={[
                "1500+ partner institutions",
                "Qualified student applications",
                "Dedicated support team",
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function PathCard({
  title,
  image,
  cta,
  href,
  bullets,
}: {
  title: string;
  image: string;
  cta: string;
  href: string;
  bullets: string[];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#d7e3ff] bg-white shadow-sm">
      <Image
        src={image}
        alt={title}
        width={500}
        height={260}
        className="h-44 w-full object-cover"
      />
      <div className="p-5">
        <h3 className="text-3xl font-black leading-none">{title}</h3>
        <p className="mt-3 text-sm text-[#5a6988]">
          Built for reliable outcomes with transparent and fast workflows.
        </p>

        <ul className="mt-4 space-y-2">
          {bullets.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-[#2f3d5e]"
            >
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#e7f0ff] text-[#2f7cf6]">
                <Check className="h-3 w-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2f7cf6] px-4 py-3 text-sm font-bold text-white"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function GraduationIcon() {
  return <UserRound className="h-4 w-4" />;
}
