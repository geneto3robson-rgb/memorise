"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { Project } from "@/lib/data/projects";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { AuthPromptModal } from "@/components/layout/AuthPromptModal";

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
      const nextIds = wasSaved ? previousIds.filter((id) => id !== memoireId) : [...previousIds, memoireId];
      utils.favori.ids.setData(undefined, nextIds);
      const nextList = wasSaved
        ? previousList.filter((m) => m.id !== memoireId)
        : [{ id: memoireId, slug: project.slug, title: project.title, summary: project.summary, image: project.image, annee: project.year, niveau: project.niveau, encadreur: project.encadreur, filiereName: project.filiere, filiereCode: project.filiereCode, authorName: project.author, authorImage: project.authorAvatar }, ...previousList];
      utils.favori.list.setData(undefined, nextList);
      return { previousIds, previousList };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) {
        utils.favori.ids.setData(undefined, ctx.previousIds);
        utils.favori.list.setData(undefined, ctx.previousList);
      }
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!session) return setShowAuth(true);
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
        className={`group relative flex flex-col rounded-[1.5rem] overflow-hidden aspect-[4/5] sm:aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 ${onOpen ? "cursor-pointer" : ""}`}
      >
        {/* Image de fond */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Dégradé sombre pour lire le texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E1E] via-[#0A1E1E]/40 to-transparent opacity-90" />

        {/* Badge mention en haut à gauche */}
        <div className="absolute top-4 left-4 z-10 max-w-[80%]"> {/*Ajout de max-w-[80%] */}
          <span className={`block truncate px-3 py-1 text-[10px] font-bold text-white rounded-full bg-black/40 backdrop-blur-md border border-white/20`}>
            {/*Ajout de block et truncate */}
            {project.filiere}
          </span>
        </div>

        {/* Bouton Favori en haut à droite */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isSaved ? "Retirer des favoris" : "Enregistrer"}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 transition-colors"
        >
          <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? "text-[#CEEC22] fill-[#CEEC22]" : "text-white"}`} />
        </button>

                {/* Contenu en bas */}
        <div className="relative mt-auto p-3 md:p-5 z-10 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] md:text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
              {project.niveau}
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
              {project.year}
            </span>
          </div>

          <h3 className="text-xs md:text-lg font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-[#CEEC22] transition-colors">
            {project.title}
          </h3>
          
          <p className="text-[10px] md:text-xs text-white/80 line-clamp-1 mb-2 md:mb-3">
            Par {project.author}
          </p>

          {onOpen ? (
            <button
              onClick={handleOpen}
              className="inline-flex items-center justify-between w-full text-[10px] md:text-sm font-bold text-white border-t border-white/20 pt-2 md:pt-3 hover:text-[#CEEC22] transition-colors"
            >
              Voir le détail
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          ) : (
            <Link
              href={`/memoires/${project.slug}`}
              className="inline-flex items-center justify-between w-full text-[10px] md:text-sm font-bold text-white border-t border-white/20 pt-2 md:pt-3 hover:text-[#CEEC22] transition-colors"
            >
              Voir le détail
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          )}
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