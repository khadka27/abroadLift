"use client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] bg-[#E5EFFF] overflow-hidden flex flex-col w-full pt-24 lg:pt-0 pb-4">
      {/* ── BACKGROUND SHAPES ── */}

      {/* 1. White Organic Blob on the left */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-[-2%] w-[45%] h-[120%] pointer-events-none z-0 hidden md:block"
      >
        <svg
          viewBox="0 0 500 800"
          className="w-full h-full text-white/40 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] backdrop-blur-3xl"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 L250,0 C250,150 500,300 350,450 C250,550 450,700 400,800 L0,800 Z" />
        </svg>
      </motion.div>

      {/* 2. Top-left Chevrons Pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="absolute top-[-5%] left-[-2%] pointer-events-none z-0 hidden md:block opacity-40"
      >
        <svg
          width="250"
          height="250"
          viewBox="0 0 250 250"
          fill="none"
          stroke="#B0CBFF"
          strokeWidth="1.5"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-50 + i * 20} -50 L ${60 + i * 20} 60 L ${-50 + i * 20} 170`}
            />
          ))}
        </svg>
      </motion.div>

      {/* 3. Bottom dots burst */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-[24%] pointer-events-none z-0 hidden md:block"
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          className="opacity-70"
        >
          <g fill="#90B7FF">
            {/* Center dot */}
            <circle cx="75" cy="75" r="3" />
            <circle cx="75" cy="55" r="4" />
            <circle cx="75" cy="95" r="4" />
            <circle cx="55" cy="75" r="4" />
            <circle cx="95" cy="75" r="4" />
            <circle cx="61" cy="61" r="3" />
            <circle cx="89" cy="61" r="3" />
            <circle cx="61" cy="89" r="3" />
            <circle cx="89" cy="89" r="3" />
            <circle cx="75" cy="30" r="5" />
            <circle cx="75" cy="120" r="5" />
            <circle cx="30" cy="75" r="5" />
            <circle cx="120" cy="75" r="5" />
            <circle cx="45" cy="45" r="4" />
            <circle cx="105" cy="45" r="4" />
            <circle cx="45" cy="105" r="4" />
            <circle cx="105" cy="105" r="4" />
          </g>
        </svg>
      </motion.div>

      {/* 4. Top-right wavy line swoosh */}
      <motion.div 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute top-[8%] right-[-10%] pointer-events-none z-0 hidden md:block"
      >
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 50 250 C 150 50, 350 350, 550 150"
            stroke="#ADCBFF"
            strokeWidth="3"
            className="opacity-70"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
            d="M 120 400 C 250 250, 400 450, 550 250"
            stroke="#ADCBFF"
            strokeWidth="2"
            className="opacity-40"
          />
        </svg>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex-grow flex flex-col">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-3 lg:gap-8 flex-grow">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center max-w-[580px] mt-10 lg:mt-0 lg:translate-y-10 xl:translate-x-4 glass p-8 sm:p-10 rounded-[32px] border-white/40 shadow-xl lg:bg-transparent lg:shadow-none lg:border-none lg:p-0"
          >
            <h1 className="text-[35px] sm:text-[42px] lg:text-[48px] font-extrabold text-[#0f172a] leading-[1.1] mb-6 tracking-tight text-center sm:text-left drop-shadow-sm">
              Match, Plan and Self-Apply
              <br className="hidden lg:block" /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3366FF] to-[#6b91ff]">Confidence</span>
            </h1>
            <p className="text-[#334155] text-[16px] sm:text-[18px] mb-8 leading-relaxed max-w-[450px] font-medium text-center sm:text-left mx-auto sm:mx-0">
              Find the right colleges, estimate your total cost, check your
              admission chances, and track your visa readiness.
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-row items-center justify-center sm:justify-start gap-4 sm:gap-8 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm">
                <CheckCircle2
                  className="w-[18px] h-[18px] text-[#22C55E]"
                  strokeWidth={2.5}
                />
                <span className="text-[#15803d] font-bold text-[13px] uppercase tracking-wide whitespace-nowrap">
                  160+ Countries
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm">
                <CheckCircle2
                  className="w-[18px] h-[18px] text-[#EF4444]"
                  strokeWidth={2.5}
                />
                <span className="text-[#b91c1c] font-bold text-[13px] uppercase tracking-wide whitespace-nowrap">
                  1000+ Universities
                </span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center sm:justify-start"
            >
              <Link href="/matches">
                <Button className="bg-gradient-to-r from-[#3366FF] to-[#254bdb] text-white px-[28px] py-[26px] rounded-2xl font-bold text-[18px] gap-2 shadow-[0_10px_40px_rgb(51,102,255,0.4)] transition-all border border-blue-400/30">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right content - Graduate image with circle */}
          <div className="relative flex items-end justify-center lg:justify-end lg:h-full mt-12 lg:mt-0 perspective-1000">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-auto flex items-end justify-center xl:translate-x-12"
            >
              {/* Thick Blue Circle */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-[1%] left-[50%] -translate-x-1/2 w-[60%] lg:w-[60%] aspect-square rounded-full border-[6px] lg:border-[8px] border-dashed border-[#3366FF]/40 pointer-events-none" 
              />
              <div className="absolute top-[3%] left-[50%] -translate-x-1/2 w-[56%] lg:w-[56%] aspect-square rounded-full border-[3px] lg:border-[4px] border-[#3366FF]/60 pointer-events-none backdrop-blur-[2px]" />
              
              {/* Graduate image */}
              <Image
                src="/image.png"
                alt="Happy graduate student"
                width={800}
                height={1000}
                priority
                className="relative z-10 w-full h-auto object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-transform duration-500"
              />

              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-[20%] z-20 glass bg-white/70 px-4 py-3 rounded-2xl shadow-xl border border-white hidden sm:flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#3366FF] flex items-center justify-center font-black text-xl">🎓</div>
                <div>
                  <div className="text-[14px] font-black text-gray-900 leading-none">Smart Match</div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">AI Powered</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

