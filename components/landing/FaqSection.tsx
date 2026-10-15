"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/Container";

const faqs = [
  {
    question: "Qu'est-ce que MemoRise exactement ?",
    answer: "MemoRise est une plateforme web qui facilite la recherche et la découverte des mémoires de fin d'études réalisés à l'École Supérieure Polytechnique d'Antananarivo (ESPA).",
  },
  {
    question: "MemoRise stocke-t-il les PDF des mémoires ?",
    answer: "Non. MemoRise ne stocke aucun fichier PDF. La plateforme référence uniquement les métadonnées : titre, résumé, mots-clés, auteur et année de soutenance. La conservation des documents reste assurée par la Bibliothèque et Archives Universitaires (BAU).",
  },
  {
    question: "L'utilisation de MemoRise est-elle gratuite ?",
    answer: "Oui. La consultation du catalogue est totalement gratuite et accessible à tous. La publication des métadonnées d'un mémoire est également gratuite.",
  },
  {
    question: "Qui peut publier un mémoire sur MemoRise ?",
    answer: "La publication est réservée aux étudiants et anciens étudiants de l'ESPA. Il suffit de créer un compte sur la plateforme ou de s'inscrire directement via Google pour commencer à publier.",
  },
  {
    question: "Comment contacter l'auteur d'un mémoire ?",
    answer: "Chaque profil étudiant contient au moins un moyen de contact : Facebook, LinkedIn ou WhatsApp. Depuis la fiche d'un mémoire, il suffit de cliquer sur l'icône correspondante pour ouvrir directement la conversation.",
  },
  {
    question: "Quelle est sa différence avec une bibliothèque numérique ?",
    answer: "Une bibliothèque numérique peut conserver et proposer la consultation de documents complets. MemoRise, dans son périmètre actuel, se concentre sur les informations qui décrivent les mémoires, et non sur le stockage de leurs fichiers PDF.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 bg-neutral-50 dark:bg-primary-950 transition-colors">
      <Container>
        <div className="mb-12">
          <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
            Questions fréquentes
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Les réponses aux questions les plus courantes sur MemoRise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <div>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-primary-500 dark:hover:text-cta-500 transition-colors"
                  >
                    <span className="font-medium text-primary-900 dark:text-white text-base md:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary-900 dark:text-white shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative hidden md:block rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/faq-image.jpg"
              alt="Étudiant consultant un mémoire"
              fill
              sizes="(max-width: 768px) 0vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}