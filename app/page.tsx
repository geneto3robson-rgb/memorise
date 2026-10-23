import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { FiliereSection } from "@/components/landing/FiliereSection";
import { RecentProjectsSection } from "@/components/landing/RecentProjectsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { WhySection } from "@/components/landing/WhySection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { FadeIn } from "@/components/ui/FadeIn";

export default async function Home() {
  // Vérification de la session côté serveur AVANT de charger la page
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (session) {
    redirect("/tableau-de-bord");
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FadeIn><FiliereSection /></FadeIn>
        <FadeIn><RecentProjectsSection /></FadeIn>
        <FadeIn><HowItWorksSection /></FadeIn>
        <FadeIn><WhySection /></FadeIn>
        <FadeIn><FaqSection /></FadeIn>
        <FadeIn><FinalCTA /></FadeIn>
      </main>
      <Footer />
    </>
  );
}