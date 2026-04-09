import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Product-first guidance", desc: "Clear insights instead of confusing information" },
  { title: "Best-fit college matching", desc: "Find options that match your goals and profile" },
  { title: "Cost clarity", desc: "Estimate expenses before making decisions" },
  { title: "Admission confidence", desc: "Understand where your are more likely to succeed" },
  { title: "Visa progress tracking", desc: "Stay ready with a simple checklist-driven experience" },
  { title: "Web-mobile access", desc: "Explore and manage your journey from anywhere" },
];

const SolutionsSection = () => (
  <section className="py-20 relative overflow-hidden" style={{ background: "hsl(var(--light-blue-bg))" }}>
    {/* Decorative blob */}
    <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-30" style={{ background: "hsl(var(--hero-blob))" }} />

    <div className="container mx-auto px-6 relative z-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        Find Every Solution, From Applications
      </h2>
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
        to Accommodations
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
        Access our full 360 Solutions, covering everything from application to arrival. Get instant language test vouchers, explore financial services, and invest in your future with flexible student loans. It&apos;s all here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        {features.map((f) => (
          <div key={f.title} className="bg-card rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      <Button size="lg" className="rounded-full px-8 gap-2">
        Register as a Student <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  </section>
);

export default SolutionsSection;
