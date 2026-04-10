import {
  ArrowRight,
  ClipboardList,
  Gauge,
  PieChart,
  Navigation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "Visa checklist & Alerts",
    desc: "Track documents and receive missing item notifications.",
    icon: <ClipboardList className="w-7 h-7 text-[#3686FF]" strokeWidth={2} />,
  },
  {
    title: "Progress tracker",
    desc: "Monitor your progress through each step of the process.",
    icon: <Gauge className="w-7 h-7 text-[#3686FF]" strokeWidth={2} />,
  },
  {
    title: "Readiness percentage",
    desc: "See how prepared you are based on completed tasks.",
    icon: <PieChart className="w-7 h-7 text-[#3686FF]" strokeWidth={2} />,
  },
  {
    title: "Next-step guidance",
    desc: "Get clear instructions on what to do next.",
    icon: <Navigation className="w-7 h-7 text-[#3686FF]" strokeWidth={2} />,
  },
];

const bottomDotIds = Array.from(
  { length: 12 },
  (_, i) => `visa-bottom-dot-${i + 1}`,
);

const VisaReadinessSection = () => {
  return (
    <section className="py-24 bg-[#E4EFFF66] -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Decorative dots top right */}
      <div className="absolute top-12 right-12 opacity-40 mix-blend-multiply pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="10" r="4" fill="#A5C6FF" />
          <circle cx="95" cy="25" r="4" fill="#A5C6FF" />
          <circle cx="110" cy="60" r="4" fill="#A5C6FF" />
          <circle cx="25" cy="25" r="4" fill="#A5C6FF" />
          <circle cx="10" cy="60" r="4" fill="#A5C6FF" />

          <circle cx="60" cy="30" r="4" fill="#3686FF" opacity="0.5" />
          <circle cx="85" cy="40" r="4" fill="#3686FF" opacity="0.5" />
          <circle cx="35" cy="40" r="4" fill="#3686FF" opacity="0.5" />
        </svg>
      </div>

      {/* Scattered dots left */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-50 mix-blend-multiply pointer-events-none">
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
          <circle cx="10" cy="20" r="3" fill="#3686FF" />
          <circle cx="30" cy="30" r="3" fill="#A5C6FF" />
          <circle cx="50" cy="10" r="3" fill="#A5C6FF" />
          <circle cx="20" cy="50" r="4" fill="#3686FF" />
          <circle cx="40" cy="70" r="3" fill="#A5C6FF" />
        </svg>
      </div>

      <div className="w-full max-w-[1280px] mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50/50 text-[#3686FF] font-semibold tracking-wider text-[14px] uppercase mb-6 shadow-sm">
            RECRUITMENT PARTNERS
          </div>
          <h2 className="text-[32px] sm:text-[36px] lg:text-[40px] font-bold text-[#0f172a] leading-[1.1] mb-5 tracking-tight">
            Track Your Visa Readiness
          </h2>
          <p className="text-[#475569] text-[16px] leading-relaxed font-regular">
            Stay on top of every requirement with a live readiness score
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left - Cards & Button */}
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-[20px] p-6 shadow-xl border border-gray-100  transition-shadow duration-300 flex flex-col items-start"
                >
                  <div className="mb-4 text-[#3686FF]">{card.icon}</div>
                  <h3 className="font-semibold text-[20px] text-[#0f172a] mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[#475569] text-[14px] leading-relaxed font-regular">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <Link href="/register">
                <Button className="h-[50px] rounded-[10px] bg-[#3686FF] hover:bg-[#2563eb] text-white font-bold px-[28px] text-[15px] shadow-[0_8px_20px_rgb(54,134,255,0.25)] transition-all hover:scale-105 hover:shadow-lg">
                  Join Our Network{" "}
                  <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Image Collage */}
          <div className="relative w-full max-w-[480px] h-[400px] sm:h-[450px] mx-auto lg:mr-0 lg:ml-auto">
            {/* Top Left Circle - Orange Border */}
            <div className="absolute top-[5%] left-0 w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] rounded-full border-[4px] border-[#F97316] overflow-hidden z-10 shadow-[0_10px_30px_rgb(0,0,0,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
                alt="Students"
                fill
                className="object-cover"
              />
            </div>

            {/* Top Right Circle - Green Border */}
            <div className="absolute top-[-2%] right-[-10px] w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] rounded-full border-[4px] border-[#34D399] overflow-hidden z-0 shadow-[0_10px_30px_rgb(0,0,0,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600"
                alt="Group Study"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Center Circle - Blue Border */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] h-[250px] sm:w-[290px] sm:h-[290px] rounded-full border-[6px] border-[#3686FF] overflow-hidden z-20 shadow-[0_20px_40px_rgb(54,134,255,0.2)]">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
                alt="Learning Together"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right scattered dots */}
      <div className="absolute bottom-10 right-10 grid grid-cols-4 gap-3 opacity-40 pointer-events-none">
        {bottomDotIds.map((dotId) => (
          <div key={dotId} className="w-1.5 h-1.5 rounded-full bg-[#A5C6FF]" />
        ))}
      </div>
    </section>
  );
};

export default VisaReadinessSection;
