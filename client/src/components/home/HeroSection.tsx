import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <line
            x1="20"
            y1="10"
            x2="80"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="20"
            x2="60"
            y2="20"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="30"
            y1="30"
            x2="70"
            y2="30"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
          <path
            d="M 20 80 Q 100 10 180 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M 30 100 Q 100 30 170 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Blob shape bottom-left */}
      <div className="absolute bottom-10 left-1/4 w-32 h-32">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-primary opacity-20"
        >
          <circle cx="30" cy="60" r="4" fill="currentColor" />
          <circle cx="40" cy="50" r="4" fill="currentColor" />
          <circle cx="50" cy="60" r="4" fill="currentColor" />
          <circle cx="35" cy="70" r="4" fill="currentColor" />
          <circle cx="45" cy="70" r="4" fill="currentColor" />
          <circle cx="25" cy="50" r="4" fill="currentColor" />
          <circle cx="55" cy="50" r="3" fill="currentColor" />
          <circle cx="60" cy="60" r="3" fill="currentColor" />
          <circle cx="20" cy="60" r="3" fill="currentColor" />
          <circle cx="40" cy="40" r="3" fill="currentColor" />
          <circle cx="30" cy="80" r="3" fill="currentColor" />
          <circle cx="50" cy="75" r="2" fill="currentColor" />
          <circle cx="60" cy="45" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Blob background right side */}
      <div className="absolute right-0 top-0 w-[55%] h-full">
        <svg
          viewBox="0 0 600 700"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse
            cx="400"
            cy="350"
            rx="350"
            ry="400"
            fill="hsl(var(--hero-blob))"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Match, Plan and Self-Apply with Confidence
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Find the right colleges, estimate your total cost, check your
              admission chances, and track your visa readiness
            </p>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-success font-medium text-sm">
                  160+ Countries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-destructive" />
                <span className="text-destructive font-medium text-sm">
                  1000+ Universities
                </span>
              </div>
            </div>
            <Button size="lg" className="rounded-full px-8 gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Right content - Graduate image with circle */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Blue circle behind */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-[3px] border-hero-circle" />
              </div>
              {/* Graduate image */}
              <Image
                src="/assets/graduate.png"
                alt="Happy graduate student"
                width={256}
                height={320}
                priority
                className="relative z-10 w-72 md:w-96 h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
