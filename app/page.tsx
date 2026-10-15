import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { FiliereSection } from "@/components/landing/FiliereSection";
import { RecentProjectsSection } from "@/components/landing/RecentProjectsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { WhySection } from "@/components/landing/WhySection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FiliereSection />
        <RecentProjectsSection />
        <HowItWorksSection />
        <WhySection />
        <FaqSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}