"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { trpc } from "@/trpc/client";

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500",
  EN: "bg-warning-500",
  GE: "bg-success-500",
  BTP: "bg-purple-600",
};

export default function FavorisPage() {
  const { data: memoires = [], isLoading } = trpc.favori.list.useQuery();

  const formatted = memoires.map((m) => ({
    id: String(m.id),
    slug: m.slug,
    title: m.title,
    summary: m.summary,
    image: m.image ?? "/images/projects/telecom.jpg",
    filiere: m.filiereName ?? "",
    filiereCode: m.filiereCode ?? "",
    filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
    author: m.authorName ?? "Auteur",
    authorAvatar: m.authorImage ?? "/images/authors/authors1.jpg",
    niveau: m.niveau,
    year: m.annee,
    pages: 0,
    encadreur: m.encadreur,
    keywords: [] as string[],
  }));

  return (
    <Container className="py-10 md:py-14">
      <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
      <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
        Mes favoris
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {formatted.length} mémoire{formatted.length > 1 ? "s" : ""} enregistré
        {formatted.length > 1 ? "s" : ""}
      </p>

      {isLoading ? (
        <p className="text-center text-neutral-500 py-12">Chargement…</p>
      ) : formatted.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-primary-900 p-12 text-center">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
            Aucun favori pour le moment
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Enregistrez des mémoires depuis Explorer pour les retrouver ici.
          </p>
          <Link
            href="/explorer"
            className="inline-block px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold transition-colors"
          >
            Explorer les mémoires
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formatted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Container>
  );
}