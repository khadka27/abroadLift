import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const EverythingSection = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left - Images */}
        <div className="relative">
          <Image
            src="/assets/students-studying.jpg"
            alt="Students studying together"
            width={384}
            height={256}
            className="rounded-2xl w-full max-w-md shadow-lg"
          />
          {/* 95% badge */}
          <div className="absolute -top-4 right-1/4 lg:right-10 w-28 h-28 rounded-full border-4 border-primary bg-card flex flex-col items-center justify-center shadow-lg z-10">
            <span className="text-2xl font-bold text-primary">95%</span>
            <span className="text-xs text-muted-foreground text-center leading-tight">
              Acceptance Rate
            </span>
          </div>
          <Image
            src="/assets/students-laptop.jpg"
            alt="Students with laptop"
            width={384}
            height={256}
            className="rounded-2xl w-64 absolute -bottom-8 right-0 shadow-lg border-4 border-card"
          />
        </div>

        {/* Right - Content */}
        <div className="max-w-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Plan and Self-Apply
          </h2>
          <p className="text-muted-foreground mb-6">
            AbroadLift is built for students who want clarity before they apply.
            Get a step-by-step system that works like a digital study abroad
            counsellor.
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Match with best-fit colleges and universities",
              "Estimate your total study abroad cost",
              "Track your application success chances and visa readiness in real time",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="rounded-full px-8 gap-2">
            Create an Student Account <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default EverythingSection;
