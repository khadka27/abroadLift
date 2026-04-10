import { ArrowRight, BookOpen, Sparkles, Briefcase, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BookOpen, title: "150,000+ Programs", desc: "Access programs at 1,500+ academic institutions globally" },
  { icon: Sparkles, title: "AI-Powered Tools", desc: "Benefit from 95% application success rate technology" },
  { icon: Briefcase, title: "Complete Support", desc: "From language tests to student loans and accommodations" },
  { icon: Handshake, title: "Dedicated Team", desc: "Expert support and resources to grow your agency" },
];

const CostSection = () => (
  <section className="py-20 relative overflow-hidden" >
    {/* Dot pattern top right */}
    <div className="absolute top-10 right-10 grid grid-cols-4 gap-2 opacity-20">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary" />
      ))}
    </div>

    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">RECRUITMENT PARTNERS</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-3">
          Estimate Your Total Study Abroad Cost
        </h2>
        <p className="text-muted-foreground">See a realistic cost breakdown before you apply.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Feature cards */}
        <div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {features.map((f) => (
              <div key={f.title} className="space-y-2">
                <f.icon className="w-8 h-8 text-foreground" />
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <Button size="lg" className="rounded-full px-8 gap-2">
            Join Our Network <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right - Decorative circles */}
        <div className="relative h-80 hidden lg:block">
          <div className="absolute top-0 left-1/2 -translate-x-1/4 w-48 h-48 rounded-full border-[6px]" style={{ borderColor: "hsl(160, 60%, 70%)" }} />
          <div className="absolute top-8 left-1/4 w-52 h-52 rounded-full border-[6px]" style={{ borderColor: "hsl(30, 90%, 55%)" }} />
          <div className="absolute bottom-0 left-1/3 w-44 h-44 rounded-full border-[6px] border-primary" />
        </div>
      </div>
    </div>
  </section>
);

export default CostSection;
