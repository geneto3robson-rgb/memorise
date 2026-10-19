"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { Project } from "@/lib/data/projects";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { AuthPromptModal } from "@/components/layout/AuthPromptModal";
import { UserAvatar } from "@/components/ui/UserAvatar"; // 👈 IMPORT DU COMPOSANT

interface ProjectCardProps {
  project: Project;
  onOpen?: (slug: string) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { data: session } = authClient.useSession();
  const utils = trpc.useUtils();
  const [showAuth, setShowAuth] = useState(false);

  const numericId = Number(project.id);

  const { data: ids = [] } = trpc.favori.ids.useQuery(undefined, {
    enabled: !!session,
    staleTime: Infinity,
  });

  const isSaved = ids.includes(numericId);

  const toggle = trpc.favori.toggle.useMutation({
    onMutate: async ({ memoireId }) => {
      await utils.favori.ids.cancel();
      await utils.favori.list.cancel();

      const previousIds = utils.favori.ids.getData() ?? [];
      const previousList = utils.favori.list.getData() ?? [];
      const wasSaved = previousIds.includes(memoireId);

      const nextIds = wasSaved
        ? previousIds.filter((id) => id !== memoireId)
        : [...previousIds, memoireId];

      utils.favori.ids.setData(undefined, nextIds);

      const nextList = wasSaved
        ? previousList.filter((m) => m.id !== memoireId)
        : [
            {
              id: memoireId,
              slug: project.slug,
              title: project.title,
              summary: project.summary,
              image: project.image,
              annee: project.year,
              niveau: project.niveau,
              encadreur: project.encadreur,
              filiereName: project.filiere,
              filiereCode: project.filiereCode,
              authorName: project.author,
              authorImage: project.authorAvatar,
            },
            ...previousList,
          ];

      utils.favori.list.setData(undefined, nextList);

      return { previousIds, previousList };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) {
        utils.favori.ids.setData(undefined, ctx.previousIds);
        utils.favori.list.setData(undefined, ctx.previousList);
      }
    },
    onSuccess: (result, { memoireId }) => {
      if (result.saved) {
        utils.favori.ids.setData(undefined, (old = []) =>
          old.includes(memoireId) ? old : [...old, memoireId]
        );
      } else {
        utils.favori.ids.setData(undefined, (old = []) =>
          old.filter((id) => id !== memoireId)
        );
      }
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!session) {
      setShowAuth(true);
      return;
    }
    toggle.mutate({ memoireId: numericId });
  };

  const handleOpen = (e: React.MouseEvent) => {
    if (onOpen) {
      e.preventDefault();
      onOpen(project.slug);
    }
  };

  return (
    <>
      <article
        onClick={onOpen ? () => onOpen(project.slug) : undefined}
        className={`group flex flex-col rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-primary-900 hover:border-cta-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${onOpen ? "cursor-pointer" : ""}`}
      >
        <div className="relative h-40 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`absolute top-3 left-3 ${project.filiereColor} text-white text-xs font-medium px-3 py-1 rounded-full`}
          >
            {project.filiere}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-semibold text-primary-900 dark:text-white mb-3 line-clamp-2 leading-snug">
            {project.title}
          </h3>

          {/* 👇 UTILISATION DE UserAvatar ICI */}
          <div className="flex items-center gap-2 mb-2">
            <UserAvatar name={project.author} image={project.authorAvatar} className="w-6 h-6 text-[10px]" />
            <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
              {project.author}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{project.niveau}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 truncate">
            Encadré par : {project.encadreur}
          </p>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4">
            {project.summary}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {onOpen ? (
              <button
                onClick={handleOpen}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-white border-2 border-primary-900 dark:border-white rounded-full px-3 py-1.5 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors"
              >
                Voir le détail
                <ArrowUpRight className="w-3 h-3" />
              </button>
            ) : (
              <Link
                href={`/memoires/${project.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-white border-2 border-primary-900 dark:border-white rounded-full px-3 py-1.5 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors"
              >
                Voir le détail
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
            <button
              type="button"
              onClick={handleToggle}
              aria-label={isSaved ? "Retirer des favoris" : "Enregistrer"}
              className={`transition-colors ${
                isSaved
                  ? "text-primary-500 dark:text-cta-500"
                  : "text-primary-900 dark:text-white hover:text-primary-500 dark:hover:text-cta-500"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </article>

      <AuthPromptModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        title="Connexion requise"
        message="Créez un compte ou connectez-vous pour enregistrer ce mémoire dans vos favoris."
        redirectTo="/favoris"
        saveId={numericId}
      />
    </>
  );
}