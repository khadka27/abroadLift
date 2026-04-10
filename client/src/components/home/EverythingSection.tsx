import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const EverythingSection = () => (
  <section className="relative py-18 bg-white overflow-hidden">
    <div className="container max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10 hidden md:block lg:flex lg:items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-34 items-center">
        {/* Left - Images Grid */}
        <div className="relative w-full max-w-[550px] mx-auto lg:mr-auto lg:ml-0 mt-8 lg:mt-0">
          {/* Main rectangular image */}
          <div className="relative w-[380px] sm:w-[450px] h-[280px] sm:h-[320px]">
            <Image
              src="/assets/students-studying.jpg"
              alt="Students studying together"
              fill
              className="rounded-[16px] object-cover shadow-md"
            />
          </div>

          {/* Overlapping smaller image */}
          <div className="absolute -bottom-[20%] right-[-5%] sm:-right-[5%] lg:-right-[10%] w-[250px] sm:w-[320px] h-[180px] sm:h-[220px] rounded-[16px] border-[8px] border-white shadow-xl z-10 overflow-hidden">
            <Image
              src="/assets/students-laptop.jpg"
              alt="Students with laptop"
              fill
              className="object-cover"
            />
          </div>

          {/* 95% Acceptance Rate Badge */}
          <div className="absolute top-[20%] right-[0%] lg:right-[-5%] w-[130px] h-[130px] rounded-full bg-white border-[5px] border-[#2761B8] p-[5px] flex items-center justify-center shadow-2xl z-20">
            <div className="w-full h-full rounded-full bg-[#2761B8] flex flex-col items-center justify-center text-white">
              <span className="text-[34px] font-[900] leading-[1.1]">95%</span>
              <span className="text-[12px] font-semibold text-center leading-[1.2] mt-0.5 tracking-wide">
                Acceptance<br />Rate
              </span>
            </div>
          </div>
        </div>

        {/* Right - Content */}
        <div className="max-w-[540px] relative z-10 mx-auto lg:mx-0 mt-16 md:mt-24 lg:mt-0">
          <h2 className="text-[30px] sm:text-[33px] lg:text-[36px] font-bold text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
            Everything You Need to Plan and Self-Apply
          </h2>
          <p className="text-[#334155] text-[15px] sm:text-[16px] mb-8 leading-relaxed font-regular">
            AbroadLift is built for students who want clarity before they apply.
            Get a step-by-step system that works like a digital study abroad
            counsellor.
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Match with best-fit colleges and universities",
              "Estimate your total study abroad cost",
              "Track your application success chances and visa readiness in real time",
            ].map((item) => (
              <li key={item} className="flex items-start gap-4">
                <CheckCircle2
                  className="w-[20px] h-[20px] text-[#3686FF] mt-[2px] shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-[#0f172a] font-medium text-[15px] sm:text-[16px] leading-[1.4]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <Button className="bg-[#3686FF]  text-white px-[24px] py-[12px] rounded-[10px] font-semibold text-[15px] shadow-[0_8px_30px_rgb(51,102,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_8px_35px_rgb(51,102,255,0.4)]">
            Create an Student Account <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>

    {/* Faint Book Wireframe background graphic absolute bottom-right */}
    <div className="absolute bottom-[-5%] right-[-5%] pointer-events-none z-0 hidden lg:block opacity-60">
      <svg
        width="380"
        height="280"
        viewBox="0 0 380 280"
        fill="none"
      >
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
    </div>
  </section>
);

export default EverythingSection;
