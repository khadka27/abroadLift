import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import HomeRedirectWatcher from "@/components/home/HomeRedirectWatcher";

import EverythingSection from "@/components/home/EverythingSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import EstimateSection from "@/components/home/EstimateSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedPartnersSection from "@/components/home/TrustedPartnersSection";
import AdmissionSection from "@/components/home/AdmissionSection";
import ConfidenceSection from "@/components/home/ConfidenceSection";
import VisaReadinessSection from "@/components/home/VisaReadinessSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <HomeRedirectWatcher />
      </Suspense>
      <HeroSection />
      <StatsBar />
      <EverythingSection />
      <SolutionsSection />
      <EstimateSection />
      <TestimonialsSection />
      <TrustedPartnersSection />
      <AdmissionSection />
      <ConfidenceSection />
      <VisaReadinessSection />
      <HowItWorksSection />
      <CTABanner />
    </div>
  );
}
