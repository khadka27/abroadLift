import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CTABanner = () => (
  <section className="py-0">
    <div className="container mx-auto px-6">
      <div className="relative bg-primary rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center">
        {/* Left content */}
        <div className="p-10 lg:p-16 flex-1 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            One Platform, Smarter Decisions
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg">
            AbroadLift brings together the key parts of the study abroad journey
            in one simple experience - college matching, cost estimation,
            application success chances, and visa readiness.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" className="rounded-full px-6 gap-2">
              Start Free Today <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full px-6 gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Find Your Best-Fit College <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right - Graduate image */}
        <div className="relative shrink-0 h-64 lg:h-80 w-64">
          {/* Circle bg */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-52 h-52 rounded-full bg-primary-foreground/10" />
            <div className="absolute w-40 h-40 rounded-full bg-primary-foreground/10" />
          </div>
          <Image
            src="/assets/graduate-male.png"
            alt="Graduate"
            width={256}
            height={320}
            className="relative z-10 h-full w-auto object-contain"
          />
        </div>
      </div>
    </div>
  </section>
);

export default CTABanner;
