"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Eye, Pencil } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { projects } from "@/lib/data/projects";

type Statut = "publie" | "attente" | "brouillon";

const statutLabel: Record<Statut, string> = {
  publie: "Publié",
  attente: "En attente",
  brouillon: "Brouillon",
};

const statutStyle: Record<Statut, string> = {
  publie: "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300",
  attente: "bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300",
  brouillon: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

export default function PublicationsPage() {
  const mesPublications = projects.slice(0, 3).map((p, i) => ({
    ...p,
    statut: (["publie", "attente", "brouillon"] as Statut[])[i],
  }));

  return (
    <Container className="py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">
            Mes publications
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {mesPublications.length} publication{mesPublications.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/publier"
          className="inline-flex items-center gap-2 bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full px-5 py-2.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Publier un mémoire
        </Link>
      </div>

      {mesPublications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-primary-900 p-12 text-center">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
            Aucune publication
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Vous n&apos;avez pas encore publié de mémoire.
          </p>
          <Link
            href="/publier"
            className="inline-block px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold transition-colors"
          >
            Publier mon premier mémoire
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mesPublications.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-4 hover:border-cta-500 transition-colors"
            >
              <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0">
                <Image src={p.image} alt={p.title} fill sizes="200px" className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statutStyle[p.statut]}`}>
                    {statutLabel[p.statut]}
                  </span>
                  <span className="text-xs text-neutral-500">{p.filiere}</span>
                </div>

                <h3 className="font-semibold text-primary-900 dark:text-white mb-2 line-clamp-2">
                  {p.title}
                </h3>

                <p className="text-xs text-neutral-500 mb-3">
                  {p.niveau} · {p.year} · {p.pages} pages
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link
                    href={`/memoires/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-cta-500 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Voir
                  </Link>
                  <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-cta-500 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}