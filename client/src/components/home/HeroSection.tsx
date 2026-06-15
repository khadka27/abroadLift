"use client";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] lg:min-h-[90vh] bg-gradient-to-b from-[#E5EFFF] to-white overflow-hidden flex flex-col w-full pt-28 lg:pt-20 pb-12">
      {/* ── BACKGROUND SHAPES ── */}

      {/* 1. White Organic Blob on the left */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-[-10%] w-[60%] h-[120%] pointer-events-none z-0 hidden lg:block"
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
        className="absolute top-[-5%] left-[-2%] pointer-events-none z-0 hidden lg:block opacity-40"
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
        className="absolute bottom-[10%] left-[24%] pointer-events-none z-0 hidden lg:block"
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
        className="absolute top-[8%] right-[-10%] pointer-events-none z-0 hidden lg:block"
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

      {/* Main content - Full width container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex-grow flex flex-col">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 flex-grow items-center">
          
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center w-full mt-6 lg:mt-0 xl:translate-x-8"
          >
            {/* Tagline */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-4 py-2 rounded-full font-bold text-sm mx-auto lg:mx-0 mb-6 sm:mb-8"
            >
              <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>#1 AI Platform for Study Abroad</span>
            </motion.div>

            <h1 className="text-[40px] sm:text-[50px] lg:text-[56px] xl:text-[64px] font-extrabold text-[#0f172a] leading-[1.05] mb-6 tracking-tight text-center lg:text-left drop-shadow-sm">
              Match, Plan and <br className="hidden sm:block" />
              Self-Apply with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3366FF] to-[#00d4ff]">Confidence</span>
            </h1>
            
            <p className="text-[#475569] text-[16px] sm:text-[18px] lg:text-[20px] mb-8 lg:mb-10 leading-relaxed max-w-[500px] font-medium text-center lg:text-left mx-auto lg:mx-0">
              Find the right colleges, estimate your total cost, check your
              admission chances, and track your visa readiness.
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm w-full sm:w-auto justify-center">
                <CheckCircle2
                  className="w-[20px] h-[20px] text-[#22C55E]"
                  strokeWidth={2.5}
                />
                <span className="text-[#15803d] font-bold text-[14px] uppercase tracking-wide whitespace-nowrap">
                  160+ Countries
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm w-full sm:w-auto justify-center">
                <CheckCircle2
                  className="w-[20px] h-[20px] text-[#EF4444]"
                  strokeWidth={2.5}
                />
                <span className="text-[#b91c1c] font-bold text-[14px] uppercase tracking-wide whitespace-nowrap">
                  1000+ Universities
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-center lg:justify-start w-full sm:w-auto"
            >
              <Link href="/matches" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#3366FF] hover:bg-[#254bdb] text-white px-8 py-7 rounded-full font-bold text-[18px] gap-2 shadow-[0_10px_30px_rgb(51,102,255,0.3)] transition-all">
                  Get Started Free <ArrowRight className="w-6 h-6 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right content - Graduate image with circle */}
          <div className="relative flex items-center justify-center lg:justify-end w-full lg:h-full perspective-1000">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-[600px] aspect-square flex items-end justify-center"
            >
              {/* Thick Blue Circle */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-[5%] left-[50%] -translate-x-1/2 w-[70%] sm:w-[65%] lg:w-[60%] aspect-square rounded-full border-[6px] lg:border-[8px] border-dashed border-[#3366FF]/40 pointer-events-none" 
              />
              <div className="absolute top-[7%] left-[50%] -translate-x-1/2 w-[66%] sm:w-[61%] lg:w-[56%] aspect-square rounded-full border-[3px] lg:border-[4px] border-[#3366FF]/60 pointer-events-none backdrop-blur-[2px]" />
              
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
                className="absolute right-[-5%] sm:right-0 top-[20%] z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#3366FF] flex items-center justify-center font-black text-xl">🎓</div>
                <div>
                  <div className="text-[14px] font-black text-gray-900 leading-none mb-1">Smart Match</div>
                  <div className="text-[11px] font-bold text-[#3366FF] uppercase">AI Powered</div>
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

