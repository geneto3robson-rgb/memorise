import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Shield } from "lucide-react";

export default function ConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-[#f7faf9] dark:bg-primary-950 min-h-screen">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-primary-200 dark:border-primary-800">
              <Shield className="w-10 h-10 text-cta-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-white font-heading">
                Politique de confidentialité
              </h1>
            </div>

            <div className="grid lg:grid-cols-[250px_1fr] gap-12 items-start">
              <div className="hidden lg:block">
                <div className="sticky top-28 space-y-3 text-sm">
                  <p className="font-semibold text-primary-950 dark:text-white mb-4 uppercase tracking-wider text-xs">Sommaire</p>
                  <a href="#collecte" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">1. Collecte des données</a>
                  <a href="#utilisation" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">2. Utilisation des données</a>
                  <a href="#partage" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">3. Partage des données</a>
                  <a href="#conservation" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">4. Conservation et suppression</a>
                  <a href="#contact" className="block text-primary-700 dark:text-neutral-400 hover:text-cta-500 transition-colors">5. Contact</a>
                </div>
              </div>

              {/* BLOC VERT PRIMAIRE */}
              <div className="bg-primary-50 dark:bg-primary-800 p-8 md:p-10 rounded-3xl border border-primary-100 dark:border-primary-700 shadow-sm space-y-10">
                <section id="collecte">
                  <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">1. Collecte des données</h2>
                  <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                    Dans le cadre de l'utilisation de MemoRise, nous collectons les informations suivantes lors de votre inscription : votre nom, prénom et adresse e-mail. Vous avez la possibilité d'ajouter des liens vers vos réseaux sociaux (Facebook, LinkedIn) et votre numéro WhatsApp.
                  </p>
                </section>

                <section id="utilisation">
                  <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">2. Utilisation des données</h2>
                  <p className="text-primary-800 dark:text-primary-100 leading-relaxed mb-3">Vos données sont utilisées uniquement pour :</p>
                  <ul className="list-disc pl-5 text-primary-800 dark:text-primary-100 space-y-2">
                    <li>Gérer votre authentification sur la plateforme.</li>
                    <li>Afficher votre nom en tant qu'auteur sur les mémoires que vous publiez.</li>
                    <li>Permettre aux autres utilisateurs de vous contacter (si vous avez renseigné vos coordonnées).</li>
                  </ul>
                </section>

                <section id="partage">
                  <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">3. Partage des données</h2>
                  <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                    Nous ne vendons ni ne partageons vos données personnelles avec des tiers à des fins commerciales. Votre adresse e-mail est strictement confidentielle et n'apparaît jamais sur les pages publiques de la plateforme.
                  </p>
                </section>

                <section id="conservation">
                  <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">4. Conservation et suppression</h2>
                  <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                    Vos données sont conservées tant que votre compte reste actif. Vous pouvez demander la suppression de votre compte à tout moment via les paramètres. Cette action entraînera la suppression définitive de vos publications et de vos données associées.
                  </p>
                </section>

                <section id="contact">
                  <h2 className="text-xl font-bold text-primary-950 dark:text-white mb-3">5. Contact</h2>
                  <p className="text-primary-800 dark:text-primary-100 leading-relaxed">
                    Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter via la page dédiée sur la plateforme.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}