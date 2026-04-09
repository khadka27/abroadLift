"use client"
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import EverythingSection from "@/components/home/EverythingSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import TrustedPartnersSection from "@/components/home/TrustedPartnersSection";
import AdmissionSection from "@/components/home/AdmissionSection";
import ConfidenceSection from "@/components/home/ConfidenceSection";
import CostSection from "@/components/home/CostSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTABanner from "@/components/home/CTABanner";
import GetStartedSection from "@/components/home/GetStartedSection";

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
