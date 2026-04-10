import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Product-first guidance",
    desc: "Clear insights instead of confusing information",
  },
  {
    title: "Best-fit college matching",
    desc: "Find options that match your goals and profile",
  },
  { title: "Cost clarity", desc: "Estimate expenses before making decisions" },
  {
    title: "Admission confidence",
    desc: "Understand where your are more likely to succeed",
  },
  {
    title: "Visa progress tracking",
    desc: "Stay ready with a simple checklist-driven experience",
  },
  {
    title: "Web-mobile access",
    desc: "Explore and manage your journey from anywhere",
  },
];

const SolutionsSection = () => (
  <section className="relative py-14 bg-[#F8FAFC] overflow-hidden -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12">
    {/* Left Splash Decoration */}
    <div className="absolute top-[18%] left-[2%] lg:left-[8%] pointer-events-none hidden sm:block rotate-[35deg]">
      <svg width="58" height="58" viewBox="0 0 48 48" fill="#3686FF">
        <path d="M12,24 C22,18 40,22 46,24 C40,26 22,30 12,24 Z" />
        <path d="M16,14 C26,6 42,12 44,16 C34,14 22,12 16,14 Z" />
        <path
          d="M18,34 C26,42 42,36 44,32 C34,34 22,36 18,34 Z"
          opacity="0.8"
        />
      </svg>
    </div>

    {/* Right Wave Decoration */}

    <div className="w-full max-w-[1280px] mx-auto relative z-10 text-center">
      <h2 className="text-[32px] sm:text-[36px] lg:text-[40px] font-semibold text-[#0f172a] mb-2 tracking-tight">
        Find Every Solution, From Applications
      </h2>
      <h2 className="text-[32px] sm:text-[36px] lg:text-[40px] font-semibold text-[#3686FF] mb-6 tracking-tight">
        to Accommodations
      </h2>
      <p className="text-[#475569] max-w-[800px] mx-auto font-regular mb-14 text-[15px] sm:text-[16px] leading-[1.6]">
        Access our full 360 Solutions, covering everything from application to
        arrival. Get instant language test vouchers, explore financial services,
        and invest in your future with flexible student loans. It&apos;s all here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto mb-14">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-[16px] px-6 py-10 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 border border-gray-50 flex flex-col items-center"
          >
            <div className="w-[42px] h-[42px] rounded-full bg-[#8CBAFD] flex items-center justify-center mb-5 shrink-0">
              <FileText
                className="w-[20px] h-[20px] text-white"
                strokeWidth={2.5}
              />
            </div>
            <h3 className="font-semibold text-[#0f172a] text-[16px] mb-3 tracking-tight">
              {f.title}
            </h3>
            <p className="text-[#475569] font-regular text-[16px] leading-relaxed max-w-[240px] mx-auto">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/register">
          <Button className="bg-[#3686FF] text-white px-[24px] py-[12px] rounded-[10px] font-semibold text-[15px] shadow-[0_8px_25px_rgb(51,102,255,0.25)] transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgb(51,102,255,0.35)]">
            Register as a Student <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default SolutionsSection;
