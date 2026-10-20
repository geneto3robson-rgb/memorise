"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { trpc } from "@/trpc/client";
import { Bookmark, Compass } from "lucide-react";

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

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
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
              {formatted.length} mémoire{formatted.length > 1 ? "s" : ""} enregistré{formatted.length > 1 ? "s" : ""}
            </p>
          </div>
          
          <Link 
            href="/explorer" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 text-primary-900 dark:text-white text-sm font-bold rounded-full hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors shadow-sm w-fit"
          >
            <Compass className="w-4 h-4" /> Explorer le catalogue
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-4 border-[#184F53] border-t-[#CEEC22] animate-spin mb-4" />
            <p className="text-neutral-500 text-sm">Chargement de vos favoris...</p>
          </div>
        ) : formatted.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#0A1E1E] p-10 md:p-16 text-center max-w-2xl mx-auto mt-10">
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
          /* Grille : 1 colonne sur mobile (images en grand), 4 sur PC */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {formatted.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}