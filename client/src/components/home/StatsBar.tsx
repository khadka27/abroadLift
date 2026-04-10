import { Globe2, Building2, GraduationCap, Headphones } from "lucide-react";

const stats = [
  { icon: Globe2, label: "160+ Countries" },
  { icon: Building2, label: "1000+ Universities" },
  { icon: GraduationCap, label: "5000+ Students Helped" },
  { icon: Headphones, label: "24/7 Student Support" },
];

const StatsBar = () => (
  <section className="bg-white">
    <div className="container max-w-[1280px] mx-auto px-6 lg:px-12 py-8 flex flex-col items-center">
      <div className="w-full flex w-full flex-wrap justify-between items-center gap-y-8 gap-x-4 border-b border-gray-100 pb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4">
            <div className="w-[42px] h-[42px] rounded-full bg-[#3686FF] flex items-center justify-center shrink-0">
              <stat.icon className="w-[20px] h-[20px] text-white" strokeWidth={2} />
            </div>
            <span className="font-medium text-[#0f172a] text-[18px] sm:text-[20px] tracking-tight">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;

