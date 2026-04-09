import { Globe, GraduationCap, Users, Headphones } from "lucide-react";

const stats = [
  { icon: Globe, label: "160+ Countries", color: "text-primary" },
  { icon: GraduationCap, label: "1000+ Universities", color: "text-primary" },
  { icon: Users, label: "5000+ Students Helped", color: "text-primary" },
  { icon: Headphones, label: "24/7 Student Support", color: "text-primary" },
];

const StatsBar = () => (
  <section className="border-b border-border bg-card py-6">
    <div className="container mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground text-sm md:text-base">{stat.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default StatsBar;
