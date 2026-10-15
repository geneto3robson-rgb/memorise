import Image from "next/image";
import { Search, Filter, BookOpen, UserPlus, FileText, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-primary-950 transition-colors">
      <Container>
        <div className="mb-12">
          <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Découvrez comment explorer et enrichir le catalogue des mémoires de l'ESPA.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="relative group min-h-[400px] overflow-hidden">
              <Image
                src="/images/how-search.jpg"
                alt="Recherche dans le catalogue"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-neutral-50 dark:bg-primary-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary-500
                 dark:text-white text-center">
                  Je cherche un mémoire
                </h3>
              </div>
            </div>
            <div className="bg-primary-500 p-8 md:p-12 flex flex-col justify-center gap-8">
              <Step
                icon={Search}
                title="Je recherche"
                description="Entrez un mot-clé, une filière, un domaine ou le nom d'un auteur dans la barre de recherche."
              />
              <Step
                icon={Filter}
                title="Je filtre"
                description="Affinez les résultats par filière, niveau, année ou domaine pour trouver exactement ce que vous cherchez."
              />
              <Step
                icon={BookOpen}
                title="Je consulte"
                description="Accédez à la fiche complète du mémoire : résumé, auteur, encadreur, mots-clés. Enregistrez-le dans votre liste ou contactez l'auteur."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="bg-primary-500 p-8 md:p-12 flex flex-col justify-center gap-8 order-2 md:order-1">
              <Step
                icon={UserPlus}
                title="Je crée mon compte"
                description="Inscrivez-vous avec votre email et complétez votre profil étudiant."
              />
              <Step
                icon={FileText}
                title="Je renseigne les informations"
                description="Titre, résumé, filière, domaine, mots-clés, auteur, année de soutenance."
              />
              <Step
                icon={Globe}
                title="Mon mémoire est découvrable"
                description="Après validation, votre travail est accessible aux étudiants des promotions suivantes."
              />
            </div>
            <div className="relative group min-h-[400px] overflow-hidden order-1 md:order-2">
              <Image
                src="/images/how-publish.jpg"
                alt="Publication d'un mémoire"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-neutral-50 dark:bg-primary-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary-500
                 dark:text-white text-center">
                  Je publie mon mémoire
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

interface StepProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function Step({ icon: Icon, title, description }: StepProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary-900" />
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1 font-heading">{title}</h3>
        <p className="text-sm text-white/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}