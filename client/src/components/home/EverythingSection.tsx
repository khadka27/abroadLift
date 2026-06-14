"use client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const EverythingSection = () => (
  <section className="relative py-16 lg:py-24 bg-[#FAFCFF] overflow-hidden">
    <div className="container max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
      {/* Mobile Title - Shows first on small screens */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="lg:hidden text-[32px] sm:text-[36px] font-extrabold text-[#0f172a] leading-[1.1] mb-12 tracking-tight text-center"
      >
        Everything You Need to Plan and Self-Apply
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
        {/* Left - Images Grid */}
        <div className="relative w-full max-w-[550px] mx-auto lg:mr-auto lg:ml-0 mt-2 lg:mt-0 perspective-1000">
          {/* Main rectangular image */}
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-[380px] sm:w-[450px] h-[280px] sm:h-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[24px]"
          >
            <Image
              src="/assets/students-studying.jpg"
              alt="Students studying together"
              fill
              className="rounded-[24px] object-cover"
            />
          </motion.div>

          {/* Overlapping smaller image */}
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute -bottom-[20%] right-[-5%] sm:-right-[5%] lg:-right-[10%] w-[250px] sm:w-[320px] h-[180px] sm:h-[220px] rounded-[24px] border-[8px] border-white shadow-2xl z-10 overflow-hidden"
          >
            <Image
              src="/assets/students-laptop.jpg"
              alt="Students with laptop"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* 95% Acceptance Rate Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
            className="absolute top-[20%] right-[0%] lg:right-[-5%] w-[140px] h-[140px] rounded-full bg-white/30 backdrop-blur-md border border-white p-[8px] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-20"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-full bg-gradient-to-br from-[#3366FF] to-[#1e40af] flex flex-col items-center justify-center text-white shadow-inner"
            >
              <span className="text-[36px] font-black leading-[1.1]">95%</span>
              <span className="text-[12px] font-bold text-center leading-[1.2] mt-0.5 tracking-wider uppercase text-blue-100">
                Acceptance
                <br />
                Rate
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right - Content */}
        <div className="max-w-[540px] relative z-10 mx-auto lg:mx-0 mt-8 md:mt-24 lg:mt-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden lg:block text-[32px] lg:text-[44px] font-extrabold text-[#0f172a] leading-[1.1] mb-6 tracking-tight"
          >
            Everything You Need to Plan and Self-Apply
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-[#475569] text-[16px] sm:text-[18px] mb-8 leading-relaxed font-medium text-center lg:text-left"
          >
            AbroadLift is built for students who want clarity before they apply.
            Get a step-by-step system that works like a digital study abroad
            counsellor.
          </motion.p>
          <ul className="space-y-5 mb-10">
            {[
              "Match with best-fit colleges and universities",
              "Estimate your total study abroad cost",
              "Track your application success chances and visa readiness in real time",
            ].map((item, index) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-[-2px]">
                  <CheckCircle2
                    className="w-[18px] h-[18px] text-[#3366FF]"
                    strokeWidth={3}
                  />
                </div>
                <span className="text-[#1e293b] font-bold text-[15px] sm:text-[16px] leading-[1.4]">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.5 }}
            className="flex justify-center lg:justify-start"
          >
            <Button className="bg-[#3366FF] text-white px-[32px] py-[24px] rounded-[16px] font-bold text-[16px] shadow-[0_10px_30px_rgba(51,102,255,0.3)] transition-all hover:scale-105 hover:bg-[#254bdb]">
              Create a Student Account <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Faint wireframe background graphic */}
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.6 }}
      transition={{ duration: 1.5 }}
      className="absolute bottom-[-5%] right-[-5%] pointer-events-none z-0 hidden lg:block opacity-60"
    >
      <svg width="380" height="280" viewBox="0 0 380 280" fill="none">
        <path
          d="M 60 220 C 120 230, 160 220, 190 200 C 220 220, 260 230, 320 220 L 320 100 C 260 110, 220 100, 190 80 C 160 100, 120 110, 60 100 Z"
          stroke="#E5EFFF"
          strokeWidth="3"
        />
        <path d="M 190 80 L 190 200" stroke="#E5EFFF" strokeWidth="3" />
        <path
          d="M 60 200 C 60 150, 140 60, 360 120"
          stroke="#D0E3FF"
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  </section>
);

export default EverythingSection;
