import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Globe2,
  Building2,
  Zap,
} from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { href: "/matches", label: "Find Universities" },
    { href: "/#features", label: "Features" },
    { href: "/#countries", label: "Destinations" },
    { href: "/#how-it-works", label: "How It Works" },
  ],
  Destinations: [
    { href: "/matches?country=USA", label: "United States" },
    { href: "/matches?country=UK", label: "United Kingdom" },
    { href: "/matches?country=AU", label: "Australia" },
    { href: "/matches?country=CA", label: "Canada" },
    { href: "/matches?country=DE", label: "Germany" },
    { href: "/matches?country=IE", label: "Ireland" },
    { href: "/matches?country=NL", label: "Netherlands" },
  ],
  "Data Sources": [
    { href: "https://collegescorecard.ed.gov", label: "US College Scorecard" },
    { href: "https://api.worqnow.ai", label: "WorqNow Education API" },
    { href: "https://api.data.gov", label: "Data.gov" },
  ],
};

const BADGES = [
  { icon: ShieldCheck, label: "No Login Required" },
  { icon: Globe2, label: "7 Countries" },
  { icon: Building2, label: "Government Data" },
  { icon: Zap, label: "Real-Time Matches" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-gray-100 overflow-hidden pt-20 pb-10">
      <div className="absolute top-0 left-0 right-0 w-full h-1 bg-linear-to-r from-[#17a38b] via-[#3366FF] to-[#bba5d9] opacity-80" />

      {/* Soft Glow */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-blue-50 blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 group mb-5 w-fit no-underline"
            >
              <div className="w-10 h-10 rounded-[14px] bg-linear-to-br from-[#17a38b] to-[#128a7e] flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-[1.05] transition-transform duration-300">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <span className="font-black text-2xl tracking-tight text-gray-900 group-hover:text-teal-700 transition-colors">
                NextDegree
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8 pr-4">
              Real-time university matching powered by government-grade
              education APIs. No login locks. No hidden fees. Just immediate
              results.
            </p>

            <Link
              href="/matches"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white px-6 py-3.5 rounded-2xl bg-[#3366FF] hover:bg-[#2952CC] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 shadow-md"
            >
              <GraduationCap className="w-5 h-5" /> Start Matching Now
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="text-[11px] font-black tracking-[0.15em] uppercase text-gray-400 mb-6">
                {group}
              </div>
              <ul className="flex flex-col gap-4 list-none m-0 p-0">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[15px] font-medium text-gray-600 hover:text-[#3366FF] transition-colors duration-200"
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[13px] font-medium text-gray-400 text-center md:text-left">
            © {year} NextDegree — Built for students attempting to change the
            world.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <span
                  key={b.label}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl hover:border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <Icon className="w-4 h-4 text-gray-400" /> {b.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
