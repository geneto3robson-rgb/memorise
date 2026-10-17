"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Mail, Send, CheckCircle2, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-primary-200 dark:border-primary-600 bg-white dark:bg-primary-900 text-primary-950 dark:text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm transition-all";

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-[#f7faf9] dark:bg-primary-950 min-h-screen">
        <Container>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-primary-950 dark:text-white font-heading mb-4">Contactez-nous</h1>
                <p className="text-primary-800 dark:text-neutral-400">Une question, une suggestion ou un problème technique ? Écrivez-nous.</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-10 items-start">
              <FadeIn>
                {/* BLOC VERT PRIMAIRE */}
                <div className="bg-primary-50 dark:bg-primary-800 p-8 rounded-3xl border border-primary-100 dark:border-primary-700 shadow-sm space-y-8">
                  <h2 className="text-2xl font-bold text-primary-950 dark:text-white font-heading">Nos coordonnées</h2>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-primary-900 flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5 text-primary-600 dark:text-cta-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-950 dark:text-white">Adresse</p>
                      <p className="text-sm text-primary-700 dark:text-primary-200">École Supérieure Polytechnique<br/>Antananarivo, Madagascar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-primary-900 flex items-center justify-center shrink-0 shadow-sm">
                      <Mail className="w-5 h-5 text-primary-600 dark:text-cta-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-950 dark:text-white">E-mail</p>
                      <p className="text-sm text-primary-700 dark:text-primary-200">contact@memorise.mg</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-primary-900 flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-5 h-5 text-primary-600 dark:text-cta-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-950 dark:text-white">Téléphone</p>
                      <p className="text-sm text-primary-700 dark:text-primary-200">+261 34 78 805 02</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                {/* BLOC VERT PRIMAIRE */}
                <div className="bg-primary-50 dark:bg-primary-800 p-6 md:p-8 rounded-3xl border border-primary-100 dark:border-primary-700 shadow-sm">
                  {isSuccess ? (
                    <div className="text-center py-16">
                      <CheckCircle2 className="w-16 h-16 text-cta-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-primary-950 dark:text-white mb-2 font-heading">Message envoyé !</h2>
                      <p className="text-primary-700 dark:text-primary-200">Merci de nous avoir contactés.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-primary-950 dark:text-white mb-2">Nom complet</label>
                          <input type="text" required placeholder="Votre nom" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary-950 dark:text-white mb-2">E-mail</label>
                          <input type="email" required placeholder="vous@exemple.com" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-950 dark:text-white mb-2">Sujet</label>
                        <input type="text" required placeholder="L'objet de votre message" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-950 dark:text-white mb-2">Message</label>
                        <textarea required rows={5} placeholder="Écrivez votre message ici..." className={`${inputClass} resize-none`} />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-400 disabled:opacity-60 text-primary-950 font-semibold rounded-full px-8 py-3.5 transition-colors mt-2">
                        {isSubmitting ? "Envoi en cours..." : <><Send className="w-4 h-4" /> Envoyer le message</>}
                      </button>
                    </form>
                  )}
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