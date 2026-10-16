"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Plus, Bookmark } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { projects } from "@/lib/data/projects";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";

const parcoursParFiliere: Record<string, string[]> = {
  TCO: ["STI", "RS", "RC"],
};

const MAX_PUBLICATIONS = 3;

export default function TableauDeBordPage() {
  const { data: session } = authClient.useSession();
  const prenom = session?.user?.name?.split(" ")[0] ?? "";

  const { data: ids = [] } = trpc.favori.ids.useQuery();
  const nbFavoris = ids.length;
  const mesPublications = projects.slice(0, 2);
  const maFiliere = "TCO";
  const parcours = parcoursParFiliere[maFiliere] ?? [];
  const derniers = projects.slice(0, 4);

  return (
    <Container className="py-6 md:py-10 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">
          Bonjour, {prenom} !
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Que souhaitez-vous explorer aujourd&apos;hui ?
        </p>
      </div>

      <form action="/explorer" method="get" className="relative max-w-2xl mx-auto mb-10">
        <input
          type="text"
          name="q"
          placeholder="Rechercher un mémoire, une filière ou un auteur…"
          className="w-full px-6 py-3.5 pr-14 rounded-full bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm"
        />
        <button
          type="submit"
          aria-label="Rechercher"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 hover:bg-cta-400 p-2.5 rounded-full transition-colors"
        >
          <Search className="w-5 h-5 text-primary-900" />
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 p-6 flex flex-col justify-between h-[260px]">
          <div>
            <span className="inline-block bg-cta-500 text-primary-900 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Explorer
            </span>
            <h2 className="text-2xl font-bold text-white font-heading leading-snug">
              Parcourez les travaux de votre filière
            </h2>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-2">Parcours</p>
            <div className="flex flex-wrap gap-2">
              {parcours.length > 0 ? (
                parcours.map((p) => (
                  <Link
                    key={p}
                    href={`/explorer?filiere=${maFiliere}`}
                    className="px-3 py-1 rounded-full border border-white/30 text-white text-xs hover:bg-white/10 transition-colors"
                  >
                    {p}
                  </Link>
                ))
              ) : (
                <span className="text-xs text-white/50">Parcours à compléter</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-6 flex flex-col h-[260px]">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading">
              Mes publications
            </h2>
            <Link
              href="/publication"
              className="text-xs font-semibold bg-cta-500 text-primary-900 px-3 py-1 rounded-full"
            >
              Voir tout
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {mesPublications.slice(0, 1).map((p) => (
              <Link
                key={p.id}
                href={`/memoires/${p.slug}`}
                className="relative block rounded-xl overflow-hidden h-32"
              >
                <Image src={p.image} alt={p.title} fill sizes="300px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 to-transparent" />
                <p className="absolute bottom-2 left-3 right-3 text-xs text-white line-clamp-2">
                  {p.title}
                </p>
              </Link>
            ))}

            <div className="flex items-center justify-between text-xs pt-3">
              <span className="text-neutral-500">
                {mesPublications.length} / {MAX_PUBLICATIONS} publications
              </span>
              <Link
                href="/publier"
                className="inline-flex items-center gap-1 text-primary-900 dark:text-white font-medium hover:text-cta-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Publier
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-cta-500 p-6 flex flex-col h-[260px]">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-900 font-heading">
              Enregistrements
            </h2>
            <Bookmark className="w-5 h-5 text-primary-900" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-bold text-primary-900 mb-1">{nbFavoris}</p>
            <p className="text-xs text-primary-900/70 mb-5">
              mémoire{nbFavoris > 1 ? "s" : ""} enregistré{nbFavoris > 1 ? "s" : ""}
            </p>
            <Link
              href="/favoris"
              className="inline-flex items-center gap-1.5 bg-primary-900 text-white text-sm font-medium rounded-full px-4 py-2 hover:bg-primary-800 transition-colors"
            >
              Voir tous les enregistrements
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading">
          Récemment publiés
        </h2>
        <Link
          href="/explorer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-white hover:text-cta-600 transition-colors"
        >
          Voir tout
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {derniers.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Container>
  );
}