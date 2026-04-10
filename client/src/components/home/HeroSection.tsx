import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] bg-[#E5EFFF] overflow-hidden flex flex-col w-full pt-24 lg:pt-0">
      {/* ── BACKGROUND SHAPES ── */}

      {/* 1. White Organic Blob on the left */}
      <div className="absolute top-0 left-[-2%] w-[45%] h-[120%] pointer-events-none z-0 hidden md:block">
        <svg
          viewBox="0 0 500 800"
          className="w-full h-full text-white"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* Wavy blob matching the new reference: curves out, in, then out slightly */}
          <path d="M0,0 L250,0 C250,150 500,300 350,450 C250,550 450,700 400,800 L0,800 Z" />
        </svg>
      </div>

      {/* 2. Top-left Chevrons Pattern */}
      <div className="absolute top-[-5%] left-[-2%] pointer-events-none z-0 hidden md:block opacity-40">
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
      </div>

      {/* 3. Bottom dots burst */}
      <div className="absolute bottom-[5%] left-[24%] pointer-events-none z-0 hidden md:block">
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          className="opacity-70"
        >
          <g fill="#90B7FF">
            {/* Center dot */}
            <circle cx="75" cy="75" r="3" />
            {/* Inner ring */}
            <circle cx="75" cy="55" r="4" />
            <circle cx="75" cy="95" r="4" />
            <circle cx="55" cy="75" r="4" />
            <circle cx="95" cy="75" r="4" />
            <circle cx="61" cy="61" r="3" />
            <circle cx="89" cy="61" r="3" />
            <circle cx="61" cy="89" r="3" />
            <circle cx="89" cy="89" r="3" />
            {/* Outer elements */}
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
      </div>

      {/* 4. Top-right wavy line swoosh */}
      <div className="absolute top-[8%] right-[-10%] pointer-events-none z-0 hidden md:block">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          <path
            d="M 50 250 C 150 50, 350 350, 550 150"
            stroke="#ADCBFF"
            strokeWidth="3"
            className="opacity-70"
          />
          <path
            d="M 120 400 C 250 250, 400 450, 550 250"
            stroke="#ADCBFF"
            strokeWidth="2"
            className="opacity-40"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex-grow flex flex-col">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-3 lg:gap-8 flex-grow">
          {/* Left content */}
          <div className="flex flex-col justify-center  max-w-[580px] mt-10 lg:mt-0 lg:translate-y-10 xl:translate-x-4">
            <h1 className="text-[35px] sm:text-[37px] lg:text-[40px] font-bold text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
              Match, Plan and Self-Apply
              <br className="hidden lg:block" /> with Confidence
            </h1>
            <p className="text-[#334155] text-[16px] sm:text-[17px] mb-8 leading-relaxed max-w-[450px] font-regular text-center sm:text-left mx-auto sm:mx-0">
              Find the right colleges, estimate your total cost, check your
              admission chances, and track your visa readiness
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-10">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="w-[18px] h-[18px] text-[#22C55E]"
                  strokeWidth={2.5}
                />
                <span className="text-[#37C533] font-semibold text-[13px] uppercase tracking-wide">
                  160+ Countries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="w-[18px] h-[18px] text-[#EF4444]"
                  strokeWidth={2.5}
                />
                <span className="text-[#FF0000] font-semibold text-[13px] uppercase tracking-wide">
                  1000+ Universities
                </span>
              </div>
            </div>
            <div>
              <Link href="/matches">
                <Button className="bg-[#3686FF]text-white px-[24px] py-[12px] rounded-[10px] font-semibold text-[16px] gap-2 shadow-[0_8px_30px_rgb(51,102,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_8px_35px_rgb(51,102,255,0.4)]">
                  Get Started <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right content - Graduate image with circle */}
          <div className="relative flex items-end justify-center lg:justify-end lg:h-full mt-12 lg:mt-0">
            <div className="relative w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-auto flex items-end justify-center xl:translate-x-12">
              {/* Thick Blue Circle */}
              <div className="absolute top-[1%] left-[50%] -translate-x-1/2 w-[60%] lg:w-[60%] aspect-square rounded-full border-[6px] lg:border-[8px] border-[#3366FF] pointer-events-none" />
              {/* Graduate image */}
              <Image
                src="/image.png"
                alt="Happy graduate student"
                width={800}
                height={1000}
                priority
                className="relative z-10 w-full h-auto object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
