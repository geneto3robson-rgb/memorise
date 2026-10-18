"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowLeft, FileText } from "lucide-react";

export default function ConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-[#f7faf9] dark:bg-primary-950 min-h-screen">
        <Container>
          <div className="max-w-6xl mx-auto">
            
            {/* BOUTON RETOUR INSTANTANÉ */}
            <button 
              onClick={() => window.history.back()} 
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-300 hover:text-cta-500 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>

            <FadeIn>
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-primary-200 dark:border-primary-800">
                <FileText className="w-10 h-10 text-cta-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-white font-heading">
                  Conditions d'utilisation
                </h1>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-[250px_1fr] gap-12 items-start">
              <FadeIn>
                <div className="hidden lg:block">
                  <div className="sticky top-28 space-y-3 text-sm">
                    <p className="font-semibold text-primary-950 dark:text-white mb-4 uppercase tracking-wider text-xs">Sommaire</p>
                    <a href="#objet" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">1. Objet</a>
                    <a href="#acces" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">2. Accès au service</a>
                    <a href="#publication" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">3. Règles de publication</a>
                    <a href="#responsabilite" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">4. Responsabilité</a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="bg-primary-50 dark:bg-primary-800 p-8 md:p-10 rounded-3xl border border-primary-100 dark:border-primary-700 shadow-sm space-y-10">
                  <section id="objet">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">1. Objet</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                      Les présentes conditions générales d'utilisation ont pour objet l'encadrement juridique de l'utilisation du site MemoRise et de ses services. En accédant au site, vous acceptez sans réserve les présentes conditions.
                    </p>
                  </section>

                  <section id="acces">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">2. Accès au service</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                      Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. La consultation du catalogue est publique. La publication de mémoires nécessite la création d'un compte et une authentification. 
                      <br /><br />
                      MemoRise se réserve le droit de suspendre ou de supprimer un compte en cas de non-respect des présentes conditions.
                    </p>
                  </section>

                  <section id="publication">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">3. Règles de publication</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed mb-3">
                      En publiant un mémoire, l'utilisateur s'engage à :
                    </p>
                    <ul className="list-disc pl-5 text-primary-800 dark:text-primary-100 space-y-2">
                      <li>Ne publier que des travaux dont il est l'auteur ou pour lesquels il dispose des autorisations nécessaires.</li>
                      <li>Fournir des informations exactes et ne pas usurper l'identité d'un tiers.</li>
                      <li>Ne pas diffuser de contenu illicite, haineux, diffamatoire ou portant atteinte à la vie privée.</li>
                      <li>Respecter la limite de 3 publications par compte.</li>
                    </ul>
                  </section>

                  <section id="responsabilite">
                    <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">4. Responsabilité</h2>
                    <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                      MemoRise agit en tant qu'hébergeur de métadonnées. La plateforme ne peut être tenue responsable du contenu des résumés publiés par les utilisateurs. En cas de signalement d'un contenu inapproprié, MemoRise se réserve le droit de retirer la publication et de sanctionner l'auteur.
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