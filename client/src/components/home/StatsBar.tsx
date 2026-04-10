import { Globe2, Building2, GraduationCap, Headphones } from "lucide-react";

const stats = [
  { icon: Globe2, label: "160+ Countries" },
  { icon: Building2, label: "1000+ Universities" },
  { icon: GraduationCap, label: "5000+ Students" },
  { icon: Headphones, label: "24/7 Support" },
];

const StatsBar = () => (
  <section className="bg-white">
    <div className="container max-w-[1280px] mx-auto px-6 lg:px-12 py-8 flex flex-col items-center">
      <div className="w-full grid grid-cols-2 md:flex md:flex-wrap md:justify-between items-center gap-y-10 gap-x-4 border-b border-gray-100 pb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#3686FF] flex items-center justify-center shrink-0">
              <stat.icon className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-white" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-[#0f172a] text-[13px] sm:text-[20px] tracking-tight whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;

