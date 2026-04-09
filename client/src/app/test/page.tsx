import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import EverythingSection from "@/components/EverythingSection";
import SolutionsSection from "@/components/SolutionsSection";
import TrustedPartnersSection from "@/components/TrustedPartnersSection";
import AdmissionSection from "@/components/AdmissionSection";
import ConfidenceSection from "@/components/ConfidenceSection";
import CostSection from "@/components/CostSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTABanner from "@/components/CTABanner";
import GetStartedSection from "@/components/GetStartedSection";

const Index = () => (
  <div className="min-h-screen">
    <HeroSection />
    <StatsBar />
    <EverythingSection />
    <SolutionsSection />
    <TrustedPartnersSection />
    <AdmissionSection />
    <ConfidenceSection />
    <CostSection />
    <HowItWorksSection />
    <CTABanner />
    <GetStartedSection />
  </div>
);

export default Index;