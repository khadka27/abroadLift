import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const GraduationCapWatermark = () => (
  <svg
    width="300"
    height="300"
    viewBox="0 0 24 24"
    fill="none"
    className="absolute -top-10 -left-16 opacity-10 rotate-[-15deg] pointer-events-none"
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
  </svg>
);

const CTABanner = () => (
  <section className="bg-gradient-to-r from-[#3686FF] to-[#2563EB] relative overflow-hidden -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12">
    {/* Background Watermark */}
    <GraduationCapWatermark />

    <div className="w-full px-14 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end">
        {/* Left Content */}
        <div className="py-20 lg:py-28 text-left z-10 text-white">
          <h2 className="text-[30px] md:text-[32px] font-bold mb-5 leading-tight tracking-tight">
            One Platform, Smarter Decisions
          </h2>
          <p className="text-white/90 text-[16px] font-regular leading-relaxed mb-10 max-w-[500px]">
            AbroadLift brings together the key parts of the study abroad journey
            in one simple experience - college matching, cost estimation,
            application success chances, and visa readiness.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/matches"
              className="h-[52px] flex items-center rounded-[12px] bg-white text-[#3686FF] hover:bg-white/90 font-bold px-[32px] text-[15px] gap-2"
            >
              Start Free Today{" "}
              <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
            </Link>
            <Link
              href="/matches"
              className="text-white text-[14px] font-medium underline underline-offset-4 hover:text-white/80 transition-colors"
            >
              Find Your Best-Fit College
            </Link>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative flex justify-center lg:justify-end lg:h-[450px]">
          {/* Concentric Circle Accents behind student */}
          <div className="absolute bottom-0 w-[400px] h-[400px] flex items-center justify-center translate-y-20 lg:translate-y-0">
            <div className="absolute w-[450px] h-[450px] rounded-full bg-white/[0.08]" />
            <div className="absolute w-[350px] h-[350px] rounded-full bg-white/[0.12]" />
            <div className="absolute w-[250px] h-[250px] rounded-full bg-white/[0.15]" />
          </div>

          <div className="relative z-10 w-full max-w-[400px] h-[350px] lg:h-[480px]">
            <Image
              src="/assets/graduate-male.png"
              alt="Male Graduate"
              fill
              className="object-contain object-bottom block"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTABanner;
