import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const points = [
  "Acceptance likelihood by profile",
  "Safer, target, and ambitious options",
  "Eligibility and fit signals",
  "Profile-based recommendations",
];

const AdmissionSection = () => (
  <section
    className="py-20 relative overflow-hidden"
    style={{ background: "hsl(var(--light-blue-bg))" }}
  >
    {/* Decorative circles */}
    <div className="absolute top-10 left-10 w-48 h-48 rounded-full border-2 border-border opacity-30" />
    <div className="absolute top-20 left-20 w-32 h-32 rounded-full border-2 border-border opacity-20" />

    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Image */}
        <div className="relative flex justify-center">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "hsl(var(--hero-blob))" }}
            />
            <Image
              src="/assets/graduate-woman.png"
              alt="Graduate student"
              width={256}
              height={320}
              className="relative z-10 w-72 md:w-80 h-auto object-contain"
            />
          </div>
        </div>

        {/* Right - Content */}
        <div>
          {/* Decorative icon */}
          <div className="text-primary text-3xl mb-4">✦</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Understand Your Admission Probability
          </h2>
          <p className="text-muted-foreground mb-8">
            Know where you are competitive before spending time and money on
            applications.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {points.map((p) => (
              <div key={p} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium text-sm">{p}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="rounded-full px-8 gap-2">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    {/* Dot pattern */}
    <div className="absolute bottom-10 right-10 grid grid-cols-4 gap-2 opacity-20">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary" />
      ))}
    </div>
  </section>
);

export default AdmissionSection;
