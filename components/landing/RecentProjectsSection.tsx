"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "./ProjectCard";
import { MemoireModal } from "@/components/memoire/MemoireModal";
import { trpc } from "@/trpc/client";

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500",
  EN: "bg-warning-500",
  GE: "bg-success-500",
  BTP: "bg-purple-600",
};

export function RecentProjectsSection() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: rows = [], isLoading } = trpc.memoire.recent.useQuery();

  const projects = rows.map((m) => ({
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
    <>
      <section id="recent" className="py-16 md:py-20 bg-neutral-50 dark:bg-primary-950 transition-colors">
        <Container>
          <div className="mb-10">
            <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
              Travaux récemment publiés
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Découvrez les derniers mémoires publiés par les étudiants de l&apos;ESPA.
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-neutral-500 py-12">Chargement…</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-neutral-500 py-12">Aucun mémoire publié pour l&apos;instant.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
          ))}
          </div>
          )}
        </Container>
      </section>

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </>
  );
}