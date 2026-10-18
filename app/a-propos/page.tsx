"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowLeft, BookOpen, Target, Users, ShieldCheck } from "lucide-react";

export default function AProposPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-[#f7faf9] dark:bg-primary-950 min-h-screen">
        <Container>
          <div className="max-w-6xl mx-auto">
            
            {/* BOUTON RETOUR */}
            <button 
              onClick={() => router.back()} 
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-300 hover:text-cta-500 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>

            <FadeIn>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-950 dark:text-white font-heading mb-6">
                  À propos de MemoRise
                </h1>
                <p className="text-lg text-primary-800 dark:text-neutral-400 leading-relaxed">
                  MemoRise est une plateforme dédiée à la valorisation des travaux de fin d'études des étudiants de l'École Supérieure Polytechnique d'Antananarivo (ESPA).
                </p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <FadeIn>
                <div className="space-y-8 bg-primary-50 dark:bg-primary-800 p-8 rounded-3xl border border-primary-100 dark:border-primary-700 shadow-sm">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-8 h-8 text-cta-500" />
                      <h2 className="text-2xl font-bold text-primary-950 dark:text-white">Notre Mission</h2>
                    </div>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed pl-11">
                      Centraliser les métadonnées des mémoires pour faciliter la recherche, la consultation et le partage de connaissances au sein de la communauté universitaire et au-delà.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-8 h-8 text-cta-500" />
                      <h2 className="text-2xl font-bold text-primary-950 dark:text-white">Le Problème Résolu</h2>
                    </div>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed pl-11">
                      Face à la difficulté d'accéder aux anciens travaux, MemoRise agit comme un index intelligent. Il permet de trouver le bon mémoire sans stocker les fichiers PDF, dont la conservation reste assurée par la BAU.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-primary-100 dark:border-primary-700">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                    alt="Étudiants à l'université" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
                </div>
              </FadeIn>
            </div>

            <FadeIn>
              <div className="bg-primary-500 dark:bg-primary-600 p-8 md:p-12 rounded-3xl text-center shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6 font-heading">Un projet né à l'ESPA</h2>
                  <p className="text-primary-50 max-w-2xl mx-auto leading-relaxed mb-8">
                    Développé dans le cadre d'un mémoire de Licence en Télécommunication, MemoRise illustre la volonté de mettre la technologie au service de l'éducation et de la recherche.
                  </p>
                  <div className="flex justify-center gap-12 text-white">
                    <div className="flex flex-col items-center">
                      <Users className="w-10 h-10 mb-2 text-cta-400" />
                      <span className="text-sm font-medium">Communauté</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ShieldCheck className="w-10 h-10 mb-2 text-cta-400" />
                      <span className="text-sm font-medium">Fiabilité</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}