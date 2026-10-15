import Image from "next/image";
import { Search, Lightbulb, Megaphone } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function WhySection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-primary-950 transition-colors">
      <Container>
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src="/images/why-bg.jpg"
            alt="Étudiants travaillant ensemble"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover brightness-110"
          />

          <div className="absolute inset-0 bg-primary-500/75" />

          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <div className="w-16 h-1 bg-cta-500 mb-6 rounded-full" />
              <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
                Pourquoi utiliser MemoRise ?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <Feature
                icon={Search}
                title="Accès rapide aux travaux"
                description="Retrouvez en quelques secondes des milliers de mémoires classés par filière, domaine et année"
              />
              <Feature
                icon={Lightbulb}
                title="Trouvez l'inspiration"
                description="Parcourez des résumés de mémoires pour affiner votre sujet et enrichir votre réflexion"
              />
              <Feature
                icon={Megaphone}
                title="Donnez de la visibilité à votre travail"
                description="En quelques minutes, votre mémoire devient une référence pour les promotions suivantes"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

interface FeatureProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-16 h-16 bg-cta-500 rounded-2xl flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary-900" />
      </div>
      <h3 className="text-lg font-semibold text-white font-heading leading-snug">
        {title}
      </h3>
      <p className="text-sm text-white/90 leading-relaxed">
        {description}
      </p>
    </div>
  );
}