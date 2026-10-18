"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowLeft, Scale } from "lucide-react";

export default function MentionsLegalesPage() {
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
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-primary-200 dark:border-primary-800">
                <Scale className="w-10 h-10 text-cta-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-white font-heading">
                  Mentions légales
                </h1>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-[250px_1fr] gap-12 items-start">
              <FadeIn>
                <div className="hidden lg:block">
                  <div className="sticky top-28 space-y-3 text-sm">
                    <p className="font-semibold text-primary-950 dark:text-white mb-4 uppercase tracking-wider text-xs">Sommaire</p>
                    <a href="#editeur" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">1. Éditeur du site</a>
                    <a href="#hebergement" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">2. Hébergement</a>
                    <a href="#propriete" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">3. Propriété intellectuelle</a>
                    <a href="#responsabilite" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">4. Responsabilité</a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="bg-primary-50 dark:bg-primary-800 p-8 md:p-10 rounded-3xl border border-primary-100 dark:border-primary-700 shadow-sm space-y-10">
                  <section id="editeur">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">1. Éditeur du site</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed mb-2">
                      Le site <strong>MemoRise</strong> est un projet académique développé dans le cadre d'un mémoire de fin d'études pour l'obtention du diplôme de Licence en Télécommunication.
                    </p>
                    <ul className="list-disc pl-5 text-primary-800 dark:text-primary-100 space-y-1 mt-3">
                      <li><strong>Établissement :</strong> École Supérieure Polytechnique d'Antananarivo (ESPA)</li>
                      <li><strong>Responsable de la publication :</strong> L'étudiant auteur du projet (Geneto Robson)</li>
                      <li><strong>Contact :</strong> Disponible via la page <a href="/contact" className="text-cta-600 dark:text-cta-400 hover:underline">Contact</a></li>
                    </ul>
                  </section>

                  <section id="hebergement">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">2. Hébergement</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                      Le site est hébergé par la plateforme <strong>Vercel Inc.</strong>, située au 440 N Barranca Ave #4133 Covina, CA 91723, États-Unis. 
                      La base de données est hébergée par <strong>Neon Inc.</strong>
                    </p>
                  </section>

                  <section id="propriete">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">3. Propriété intellectuelle</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                      MemoRise ne revendique aucun droit de propriété sur les mémoires référencés. Les textes, résumés et métadonnées présentés sur la plateforme appartiennent à leurs auteurs respectifs (les étudiants de l'ESPA). 
                      <br /><br />
                      Le code source de la plateforme MemoRise, l'interface utilisateur et le logo sont la propriété exclusive de leur créateur. Toute reproduction non autorisée est interdite.
                    </p>
                  </section>

                  <section id="responsabilite">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">4. Responsabilité</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                      MemoRise s'efforce de fournir des informations exactes concernant les mémoires. Cependant, la plateforme ne peut garantir l'exhaustivité ou l'exactitude absolue des métadonnées saisies par les utilisateurs. 
                      <br /><br />
                      MemoRise ne stocke pas les fichiers PDF originaux. La conservation officielle des documents reste sous la responsabilité de la Bibliothèque et Archives Universitaires (BAU).
                    </p>
                  </section>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}