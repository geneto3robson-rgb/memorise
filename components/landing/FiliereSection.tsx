import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { filieres } from "@/lib/data/filieres";
import { FiliereCard } from "./FiliereCard";

export function FiliereSection() {
  const featured = filieres.filter((f) => f.featured);

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-primary-950 transition-colors">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
              Explorer par mention
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Parcourez les travaux par mention qui vous intéressent.
            </p>
          </div>
          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-900 dark:text-white border-2 border-primary-900 dark:border-white rounded-full px-5 py-2 hover:bg-cta-500 hover:text-white hover:border-white transition-colors self-start md:self-end"
          >
            Voir toutes les mentions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((filiere) => (
            <FiliereCard key={filiere.id} filiere={filiere} />
          ))}
        </div>
      </Container>
    </section>
  );
}