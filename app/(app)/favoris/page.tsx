"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { trpc } from "@/trpc/client";
import { Bookmark } from "lucide-react";

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

function FavorisSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex flex-col bg-white dark:bg-primary-900 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 animate-pulse">
          {/* 👇 CORRECTION ICI : suppression des crochets [ ] 👇 */}
          <div className="aspect-4/5 md:aspect-3/4 w-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="p-4 md:p-5 space-y-3">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full w-1/3" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-full" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-2/3" />
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full w-1/2 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FavorisPage() {
  const { data: memoires = [], isLoading } = trpc.favori.list.useQuery();

  const formatted = memoires.map((m) => ({
    id: String(m.id),
    slug: m.slug || "",
    title: m.title || "Sans titre",
    summary: m.summary || "",
    image: m.image ?? "/images/projects/telecom.jpg",
    filiere: m.filiereName ?? "",
    filiereCode: m.filiereCode ?? "",
    filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
    author: m.authorName ?? "Auteur",
    authorAvatar: m.authorImage ?? "",
    authorImage: m.authorImage ?? "",
    niveau: m.niveau || "",
    year: m.annee || new Date().getFullYear(),
    pages: 0,
    encadreur: m.encadreur || "",
    keywords: [] as string[],
  }));

  return (
    <div className="pt-8 md:pt-12 pb-24">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
            <h1 className="text-2xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">
              Mes favoris
            </h1>
            {!isLoading && (
              <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
                {formatted.length} mémoire{formatted.length > 1 ? "s" : ""} enregistré{formatted.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <FavorisSkeleton />
        ) : formatted.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-primary-950 p-10 md:p-16 text-center max-w-2xl mx-auto mt-10">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 dark:text-white mb-3">
              Aucun favori pour le moment
            </h3>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              Parcourez le catalogue et cliquez sur l'icône signet pour enregistrer des mémoires et les retrouver ici.
            </p>
            <Link
              href="/explorer"
              className="inline-block px-8 py-3 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm md:text-base font-bold transition-colors shadow-md"
            >
              Explorer les mémoires
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {formatted.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}