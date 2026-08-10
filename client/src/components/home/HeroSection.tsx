"use client";
import { ArrowRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";


/* ─── Destination pill ───────────────────────────────────────────── */
const Destination = ({
  flag,
  name,
  delay,
}: {
  flag: string;
  name: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ x: 6 }}
    className="flex items-center gap-2.5 cursor-pointer group"
  >
    <span className="text-2xl">{flag}</span>
    <span className="text-[15px] font-bold text-[#334155] group-hover:text-[#3366FF] transition-colors">
      {name}
    </span>
    <div className="h-px flex-1 bg-[#e2e8f0] group-hover:bg-[#3366FF]/30 transition-colors" />
  </motion.div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] lg:min-h-[95vh] bg-white overflow-hidden flex flex-col w-full pt-28 lg:pt-24 pb-16">

      {/* ── BACKGROUND TEXTURE: subtle dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #dde8ff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }}
      />

      {/* ── SOLID ACCENT BLOCK top-right ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 w-[420px] h-[420px] lg:w-[580px] lg:h-[580px] bg-[#EEF3FF] rounded-bl-[120px] pointer-events-none z-0 hidden lg:block"
      />

      {/* ── SOLID ACCENT BLOCK bottom-left ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#F0F5FF] rounded-tr-[80px] pointer-events-none z-0"
      />

      {/* ── Vertical stripe decorations ── */}
      <div className="absolute top-0 left-[7%] h-full w-px bg-[#e8edf5] pointer-events-none hidden xl:block" />
      <div className="absolute top-0 left-[7.3%] h-full w-px bg-[#e8edf5]/50 pointer-events-none hidden xl:block" />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex-grow flex flex-col">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-8 flex-grow items-center">

          {/* ── LEFT ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center w-full"
          >
            {/* Eyebrow tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 w-fit mx-auto lg:mx-0"
            >
             
            </motion.div>

            {/* Headline */}
            <h1 className="text-[44px] sm:text-[56px] lg:text-[60px] xl:text-[68px] font-black text-[#0a0f1e] leading-[1.02] tracking-[-0.03em] mb-6 text-center lg:text-left">
              Your Dream
              <br />
              University,{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: "2.5px #3366FF", color: "transparent" }}
              >
                Abroad.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-2 left-0 right-0 h-[4px] bg-[#3366FF] origin-left rounded-full"
                />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[#64748b] text-[17px] sm:text-[19px] leading-[1.7] mb-9 max-w-[480px] font-medium text-center lg:text-left mx-auto lg:mx-0">
              Match with top universities in 7+ countries. Estimate your costs,
              check admission chances, and track visa readiness - all in one place.
            </p>

            {/* CTA group */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
              <Link href="/matches" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3366FF] text-white px-8 py-4 rounded-xl font-bold text-[16px] shadow-[0_4px_20px_rgba(51,102,255,0.35)] hover:shadow-[0_8px_32px_rgba(51,102,255,0.45)] transition-shadow cursor-pointer"
                >
                  Start Matching Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/search" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-[#e2e8f0] text-[#334155] px-8 py-4 rounded-xl font-bold text-[16px] hover:border-[#3366FF] hover:text-[#3366FF] transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  Explore Universities
                </motion.button>
              </Link>
            </div>

            {/* Top destinations list */}
            <div className="w-full max-w-[400px] mx-auto lg:mx-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-4 text-center lg:text-left">
                Top Destinations
              </p>
              <div className="flex flex-col gap-3">
                <Destination flag="🇺🇸" name="United States" delay={0.5} />
                <Destination flag="🇬🇧" name="United Kingdom" delay={0.6} />
                <Destination flag="🇦🇺" name="Australia" delay={0.7} />
                <Destination flag="🇨🇦" name="Canada" delay={0.8} />
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT ─────────────────────────────────────── */}
          <div className="relative flex items-center justify-center lg:justify-end w-full lg:h-full order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[520px]"
            >
              {/* Solid accent behind image */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-[32px] bg-[#EEF3FF] border-2 border-[#dde8ff]" />

              {/* Solid corner accent square */}
              <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-[14px] bg-[#3366FF] z-0" />

              {/* Main image */}
              <div className="relative z-10 rounded-[28px] overflow-hidden border-2 border-[#e8edf5] shadow-[0_24px_64px_rgba(0,0,0,0.13)]">
                <Image
                  src="/image.png"
                  alt="Happy graduate student ready to study abroad"
                  width={520}
                  height={640}
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 520px"
                  priority
                  fetchPriority="high"
                  className="w-full h-auto object-cover object-top hover:scale-[1.03] transition-transform duration-700"
                />
              </div>


              {/* Spinning ring decorations */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full border-2 border-dashed border-[#3366FF]/30 z-0"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full border border-[#3366FF]/15 z-0"
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Bottom section break line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#e8edf5]" />
    </section>
  );
};

export default HeroSection;

