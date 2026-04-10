import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const points = [
  "Acceptance likelihood by profile",
  "Safer, target, and ambitious options",
  "Eligibility and fit signals",
  "Profile-based recommendations",
];

const DecorativeSplash = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="absolute -top-16 left-0 mix-blend-multiply opacity-80 z-20"
  >
    <path
      d="M22 6C22 13 14 18 6 22C14 26 22 31 22 38C22 31 30 26 38 22C30 18 22 13 22 6Z"
      fill="#3686FF"
    />
  </svg>
);

const AdmissionSection = () => (
  <section className="py-10 relative overflow-hidden">
    {/* Decorative Top-Left Circles */}
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <circle cx="100" cy="100" r="140" stroke="#E2E8F0" strokeWidth="4" />
      <circle cx="100" cy="100" r="180" stroke="#E2E8F0" strokeWidth="4" />
    </svg>

    <div className="container max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10 w-full h-full">
      {/* Mobile Title - Shows first on small screens */}
      <h2 className="lg:hidden text-[32px] sm:text-[34px] font-bold text-[#0f172a] leading-[1.1] mb-8 tracking-tight text-center">
        Understand Your Admission Probability
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left - Image Grid Wrapper aligned to sit flush on bottom edge via negative margin */}
        <div className="relative w-full max-w-[550px] mx-auto lg:mr-auto lg:ml-0 flex justify-center lg:justify-start -mb-24 mt-8 lg:mt-0">
          <div className="relative w-full max-w-[380px] h-[480px]">
            {/* Custom SVG Blob perfectly mirroring the referenced design */}
            <div className="absolute inset-x-0 bottom-0 top-[20px] -z-10 translate-x-[5%] pointer-events-none">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 480"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="blobGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#3686FF" />
                    <stop offset="65%" stopColor="#7DAEFF" />
                    <stop offset="100%" stopColor="#F8FAFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 0 
                     H 260 
                     A 50 50 0 0 1 310 50 
                     V 160 
                     C 310 220, 400 180, 400 250 
                     V 430 
                     A 50 50 0 0 1 350 480 
                     H 0 
                     V 0 Z"
                  fill="url(#blobGrad)"
                />
              </svg>
            </div>

            <Image
              src="/assets/graduate-woman.png"
              alt="Understand Admission Probability"
              fill
              className="object-contain object-bottom block"
              priority
            />
          </div>
        </div>

        {/* Right - Content */}
        <div className="max-w-[540px] relative z-10 mx-auto lg:mx-0 mt-8 md:mt-16 lg:mt-10 text-left">
          {/* Desktop Title - Hidden on mobile */}
          <h2 className="hidden lg:block text-[32px] lg:text-[40px] font-bold text-[#0f172a] leading-[1.1] mb-3 tracking-tight">
            Understand Your Admission Probability
          </h2>
          <p className="text-[#334155] text-[15px] sm:text-[16px] mb-6 leading-relaxed font-regular text-center lg:text-left">
            Know where you are competitive before spending time and money on
            applications.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mb-8 max-w-[650px]">
            {points.map((p) => (
              <div key={p} className="flex items-start gap-4">
                <CheckCircle2
                  className="w-[20px] h-[20px] text-[#3686FF] mt-[2px] shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-[#0f172a] font-semibold text-[16px]">
                  {p}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center lg:justify-start">
            <Button className="bg-[#3686FF] text-white px-[24px] py-[12px] h-auto rounded-[10px] font-semibold text-[15px] shadow-[0_8px_30px_rgb(51,102,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_8px_35px_rgb(51,102,255,0.4)]">
              Get Started Now <ArrowRight className="w-5 h-5 ml-1.5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Right Dot Pattern */}
    <div className="absolute bottom-12 right-12 grid grid-rows-3 grid-cols-5 gap-2.5 opacity-60 pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="w-[5px] h-[5px] rounded-full bg-[#A5C6FF]" />
      ))}
    </div>
  </section>
);

export default AdmissionSection;
