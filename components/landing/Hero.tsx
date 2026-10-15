import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-primary-500 pb-28">
      <div className="relative min-h-[600px] rounded-b-[34px] overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt="Étudiant consultant un mémoire"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-900/40 to-primary-900/10 dark:from-primary-950/90 dark:via-primary-950/70 dark:to-primary-950/30" />

        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 pt-28 pb-16 md:pb-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading leading-tight">
              Découvrez les travaux réalisés à l'ESPA
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explorez les mémoires de fin d'études réalisés par les étudiants de
              l'École Supérieure Polytechnique d'Antananarivo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/explorer"
                className="inline-flex items-center justify-center bg-cta-500 hover:bg-cta-600 text-primary-900 font-semibold rounded-full px-8 py-4 text-base transition-colors"
              >
                Explorer les travaux
              </Link>
              <Link
                href="/publier"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-4 text-base transition-colors"
              >
                Publier mon travail
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto -mt-7 relative z-20 px-4">
        <form action="/explorer" method="get" className="relative">
          <input
            type="text"
            name="q"
            placeholder="Rechercher un mémoire, une filière ou un auteur..."
            className="w-full px-6 py-4 pr-16 rounded-full bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-2xl"
          />
          <button
            type="submit"
            aria-label="Rechercher"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 hover:bg-cta-400 p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Search className="w-5 h-5 text-primary-900" />
          </button>
        </form>
        <p className="text-sm text-white/70 mt-3 px-6 text-center">
          Ex : Intelligence artificielle · Télécommunications · Rabe
        </p>
      </div>
    </section>
  );
}