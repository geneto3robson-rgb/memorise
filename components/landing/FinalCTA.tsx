import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-primary-950 transition-colors">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 dark:text-white font-heading leading-[1.1] mb-6">
            Votre{" "}
            <span className="text-cta-500">mémoire</span>{" "}
            peut commencer par une idée déjà explorée.
          </h2>

          <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            Découvrez les travaux réalisés à l'ESPA et construisez sur les
            connaissances des promotions précédentes.
          </p>

          <Link
            href="/explorer"
            className="inline-flex items-center bg-cta-500 hover:bg-cta-600 text-primary-900 font-semibold rounded-full px-8 md:px-10 py-4 md:py-5 text-base md:text-lg transition-colors"
          >
            Explorer les travaux
          </Link>
        </div>
      </Container>
    </section>
  );
}