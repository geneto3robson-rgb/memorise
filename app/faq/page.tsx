"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowLeft, ChevronDown, HelpCircle, Send, CheckCircle2 } from "lucide-react";

const faqs = [
  { q: "Qu'est-ce que MemoRise ?", a: "MemoRise est un catalogue en ligne qui référence les mémoires de fin d'études de l'ESPA. Il vous permet de trouver facilement un travail par filière, année ou auteur." },
  { q: "Puis-je télécharger les fichiers PDF des mémoires ?", a: "Non, MemoRise ne stocke pas les fichiers PDF. La plateforme référence uniquement les métadonnées (titre, résumé, auteur). La conservation physique et numérique des documents est assurée par la BAU." },
  { q: "Comment publier mon propre mémoire ?", a: "Vous devez créer un compte, vous connecter, puis cliquer sur l'onglet 'Publier'. Remplissez les informations descriptives de votre mémoire. Vous êtes limité à 3 publications." },
  { q: "Puis-je contacter l'auteur d'un mémoire ?", a: "Oui. Sur la fiche détaillée d'un mémoire, un bouton 'Contacter l'auteur' vous permet d'accéder aux réseaux (Facebook, LinkedIn, WhatsApp) si l'auteur les a renseignés dans son profil." },
  { q: "Les informations de mon profil sont-elles visibles ?", a: "Votre e-mail n'est jamais partagé. Seuls votre nom, filière, et les contacts facultatifs (WhatsApp, Facebook, LinkedIn) que vous avez renseignés apparaissent sur vos fiches de mémoire." }
];

const inputClass = "w-full px-4 py-3 rounded-xl border border-primary-200 dark:border-primary-600 bg-white dark:bg-primary-900/50 text-primary-950 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm transition-all text-sm";

export default function FaqPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-[#f7faf9] dark:bg-primary-950 min-h-screen">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* BOUTON RETOUR */}
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-300 hover:text-cta-500 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>

            <FadeIn>
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <HelpCircle className="w-10 h-10 text-cta-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-primary-950 dark:text-white font-heading mb-4">
                  Foire Aux Questions
                </h1>
                <p className="text-primary-800 dark:text-neutral-400 text-lg">
                  Trouvez les réponses aux questions les plus fréquentes sur MemoRise.
                </p>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FadeIn key={index}>
                    <div className="bg-primary-50 dark:bg-primary-800 border border-primary-100 dark:border-primary-700 rounded-2xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                      >
                        <span className="font-semibold text-primary-950 dark:text-white pr-4">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-primary-600 dark:text-primary-300 transition-transform duration-300 shrink-0 ${openIndex === index ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                        <p className="text-primary-800 dark:text-primary-100 text-sm leading-relaxed border-t border-primary-200 dark:border-primary-700 pt-4">{faq.a}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <div className="relative">
                <FadeIn>
                  <div className="sticky top-28 bg-primary-500 dark:bg-primary-600 p-6 rounded-3xl shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white font-heading mb-2">Vous ne trouvez pas votre réponse ?</h2>
                      <p className="text-primary-50 text-sm">Posez-nous votre question, notre équipe vous répondra rapidement.</p>
                    </div>

                    {isSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-cta-400 mx-auto mb-3" />
                        <p className="text-white font-medium">Votre question a bien été envoyée !</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" required placeholder="Votre adresse e-mail" className={inputClass} />
                        <textarea required rows={4} placeholder="Écrivez votre question ici..." className={`${inputClass} resize-none`} />
                        <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-400 disabled:opacity-60 text-primary-950 font-semibold rounded-full px-6 py-3 transition-colors">
                          {isSubmitting ? "Envoi..." : <><Send className="w-4 h-4" /> Envoyer</>}
                        </button>
                      </form>
                    )}
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}