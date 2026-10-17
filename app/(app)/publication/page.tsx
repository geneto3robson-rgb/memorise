"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { trpc } from "@/trpc/client";

const MAX_PUBLICATIONS = 3;

export default function PublicationPage() {
  const utils = trpc.useUtils();
  const { data: rows = [], isLoading } = trpc.memoire.mine.useQuery();

  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const limiteAtteinte = rows.length >= MAX_PUBLICATIONS;

  const deleteMutation = trpc.memoire.delete.useMutation({
    onSuccess: () => {
      utils.memoire.mine.invalidate();
      utils.memoire.recent.invalidate();
      setDeleteSlug(null);
    },
    onError: () => {
      setDeleteSlug(null);
    },
  });

  useEffect(() => {
    if (deleteMutation.isPending) {
      setProgress(0);
      const t = setTimeout(() => setProgress(90), 50);
      return () => clearTimeout(t);
    }
    setProgress(0);
  }, [deleteMutation.isPending]);

  const confirmDelete = () => {
    if (!deleteSlug) return;
    deleteMutation.mutate({ slug: deleteSlug });
  };

  const deleting = deleteMutation.isPending;

  return (
    <>
      {deleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-80 max-w-[90%] rounded-2xl bg-white dark:bg-primary-900 p-6 shadow-2xl">
            <p className="mb-4 text-center text-sm font-medium text-primary-900 dark:text-white">
              Suppression en cours…
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-primary-950">
              <div
                style={{ width: `${progress}%` }}
                className="h-full rounded-full bg-cta-500 transition-all duration-[3000ms] ease-out"
              />
            </div>
          </div>
        </div>
      )}

      {deleteSlug && !deleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-primary-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              <h3 className="text-lg font-bold text-primary-900 dark:text-white font-heading">
                Confirmer la suppression
              </h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Cette action est irréversible. Le mémoire sera définitivement
              supprimé de la plateforme.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteSlug(null)}
                className="border-2 border-neutral-300 dark:border-neutral-600 text-primary-900 dark:text-white font-medium rounded-full px-5 py-2 hover:border-cta-500 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-error-500 hover:bg-error-600 text-white font-semibold rounded-full px-5 py-2 transition-colors text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <Container className="py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">
              Mes publications
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {rows.length} / {MAX_PUBLICATIONS} publication
              {rows.length > 1 ? "s" : ""}
            </p>
          </div>

          {limiteAtteinte ? (
            <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-primary-900 text-neutral-500 dark:text-neutral-400 text-sm font-medium rounded-full px-5 py-2.5">
              Limite atteinte (3 max)
            </div>
          ) : (
            <Link
              href="/publier"
              className="inline-flex items-center gap-2 bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full px-5 py-2.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Publier un mémoire
            </Link>
          )}
        </div>

        {isLoading ? (
          <p className="text-center text-neutral-500 py-12">Chargement…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-900 p-12 text-center">
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
            {rows.map((p) => {
              const imageSrc = p.image ?? "/images/projects/telecom.jpg";
              const isDataUrl = imageSrc.startsWith("data:");

              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-primary-900 p-4 hover:border-cta-500 transition-colors shadow-sm"
                >
                  <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-primary-950">
                    {isDataUrl ? (
                      <img
                        src={imageSrc}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={imageSrc}
                        alt={p.title}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300">
                        Publié
                      </span>
                      <span className="text-xs text-neutral-500">
                        {p.filiereName}
                      </span>
                    </div>

                    <h3 className="font-semibold text-primary-900 dark:text-white mb-2 line-clamp-2">
                      {p.title}
                    </h3>

                    <p className="text-xs text-neutral-500 mb-3">
                      {p.niveau} · {p.annee}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Link
                        href={`/publier?edit=${p.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-900 dark:text-white border border-neutral-300 dark:border-neutral-600 rounded-full px-3 py-1.5 hover:border-cta-500 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Modifier
                      </Link>
                      <Link
                        href={`/memoires/${p.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-900 dark:text-white border border-neutral-300 dark:border-neutral-600 rounded-full px-3 py-1.5 hover:border-cta-500 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Voir le détail
                      </Link>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-start shrink-0">
                    <button
                      type="button"
                      onClick={() => setDeleteSlug(p.slug)}
                      aria-label="Supprimer ce mémoire"
                      className="p-2 rounded-full text-neutral-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}