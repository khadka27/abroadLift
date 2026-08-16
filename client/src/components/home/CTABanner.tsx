"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const GraduationCapWatermark = () => (
  <motion.svg
    animate={{ rotate: [-15, -5, -15], opacity: [0.1, 0.15, 0.1] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    width="300"
    height="300"
    viewBox="0 0 24 24"
    fill="none"
    className="absolute -top-10 -left-16 pointer-events-none"
  >
    <path
      d="M22 10v6M2 10l10-5 10 5-10 5z"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 12v5c3 3 9 3 12 0v-5"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 10l-2 1v6c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2v-3"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const CTABanner = () => (
  <section className="relative overflow-hidden px-6 lg:px-12 py-12">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-[1280px] mx-auto bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-[40px] relative overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.35)]"
    >
      {/* Animated gradient overlay */}
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-40 bg-[length:200%_200%] bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
      />

      {/* Background Watermark */}
      <GraduationCapWatermark />

      <div className="w-full px-8 sm:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end">
          {/* Left Content */}
          <div className="py-16 lg:py-24 text-left z-10 text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[36px] md:text-[48px] font-extrabold mb-6 leading-[1.1] tracking-tight text-white drop-shadow-sm"
            >
              One Platform, Smarter Decisions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-blue-50 text-[18px] font-medium leading-relaxed mb-10 max-w-[500px]"
            >
              AbroadLift brings together the key parts of the study abroad journey
              in one simple experience - college matching, cost estimation,
              application success chances, and visa readiness.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <Link 
                href="/matches" 
                className="inline-flex items-center justify-center h-[56px] bg-white hover:bg-slate-50 font-bold px-[32px] rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl hover:shadow-2xl border border-white/20 group cursor-pointer"
                style={{ color: "#1e40af" }}
              >
                <span className="flex items-center gap-2 font-extrabold text-[16px]" style={{ color: "#1e40af" }}>
                  Start Free Today
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} style={{ color: "#1e40af" }} />
                </span>
              </Link>
              <Link
                href="/matches"
                className="inline-flex items-center justify-center h-[56px] px-[28px] rounded-2xl border-2 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] font-bold text-[15px] text-white group cursor-pointer"
              >
                <span className="flex items-center gap-2 font-semibold text-white">
                  Find Your Best-Fit College
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white/80 group-hover:text-white" strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end lg:h-[450px]"
          >
            {/* Concentric Circle Accents behind student */}
            <div className="absolute bottom-0 w-[400px] h-[400px] flex items-center justify-center translate-y-20 lg:translate-y-0">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[450px] h-[450px] rounded-full border border-white/[0.1] bg-white/[0.03]" 
              />
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute w-[350px] h-[350px] rounded-full border border-white/[0.15] bg-white/[0.05]" 
              />
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute w-[250px] h-[250px] rounded-full border border-white/[0.2] bg-white/[0.1] backdrop-blur-sm" 
              />
            </div>

            <div className="relative z-10 w-full max-w-[400px] h-[350px] lg:h-[480px]">
              <Image
                src="/assets/graduate-male.png"
                alt="Male Graduate"
                fill
                className="object-contain object-bottom block drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTABanner;
